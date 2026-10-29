# การเปิดระบบ Health GIS Auto Sync — The River
ปรับปรุง: 29 ตุลาคม 2569

## สถานะ
หน้าเว็บ GitHub Pages เปิดแสดง Dashboard ตัวชี้วัดและประวัติผลตรวจทุกรอบจากไฟล์สรุปที่ไม่ระบุตัวบุคคลแล้ว ส่วนระบบอ่าน Google Sheets อัตโนมัติได้ติดตั้ง Workflow และโปรแกรมประมวลผลใน Repository แต่ **ยังไม่เปิดการเชื่อมต่อจริง** หากยังไม่ได้กำหนด GitHub Secrets สองรายการด้านล่าง

## เปิดใช้การอัปเดตอัตโนมัติ (ตั้งค่าโดยผู้ดูแลระบบ)
1. ใน Google Cloud Project ของหน่วยงาน เปิดใช้งาน **Google Sheets API** และสร้าง **Service Account** เฉพาะงานนี้ โดยใช้สิทธิ์อ่านอย่างเดียว ไม่ต้องมี Editor permission
2. เปิด Google Sheet ต้นทางที่เป็นข้อมูลสุขภาพรายบุคคล แล้วแชร์เป็น **Viewer** ให้กับอีเมล Service Account เท่านั้น ไม่ต้องเปลี่ยนเป็นสาธารณะ โปรดทบทวนสิทธิ์ **Anyone with the link** ของไฟล์นี้ให้เหมาะสมกับข้อมูลสุขภาพ
3. ใน GitHub Repository เลือก **Settings → Secrets and variables → Actions → New repository secret** สร้าง **HEALTH_GOOGLE_SERVICE_ACCOUNT_JSON** เป็นเนื้อหา JSON ของ Service Account (ไม่ส่ง JSON หรือ Private Key ในแชต ไม่เก็บใน GitHub source)
4. สร้าง GitHub fine-grained personal access token จำกัดสิทธิ์เฉพาะ Repository `kongsak4807017/theriver` และ **Contents: Read and write** แล้วตั้ง Secret ชื่อ **HEALTH_PUBLISH_TOKEN** เพื่อให้ commit อัตโนมัติกระตุ้น GitHub Pages build ได้ (การ push ด้วย `GITHUB_TOKEN` มักไม่กระตุ้น workflow ต่อเนื่อง)
5. เปิดแท็บ **Actions → Health GIS secure aggregate sync → Run workflow** เพื่อทดลองทำงาน 1 รอบ ดูผล `node --test`, `verify_gis` และ GitHub Pages deployment
6. ระบบมี `schedule` ทุกวันเวลา **08:20 น. ประเทศไทย** เมื่อมีข้อมูลเปลี่ยนแปลงจะอัปเดตผลสรุปใน `main` เท่านั้น หากไม่มีการเปลี่ยนแปลงจะไม่ commit

## คำจำกัดความที่ Dashboard ใช้
- **Result events** = ผลตรวจในหนึ่งรอบ; คนหนึ่งคนอาจมีมากกว่าหนึ่งรอบ
- **First observed registry rows** = จำนวนแถวที่มีผลตรวจครั้งแรกในทะเบียน ไม่เท่ากับคนที่ตรวจใหม่จริง
- **Repeat test events** = การตรวจครั้งหลังในแถวทะเบียนเดิม ไม่เท่ากับจำนวนผู้ติดตามไม่ซ้ำ
- **ID-linked subset** = การเชื่อมโดยเลขประจำตัว 13 หลักที่ผ่าน checksum เท่านั้น; ยังไม่ยืนยันตัวบุคคลกับทะเบียนราษฎร และไม่ครอบคลุมทุกแถว
- **Unique Persons / Newly Screened Persons / Follow-up Persons** จะคงสถานะ **ยังยืนยันทั้งหมดไม่ได้** จนกว่าจะมี Master Patient Index (MPI) ที่ได้รับอนุญาตและรหัสคนที่ครบถ้วน ไม่มีการเดาจากชื่อ/อายุ/เพศหรือใช้ HN ล้วน ๆ ข้ามหน่วยบริการ

## ความปลอดภัยและข้อจำกัด
- ประมวลผลข้อมูลรายบุคคลภายในความจำของ GitHub Actions runner แบบชั่วคราว **ไม่อัปโหลดต้นฉบับหรือ hash รหัสประชาชนขึ้นเว็บไซต์** แต่การดึงข้อมูลสุขภาพเข้ามาที่ GitHub-hosted runner เป็นการประมวลผลบนโครงสร้างพื้นฐานภายนอกของหน่วยงาน **ต้องให้เจ้าของข้อมูลและเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลอนุมัติก่อนเปิด Secret**
- หากหน่วยงานไม่อนุญาตให้ประมวลผลบน GitHub-hosted runner ให้รันสคริปต์บนเครื่องหรือ self-hosted runner ภายใต้เครือข่ายที่หน่วยงานกำกับ แล้วส่งขึ้น GitHub **เฉพาะผลสรุปที่ผ่านเกณฑ์การเปิดเผย**
- ห้ามคำนวณอัตรารายอำเภอจากผลตรวจปัสสาวะตามภูมิลำเนาหารด้วยยอดคัดกรองตามพื้นที่ปฏิบัติงาน เพราะเป็นคนละฐานข้อมูล
- หมุดเป็นจุดศูนย์กลางอำเภอ ไม่ใช่ที่อยู่บ้าน/จุดเก็บสิ่งส่งตรวจ; ผลตรวจที่มีจำนวนขนาดเล็ก 1–4 ต่ออำเภอในรอบใหม่จะปิดจำนวนแน่นอน
- ไม่มี Credential = Workflow จบขั้นทดสอบเท่านั้น **ไม่ใช่การอัปเดตข้อมูลอัตโนมัติสำเร็จ**

## ทดสอบย้อนหลัง
- `node --test tests/health_aggregate.test.mjs`
- `node scripts/verify_gis.mjs`
- ตรวจประวัติการทำงานใน `Actions` ว่ามีขั้น `Read restricted sheet and update public aggregates` และ `Commit ONLY published aggregates` สำเร็จจริง ก่อนประกาศว่า Auto Sync เปิดใช้งาน

