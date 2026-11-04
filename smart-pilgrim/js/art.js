/* ==========================================================================
   Picture set. Replaces the old drawn illustrations: every slot is now an
   image. Temple scenes use crops of the Arunachaleswarar Temple photograph
   in assets/img/. Food, rooms, products and vehicles use a warm photo tile
   with a picture emoji until licensed photographs are dropped into
   assets/img/<slug>.jpg (SP.media lays those over the tile automatically).
   ========================================================================== */
(function () {
  'use strict';
  const SP = (window.SP = window.SP || {});
  const A = (SP.art = {});
  const IMG = (n) => 'assets/img/' + n + '.jpg';

  const PHOTOS = {
    gopuram: 'temple-gopuram', left: 'temple-corridor-left', right: 'temple-corridor-right', pilgrims: 'temple-pilgrims',
    sky: 'temple-sky', tree: 'temple-tree', detail: 'temple-tower-detail', bg: 'temple-bg',
  };
  const photo = (k, pos, cls) => '<span class="ph ph--photo' + (cls ? ' ' + cls : '') + '" style="background-image:url(' + IMG(PHOTOS[k]) + ');background-position:' + (pos || 'center') + '"></span>';
  const tile = (emoji, a, b, cls) => '<span class="ph ph--tile' + (cls ? ' ' + cls : '') + '" style="--a:' + a + ';--b:' + b + '"><b class="ph__e" aria-hidden="true">' + emoji + '</b></span>';

  const PLACE = {
    temple: () => photo('gopuram', '50% 30%'), hill: () => photo('sky', '50% 40%'), shrine: () => photo('detail', '50% 40%'),
    cave: () => photo('left', '40% 60%'), ashram: () => photo('tree', '50% 50%'), hall: () => photo('pilgrims', '50% 60%'),
    roadside: () => photo('right', '30% 60%'),
  };
  const HOTEL = ['gopuram', 'left', 'right', 'detail', 'tree', 'pilgrims', 'sky', 'gopuram'];
  const HPOS = ['50% 35%', '40% 55%', '60% 50%', '50% 40%', '50% 50%', '50% 60%', '50% 40%', '50% 60%'];
  const FOOD = {
    meal: ['🍛', '#F6C46A', '#D98A2B'], idli: ['🍚', '#F7E6C0', '#E2B769'], dosa: ['🥞', '#F2C879', '#C97E2A'], vada: ['🍩', '#E8A24A', '#B86A1E'],
    sweet: ['🍮', '#F4B76B', '#C9702A'], coffee: ['☕', '#C99466', '#6E4426'],
  };
  const PROD = {
    lamp: ['🪔', '#F7CE6E', '#C98A1E'], claylamps: ['🪔', '#F0B167', '#B9651F'], vibhuti: ['🕉️', '#EFE6D8', '#BFAF95'], oil: ['🫙', '#F2D58A', '#C79A2E'],
    mala: ['📿', '#C79B6B', '#7A4A22'], lingam: ['🔱', '#B9B1A6', '#6F675C'], kumkum: ['🔴', '#F0A08A', '#C23B22'], camphor: ['🕯️', '#F4E8C8', '#D3B574'],
    book: ['📖', '#E6C98F', '#A87432'], laddu: ['🍬', '#F6C26B', '#D0842A'], bell: ['🔔', '#F3D27A', '#B9842A'], shankh: ['🐚', '#F2E4D2', '#C9A987'],
    sandal: ['🪵', '#E3C79B', '#A67C4A'], poojakit: ['🌺', '#F2B07A', '#C7552B'], incense: ['🌿', '#C9D6A0', '#6F8A3E'],
  };
  const T = (arr, cls) => tile(arr[0], arr[1], arr[2], cls);
  A.place = (k) => (PLACE[k] || PLACE.temple)();
  A.hotel = (i) => photo(HOTEL[(i || 0) % 8], HPOS[(i || 0) % 8]);
  A.food = (k) => T(FOOD[k] || FOOD.meal);
  A.product = (k) => T(PROD[k] || PROD.poojakit);
  A.productView = (k, i) => { const p = PROD[k] || PROD.poojakit; return i % 2 ? tile(p[0], p[2], p[1]) : T(p); };
  const VEH = { bike: '🏍️', auto: '🛺', shareauto: '🛺', cab: '🚕' };
  A.vehicle = (id) => '<span class="ph ph--veh" aria-hidden="true">' + (VEH[id] || '🛺') + '</span>';
  A.ride = () => A.vehicle('auto');
  A.interior = (kind, n) => {
    if (kind === 'room') return tile('🛏️', '#EBD2A8', '#B98A55');
    if (kind === 'dining') return tile('🍽️', '#F1C98A', '#C57F32');
    if (kind === 'lobby') return photo('left', '40% 55%');
    return photo(['gopuram', 'sky', 'detail', 'pilgrims'][(n || 0) % 4], '50% 40%');
  };
  A.heroTall = () => '<span class="ph ph--photo" style="background-image:url(' + IMG('temple-gopuram') + ');background-position:50% 30%"></span>';
  A.heroWide = () => '<span class="ph ph--photo" style="background-image:url(' + IMG('temple-bg') + ');background-position:50% 35%"></span>';
  A.render = (spec) => {
    if (!spec) return '';
    const k = spec[0], v = spec[1];
    if (k === 'hotel') return A.hotel(v || 0);
    if (k === 'food') return A.food(v);
    if (k === 'product') return A.product(v);
    if (k === 'productview') return A.productView(v, spec[2] || 0);
    if (k === 'place') return A.place(v);
    if (k === 'vehicle') return A.vehicle(v);
    if (k === 'hotelx') return A.interior(v, spec[2]);
    if (k === 'ride') return A.ride();
    return '';
  };
})();
