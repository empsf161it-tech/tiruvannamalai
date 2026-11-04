/* Offline map: schematic Girivalam map, location list, and offline download.
   The drawing is schematic and not to scale. Replace it with verified GPS data before launch. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc;
  const view = SP.$('#view');
  const C = 250, R = 165;
  const rad = (d) => (d * Math.PI) / 180;
  const wob = (t) => 1 + 0.04 * Math.sin(2 * t + 1) + 0.025 * Math.sin(3 * t + 0.5);
  const pt = (deg, r, mod) => { const t = rad(deg), m = mod ? wob(t) : 1; return [C + Math.sin(t) * r * m, C - Math.cos(t) * r * m]; };
  const n1 = (v) => v.toFixed(1);
  const loop = (r, mod) => { let d = ''; for (let a = 0; a < 360; a += 4) { const p = pt(a, r, mod); d += (a ? 'L' : 'M') + n1(p[0]) + ' ' + n1(p[1]); } return d + 'Z'; };
  const blob = (r, ph) => { let d = ''; for (let a = 0; a < 360; a += 4) { const t = rad(a), m = 1 + 0.09 * Math.sin(2 * t + ph) + 0.06 * Math.sin(3 * t + ph * 1.7), p = [C + Math.sin(t) * r * m, C - Math.cos(t) * r * m]; d += (a ? 'L' : 'M') + n1(p[0]) + ' ' + n1(p[1]); } return d + 'Z'; };

  const TEMPLE = { id: 'temple', n: 0, name: 'Arunachaleswarar Temple', short: 'Temple', dir: 'East side of the hill', note: 'Start and finish of the Girivalam route. Walk clockwise from here, about 14 km around the hill.' };
  const STOPS = [TEMPLE].concat(D.lingams.map((l) => ({ id: l.id, n: l.n, name: l.name, short: l.name.replace(' Lingam', ''), dir: l.dir, note: l.note, angle: l.angle })));
  const byId = (id) => STOPS.find((s) => s.id === id);

  /* ---------- SVG ---------- */
  function svg() {
    let g = '';
    for (let i = 0; i <= 500; i += 50) g += '<path class="m-grid" d="M' + i + ' 0V500M0 ' + i + 'H500"/>';
    g += '<path class="m-hill-1" d="' + blob(122, 0.8) + '"/><path class="m-hill-2" d="' + blob(88, 2.1) + '"/><path class="m-hill-3" d="' + blob(52, 3.4) + '"/>';
    g += '<path d="M' + C + ' ' + (C - 12) + 'l10 18h-20z" fill="var(--ink-2)" opacity=".55"/><text class="m-hilltext" x="' + C + '" y="' + (C + 32) + '" text-anchor="middle" font-size="19">Arunachala Hill</text>';
    // route
    const rp = loop(R, true);
    let arrows = '';
    for (let i = 0; i < 8; i++) {
      const a = D.lingams[i].angle, b = i === 7 ? D.lingams[0].angle + 360 : D.lingams[i + 1].angle;
      let m = (a + (b < a ? b + 360 : b)) / 2; m %= 360;
      const p1 = pt(m - 2, R, true), p2 = pt(m + 2, R, true), c = pt(m, R, true);
      const ang = (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
      arrows += '<polygon points="-7,-6 7,0 -7,6" fill="var(--brand)" transform="translate(' + n1(c[0]) + ' ' + n1(c[1]) + ') rotate(' + n1(ang) + ')"/>';
    }
    g += '<g id="g-route"><path class="m-route-under" d="' + rp + '"/><path class="m-route" d="' + rp + '"/>' + arrows + '</g>';
    // lingam pins
    let pins = '';
    D.lingams.forEach((l) => {
      const p = pt(l.angle, R, true), s = Math.sin(rad(l.angle)), c = Math.cos(rad(l.angle));
      const lx = s * 30, ly = -c * 30, anchor = s > 0.35 ? 'start' : s < -0.35 ? 'end' : 'middle';
      pins += '<g class="pin" data-id="' + l.id + '" tabindex="0" role="button" aria-label="' + esc(l.name) + ', stop ' + l.n + ' of 8" transform="translate(' + n1(p[0]) + ' ' + n1(p[1]) + ')">' +
        '<circle class="pin__ring" r="23"/><circle class="pin__dot" r="15"/><text class="pin__num">' + l.n + '</text>' +
        '<text class="m-text pin__label" x="' + n1(lx) + '" y="' + n1(ly) + '" text-anchor="' + anchor + '" dominant-baseline="central" font-size="13">' + esc(l.name.replace(' Lingam', '')) + '</text></g>';
    });
    g += '<g id="g-lingams">' + pins + '</g>';
    const tp = pt(82, R * 0.62, false);
    g += '<g id="g-temple"><g class="pin pin--temple" data-id="temple" tabindex="0" role="button" aria-label="Arunachaleswarar Temple, start of the route" transform="translate(' + n1(tp[0]) + ' ' + n1(tp[1]) + ')">' +
      '<circle class="pin__ring" r="28"/><circle class="pin__dot" r="20"/><g fill="var(--brand-ink)"><rect x="-8" y="3" width="16" height="5" rx="1"/><rect x="-5.5" y="-2.5" width="11" height="4.5" rx="1"/><rect x="-3" y="-8" width="6" height="4.5" rx="1"/></g>' +
      '<text class="m-text pin__label" x="-30" y="0" text-anchor="end" dominant-baseline="central" font-size="13">Temple</text></g></g>';
    // compass
    g += '<g transform="translate(452 52)"><circle r="21" fill="var(--surface)" stroke="var(--line-2)"/><path d="M0 -15L5 3H-5z" fill="var(--brand)"/><path d="M0 15L5 -3H-5z" fill="var(--ink-3)" opacity=".5"/><text y="-24" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)" font-family="var(--font-body)">N</text></g>';
    return '<svg viewBox="0 0 500 500" role="group" aria-label="Schematic map of the Girivalam route with the temple and eight lingams" xmlns="http://www.w3.org/2000/svg">' + g + '</svg>';
  }

  /* ---------- layout ---------- */
  view.innerHTML =
    '<div class="panel" style="padding:14px 16px;margin-bottom:16px;display:grid;gap:12px"><div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px">' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap" id="status"></div><button class="btn btn--primary" type="button" id="dlBtn">' + I('download') + '<span>Download offline map</span></button></div>' +
    '<div class="dl" id="dl" hidden><div class="dl__bar" role="progressbar" aria-label="Download progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="dlBar"></i></div><p class="small muted" id="dlText" aria-live="polite"></p></div></div>' +
    '<div class="mapwrap"><div><div class="ptabs" role="tablist" aria-label="Map type"><button class="ptab" role="tab" type="button" data-pane="g" aria-selected="true">' + I('map') + 'Google Map</button><button class="ptab" role="tab" type="button" data-pane="o" aria-selected="false">' + I('wifioff') + 'Offline map</button></div>' +
    '<div id="paneG" class="gmapbox gmapbox--tall"><div id="gwrap" style="height:100%">' + SP.gmap({ q: 'Arunachaleswarar Temple', z: 15, title: 'Google Map of Arunachaleswarar Temple' }) + '</div><div class="gmapchips" id="gchips">' +
    '<button type="button" data-q="Arunachaleswarar Temple" aria-pressed="true">Temple</button><button type="button" data-q="Girivalam Path" aria-pressed="false">Girivalam path</button>' + D.lingams.map((l) => '<button type="button" data-q="' + esc(l.name) + '" aria-pressed="false">' + esc(l.name.replace(' Lingam', '')) + '</button>').join('') + '</div>' +
    '<div class="gmapbar gmapbox__bar"><span>Demo map from Google Maps. Needs internet.</span><a id="gopen" href="' + SP.mapsUrl('Arunachaleswarar Temple') + '" target="_blank" rel="noopener">' + I('nav') + 'Open in Google Maps</a></div></div>' +
    '<div id="paneO" hidden><div class="mapbox">' + svg() + '<div class="mapnote">Offline schematic map, not to scale. Works without internet once downloaded. Positions are placeholders until verified.</div></div></div></div>' +
    '<div class="sidepanel"><div class="infocard" id="info" aria-live="polite"></div>' +
    '<div class="panel" id="layersPanel" hidden style="padding:16px"><h2 class="h3" style="margin-bottom:10px">Map layers</h2><div class="chips" id="layers">' +
    '<button class="chip" type="button" data-layer="g-route" aria-pressed="true">' + I('route') + 'Girivalam route</button>' +
    '<button class="chip" type="button" data-layer="g-lingams" aria-pressed="true">Ashta Lingams</button>' +
    '<button class="chip" type="button" data-layer="g-temple" aria-pressed="true">Temple</button>' +
    '<button class="chip" type="button" disabled title="Added once locations are verified">' + I('parking') + 'Parking</button>' +
    '<button class="chip" type="button" disabled title="Added once locations are verified">' + I('alert') + 'Emergency</button></div>' +
    '<p class="small muted" style="margin-top:10px">Parking and emergency points will appear here after they are verified.</p></div>' +
    '<div class="panel" style="padding:16px"><h2 class="h3" style="margin-bottom:8px">Key locations</h2><div class="loclist" id="locs">' +
    STOPS.map((s) => '<button class="loc' + (s.id === 'temple' ? ' loc--temple' : '') + '" type="button" data-id="' + s.id + '"><span class="n">' + (s.n || 'T') + '</span><span><b>' + esc(s.name) + '</b></span><small>' + (s.n ? esc(s.dir) : 'Start') + '</small></button>').join('') +
    '</div></div></div></div>';

  /* ---------- Google map pane ---------- */
  let gq = 'Arunachaleswarar Temple';
  function gotoG(q) {
    if (q !== gq) { gq = q; SP.$('#gwrap', view).innerHTML = SP.gmap({ q: q, z: 15, title: 'Google Map of ' + q }); }
    SP.$('#gopen', view).href = SP.mapsUrl(q);
    SP.$$('#gchips button', view).forEach((b) => b.setAttribute('aria-pressed', b.dataset.q === q));
  }
  function pane(k) {
    SP.$$('[data-pane]', view).forEach((b) => b.setAttribute('aria-selected', b.dataset.pane === k));
    SP.$('#paneG', view).hidden = k !== 'g'; SP.$('#paneO', view).hidden = k !== 'o'; SP.$('#layersPanel', view).hidden = k !== 'o';
  }
  /* ---------- selection ---------- */
  let current = 'temple';
  function select(id, scrollList) {
    current = id;
    const s = byId(id), i = STOPS.indexOf(s);
    SP.$$('.pin', view).forEach((p) => p.classList.toggle('is-active', p.dataset.id === id));
    SP.$$('.loc', view).forEach((b) => b.classList.toggle('is-active', b.dataset.id === id));
    SP.$('#info', view).innerHTML =
      '<span class="badge badge--gold" style="justify-self:start">' + (s.n ? 'Stop ' + s.n + ' of 8' : 'Start and finish') + '</span><h3>' + esc(s.name) + '</h3>' +
      '<p class="muted small" style="display:flex;gap:8px">' + I('nav') + '<span>' + (s.n ? 'Direction from the hill: ' : '') + esc(s.dir) + '</span></p><p>' + esc(s.note) + '</p>' +
      '<div class="infocard__nav"><button class="btn btn--soft btn--sm" type="button" data-step="-1">' + I('left') + 'Previous</button><button class="btn btn--soft btn--sm" type="button" data-step="1">Next' + I('right') + '</button></div>';
    gotoG(s.id === 'temple' ? 'Arunachaleswarar Temple' : s.name);
    if (scrollList) { const row = SP.$('.loc.is-active', view); if (row && row.scrollIntoView) row.scrollIntoView({ block: 'nearest' }); }
  }
  view.addEventListener('click', (e) => {
    const st = e.target.closest('[data-step]');
    if (st) { const i = (STOPS.findIndex((s) => s.id === current) + +st.dataset.step + STOPS.length) % STOPS.length; select(STOPS[i].id); return; }
    const pn = e.target.closest('[data-pane]'); if (pn) { pane(pn.dataset.pane); return; }
    const gc = e.target.closest('#gchips button'); if (gc) { gotoG(gc.dataset.q); return; }
    const t = e.target.closest('.pin, .loc');
    if (t) { select(t.dataset.id); return; }
    const l = e.target.closest('[data-layer]');
    if (l) { const on = l.getAttribute('aria-pressed') !== 'true'; l.setAttribute('aria-pressed', on); SP.$('#' + l.dataset.layer, view).classList.toggle('is-hidden', !on); }
  });
  view.addEventListener('keydown', (e) => { const p = e.target.closest && e.target.closest('.pin'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(p.dataset.id); } });

  /* ---------- online status + offline download ---------- */
  const FILES = ['map.html', 'index.html', 'css/styles.css', 'css/pages.css', 'assets/img/temple-bg.jpg', 'assets/img/temple-gopuram.jpg', 'assets/img/tile-warm.jpg', 'js/common.js', 'js/art.js', 'js/data.js', 'js/data2.js', 'js/map.js'];
  function status() {
    const saved = SP.store.get('mapSaved', null), on = navigator.onLine !== false;
    SP.$('#status', view).innerHTML =
      '<span class="badge ' + (on ? 'badge--ok' : 'badge--warn') + '">' + (on ? '<span class="pulse"></span>Online' : I('wifioff') + 'Offline mode') + '</span>' +
      (saved ? '<span class="badge badge--gold">' + I('check') + 'Saved on this device</span>' : '<span class="badge">Not downloaded yet</span>');
    SP.$('#dlBtn span', view).textContent = saved ? 'Update offline map' : 'Download offline map';
  }
  window.addEventListener('online', status); window.addEventListener('offline', status);

  SP.$('#dlBtn', view).addEventListener('click', async () => {
    const btn = SP.$('#dlBtn', view), box = SP.$('#dl', view), bar = SP.$('#dlBar', view), txt = SP.$('#dlText', view), meter = SP.$('.dl__bar', view);
    btn.disabled = true; box.hidden = false;
    const set = (v, t) => { bar.style.width = v + '%'; meter.setAttribute('aria-valuenow', Math.round(v)); txt.textContent = t; };
    set(2, 'Preparing map data');
    let stored = false;
    try {
      if ('caches' in window) {
        const c = await caches.open('sp-offline-map');
        for (let i = 0; i < FILES.length; i++) { await c.add(FILES[i]); set(((i + 1) / FILES.length) * 90, 'Saving map files (' + (i + 1) + ' of ' + FILES.length + ')'); }
        stored = true;
      }
    } catch (e) { stored = false; }
    for (let v = stored ? 90 : 5; v <= 100; v += stored ? 5 : 8) { await new Promise((r) => setTimeout(r, 90)); set(v, stored ? 'Finishing' : 'Preparing preview download'); }
    SP.store.set('mapSaved', Date.now());
    set(100, stored ? 'Map saved. It will open without internet once the site is installed over https.' : 'Preview only: offline storage is not available in this view. It works once the site is hosted over https.');
    btn.disabled = false; status(); SP.toast(stored ? 'Offline map saved' : 'Offline download simulated');
  });

  status();
  select('temple');
})();
