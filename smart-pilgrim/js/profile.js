/* Profile: details, trips, hotel bookings, orders, saved items and settings (sample data, stored in this browser). */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr;
  const view = SP.$('#view');
  const TABS = [['details', 'Profile details', 'user'], ['trips', 'My rides', 'car'], ['stays', 'Hotel bookings', 'bed'], ['orders', 'Orders', 'pack'], ['saved', 'Saved', 'heart'], ['settings', 'Settings', 'sun']];
  let tab = (location.hash || '').slice(1);
  if (!TABS.some((t) => t[0] === tab)) tab = 'details';

  const DEFAULT = { name: '', email: '', city: '', emergency: '', lang: 'en', notify: { rides: true, stays: true, offers: false, festival: true } };
  const prof = () => { const p = Object.assign({}, DEFAULT, SP.store.get('profile', {})); p.notify = Object.assign({}, DEFAULT.notify, p.notify); return p; };
  const dshort = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); };
  const rides = () => SP.store.get('rides', []);
  const stays = () => SP.store.get('stays', []);
  const orders = () => SP.store.get('orders', []);
  const wishH = () => SP.store.get('wish:hotels', []);
  const wishP = () => SP.store.get('wish:products', []);
  const STAGES = ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  const tag = (t) => '<span class="pf-tag' + (/cancel/i.test(t) ? ' pf-tag--x' : '') + '">' + esc(t) + '</span>';
  const empty = (msg, href, cta) => '<div class="pf-empty"><p>' + msg + '</p><a class="btn btn--primary" href="' + href + '">' + cta + '</a></div>';

  function loggedOut() {
    view.innerHTML = '<div class="container"><div class="pf-card pf-login" style="margin-block:40px"><div class="pf-avatar">' + I('user') + '</div><h1>Your pilgrim profile</h1>' +
      '<p class="muted">Log in to see your rides, hotel bookings, orders and saved places in one place.</p>' +
      '<button class="btn btn--primary btn--lg" type="button" id="pfLogin">' + I('user') + 'Login with mobile number</button><p class="small muted">Demo OTP is 1234. Nothing leaves this browser.</p></div></div>';
    SP.$('#pfLogin').addEventListener('click', () => SP.openLogin(() => render()));
  }

  function panel() {
    const p = prof(), u = SP.user();
    if (tab === 'details') {
      return '<form class="pf-card" id="pfForm" novalidate><h2>Profile details</h2><div class="fields fields--2">' +
        '<div class="field"><label for="pn">Full name</label><input class="input" id="pn" autocomplete="name" value="' + esc(p.name) + '" placeholder="Your name"></div>' +
        '<div class="field"><label for="pm">Mobile number</label><input class="input" id="pm" value="+91 ' + esc(u.phone) + '" readonly aria-describedby="pmh"><small id="pmh" class="muted">Verified by OTP, cannot be edited here.</small></div>' +
        '<div class="field"><label for="pe">Email</label><input class="input" id="pe" type="email" autocomplete="email" value="' + esc(p.email) + '" placeholder="you@example.com"><div class="field__error" id="pee" role="alert"></div></div>' +
        '<div class="field"><label for="pc">Home city</label><input class="input" id="pc" autocomplete="address-level2" value="' + esc(p.city) + '" placeholder="Chennai"></div>' +
        '<div class="field"><label for="pk">Emergency contact (mobile)</label><input class="input" id="pk" inputmode="numeric" maxlength="10" value="' + esc(p.emergency) + '" placeholder="10-digit number"><div class="field__error" id="pke" role="alert"></div></div>' +
        '<div class="field"><label for="pl">Preferred language</label><select class="select" id="pl"><option value="en"' + (p.lang === 'en' ? ' selected' : '') + '>English</option><option value="ta"' + (p.lang === 'ta' ? ' selected' : '') + '>தமிழ் (Tamil)</option></select></div>' +
        '</div><div><button class="btn btn--primary btn--lg" type="submit">Save changes</button></div></form>';
    }
    if (tab === 'trips') {
      const l = rides();
      return '<section class="pf-card"><h2>My rides</h2>' + (l.length ? '<ul class="pf-list">' + l.map((r) => '<li class="pf-item"><div class="media">' + SP.art.vehicle(String(r.vehicle).toLowerCase().replace(/\s/g, '')) + '</div><div><b>' + esc(r.from) + ' → ' + esc(r.to) + '</b><small>' + esc(r.vehicle) + ' · ' + new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' · ' + esc(r.id) + '</small></div><div class="pf-item__end"><span>' + inr(r.fare) + '</span>' + tag(r.status) + '</div></li>').join('') + '</ul><a class="btn btn--outline" href="ride.html#my-rides">Full ride history</a>' : empty('No rides booked yet.', 'ride.html', 'Book a ride')) + '</section>';
    }
    if (tab === 'stays') {
      const l = stays();
      return '<section class="pf-card"><h2>Hotel bookings</h2>' + (l.length ? '<ul class="pf-list">' + l.map((b) => { const h = D.hotels.find((x) => x.id === b.hotel) || D.hotels[0]; return '<li class="pf-item"><div class="media">' + SP.media({ art: h.art, slug: h.slug, alt: h.name }) + '</div><div><b>' + esc(h.name) + '</b><small>' + dshort(b.ci) + ' – ' + dshort(b.co) + ' · ' + b.rooms + ' room' + (b.rooms > 1 ? 's' : '') + ' · ' + esc(b.id) + '</small></div><div class="pf-item__end"><span>' + inr(b.total) + '</span>' + tag(b.status) + '</div></li>'; }).join('') + '</ul><a class="btn btn--outline" href="rooms.html#bookings">Open vouchers</a>' : empty('No hotel bookings yet.', 'rooms.html', 'Find a hotel')) + '</section>';
    }
    if (tab === 'orders') {
      const l = orders();
      return '<section class="pf-card"><h2>Store orders</h2>' + (l.length ? '<ul class="pf-list">' + l.map((o) => { const pr = D.products.find((x) => x.id === (o.items[0] || {}).id) || D.products[0], n = o.items.reduce((a, i) => a + i.q, 0); return '<li class="pf-item"><div class="media">' + SP.media({ art: pr.art, slug: pr.slug, alt: pr.name }) + '</div><div><b>' + esc(pr.name) + (o.items.length > 1 ? ' + ' + (o.items.length - 1) + ' more' : '') + '</b><small>' + n + ' item' + (n > 1 ? 's' : '') + ' · ' + esc(o.id) + '</small></div><div class="pf-item__end"><span>' + inr(o.total) + '</span>' + tag(o.status === 'Cancelled' ? 'Cancelled' : STAGES[o.stage]) + '</div></li>'; }).join('') + '</ul><a class="btn btn--outline" href="cart.html#orders">Track orders</a>' : empty('No store orders yet.', 'store.html', 'Visit the store')) + '</section>';
    }
    if (tab === 'saved') {
      const hs = D.hotels.filter((h) => wishH().includes(h.id)), ps = D.products.filter((x) => wishP().includes(x.id));
      return '<section class="pf-card"><h2>Saved hotels</h2>' + (hs.length ? '<ul class="pf-list">' + hs.map((h) => '<li><a class="pf-item" href="hotel.html#' + h.id + '"><div class="media">' + SP.media({ art: h.art, slug: h.slug, alt: h.name }) + '</div><div><b>' + esc(h.name) + '</b><small>' + h.km + ' km from the temple · ' + h.rating.toFixed(1) + ' rating</small></div><div class="pf-item__end"><span>' + inr(h.price) + '</span><small>per night</small></div></a></li>').join('') + '</ul>' : '<p class="muted">Tap the heart on any hotel to save it here.</p>') + '</section>' +
        '<section class="pf-card"><h2>Saved products</h2>' + (ps.length ? '<ul class="pf-list">' + ps.map((x) => '<li><a class="pf-item" href="product.html#' + x.id + '"><div class="media">' + SP.media({ art: x.art, slug: x.slug, alt: x.name }) + '</div><div><b>' + esc(x.name) + '</b><small>' + esc(x.brand) + '</small></div><div class="pf-item__end"><span>' + inr(x.price) + '</span></div></a></li>').join('') + '</ul>' : '<p class="muted">Tap the heart on any product to save it here.</p>') + '</section>';
    }
    const t = SP.theme.get(), n = p.notify;
    const sw = (k, label, sub) => '<div class="pf-row"><span><b>' + label + '</b><small>' + sub + '</small></span><label class="pf-switch"><input type="checkbox" data-n="' + k + '"' + (n[k] ? ' checked' : '') + ' aria-label="' + label + '"><i></i></label></div>';
    return '<section class="pf-card"><h2>Appearance</h2><div class="themepick" role="radiogroup" aria-label="Theme">' +
      [['light', 'Light', 'sun'], ['dark', 'Dark', 'moon'], ['auto', 'System', 'globe']].map((x) => '<label>' + I(x[2]) + '<input type="radio" name="themepick" value="' + x[0] + '"' + (t === x[0] ? ' checked' : '') + '>' + x[1] + '</label>').join('') + '</div></section>' +
      '<section class="pf-card"><h2>Notifications</h2><div>' + sw('rides', 'Ride updates', 'Captain arrival and trip receipts') + sw('stays', 'Booking updates', 'Confirmations and check-in reminders') + sw('festival', 'Festival alerts', 'Pournami, Karthigai Deepam and crowd notices') + sw('offers', 'Offers', 'Coupons for rides, stays and the store') + '</div></section>' +
      '<section class="pf-card"><h2>Account</h2><button class="btn btn--outline" type="button" id="pfClear">' + I('trash') + 'Clear demo data on this device</button><button class="btn btn--ghost" type="button" id="pfOut">' + I('logout') + 'Log out</button></section>';
  }

  function render() {
    const u = SP.user();
    if (!u) return loggedOut();
    const p = prof(), nm = p.name.trim() || 'Devotee', ini = (p.name.trim() || 'D').charAt(0).toUpperCase();
    if (!SP.store.get('joined', '')) SP.store.set('joined', new Date().toISOString());
    const since = new Date(SP.store.get('joined', new Date().toISOString())).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const stat = (n, l) => '<div class="pf-stat"><b>' + n + '</b><small>' + l + '</small></div>';
    view.innerHTML =
      '<section class="pf-hero"><div class="pf-hero__bg"></div><div class="container pf-hero__in"><div class="pf-avatar" aria-hidden="true">' + esc(ini) + '</div><div><h1>' + esc(nm) + '</h1><p>+91 ' + esc(u.phone) + (p.email ? ' · ' + esc(p.email) : '') + '</p><p>Pilgrim since ' + since + (p.city ? ' · ' + esc(p.city) : '') + '</p></div>' +
      '<div class="pf-hero__act"><button class="btn btn--primary btn--sm" type="button" id="pfEdit">' + I('edit') + 'Edit profile</button><button class="btn btn--sm" type="button" id="pfOut2" style="background:rgba(255,255,255,.16);color:#fff;border:1.5px solid rgba(255,255,255,.5)">' + I('logout') + 'Log out</button></div></div></section>' +
      '<div class="container"><div class="pf-stats">' + stat(rides().length, 'Rides') + stat(stays().length, 'Stays') + stat(orders().length, 'Orders') + stat(wishH().length + wishP().length, 'Saved') + '</div>' +
      '<div class="pf-body"><nav class="pf-nav" aria-label="Profile sections"><div class="ptabs" role="tablist">' + TABS.map((t) => '<button class="ptab" role="tab" type="button" data-tab="' + t[0] + '" aria-selected="' + (t[0] === tab) + '">' + I(t[2]) + t[1] + '</button>').join('') + '</div></nav><div class="pf-main" id="pfMain" style="display:grid;gap:16px;min-width:0">' + panel() + '</div></div></div>';
    bind();
  }

  function logout() { SP.store.del('user'); SP.refreshAuth(); SP.toast('Logged out'); render(); }
  function bind() {
    SP.$$('[data-tab]').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; history.replaceState(null, '', '#' + tab); SP.$$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', x === b)); SP.$('#pfMain').innerHTML = panel(); bindPanel(); }));
    SP.$('#pfEdit').addEventListener('click', () => { tab = 'details'; render(); const n = SP.$('#pn'); if (n) n.focus(); });
    SP.$('#pfOut2').addEventListener('click', logout);
    bindPanel();
  }
  function bindPanel() {
    const f = SP.$('#pfForm');
    if (f) f.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = SP.$('#pe').value.trim(), em = SP.$('#pk').value.trim();
      let bad = false;
      SP.$('#pee').textContent = ''; SP.$('#pke').textContent = '';
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { SP.$('#pee').textContent = 'Enter a valid email address.'; bad = true; }
      if (em && !/^[6-9]\d{9}$/.test(em)) { SP.$('#pke').textContent = 'Enter a valid 10-digit mobile number.'; bad = true; }
      if (bad) return;
      SP.store.set('profile', Object.assign(prof(), { name: SP.$('#pn').value.trim(), email, city: SP.$('#pc').value.trim(), emergency: em, lang: SP.$('#pl').value }));
      SP.refreshAuth(); SP.toast('Profile saved');
      render();
    });
    SP.$$('input[name="themepick"]').forEach((r) => r.addEventListener('change', () => SP.theme.set(r.value)));
    SP.$$('[data-n]').forEach((c) => c.addEventListener('change', () => { const p = prof(); p.notify[c.dataset.n] = c.checked; SP.store.set('profile', p); SP.toast('Preference saved'); }));
    const o = SP.$('#pfOut'); if (o) o.addEventListener('click', logout);
    const c = SP.$('#pfClear');
    if (c) c.addEventListener('click', () => {
      const s = SP.sheet({ title: 'Clear demo data?', html: '<p class="muted">This removes your demo rides, bookings, orders, cart and saved items from this browser. Your theme choice stays.</p>', foot: '<button class="btn btn--primary btn--block" id="cy" type="button">Clear data</button><button class="btn btn--ghost btn--block" id="cn" type="button">Cancel</button>' });
      SP.$('#cn', s.foot).addEventListener('click', () => s.close());
      SP.$('#cy', s.foot).addEventListener('click', () => { ['rides', 'stays', 'orders', 'cart', 'coupon', 'wish:hotels', 'wish:products', 'stay', 'addr', 'profile'].forEach((k) => SP.store.del(k)); SP.refreshCart(); s.close(); SP.toast('Demo data cleared'); render(); });
    });
  }
  window.addEventListener('hashchange', () => { const h = (location.hash || '').slice(1); if (TABS.some((t) => t[0] === h) && h !== tab && SP.user()) { tab = h; render(); } });
  render();
})();
