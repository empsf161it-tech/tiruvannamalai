/* Store: e-commerce listing page.
   Search, banner carousel, categories, deals with countdown, filters, sorting and product grid. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr, Sh = SP.shop;
  const view = SP.$('#view');
  const PRICE = [['any', 'Any price', 0, 1e9], ['u150', 'Under ₹150', 0, 150], ['150', '₹150 – ₹300', 150, 300], ['300', '₹300 – ₹500', 300, 500], ['500', '₹500 and above', 500, 1e9]];
  const SORT = [['rel', 'Relevance'], ['plow', 'Price: low to high'], ['phigh', 'Price: high to low'], ['rate', 'Customer rating'], ['off', 'Discount']];
  const F = { q: '', cats: [], price: 'any', rate: 0, off: 0, stock: false, sort: 'rel' };
  const hashCat = (location.hash || '').slice(1);
  if (D.categories.some((c) => c.id === hashCat)) F.cats = [hashCat];

  view.innerHTML =
    '<div class="shop-top"><div class="container"><form class="ssearch" id="ssearch" role="search"><span class="ssearch__ic">' + I('grid') + '</span>' +
    '<input id="sq" type="search" placeholder="Search lamps, pooja kits, prasadam" autocomplete="off" aria-label="Search the store"><button type="submit" aria-label="Search">' + I('route') + '</button></form></div></div>' +
    '<div class="container shop"><div class="banner" id="banner" aria-roledescription="carousel" aria-label="Offers"></div>' +
    '<ul class="vprops"><li>' + I('pack') + '<span><b>Free delivery</b>on orders above ₹499</span></li><li>' + I('check') + '<span><b>7-day returns</b>on sealed items</span></li><li>' + I('lamp') + '<span><b>Temple town packed</b>fresh for the festival</span></li><li>' + I('phone') + '<span><b>Pay on delivery</b>available (preview)</span></li></ul>' +
    '<div id="cats"></div><div id="deals"></div><div id="shop-list"></div></div>';

  /* ---------- banner carousel ---------- */
  const ban = SP.$('#banner');
  let bi = 0, bt = 0;
  ban.innerHTML = '<div class="banner__track" id="btrack">' + D.banners.map((b, i) => '<article class="bslide bslide--' + b.tone + '" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + D.banners.length + '"><div class="bslide__txt"><span class="bslide__tag">Karthigai Deepam 24 Nov</span><h2>' + esc(b.t) + '</h2><p>' + esc(b.s) + '</p><button class="btn btn--primary" type="button" data-bcat="' + b.cat + '">' + esc(b.cta) + I('arrow') + '</button></div><div class="bslide__art">' + SP.media({ art: b.art, slug: 'banner-' + SP.slug(b.cta), alt: b.t }) + '</div></article>').join('') + '</div>' +
    '<div class="banner__dots">' + D.banners.map((b, i) => '<button type="button" data-b="' + i + '" aria-label="Show offer ' + (i + 1) + '"></button>').join('') + '</div>';
  const slideTo = (i) => { bi = (i + D.banners.length) % D.banners.length; SP.$('#btrack').style.transform = 'translateX(-' + bi * 100 + '%)'; SP.$$('.banner__dots button').forEach((d, k) => d.setAttribute('aria-current', k === bi)); };
  const auto = () => { clearInterval(bt); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) bt = setInterval(() => slideTo(bi + 1), 5200); };
  ban.addEventListener('click', (e) => {
    const d = e.target.closest('[data-b]'); if (d) { slideTo(+d.dataset.b); auto(); return; }
    const c = e.target.closest('[data-bcat]'); if (c) { F.cats = [c.dataset.bcat]; F.q = ''; SP.$('#sq').value = ''; renderList(); SP.$('#shop-list').scrollIntoView({ behavior: 'smooth' }); }
  });
  ban.addEventListener('mouseenter', () => clearInterval(bt)); ban.addEventListener('mouseleave', auto);
  let sx = 0; ban.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  ban.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { slideTo(bi + (dx < 0 ? 1 : -1)); auto(); } });
  slideTo(0); auto();

  /* ---------- categories + deals ---------- */
  SP.$('#cats').innerHTML = '<div class="sec-head"><h2>Shop by category</h2></div><div class="catrow">' + D.categories.map((c) => '<button class="catc" type="button" data-cat="' + c.id + '">' + SP.media({ art: D.catArt[c.id], slug: 'cat-' + c.id, alt: c.label }) + '<span>' + esc(c.label) + '</span></button>').join('') + '</div>';
  const deals = D.products.filter((p) => p.deal || p.off >= 25).slice(0, 8);
  SP.$('#deals').innerHTML = '<div class="sec-head"><h2>Deals of the day</h2><span class="timer" id="timer" aria-label="Time left">Ends in <b>--:--:--</b></span></div><div class="scroller deals">' + deals.map((p) => '<div class="dealc">' + Sh.card(p) + '</div>').join('') + '</div>';
  function tick() {
    const n = new Date(), e = new Date(n); e.setHours(23, 59, 59, 999);
    const s = Math.max(0, Math.floor((e - n) / 1000)), f = (x) => String(x).padStart(2, '0');
    const t = SP.$('#timer b'); if (t) t.textContent = f(Math.floor(s / 3600)) + ':' + f(Math.floor(s % 3600 / 60)) + ':' + f(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- list + filters ---------- */
  const band = () => PRICE.find((p) => p[0] === F.price);
  function apply() {
    const [, , lo, hi] = band(), q = F.q.trim().toLowerCase();
    const l = D.products.filter((p) => (!q || (p.name + ' ' + p.brand + ' ' + Sh.cat(p.cat).label).toLowerCase().includes(q)) && (!F.cats.length || F.cats.includes(p.cat)) && p.price >= lo && p.price < hi && p.rating >= F.rate && p.off >= F.off && (!F.stock || p.stock > 0));
    const by = { rel: (a, b) => (b.best ? 1 : 0) - (a.best ? 1 : 0) || b.rv - a.rv, plow: (a, b) => a.price - b.price, phigh: (a, b) => b.price - a.price, rate: (a, b) => b.rating - a.rating, off: (a, b) => b.off - a.off };
    return l.sort(by[F.sort]);
  }
  const nAct = () => F.cats.length + (F.price !== 'any' ? 1 : 0) + (F.rate ? 1 : 0) + (F.off ? 1 : 0) + (F.stock ? 1 : 0);
  const chk = (k, label, on, v, count) => '<label class="chk"><input type="checkbox" data-f="' + k + '"' + (v != null ? ' data-v="' + v + '"' : '') + (on ? ' checked' : '') + '><span>' + label + '</span>' + (count != null ? '<em>' + count + '</em>' : '') + '</label>';
  const rad = (k, name, label, on, v) => '<label class="chk"><input type="radio" name="' + name + '" data-f="' + k + '" data-v="' + v + '"' + (on ? ' checked' : '') + '><span>' + label + '</span></label>';
  function filtersHTML(p) {
    return '<div class="fl"><div class="fl__head"><b>Filters</b><button type="button" class="linkbtn" data-reset' + (nAct() ? '' : ' hidden') + '>Clear all</button></div>' +
      '<fieldset><legend>Category</legend>' + D.categories.map((c) => chk('cats', esc(c.label), F.cats.includes(c.id), c.id, D.products.filter((x) => x.cat === c.id).length)).join('') + '</fieldset>' +
      '<fieldset><legend>Price</legend>' + PRICE.map((x) => rad('price', p + 'pr', x[1], F.price === x[0], x[0])).join('') + '</fieldset>' +
      '<fieldset><legend>Customer rating</legend>' + [[4.5, '4.5 ★ and above'], [4, '4 ★ and above'], [3.5, '3.5 ★ and above']].map((r) => rad('rate', p + 'rt', r[1], F.rate === r[0], r[0])).join('') + '</fieldset>' +
      '<fieldset><legend>Discount</legend>' + [[30, '30% or more'], [20, '20% or more'], [10, '10% or more']].map((r) => rad('off', p + 'of', r[1], F.off === r[0], r[0])).join('') + '</fieldset>' +
      '</div>';
  }
  const out = SP.$('#shop-list');
  function renderList() {
    const list = apply(), n = nAct();
    out.innerHTML = '<div class="sec-head"><h2 id="allh">' + (F.q ? 'Results for “' + esc(F.q) + '”' : F.cats.length === 1 ? esc(Sh.cat(F.cats[0]).label) : 'All products') + '</h2></div>' +
      '<div class="shop-body"><aside class="shop-filters" aria-label="Filters">' + filtersHTML('d') + '</aside><div class="shop-main"><div class="shop-bar"><span class="count">' + list.length + ' item' + (list.length === 1 ? '' : 's') + '</span><div class="shop-bar__r"><button class="btn btn--soft btn--sm shop-fbtn" type="button" data-open-filters>' + I('grid') + 'Filters' + (n ? ' (' + n + ')' : '') + '</button>' +
      '<label class="sortsel"><span class="sr-only">Sort by</span><select class="select" id="ssort">' + SORT.map((s) => '<option value="' + s[0] + '"' + (F.sort === s[0] ? ' selected' : '') + '>' + s[1] + '</option>').join('') + '</select></label></div></div>' +
      (list.length ? '<div class="pgrid">' + list.map(Sh.card).join('') + '</div>' : '<div class="empty"><b>No products found</b><p>Try another word or clear the filters.</p><button class="btn btn--outline" type="button" data-reset>Clear filters</button></div>') + '</div></div>';
  }
  function onFilter(e) {
    const el = e.target.closest('[data-f]'); if (!el) return;
    const k = el.dataset.f, v = el.dataset.v;
    if (k === 'cats') { const i = F.cats.indexOf(v); if (el.checked && i < 0) F.cats.push(v); else if (!el.checked && i > -1) F.cats.splice(i, 1); }
    else if (k === 'stock') F.stock = !el.checked;
    else if (k === 'price') F.price = v;
    else F[k] = +v;
    renderList();
  }
  const reset = () => { Object.assign(F, { q: '', cats: [], price: 'any', rate: 0, off: 0, stock: false }); SP.$('#sq').value = ''; renderList(); };
  out.addEventListener('change', (e) => { if (e.target.id === 'ssort') { F.sort = e.target.value; renderList(); } else onFilter(e); });
  out.addEventListener('click', (e) => {
    if (e.target.closest('[data-reset]')) { reset(); return; }
    if (e.target.closest('[data-open-filters]')) {
      const s = SP.sheet({ title: 'Filters', foot: '' });
      const draw = () => { s.body.innerHTML = filtersHTML('m'); s.foot.innerHTML = '<button class="btn btn--primary btn--block btn--lg" type="button" id="fok">Show ' + apply().length + ' items</button>'; SP.$('#fok', s.foot).addEventListener('click', () => s.close()); };
      draw(); s.body.addEventListener('change', (ev) => { onFilter(ev); draw(); }); s.body.addEventListener('click', (ev) => { if (ev.target.closest('[data-reset]')) { reset(); draw(); } });
    }
  });
  SP.$('#cats').addEventListener('click', (e) => { const c = e.target.closest('[data-cat]'); if (c) { F.cats = [c.dataset.cat]; F.q = ''; SP.$('#sq').value = ''; renderList(); out.scrollIntoView({ behavior: 'smooth' }); } });
  SP.$('#ssearch').addEventListener('submit', (e) => { e.preventDefault(); F.q = SP.$('#sq').value; F.cats = []; renderList(); out.scrollIntoView({ behavior: 'smooth' }); });
  SP.$('#sq').addEventListener('input', (e) => { if (!e.target.value && F.q) { F.q = ''; renderList(); } });
  Sh.bind(view);
  renderList();
})();
