/* Number of restaurants in each area (market size) — shared default for everyone.
 * Set in the app: ⚙️ ตั้งค่า → 🍽️ จำนวนร้านอาหาร, then "⬇️ ไฟล์จำนวนร้าน" downloads a new copy of this file;
 * replace it in the repository so every device sees the same numbers.
 * tambons: { tam_code: count } (codes from area-map-tambons.js) · zones: { zone id: count } overrides the sum of its sub-districts. */
window.AREA_MARKET = { tambons: {}, zones: {} };
