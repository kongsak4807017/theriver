#!/usr/bin/env node
// Validate the public village-only disclosure contract before publishing GitHub Pages.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const village=read('data/health_village_public.json');
const health=read('data/health_population_timeline_public.json');
assert.equal(village.schema,'theriver/health-village-public-v1');
assert.equal(village.count_unit,'urine_result_events_not_verified_unique_persons');
assert.equal(village.map_location_precision,'district_centroid_only_until_village_coordinates_validated');
assert.equal(village.privacy.minimum_village_result_events_per_round,10);
assert.equal(village.privacy.minimum_published_abnormal_and_complementary_cells,5);
assert.equal(village.privacy.individual_data,false);
assert.equal(village.privacy.household_coordinates,false);
assert.equal(village.privacy.exact_case_values,false);
assert.equal(village.reference.analyte,'Urine Total As');
assert.equal(village.reference.unit,'µg/L');
assert.equal(village.reference.operator,'>');
assert.equal(village.reference.threshold,100);
const all=JSON.stringify(village);
if(/"(?:name|citizen_id|cid|hn|patient_id|identity_hash|lat|lon|coordinates|age|sex)"\s*:/i.test(all)||
  /\b\d{13}\b/.test(all)) throw Error('Sensitive data detected in public village dataset');
const knownRounds=new Map((health.registry_rounds||[]).map(x=>[x.round,x.urine_result_rows]));
const villageRounds=new Map(village.province_rounds.map(x=>[x.round,x]));
assert.equal(villageRounds.size,village.province_rounds.length,'rounds must be unique');
for(const [round,total] of knownRounds){
  const current=villageRounds.get(round);
  assert.ok(current,'missing round '+round);
  if(total!==null)assert.equal(current.result_events,total,'province count mismatch for '+round);
}
const seen=new Set();
let n=0;
for(const [district,entries] of Object.entries(village.districts)){
  assert.ok(district.length>0&&Array.isArray(entries));
  for(const item of entries){
    assert.match(item.village_no,/^\d{1,2}$/);
    assert.ok(item.subdistrict);
    for(const r of item.rounds){
      n++;
      const k=[district,item.subdistrict,item.village_no,r.round].join('/');
      assert.ok(!seen.has(k),'duplicated village-round');
      seen.add(k);
      assert.ok(r.result_events>=10);
      assert.equal(r.reference_operator,'>');
      assert.equal(r.reference_value,100);
      assert.ok(Array.isArray(r.over_reference_bands));
      if(r.over_reference_count===null){
        assert.equal(r.disclosure_status,'SMALL_CELL_SUPPRESSED');
        assert.equal(r.over_reference_bands.length,0);
      }else{
        assert.equal(r.disclosure_status,'PUBLISHED');
        assert.ok(r.over_reference_count>=5);
        assert.ok(r.result_events-r.over_reference_count>=5);
        assert.ok(r.over_reference_bands.length>0);
        assert.ok(r.over_reference_bands.every(v=>['>100–150 µg/L','>150–200 µg/L','>200–300 µg/L','>300 µg/L'].includes(v)));
      }
    }
  }
}
assert.ok(n>0,'No eligible village summaries; publication must be reviewed');
console.log('VILLAGE_PRIVACY_OK: '+n+' publishable village-rounds / '+Object.keys(village.districts).length+' districts');
