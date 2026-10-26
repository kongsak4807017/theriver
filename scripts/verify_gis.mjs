import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const load=(path)=>JSON.parse(readFileSync(path,"utf8"));
const data=load("data/environment_timeline_v2.json");
const sediment=load("data/sediment_13_rounds.geojson");
const health=load("data/health_population_timeline_public.json");
const healthGeo=load("data/gistda/health_district_timeline_public.geojson");
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
assert.equal(health.baseline_districts.length,7);
assert.equal(health.baseline_districts.reduce((s,r)=>s+r.urine_collected,0),322);
assert.equal(health.baseline_districts.reduce((s,r)=>s+r.screened,0),2056);
assert.equal(health.baseline_districts.reduce((s,r)=>s+r.slide_feb_2026,0),322);
assert.equal(health.baseline_districts.reduce((s,r)=>s+r.slide_oct_2026,0),322);
assert.equal(health.latest_totals.urine_collected,549);
assert.equal(health.latest_totals.urine_over_reference,31);
assert.equal(healthGeo.features.length,25);
assert.equal(healthGeo.features.filter(f=>f.properties.cohort==="2025").length,7);
assert.equal(healthGeo.features.filter(f=>f.properties.cohort==="2026").length,18);
for(const feature of healthGeo.features){const [lon,lat]=feature.geometry.coordinates;assert.ok(lon>=96&&lon<=105&&lat>=15&&lat<=24);assert.match(feature.properties.start_date,/^\d{4}-\d{2}-\d{2}$/);if(feature.properties.cohort==="2026")assert.ok(feature.properties.abnormal_count===null||feature.properties.abnormal_count>=5);}
for(const x of [JSON.stringify(health),JSON.stringify(healthGeo)])assert.doesNotMatch(x,/\bCRI\d{3,}\b|เลขกระปุก|เลข HN|\bHN\b/, "Public health files must not include individual identifiers");
for(const d of data.healthDistricts){
  assert.ok(d.exceedPublicCount===null||d.exceedPublicCount>=5);
}
assert.doesNotMatch(JSON.stringify(data),/\bCRI\d{3,}\b/,"Public dataset must not expose individual lab codes");
assert.doesNotMatch(JSON.stringify(data.events),/\[withheld\]/,"Do not publish case level event narratives");
assert.ok(html.includes('id="dateSlider"')&&html.includes('data-layer="health"'));
assert.ok(html.includes("environment_timeline_v2.json")&&html.includes("sediment_13_rounds.geojson"));
assert.ok(html.includes("health_population_timeline_public.json")&&html.includes("H.baseline_districts")&&html.includes("H.followup_phases"));
assert.ok(html.includes('id="healthTimeline"'));
const code=html.match(/<script>\n([\s\S]*?)\n<\/script>/);
assert.ok(code,"Client script must be present");
new Function(code[1]);
console.log("PASS HTML script syntax, health phase controls, reconciled district aggregation, privacy, date fields, WGS84 and data counts");
console.log("Total new geospatial features:",total);
