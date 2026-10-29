import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregate,detectRounds,goodId,colName,validateNew} from '../scripts/health_aggregate.mjs';
function id(base){let n=0;for(let i=0;i<12;i++)n+=(13-i)*Number(base[i]);return base+(11-n%11)%10;}
test('round auto-discovery, 2027 expansion, and safe checksum',()=>{
 assert.equal(colName(26),'AA');
 const a=Array(48).fill(''),b=Array(48).fill('');
 [14,19,23,27,31,36,41].forEach((n,i)=>a[n]='ครั้งที่ '+(i+1)+(i===6?' 12 พ.ย. 2570':''));
 [16,20,24,28,33,37,42].forEach(n=>b[n]='ผลตรวจ Total As');
 const rounds=detectRounds(a,b);
 assert.equal(rounds.length,7);assert.equal(rounds[6].date,'2027-11-12');
 assert.equal(rounds[6].column,'AQ');
 assert.equal(goodId(id('123456789012')),id('123456789012'));
 assert.equal(goodId('1111111111111'),null);
});
test('new vs repeat observations never become unique-person totals',()=>{
 const key=id('123456789012');
 const rounds=[{round:1,date:'2025-07-22',column:'Q'},{round:2,date:'2025-10-09',column:'U'},{round:3,date:'2025-10-29',column:'Y'},{round:4,date:'2026-03-06',column:'AC'},{round:5,date:'2026-07-14',column:'AH'},{round:6,date:'2026-10-14',column:'AL'}];
 const columns={F:[key,'',''],N:['เชียงแสน','เชียงแสน','เมืองเชียงราย'],Q:['1','2',''],U:['3','',''],Y:['','',''],AC:['','',''],AH:['4','','5'],AL:['','','']};
 const {output,districtResults}=aggregate(columns,rounds,'2026-10-29');
 assert.equal(output.registry_rows,3);
 assert.equal(output.rounds[0].result_events,2);
 assert.equal(output.rounds[4].result_events,2);
 assert.equal(output.rounds[4].first_observed_rows,1);
 assert.equal(output.rounds[4].repeat_events_in_same_row,1);
 assert.equal(output.rounds[4].linked_repeat_events,1);
 assert.equal(output.rounds[5].status,'PENDING_NO_RESULT');
 assert.equal(output.kpis.unique_persons.value,null);
 assert.equal(output.kpis.newly_screened.value,null);
 assert.equal(output.kpis.followup_persons.value,null);
 assert.deepEqual(districtResults[4].byDistrict,{'เชียงแสน':1,'เมืองเชียงราย':1});
 assert.doesNotMatch(JSON.stringify(output),new RegExp(key));
});
test('prevents accidental historic disappearance',()=>{
 const previous={rounds:[{round:1,result_events:322},{round:5,result_events:549}]};
 const current={registry_rows:641,rounds:[{round:1,result_events:30},{round:5,result_events:549}]};
 assert.throws(()=>validateNew(current,previous));
});
