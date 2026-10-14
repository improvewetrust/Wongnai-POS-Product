/* Number of restaurants in each area (market size) — shared default for everyone.
 * zones: "Opp ทั้งเขต" from Google Sheet "Ours Team : AE-MDS (NBI,PKT)" → tab "Area Planner", imported 2026-10-14.
 * Set in the app: ⚙️ ตั้งค่า → 🍽️ จำนวนร้านอาหาร, then "⬇️ ไฟล์จำนวนร้าน" downloads a new copy of this file;
 * replace it in the repository so every device sees the same numbers.
 * tambons: { tam_code: count } (codes from area-map-tambons.js) · zones: { zone id: count } overrides the sum of its sub-districts. */
window.AREA_MARKET = {
  "tambons": {},
  "zones": {
    "bang-bua-thong": 1970,
    "bang-kruai": 920,
    "bang-yai": 1011,
    "phuket": 1776,
    "mueang-nonthaburi": 2491,
    "sai-noi": 224,
    "bang-phlat": 778
  }
};
