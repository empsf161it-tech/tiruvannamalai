/* Ride: a Rapido-style booking app. Map on top, bottom panel with
   search -> choose vehicle -> finding captain -> live tracking -> receipt.
   Front-end preview only: drivers, fares and tracking are simulated. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr;
  const TEMPLE = D.places[0].n;
  const KMH = { bike: 24, shareauto: 18, auto: 20, cab: 22 };
  const ETA = { bike: 2, shareauto: 6, auto: 4, cab: 7 };
  const PLATES = ['TN 25 AB 4821', 'TN 25 CD 7305', 'TN 25 EF 1198'];
  const S = { tab: location.hash === '#my-rides' ? 'history' : 'book', step: 'home', from: TEMPLE, to: '', vehicle: 'auto', pay: 'Cash', coupon: null, ride: null, driver: 0, phase: '', rating: 0, focus: null, q: '' };
  let timer = 0, raf = 0;

  const root = SP.$('#view');
  root.innerHTML =
    '<div class="rapp"><div class="rapp__map" id="rmap" aria-label="Map of Thiruvannamalai showing your trip"></div>' +
    '<section class="rapp__panel" id="rpanel" aria-live="polite"></section></div>';
  const panel = SP.$('#rpanel');

  /* ---------- map (Google Maps embed; route drawn by Google) ---------- */
  const place = (n) => D.places.find((p) => p.n.toLowerCase() === String(n).trim().toLowerCase());
  const clean = (n) => String(n).replace(/\s*\(.*?\)\s*/g, ' ').trim();
  let mapKey = '';
  function buildMap() {
    const host = SP.$('#rmap');
    host.innerHTML = '<div class="rapp__gm" id="gm"></div><div class="rapp__chip" id="rmchip" hidden></div>' +
      '<button class="rapp__loc" type="button" id="rloc" aria-label="Use temple as pickup">' + I('nav') + '</button>';
    SP.$('#rloc').addEventListener('click', () => { if (S.step === 'home') { S.from = TEMPLE; render(); drawTrip(); SP.toast('Pickup set to the temple'); } });
  }
  function drawTrip() {
    const a = place(S.from), b = place(S.to), both = a && b && S.from !== S.to;
    const key = both ? S.from + '>' + S.to : (a ? S.from : TEMPLE);
    if (key !== mapKey) {
      mapKey = key;
      SP.$('#gm').innerHTML = both ? SP.gmap({ saddr: clean(S.from), daddr: clean(S.to), title: 'Google Map route from ' + clean(S.from) + ' to ' + clean(S.to) }) : SP.gmap({ q: clean(a ? S.from : TEMPLE), z: 15, title: 'Google Map of ' + clean(a ? S.from : TEMPLE) });
    }
    const chip = SP.$('#rmchip');
    if (both) { chip.hidden = false; chip.innerHTML = '<b>' + km() + ' km</b> · ' + mins() + ' min'; } else chip.hidden = true;
    fit();
  }
  // on phones the bottom panel covers the lower part of the screen: end the map where the panel starts
  function fit() {
    const host = SP.$('#rmap');
    host.style.bottom = innerWidth < 980 && panel.offsetParent ? Math.round(Math.min(panel.offsetHeight - 18, host.parentNode.clientHeight * 0.7)) + 'px' : '';
  }
  function animate(ms, fn, done) {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); fn(k); if (k < 1) raf = requestAnimationFrame(step); else if (done) done(); };
    raf = requestAnimationFrame(step);
  }
  const progress = (k) => { const b = SP.$('#rbar'); if (b) b.style.width = Math.round(k * 100) + '%'; };

  /* ---------- helpers ---------- */
  const veh = (id) => D.vehicles.find((v) => v.id === (id || S.vehicle));
  const km = () => { const a = place(S.from), b = place(S.to); return a && b ? Math.max(0.6, Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 1.3 * 10) / 10) : 0; };
  const mins = (id) => Math.max(3, Math.ceil(km() / KMH[id || S.vehicle] * 60) + 1);
  const rawFare = (id) => { const v = veh(id); return Math.max(v.min, Math.round((v.base + v.perKm * km()) / 5) * 5); };
  const disc = (f) => !S.coupon ? 0 : S.coupon.off ? Math.min(S.coupon.off, f - 10) : Math.round(f * S.coupon.pct / 100);
  const fare = (id) => rawFare(id) - disc(rawFare(id));
  const rides = () => SP.store.get('rides', []).map((r) => (r.status === 'Active' ? Object.assign(r, { status: 'Cancelled' }) : r));
  const saveRides = (r) => SP.store.set('rides', r);
  const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const short = (n) => n.replace(' (East Gopuram)', '').replace('Tiruvannamalai ', '');
  const stars = (n) => [1, 2, 3, 4, 5].map((i) => '<button type="button" class="rd-star' + (i <= n ? ' is-on' : '') + '" data-star="' + i + '" aria-label="' + i + ' star' + (i > 1 ? 's' : '') + '">' + I('star') + '</button>').join('');
  const seg = () =>
    '<div class="rd-seg" role="tablist" aria-label="Ride sections"><button type="button" role="tab" data-tab="book" aria-selected="' + (S.tab === 'book') + '">Ride</button>' +
    '<button type="button" role="tab" data-tab="history" aria-selected="' + (S.tab === 'history') + '">My rides</button></div>';
  const head = (title, back) => '<div class="rd-head">' + (back ? '<button class="rd-back" type="button" data-act="' + back + '" aria-label="Back">' + I('left') + '</button>' : '') + '<h2>' + title + '</h2></div>';

  /* ---------- steps ---------- */
  function sugg() {
    const q = S.q.trim().toLowerCase();
    const list = D.places.filter((p) => (S.focus === 'from' ? p.n !== S.to : p.n !== S.from) && (!q || p.n.toLowerCase().includes(q)));
    if (!list.length) return '<p class="rd-empty">No match. Try “bus stand” or “temple”.</p>';
    const ref = place(S.focus === 'from' ? S.to : S.from) || D.places[0];
    return '<ul class="rd-sugg" role="listbox">' + list.map((p) => {
      const d = Math.round(Math.hypot(p.x - ref.x, p.y - ref.y) * 13) / 10;
      return '<li><button type="button" role="option" data-sugg="' + esc(p.n) + '"><span class="rd-sugg__ic">' + I('pin') + '</span><span><b>' + esc(short(p.n)) + '</b><small>Thiruvannamalai</small></span><span class="rd-sugg__km">' + d + ' km</span></button></li>';
    }).join('') + '</ul>';
  }
  function stepHome() {
    const ready = place(S.from) && place(S.to) && S.from !== S.to;
    return seg() + '<h2 class="rd-title">Where to, pilgrim?</h2>' +
      '<div class="rd-route"><span class="rd-route__line" aria-hidden="true"></span>' +
      '<label class="rd-in rd-in--a" for="rf"><span class="rd-dot rd-dot--a" aria-hidden="true"></span><span class="sr-only">Pickup</span><input id="rf" autocomplete="off" placeholder="Pickup location" value="' + esc(S.focus === 'from' ? S.q : short(S.from)) + '"></label>' +
      '<label class="rd-in rd-in--b" for="rt"><span class="rd-dot rd-dot--b" aria-hidden="true"></span><span class="sr-only">Drop</span><input id="rt" autocomplete="off" placeholder="Search drop location" value="' + esc(S.focus === 'to' ? S.q : short(S.to)) + '"></label>' +
      '<button class="rd-swap" type="button" id="swap" aria-label="Swap pickup and drop">' + I('swap') + '</button></div>' +
      (S.focus ? sugg() :
        '<div class="rd-saved">' + D.savedPlaces.map((p) => '<button type="button" class="rd-saved__item" data-saved="' + esc(p.n) + '"><span>' + I(p.k === 'Railway' || p.k === 'Bus stand' ? 'car' : 'pin') + '</span>' + esc(p.k) + '</button>').join('') + '</div>' +
        '<div class="rd-promo"><div><b>Girivalam special</b><p>Use <mark>GIRI20</mark> for ₹20 off your first ride.</p></div>' + SP.art.vehicle('auto') + '</div>' +
        '<h3 class="rd-sub">Popular routes</h3><ul class="rd-list">' + D.quickRoutes.map((q, i) => '<li><button type="button" data-quick="' + i + '"><span class="rd-sugg__ic">' + I('route') + '</span><span><b>' + esc(short(q[0])) + '</b><small>to ' + esc(short(q[1])) + '</small></span>' + I('right') + '</button></li>').join('') + '</ul>') +
      '<div class="rd-cta"><button class="rd-btn" type="button" data-act="choose"' + (ready ? '' : ' disabled') + '>See rides' + I('arrow') + '</button></div>';
  }
  function stepChoose() {
    return head('Choose a ride', 'edit') +
      '<div class="rd-trip"><div><span class="rd-dot rd-dot--a"></span><span>' + esc(short(S.from)) + '</span></div><div><span class="rd-dot rd-dot--b"></span><span>' + esc(short(S.to)) + '</span></div><small>' + km() + ' km · offers valid today</small></div>' +
      '<div class="rd-vehs" role="radiogroup" aria-label="Vehicle type">' + D.vehicles.map((v) => {
        const f = fare(v.id), r = rawFare(v.id);
        return '<label class="rd-veh"><input class="sr-only" type="radio" name="veh" value="' + v.id + '"' + (v.id === S.vehicle ? ' checked' : '') + '>' +
          '<span class="rd-veh__box"><span class="rd-veh__img">' + SP.art.vehicle(v.id) + '</span>' +
          '<span class="rd-veh__txt"><b>' + v.label + (v.tag ? ' <em>' + v.tag + '</em>' : '') + '</b><small>' + ETA[v.id] + ' min away · ' + mins(v.id) + ' min trip</small><small>' + v.sub + '</small></span>' +
          '<span class="rd-veh__fare"><b>' + inr(f) + '</b>' + (f < r ? '<s>' + inr(r) + '</s>' : '') + '</span></span></label>';
      }).join('') + '</div>' +
      '<div class="rd-opts"><button type="button" class="rd-opt" data-act="pay">' + I(S.pay === 'UPI' ? 'phone' : 'bag') + '<span>' + S.pay + '</span>' + I('chev') + '</button>' +
      '<button type="button" class="rd-opt" data-act="coupon">' + I('star') + '<span>' + (S.coupon ? S.coupon.c + ' applied' : 'Coupon') + '</span>' + I('chev') + '</button></div>' +
      '<div class="rd-cta"><button class="rd-btn" type="button" data-act="book">Book ' + veh().label + ' · ' + inr(fare()) + '</button></div>';
  }
  function stepSearch() {
    return '<div class="rd-search"><div class="rd-radar" aria-hidden="true"><i></i><i></i><i></i><span>' + SP.art.vehicle(S.vehicle) + '</span></div>' +
      '<h2>Finding a captain near you</h2><p class="muted">Checking ' + veh().label.toLowerCase() + ' drivers around ' + esc(short(S.from)) + '</p>' +
      '<button class="rd-btn rd-btn--ghost" type="button" data-act="cancel-search">Cancel</button></div>';
  }
  function driverRow() {
    const d = D.drivers[S.driver];
    return '<div class="rd-driver"><span class="rd-avatar">' + initials(d.name) + '</span><div><b>' + esc(d.name) + '</b><span class="rating">' + I('star') + d.rating.toFixed(1) + '<small>(' + d.rides.toLocaleString('en-IN') + ')</small></span><small>' + esc(D.vehicleModels[S.vehicle]) + ' · ' + PLATES[S.driver] + '</small></div>' +
      '<div class="rd-driver__act"><button type="button" data-toast="Calling is disabled in the preview" aria-label="Call driver">' + I('phone') + '</button><button type="button" data-toast="Chat is disabled in the preview" aria-label="Message driver">' + I('info') + '</button></div></div>';
  }
  function stepTrack() {
    const r = S.ride, d = D.drivers[S.driver], ph = S.phase;
    const title = ph === 'arriving' ? 'Captain is on the way' : ph === 'arrived' ? 'Captain has arrived' : 'Enjoy your ride';
    const sub = ph === 'arriving' ? 'Arriving in <b id="eta">' + ETA[S.vehicle] + '</b> min' : ph === 'arrived' ? 'Share the PIN to start the trip' : 'Heading to ' + esc(short(r.to));
    return '<div class="rd-grab" aria-hidden="true"></div><div class="rd-status"><div><h2>' + title + '</h2><p>' + sub + '</p></div>' + (ph !== 'ontrip' ? '<div class="rd-pin"><small>PIN</small><b>' + r.pin + '</b></div>' : '<div class="rd-pin rd-pin--on"><small>ETA</small><b>' + mins() + 'm</b></div>') + '</div>' +
      (ph !== 'arrived' ? '<div class="rd-bar" role="progressbar" aria-label="' + (ph === 'arriving' ? 'Captain arriving' : 'Trip progress') + '"><i id="rbar"></i></div>' : '') +
      '<div class="rd-steps" aria-hidden="true"><i class="on"></i><i class="' + (ph !== 'arriving' ? 'on' : '') + '"></i><i class="' + (ph === 'ontrip' ? 'on' : '') + '"></i></div>' +
      driverRow() +
      '<div class="rd-trip"><div><span class="rd-dot rd-dot--a"></span><span>' + esc(short(r.from)) + '</span></div><div><span class="rd-dot rd-dot--b"></span><span>' + esc(short(r.to)) + '</span></div><small>' + r.km + ' km · ' + esc(r.vehicle) + ' · ' + esc(r.pay) + ' · <b>' + inr(r.fare) + '</b></small></div>' +
      '<div class="rd-actions">' + (ph === 'arrived' ? '<button class="rd-btn" type="button" data-act="start">Start trip (demo)</button>' : '') +
      (ph === 'ontrip' ? '<button class="rd-btn rd-btn--ghost" type="button" data-toast="Trip link copied (preview)">Share trip</button>' : '<button class="rd-btn rd-btn--ghost" type="button" data-act="cancel-ask">Cancel ride</button>') + '</div>' +
      (S.cancelAsk ? '<div class="rd-confirm" role="alertdialog" aria-label="Cancel ride"><b>Cancel this ride?</b><p>Your captain is already on the way.</p><div><button class="rd-btn rd-btn--ghost" data-act="keep">Keep ride</button><button class="rd-btn rd-btn--dark" data-act="cancel-yes">Cancel ride</button></div></div>' : '');
  }
  function stepDone() {
    const r = S.ride;
    return '<div class="rd-done"><div class="rd-done__mark">' + I('check') + '</div><h2>You have arrived</h2><p class="muted">' + esc(short(r.to)) + '</p>' +
      '<div class="rd-receipt"><div><span>Trip fare</span><b>' + inr(r.base) + '</b></div>' + (r.base > r.fare ? '<div><span>Coupon ' + esc(r.coupon) + '</span><b>- ' + inr(r.base - r.fare) + '</b></div>' : '') + '<div class="rd-receipt__tot"><span>Total · ' + esc(r.pay) + '</span><b>' + inr(r.fare) + '</b></div></div>' +
      '<div class="rd-rate"><p>How was your ride with ' + esc(D.drivers[S.driver].name.split(' ')[0]) + '?</p><div id="stars">' + stars(S.rating) + '</div></div>' +
      '<div class="rd-cta"><button class="rd-btn" type="button" data-act="new">Done</button></div></div>';
  }
  function historyView() {
    const all = rides().map((r) => ({ id: r.id, from: r.from, to: r.to, vehicle: r.vehicle, fare: r.fare, date: new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), status: r.status })).concat(D.pastRides);
    return seg() + '<h2 class="rd-title">Your rides</h2><ul class="rd-hist">' + all.map((r) =>
      '<li><div class="rd-hist__top"><b>' + esc(r.date) + ' · ' + esc(r.vehicle) + '</b><span class="badge ' + (r.status === 'Completed' ? 'badge--ok' : 'badge--bad') + '">' + r.status + '</span></div>' +
      '<div class="rd-trip rd-trip--flat"><div><span class="rd-dot rd-dot--a"></span><span>' + esc(short(r.from)) + '</span></div><div><span class="rd-dot rd-dot--b"></span><span>' + esc(short(r.to)) + '</span></div></div>' +
      '<div class="rd-hist__bot"><span class="muted small">' + esc(r.id) + '</span><b>' + inr(r.fare) + '</b></div></li>').join('') + '</ul><p class="small muted">Older rides are sample data.</p>';
  }

  /* ---------- render ---------- */
  function render() {
    panel.classList.toggle('is-track', S.step === 'track');
    panel.classList.toggle('is-tall', S.step === 'choose' || S.tab === 'history');
    panel.innerHTML = S.tab === 'history' ? historyView() : S.step === 'home' ? stepHome() : S.step === 'choose' ? stepChoose() : S.step === 'search' ? stepSearch() : S.step === 'track' ? stepTrack() : stepDone();
    if (S.tab === 'book' && S.step === 'home') bindHome();
    if (S.step === 'choose') SP.$$('input[name=veh]', panel).forEach((r) => r.addEventListener('change', () => { S.vehicle = r.value; render(); SP.$('input[name=veh]:checked', panel).focus(); drawTrip(); }));
  }
  function bindHome() {
    ['f', 't'].forEach((k) => {
      const inp = SP.$('#r' + k, panel), which = k === 'f' ? 'from' : 'to';
      inp.addEventListener('focus', () => { if (S.focus !== which) { S.focus = which; S.q = ''; render(); const n = SP.$('#r' + k, panel); n.value = ''; n.focus(); } });
      inp.addEventListener('input', () => { S.q = inp.value; const l = SP.$('.rd-sugg, .rd-empty', panel); const tmp = document.createElement('div'); tmp.innerHTML = sugg(); if (l) l.replaceWith(tmp.firstChild); });
    });
  }

  /* ---------- flow ---------- */
  function startSearch() {
    S.step = 'search'; render();
    timer = setTimeout(() => {
      S.driver = Math.floor(Math.random() * D.drivers.length);
      const f = fare(), r = rawFare();
      S.ride = { id: 'SP-' + (24100 + Math.floor(Math.random() * 800)), from: S.from, to: S.to, km: km(), mins: mins(), vehicle: veh().label, base: r, fare: f, coupon: S.coupon ? S.coupon.c : '', pay: S.pay, pin: String(1000 + Math.floor(Math.random() * 8999)), status: 'Active', date: new Date().toISOString() };
      const all = rides(); all.unshift(S.ride); saveRides(all);
      S.step = 'track'; S.phase = 'arriving'; S.cancelAsk = false; render(); drawTrip();
      // simulated captain arrival: progress bar and countdown
      const eta = ETA[S.vehicle];
      animate(7000, (k) => {
        progress(k);
        const e = SP.$('#eta'); if (e) e.textContent = Math.max(1, Math.ceil(eta * (1 - k)));
      }, () => { S.phase = 'arrived'; render(); });
    }, 3200);
  }
  function startTrip() {
    S.phase = 'ontrip'; render();
    animate(9000, progress, () => {
      const all = rides(); const i = all.findIndex((x) => x.id === S.ride.id); if (i > -1) { all[i].status = 'Completed'; saveRides(all); }
      S.step = 'done'; S.rating = 0; render();
    });
  }
  function reset() {
    clearTimeout(timer); cancelAnimationFrame(raf);
    S.step = 'home'; S.to = ''; S.from = TEMPLE; S.ride = null; S.focus = null; S.q = ''; S.coupon = null;
    render(); drawTrip();
  }

  panel.addEventListener('click', (e) => {
    const T = e.target.closest('[data-tab]');
    if (T) { S.tab = T.dataset.tab; history.replaceState(null, '', S.tab === 'history' ? '#my-rides' : '#book'); render(); return; }
    const su = e.target.closest('[data-sugg]');
    if (su) { S[S.focus] = su.dataset.sugg; S.focus = null; S.q = ''; if (S.from === S.to) S.to = ''; render(); drawTrip(); if (!S.to) SP.$('#rt', panel).focus(); return; }
    const sv = e.target.closest('[data-saved]');
    if (sv) { S.to = sv.dataset.saved; if (S.from === S.to) S.from = TEMPLE === S.to ? D.places[1].n : TEMPLE; render(); drawTrip(); return; }
    const q = e.target.closest('[data-quick]');
    if (q) { const r = D.quickRoutes[+q.dataset.quick]; S.from = r[0]; S.to = r[1]; render(); drawTrip(); return; }
    const tt = e.target.closest('[data-toast]'); if (tt) { SP.toast(tt.dataset.toast); return; }
    const st = e.target.closest('[data-star]'); if (st) { S.rating = +st.dataset.star; SP.$('#stars', panel).innerHTML = stars(S.rating); SP.toast('Thanks for rating'); return; }
    if (e.target.closest('#swap')) { const t = S.from; S.from = S.to || ''; S.to = t; S.focus = null; render(); drawTrip(); return; }
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'choose') { if (!place(S.from) || !place(S.to)) return; S.step = 'choose'; S.focus = null; render(); drawTrip(); }
    else if (act === 'edit') { S.step = 'home'; render(); drawTrip(); }
    else if (act === 'pay') { S.pay = S.pay === 'Cash' ? 'UPI' : 'Cash'; render(); }
    else if (act === 'coupon') couponSheet();
    else if (act === 'book') { SP.user() ? startSearch() : SP.openLogin(startSearch); }
    else if (act === 'cancel-search') { clearTimeout(timer); S.step = 'choose'; render(); }
    else if (act === 'start') startTrip();
    else if (act === 'cancel-ask') { S.cancelAsk = true; render(); }
    else if (act === 'keep') { S.cancelAsk = false; render(); }
    else if (act === 'cancel-yes') {
      cancelAnimationFrame(raf); const all = rides(); const i = all.findIndex((x) => x.id === S.ride.id); if (i > -1) { all[i].status = 'Cancelled'; saveRides(all); }
      SP.toast('Ride cancelled'); reset();
    } else if (act === 'new') reset();
  });
  function couponSheet() {
    const s = SP.sheet({ title: 'Apply coupon' });
    s.body.innerHTML = '<form id="cp" class="rd-cpform"><input class="input" id="cc" placeholder="Enter coupon code" autocomplete="off" value="' + esc(S.coupon ? S.coupon.c : '') + '"><button class="btn btn--primary" type="submit">Apply</button></form><div class="field__error" id="ce" role="alert"></div>' +
      '<ul class="rd-list">' + D.ridePromos.map((p) => '<li><button type="button" data-code="' + p.c + '"><span class="rd-sugg__ic">' + I('star') + '</span><span><b>' + p.c + '</b><small>' + p.t + '</small></span><span class="badge">Apply</span></button></li>').join('') + '</ul>' +
      (S.coupon ? '<button class="btn btn--outline btn--block" type="button" id="crm">Remove coupon</button>' : '');
    const ap = (c) => { const p = D.ridePromos.find((x) => x.c === c.trim().toUpperCase()); if (!p) { SP.$('#ce', s.body).textContent = 'This code is not valid.'; return; } S.coupon = p; s.close(); render(); SP.toast(p.c + ' applied'); };
    SP.$('#cp', s.body).addEventListener('submit', (e) => { e.preventDefault(); ap(SP.$('#cc', s.body).value); });
    SP.$$('[data-code]', s.body).forEach((b) => b.addEventListener('click', () => ap(b.dataset.code)));
    const rm = SP.$('#crm', s.body); if (rm) rm.addEventListener('click', () => { S.coupon = null; s.close(); render(); });
  }
  window.addEventListener('hashchange', () => { const t = location.hash === '#my-rides' ? 'history' : 'book'; if (t !== S.tab) { S.tab = t; render(); } });

  buildMap(); render(); drawTrip();
  if (window.ResizeObserver) { const ro = new ResizeObserver(fit); ro.observe(panel); } else window.addEventListener('resize', fit);
})();
