/* Home page */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon;

  /* hero: temple photo by default, another photo when data-photo is set */
  const hero = SP.$('#heroArt');
  const photo = hero.getAttribute('data-photo');
  if (photo) {
    hero.innerHTML = '<img src="' + SP.esc(photo) + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">' +
      '<div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--hero-a),transparent 70%)"></div>';
  } else {
    hero.innerHTML = '<div class="art-tall">' + SP.art.heroTall() + '</div><div class="art-wide">' + SP.art.heroWide() + '</div>';
    heroVideo();
  }

  /* background video: assets/video/worship.mp4 (replace the file with your own worship video).
     Starts muted and looped, pauses for people who prefer reduced motion, and has a pause button. */
  function heroVideo() {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sec = SP.$('.hero');
    const v = document.createElement('video');
    v.className = 'hero__video'; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = !still; v.preload = still ? 'none' : 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.setAttribute('tabindex', '-1'); v.disablePictureInPicture = true;
    v.poster = 'assets/img/temple-bg.jpg';
    v.innerHTML = '<source src="assets/video/worship.mp4" type="video/mp4">';
    hero.appendChild(v);
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'hero__vbtn';
    const sync = () => { const on = !v.paused; btn.textContent = on ? '❚❚' : '▶'; btn.setAttribute('aria-label', on ? 'Pause background video' : 'Play background video'); btn.title = on ? 'Pause video' : 'Play video'; };
    btn.addEventListener('click', () => { if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause(); });
    v.addEventListener('playing', () => { v.classList.add('is-on'); sync(); });
    v.addEventListener('pause', sync); v.addEventListener('play', sync);
    v.addEventListener('error', () => { v.remove(); btn.remove(); }, true);
    sec.appendChild(btn); sync();
    if (!still) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  }

  /* service tiles */
  const tiles = [
    ['ride.html', 'car', 'Book a Ride'], ['rooms.html', 'bed', 'Rooms & Hotels'], ['food.html', 'food', 'Food'],
    ['annadanam.html', 'bowl', 'Annadanam'], ['store.html', 'bag', 'Store'], ['map.html', 'map', 'Offline Map'],
  ];
  SP.$('#tiles').innerHTML = tiles.map((t) => '<a class="tile" href="' + t[0] + '">' + I(t[1]) + '<span>' + t[2] + '</span></a>').join('');

  /* explore: image cards for every service */
  const X = [
    ['ride.html', 'Book a Ride', 'Auto, bike, cab and share auto', ['vehicle', 'auto'], 'x-ride', 'xcard--yellow'],
    ['rooms.html', 'Rooms & Hotels', 'Free cancellation on most stays', ['hotel', 2], 'x-stay', ''],
    ['food.html', 'Food', 'Meals, tiffin and snacks', ['food', 'dosa'], 'x-food', ''],
    ['annadanam.html', 'Annadanam', 'Free meals for devotees', ['place', 'hall'], 'x-annadanam', ''],
    ['store.html', 'Temple Store', 'Pooja items, lamps, prasadam', ['product', 'claylamps'], 'x-store', ''],
    ['map.html', 'Offline Map', 'Girivalam path without internet', ['place', 'hill'], 'x-map', ''],
  ];
  SP.$('#xgrid').innerHTML = X.map((x) => '<a class="xcard ' + x[5] + '" href="' + x[0] + '">' + SP.media({ art: x[3], slug: x[4], alt: x[1] }) + '<span class="xcard__txt"><b>' + x[1] + '</b><small>' + x[2] + '</small></span><span class="xcard__go">' + I('arrow') + '</span></a>').join('');
  const Sh = SP.shop, St2 = (h) => h;
  SP.$('#hStays').innerHTML = D.hotels.slice().sort((a, b) => b.rating - a.rating).slice(0, 6).map((h) => {
    const rm = h.rooms.reduce((a, b) => (a.p <= b.p ? a : b));
    return '<a class="mini" href="hotel.html#' + h.id + '">' + SP.media({ art: h.gallery[0], slug: h.slug, alt: h.name }) + '<span class="mini__b"><b>' + SP.esc(h.name) + '</b><span class="mini__m"><span class="ratebox ratebox--sm"><b>' + h.rating.toFixed(1) + '</b></span><small>' + h.km + ' km from temple</small></span><span class="mini__p">' + SP.inr(rm.p) + '<small> / night</small></span></span></a>';
  }).join('');
  SP.$('#rbanner').innerHTML = '<div><span class="eyebrow" style="color:#5E3A08">Rides</span><h3>Heading to the temple or Girivalam?</h3><p>Book an auto, bike or cab in a few taps. First ride coupon <mark>GIRI20</mark></p><a class="btn btn--dark" href="ride.html">Book a ride' + I('arrow') + '</a></div><div class="rbanner__art">' + SP.art.vehicle('auto') + '</div>';
  SP.$('#hEats').innerHTML = D.eats.filter((e) => e.popular).concat(D.eats.filter((e) => !e.popular)).slice(0, 6).map((e) =>
    '<a class="mini" href="food.html">' + SP.media({ art: e.art, slug: SP.slug(e.name), alt: e.name }) + '<span class="mini__b"><b>' + SP.esc(e.name) + '</b><span class="mini__m"><span class="ratebox ratebox--sm"><b>' + e.rating.toFixed(1) + '</b></span><small>' + e.km + ' km · ' + (e.veg ? 'Veg' : 'Veg &amp; non-veg') + '</small></span><span class="mini__p">About ' + SP.inr(e.cost) + '<small> for one</small></span></span></a>').join('');
  SP.$('#hShop').innerHTML = D.products.filter((p) => p.best || p.deal).slice(0, 8).map((p) => '<div class="dealc">' + Sh.card(p) + '</div>').join('');
  Sh.bind(SP.$('#hShop'));

  /* at-a-glance strip */
  const f = new Date(D.festival.date + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.round((f - today) / 86400000);
  const countText = days > 1 ? 'in ' + days + ' days' : days === 1 ? 'tomorrow' : days === 0 ? 'today' : 'this year';
  const fDate = f.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  SP.$('#glance').innerHTML =
    '<div class="glance__card">' + I('cloud') + '<div><div class="glance__label" id="wLabel">Weather (sample)</div><div class="glance__value"><span class="big tnum" id="wTemp">28°C</span></div></div><div class="glance__more" style="color:var(--ink-2);font-weight:500" id="wDesc">Partly cloudy</div></div>' +
    '<a class="glance__card" href="#girivalam">' + I('route') + '<div><div class="glance__label">Girivalam</div><div class="glance__value">14 km around the hill</div></div><div class="glance__more">Path, timings and tips</div></a>' +
    '<a class="glance__card" href="#calendar">' + I('flame') + '<div><div class="glance__label">Upcoming festival</div><div class="glance__value">' + SP.esc(D.festival.name) + '</div></div><div class="glance__more">' + SP.esc(fDate) + ' · ' + countText + '</div></a>' +
    '<div class="glance__card">' + I('users') + '<div><div class="glance__label">Crowd at the temple</div><div class="glance__value"><span class="badge badge--warn">Moderate</span></div></div><div class="glance__more" style="color:var(--ink-2);font-weight:500">Sample data</div></div>';

  /* about */
  SP.$('#facts').innerHTML = [['14 km', 'Girivalam route'], ['8', 'Ashta Lingams'], ['Fire', 'Pancha Bhoota element'], ['11', 'tiers on the East Gopuram']]
    .map((x) => '<div class="fact"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('');
  SP.$('#aboutArt').innerHTML = SP.media({ art: ['place', 'temple'], alt: 'Arunachaleswarar Temple gopuram at sunset' }, '').replace('class="media"', 'class="media" style="aspect-ratio:4/3;border-radius:26px;box-shadow:var(--shadow-lg)"');

  /* Girivalam */
  SP.$('#tips').innerHTML = D.girivalamTips.map((t, i) =>
    '<details' + (i === 0 ? ' open' : '') + '><summary>' + SP.esc(t.h) + I('chev') + '</summary><ul class="acc__body">' + t.items.map((x) => '<li><span>' + SP.esc(x) + '</span></li>').join('') + '</ul></details>').join('');
  SP.$('#stops').innerHTML = D.lingams.map((l) => '<li><span class="n">' + l.n + '</span><span><b>' + SP.esc(l.name) + '</b></span><span class="dir">' + SP.esc(l.dir) + '</span></li>').join('');

  /* festival */
  SP.$('#fDay').textContent = f.getDate();
  SP.$('#fMon').textContent = f.toLocaleDateString('en-IN', { month: 'short' });
  SP.$('#fCount').textContent = f.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (days >= 0 ? ' · ' + countText : '');
  SP.$('#news').innerHTML = D.announcements.map((a) => '<li><time>' + SP.esc(a.date) + '</time><b>' + SP.esc(a.title) + '</b><span class="muted small">' + SP.esc(a.text) + '</span></li>').join('');

  /* live weather when the network allows it; the sample values stay otherwise */
  const WX = (c) => c === 0 ? 'Clear sky' : c <= 2 ? 'Partly cloudy' : c === 3 ? 'Overcast' : c <= 48 ? 'Foggy' : c <= 57 ? 'Drizzle' : c <= 67 ? 'Rain' : c <= 82 ? 'Showers' : 'Thunderstorm';
  try {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = setTimeout(() => ctl && ctl.abort(), 4000);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.2253&longitude=79.0747&current=temperature_2m,weather_code', ctl ? { signal: ctl.signal } : {})
      .then((r) => r.json())
      .then((j) => {
        clearTimeout(t);
        if (!j || !j.current) return;
        SP.$('#wTemp').textContent = Math.round(j.current.temperature_2m) + '°C';
        SP.$('#wDesc').textContent = WX(j.current.weather_code);
        SP.$('#wLabel').textContent = 'Weather now';
      })
      .catch(() => {});
  } catch (e) { /* offline or blocked: keep sample */ }
})();
