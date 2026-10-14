/* Area Sales team and the sub-districts (ตำบล/แขวง) each person covers — shared default for everyone.
 * Source: Google Sheet "Ours Team : AE-MDS (NBI,PKT)" → tab "Area Planner" (+ "My Team" for names), imported 2026-10-14.
 * Nuknik: district Mueang Nonthaburi chosen with no sub-districts listed → whole district.
 * Edit in the app (⚙️ ตั้งค่า → ทีมเซลส์, or 📋 นำเข้าจาก Google Sheet), then "⬇️ ไฟล์ทีม" downloads a new copy of this file;
 * replace it in the repository so every device gets the same assignments.
 * tambons = tam_code values from area-map-tambons.js. One sub-district belongs to one person. */
window.AREA_SALES_TEAM = [
  { id: "erng", nick: "Erng", name: "Juthamas Pengmuan", tambons: ["120301", "120302", "120303", "120304", "120305", "120306"] },
  { id: "ploi", nick: "Ploi", name: "Kunlacha Tancharoenrat", tambons: ["120405", "120406", "120402", "120501", "120506", "120502", "120504"] },
  { id: "bean", nick: "Bean", name: "Supanan Thongphaiwan", tambons: ["120201", "120202", "120203", "120204", "120205", "120206", "120207", "120208", "120209"] },
  { id: "nuknik", nick: "Nuknik", name: "Chalisa Wongwachi", tambons: ["120101", "120102", "120103", "120104", "120105", "120106", "120107", "120108", "120109", "120110"] },
  { id: "gring", nick: "Gring", name: "Guntaporn Soottiruk", tambons: [] },
  { id: "rose", nick: "Rose", name: "Rosefia Saharak", tambons: [] },
  { id: "popeye", nick: "Popeye", name: "Tidarat Taweesuk", tambons: [] },
  { id: "piw", nick: "Piw", name: "Pratumporn Sae-ong", tambons: [] },
  { id: "garfield", nick: "Kafill", name: "Suwanan kongmai", tambons: [] },
  { id: "jik", nick: "Jik", name: "Salinpas Pitsathan", tambons: [] },
];
