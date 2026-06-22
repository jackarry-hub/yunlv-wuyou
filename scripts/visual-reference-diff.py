#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import math
import os
from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance, ImageStat


ROOT = Path(__file__).resolve().parents[1]
SOURCE_REPORT = ROOT / "artifacts" / "visual-audit" / "latest" / "report.json"
OUT_DIR = ROOT / "artifacts" / "visual-diff" / "latest"
DIFF_DIR = OUT_DIR / "diffs"


def safe_name(value: str) -> str:
    return "".join(ch if ch.isalnum() or ch in "._-" else "-" for ch in value)


def dynamic_masks(record: dict, width: int, height: int) -> list[dict]:
    masks = []
    if record.get("appKey") == "user" and record.get("id") == "activity-map":
        masks.append(
            {
                "label": "真实高德地图底图与地图点位为动态外部服务区域，像素排序时排除",
                "box": (0, math.floor(height * 0.17), width, math.floor(height * 0.75)),
            }
        )
    return masks


def apply_masks(diff: Image.Image, masks: list[dict]) -> Image.Image:
    if not masks:
        return diff
    masked = diff.copy()
    for mask in masks:
        x1, y1, x2, y2 = mask["box"]
        masked.paste((0, 0, 0), (x1, y1, x2, y2))
    return masked


def image_metrics(reference: Image.Image, current: Image.Image, record: dict) -> tuple[float, float, float, float, float, float, list[dict], Image.Image]:
    ref = reference.convert("RGB")
    cur = current.convert("RGB").resize(ref.size)
    diff = ImageChops.difference(ref, cur)
    masks = dynamic_masks(record, ref.width, ref.height)
    sortable_diff = apply_masks(diff, masks)
    stat = ImageStat.Stat(diff)
    mae = sum(stat.mean) / 3
    gray = diff.convert("L")
    hist = gray.histogram()
    total = ref.size[0] * ref.size[1]
    changed = sum(hist[26:]) / total if total else 0
    content_diff = diff
    sortable_content_diff = sortable_diff
    if record.get("appKey") != "admin":
      status_cut = min(max(64, math.floor(ref.height * 0.045)), 92)
      content_diff = diff.crop((0, status_cut, ref.width, ref.height))
      sortable_content_diff = sortable_diff.crop((0, status_cut, ref.width, ref.height))
    content_stat = ImageStat.Stat(content_diff)
    content_mae = sum(content_stat.mean) / 3
    content_gray = content_diff.convert("L")
    content_hist = content_gray.histogram()
    content_total = content_diff.size[0] * content_diff.size[1]
    content_changed = sum(content_hist[26:]) / content_total if content_total else 0
    sortable_stat = ImageStat.Stat(sortable_content_diff)
    sortable_mae = sum(sortable_stat.mean) / 3
    sortable_gray = sortable_content_diff.convert("L")
    sortable_hist = sortable_gray.histogram()
    sortable_total = sortable_content_diff.size[0] * sortable_content_diff.size[1]
    sortable_changed = sum(sortable_hist[26:]) / sortable_total if sortable_total else 0
    enhanced = ImageEnhance.Contrast(diff).enhance(2.4)
    return mae, changed, content_mae, content_changed, sortable_mae, sortable_changed, masks, enhanced


def make_triptych(reference: Image.Image, current: Image.Image, diff: Image.Image) -> Image.Image:
    ref = reference.convert("RGB")
    cur = current.convert("RGB").resize(ref.size)
    gap = 24
    label_height = 44
    width = ref.width * 3 + gap * 2
    height = ref.height + label_height
    canvas = Image.new("RGB", (width, height), "white")
    canvas.paste(ref, (0, label_height))
    canvas.paste(cur, (ref.width + gap, label_height))
    canvas.paste(diff.resize(ref.size), (ref.width * 2 + gap * 2, label_height))
    return canvas


def rel(path: Path) -> str:
    return os.path.relpath(path, OUT_DIR).replace(os.sep, "/")


def main() -> int:
    if not SOURCE_REPORT.exists():
        raise SystemExit(f"missing {SOURCE_REPORT}")
    data = json.loads(SOURCE_REPORT.read_text(encoding="utf-8"))
    DIFF_DIR.mkdir(parents=True, exist_ok=True)
    records = []
    for record in data.get("records", []):
        ref_rel = record.get("reference")
        shot_rel = record.get("screenshot")
        if not ref_rel or not shot_rel:
            continue
        ref_path = ROOT / ref_rel
        shot_path = ROOT / shot_rel
        if not ref_path.exists() or not shot_path.exists():
            continue
        reference = Image.open(ref_path)
        current = Image.open(shot_path)
        mae, changed, content_mae, content_changed, sortable_mae, sortable_changed, masks, diff = image_metrics(reference, current, record)
        name = f"{record['appKey']}-{record['no']}-{safe_name(record['id'])}.png"
        out_path = DIFF_DIR / name
        make_triptych(reference, current, diff).save(out_path)
        records.append(
            {
                "app": record["app"],
                "appKey": record["appKey"],
                "no": record["no"],
                "id": record["id"],
                "title": record["title"],
                "mae": mae,
                "changedRatio": changed,
                "contentMae": content_mae,
                "contentChangedRatio": content_changed,
                "sortableContentMae": sortable_mae,
                "sortableContentChangedRatio": sortable_changed,
                "dynamicMasks": [
                    {
                        "label": mask["label"],
                        "box": mask["box"],
                    }
                    for mask in masks
                ],
                "referenceSize": reference.size,
                "currentSize": current.size,
                "diff": str(out_path.relative_to(ROOT)),
            }
        )

    records.sort(key=lambda item: (item["sortableContentMae"], item["sortableContentChangedRatio"]), reverse=True)
    summary = {
      "source": str(SOURCE_REPORT.relative_to(ROOT)),
      "total": len(records),
      "records": records,
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "report.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    rows = []
    for item in records:
        rows.append(
            f"""
            <article class="card">
              <header>
                <strong>{html.escape(item['app'])} {item['no']} {html.escape(item['title'])}</strong>
                <span>sortable MAE {item['sortableContentMae']:.1f} · sortable changed {item['sortableContentChangedRatio'] * 100:.1f}% · content MAE {item['contentMae']:.1f} · raw MAE {item['mae']:.1f} · ref {item['referenceSize'][0]}x{item['referenceSize'][1]} · now {item['currentSize'][0]}x{item['currentSize'][1]}</span>
              </header>
              {'<p class="mask-note">' + html.escape('；'.join(mask['label'] for mask in item['dynamicMasks'])) + '</p>' if item.get('dynamicMasks') else ''}
              <img src="{html.escape(rel(ROOT / item['diff']))}" alt="{html.escape(item['title'])}">
            </article>
            """
        )
    html_doc = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>云旅无忧参考图像素差异报告</title>
  <style>
    body {{ margin:0; font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif; background:#eef3f8; color:#172033; }}
    .top {{ position:sticky; top:0; z-index:2; padding:18px 24px; background:rgba(255,255,255,.95); border-bottom:1px solid #dbe5f0; }}
    h1 {{ margin:0 0 6px; font-size:22px; }}
    p {{ margin:0; color:#607086; }}
    main {{ display:grid; gap:18px; padding:18px; }}
    .card {{ background:white; border:1px solid #dbe5f0; border-radius:14px; padding:14px; box-shadow:0 12px 34px rgba(34,61,99,.08); }}
    header {{ display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:12px; }}
    header span {{ color:#607086; font-size:13px; }}
    .mask-note {{ margin:0 0 10px; color:#8a5a00; font-size:13px; }}
    img {{ display:block; width:100%; height:auto; border-radius:10px; border:1px solid #edf1f6; }}
  </style>
</head>
<body>
  <section class="top">
    <h1>云旅无忧参考图像素差异报告</h1>
    <p>每组图片依次为：参考图、当前实现、增强差异图。移动端排序排除顶部动态状态栏；真实地图等外部动态区域保留原始 MAE，但不参与排序。</p>
  </section>
  <main>{''.join(rows)}</main>
</body>
</html>
"""
    (OUT_DIR / "report.html").write_text(html_doc, encoding="utf-8")
    print(f"visual diff report ok: {OUT_DIR / 'report.html'}")
    print(f"records: {len(records)}")
    for item in records[:20]:
        print(f"{item['sortableContentMae']:.1f}\t{item['sortableContentChangedRatio']*100:.1f}%\t{item['appKey']}\t{item['no']}\t{item['title']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
