// Privacy-safe aggregate functions. Source rows and IDs never leave process memory.
const normal=v=>String(v??"").trim();
const months={"ม.ค.":1,"ก.พ.":2,"มี.ค.":3,"เม.ย.":4,"พ.ค.":5,"มิ.ย.":6,"ก.ค.":7,"ส.ค.":8,"ก.ย.":9,"ต.ค.":10,"พ.ย.":11,"ธ.ค.":12};
const known={1:"2025-07-22",2:"2025-10-09",3:"2025-10-29",4:"2026-03-06",5:"2026-07-14",6:"2026-10-14"};
export function colName(i){let x="";for(i++;i>0;i=Math.floor((i-1)/26))x=String.fromCharCode(65+(i-1)%26)+x;return x;}
export function goodId(raw){const v=normal(raw).replace(/[\s-]/g,"");if(!/^\d{13}$/.test(v)||/^(\d)\1+$/.test(v))return null;let s=0;for(let i=0;i<12;i++)s+=(13-i)*Number(v[i]);return Number(v[12])===(11-s%11)%10?v:null;}
function isoDate(head,round){const m=head.match(/(\d{1,2})(?:\s*[-–]\s*\d{1,2})?\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*(\d{2,4})/u);
if(m){let y=Number(m[3]);if(y<100)y+=2500;if(y>=2400)y-=543;const mo=months[m[2]],day=Number(m[1]);if(y>=2020&&y<=2040&&day>=1&&day<=31)return y+"-"+String(mo).padStart(2,"0")+"-"+String(day).padStart(2,"0");}
if(known[round])return known[round];throw Error("New round date is missing; publication stopped");}
export function detectRounds(labels,headings){const groups=[];for(let i=0;i<labels.length;i++){const m=normal(labels[i]).match(/ครั้งที่\s*(\d+)/u);if(m)groups.push({round:Number(m[1]),start:i,title:normal(labels[i])});}
if(groups.length<6||new Set(groups.map(x=>x.round)).size!==groups.length)throw Error("Expected distinct monitoring rounds");groups.sort((a,b)=>a.start-b.start);
return groups.map((g,k)=>{const end=groups[k+1]?.start??headings.length;let indexes=[];for(let j=g.start;j<end;j++)if(/Total\s*As/i.test(normal(headings[j])))indexes.push(j);
if(indexes.length!==1)throw Error("Ambiguous Total As column for round "+g.round);return {round:g.round,date:isoDate(g.title,g.round),column:colName(indexes[0])};});}
const hasResult=v=>{const s=normal(v);return !!s&&!/^(?:รอผล|ยังไม่มีผล|pending|n\/a|na|ไม่ตรวจ|รอตรวจ|ไม่ทราบ|-)$/i.test(s);};
const safeDistricts=new Set(["เมืองเชียงราย","เวียงชัย","เวียงเชียงรุ้ง","แม่จัน","ดอยหลวง","เชียงแสน","แม่สาย","เทิง","เชียงของ","แม่สรวย","พญาเม็งราย","เวียงป่าเป้า","พาน","แม่ลาว","เวียงแก่น","แม่ฟ้าหลวง","ขุนตาล","ป่าแดด"]);
export function aggregate(columns,rounds,stamp){let n=Math.max(...Object.values(columns).map(x=>x.length));const rows=[];
for(let i=0;i<n;i++){const result=rounds.map(r=>hasResult(columns[r.column]?.[i]));const district=normal(columns.N?.[i]).replace(/^อำเภอ/,"").trim();const raw=normal(columns.F?.[i]);if(!result.some(Boolean)&&!district&&!raw)continue;
if(result.some(Boolean)&&!safeDistricts.has(district))throw Error("Residence district invalid; publication halted");
rows.push({id:goodId(raw),district,result});}
const validIds=new Set(rows.map(r=>r.id).filter(Boolean)),previousIds=new Set(),roundSummaries=[],districtResults=[];
for(let j=0;j<rounds.length;j++){const seen=new Set(),byDistrict={},r=rounds[j];let total=0,newRows=0,linkedRepeats=0,linkedFirst=0,unmatched=0;
for(const row of rows){if(!row.result[j])continue;total++;byDistrict[row.district]=(byDistrict[row.district]??0)+1;
if(!row.result.slice(0,j).some(Boolean))newRows++;
if(!row.id)unmatched++;else if(previousIds.has(row.id)||seen.has(row.id))linkedRepeats++;else {linkedFirst++;seen.add(row.id);}}
for(const row of rows)if(row.result[j]&&row.id)previousIds.add(row.id);
const reported=total>0;roundSummaries.push({round:r.round,date:r.date,result_events:reported?total:null,first_observed_rows:reported?newRows:null,repeat_events_in_same_row:reported?total-newRows:null,linked_repeat_events:reported?linkedRepeats:null,linked_first_events:reported?linkedFirst:null,unlinked_result_events:reported?unmatched:null,status:reported?"REPORTED":"PENDING_NO_RESULT"});
districtResults.push({round:r.round,date:r.date,byDistrict});}
const output={schema:"theriver/health-identity-aggregate-v1",generated:stamp,source_snapshot:stamp,unit:"laboratory_results_not_unique_people",registry_rows:rows.length,identity_coverage:{valid_national_id_checksum_rows:rows.filter(x=>x.id).length,missing_or_invalid_national_id_rows:rows.filter(x=>!x.id).length,distinct_identifiers_with_valid_checksum:validIds.size,interpretation:"Checksum only, not verified against civil registration"},kpis:{unique_persons:{value:null,verified_subset:validIds.size,status:"PARTIAL_LINKAGE"},newly_screened:{value:null,status:"NOT_ESTABLISHED"},followup_persons:{value:null,status:"NOT_ESTABLISHED"}},rounds:roundSummaries,warning:"First observed rows are not newly screened unique people. Repeat observations are not distinct follow-up persons."};
if(/"(?:citizen_id|cid|hn|patient_id|name|identity_hash)"\s*:|\b\d{13}\b/i.test(JSON.stringify(output)))throw Error("Sensitive output detected");
return {output,districtResults};}
export function validateNew(next,previous){if(!next.rounds.find(x=>x.round===1&&x.result_events)||!next.rounds.find(x=>x.round===5&&x.result_events))throw Error("Baseline missing");for(const old of previous?.rounds??[]){const now=next.rounds.find(x=>x.round===old.round);if(old.result_events&&!now?.result_events)throw Error("A published round was removed");if(old.result_events&&now.result_events<old.result_events*.9)throw Error("Unusual fall in prior counts");}if(next.registry_rows<next.rounds[0].result_events)throw Error("Registry inconsistent");}
