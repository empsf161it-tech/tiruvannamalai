/* ==========================================================================
   Thiruvannamalai Smart Pilgrim — shared UI: header, footer, tab bar, sheets,
   toasts, OTP input, login. Every page loads this file first.
   ========================================================================== */
(function () {
  'use strict';
  const SP = (window.SP = window.SP || {});

  /* ---------- helpers ---------- */
  SP.$ = (s, el) => (el || document).querySelector(s);
  SP.$$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  SP.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  SP.inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  SP.mapsUrl = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q + ', Tiruvannamalai, Tamil Nadu');
  SP.store = {
    get(k, d) { try { const v = localStorage.getItem('sp:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sp:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem('sp:' + k); } catch (e) { /* ignore */ } },
  };
  SP.pageId = () => { const m = document.querySelector('meta[name="page"]'); return m ? m.content : 'home'; };

  /* ---------- icons (24px line icons) ---------- */
  const P = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    auto: '<path d="M2 17V8.5a1.5 1.5 0 0 1 1.5-1.5H11l2.2 4H18a4 4 0 0 1 4 4v2"/><path d="M2 12h8.5"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="18" cy="17.5" r="2"/><path d="M8.5 17.5h7.5"/>',
    bike: '<circle cx="5.5" cy="17.5" r="3"/><circle cx="18.5" cy="17.5" r="3"/><path d="M8.5 17.5H13l2.5-7H18"/><path d="M10 10.5h5.5"/><path d="M15 6h2.5"/>',
    shareauto: '<path d="M2 17V8.5A1.5 1.5 0 0 1 3.5 7H11l2.2 4H18a4 4 0 0 1 4 4v2"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="18" cy="17.5" r="2"/><path d="M8.5 17.5h7.5"/><circle cx="6" cy="10.5" r="1.3"/><circle cx="10" cy="10.5" r="1.3"/>',
    bed: '<path d="M2 19V6"/><path d="M2 15h20v4"/><path d="M22 15v-3a3 3 0 0 0-3-3h-8v6"/><circle cx="6.5" cy="11" r="1.8"/>',
    food: '<path d="M3 17h18"/><path d="M5 17a7 7 0 0 1 14 0"/><path d="M12 7V5.5"/><circle cx="12" cy="4.5" r="1"/><path d="M2 20.5h20"/>',
    bowl: '<path d="M3 12h18a9 9 0 0 1-18 0z"/><path d="M8 8.5c0-1.6 1-1.6 1-3.2"/><path d="M12 8.5c0-1.6 1-1.6 1-3.2"/><path d="M16 8.5c0-1.6 1-1.6 1-3.2"/>',
    bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
    chev: '<polyline points="6 9 12 15 18 9"/>',
    right: '<polyline points="9 18 15 12 9 6"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    left: '<polyline points="15 18 9 12 15 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    swap: '<path d="M7 4v16"/><path d="M3 8l4-4 4 4"/><path d="M17 20V4"/><path d="M13 16l4 4 4-4"/>',
    cloud: '<path d="M17 18a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.5A3.5 3.5 0 0 0 7 18z"/><path d="M6.5 6.2L5.4 5.1M12 3.5V2M17.5 6.2l1.1-1.1M3.2 10.5H2"/>',
    flame: '<path d="M12 2c.8 3.2 5 5.2 5 10.2a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.1 1.9 1 3 2 3.3C10.6 7.2 10.6 4.5 12 2z"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    wifioff: '<line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    lamp: '<path d="M12 2c.7 2.4 3 3.6 3 6a3 3 0 0 1-6 0c0-1.5.6-2.4 1.4-3.2.1 1 .6 1.7 1.2 1.9C11.4 5.4 11.4 3.6 12 2z"/><path d="M4 14h16l-2 6H6z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    idol: '<path d="M8 21h8"/><path d="M6 21v-3h12v3"/><path d="M9 18c0-6 .5-11 3-14 2.5 3 3 8 3 14"/>',
    sweet: '<circle cx="12" cy="12" r="8"/><path d="M8.5 9.5h.01M12 8h.01M15.5 9.5h.01M9 13.5h.01M15 13.5h.01M12 16h.01"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    pack: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7.5L12 12.5l8.7-5"/><line x1="12" y1="22" x2="12" y2="12.5"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  };
  SP.icon = (name, cls) =>
    '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>';
  const I = SP.icon;

  /* ---------- theme (light / dark / system) ---------- */
  const mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  SP.theme = {
    get() { const t = SP.store.get('theme', 'auto'); return t === 'light' || t === 'dark' ? t : 'auto'; },
    isDark() { const t = SP.theme.get(); return t === 'dark' || (t === 'auto' && !!(mq && mq.matches)); },
    set(t) { SP.store.set('theme', t); SP.theme.apply(); },
    toggle() { SP.theme.set(SP.theme.isDark() ? 'light' : 'dark'); },
    apply() {
      const t = SP.theme.get(), r = document.documentElement;
      if (t === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', t);
      const dark = SP.theme.isDark();
      SP.$$('[data-theme-btn]').forEach((b) => {
        b.innerHTML = I(dark ? 'sun' : 'moon');
        b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        b.title = dark ? 'Light theme' : 'Dark theme';
      });
      SP.$$('input[name="themepick"]').forEach((i) => { i.checked = i.value === t; });
    },
  };
  try { const t0 = SP.store.get('theme', 'auto'); if (t0 === 'light' || t0 === 'dark') document.documentElement.setAttribute('data-theme', t0); } catch (e) { /* ignore */ }
  if (mq && mq.addEventListener) mq.addEventListener('change', () => SP.theme.apply());

  /* ---------- Google Maps embed (no API key needed for the demo) ---------- */
  // SP.gmap({ q:'place', z:15, h:320, title }) or SP.gmap({ saddr:'A', daddr:'B' })
  SP.gmap = function (o) {
    o = o || {};
    const e = encodeURIComponent, town = (t) => (/tiruvannamalai/i.test(t) ? t : t + ', Tiruvannamalai, Tamil Nadu');
    let u = 'https://maps.google.com/maps?output=embed&hl=en';
    if (o.daddr) u += '&saddr=' + e(town(o.saddr || 'Arunachaleswarar Temple')) + '&daddr=' + e(town(o.daddr));
    else u += '&q=' + e(town(o.q || 'Arunachaleswarar Temple')) + '&z=' + (o.z || 15);
    return '<iframe class="gmap' + (o.cls ? ' ' + o.cls : '') + '" src="' + u + '" title="' + SP.esc(o.title || 'Google Map') + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
  };

  /* ---------- logo mark (gopuram) ---------- */
  SP.mark = () =>
    '<svg class="brand__mark" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<circle cx="24" cy="3.6" r="1.7"/><rect x="23.4" y="4.6" width="1.2" height="3"/>' +
    '<path d="M17 13.5Q24 5.5 31 13.5z"/>' +
    '<rect x="16" y="14.5" width="16" height="4" rx=".8"/><rect x="14" y="20" width="20" height="4.5" rx=".8"/>' +
    '<rect x="12" y="26" width="24" height="5" rx=".8"/><rect x="10" y="32.5" width="28" height="5.5" rx=".8"/>' +
    '<path fill-rule="evenodd" d="M7 39.5h34v6.5H7z M21 46v-3.6a3 3 0 0 1 6 0V46z"/></svg>';

  /* ---------- navigation model ---------- */
  SP.NAV = [
    { id: 'home', label: 'Home', short: 'Home', href: 'index.html', icon: 'home' },
    { id: 'ride', label: 'Ride', short: 'Ride', href: 'ride.html', icon: 'car' },
    { id: 'rooms', label: 'Rooms & Hotels', short: 'Stay', href: 'rooms.html', icon: 'bed' },
    { id: 'food', label: 'Food', short: 'Food', href: 'food.html', icon: 'food' },
    { id: 'annadanam', label: 'Annadanam', short: 'Annadanam', href: 'annadanam.html', icon: 'bowl' },
    { id: 'store', label: 'Store', short: 'Store', href: 'store.html', icon: 'bag' },
    { id: 'map', label: 'Offline Map', short: 'Map', href: 'map.html', icon: 'map' },
    { id: 'profile', label: 'My Profile', short: 'Profile', href: 'profile.html', icon: 'user' },
  ];
  const TAB_IDS = ['home', 'ride', 'rooms', 'food', 'map', 'profile'];
  const cur = (id, page) => (id === page ? ' aria-current="page"' : '');

  SP.sampleNote = () =>
    '<p class="note">' + I('info') + '<span>Sample data for the design preview. Names, prices and timings are not verified and will be replaced after local research.</span></p>';

  /* ---------- layers: sheets, drawers, dialogs ---------- */
  const stack = [];
  document.addEventListener('keydown', (e) => {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(); return; }
    if (e.key === 'Tab') {
      const f = SP.$$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,summary,[tabindex]:not([tabindex="-1"])', top.sheet).filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === top.sheet)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* opts: title, html, foot, side(bool), menu(bool), onClose */
  SP.sheet = function (opts) {
    const o = opts || {};
    const prev = document.activeElement;
    const root = document.createElement('div');
    root.className = 'layer' + (o.side ? ' layer--side' : '');
    const cls = 'sheet' + (o.side ? ' sheet--side' : '') + (o.menu ? ' sheet--menu' : '') + (o.full ? ' sheet--full' : '');
    root.innerHTML =
      '<div class="layer__backdrop" data-close></div>' +
      '<div class="' + cls + '" role="dialog" aria-modal="true" aria-label="' + SP.esc(o.title || 'Dialog') + '" tabindex="-1">' +
      '<div class="sheet__head"><h2 class="sheet__title">' + SP.esc(o.title || '') + '</h2>' +
      '<button class="sheet__close" type="button" data-close aria-label="Close">' + I('x') + '</button></div>' +
      '<div class="' + (o.menu ? 'menu-body' : 'sheet__body') + '">' + (o.html || '') + '</div>' +
      (o.foot != null ? '<div class="sheet__foot">' + o.foot + '</div>' : '') +
      '</div>';
    document.body.appendChild(root);
    document.documentElement.classList.add('has-layer');
    const sheet = SP.$('.sheet', root);
    const api = {
      root, sheet,
      body: SP.$(o.menu ? '.menu-body' : '.sheet__body', root),
      foot: SP.$('.sheet__foot', root),
      setTitle(t) { SP.$('.sheet__title', root).textContent = t; sheet.setAttribute('aria-label', t); },
      close() {
        const i = stack.indexOf(api);
        if (i < 0) return;
        stack.splice(i, 1);
        root.remove();
        if (!stack.length) document.documentElement.classList.remove('has-layer');
        if (prev && prev.focus && document.contains(prev)) prev.focus();
        if (o.onClose) o.onClose();
      },
    };
    root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) api.close(); });
    stack.push(api);
    const auto = SP.$('[autofocus]', sheet);
    (auto || sheet).focus({ preventScroll: true });
    return api;
  };

  /* ---------- toast ---------- */
  let toastEl, toastTimer;
  SP.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add('is-on'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  };

  /* ---------- art / photo slot ---------- */
  // spec: { photo, slug, alt, art }.
  //  photo: explicit image path, always used.
  //  slug : the picture tile is drawn, and assets/img/<slug>.jpg is laid over it.
  //         If that file does not exist the <img> is removed (see error listener), so
  //         dropping a licensed photo into assets/img/ is all it takes to upgrade a slot.
  SP.slug = (t) => String(t || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  SP.media = function (spec, cls) {
    spec = spec || {};
    let inner = '';
    if (spec.art && SP.art) inner = SP.art.render(spec.art);
    const src = spec.photo || (spec.slug ? 'assets/img/' + spec.slug + '.jpg' : '');
    if (src) inner += '<img class="media__photo" src="' + SP.esc(src) + '" alt="' + SP.esc(spec.alt || '') + '" loading="lazy" decoding="async">';
    return '<div class="media' + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + SP.esc(spec.alt || '') + '">' + inner + '</div>';
  };
  // image load errors do not bubble, so listen in the capture phase
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.classList.contains('media__photo')) t.remove();
  }, true);

  /* ---------- 4-digit OTP input ---------- */
  SP.otp = function (host, o) {
    const len = (o && o.length) || 4;
    host.classList.add('otp');
    host.innerHTML = Array.from({ length: len }, (_, i) =>
      '<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="' + (i ? 'off' : 'one-time-code') + '" aria-label="OTP digit ' + (i + 1) + ' of ' + len + '">').join('');
    const ins = SP.$$('input', host);
    const value = () => ins.map((n) => n.value).join('');
    ins.forEach((inp, i) => {
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/\D/g, '').slice(-1);
        host.classList.remove('is-error');
        if (inp.value && ins[i + 1]) ins[i + 1].focus();
        if (o && o.onChange) o.onChange(value());
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value && ins[i - 1]) { ins[i - 1].focus(); ins[i - 1].value = ''; }
        if (e.key === 'ArrowLeft' && ins[i - 1]) ins[i - 1].focus();
        if (e.key === 'ArrowRight' && ins[i + 1]) ins[i + 1].focus();
        if (e.key === 'Enter' && o && o.onEnter) o.onEnter(value());
      });
      inp.addEventListener('paste', (e) => {
        const t = ((e.clipboardData && e.clipboardData.getData('text')) || '').replace(/\D/g, '').slice(0, len);
        if (!t) return;
        e.preventDefault();
        t.split('').forEach((c, k) => { ins[k].value = c; });
        ins[Math.min(t.length, len - 1)].focus();
        if (o && o.onChange) o.onChange(value());
      });
    });
    return {
      value,
      focus() { ins[0].focus(); },
      error() { host.classList.add('is-error'); },
      clear() { ins.forEach((n) => { n.value = ''; }); host.classList.remove('is-error'); ins[0].focus(); },
    };
  };
  SP.DEMO_OTP = '1234';

  /* ---------- cart (shared by header badge, store, product and cart pages) ---------- */
  SP.cart = {
    get: () => SP.store.get('cart', []),
    set(c) { SP.store.set('cart', c); SP.refreshCart(); },
    count: () => SP.cart.get().reduce((n, l) => n + l.q, 0),
    qty: (id) => (SP.cart.get().find((l) => l.id === id) || { q: 0 }).q,
    add(id, n) { const c = SP.cart.get(), l = c.find((x) => x.id === id); if (l) l.q = Math.min(10, l.q + (n || 1)); else c.push({ id, q: n || 1 }); SP.cart.set(c); },
    setQty(id, q) { let c = SP.cart.get(); if (q <= 0) c = c.filter((l) => l.id !== id); else { const l = c.find((x) => x.id === id); if (l) l.q = Math.min(10, q); } SP.cart.set(c); },
    clear() { SP.cart.set([]); },
  };
  SP.refreshCart = function () {
    const n = SP.cart.count();
    SP.$$('[data-cart-count]').forEach((el) => { el.textContent = n; el.hidden = !n; });
  };

  /* ---------- auth (front-end sample only) ---------- */
  SP.user = () => SP.store.get('user', null);
  const mask = (p) => p.slice(0, 2) + '•••••' + p.slice(-3);

  SP.openLogin = function (after) {
    let phone = '';
    const s = SP.sheet({ title: 'Login' });
    const stepPhone = () => {
      s.setTitle('Login');
      s.body.innerHTML =
        '<p class="muted">Enter your mobile number. We will send a one-time code.</p>' +
        '<form id="lf" class="fields" novalidate><div class="field"><label for="lphone">Mobile number</label>' +
        '<div class="phone"><span class="phone__cc">+91</span><input class="input" id="lphone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="98765 43210" autofocus></div>' +
        '<div class="field__error" id="lerr" role="alert"></div></div>' +
        '<button class="btn btn--primary btn--block btn--lg" type="submit">Send OTP</button></form>' +
        '<p class="small muted">Front-end preview: no real SMS is sent. Sign-in is stored only in this browser.</p>';
      const f = SP.$('#lf', s.body), inp = SP.$('#lphone', s.body);
      inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); inp.removeAttribute('aria-invalid'); SP.$('#lerr', s.body).textContent = ''; });
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!/^[6-9]\d{9}$/.test(inp.value)) { inp.setAttribute('aria-invalid', 'true'); SP.$('#lerr', s.body).textContent = 'Enter a valid 10-digit mobile number.'; inp.focus(); return; }
        phone = inp.value; stepOtp();
      });
      inp.focus();
    };
    const stepOtp = () => {
      s.setTitle('Verify OTP');
      s.body.innerHTML =
        '<p class="muted">Enter the 4-digit code sent to <b>+91 ' + SP.esc(mask(phone)) + '</b>.</p>' +
        '<div id="lotp"></div><div class="field__error" id="lerr" role="alert" style="text-align:center"></div>' +
        '<div class="demo-hint">Demo code <b>' + SP.DEMO_OTP + '</b></div>' +
        '<button class="btn btn--primary btn--block btn--lg" id="lverify" type="button">Verify and login</button>' +
        '<button class="btn btn--ghost btn--block" id="lback" type="button">Change number</button>';
      const o = SP.otp(SP.$('#lotp', s.body), { onEnter: verify });
      function verify() {
        if (o.value() !== SP.DEMO_OTP) { o.error(); SP.$('#lerr', s.body).textContent = 'That code is not correct. Try again.'; return; }
        SP.store.set('user', { phone });
        SP.refreshAuth();
        s.close();
        SP.toast('Logged in');
        if (after) after();
      }
      SP.$('#lverify', s.body).addEventListener('click', verify);
      SP.$('#lback', s.body).addEventListener('click', stepPhone);
      o.focus();
    };
    stepPhone();
    return s;
  };

  SP.openAccount = function () {
    const u = SP.user();
    if (!u) return SP.openLogin();
    const s = SP.sheet({ title: 'My account' });
    s.body.innerHTML =
      '<div class="dcard"><div class="avatar avatar--lg">' + I('user') + '</div><div><h3>Devotee</h3><p class="muted">+91 ' + SP.esc(mask(u.phone)) + '</p></div></div>' +
      '<div class="menu-list" style="padding:0"><a href="profile.html">' + I('user') + 'My profile</a><a href="ride.html#my-rides">' + I('car') + 'My rides</a><a href="rooms.html#bookings">' + I('bed') + 'My bookings</a><a href="cart.html#orders">' + I('pack') + 'My orders</a></div>' +
      '<button class="btn btn--outline btn--block" id="lo" type="button">' + I('logout') + 'Log out</button>';
    SP.$('#lo', s.body).addEventListener('click', () => { SP.store.del('user'); SP.refreshAuth(); s.close(); SP.toast('Logged out'); });
    SP.$$('a', s.body).forEach((a) => a.addEventListener('click', () => s.close()));
  };

  SP.refreshAuth = function () {
    const u = SP.user();
    SP.$$('[data-auth-label]').forEach((el) => { el.textContent = u ? 'Profile' : 'Login'; });
    SP.$$('.tab-prof').forEach((a) => {
      const ic = SP.$('.i', a), old = SP.$('.tab-ava', a); if (old) old.remove();
      if (u && ic) { const nm = String((SP.store.get('profile', {}) || {}).name || '').trim(); ic.style.display = 'none'; ic.insertAdjacentHTML('beforebegin', '<span class="tab-ava" aria-hidden="true">' + SP.esc((nm || 'D').charAt(0).toUpperCase()) + '</span>'); }
      else if (ic) ic.style.display = '';
    });
  };

  /* ---------- menu drawer ---------- */
  function openMenu() {
    const page = SP.pageId();
    const s = SP.sheet({
      title: 'Menu', side: true, menu: true,
      html:
        '<nav class="menu-list" aria-label="Menu">' + SP.NAV.map((n) => '<a href="' + n.href + '"' + cur(n.id, page) + '>' + I(n.icon) + n.label + '</a>').join('') + '</nav>' +
        '<div class="menu-foot"><button class="btn btn--outline btn--block" id="menuTheme" type="button"><span data-theme-btn style="display:inline-flex"></span><span>Change theme</span></button><button class="btn btn--primary btn--block" id="menuLogin" type="button">' + I('user') + '<span data-auth-label>Login</span></button>' +
        '<p class="small muted">Thiruvannamalai Smart Pilgrim</p></div>',
    });
    SP.refreshAuth(); SP.theme.apply();
    SP.$('#menuTheme', s.root).addEventListener('click', SP.theme.toggle);
    SP.$('#menuLogin', s.root).addEventListener('click', () => { s.close(); if (SP.user()) location.href = 'profile.html'; else SP.openLogin(); });
  }

  /* ---------- chrome: header, tab bar, footer ---------- */
  function mount() {
    const page = SP.pageId();
    const hdr =
      '<header class="site-header"><div class="container header__inner">' +
      '<a class="brand" href="index.html" aria-label="Thiruvannamalai Smart Pilgrim, home">' + SP.mark() + '<span class="brand__name">Thiruvannamalai<small>Smart Pilgrim</small></span></a>' +
      '<nav class="nav" aria-label="Main">' + SP.NAV.filter((n) => n.id !== 'profile').map((n) => '<a href="' + n.href + '"' + cur(n.id, page) + '>' + n.label + '</a>').join('') + '</nav>' +
      '<div class="header__actions"><button class="icon-btn theme-btn" id="themeBtn" type="button" data-theme-btn aria-label="Switch theme"></button><a class="cart-btn icon-btn" href="cart.html" aria-label="Cart">' + I('cart') + '<span class="count-dot" data-cart-count hidden>0</span></a><button class="btn btn--outline btn--sm header__login" id="loginBtn" type="button">' + I('user') + '<span data-auth-label>Login</span></button>' +
      '<button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-haspopup="dialog">' + I('menu') + '</button></div>' +
      '</div></header>';
    document.body.insertAdjacentHTML('afterbegin', '<div class="site-bg" aria-hidden="true"></div>');
    const ph = document.getElementById('app-header');
    if (ph) ph.outerHTML = '<a class="skip" href="#main">Skip to content</a>' + hdr; else document.body.insertAdjacentHTML('afterbegin', hdr);

    const tabs = SP.NAV.filter((n) => TAB_IDS.includes(n.id));
    document.body.insertAdjacentHTML('beforeend',
      '<nav class="tabbar" aria-label="Quick navigation">' + tabs.map((n) => '<a href="' + n.href + '"' + (n.id === 'profile' ? ' class="tab-prof"' : '') + cur(n.id, page) + '>' + I(n.icon) + '<span>' + n.short + '</span></a>').join('') + '</nav>');

    const ftr =
      '<footer class="site-footer"><div class="container"><div class="footer__grid">' +
      '<div class="footer__brand"><div class="brand">' + SP.mark() + '<span class="brand__name">Thiruvannamalai<small>Smart Pilgrim</small></span></div>' +
      '<p>One place for rides, rooms, meals, Annadanam, temple shopping and an offline map for visitors to Arunachaleswarar Temple.</p></div>' +
      '<div class="footer__links"><div><h3>Explore</h3><ul>' + SP.NAV.slice(0, 4).map((n) => '<li><a href="' + n.href + '">' + n.label + '</a></li>').join('') + '</ul></div>' +
      '<div><h3>More</h3><ul>' + SP.NAV.slice(4).map((n) => '<li><a href="' + n.href + '">' + n.label + '</a></li>').join('') + '<li><a href="index.html#girivalam">Girivalam guide</a></li></ul></div></div>' +
      '</div><div class="footer__bottom"><span>© 2026 Thiruvannamalai Smart Pilgrim</span>' +
      '<span>Design preview. Hotels, restaurants, prices, timings and map positions are sample data and are not verified.</span></div></div></footer>';
    const pf = document.getElementById('app-footer');
    if (pf) pf.outerHTML = ftr; else { const m = document.querySelector('main'); if (m) m.insertAdjacentHTML('afterend', ftr); }

    SP.$$('[data-sample]').forEach((el) => { el.innerHTML = SP.sampleNote(); });
    SP.$('#menuBtn').addEventListener('click', openMenu);
    SP.$('#loginBtn').addEventListener('click', () => { if (SP.user()) location.href = 'profile.html'; else SP.openLogin(() => { if (SP.pageId() === 'profile') location.reload(); }); });
    SP.$('#themeBtn').addEventListener('click', SP.theme.toggle);
    SP.theme.apply();
    SP.refreshAuth();
    SP.refreshCart();

    // Offline support works once the site is served over https (see sw.js).
    try { if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) { /* not available here */ }
  }

  SP.ready = (fn) => { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); };
  SP.ready(mount);
})();
