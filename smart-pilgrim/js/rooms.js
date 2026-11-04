/* Rooms & Hotels: a booking-site style search page.
   Search widget, offers, area shortcuts, filters, sorting, result cards and My bookings. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr, St = SP.stay;
  const view = SP.$('#view');
  const PRICE = [['any', 'Any price', 0, 1e9], ['u1500', 'Under ₹1,500', 0, 1500], ['1500', '₹1,500 – ₹3,000', 1500, 3000], ['3000', '₹3,000 – ₹5,000', 3000, 5000], ['5000', '₹5,000 and above', 5000, 1e9]];
  const SORT = [['pop', 'Popularity'], ['plow', 'Price: low to high'], ['phigh', 'Price: high to low'], ['rate', 'User rating'], ['near', 'Nearest to temple']];
  const FAC = ['Parking', 'Wi-Fi', 'Lift', 'Hot water', 'Power backup', 'Temple view'];
  const F = { cancel: false, bfast: false, food: false, ac: false, near: false, price: 'any', stars: [], rate: 0, area: 'all', fac: [], sort: 'pop' };
  const initial = St.get();
  F.price = initial.price || 'any'; F.area = initial.area || 'all';

  /* ---------- page shell ---------- */
  view.innerHTML =
    '<section class="stay-hero"><div class="stay-hero__art" aria-hidden="true">' + SP.art.render(['place', 'hill']) + '</div><div class="container stay-hero__in">' +
    '<p class="eyebrow">Rooms &amp; Hotels</p><h1>Find a stay near Arunachala</h1><p class="stay-hero__sub">Free cancellation on most rooms. Walk to the East Gopuram or start Girivalam from your door.</p></div></section>' +
    '<div class="container"><form class="sb" id="sb" novalidate aria-label="Search stays"></form>' +
    '<div id="bk-area"></div>' +
    '<div id="home-area"></div><div class="stay-body" id="results"></div></div>';

  const sb = SP.$('#sb');
  function drawSearch() {
    const s = St.get();
    sb.innerHTML =
      '<label class="sb__f sb__f--loc"><span class="sb__l">City / Area</span><select id="sbArea" class="sb__in" aria-label="Area"><option value="all">Thiruvannamalai</option>' + D.areas.map((a) => '<option value="' + esc(a.n) + '"' + (s.area === a.n ? ' selected' : '') + '>' + esc(a.n) + '</option>').join('') + '</select><span class="sb__s">' + (s.area === 'all' ? 'All areas, Tamil Nadu' : 'Tamil Nadu, India') + '</span></label>' +
      '<label class="sb__f"><span class="sb__l">Check-in</span><input type="date" id="sbCi" class="sb__in" min="' + St.today() + '" value="' + s.ci + '"><span class="sb__s" id="sbCiT">' + St.fmtShort(s.ci) + '<small>' + St.weekday(s.ci) + '</small></span></label>' +
      '<label class="sb__f"><span class="sb__l">Check-out</span><input type="date" id="sbCo" class="sb__in" min="' + St.addDays(s.ci, 1) + '" value="' + s.co + '"><span class="sb__s" id="sbCoT">' + St.fmtShort(s.co) + '<small>' + St.weekday(s.co) + ' · ' + St.nights(s) + ' night' + (St.nights(s) > 1 ? 's' : '') + '</small></span></label>' +
      '<button class="sb__f sb__f--btn" type="button" id="sbG"><span class="sb__l">Rooms &amp; guests</span><span class="sb__in sb__in--txt">' + St.guestText(s) + '</span><span class="sb__s">' + (s.kids ? s.kids + ' child' + (s.kids > 1 ? 'ren' : '') : 'Adults only') + '</span></button>' +
      '<label class="sb__f"><span class="sb__l">Price per night</span><select id="sbPrice" class="sb__in" aria-label="Price per night">' + PRICE.map((p) => '<option value="' + p[0] + '"' + (s.price === p[0] ? ' selected' : '') + '>' + p[1] + '</option>').join('') + '</select><span class="sb__s">Sample prices</span></label>' +
      '<button class="sb__go" type="submit">' + I('route') + 'Search</button>';
  }
  drawSearch();
  sb.addEventListener('change', (e) => {
    const id = e.target.id;
    if (id === 'sbCi') { St.set({ ci: e.target.value }); drawSearch(); }
    else if (id === 'sbCo') { St.set({ co: e.target.value }); drawSearch(); }
    else if (id === 'sbArea') { St.set({ area: e.target.value }); F.area = e.target.value; }
    else if (id === 'sbPrice') { St.set({ price: e.target.value }); F.price = e.target.value; }
  });
  sb.addEventListener('click', (e) => { if (e.target.closest('#sbG')) St.guestsSheet(() => { drawSearch(); renderResults(); }); });
  sb.addEventListener('submit', (e) => { e.preventDefault(); showList(); renderResults(); SP.$('#results').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

  /* ---------- offers + areas ---------- */
  function drawHome() {
    SP.$('#home-area').innerHTML =
      '<div class="sec-head"><h2>Offers for your stay</h2></div><div class="scroller offers">' + D.hotelOffers.map((o) => '<article class="offer offer--' + o.c + '"><div><b>' + esc(o.t) + '</b><p>' + esc(o.s) + '</p></div>' + I(o.c === 'a' ? 'flame' : o.c === 'b' ? 'check' : 'bag') + '</article>').join('') + '</div>' +
      '<div class="sec-head"><h2>Popular areas</h2></div><div class="areas">' + D.areas.map((a, i) => '<button class="area" type="button" data-area="' + esc(a.n) + '">' + SP.media({ art: a.art, slug: 'area-' + SP.slug(a.n), alt: a.n }) + '<span><b>' + esc(a.n) + '</b><small>' + esc(a.sub) + '</small></span></button>').join('') + '</div>';
  }

  /* ---------- filtering ---------- */
  const priceBand = () => PRICE.find((p) => p[0] === F.price) || PRICE[0];
  function apply() {
    const [, , lo, hi] = priceBand();
    let list = D.hotels.filter((h) => {
      const min = Math.min.apply(null, h.rooms.map((r) => r.p));
      if (min < lo || min >= hi) return false;
      if (F.cancel && !h.freeCancel) return false;
      if (F.bfast && !h.breakfast) return false;
      if (F.food && !h.food) return false;
      if (F.ac && !/AC/.test(h.ac)) return false;
      if (F.near && h.km > 1.5) return false;
      if (F.stars.length && !F.stars.includes(h.stars)) return false;
      if (F.rate && h.rating < F.rate) return false;
      if (F.area !== 'all') { const a = D.areas.find((x) => x.n === F.area); if (a.f.area && h.area !== a.f.area) return false; if (a.f.maxKm && h.km > a.f.maxKm) return false; }
      if (F.fac.length && !F.fac.every((f) => h.facilities.includes(f))) return false;
      return true;
    });
    const minp = (h) => Math.min.apply(null, h.rooms.map((r) => r.p));
    const by = { pop: (a, b) => b.reviews - a.reviews, plow: (a, b) => minp(a) - minp(b), phigh: (a, b) => minp(b) - minp(a), rate: (a, b) => b.rating - a.rating, near: (a, b) => a.km - b.km };
    return list.sort(by[F.sort]);
  }
  const active = () => (F.cancel ? 1 : 0) + (F.bfast ? 1 : 0) + (F.food ? 1 : 0) + (F.ac ? 1 : 0) + (F.near ? 1 : 0) + (F.price !== 'any' ? 1 : 0) + F.stars.length + (F.rate ? 1 : 0) + (F.area !== 'all' ? 1 : 0) + F.fac.length;
  const chk = (k, label, on, extra) => '<label class="chk"><input type="checkbox" data-f="' + k + '"' + (extra ? ' data-v="' + extra + '"' : '') + (on ? ' checked' : '') + '><span>' + label + '</span></label>';
  function filtersHTML(idp) {
    return '<div class="fl"><div class="fl__head"><b>Filters</b><button type="button" class="linkbtn" data-reset' + (active() ? '' : ' hidden') + '>Clear all</button></div>' +
      '<fieldset><legend>Popular</legend>' + chk('cancel', 'Free cancellation', F.cancel) + chk('bfast', 'Breakfast included', F.bfast) + chk('food', 'Restaurant on site', F.food) + chk('ac', 'AC rooms', F.ac) + chk('near', 'Within 1.5 km of the temple', F.near) + '</fieldset>' +
      '<fieldset><legend>Price per night</legend>' + PRICE.map((p) => '<label class="chk"><input type="radio" name="' + idp + 'pr" data-f="price" data-v="' + p[0] + '"' + (F.price === p[0] ? ' checked' : '') + '><span>' + p[1] + '</span></label>').join('') + '</fieldset>' +
      '<fieldset><legend>Star category</legend>' + [4, 3, 2].map((n) => chk('stars', n + ' star', F.stars.includes(n), n)).join('') + '</fieldset>' +
      '<fieldset><legend>Guest rating</legend>' + [[4.5, 'Excellent: 4.5 and above'], [4, 'Very good: 4 and above'], [3.5, 'Good: 3.5 and above']].map((r) => '<label class="chk"><input type="radio" name="' + idp + 'rt" data-f="rate" data-v="' + r[0] + '"' + (F.rate === r[0] ? ' checked' : '') + '><span>' + r[1] + '</span></label>').join('') + '</fieldset>' +
      '<fieldset><legend>Area</legend>' + [['all', 'All areas']].concat(D.areas.map((a) => [a.n, a.n])).map((a) => '<label class="chk"><input type="radio" name="' + idp + 'ar" data-f="area" data-v="' + esc(a[0]) + '"' + (F.area === a[0] ? ' checked' : '') + '><span>' + esc(a[1]) + '</span></label>').join('') + '</fieldset>' +
      '<fieldset><legend>Facilities</legend>' + FAC.map((f) => chk('fac', f, F.fac.includes(f), f)).join('') + '</fieldset></div>';
  }
  function onFilter(e) {
    const el = e.target.closest('[data-f]'); if (!el) return;
    const k = el.dataset.f, v = el.dataset.v;
    if (el.type === 'checkbox' && !v) F[k] = el.checked;
    else if (el.type === 'checkbox') { const val = k === 'stars' ? +v : v, a = F[k], i = a.indexOf(val); if (el.checked && i < 0) a.push(val); else if (!el.checked && i > -1) a.splice(i, 1); }
    else if (k === 'rate') F.rate = +v;
    else F[k] = v;
    if (k === 'price') St.set({ price: F.price });
    if (k === 'area') St.set({ area: F.area });
    renderResults(true);
  }
  function reset() { Object.assign(F, { cancel: false, bfast: false, food: false, ac: false, near: false, price: 'any', stars: [], rate: 0, area: 'all', fac: [] }); St.set({ price: 'any', area: 'all' }); drawSearch(); renderResults(); }

  /* ---------- results ---------- */
  const out = SP.$('#results');
  function renderResults(keepSheet) {
    const list = apply(), s = St.get(), n = active();
    out.innerHTML =
      '<aside class="stay-filters" aria-label="Filters">' + filtersHTML('d') + '</aside>' +
      '<div class="stay-main"><div class="stay-top"><div><h2 class="stay-count">' + list.length + ' propert' + (list.length === 1 ? 'y' : 'ies') + ' in Thiruvannamalai</h2><p class="small muted">' + St.fmt(s.ci) + ' to ' + St.fmt(s.co) + ' · ' + St.guestText(s) + '</p></div>' +
      '<button class="btn btn--soft btn--sm stay-fbtn" type="button" data-open-filters>' + I('grid') + 'Filters' + (n ? ' (' + n + ')' : '') + '</button></div>' +
      '<div class="sortbar" role="group" aria-label="Sort"><span class="small muted">Sort by</span>' + SORT.map((o) => '<button type="button" class="chip chip--sm" data-sort="' + o[0] + '" aria-pressed="' + (F.sort === o[0]) + '">' + o[1] + '</button>').join('') + '</div>' +
      (list.length ? '<div class="hlist">' + list.map((h) => St.card(h, s)).join('') + '</div>' : '<div class="empty"><b>No stays match these filters</b><p>Try a wider price range or clear a filter.</p><button class="btn btn--outline" type="button" data-reset>Clear all filters</button></div>') +
      '<p class="small muted" style="margin-top:14px">Sample hotels and prices for the design preview. Prices are per room per night. Verify each stay locally before launch.</p></div>';
    if (keepSheet && sheetUpdate) sheetUpdate(list.length);
  }
  out.addEventListener('change', onFilter);
  out.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { reset(); return; }
    const so = e.target.closest('[data-sort]'); if (so) { F.sort = so.dataset.sort; renderResults(); return; }
    const w = e.target.closest('[data-wish]'); if (w) { e.preventDefault(); const on = St.toggleWish(w.dataset.wish); w.setAttribute('aria-pressed', on); SP.toast(on ? 'Saved to your list' : 'Removed from your list'); return; }
    if (e.target.closest('[data-open-filters]')) openFilters();
  });
  let sheetUpdate = null;
  function openFilters() {
    const s = SP.sheet({ title: 'Filters', foot: '' });
    const draw = () => { s.body.innerHTML = filtersHTML('m'); s.foot.innerHTML = '<button class="btn btn--primary btn--block btn--lg" type="button" id="fok">Show ' + apply().length + ' properties</button>'; SP.$('#fok', s.foot).addEventListener('click', () => s.close()); };
    draw();
    s.body.addEventListener('change', (e) => { onFilter(e); draw(); });
    s.body.addEventListener('click', (e) => { if (e.target.closest('[data-reset]')) { reset(); draw(); } });
    sheetUpdate = null;
  }
  SP.$('#home-area').addEventListener('click', (e) => {
    const a = e.target.closest('[data-area]'); if (!a) return;
    F.area = a.dataset.area; St.set({ area: F.area }); drawSearch(); renderResults(); out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- My bookings ---------- */
  function showBookings() {
    SP.$('#home-area').hidden = true; out.hidden = true; sb.hidden = true;
    const all = St.bookings();
    SP.$('#bk-area').innerHTML = '<div class="mybk"><div class="sec-head" style="margin-top:28px"><h2>My bookings</h2><a href="rooms.html">Find a stay</a></div>' +
      (all.length ? all.map((b) => { const h = St.hotel(b.hotel); return '<article class="mybk__item" data-b="' + b.id + '">' + SP.media(St.photo(h, 0)) + '<div class="mybk__info"><div class="mybk__top"><b>' + esc(h.name) + '</b><span class="badge ' + (b.status === 'Cancelled' ? 'badge--bad' : 'badge--ok') + '">' + b.status + '</span></div><p class="small muted">' + St.fmt(b.ci) + ' to ' + St.fmt(b.co) + ' · ' + (b.adults + b.kids) + ' guests · ' + b.id + '</p><b>' + inr(b.total) + '</b>' +
        '<div class="mybk__act"><button class="btn btn--outline btn--sm" type="button" data-view-b="' + b.id + '">View voucher</button>' + (b.status !== 'Cancelled' ? '<button class="btn btn--ghost btn--sm" type="button" data-cancel-b="' + b.id + '">Cancel</button>' : '') + '</div></div></article>'; }).join('')
        : '<div class="empty"><b>No bookings yet</b><p>Your confirmed stays will appear here.</p><a class="btn btn--primary" href="rooms.html">Find a stay</a></div>') + '</div>';
  }
  function showList() { SP.$('#bk-area').innerHTML = ''; SP.$('#home-area').hidden = false; out.hidden = false; sb.hidden = false; }
  SP.$('#bk-area').addEventListener('click', (e) => {
    const v = e.target.closest('[data-view-b]');
    if (v) { const b = St.bookings().find((x) => x.id === v.dataset.viewB); const s = SP.sheet({ title: 'Booking voucher' }); s.body.innerHTML = St.voucher(b); return; }
    const c = e.target.closest('[data-cancel-b]');
    if (c) { const all = St.bookings(), b = all.find((x) => x.id === c.dataset.cancelB); if (b) { b.status = 'Cancelled'; St.saveBookings(all); SP.toast('Booking cancelled'); showBookings(); } }
  });
  const route = () => { if (location.hash === '#bookings') showBookings(); else { showList(); } };
  window.addEventListener('hashchange', route);
  drawHome(); renderResults(); route();
})();
