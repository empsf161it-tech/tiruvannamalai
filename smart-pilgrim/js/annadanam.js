/* Annadanam */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc;
  const state = { slot: 'all' };
  const view = SP.$('#view');
  const SLOTS = [['all', 'All'], ['morning', 'Morning'], ['lunch', 'Lunch'], ['dinner', 'Dinner']];
  const LABEL = { morning: 'Morning', lunch: 'Lunch', dinner: 'Dinner' };

  view.innerHTML =
    '<div class="panel" style="padding:14px 16px;margin-bottom:16px;display:grid;gap:12px"><div class="chips" role="group" aria-label="Meal time">' +
    SLOTS.map((c) => '<button class="chip" type="button" data-s="' + c[0] + '" aria-pressed="' + (c[0] === 'all') + '">' + c[1] + '</button>').join('') + '</div>' +
    '<p class="small muted" style="display:flex;gap:8px">' + I('info') + '<span>Annadanam is a free meal service. Timings can change on festival days and full moon nights, so confirm at the place.</span></p></div>' +
    '<div class="gmapbox" id="amap" style="margin-bottom:16px"><div style="height:280px" id="amapIn">' + SP.gmap({ q: 'Annadanam, near Arunachaleswarar Temple', z: 15, title: 'Google Map of Annadanam places' }) + '</div><div class="gmapbox__bar"><span>Demo map from Google Maps. Tap View on map on a place below.</span></div></div>' +
    '<p class="count" id="count" aria-live="polite" style="margin:0 2px 12px"></p><div class="rowlist" id="list" style="grid-template-columns:1fr"></div>';

  function card(a) {
    return '<article class="meal"><div class="meal__top">' + SP.media({ art: a.art, photo: a.photo, alt: a.name }) +
      '<div style="display:grid;gap:4px;min-width:0"><h3>' + esc(a.name) + '</h3>' +
      '<span class="metaline">' + I('pin') + esc(a.where) + '</span>' +
      '<span class="metaline">' + I('clock') + a.from + ' – ' + a.to + '</span>' +
      '<span><span class="badge badge--gold">' + LABEL[a.slot] + '</span></span></div></div>' +
      '<div class="meal__actions"><button class="btn btn--outline btn--sm" type="button" data-map="' + esc(a.q) + '">' + I('pin') + 'View on map</button>' +
      '<a class="btn btn--soft btn--sm" href="' + SP.mapsUrl(a.q) + '&travelmode=walking" target="_blank" rel="noopener">' + I('nav') + 'Directions</a></div></article>';
  }
  function render() {
    const list = D.annadanam.filter((a) => state.slot === 'all' || a.slot === state.slot);
    SP.$('#count').textContent = list.length + (list.length === 1 ? ' place' : ' places') + ' serving free meals';
    SP.$('#list').innerHTML = list.length ? list.map(card).join('') : '<div class="empty"><b>No places at this time</b><span>Try another meal time.</span></div>';
  }
  view.addEventListener('click', (e) => {
    const m = e.target.closest('[data-map]');
    if (m) { SP.$('#amapIn').innerHTML = SP.gmap({ q: m.dataset.map, z: 16, title: 'Google Map of ' + m.dataset.map }); SP.$('#amap').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const c = e.target.closest('[data-s]');
    if (!c) return;
    state.slot = c.dataset.s;
    SP.$$('[data-s]', view).forEach((b) => b.setAttribute('aria-pressed', b === c));
    render();
  });
  render();
})();
