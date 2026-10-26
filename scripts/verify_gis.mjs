import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const load=(path)=>JSON.parse(readFileSync(path,"utf8"));
const data=load("data/environment_timeline_v2.json");
const sediment=load("data/sediment_13_rounds.geojson");
const html=readFileSync("index.html","utf8");
const layers=["river_stations","water_supply_timeseries","fish_timeseries","crops_timeseries","health_district_summary"];
let total=0;
for(const layer of layers){
  const fc=load("data/gistda/"+layer+".geojson");
  assert.equal(fc.type,"FeatureCollection");
  for(const f of fc.features){
    assert.equal(f.geometry.type,"Point");
    const [lon,lat]=f.geometry.coordinates;
    assert.ok(lon>=96&&lon<=105&&lat>=15&&lat<=24,layer+" coordinate bounds");
    assert.match(f.properties.start_date,/^\d{4}-\d{2}-\d{2}$/);
    assert.match(f.properties.end_date,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(f.properties.icon_type);
  }
  console.log("PASS",layer,fc.features.length);
  total+=fc.features.length;
}
assert.equal(data.waterStations.length,95);
assert.equal(data.tapReadings.length,355);
assert.equal(data.fish.length,192);
assert.equal(data.crops.length,230);
assert.equal(data.healthDistricts.length,18);
assert.equal(sediment.features.length,260);
assert.ok(data.meta.excludedUnverifiedWater.includes("RIV-AS-01"));
assert.ok(data.meta.excludedUnverifiedWater.includes("RIV-AS-02"));
assert.ok(data.waterStations.every(r=>!["RIV-AS-01","RIV-AS-02"].includes(r.id)));
assert.equal(data.healthDistricts.reduce((a,b)=>a+b.screened,0),6269);
assert.equal(data.healthDistricts.reduce((a,b)=>a+b.urineCollected,0),549);
assert.equal(data.healthTotals.urineExceed,31);
for(const d of data.healthDistricts){
  assert.ok(d.exceedPublicCount===null||d.exceedPublicCount>=5);
}
assert.doesNotMatch(JSON.stringify(data),/\bCRI\d{3,}\b/,"Public dataset must not expose individual lab codes");
assert.doesNotMatch(JSON.stringify(data.events),/\[withheld\]/,"Do not publish case level event narratives");
assert.ok(html.includes('id="dateSlider"')&&html.includes('data-layer="health"'));
assert.ok(html.includes("environment_timeline_v2.json")&&html.includes("sediment_13_rounds.geojson"));
const code=html.match(/<script>\n([\s\S]*?)\n<\/script>/);
assert.ok(code,"Client script must be present");
new Function(code[1]);
console.log("PASS HTML script syntax, layer controls, privacy, date fields, WGS84 and data counts");
console.log("Total new geospatial features:",total);
