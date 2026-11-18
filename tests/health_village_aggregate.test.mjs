import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregateVillagePublic,parseTotalAs,VILLAGE_MIN_EVENTS} from '../scripts/health_village_aggregate.mjs';

const rounds=[
  {round:1,date:'2025-07-22',column:'Q'},
  {round:5,date:'2026-07-14',column:'AH'},
  {round:6,date:'2026-10-14',column:'AL'}
];
function sampleRows(specs){
  const c={L:[],M:[],N:[],Q:[],AH:[],AL:[]};
  for(const x of specs) for(let i=0;i<x.n;i++){
    c.L.push(x.village??'1'); c.M.push(x.sub??'เวียง');c.N.push(x.district??'เชียงแสน');
    c.Q.push(x.old ? (i<x.old ? '110' : '') : '');
    c.AH.push(i<(x.above??0) ? '*125.1' : (i<(x.undetected??0)+(x.above??0)?'ตรวจไม่พบ':'33.1'));
    c.AL.push('');
  }
  return c;
}
test('Total As parsing is robust against marked values and non-detects',()=>{
  assert.equal(parseTotalAs('*101.7').above,true);
  assert.equal(parseTotalAs('100').boundary,true);
  assert.equal(parseTotalAs('100').above,false);
  assert.equal(parseTotalAs('ตรวจไม่พบ').above,false);
  assert.equal(parseTotalAs('รอผล'),null);
  assert.equal(parseTotalAs('< 5').above,false);
  assert.throws(()=>parseTotalAs('abc'));
  assert.throws(()=>parseTotalAs('< 120'));
});
test('publishes only village groups with >=10 results and 5+ abnormal/complement',()=>{
  const c=sampleRows([
    {n:10,village:'1',above:5,old:5},
    {n:11,village:'2',above:2},
    {n:9,village:'3',above:6},
    {n:3,village:'',above:1}
  ]);
  const out=aggregateVillagePublic(c,rounds,'2026-11-18');
  assert.equal(out.province_rounds.find(x=>x.round===5).result_events,33);
  assert.equal(out.province_rounds.find(x=>x.round===5).above_reference,14);
  assert.equal(out.province_rounds.find(x=>x.round===5).without_village,3);
  assert.equal(out.districts.เชียงแสน.length,2);
  const a=out.districts.เชียงแสน.find(x=>x.village_no==='1').rounds[0];
  assert.equal(a.over_reference_count,5);
  assert.ok(a.over_reference_bands.includes('>100–150 µg/L'));
  const b=out.districts.เชียงแสน.find(x=>x.village_no==='2').rounds[0];
  assert.equal(b.over_reference_count,null);
  assert.equal(b.over_reference_bands.length,0);
  assert.equal(out.districts.เชียงแสน.some(x=>x.village_no==='3'),false);
  assert.equal(out.province_rounds.find(x=>x.round===6).result_events,0);
  assert.equal(out.privacy.minimum_village_result_events_per_round,VILLAGE_MIN_EVENTS);
  assert.doesNotMatch(JSON.stringify(out),/citizen_id|patient_id|"name"\s*:|coordinates|เลขประจำตัว/u);
});
test('never publishes small earlier round merely because later round qualified',()=>{
  const c=sampleRows([{n:14,village:'5',above:0,old:3}]);
  const out=aggregateVillagePublic(c,rounds,'2026-11-18');
  assert.equal(out.districts.เชียงแสน[0].rounds.length,1);
  assert.equal(out.districts.เชียงแสน[0].rounds[0].round,5);
});
test('strict invalid district halts release',()=>{
  assert.throws(()=>aggregateVillagePublic(
    sampleRows([{n:11,district:'อำเภอไม่มีจริง',above:5}]),rounds,'2026-11-18'),
    /Unrecognized residence district/
  );
});
