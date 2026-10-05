/* Shared geography helpers for area-map.html and area-report.html.
 * Needs area-map-zones.js and area-map-tambons.js loaded first. */
(function () {
  'use strict';
  const prep = (o) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    o.polygons.forEach(p => p[0].forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }));
    return { ...o, bbox: [x0, y0, x1, y1], latlngs: o.polygons.map(p => p.map(r => r.map(([x, y]) => [y, x]))) };
  };
  const ZONES = (window.AREA_ZONES || []).map(prep);
  const TAMBONS = (window.AREA_TAMBONS || []).map(prep);
  const ZONE_BY_ID = Object.fromEntries(ZONES.map(z => [z.id, z]));
  const TAMBON_BY_CODE = Object.fromEntries(TAMBONS.map(t => [t.code, t]));
  const hasCoord = (r) => Number.isFinite(r.lat) && Number.isFinite(r.lng);

  function ringContains(ring, x, y) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function contains(o, lat, lng) {
    const b = o.bbox;
    if (lng < b[0] || lng > b[2] || lat < b[1] || lat > b[3]) return false;
    return o.polygons.some(p => ringContains(p[0], lng, lat) && !p.slice(1).some(h => ringContains(h, lng, lat)));
  }

  const zoneCache = new Map(), tambonCache = new Map();
  // Zone id by pin position; shops without coordinates fall back to district names in the address
  function zoneOf(r) {
    if (hasCoord(r)) {
      const k = r.lat + ',' + r.lng;
      if (!zoneCache.has(k)) { const z = ZONES.find(z => contains(z, r.lat, r.lng)); zoneCache.set(k, z ? z.id : ''); }
      return zoneCache.get(k);
    }
    const a = (r.address || '').toLowerCase();
    if (!a) return '';
    const z = ZONES.find(z => z.keywords.some(k => a.includes(k.toLowerCase())));
    return z ? z.id : '';
  }
  // Sub-district code inside a focus zone. Inner borders are approximate, so a pin that falls in a
  // sliver between sub-districts goes to the nearest one in the same zone.
  function tambonOf(r) {
    const z = zoneOf(r);
    if (!z) return '';
    const inZone = TAMBONS.filter(t => t.zone === z);
    if (hasCoord(r)) {
      const k = r.lat + ',' + r.lng;
      if (!tambonCache.has(k)) {
        let t = inZone.find(t => contains(t, r.lat, r.lng));
        if (!t && inZone.length) {
          const d = (t) => Math.hypot(t.center[0] - r.lat, (t.center[1] - r.lng) * Math.cos(r.lat * Math.PI / 180));
          t = inZone.reduce((a, b) => (d(b) < d(a) ? b : a));
        }
        tambonCache.set(k, t ? t.code : '');
      }
      return tambonCache.get(k);
    }
    const a = r.address || '';
    const t = inZone.find(t => a.includes('ต.' + t.th) || a.includes('ตำบล' + t.th) || a.includes('แขวง' + t.th))
      || inZone.find(t => t.th !== (ZONE_BY_ID[z] || {}).th && a.includes(t.th));
    return t ? t.code : '';
  }
  // code → member id (first claim wins; the team editor keeps them exclusive)
  function teamIndex(team) {
    const owner = {};
    (team || []).forEach(m => (m.tambons || []).forEach(c => { if (!(c in owner)) owner[c] = m.id; }));
    return owner;
  }
  window.AreaGeo = { ZONES, ZONE_BY_ID, TAMBONS, TAMBON_BY_CODE, hasCoord, contains, zoneOf, tambonOf, teamIndex };
})();
