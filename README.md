## Health GIS deployment — 29 October 2026: residence-based timeline and expanding cohorts

The health GIS now uses the **district of residence** (อำเภอตามภูมิลำเนา) for every urine-result pin, located at the **administrative district centroid**, never at a person's home or the collecting facility. Results come from the revised registry tab `แก้ไข28ตค69` dated 28 Oct 2026; no person-level information is published.

- **2025 round 1** (22–24 July): **322 test-result rows / 7 residence districts**. Residence counts: เมืองเชียงราย 135, เวียงชัย 5, เวียงเชียงรุ้ง 22, แม่จัน 29, ดอยหลวง 33, เชียงแสน 48, แม่สาย 50.
- **2025 follow-ups** (9 and 29 Oct): **7** and **2** test-result rows, respectively; **2026 Mar 6**: **31** test-result rows.
- **2026 round 5** (14–16 July): **549 test-result rows / 16 districts with urine results**; separate population-screening report covers **6,269 persons in 18 districts**. Corrected residence counts are เมืองเชียงราย **127** (previous 128) and เวียงชัย **3** (previous 2).
- **Round 6** (14 October 2026): columns exist but there are **no results entered** in the snapshot; **unknown, not zero tested**.
- The revised registry contains **641 rows**, and **236 rows** contain both 2025 baseline and July 2026 result fields. Because identity linkage is incomplete, *rows are not independently verified unique persons*, nor are 322+7+2+31+549 distinct patients.
- **Screened totals (2,056 in 2025 and 6,269 in 2026) remain provincial report figures**. Existing district screening splits reflect operational/service catchment areas and are NOT residence-based denominators; the public map therefore does not compute district positivity rates using those values.
- The map derives district histories from `data/gistda/health_district_timeline_public.geojson` and the expanding round list from `data/health_population_timeline_public.json`, so subsequent confirmed rounds can be appended without discarding prior rounds. Updating a Google Sheet alone does *not* automatically publish to GitHub Pages; a reviewed, privacy-safe snapshot and deployment are required.
- No name, HN, personal ID, exact household coordinate or case-level laboratory result is in public files. Exact small abnormal-result cells (1–4) remain suppressed. 2025 Total As and 2026 speciation are not directly comparable exposures.

---

# The River — GIS Timeline for Surface Water, Sediment, Food & Health

## Fish evidence update — 28 October 2026 (original PDF checked)

The public map now has **one category: ปลาและสัตว์น้ำ**. The station code CR is only internal reference metadata, not a second result type. The original Department of Medical Sciences regional center 1/1 presentation, *01 ผลการตรวจวิเคราะห์การปนเปื้อนโลหะหนัก.pdf*, pages 14–16, explicitly contains **15 individual fish results** from the sampling window **14–16 October 2025**. These were recovered, and the previous one-line regional summary was removed. The verified public data now contains **206 specimen-level records** (FY2568 63; FY2569 143), of which **200 carry coordinates** in fish GeoJSON. **Nine** of the fifteen first-round specimens have provisional coordinates borrowed by matching a location name to a CR reference station; **six** have no defensible point location and are not mapped. None of the fifteen first-round PDF rows prints a CR station code or original specimen GPS. Thus no exact GPS should be claimed even when the normalized database contains coordinates.

- [The original October 2025 report (see PDF pp.14–16)](https://drive.google.com/file/d/1XTzl8Ndwf_eEwG5xIiRtxNyBu8difKQs/view)
- [15-row traceable source transcription](./data/audits/fish_round1_15_source_transcription.json)
- [Updated 206 fish rows](./data/environment_timeline_v2.json)
- [Spatial provenance audit](./data/audits/fish_station_lineage_2026-10-28.json)


## Fisheries geospatial audit — 28 October 2026

The website now has **one map layer** named **ปลาและสัตว์น้ำ** rather than two overlapping fish-related map toggles. This is a display/UI merge; the **CR1–CR21 station master data** remains available in `data/gistda/river_stations.geojson` (legacy path; actually fish sampling station references, *not river water chemistry*).

- Original sample source 2025: [สรุปตรวจผักปลา 4 ครั้ง ปี68.xlsx](https://docs.google.com/spreadsheets/d/1mxZSktshxs6wd3RAZDijqZQBMdQ8oTLy/edit).
- Original 2026 records: reports [01](https://drive.google.com/file/d/1XTzl8Ndwf_eEwG5xIiRtxNyBu8difKQs/view), [02](https://drive.google.com/file/d/1lfkLm1ffuhXsq5g7sB_jy9QB3beisguP/view), [03](https://drive.google.com/file/d/1txScDYlheKx0dFmZ-0p7hrF__OJm1gna/view), [04](https://drive.google.com/file/d/18flb2JitDO1IABbZWPHe2x85m_14c32i/view), [05](https://drive.google.com/file/d/1ViITfUPA0_qyksOx-YYiAdaxZRjosoLE/view), [06](https://drive.google.com/file/d/1MPfxH4HL_SSpNDcFtUOt0kkk8i0NR24e/view), [07](https://drive.google.com/file/d/18OLP91HZHuLf1nRZa4Zl6OccIII8FWvH/view), [08](https://drive.google.com/file/d/1iEzSxnML-qwPmDc8GU9DR9XMHrzj8427/view), [09](https://drive.google.com/file/d/10zob-rNtaz3vKMtw3BMPfm76NBTa7t80/view), [10](https://drive.google.com/file/d/14nGBPSA_ZV8DEDSIQ6wxKEtR5xpIfw5w/view).
- `Dataprepsriver` (แหล่งข้อมูลภายใน; ไม่เผยแพร่ลิงก์ทะเบียนรายบุคคล), tabs 2 and 3, is a derived dataset, not an original laboratory report.
- **206 individual fish results are machine-readable:** FY2568 has 63 and FY2569 has 143. Fifteen originally collapsed results have been recovered from the original PDF.
- For **128 fish records assigned CR codes in the processed Google Sheet**, the stored lat/lon match the corresponding CR reference station **exactly**. These are **borrowed station reference coordinates**, not verified capture GPS. Source-document verification is incomplete: FY2569 round 2 PDF describes at least its first two fish locations verbally without printing a CR code, although the derived sheet assigns CR1 and CR3.
- The **63 FY2568 observations** and **one FY2569 summary** use regional centroid approximations; **36** uncoded approximate rows coincide numerically with CR reference coordinates. This is **not** evidence of sampling at the CR station.
- Collection/supply agencies listed in the original reports include provincial/district fisheries staff and primary-care stations; the program is coordinated by the Department of Medical Sciences regional center, PAO and partners. The round-one program report describes sending fish and produce samples to the Food Quality and Safety Bureau for analysis. It is **incorrect** to attribute all fish sampling and lab measurement to the Pollution Control Department.
- [Machine-readable provenance audit](./data/audits/fish_station_lineage_2026-10-28.json).


## Distinguishing PCD surface-water data from CR fish sampling points

**Two different observation programs, not duplicate PCD water measurements.** The public layer **"น้ำผิวดิน · กรมควบคุมมลพิษ"** contains 23 rounds of actual PCD river water analyses (KK/SA/RU/NK/FA/KO/LA codes; water As/Pb etc in mg/L and turbidity in NTU). The former generic **"น้ำผิวดิน"** layer is only the **CR1–CR21 station registry** from Dataprepsriver. Its `agency` column identifies **ประมงจังหวัดเชียงราย**, and the records refer to fish/aquatic-biota sampling; the rows do **not** supply station-round water chemistry. The latter is now renamed **"จุดเก็บตัวอย่างปลา"**, off by default, and is retained separately for traceability, not merged by geographic proximity.

Data-quality correction: 21 CR station rows in the source sheet have shifted `max_as_mg_l`, `status`, `notes`, `source_file` cells. A literal `PASS` was present under `max_as_mg_l` and the source filename under `notes`. The public GIS JSON normalizes these as **no water measurement / STATION_ONLY** and restores source attribution. Original Google Sheet remains unchanged.


## PCD Surface Water: Round 23 (26–30 September 2026) — added 28 October 2026

**[Open the live multi-layer GIS Timeline](https://kongsak4807017.github.io/theriver/)** · **[Original PCD PDF on Google Drive](https://drive.google.com/file/d/1va0Tmk_H3ebwGJVgEZi6soLDqhiFjswH/view)**

The surface-water layer is independent from drinking-water supplies, fisheries, crops, sediment, and human biomonitoring. It represents **23 PCD sampling rounds from March 2025 to September 2026**, with **29 historic station codes**, **21 stations with coordinates in Appendix C**, **528 station-round observations with at least one reported measurement**, and **410 georeferenced station-round features**. Nine laboratory/field fields are preserved: **As, Pb, Mn, Cd, Hg, Cu, Zn, Ni (mg/L)** and **turbidity (NTU)**.

### Round 23 verified findings

| Area | Arsenic As in surface water (mg/L) | Interpretation from the report |
|---|---|---|
| Sai River SA01 | 0.017 | Exceeds 0.010 mg/L |
| Sai River SA02 | 0.013 | Exceeds 0.010 mg/L |
| Sai River SA03 | 0.012 | Exceeds 0.010 mg/L |
| Kok, tributaries, Ruak, Mekong (18 other tested stations) | <0.010 at tested points | Below laboratory reporting threshold |

**Important:** There are **21 stations with arsenic results for round 23** (3 Sai exceed; 18 others <0.010). Another station may have other metal measurements but no reportable As result; the CSV retains it as a separate row with no As measurement. Sampling date is a *window*, not the exact date of each station. A result of `<0.010` is *censored* and is not the numeric value 0. No patient urine measurement may be used as a river water test.

### GIS files for GISTDA / QGIS

- [Public 23-round station history JSON](./data/pcd_surface_water_23_rounds.json) — all 528 observations, raw laboratory strings and quality metadata
- [PCD water station-and-round GeoJSON (EPSG:4326)](./data/gistda/pcd_surface_water_timeseries.geojson) — 410 geocoded station-round features
- [PCD surface-water 23-rounds CSV](./data/gistda/pcd_surface_water_23_rounds.csv) — 528 rows, UTF-8 with BOM
- [September 2026 round-23-only CSV](./data/gistda/pcd_surface_water_latest_2026-09.csv) — includes 22 stations with at least one result; 21 stations have arsenic results

### Report extraction QA / provenance

The report states data *as of 15 Oct 2026, 08:30*. The final appendix C coordinates have an earlier **27 Aug 2026** timestamp in some pages; verify any physical relocation before treating older samples as identical sites. **KK01** moved in May 2026 and **KK12/KK13** were modified in February 2026; the GIS suppresses plotting the current coordinate for earlier incompatible KK01/KK12 rounds. The Mekong turbidity tables (19–20) are mislabeled as arsenic in their headings, but the reported NTU values were mapped as turbidity based on the narrative and Annex B. Five param/station historical series have incomplete table-cell counts and are retained as missing/uncertain rather than being shifted between sampling rounds. Historic surface water results are not, on their own, statements of drinking water safety or causal health effects.

---

> **The River GIS V2 — Environmental & Health Timeline (26 Oct 2026).** เว็บไซต์หน้าแรก `index.html` ขยายจากแผนที่ตะกอนดินเดิมเป็น 7 ประเภทหมุด/6 กลุ่มข้อมูล: ตะกอนดิน, สถานีน้ำผิวดิน CR1–CR21, สถานีน้ำประปา/น้ำโรงเรียน, ปลา, พืชผัก, ข้าว และตัวชี้วัดสุขภาพระดับอำเภอ ปรับเวลาและเปิดประวัติย้อนหลังได้ แผนที่ใช้ Leaflet/OpenStreetMap และ Esri imagery, **ไม่ได้อ้างว่าใช้ GISTDA tile API อย่างเป็นทางการ** แต่ส่งออก GeoJSON WGS84 พร้อมฟิลด์ Timeline เพื่อใช้ใน GISTDA/QGIS ได้

**เว็บแผนที่เชิงเวลา (GIS Timeline) สำหรับผลตรวจโลหะหนักในตะกอนดินแม่น้ำกก ลำน้ำสาขา แม่น้ำสาย แม่น้ำรวก และแม่น้ำโขง (ภาคเหนือ)**

[Open the GIS Dashboard](./index.html) · [Named HTML dashboard](./gis_timeline_sediment_2025_2026.html) · [Full CSV](./data/sediment_13_rounds.csv) · [GeoJSON](./data/sediment_13_rounds.geojson)

> **ข้อมูลจากรายงานกรมควบคุมมลพิษ ครั้งที่ 13** (เก็บตัวอย่าง 8–11 กันยายน 2569; ข้อมูล ณ 15 ตุลาคม 2569 เวลา 16.30 น.) แสดงผลตรวจ **ตะกอนดิน** ไม่ใช่คุณภาพน้ำดื่มหรือผลตรวจในคน

## Health Surveillance Timeline — ฉบับทวนสอบ 26 ตุลาคม 2569

เพิ่มข้อมูล **สรุปการตรวจสารหนูในปัสสาวะประชาชน** จากแท็บ `6_ทวนสอบ_ทะเบียนคน_68_72` ใน Google Sheet `Dataprepsriver` (แหล่งข้อมูลภายใน; ไม่เผยแพร่ลิงก์ทะเบียนรายบุคคล) โดยเก็บเฉพาะข้อมูลระดับอำเภอที่เผยแพร่ได้

- `data/health_population_timeline_public.json` — ผลทวนสอบยอด 7 อำเภอและกิจกรรมตรวจสุขภาพ/ติดตาม 2568–2569 รวม 7 ระยะ โดยไม่แสดงผลรายบุคคล
- `data/gistda/health_district_timeline_public.geojson` — GeoJSON ใช้งาน GIS ได้ 25 ระเบียนระดับอำเภอ (7 อำเภอ ปี 2568; 18 อำเภอ ปี 2569) โดยใช้พิกัด **ศูนย์กลางอำเภอ** ไม่ใช่บ้านผู้รับการตรวจ
- เว็บหลัก `index.html` แสดงหมุดสุขภาพย้อนหลังปี 2568 ก่อนเปลี่ยนเป็นข้อมูลปี 2569 เมื่อเลื่อน Timeline ถึงรอบเฝ้าระวังใหม่
- **2568:** คัดกรอง 2,056 คน ตรวจปัสสาวะ Total As 322 คน (7 อำเภอ); สูงกว่าเกณฑ์คัดกรอง 7 คน ส่งตรวจแยกชนิดแล้วพบเกินเกณฑ์ 1 คน *ไม่เปิดเผยผลหรือเส้นทางการติดตามรายบุคคล*
- **2569:** คัดกรอง 6,269 คน ตรวจปัสสาวะ 549 คน (18 อำเภอ); เกินค่าอ้างอิง 31 คนใน 9 อำเภอ (5.65% ของผู้ตรวจปัสสาวะ), ปกติ 518 คน
- ยอดการตรวจรอบแรกปี 2568 ของ **เมืองเชียงราย/เวียงชัย** เทียบกันได้ดังนี้: ทะเบียน = **130/7** ราย, รายงาน 24 ก.พ. 2569 = **132/5** ราย, รายงาน 21 ต.ค. 2569 = **135/2** ราย โดยแต่ละแหล่งรวมได้ **137 ราย** สำหรับ 2 อำเภอ และรวม **322 ราย** ทุกอำเภอ แผนที่ใช้จำนวนจาก *ทะเบียน* ไม่คัดลอกความผิดพลาดของการจัดกลุ่มในสไลด์
- รายงานค่าปัสสาวะ **130.64 µg/L** (รอบแรก) และ **56.3 µg/L** (รอบติดตาม) เกี่ยวข้องกับผลตรวจคน จึง **ไม่ใช้เป็นผลตรวจน้ำแม่น้ำ** จนกว่าจะมีหลักฐานน้ำจากห้องปฏิบัติการที่แยกยืนยัน
- **อย่าเปรียบเทียบ 7/322 กับ 31/549 เป็นแนวโน้มเดียวกัน** เพราะ Total As, As Speciation และผลตรวจตามแนวทางปี 2569 ใช้เป้าหมายการตรวจ เกณฑ์ และหน่วยวัดที่แตกต่างกัน รวมทั้งการคัดเลือกกลุ่มเสี่ยงไม่ใช่การสุ่มประชากรทั่วไป
- รอบตรวจครั้งที่ 5 ของทะเบียน 351 แถวยังขาดผลระดับรายบุคคลจำนวนมาก (รวมทั้งผลเฝ้าระวัง 549 ราย) จึงไม่มีการสร้างข้อมูลติดตามผู้ป่วยรายคนขึ้นใหม่ในระบบสาธารณะ
- **Privacy:** ไม่อัปโหลดทะเบียนรายบุคคล HN, รหัส Lab, อายุ/เพศคู่ผลแล็บ หรือพิกัดบ้าน และปกปิดจำนวนผลเกินค่าอ้างอิงระดับอำเภอที่อยู่ในช่วง 1–4 คน

ข้อมูลรายงานต้นทาง: *24 กพ 69.pdf*, *21 ตค 69 (1).pdf*; บันทึกทวนสอบใน Google Sheet `Dataprepsriver`. ข้อมูลนี้เป็นการเฝ้าระวัง ไม่ใช่หลักฐานพิสูจน์สาเหตุการสัมผัสสารหนูจากแหล่งน้ำ และไม่ควรใช้คำนวณความชุกประชากรโดยตรง

## แผนที่และ Timeline

- เลื่อนเวลาได้ **13 รอบ** ตั้งแต่มีนาคม 2568 ถึงกันยายน 2569
- เลือก **9 โลหะหนัก**: As, Cd, Mn, Ni, Pb, Zn, Cu, Hg, Cr
- ดูแผนที่ Leaflet/OpenStreetMap, เลือกสถานี, เปรียบเทียบกราฟย้อนหลัง, กรองแม่น้ำและระดับการตรวจ
- ชุดข้อมูล CSV **3,276 แถว** (28 สถานีในประวัติ × 13 รอบ × 9 โลหะหนัก); GeoJSON **260 features** (20 สถานีที่มีพิกัดใช้แสดงได้ × 13 รอบ)
- HTML เก็บข้อมูลไว้ในไฟล์เดียว เปิดใน browser ได้โดยไม่ต้องมี backend; การโหลดแผนที่ฐานและฟอนต์ต้องเชื่อมต่ออินเทอร์เน็ต

## Repository

| Path | Purpose |
| --- | --- |
| `index.html` | หน้าแรกของเว็บไซต์ GitHub Pages |
| `gis_timeline_sediment_2025_2026.html` | หน้าแผนที่ชื่อเดิมตามที่ร้องขอ |
| `data/sediment_13_rounds.csv` | ข้อมูลผลตรวจแบบ long table สำหรับ Excel, Python, Power BI |
| `data/sediment_13_rounds.geojson` | จุดตรวจพร้อมค่าผลตรวจรายรอบ ใช้ใน QGIS/ArcGIS |
| `data/stations.csv` | ข้อมูลทะเบียนสถานี 28 จุดและสถานะการยืนยันพิกัด |
| `source/report_text_extracted.txt` | ข้อความที่สกัดจาก PDF อ้างอิง (ไม่ใช่ PDF ต้นฉบับ) |

## เผยแพร่เว็บไซต์ผ่าน GitHub Pages

เว็บไซต์เผยแพร่สำเร็จด้วย **GitHub Pages (Deploy from branch `main`)** โดย GitHub Pages ทำ Build และ Deploy สำเร็จเมื่อ 25 ตุลาคม 2569 ตรวจสอบได้จาก [successful deployment run](https://github.com/kongsak4807017/theriver/actions/runs/40169603750)

- [เปิดเว็บแผนที่ GIS Timeline](https://kongsak4807017.github.io/theriver/)
- [เปิด HTML ชื่อเต็ม](https://kongsak4807017.github.io/theriver/gis_timeline_sediment_2025_2026.html)
- การแก้ไขไฟล์บน `main` จะทำให้ GitHub Pages สร้างเว็บไซต์จาก branch นี้โดยอัตโนมัติ
- หากหน้าเว็บไม่อัปเดต ให้ตรวจสอบสถานะที่ [Actions](https://github.com/kongsak4807017/theriver/actions)

### ทวนสอบทะเบียนสุขภาพฉบับแก้ไข 28 ตุลาคม 2569

แหล่งใหม่: ทะเบียนตรวจคัดกรองสุขภาพประชาชน(สารหนู) ปี 2568–2572 แท็บ `แก้ไข28ตค69` (ทะเบียนภายในที่มีข้อมูลสุขภาพรายบุคคล; **ไม่เผยแพร่ URL หรือแถวข้อมูลดิบ**)

- พบ **641 แถวทะเบียน** เทียบกับชีตเดิม 351 แถว โดยมีค่าผล Total As รอบแรก 322 แถว และรอบกรกฎาคม 2569 จำนวน 549 แถว ซึ่งตรงกับยอดรวมเดิม
- มี **236 แถวที่กรอกผลทั้งรอบแรกและรอบกรกฎาคม 2569** แต่ยัง **ไม่รับรองว่าเป็นคนเดิม 236 คน** เนื่องจากไม่มีเลขประจำตัวประชาชน 372 แถวและพบกลุ่มชื่อ–อายุ–เพศที่อาจซ้ำกัน 6 กลุ่ม ต้องตรวจด้วยระบบปิด
- รอบกรกฎาคม 2569 มีค่า Speciation กรอก 31 แถว; จำนวนแถวที่กรอกผลไม่ใช่การยืนยันค่าเกินเกณฑ์โดยอัตโนมัติ ต้องยึดผลสรุปทางห้องปฏิบัติการ
- รอบ 6 วันที่ **14 ต.ค. 2569** มีหัวคอลัมน์ แต่ยัง **ไม่กรอกผลตรวจ** ณ snapshot 28 ต.ค. 2569
- ยอดเดือนกรกฎาคม 2569 รวม **549** ตรงกัน แต่ระดับอำเภอต่างกัน 1 ราย: เมืองเชียงราย **128 (แผนที่เดิม) / 127 (ทะเบียนตามภูมิลำเนา)** และเวียงชัย **2 / 3** จึงยังไม่แก้ตัวเลขหมุดจนกว่าจะยืนยันมิติทางภูมิศาสตร์ที่ใช้
- บันทึกเฉพาะข้อมูลรวมและผลตรวจสอบโครงสร้างใน `data/health_population_timeline_public.json` ชุดปรับปรุงนี้ไม่นำชื่อ เลขบัตรประชาชน HN ที่อยู่ หรือผลตรวจรายคนออกสู่ GitHub Pages

## Environmental & Health GIS v2 (Google Sheet Dataprepsriver)

แหล่งข้อมูลเพิ่มเติม: `Dataprepsriver` (แหล่งข้อมูลภายใน; ไม่เผยแพร่ลิงก์ทะเบียนรายบุคคล) ในโฟลเดอร์ Google Drive `theriver`. ชุดข้อมูลเผยแพร่เป็น **ข้อมูลสาธารณะที่คัดกรองแล้ว**; แท็บ `6_ทวนสอบ_ทะเบียนคน_68_72` ใช้ตรวจสอบเท่านั้น **ไม่ส่งข้อมูลรายกรณีขึ้น GitHub** และไม่ดึงทะเบียนบุคคลเต็มเข้าระบบสาธารณะ

- `index.html` — เว็บรวมทุกโดเมนพร้อม Timeline, toggle layers, สัญลักษณ์เฉพาะน้ำประปา/ปลา/ผัก/ข้าว/คน, switching OpenStreetMap / Esri Satellite, รายละเอียดสถานีและกราฟประวัติ
- `gis_timeline_sediment_2025_2026.html` — เว็บตะกอนดินฉบับก่อนยังใช้งานได้เหมือนเดิม
- `data/environment_timeline_v2.json` — ชุดข้อมูลเว็บ: **95** สถานีน้ำ (รวม 21 สถานี CR), **355** ผลตรวจน้ำประปาระบุค่า Pb/As แยกรอบ, **192** ระเบียนปลา, **230** ระเบียนพืชและข้าว, **18** สรุประดับอำเภอ และ **22** เหตุการณ์สรุป
- `data/gistda/river_stations.geojson` — 21 สถานี CR พร้อมวันที่และประเภทหมุด; **ไม่ใช่ผลตรวจคุณภาพน้ำ**
- `data/gistda/water_supply_timeseries.geojson` — 366 features (355 ผลตรวจน้ำประปาแยกรอบ + 11 สถานีน้ำโรงเรียน)
- `data/gistda/fish_timeseries.geojson` — 192 features (ตัวอย่างปลา/สัตว์น้ำ)
- `data/gistda/crops_timeseries.geojson` — 230 features (221 ผักผลไม้ + 9 ข้าว)
- `data/gistda/health_district_summary.geojson` — 18 features (**ศูนย์กลางอำเภอ**, ข้อมูลจำนวนเกินเกณฑ์ในช่วง 1–4 รายถูกปกปิด)
- `data/sediment_13_rounds.geojson` — 260 features ตะกอนดิน (20 สถานี × 13 รอบ) และต้องตีความพิกัดประวัติ KK01 เป็นพิเศษ

**วิธีนำเข้า GIS/GISTDA:** ใช้ไฟล์ GeoJSON ของแต่ละหมวด โดยอ่าน `geometry.coordinates` ตาม WGS84/EPSG:4326, `properties.start_date` และ `properties.end_date` เป็น Timeline, `properties.icon_type` เป็นชนิดสัญลักษณ์, `properties.status` เป็นสถานะ และ `properties.coord_status` ตรวจสอบความละเอียดพิกัด ไม่ใช้สี/สถานะข้ามหมวดเป็นความเสี่ยงสุขภาพที่เทียบกันได้ทันที สำหรับตะกอนดิน ช่วงเวลาคือ `representative_date` และ `sampling_window` ในไฟล์เก่า

### Validation/quality flags ก่อนใช้ประกอบการตัดสินใจ

1. **RIV-AS-01/02 ถูกตัดออกจากชั้นข้อมูลน้ำ** ค่า 130.64 และ 56.3 µg/L ซ้ำกับข้อมูลตรวจปัสสาวะและการติดตามของบุคคล ต้องตรวจสอบเอกสารผลตรวจน้ำต้นทางก่อนจัดเป็นค่าของแม่น้ำ
2. **น้ำประปา 355 ผลตรวจที่มีค่า Pb/As ให้แสดงรายรอบ** ไม่เท่ากับจำนวนตัวอย่างน้ำประปาที่รายงานรวม 359 ตัวอย่าง; จำนวนสองแบบใช้หน่วยนับ/ความครบถ้วนต่างกัน ห้ามถือว่าตรงกันโดยอัตโนมัติ
3. **ช่วงวันที่น้ำประปาเป็นช่วงตรวจระดับรอบจาก Timeline ไม่ใช่วันเก็บของสถานีแต่ละแห่ง**
4. **พิกัดบางจุดเป็น centroid ของตำบล/อำเภอ และบางพิกัดแปลงจาก UTM**; มีฟิลด์ `coord_status`. แผนที่ใช้ขอบวงเส้นประเมื่อเป็น centroid
5. **KK01 ย้ายจุดเก็บตั้งแต่พฤษภาคม 2569**; แผนที่รวมจะไม่ปักค่าของ KK01 ก่อนการย้ายที่พิกัดจุดใหม่ แต่ยังคงข้อมูลเก่าในประวัติ
6. **ข้อมูลคนเป็นภาพรวม 18 อำเภอ ไม่ใช่จุดตรวจคนรายบุคคล** จึงไม่มี HN, รหัส Lab, ประวัติการติดตามคนรายเดียว, ที่อยู่หรือพิกัดบ้าน ไม่มีการนำแท็บที่ 6 ขึ้นสาธารณะ
7. **ระดับข้อมูลสุขภาพกับสิ่งแวดล้อมมีประชากรฐานต่างกัน** เช่น ยอดคัดกรองอำเภอกับยอดตรวจปัสสาวะ ไม่ควรใช้หารเป็นความชุกอัตโนมัติ; การพบผลเกินค่าอ้างอิงไม่ยืนยันแหล่งสัมผัสหรือความสัมพันธ์เชิงเหตุผล
8. **ผลปลา/ผักเป็นจำนวนระเบียน ไม่ใช่จำนวนชิ้นตัวอย่าง** (192 ระเบียนปลา/206 ตัวอย่าง; 230 ระเบียนพืช/248 ตัวอย่าง) และใช้มาตรฐานเฉพาะอาหาร/ชนิดพืชต่างกัน
9. **Status ของอาหารคงตาม Sheet**: มีผัก 4 ระเบียน `EXCEED_STANDARD` และ 2 `WATCHLIST_BORDERLINE`; ค่า Cd = 0.050 mg/kg ที่เพดาน 0.05 ไม่ใช่ค่าเกิน
10. ไม่อ้างว่ามี GISTDA API, แผนที่ดาวเทียมแหล่ง GISTDA หรือการรับรองจากหน่วยงานที่ยังไม่ตรวจสอบ

## Data dictionary

- `station`: รหัสสถานีตามรายงาน; เปรียบเทียบภายในสถานีเดิมในแต่ละรอบ
- `round`: ลำดับรอบที่ 1–13; `sampling_window`: ช่วงเก็บตัวอย่างจากรายงาน
- `date_representative`: วันตัวแทนรอบเพื่อแสดงบน timeline **ไม่ใช่วันที่เก็บตัวอย่างจริงของแต่ละสถานี**
- `metal`: สัญลักษณ์ธาตุ; `value_raw`: ค่าตามเอกสาร
- `value_mg_per_kg`: ค่าเชิงตัวเลข เมื่อมีค่าตรวจวัดชัดเจน; หน่วย **mg/kg ของตะกอนดินแห้ง**
- `status`: การจัดกลุ่มตามเกณฑ์ในแผนที่; **ไม่ใช่**ระดับความเสี่ยงสุขภาพรายบุคคล
- `lat`, `lon`: พิกัด WGS84 เมื่อเชื่อถือได้; ถ้าว่างแปลว่าไม่มีพิกัดยืนยัน
- `geostatus`, `qc_note`: สถานะตรวจสอบพิกัดและข้อควรระวัง

## QA / ข้อจำกัดสำคัญ

1. **KK01 เปลี่ยนตำแหน่งเก็บตัวอย่างตั้งแต่พฤษภาคม 2569** ตามรายงาน จึงไม่ควรเชื่อมค่าทุกปีว่าเป็นพิกัดเดียวกัน
2. **KK13 ย้ายไป KK12 ตั้งแต่กุมภาพันธ์ 2569** อ้างตามข้อสังเกตของรายงาน; อย่ารวมรหัสสถานีอัตโนมัติโดยไม่มีหลักฐานการจับคู่เชิงพื้นที่
3. **NK04** มีพิกัดในรายงานซ้ำกับ NK03 แม้ชื่อสถานีอยู่คนละอำเภอ จึง **ไม่ปักหมุด NK04** จนกว่าจะยืนยันพิกัด
4. รหัสเก่าบางจุดไม่มีพิกัดภาคผนวก จึงแสดงผลตรวจย้อนหลังได้แต่ไม่ปักลงแผนที่
5. ค่าที่เขียน `<5`, `<0.10` คือ **ต่ำกว่าขีดรายงาน (censored)** ไม่ใช่ค่า 0; `ND` = ไม่ตรวจพบ; `-` = ไม่มีข้อมูล
6. **สารหนู:** คำอธิบายเกณฑ์ในรายงานบางหน้าใช้ `>33` mg/kg แต่ตารางและไฟล์ dashboard เดิมใช้ `≥33` mg/kg เป็นระดับรุนแรง ต้องยืนยันการตีความเกณฑ์ก่อนเผยแพร่ข้อความทางการ โดยเฉพาะค่าเท่ากับ 33
7. ข้อมูลในรายงานเป็นการตรวจ **ตะกอนดิน** ไม่สามารถสรุปความปลอดภัยในการใช้น้ำ การบริโภคปลา หรือผลกระทบต่อสุขภาพได้โดยตรง
8. `source/report_text_extracted.txt` เป็นข้อความสำหรับค้นหาและตรวจสอบย้อนกลับ **ไม่ได้แทนที่ PDF ต้นฉบับ** ซึ่งยังไม่ได้จัดเก็บใน repo

## Source and credits

**กรมควบคุมมลพิษ**, *สถานการณ์คุณภาพตะกอนดินในแม่น้ำกกและลำน้ำสาขา แม่น้ำสาย แม่น้ำรวก แม่น้ำโขง (ภาคเหนือ), ครั้งที่ 13 (8–11 กันยายน 2569)*, ข้อมูล ณ วันที่ 15 ตุลาคม 2569 เวลา 16.30 น. ตารางผลตรวจโลหะหนักและพิกัดอยู่ในภาคผนวกของรายงาน

Web mapping: Leaflet + OpenStreetMap tiles. Data processing and display are independently prepared from the cited source. This repository is **not an official government GIS service**.

**ก่อนนำแผนที่ไปใช้ตัดสินใจระดับนโยบาย** ควรทำ QA พิกัดและยืนยันการอ่านค่ากับ PDF ต้นฉบับ รวมถึงเกณฑ์ที่ใช้ประเมินโลหะหนักแต่ละชนิด
