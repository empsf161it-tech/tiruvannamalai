/* Hotel detail: gallery, rooms, amenities, reviews, location, policies and the booking card. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr, St = SP.stay;
  const view = SP.$('#view');
  const id = (location.hash || '').slice(1);
  const h = St.hotel(id);
  if (!h) {
    view.innerHTML = '<div class="container" style="padding-block:60px"><div class="empty"><b>We could not find that hotel</b><p>The link may be old.</p><a class="btn btn--primary" href="rooms.html">See all hotels</a></div></div>';
    return;
  }
  document.title = h.name + ' | Thiruvannamalai Smart Pilgrim';
  let sel = h.rooms[0].id;
  const room = () => h.rooms.find((r) => r.id === sel);
  const FI = { 'Hot water': 'flame', Parking: 'parking', 'Large parking': 'parking', 'Wi-Fi': 'cloud', Restaurant: 'food', Lift: 'grid', 'Power backup': 'lamp', 'Temple view': 'pin', Courtyard: 'home', 'Room service': 'bowl', 'Rooftop view': 'map', Balcony: 'map', 'Breakfast included': 'food', 'Luggage room': 'bag', 'Early check-in': 'clock', '24-hour check-in': 'clock' };
  const near = [['Arunachaleswarar Temple (East Gopuram)', h.km], ['Tiruvannamalai Bus Stand', Math.round((h.km + 0.8) * 10) / 10], ['Tiruvannamalai Railway Station', Math.round((h.km + 1.2) * 10) / 10], ['Girivalam path', Math.max(0.2, Math.round((h.km - 0.6) * 10) / 10)]];
  const avg = (o) => { const v = Object.values(o); return v.reduce((a, b) => a + b, 0) / v.length; };

  const bar = (k, v) => '<div class="rbar"><span>' + k + '</span><i><b style="width:' + Math.round(Math.min(5, v) / 5 * 100) + '%"></b></i><em>' + Math.min(5, v).toFixed(1) + '</em></div>';

  function roomCard(r) {
    const q = St.quote(r, Object.assign({}, St.get(), { rooms: 1 }));
    const on = r.id === sel;
    return '<article class="rc' + (on ? ' is-on' : '') + '" data-room="' + r.id + '">' + SP.media({ art: r.art, slug: h.slug + '-' + SP.slug(r.n), alt: h.name + ' ' + r.n }) +
      '<div class="rc__body"><h3>' + esc(r.n) + '</h3><p class="rc__meta">' + r.size + ' sq ft · ' + esc(r.bed) + ' · fits ' + r.g + ' guest' + (r.g > 1 ? 's' : '') + '</p>' +
      '<ul class="rc__incl">' + r.incl.map((x) => '<li>' + I('check') + esc(x) + '</li>').join('') + '</ul>' +
      '<p class="rc__cx ' + (r.freeCancel ? 'ok' : 'bad') + '">' + (r.freeCancel ? 'Free cancellation until 24 hours before check-in' : 'Non-refundable') + '</p>' +
      (r.left <= 3 ? '<p class="hc__low">' + I('alert') + 'Only ' + r.left + ' left</p>' : '') + '</div>' +
      '<div class="rc__price"><s>' + inr(r.mrp) + '</s><b>' + inr(r.p) + '</b><small>+ ' + inr(Math.round(r.p * St.taxRate(r.p))) + ' taxes &amp; fees<br>per night</small>' +
      '<button class="btn ' + (on ? 'btn--primary' : 'btn--outline') + ' btn--sm" type="button" data-select="' + r.id + '">' + (on ? 'Selected' : 'Select room') + '</button></div></article>';
  }
  function reviewsHTML() {
    return '<div class="rv"><div class="rv__sum"><div class="rv__big"><b>' + h.rating.toFixed(1) + '</b><span>' + St.ratingLabel(h.rating) + '</span><small>' + h.reviews.toLocaleString('en-IN') + ' ratings</small></div>' +
      '<div class="rv__bars">' + Object.entries(h.ratings).map((e) => bar(e[0], e[1])).join('') + '</div></div>' +
      '<ul class="rv__list">' + h.reviewList.map((r) => '<li><div class="rv__top"><span class="rd-avatar rd-avatar--sm">' + esc(r.name[0]) + '</span><div><b>' + esc(r.name) + '</b><small>' + esc(r.from) + ' · ' + esc(r.when) + '</small></div><span class="ratebox ratebox--sm"><b>' + r.stars.toFixed(1) + '</b></span></div><p>' + esc(r.text) + '</p><small class="muted">Sample review</small></li>').join('') + '</ul></div>';
  }
  function aside() {
    const st = St.get(), r = room(), q = St.quote(r, st);
    return '<div class="bcard"><div class="bcard__price"><s>' + inr(r.mrp) + '</s><b>' + inr(r.p) + '</b><span class="offpill">' + h.off + '% off</span></div><p class="small muted">per night · + ' + inr(Math.round(r.p * St.taxRate(r.p))) + ' taxes &amp; fees</p>' +
      '<div class="bcard__box"><div class="bcard__dates"><label><small>Check-in</small><input type="date" id="bci" min="' + St.today() + '" value="' + st.ci + '"></label><label><small>Check-out</small><input type="date" id="bco" min="' + St.addDays(st.ci, 1) + '" value="' + st.co + '"></label></div>' +
      '<button type="button" class="bcard__g" id="bg"><small>Rooms &amp; guests</small><b>' + St.guestText(st) + '</b>' + I('chev') + '</button></div>' +
      '<p class="bcard__room"><small>Selected room</small><b>' + esc(r.n) + '</b></p>' +
      '<div class="fare-lines"><div><span>' + q.n + ' night' + (q.n > 1 ? 's' : '') + ' × ' + st.rooms + ' room' + (st.rooms > 1 ? 's' : '') + '</span><span class="tnum">' + inr(q.base) + '</span></div><div><span>Taxes &amp; fees</span><span class="tnum">' + inr(q.tax) + '</span></div><div class="total"><span>Total</span><span class="tnum">' + inr(q.total) + '</span></div></div>' +
      (St.capacity(r, st) ? '' : '<p class="bk__warn">' + I('alert') + 'Add a room: this room fits ' + r.g + ' guest' + (r.g > 1 ? 's' : '') + '.</p>') +
      '<button class="btn btn--primary btn--lg btn--block" type="button" data-book>Book this now</button><p class="small muted" style="text-align:center">' + (r.freeCancel ? 'Free cancellation available' : 'Non-refundable rate') + '</p></div>';
  }
  function draw() {
    const w = St.wish().includes(h.id);
    view.innerHTML =
      '<div class="container hd">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="rooms.html">Hotels</a><span>/</span><span aria-current="page">' + esc(h.name) + '</span></nav>' +
      '<header class="hd__head"><div><h1>' + esc(h.name) + ' ' + St.starsRow(h.stars) + '</h1><p class="hd__loc">' + I('pin') + esc(h.area) + ', Thiruvannamalai · <b>' + h.km + ' km</b> from the temple · ' + esc(h.type) + '</p></div>' +
      '<div class="hd__rate"><span><b>' + St.ratingLabel(h.rating) + '</b><small>' + h.reviews.toLocaleString('en-IN') + ' ratings</small></span>' + St.rateBox(h) +
      '<button class="icon-btn heart" type="button" id="hw" aria-pressed="' + w + '" aria-label="Save hotel">' + I('heart') + '</button></div></header>' +
      '<div class="hg" id="hg" role="group" aria-label="Photos">' + h.gallery.map((g, i) => '<button type="button" class="hg__i hg__i--' + i + '" data-photo="' + i + '" aria-label="Open photo ' + (i + 1) + ': ' + h.galleryLabels[i] + '">' + SP.media(St.photo(h, i)) + (i === 0 ? '<span class="hg__ct">' + I('grid') + ' ' + h.gallery.length + ' photos</span>' : '') + '</button>').join('') + '</div>' +
      '<nav class="subnav" aria-label="Sections">' + [['rooms', 'Rooms'], ['about', 'Overview'], ['amen', 'Amenities'], ['rev', 'Reviews'], ['loc', 'Location'], ['pol', 'Policies']].map((t) => '<a href="#sec-' + t[0] + '" data-sec="' + t[0] + '">' + t[1] + '</a>').join('') + '</nav>' +
      '<div class="hd__grid"><div class="hd__main">' +
      '<section id="sec-rooms" class="hsec"><h2>Choose your room</h2><div class="rooms">' + h.rooms.map(roomCard).join('') + '</div></section>' +
      '<section id="sec-about" class="hsec"><h2>About this stay</h2><p>' + esc(h.about) + '</p><div class="tags" style="margin-top:12px">' + (h.freeCancel ? '<span class="tag tag--ok">' + I('check') + 'Free cancellation</span>' : '') + (h.breakfast ? '<span class="tag tag--ok">' + I('check') + 'Breakfast included</span>' : '') + (h.food ? '<span class="tag">Restaurant on site</span>' : '') + '<span class="tag">' + esc(h.ac) + '</span></div></section>' +
      '<section id="sec-amen" class="hsec"><h2>Amenities</h2><ul class="amen">' + h.facilities.map((f) => '<li>' + I(FI[f] || 'check') + esc(f) + '</li>').join('') + '</ul></section>' +
      '<section id="sec-rev" class="hsec"><h2>Guest reviews</h2>' + reviewsHTML() + '</section>' +
      '<section id="sec-loc" class="hsec"><h2>Location</h2><div class="loc2"><div class="loc2__map">' + SP.gmap({ q: (h.area || 'East Gopuram Street') + ', near Arunachaleswarar Temple', z: 15, title: 'Google Map of the area around ' + h.name }) + '</div><ul class="near">' + near.map((n) => '<li><span>' + esc(n[0]) + '</span><b>' + n[1] + ' km</b></li>').join('') + '</ul></div><a class="btn btn--outline" href="' + St.mapsUrl(h) + '" target="_blank" rel="noopener">' + I('nav') + 'Open in Google Maps</a></section>' +
      '<section id="sec-pol" class="hsec"><h2>Policies</h2><div class="accordion">' + h.policies.map((p, i) => '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(p[0]) + I('chev') + '</summary><div class="acc__body"><p>' + esc(p[1]) + '</p></div></details>').join('') + '</div></section>' +
      '</div><aside class="hd__aside" id="aside">' + aside() + '</aside></div></div>' +
      '<div class="mbar" id="mbar"><div><s>' + inr(room().mrp) + '</s> <b>' + inr(room().p) + '</b><small>per night + taxes</small></div><button class="btn btn--primary" type="button" data-book>Book now</button></div>';
  }
  draw();

  /* ---------- gallery lightbox ---------- */
  function lightbox(start) {
    let i = start;
    const s = SP.sheet({ title: esc(h.name), full: true });
    const paint = () => {
      s.body.innerHTML = '<div class="lb"><div class="lb__stage">' + SP.media(St.photo(h, i)) + '<button class="lb__nav lb__nav--p" type="button" data-d="-1" aria-label="Previous photo">' + I('left') + '</button><button class="lb__nav lb__nav--n" type="button" data-d="1" aria-label="Next photo">' + I('right') + '</button></div>' +
        '<p class="lb__cap"><b>' + h.galleryLabels[i] + '</b> · ' + (i + 1) + ' of ' + h.gallery.length + '</p><div class="lb__thumbs">' + h.gallery.map((g, k) => '<button type="button" data-k="' + k + '" aria-label="Photo ' + (k + 1) + '"' + (k === i ? ' aria-current="true"' : '') + '>' + SP.media(St.photo(h, k)) + '</button>').join('') + '</div></div>';
    };
    s.body.addEventListener('click', (e) => { const n = e.target.closest('[data-d]'), t = e.target.closest('[data-k]'); if (n) i = (i + +n.dataset.d + h.gallery.length) % h.gallery.length; else if (t) i = +t.dataset.k; else return; paint(); });
    s.root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { i = (i + 1) % h.gallery.length; paint(); } if (e.key === 'ArrowLeft') { i = (i - 1 + h.gallery.length) % h.gallery.length; paint(); } });
    paint();
  }

  /* ---------- events ---------- */
  const refresh = () => { SP.$('#aside').innerHTML = aside(); const m = SP.$('#mbar'); m.firstElementChild.innerHTML = '<s>' + inr(room().mrp) + '</s> <b>' + inr(room().p) + '</b><small>per night + taxes</small>'; SP.$$('.rc').forEach((c) => { const on = c.dataset.room === sel; c.classList.toggle('is-on', on); const b = SP.$('[data-select]', c); b.textContent = on ? 'Selected' : 'Select room'; b.className = 'btn btn--sm ' + (on ? 'btn--primary' : 'btn--outline'); }); };
  view.addEventListener('click', (e) => {
    const p = e.target.closest('[data-photo]'); if (p) { lightbox(+p.dataset.photo); return; }
    const se = e.target.closest('[data-select]'); if (se) { sel = se.dataset.select; refresh(); if (innerWidth < 980) SP.toast(room().n + ' selected'); return; }
    if (e.target.closest('[data-book]')) { St.book(h, sel); return; }
    if (e.target.closest('#bg')) { St.guestsSheet(refresh); return; }
    const hw = e.target.closest('#hw'); if (hw) { const on = St.toggleWish(h.id); hw.setAttribute('aria-pressed', on); SP.toast(on ? 'Saved to your list' : 'Removed from your list'); return; }
    const sec = e.target.closest('[data-sec]'); if (sec) { e.preventDefault(); const t = SP.$('#sec-' + sec.dataset.sec); if (t) { const y = t.getBoundingClientRect().top + scrollY - 124; scrollTo({ top: y, behavior: 'smooth' }); } }
  });
  view.addEventListener('change', (e) => {
    if (e.target.id === 'bci') { St.set({ ci: e.target.value }); refresh(); }
    if (e.target.id === 'bco') { St.set({ co: e.target.value }); refresh(); }
  });
  // highlight the current section in the sub navigation
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) SP.$$('.subnav a').forEach((a) => a.classList.toggle('is-on', a.dataset.sec === x.target.id.slice(4))); }), { rootMargin: '-30% 0px -60% 0px' });
    SP.$$('.hsec').forEach((n) => io.observe(n));
  }
  window.addEventListener('hashchange', () => { if (/^#h\d+$/.test(location.hash)) location.reload(); });
})();
