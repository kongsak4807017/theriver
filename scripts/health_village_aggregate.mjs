// Public-only village aggregation for urine Total As surveillance.
// No citizen IDs, names, row indices, ages, household coordinates or individual results enter output.
export const VILLAGE_MIN_EVENTS = 10;
export const SUBGROUP_MIN_EVENTS = 5;
export const TOTAL_AS_REFERENCE = Object.freeze({
  analyte: 'Urine Total As',
  operator: '>',
  threshold: 100,
  unit: 'µg/L',
  label: 'สูงกว่าเกณฑ์คัดกรอง >100 µg/L (ไม่ใช่การวินิจฉัยโรค)',
  source: 'DDC arsenic surveillance screening / existing The River 2025-2026 reporting'
});
const districts = new Set([
  'เมืองเชียงราย','เวียงชัย','เวียงเชียงรุ้ง','แม่จัน','ดอยหลวง','เชียงแสน',
  'แม่สาย','เทิง','เชียงของ','แม่สรวย','พญาเม็งราย','เวียงป่าเป้า',
  'พาน','แม่ลาว','เวียงแก่น','แม่ฟ้าหลวง','ขุนตาล','ป่าแดด'
]);
const trim = value => String(value ?? '').trim();
function normalizeDistrict(value) {
  return trim(value).replace(/^อำเภอ\s*/u, '').replace(/^อ\.\s*/u, '').trim();
}
function normalizeSubdistrict(value) {
  return trim(value).replace(/^ตำบล\s*/u, '').replace(/^ต\.\s*/u, '').trim();
}
function normalizeVillage(value) {
  const s = trim(value).replace(/^หมู่(?:ที่)?\s*/u, '').replace(/^ม\.\s*/u, '');
  if (!/^\d{1,2}$/.test(s)) return '';
  const n = Number(s);
  return n >= 1 && n <= 99 ? String(n) : '';
}
const emptyResults = /^(?:รอผล|ยังไม่มีผล|pending|n\/a|na|ไม่ตรวจ|รอตรวจ|ไม่ทราบ|-)$/iu;
export function parseTotalAs(raw) {
  const original = trim(raw);
  if (!original || emptyResults.test(original)) return null;
  if (/^ตรวจไม่พบ$/u.test(original)) return {value: null, above: false, boundary: false, detected: false};
  const s = original.replace(/,/g, '').replace(/^\*/, '');
  const limited = s.match(/^<\s*(\d+(?:\.\d+)?)$/u);
  if (limited) {
    if (Number(limited[1]) > TOTAL_AS_REFERENCE.threshold) {
      throw new Error('Reporting limit exceeds Total As screening reference; manual assessment required');
    }
    return {value: null, above: false, boundary: false, detected: false};
  }
  if (!/^\d+(?:\.\d+)?$/.test(s)) throw new Error('Unrecognized Total As result format; publication stopped');
  const value = Number(s);
  if (!Number.isFinite(value) || value < 0) throw new Error('Invalid Total As value');
  return {value, above: value > TOTAL_AS_REFERENCE.threshold,
    boundary: value === TOTAL_AS_REFERENCE.threshold, detected: true};
}
function levelBand(value) {
  if (value <= 150) return '>100–150 µg/L';
  if (value <= 200) return '>150–200 µg/L';
  if (value <= 300) return '>200–300 µg/L';
  return '>300 µg/L';
}
function publicRound(group, round) {
  const n = group.length;
  if (n < VILLAGE_MIN_EVENTS) return null;
  const positive = group.filter(x => x.above);
  const atBoundary = group.filter(x => x.boundary);
  // Boundary equality is not automatically classified as normal; block ambiguous disclosures.
  const publishCounts = positive.length >= SUBGROUP_MIN_EVENTS &&
    n - positive.length >= SUBGROUP_MIN_EVENTS &&
    atBoundary.length === 0;
  const bands = publishCounts ? [...new Set(positive.map(x => levelBand(x.value)))].sort() : [];
  return {
    round: round.round,
    date: round.date,
    assay: 'Urine Total As',
    unit: 'µg/L',
    result_events: n,
    over_reference_count: publishCounts ? positive.length : null,
    over_reference_label: publishCounts ? String(positive.length) : 'ปกปิด (0–4 หรือกลุ่มย่อยไม่เพียงพอ)',
    over_reference_bands: bands,
    disclosure_status: publishCounts ? 'PUBLISHED' : 'SMALL_CELL_SUPPRESSED',
    // No negative total or raw min/max: these could reveal protected small cells.
    reference_operator: '>',
    reference_value: TOTAL_AS_REFERENCE.threshold
  };
}
export function aggregateVillagePublic(columns, rounds, snapshot) {
  if (!Array.isArray(rounds) || !rounds.length) throw new Error('No monitoring rounds');
  const size = Math.max(...Object.values(columns).map(x => x?.length || 0), 0);
  const locations = new Map(), totals = new Map();
  const sorted = [...rounds].sort((a,b) => a.round - b.round);
  for (const r of sorted) totals.set(r.round, {round:r.round, date:r.date, result_events:0, above_reference:0, without_village:0, boundary_values:0});
  for (let i=0; i<size; i++) {
    const d = normalizeDistrict(columns.N?.[i]);
    const sub = normalizeSubdistrict(columns.M?.[i]);
    const village = normalizeVillage(columns.L?.[i]);
    for (const r of sorted) {
      const result = parseTotalAs(columns[r.column]?.[i]);
      if (!result) continue;
      if (!districts.has(d)) throw new Error('Unrecognized residence district; publication stopped');
      const total = totals.get(r.round);
      total.result_events++;
      if (result.above) total.above_reference++;
      if (result.boundary) total.boundary_values++;
      if (!sub || !village) {total.without_village++; continue;}
      const key = [d,sub,village].join('\u001f');
      let entry = locations.get(key);
      if (!entry) {
        entry = {district:d,subdistrict:sub,village_no:village, rounds:new Map()};
        locations.set(key,entry);
      }
      if (!entry.rounds.has(r.round)) entry.rounds.set(r.round,[]);
      entry.rounds.get(r.round).push(result);
    }
  }
  const districtsOut = {};
  for (const item of locations.values()) {
    const published = sorted.map(r => publicRound(item.rounds.get(r.round)||[],r)).filter(Boolean);
    if (!published.length) continue;
    if (!districtsOut[item.district]) districtsOut[item.district] = [];
    districtsOut[item.district].push({
      subdistrict: item.subdistrict,
      village_no: item.village_no,
      // The registry supplies only the village number, not a validated village place name or GPS.
      label: 'หมู่ '+item.village_no+' ต.'+item.subdistrict,
      rounds: published
    });
  }
  for (const entries of Object.values(districtsOut))
    entries.sort((a,b)=>a.subdistrict.localeCompare(b.subdistrict,'th')||Number(a.village_no)-Number(b.village_no));
  const output = {
    schema: 'theriver/health-village-public-v1',
    source_snapshot: snapshot,
    source: 'Restricted health registry: 2569 tab, residence village/subdistrict/district',
    count_unit: 'urine_result_events_not_verified_unique_persons',
    location_basis: 'residence_village_number_without_verified_gps',
    map_location_precision: 'district_centroid_only_until_village_coordinates_validated',
    reference: TOTAL_AS_REFERENCE,
    privacy: {
      minimum_village_result_events_per_round: VILLAGE_MIN_EVENTS,
      minimum_published_abnormal_and_complementary_cells: SUBGROUP_MIN_EVENTS,
      counts_zero_to_four_are_not_distinguished_from_suppressed_small_cells: true,
      exact_case_values: false,
      household_coordinates: false,
      individual_data: false
    },
    limitations: [
      'กรณีจำนวนตัวอย่างหมู่บ้านต่ำกว่า 10 จะไม่เผยแพร่รายการหมู่บ้านและผลตรวจรายรอบ',
      'ผลเกินเกณฑ์ 0–4 รายการและกลุ่มย่อยที่เสี่ยงต่อการอนุมานข้อมูลบุคคลจะไม่แสดงตัวเลขแน่นอน',
      'Total As >100 µg/L เป็นเกณฑ์คัดกรองเท่านั้น; ไม่ใช่การยืนยันพิษสารหนูหรือผลตรวจแยกชนิด',
      'ช่อง speciation ในทะเบียนมีบางผลที่เป็นคนละหน่วยและชนิดการตรวจไม่ยืนยัน จึงไม่จัดระดับ speciation บนแผนที่',
      'จำนวนผลตรวจรายรอบไม่เท่ากับจำนวนบุคคลไม่ซ้ำ และไม่ใช่อัตราความชุกของประชาชน',
      'ไม่มีพิกัดหมู่บ้านที่ผ่านการยืนยันในทะเบียน จึงแสดงข้อมูลหมู่บ้านในหมุดศูนย์กลางอำเภอเท่านั้น'
    ],
    province_rounds: [...totals.values()],
    districts: Object.fromEntries(Object.entries(districtsOut).sort((a,b)=>a[0].localeCompare(b[0],'th')))
  };
  const serialized = JSON.stringify(output);
  if (/(?:"(?:name|citizen_id|cid|hn|patient_id|identity_hash|lat|lon|coordinates)"\s*:|\b\d{13}\b)/iu.test(serialized))
    throw new Error('Sensitive or precise location data in village output');
  return output;
}
