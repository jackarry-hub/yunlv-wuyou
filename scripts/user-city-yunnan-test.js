const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "云旅无忧UI界面参考图", "用户端", "云旅无忧用户端代码实现", "app.js"), "utf8");

const expectedYunnanCities = [
  "昆明市",
  "曲靖市",
  "玉溪市",
  "保山市",
  "昭通市",
  "丽江市",
  "普洱市",
  "临沧市",
  "楚雄彝族自治州",
  "红河哈尼族彝族自治州",
  "文山壮族苗族自治州",
  "西双版纳傣族自治州",
  "大理白族自治州",
  "德宏傣族景颇族自治州",
  "怒江傈僳族自治州",
  "迪庆藏族自治州",
];

assert(appSource.includes("const YUNNAN_PREFECTURE_CITIES = ["), "选择城市页必须使用云南 16 个地级行政区数据源");
for (const city of expectedYunnanCities) {
  assert(appSource.includes(`name: "${city}"`), `选择城市页缺少云南地级行政区：${city}`);
}

assert(!appSource.includes("NATIONAL_CITY_GROUPS"), "选择城市页不得保留全国城市组数据源");
assert(!appSource.includes("全国城市可选"), "选择城市页不得出现全国城市可选文案");
assert(!appSource.includes('"浙江省"'), "选择城市页不得保留浙江等省外城市分组");
assert(!appSource.includes('name: "湖州市"'), "选择城市页不得保留省外城市作为可选项");
assert(!appSource.includes("云南热门旅居城市"), "选择城市页不得保留热门旅居城市模块");
assert(/保山:\s*"B"/.test(appSource), "A-Z 索引必须将保山映射到 B");
assert(/云南省地级行政区/.test(appSource), "城市列表标题必须明确限定云南省地级行政区");
assert(appSource.includes('new AMapRef.Geocoder({ city: "全国" })'), "真实定位不得限制在云南省内");
assert(/async function handleCityRelocate[\s\S]*requestCurrentLocation\(true\)/.test(appSource), "重新定位必须继续使用真实定位流程");

console.log("user city yunnan contract ok");
