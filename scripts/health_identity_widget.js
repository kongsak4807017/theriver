(async function () {
  const host = document.getElementById('healthIdentitySummary');
  if (!host) return;
  try {
    const response = await fetch('data/health_identity_summary_public.json', {cache: 'no-store'});
    if (!response.ok) throw new Error('Unable to load summary');
    const data = await response.json();
    if (data.schema !== 'theriver/health-identity-aggregate-v1') throw new Error('Incompatible summary');
    let selectedDate = window.__theriverSelectedDate || '9999-12-31';
    const renderRounds = () => {
    const rows = data.rounds.filter(r => r.date <= selectedDate).map(r =>
      '<tr><td>' + r.round + '</td><td>' + r.date + '</td><td>' +
      (r.result_events === null ? 'รอผล' : r.result_events.toLocaleString('th-TH')) +
      '</td><td>' + (r.first_observed_rows === null ? '—' : r.first_observed_rows) +
      '</td><td>' + (r.repeat_events_in_same_row === null ? '—' : r.repeat_events_in_same_row) +
      '</td></tr>'
    ).join('');
    host.innerHTML = '<div class="notice"><b>การนับรายบุคคลยังไม่สมบูรณ์</b><br>' +
      'Unique Persons: รอยืนยันครบ · Newly Screened: รอยืนยันครบ · Follow-up Persons: รอยืนยันครบ' +
      '<br>รหัสประจำตัวผ่าน checksum (เฉพาะส่วนที่มีข้อมูล): ' +
      data.identity_coverage.distinct_identifiers_with_valid_checksum +
      ' รหัส ไม่ใช่ยอดประชาชนทั้งหมด</div>' +
      '<table><thead><tr><th>รอบ</th><th>เริ่ม</th><th>ผลตรวจ</th><th>แถวแรก</th><th>ตรวจซ้ำ</th></tr></thead><tbody>' +
      rows + '</tbody></table><p class="small">ตัวเลขแถวแรกและตรวจซ้ำเป็นจำนวนรายการในทะเบียน ' +
      'ไม่ใช่จำนวนคนใหม่หรือผู้ติดตามไม่ซ้ำ · ข้อมูล ณ ' + data.source_snapshot + '</p>';
    };
    renderRounds();
    window.addEventListener('theriver:datechange', event => {
      selectedDate = event.detail?.date || selectedDate;
      renderRounds();
    });
  } catch (error) {
    host.textContent = 'ไม่สามารถโหลดข้อมูลสรุปการเชื่อมโยงตัวบุคคลได้';
  }
})();
