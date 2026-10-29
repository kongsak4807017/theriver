#!/usr/bin/env node
// Authenticated, aggregate-only health registry synchronizer. Raw records stay in memory.
import {createSign} from 'node:crypto';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {aggregate,detectRounds,colName,validateNew} from './health_aggregate.mjs';
const ID=process.env.HEALTH_SPREADSHEET_ID||'1KfuiM0BtxZpAkti0Qy5cWZtfeo7DUfUO0-VKkeXpQl4';
const TAB=Number(process.env.HEALTH_TAB_ID||'1079757745');
const P={q:'data/health_identity_summary_public.json',h:'data/health_population_timeline_public.json',e:'data/environment_timeline_v2.json',g:'data/gistda/health_district_timeline_public.geojson',s:'data/gistda/health_district_summary.geojson'};
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const b64=x=>Buffer.from(typeof x==='string'?x:JSON.stringify(x)).toString('base64url');
async function googleToken(){
 const raw=process.env.HEALTH_GOOGLE_SERVICE_ACCOUNT_JSON;
 if(!raw)throw Error('SETUP_REQUIRED: service account credential not configured');
 let sa;try{sa=JSON.parse(raw)}catch{throw Error('Invalid service account JSON');}
 if(sa.type!=='service_account'||!sa.client_email||!sa.private_key)throw Error('Invalid service account type');
 const now=Math.floor(Date.now()/1000),endpoint='https://oauth2.googleapis.com/token';
 const data=b64({alg:'RS256',typ:'JWT'})+'.'+b64({iss:sa.client_email,scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:endpoint,iat:now,exp:now+1800});
 const signer=createSign('RSA-SHA256');signer.update(data);signer.end();
 const assertion=data+'.'+signer.sign(sa.private_key).toString('base64url');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});
 if(!response.ok)throw Error('Google OAuth HTTP '+response.status);
 const token=(await response.json()).access_token;if(!token)throw Error('Missing OAuth token');return token;
}
async function google(path,token){
 const response=await fetch('https://sheets.googleapis.com/v4/spreadsheets/'+ID+path,{headers:{Authorization:'Bearer '+token}});
 if(!response.ok)throw Error('Google Sheets API HTTP '+response.status);return response.json();
}
async function fetchRegistry(token){
 const metadata=await google('?fields=sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)))',token);
 const tab=metadata.sheets?.find(x=>x.properties?.sheetId===TAB)?.properties;
 if(!tab)throw Error('Expected tab ID not found');
 const prefix="'"+tab.title.replaceAll("'","''")+"'",end=colName(tab.gridProperties.columnCount-1);
 const h=await google('/values/'+encodeURIComponent(prefix+'!A2:'+end+'3')+'?valueRenderOption=FORMATTED_VALUE',token);
 const rounds=detectRounds(h.values?.[0]||[],h.values?.[1]||[]).sort((a,b)=>a.round-b.round);
 if(!rounds.every((r,i)=>r.round===i+1))throw Error('Round numbering changed');
 const columns=['F','N',...rounds.map(r=>r.column)];
 const qs=new URLSearchParams({valueRenderOption:'FORMATTED_VALUE'});
 for(const c of columns)qs.append('ranges',prefix+'!'+c+'4:'+c+tab.gridProperties.rowCount);
 const result=await google('/values:batchGet?'+qs.toString(),token);
 const n=tab.gridProperties.rowCount-3,values={};
 columns.forEach((c,i)=>{const grid=result.valueRanges?.[i]?.values||[];values[c]=Array.from({length:n},(_,j)=>String(grid[j]?.[0]??''));});
 return {rounds,values};
}
function updateGis(result){
 const h=read(P.h),e=read(P.e),g=read(P.g),s=read(P.s);
 const centers=new Map();
 for(const f of g.features)centers.set(f.properties.district,f.geometry.coordinates);
 for(const x of e.healthDistricts)centers.set(x.district,[x.lon,x.lat]);
 for(const x of h.baseline_districts)centers.set(x.district,[x.lon,x.lat]);
 for(const r of result.districtResults){
   const counts=r.byDistrict, total=Object.values(counts).reduce((a,b)=>a+b,0);
   if(!total)continue;
   if(r.round===1){
     for(const f of g.features.filter(f=>f.properties.cohort==='2025'))f.properties.urine_collected=counts[f.properties.district]||0;
     for(const x of h.baseline_districts)x.urine_collected=counts[x.district]||0;
   }else if(r.round===5){
     for(const f of g.features.filter(f=>f.properties.cohort==='2026'))f.properties.urine_collected=counts[f.properties.district]||0;
     for(const x of e.healthDistricts)x.urineCollected=counts[x.district]||0;
     for(const f of s.features)f.properties.urine_collected=counts[f.properties.district]||0;
     h.latest_totals.urine_collected=total;e.healthTotals.urineCollected=total;
   }else{
     g.features=g.features.filter(f=>f.properties.cohort!=='round-'+r.round);
     for(const [district,count] of Object.entries(counts)){
       const coords=centers.get(district);if(!coords)throw Error('District has no centroid; manual review required');
       g.features.push({type:'Feature',geometry:{type:'Point',coordinates:coords},properties:{
         record_id:'H-ROUND-'+r.round+'-'+district,layer:'health',cohort:'round-'+r.round,
         district,start_date:r.date,end_date:r.date,location_precision:'district_centroid',
         urine_collected:count>=5?count:null,urine_collected_label:count>=5?String(count):'1–4',
         screened:null,abnormal_label:'not assessed',abnormal_count:null,small_count_suppressed:count<5,
         assay:'Urine Total As',status:'SURVEILLANCE_ONLY',
         location_basis:'district_of_residence',count_unit:'result_events_not_unique_people',
         source:'health registry, district aggregates only'
       }});
     }
   }
 }
 g.metadata.total_features=g.features.length;
 g.metadata.residence_assignment='Patient district of residence; point is district centroid';
 h.registry_rounds=result.output.rounds.map(r=>({round:r.round,start:r.date,date:r.date,urine_result_rows:r.result_events,status:r.status}));
 h.registry_audit.total_registry_rows=result.output.registry_rows;
 const keys={1:'2025-07-total-as',2:'2025-10-09-total-as',3:'2025-10-29-total-as',4:'2026-03-06-total-as',5:'2026-07-total-as',6:'2026-10-total-as'};
 for(const r of result.output.rounds)if(keys[r.round])h.registry_audit.result_rows_by_round[keys[r.round]]=r.result_events??0;
 h.registry_audit.round_6_status=result.output.rounds.find(x=>x.round===6)?.status==='REPORTED'?'Results entered':'Not recorded; not zero tested';
 const files=[[P.h,h],[P.e,e],[P.g,g],[P.s,s]];
 for(const [path,data] of files)if(/"(?:patient_id|citizen_id|identity_hash|hn)"\s*:/i.test(JSON.stringify(data)))throw Error('Unsafe field in public file');
 return files;
}
async function main(){
 const token=await googleToken(),source=await fetchRegistry(token);
 const result=aggregate(source.values,source.rounds,new Date().toISOString().slice(0,10));
 const previous=existsSync(P.q)?read(P.q):null;
 validateNew(result.output,previous);
 if(previous){
   const a={...result.output},b={...previous};
   delete a.generated;delete b.generated;delete a.source_snapshot;delete b.source_snapshot;
   if(JSON.stringify(a)===JSON.stringify(b)){result.output.generated=previous.generated;result.output.source_snapshot=previous.source_snapshot;}
 }
 const outputs=[[P.q,result.output],...updateGis(result)];
 const changed=outputs.filter(([path,value])=>!existsSync(path)||JSON.stringify(read(path))!==JSON.stringify(value));
 for(const [path,value] of changed)writeFileSync(path,JSON.stringify(value,null,2)+'\n','utf8');
 console.log('HEALTH_SYNC_OK: '+result.output.registry_rows+' registry rows / '+result.output.rounds.length+' rounds / '+changed.length+' public aggregate files');
}
main().catch(e=>{console.error('HEALTH_SYNC_STOPPED: '+String(e.message||'validation error').replace(/\d{13}/g,'[REDACTED]'));process.exitCode=1;});
