# Design QA — 用户端“我的旅居计划”城市标签

- Source visual truth: `/var/folders/c1/n4yvk2cn1vz0t0yr9_2bdbmm0000gn/T/codex-clipboard-f26013ba-18f1-487f-adb9-0958591df597.png`
- Implementation screenshot: `/Users/chm/Desktop/云旅无忧/artifacts/design-qa/profile-plan-city-label-after.png`
- Focused implementation crop: `/Users/chm/Desktop/云旅无忧/artifacts/design-qa/profile-plan-city-label-focus-after.png`
- Side-by-side evidence: `/Users/chm/Desktop/云旅无忧/artifacts/design-qa/profile-plan-city-label-comparison.png` (left: reported crop; right: fixed result)
- Viewport: 390 × 844
- State: 用户端 `#profile`，首条“昆明翠湖康养公寓”旅居计划

**Findings**

- No actionable P0/P1/P2 findings remain. The source shows the left side of “云南 · 昆明” clipped by a centered `object-fit: cover` crop; the implementation now anchors the image crop to the left and displays the full label.
- Fonts and typography: the original raster label typography is preserved and fully readable.
- Spacing and layout rhythm: card dimensions, radius, grid spacing, and surrounding content are unchanged.
- Colors and visual tokens: the original green label and photo colors are unchanged.
- Image quality and asset fidelity: the existing `destination-city.jpg` asset is retained without stretching or replacement.
- Copy and content: “云南 · 昆明” is fully visible; profile data and interactions are unchanged.

**Patches Made**

- Added `object-position: left center` to `.screen-profile .ref-plan-card img` so the city label stays inside the visible crop at mobile widths.

**Implementation Checklist**

- [x] Preserve existing image and card structure.
- [x] Show the complete city label at 390px mobile width.
- [x] Verify the focused crop against the supplied screenshot.

**Follow-up Polish**

- None required for this scoped fix.

final result: passed
