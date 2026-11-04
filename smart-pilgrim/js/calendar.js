/* Festival calendar (home page). Month grid with special-day icons; tap a day to see what is on. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc;
  const host = SP.$('#cal');
  if (!host) return;
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const todayS = iso(new Date());
  const [lo, hi] = D.eventRange;
  const byDate = {};
  D.events.forEach((e) => { (byDate[e.date] = byDate[e.date] || []).push(e); });
  Object.keys(byDate).forEach((k) => byDate[k].sort((a, b) => a.rank - b.rank));
  const clamp = (s) => (s < lo ? lo : s > hi ? hi : s);
  const upcoming = (from) => D.events.filter((e) => e.date >= from).sort((a, b) => a.date.localeCompare(b.date) || a.rank - b.rank);
  const inRange = todayS >= lo && todayS <= hi, firstEv = upcoming(todayS)[0];
  const S = { sel: inRange ? todayS : (firstEv ? firstEv.date : hi) };
  S.month = S.sel.slice(0, 7);

  const fmt = (s, o) => parse(s).toLocaleDateString('en-IN', o);
  const rel = (s) => { const n = Math.round((parse(s) - parse(todayS)) / 86400000); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n > 1 ? 'In ' + n + ' days' : n === -1 ? 'Yesterday' : Math.abs(n) + ' days ago'; };

  host.innerHTML =
    '<div class="cal__main"><div class="cal__head"><button class="icon-btn" type="button" id="cPrev" aria-label="Previous month">' + I('left') + '</button><h3 id="cTitle" aria-live="polite"></h3><button class="icon-btn" type="button" id="cNext" aria-label="Next month">' + I('right') + '</button></div>' +
    '<div class="cal__dow" aria-hidden="true">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => '<span>' + d + '</span>').join('') + '</div>' +
    '<div class="cal__days" id="cDays" role="grid" aria-label="Calendar"></div>' +
    '<ul class="cal__legend" aria-label="What the icons mean">' + ['deepam', 'pournami', 'amavasai', 'pradosham', 'shivaratri', 'ekadashi'].map((k) => '<li><span aria-hidden="true">' + D.eventKinds[k].icon + '</span>' + (k === 'deepam' ? 'Deepam / festival' : D.eventKinds[k].label) + '</li>').join('') + '</ul></div>' +
    '<aside class="cal__panel" id="cPanel" aria-live="polite"></aside>' +
    '<div class="cal__next"><h3>Coming up</h3><div class="scroller" id="cNextList"></div></div>';

  function drawMonth() {
    const [y, m] = S.month.split('-').map(Number), first = new Date(y, m - 1, 1), n = new Date(y, m, 0).getDate();
    SP.$('#cTitle').textContent = first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    SP.$('#cPrev').disabled = S.month <= lo.slice(0, 7); SP.$('#cNext').disabled = S.month >= hi.slice(0, 7);
    let h = '';
    for (let i = 0; i < first.getDay(); i++) h += '<span class="cal__d cal__d--pad" aria-hidden="true"></span>';
    for (let d = 1; d <= n; d++) {
      const s = S.month + '-' + String(d).padStart(2, '0'), ev = byDate[s] || [], big = ev.some((e) => e.big);
      const icons = ev.slice(0, 2).map((e) => e.icon).join('');
      h += '<button type="button" class="cal__d' + (s === todayS ? ' is-today' : '') + (s === S.sel ? ' is-sel' : '') + (ev.length ? ' has-ev' : '') + (big ? ' is-big' : '') + '" data-d="' + s + '" aria-pressed="' + (s === S.sel) + '" aria-label="' + fmt(s, { day: 'numeric', month: 'long' }) + (ev.length ? ', ' + ev.map((e) => e.title).join(', ') : ', no special event') + '"><span class="cal__n">' + d + '</span><span class="cal__i" aria-hidden="true">' + icons + '</span></button>';
    }
    SP.$('#cDays').innerHTML = h;
  }
  let seen = {};
  function go(keys) {
    return keys.filter((k) => !seen[k] && (seen[k] = 1)).map((k) => { const g = D.eventGo[k]; return g ? '<a class="btn btn--soft btn--sm" href="' + g[1] + '"' + (k === 'stay' ? ' data-stay' : '') + '>' + esc(g[0]) + '</a>' : ''; }).join('');
  }
  function drawPanel() {
    seen = {};
    const ev = byDate[S.sel] || [], nx = upcoming(addDays(S.sel, 1))[0];
    let h = '<div class="cal__phead"><div class="datebox"><b>' + parse(S.sel).getDate() + '</b><span>' + fmt(S.sel, { month: 'short' }) + '</span></div><div><h3>' + fmt(S.sel, { weekday: 'long' }) + '</h3><p class="muted small">' + fmt(S.sel, { day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + rel(S.sel) + '</p></div></div>';
    if (ev.length) {
      h += ev.map((e) => '<article class="cal__ev' + (e.big ? ' is-big' : '') + '"><span class="cal__ic" aria-hidden="true">' + e.icon + '</span><div><h4>' + esc(e.title) + (e.big ? ' <span class="badge badge--gold">Special day</span>' : '') + '</h4><p>' + esc(e.text) + '</p>' + (e.go.length ? '<div class="cal__go">' + go(e.go) + '</div>' : '') + '</div></article>').join('');
    } else {
      h += '<div class="cal__ev"><span class="cal__ic" aria-hidden="true">🛕</span><div><h4>Regular temple day</h4><p>No special festival is listed. The temple is open for daily worship. Timings change on festival days, so check the notice board when you arrive.</p><div class="cal__go"><a class="btn btn--soft btn--sm" href="rooms.html" data-stay>Find a stay for this day</a><a class="btn btn--soft btn--sm" href="ride.html">Book a ride</a></div></div></div>';
    }
    if (nx && nx.date !== S.sel) h += '<button type="button" class="cal__jump" data-d="' + nx.date + '"><span aria-hidden="true">' + nx.icon + '</span><span><small>Next special day</small><b>' + esc(nx.title) + '</b> · ' + fmt(nx.date, { day: 'numeric', month: 'short' }) + '</span>' + I('right') + '</button>';
    h += '<p class="small muted">Dates follow published panchang listings. Tithi times can shift, so confirm with the temple notice before you travel.</p>';
    SP.$('#cPanel').innerHTML = h;
  }
  function drawNext() {
    SP.$('#cNextList').innerHTML = upcoming(todayS).filter((e) => e.rank < 9 || e.big).slice(0, 8).map((e) => '<button type="button" class="cal__chip" data-d="' + e.date + '"><span class="cal__ci" aria-hidden="true">' + e.icon + '</span><span><b>' + esc(e.title) + '</b><small>' + fmt(e.date, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + rel(e.date) + '</small></span></button>').join('') || '<p class="muted small">No more dates listed for this year.</p>';
  }
  const render = () => { drawMonth(); drawPanel(); };
  host.addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]');
    if (d) { S.sel = d.dataset.d; S.month = S.sel.slice(0, 7); render(); if (d.closest('.cal__next, .cal__jump')) host.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const st = e.target.closest('[data-stay]');
    if (st) { SP.store.set('stay', Object.assign(SP.store.get('stay', {}), { ci: S.sel < todayS ? todayS : S.sel, co: addDays(S.sel < todayS ? todayS : S.sel, 1) })); return; }
    const p = e.target.closest('#cPrev'), n = e.target.closest('#cNext');
    if (p || n) { const [y, m] = S.month.split('-').map(Number), d2 = new Date(y, m - 1 + (n ? 1 : -1), 1); const k = iso(d2).slice(0, 7); if (k >= lo.slice(0, 7) && k <= hi.slice(0, 7)) { S.month = k; drawMonth(); } }
  });
  render(); drawNext();
})();
