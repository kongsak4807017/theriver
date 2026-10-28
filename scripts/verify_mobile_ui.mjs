import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const base=process.env.TEST_BASE_URL || "http://127.0.0.1:8765/";
fs.mkdirSync("artifacts",{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
let errors=[];
async function test(viewport,kind){
 const page=await browser.newPage({viewport,isMobile:kind==="mobile",hasTouch:kind==="mobile"});
 page.on("pageerror",e=>errors.push(kind+" JS: "+e.message));
 try{
   await page.goto(base,{waitUntil:"domcontentloaded",timeout:45000});
   await page.waitForFunction(()=>window.__theriverMap && document.querySelector("#loading.hidden"),null,{timeout:45000});
   const label=await page.locator('[data-layer="fish"]').locator("xpath=..").innerText();
   assert.match(label,/ปลาและสัตว์น้ำ/);
   assert.doesNotMatch(label,/รวมสถานี CR/);
   assert.match(label,/206 ผลตรวจ/);
   assert.equal(await page.locator('[data-layer="river"]').count(),0,"No redundant fish station layer");
   const on=await page.locator("#n-fish").innerText();
   assert.ok(Number(on)>0,"Fish markers should be present at latest date");
   const snapshot=await page.evaluate(()=>({
      width:document.documentElement.scrollWidth,
      innerWidth:innerWidth,
      leaflets:document.querySelectorAll(".leaflet-marker-icon").length,
      counter:document.getElementById("mapCounts").textContent,
      timelineValue:document.getElementById("dateSlider").value,
      timelineMax:document.getElementById("dateSlider").max,
      errors:document.getElementById("loading").textContent
   }));
   assert.ok(snapshot.leaflets>0,"Map pins render");
   if(kind==="mobile")assert.ok(snapshot.width<=snapshot.innerWidth+3,"Unwanted horizontal overflow: "+JSON.stringify(snapshot));
   // Simulate clicking a fish result marker in Leaflet. Check popup/detail event handler.
   const found=await page.evaluate(()=>{let result=false;window.__theriverMap.eachLayer(l=>{if(result||!l.eachLayer)return;l.eachLayer(m=>{if(result||!m.options?.icon?.options?.html)return;const h=m.options.icon.options.html;if(h.includes('M3 12c5-7')){m.fire("click");result=true;}})});return result});
   assert.ok(found,"Fish marker should support click");
   await page.waitForFunction(()=>document.querySelector("#details").innerText.includes("สถานีอ้างอิง")||document.querySelector("#details").innerText.includes("ผลตรวจ"),null,{timeout:7000});
   await page.locator('[data-layer="fish"]').uncheck();
   await page.waitForTimeout(350);

   await page.locator('[data-layer="fish"]').check();
   // Verify timeline navigates and resolves to latest again
   await page.locator("#latest").click();
   assert.equal(await page.locator("#dateSlider").inputValue(),snapshot.timelineMax);
   await page.screenshot({path:"artifacts/"+kind+"-gis.png",fullPage:true});
   process.stdout.write("PASS "+kind+" "+JSON.stringify(snapshot)+"\n");
 }finally{await page.close();}
}
try{await test({width:390,height:844},"mobile");await test({width:1440,height:900},"desktop");assert.deepEqual(errors,[],"Browser JavaScript runtime errors");}
finally{await browser.close();}