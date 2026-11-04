/* Food */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr;
  const state = { f: 'all' };
  const view = SP.$('#view');
  const FILTERS = [['all', 'All'], ['veg', 'Vegetarian'], ['tiffin', 'Tiffin'], ['meals', 'Meals'], ['snacks', 'Snacks']];
  const match = (e) => state.f === 'all' || (state.f === 'veg' ? e.veg : e.types.includes(state.f));

  view.innerHTML =
    '<div class="panel" style="padding:14px 16px;margin-bottom:18px"><div class="chips" role="group" aria-label="Food type">' +
    FILTERS.map((c) => '<button class="chip" type="button" data-f="' + c[0] + '" aria-pressed="' + (c[0] === 'all') + '">' + c[1] + '</button>').join('') + '</div></div>' +
    '<div id="out" aria-live="polite"></div>';
  const out = SP.$('#out');

  const rating = (e) => '<span class="rating">' + I('star') + e.rating.toFixed(1) + '<small>(' + e.reviews.toLocaleString('en-IN') + ')</small></span>';
  const vegBadge = (e) => '<span class="badge ' + (e.veg ? 'badge--ok' : 'badge--bad') + '">' + (e.veg ? 'Vegetarian' : 'Serves non-veg') + '</span>';

  function big(e) {
    return '<button class="eat" type="button" data-open="' + e.id + '">' + SP.media({ art: e.art, photo: e.photo, alt: e.name }) +
      '<span class="eat__body"><h3>' + esc(e.name) + '</h3><span class="eat__row">' + rating(e) + '<span class="metaline">' + I('pin') + e.km + ' km from the temple</span></span>' +
      '<span class="eat__row">' + vegBadge(e) + '<span class="small muted">About ' + inr(e.cost) + ' for one</span></span></span></button>';
  }
  function row(e) {
    return '<button class="rowitem" type="button" data-open="' + e.id + '">' + SP.media({ art: e.art, photo: e.photo, alt: e.name }) +
      '<span class="rowitem__body"><h3>' + esc(e.name) + '</h3>' + rating(e) + '<span class="metaline">' + I('pin') + e.km + ' km · ' + esc(e.area) + '</span>' + '</span></button>';
  }

  function render() {
    const list = D.eats.filter(match), pop = list.filter((e) => e.popular).sort((a, b) => b.reviews - a.reviews), rest = list.filter((e) => !e.popular).sort((a, b) => b.reviews - a.reviews);
    let h = '';
    if (pop.length) h += '<h2 class="subhead">Popular near the temple</h2><div class="grid-cards grid-cards--3">' + pop.map(big).join('') + '</div>';
    if (rest.length) h += '<h2 class="subhead" style="margin-top:30px">More places to eat</h2><div class="rowlist">' + rest.map(row).join('') + '</div>';
    if (!list.length) h = '<div class="empty"><b>Nothing matches this filter</b><span>Try another food type.</span></div>';
    out.innerHTML = h;
  }

  view.addEventListener('click', (e) => {
    const c = e.target.closest('[data-f]');
    if (c) { state.f = c.dataset.f; SP.$$('[data-f]', view).forEach((b) => b.setAttribute('aria-pressed', b === c)); render(); return; }
    const o = e.target.closest('[data-open]');
    if (o) detail(D.eats.find((x) => x.id === o.dataset.open));
  });

  function detail(e) {
    const s = SP.sheet({ title: e.name });
    s.body.innerHTML =
      SP.media({ art: e.art, photo: e.photo, alt: e.name }, 'detail-art') +
      '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center">' + rating(e) + vegBadge(e) + '</div>' +
      '<p class="muted">' + esc(e.about) + '</p>' +
      '<div class="kv"><div>' + I('pin') + '<span>' + esc(e.area) + ', ' + e.km + ' km from the temple</span></div><div>' + I('clock') + '<span>' + esc(e.hours) + '</span></div></div>' +
      '<div><h3 class="label" style="margin-bottom:8px">Popular dishes</h3><ul class="menu-table">' + e.menu.map((m) => '<li><span>' + esc(m[0]) + '</span><b>' + inr(m[1]) + '</b></li>').join('') + '</ul></div>' +
      '<div class="gmapbox"><div style="height:200px">' + SP.gmap({ q: e.area + ', near Arunachaleswarar Temple', z: 16, title: 'Google Map of ' + e.area }) + '</div></div>' +
      '<a class="btn btn--primary btn--block btn--lg" href="' + SP.mapsUrl(e.name) + '" target="_blank" rel="noopener">' + I('nav') + 'Get directions</a>' +
      '<p class="small muted">Sample data. Menu, prices and hours are not verified.</p>';
  }
  render();
})();
