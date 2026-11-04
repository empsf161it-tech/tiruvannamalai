/* Stay: shared helpers for the hotel list and hotel detail pages.
   Search state, price maths, hotel cards and the booking flow.
   Front-end preview only: availability, payment and vouchers are simulated. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr;
  const St = (SP.stay = {});

  /* ---------- dates + search state ---------- */
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  St.today = () => iso(new Date());
  St.fmt = (s, long) => parse(s).toLocaleDateString('en-IN', long ? { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' } : { weekday: 'short', day: 'numeric', month: 'short' });
  St.fmtShort = (s) => { const d = parse(s); return d.getDate() + ' ' + d.toLocaleDateString('en-IN', { month: 'short' }) + ' \u2019' + String(d.getFullYear()).slice(2); };
  St.weekday = (s) => parse(s).toLocaleDateString('en-IN', { weekday: 'long' });
  St.defaults = () => {
    // default to the night before Karthigai Deepam, or tomorrow once that has passed
    let ci = addDays(D.festival.date, -1);
    if (ci <= St.today()) ci = addDays(St.today(), 1);
    return { ci, co: addDays(ci, 2), rooms: 1, adults: 2, kids: 0, area: 'all', price: 'any' };
  };
  St.get = () => {
    const s = Object.assign(St.defaults(), SP.store.get('stay', {}));
    if (s.ci < St.today()) { const d = St.defaults(); s.ci = d.ci; s.co = d.co; }
    if (s.co <= s.ci) s.co = addDays(s.ci, 1);
    return s;
  };
  St.set = (patch) => { const s = Object.assign(St.get(), patch); if (s.co <= s.ci) s.co = addDays(s.ci, 1); SP.store.set('stay', s); return s; };
  St.nights = (s) => Math.max(1, Math.round((parse((s || St.get()).co) - parse((s || St.get()).ci)) / 864e5));
  St.guestText = (s) => { s = s || St.get(); const g = s.adults + s.kids; return s.rooms + ' room' + (s.rooms > 1 ? 's' : '') + ', ' + g + ' guest' + (g > 1 ? 's' : ''); };
  St.addDays = addDays;
  St.hotel = (id) => D.hotels.find((h) => h.id === id);

  /* ---------- helpers ---------- */
  St.ratingLabel = (r) => (r >= 4.5 ? 'Excellent' : r >= 4 ? 'Very Good' : r >= 3.5 ? 'Good' : 'Average');
  St.starsRow = (n) => '<span class="stars" aria-label="' + n + ' star hotel">' + '★'.repeat(n) + '</span>';
  St.rateBox = (h) => '<span class="ratebox"><b>' + h.rating.toFixed(1) + '</b></span>';
  St.wish = () => SP.store.get('wish:hotels', []);
  St.toggleWish = (id) => { const w = St.wish(), i = w.indexOf(id); if (i > -1) w.splice(i, 1); else w.push(id); SP.store.set('wish:hotels', w); return i === -1; };
  St.photo = (h, i) => ({ art: h.gallery[i || 0], slug: h.slug + (i ? '-' + (i + 1) : ''), alt: h.name + ' ' + h.galleryLabels[i || 0].toLowerCase() });
  St.taxRate = (p) => (p > 7500 ? 0.18 : p > 1000 ? 0.12 : 0);
  St.quote = (room, s, pct) => {
    s = s || St.get();
    const n = St.nights(s), base = room.p * n * s.rooms, disc = Math.round(base * (pct || 0) / 100), tax = Math.round((base - disc) * St.taxRate(room.p));
    return { n, base, disc, tax, total: base - disc + tax, mrp: room.mrp * n * s.rooms };
  };
  St.capacity = (room, s) => room.g * (s || St.get()).rooms >= (s || St.get()).adults + (s || St.get()).kids;
  St.mapsUrl = (h) => SP.mapsUrl(h.name);
  St.bookings = () => SP.store.get('stays', []);
  St.saveBookings = (b) => SP.store.set('stays', b);

  /* ---------- hotel card (list) ---------- */
  St.card = (h, s) => {
    s = s || St.get();
    const rm = h.rooms.reduce((a, b) => (a.p <= b.p ? a : b)), q = St.quote(rm, Object.assign({}, s, { rooms: 1 }));
    const left = Math.min.apply(null, h.rooms.map((r) => r.left));
    const w = St.wish().includes(h.id);
    const tags = [h.freeCancel ? '<span class="tag tag--ok">' + I('check') + 'Free cancellation</span>' : '', h.breakfast ? '<span class="tag tag--ok">' + I('check') + 'Breakfast included</span>' : '', h.food && !h.breakfast ? '<span class="tag">Restaurant</span>' : ''].join('');
    return '<article class="hc" data-id="' + h.id + '">' +
      '<a class="hc__gal" href="hotel.html#' + h.id + '" aria-label="View ' + esc(h.name) + '">' +
      '<span class="hc__main">' + SP.media(St.photo(h, 0)) + (h.tag ? '<span class="ribbon">' + esc(h.tag) + '</span>' : '') + '<span class="hc__count">' + I('grid') + h.gallery.length + ' photos</span></span>' +
      '<span class="hc__thumbs">' + SP.media(St.photo(h, 1)) + SP.media(St.photo(h, 2)) + '</span></a>' +
      '<button class="hc__heart heart" type="button" data-wish="' + h.id + '" aria-pressed="' + w + '" aria-label="Save ' + esc(h.name) + '">' + I('heart') + '</button>' +
      '<div class="hc__mid"><div class="hc__title"><h3><a href="hotel.html#' + h.id + '">' + esc(h.name) + '</a></h3>' + St.starsRow(h.stars) + '</div>' +
      '<p class="hc__loc">' + I('pin') + '<span>' + esc(h.area) + ' · <b>' + h.km + ' km</b> from Arunachaleswarar Temple</span></p>' +
      '<div class="tags">' + tags + '</div>' +
      '<ul class="hc__fac">' + h.facilities.slice(0, 4).map((f) => '<li>' + esc(f) + '</li>').join('') + '</ul>' +
      '<p class="hc__type">' + esc(h.type) + ' · ' + esc(h.ac) + '</p>' +
      (left <= 3 ? '<p class="hc__low">' + I('alert') + 'Only ' + left + ' room' + (left > 1 ? 's' : '') + ' left at this price</p>' : '') + '</div>' +
      '<div class="hc__right"><div class="hc__rate"><span><b>' + St.ratingLabel(h.rating) + '</b><small>' + h.reviews.toLocaleString('en-IN') + ' ratings</small></span>' + St.rateBox(h) + '</div>' +
      '<div class="hc__price"><s>' + inr(rm.mrp) + '</s><b>' + inr(rm.p) + '</b><small>+ ' + inr(Math.round(rm.p * St.taxRate(rm.p))) + ' taxes &amp; fees · per night</small>' +
      '<span class="offpill">' + h.off + '% off</span></div>' +
      '<a class="btn btn--primary btn--sm hc__cta" href="hotel.html#' + h.id + '">View rooms</a></div></article>';
  };

  /* ---------- guests sheet ---------- */
  St.guestsSheet = (done) => {
    const s0 = St.get(), v = { rooms: s0.rooms, adults: s0.adults, kids: s0.kids };
    const s = SP.sheet({ title: 'Rooms & guests', foot: '' });
    const rows = [['rooms', 'Rooms', '', 1, 6], ['adults', 'Adults', '12 years and above', 1, 18], ['kids', 'Children', '0 to 11 years', 0, 6]];
    const draw = () => {
      s.body.innerHTML = '<div class="gs">' + rows.map((r) => '<div class="gs__row"><div><b>' + r[1] + '</b><small>' + r[2] + '</small></div><div class="qty"><button type="button" data-k="' + r[0] + '" data-d="-1" aria-label="Fewer ' + r[1].toLowerCase() + '"' + (v[r[0]] <= r[3] ? ' disabled' : '') + '>' + I('minus') + '</button><output>' + v[r[0]] + '</output><button type="button" data-k="' + r[0] + '" data-d="1" aria-label="More ' + r[1].toLowerCase() + '"' + (v[r[0]] >= r[4] ? ' disabled' : '') + '>' + I('plus') + '</button></div></div>').join('') + '</div>';
      s.foot.innerHTML = '<button class="btn btn--primary btn--block btn--lg" type="button" id="gsok">Apply</button>';
      SP.$('#gsok', s.foot).addEventListener('click', () => { St.set(v); s.close(); if (done) done(); });
    };
    s.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-k]'); if (!b) return;
      v[b.dataset.k] += +b.dataset.d;
      if (v.adults < v.rooms) v.adults = v.rooms;
      draw();
    });
    draw();
  };

  /* ---------- booking flow (full-screen sheet) ---------- */
  St.book = (h, roomId) => {
    const room = h.rooms.find((r) => r.id === roomId) || h.rooms[0];
    if (!SP.user()) return SP.openLogin(() => St.book(h, room.id));
    const f = { step: 1, coupon: '', pct: 0, name: '', email: '', phone: (SP.user() || {}).phone || '', note: '', arrive: '12:00 PM', pay: 'hotel' };
    const s = SP.sheet({ title: 'Complete your booking', full: true, foot: '' });
    s.sheet.classList.add('bksheet');
    const steps = ['Review', 'Guest details', 'Payment'];
    const bar = () => '<ol class="bkbar" aria-label="Booking steps">' + steps.map((t, i) => '<li class="' + (i + 1 < f.step ? 'done' : i + 1 === f.step ? 'now' : '') + '"><span>' + (i + 1 < f.step ? I('check') : i + 1) + '</span>' + t + '</li>').join('') + '</ol>';
    const summary = () => {
      const st = St.get(), q = St.quote(room, st, f.pct);
      return '<aside class="bk__side"><div class="bkhotel">' + SP.media(St.photo(h, 0)) + '<div><b>' + esc(h.name) + '</b>' + St.starsRow(h.stars) + '<small>' + esc(h.area) + '</small></div></div>' +
        '<div class="bkdates"><div><small>Check-in</small><b>' + St.fmt(st.ci) + '</b><small>from 12:00 PM</small></div><span>' + q.n + 'N</span><div><small>Check-out</small><b>' + St.fmt(st.co) + '</b><small>by 11:00 AM</small></div></div>' +
        '<p class="bkroom"><b>' + esc(room.n) + '</b><br><small>' + St.guestText(st) + ' · ' + esc(room.bed) + '</small></p>' +
        '<div class="fare-lines"><div><span>' + inr(room.p) + ' × ' + q.n + ' night' + (q.n > 1 ? 's' : '') + ' × ' + st.rooms + ' room' + (st.rooms > 1 ? 's' : '') + '</span><span class="tnum">' + inr(q.base) + '</span></div>' +
        (q.disc ? '<div class="ok"><span>Coupon ' + esc(f.coupon) + '</span><span class="tnum">- ' + inr(q.disc) + '</span></div>' : '') +
        '<div><span>Taxes &amp; fees</span><span class="tnum">' + inr(q.tax) + '</span></div><div class="total"><span>Total payable</span><span class="tnum">' + inr(q.total) + '</span></div></div></aside>';
    };
    const stepReview = () => {
      const st = St.get(), ok = St.capacity(room, st);
      return '<div class="bk__main"><h3 class="bk__h">Review your stay</h3>' +
        '<div class="bkbox"><div class="gs__row"><div><b>Rooms</b><small>' + esc(room.n) + ' fits ' + room.g + ' guest' + (room.g > 1 ? 's' : '') + ' per room</small></div><div class="qty"><button type="button" data-rm="-1" aria-label="Fewer rooms"' + (st.rooms <= 1 ? ' disabled' : '') + '>' + I('minus') + '</button><output>' + st.rooms + '</output><button type="button" data-rm="1" aria-label="More rooms"' + (st.rooms >= Math.min(room.left, 6) ? ' disabled' : '') + '>' + I('plus') + '</button></div></div>' +
        (ok ? '' : '<p class="bk__warn">' + I('alert') + 'Your ' + (st.adults + st.kids) + ' guests do not fit in ' + st.rooms + ' room' + (st.rooms > 1 ? 's' : '') + '. Add a room to continue.</p>') + '</div>' +
        '<div class="bkbox"><b>Cancellation policy</b><p class="small muted">' + (room.freeCancel ? 'Free cancellation until 24 hours before check-in. After that the first night is charged.' : 'This rate is non-refundable. Dates cannot be changed.') + '</p></div>' +
        '<div class="bkbox"><b>Have a coupon?</b><form id="cpf" class="rd-cpform"><input class="input" id="cpc" placeholder="Try DEEPAM10" autocomplete="off" value="' + esc(f.coupon) + '"><button class="btn btn--outline" type="submit">Apply</button></form><div class="field__error" id="cpe" role="alert">' + (f.pct ? '' : '') + '</div></div>' +
        '<div class="bk__nav"><button class="btn btn--primary btn--lg btn--block" type="button" data-next' + (ok ? '' : ' disabled') + '>Continue</button></div></div>' + summary();
    };
    const stepDetails = () => '<div class="bk__main"><h3 class="bk__h">Guest details</h3><form id="gf" class="fields fields--2" novalidate>' +
      '<div class="field"><label for="gn">Full name</label><input class="input" id="gn" autocomplete="name" value="' + esc(f.name) + '" placeholder="As on ID proof"><div class="field__error" data-e="gn"></div></div>' +
      '<div class="field"><label for="gm">Mobile number</label><div class="phone"><span class="phone__cc">+91</span><input class="input" id="gm" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" value="' + esc(f.phone) + '"></div><div class="field__error" data-e="gm"></div></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="ge">Email for the voucher</label><input class="input" id="ge" type="email" autocomplete="email" value="' + esc(f.email) + '" placeholder="you@example.com"><div class="field__error" data-e="ge"></div></div>' +
      '<div class="field"><label for="ga">Expected arrival</label><select class="select" id="ga">' + ['Before 12:00 PM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM', 'After 10:00 PM'].map((t) => '<option' + (t === f.arrive ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="gs">Special requests (optional)</label><textarea class="textarea" id="gs" placeholder="Ground floor, early check-in, extra bed">' + esc(f.note) + '</textarea></div></form>' +
      '<p class="small muted">Every guest needs a government photo ID at check-in.</p>' +
      '<div class="bk__nav bk__nav--2"><button class="btn btn--soft btn--lg" type="button" data-back>Back</button><button class="btn btn--primary btn--lg" type="button" data-next>Continue</button></div></div>' + summary();
    const stepPay = () => {
      const q = St.quote(room, St.get(), f.pct);
      const opt = (v, t, sm) => '<label class="radio"><input type="radio" name="pay" value="' + v + '"' + (f.pay === v ? ' checked' : '') + '><span><b>' + t + '</b><small>' + sm + '</small></span></label>';
      return '<div class="bk__main"><h3 class="bk__h">Payment</h3><div class="radios">' + opt('hotel', 'Pay at hotel', 'Reserve now and pay ' + inr(q.total) + ' when you arrive') + opt('upi', 'UPI', 'Pay ' + inr(q.total) + ' now in your UPI app') + opt('card', 'Credit or debit card', 'Pay ' + inr(q.total) + ' now') + '</div>' +
        '<p class="demo-hint">' + I('info') + 'Preview only. No payment is taken.</p>' +
        '<div class="bk__nav bk__nav--2"><button class="btn btn--soft btn--lg" type="button" data-back>Back</button><button class="btn btn--primary btn--lg" type="button" data-next>' + (f.pay === 'hotel' ? 'Confirm booking' : 'Pay ' + inr(q.total)) + '</button></div></div>' + summary();
    };
    const draw = () => {
      s.setTitle('Complete your booking');
      s.body.innerHTML = '<div class="bk">' + bar() + '<div class="bk__grid">' + (f.step === 1 ? stepReview() : f.step === 2 ? stepDetails() : stepPay()) + '</div></div>';
      if (f.step === 1) {
        SP.$('#cpf', s.body).addEventListener('submit', (e) => {
          e.preventDefault();
          const c = SP.$('#cpc', s.body).value.trim().toUpperCase();
          if (c === 'DEEPAM10') { f.coupon = c; f.pct = 10; SP.toast('DEEPAM10 applied'); draw(); } else { SP.$('#cpe', s.body).textContent = c ? 'This code is not valid.' : 'Enter a coupon code.'; }
        });
      }
    };
    const confirm = () => {
      const st = St.get(), q = St.quote(room, st, f.pct);
      const b = { id: 'SPH-' + (51000 + Math.floor(Math.random() * 8999)), hotel: h.id, room: room.id, ci: st.ci, co: st.co, rooms: st.rooms, adults: st.adults, kids: st.kids, total: q.total, pay: f.pay, name: f.name, phone: f.phone, status: 'Confirmed', at: new Date().toISOString() };
      const all = St.bookings(); all.unshift(b); St.saveBookings(all);
      s.body.innerHTML = '<div class="bk bk--done">' + voucher(b) + '</div>';
      s.setTitle('Booking confirmed');
      s.foot.innerHTML = '<button class="btn btn--primary btn--block" type="button" id="bkdone">Done</button>';
      SP.$('#bkdone', s.foot).addEventListener('click', () => { s.close(); if (/rooms\.html/.test(location.pathname)) location.hash = '#bookings'; else location.href = 'rooms.html#bookings'; });
    };
    s.body.addEventListener('click', (e) => {
      const rm = e.target.closest('[data-rm]');
      if (rm) { const st = St.get(); St.set({ rooms: Math.max(1, st.rooms + +rm.dataset.rm) }); draw(); return; }
      if (e.target.closest('[data-back]')) { collect(); f.step--; draw(); return; }
      if (e.target.closest('[data-next]')) {
        if (f.step === 2 && !validate()) return;
        if (f.step === 3) { collect(); return confirm(); }
        collect(); f.step++; draw(); s.sheet.scrollTo ? s.sheet.scrollTo(0, 0) : 0;
      }
    });
    function collect() {
      const g = (id) => { const n = SP.$('#' + id, s.body); return n ? n.value : null; };
      if (f.step === 2) { f.name = g('gn') ?? f.name; f.phone = g('gm') ?? f.phone; f.email = g('ge') ?? f.email; f.arrive = g('ga') ?? f.arrive; f.note = g('gs') ?? f.note; }
      if (f.step === 3) { const r = SP.$('input[name=pay]:checked', s.body); if (r) f.pay = r.value; }
    }
    function validate() {
      collect();
      const err = {};
      if (f.name.trim().length < 3) err.gn = 'Enter the guest name.';
      if (!/^[6-9]\d{9}$/.test(f.phone)) err.gm = 'Enter a valid 10-digit mobile number.';
      if (!/^\S+@\S+\.\S+$/.test(f.email)) err.ge = 'Enter a valid email address.';
      SP.$$('[data-e]', s.body).forEach((n) => { n.textContent = err[n.dataset.e] || ''; });
      const first = Object.keys(err)[0]; if (first) SP.$('#' + first, s.body).focus();
      return !first;
    }
    s.body.addEventListener('input', (e) => { if (e.target.id === 'gm') e.target.value = e.target.value.replace(/\D/g, ''); });
    s.body.addEventListener('change', (e) => { if (e.target.name === 'pay') { f.pay = e.target.value; draw(); } });
    draw();
  };

  /* ---------- voucher ---------- */
  function voucher(b) {
    const h = St.hotel(b.hotel), room = h.rooms.find((r) => r.id === b.room) || h.rooms[0];
    const n = Math.round((parse(b.co) - parse(b.ci)) / 864e5);
    return '<div class="vch"><div class="success"><div class="success__mark">' + I('check') + '</div><h3 class="h3">' + (b.status === 'Cancelled' ? 'Booking cancelled' : 'You are booked') + '</h3><p class="muted">Booking ID <b>' + b.id + '</b></p></div>' +
      '<div class="vch__card"><div class="vch__head">' + SP.media(St.photo(h, 0)) + '<div><b>' + esc(h.name) + '</b>' + St.starsRow(h.stars) + '<small>' + esc(h.area) + ', Thiruvannamalai</small></div></div>' +
      '<div class="vch__grid"><div><small>Check-in</small><b>' + St.fmt(b.ci, true) + '</b><small>from 12:00 PM</small></div><div><small>Check-out</small><b>' + St.fmt(b.co, true) + '</b><small>by 11:00 AM</small></div>' +
      '<div><small>Room</small><b>' + esc(room.n) + '</b><small>' + b.rooms + ' room' + (b.rooms > 1 ? 's' : '') + ', ' + n + ' night' + (n > 1 ? 's' : '') + '</small></div><div><small>Guests</small><b>' + (b.adults + b.kids) + ' guest' + (b.adults + b.kids > 1 ? 's' : '') + '</b><small>' + esc(b.name) + '</small></div></div>' +
      '<div class="vch__tot"><span>' + (b.pay === 'hotel' ? 'Pay at hotel' : 'Paid (preview)') + '</span><b>' + inr(b.total) + '</b></div></div>' +
      '<div class="vch__act"><a class="btn btn--outline" href="' + St.mapsUrl(h) + '" target="_blank" rel="noopener">' + I('nav') + 'Directions</a><button class="btn btn--outline" type="button" onclick="window.print()">Print voucher</button></div>' +
      '<p class="small muted">Sample voucher for the design preview. It is not a real reservation.</p></div>';
  }
  St.voucher = voucher;
})();
