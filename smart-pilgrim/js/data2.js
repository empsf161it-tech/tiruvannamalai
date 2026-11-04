/* ==========================================================================
   Extra sample data for the richer pages (hotel detail, store, ride).
   Added on top of data.js. All values are placeholders.
   ========================================================================== */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA;

  /* ---------- hotels ---------- */
  const HX = {
    h1: { stars: 3, area: 'Car Street', mrp: 1650, freeCancel: true, breakfast: false, type: 'Hotel', tag: 'Pilgrim favourite' },
    h2: { stars: 3, area: 'Chengam Road', mrp: 2400, freeCancel: true, breakfast: false, type: 'Hotel', tag: '' },
    h3: { stars: 4, area: 'East Gopuram Street', mrp: 4100, freeCancel: true, breakfast: true, type: 'Heritage stay', tag: 'Closest to temple' },
    h4: { stars: 2, area: 'Girivalam Road', mrp: 900, freeCancel: false, breakfast: false, type: 'Lodge', tag: 'Budget pick' },
    h5: { stars: 3, area: 'Vellore Road', mrp: 3200, freeCancel: true, breakfast: true, type: 'Hotel', tag: 'Group friendly' },
    h6: { stars: 4, area: 'Temple Ring Road', mrp: 6400, freeCancel: true, breakfast: true, type: 'Hotel', tag: 'Hill view' },
    h7: { stars: 2, area: 'Girivalam Road', mrp: 1900, freeCancel: false, breakfast: false, type: 'Guest house', tag: '' },
    h8: { stars: 4, area: 'Ramana Ashram Road', mrp: 7400, freeCancel: true, breakfast: true, type: 'Hotel', tag: 'Top rated' },
  };
  const RV = [
    ['Ramesh S.', 'Chennai', 5, 'Clean room and very polite staff. Reached the East Gopuram in ten minutes on foot. Would stay again for the next Pournami.', '2 weeks ago'],
    ['Lakshmi V.', 'Bengaluru', 4, 'Good value for the location. Hot water was reliable. Parking is tight on full moon days so come early.', '1 month ago'],
    ['Karthik M.', 'Coimbatore', 4, 'Simple, comfortable and quiet at night. The restaurant opens early which helped before darshan.', '1 month ago'],
    ['Anitha R.', 'Madurai', 5, 'Travelled with elderly parents. The lift and ground-floor check-in made it easy. Staff arranged an auto for us.', '2 months ago'],
    ['Joseph T.', 'Hyderabad', 3, 'Rooms are basic but clean. Wi-Fi was slow in the evening. Fine for a night or two.', '3 months ago'],
  ];
  const POL = [
    ['Check-in / Check-out', 'Check-in from 12:00 PM. Check-out by 11:00 AM. Early check-in is subject to availability.'],
    ['Cancellation', 'Free cancellation up to 24 hours before check-in on eligible rooms. After that the first night is charged. Sample policy.'],
    ['ID proof', 'Every guest needs a valid government photo ID at check-in. Foreign nationals need a passport and visa.'],
    ['Guests', 'Unmarried couples are accepted with valid ID. Pets are not allowed. Outside food is not allowed in the restaurant.'],
    ['Festival days', 'On Pournami and Karthigai Deepam, rates and minimum stay can change. Rooms may sell out weeks ahead.'],
  ];
  D.hotels.forEach((h, i) => {
    const x = HX[h.id];
    Object.assign(h, x);
    h.slug = SP.slug(h.name);
    h.gallery = [h.art, ['hotelx', 'room', i], ['hotelx', 'lobby', i], ['hotelx', 'dining', i], ['hotelx', 'view', i]];
    h.galleryLabels = ['Exterior', 'Room', 'Lobby', 'Dining', 'View'];
    h.off = Math.round((1 - h.price / h.mrp) * 100);
    h.taxes = Math.round(h.price * (h.price > 7500 ? .18 : h.price > 1000 ? .12 : 0));
    h.ratings = { Cleanliness: Math.min(5, h.rating + .1), Location: Math.min(5, h.rating + (h.km < 1.5 ? .3 : -.2)), Food: h.food ? Math.min(5, h.rating) : h.rating - .5, Staff: Math.min(5, h.rating + .2), 'Value for money': h.rating - .1 };
    h.reviewList = RV.map((r, k) => ({ name: r[0], from: r[1], stars: r[2], text: r[3], when: r[4] })).slice(i % 2, (i % 2) + 4);
    h.policies = POL;
    h.rooms.forEach((r, k) => {
      r.id = h.id + '-r' + k;
      r.mrp = Math.round(r.p * (1 + (h.off + 6) / 100) / 50) * 50;
      r.size = 150 + k * 60 + (i % 3) * 20;
      r.bed = r.g > 3 ? '2 double beds' : r.g > 1 ? '1 double bed' : '1 single bed';
      r.ac = /AC/.test(r.n) && !/Non-AC/.test(r.n);
      r.incl = [r.ac ? 'Air conditioning' : 'Ceiling fan', 'Hot water', 'TV', h.breakfast ? 'Breakfast included' : 'Breakfast available on request'];
      r.freeCancel = h.freeCancel && k !== h.rooms.length - 1;
      r.art = ['hotelx', 'room', i + k];
    });
  });
  D.areas = [
    { n: 'Near the temple', sub: 'Within 1.5 km of the East Gopuram', f: { maxKm: 1.5 }, art: ['place', 'temple'] },
    { n: 'Girivalam Road', sub: 'Walk straight onto the 14 km path', f: { area: 'Girivalam Road' }, art: ['place', 'hill'] },
    { n: 'Ramana Ashram Road', sub: 'Quiet, near the ashrams and caves', f: { area: 'Ramana Ashram Road' }, art: ['place', 'cave'] },
    { n: 'Car Street', sub: 'Shops and eateries on your doorstep', f: { area: 'Car Street' }, art: ['place', 'shrine'] },
  ];
  D.hotelOffers = [
    { t: 'Karthigai Deepam early bird', s: 'Extra 10% off if you book before 10 Nov. Code DEEPAM10', c: 'a' },
    { t: 'Free cancellation', s: 'On most rooms until 24 hours before check-in', c: 'b' },
    { t: 'Pay at hotel', s: 'Reserve now and pay when you arrive', c: 'c' },
  ];

  /* ---------- store ---------- */
  const PX = {
    p1: { mrp: 399, rating: 4.4, rv: 1280, brand: 'Arunai Pooja', best: true, stock: 40, hl: ['Coconut, 2 bananas, flowers and betel leaves', 'Camphor, incense and kumkum included', 'Packed in a reusable palm basket'], spec: [['Contents', '9 items'], ['Weight', '650 g'], ['Shelf life', '2 days (flowers)']] },
    p2: { mrp: 150, rating: 4.6, rv: 2140, brand: 'Arunai Pooja', stock: 120, hl: ['Pure, smoke-free burn', '100 g, about 60 tablets', 'Sealed against moisture'], spec: [['Weight', '100 g'], ['Form', 'Tablets'], ['Shelf life', '24 months']] },
    p3: { mrp: 120, rating: 4.3, rv: 910, brand: 'Santhi', stock: 80, hl: ['Sandal and rose', '3 packs, about 20 sticks each', 'Low smoke'], spec: [['Pack', '3 x 20 sticks'], ['Burn time', '40 min per stick'], ['Fragrance', 'Sandal, rose']] },
    p4: { mrp: 99, rating: 4.5, rv: 760, brand: 'Santhi', stock: 60, hl: ['Kumkum, turmeric and sandal powder', 'Three screw-top tins', 'Skin-safe'], spec: [['Tins', '3'], ['Net weight', '3 x 25 g'], ['Type', 'Powder']] },
    p5: { mrp: 520, rating: 4.7, rv: 640, brand: 'Kumbakonam Brass', best: true, stock: 18, hl: ['Hand-finished brass', 'Wide stable base', '5 inches tall, 250 g'], spec: [['Material', 'Brass'], ['Height', '5 in'], ['Weight', '250 g']] },
    p6: { mrp: 140, rating: 4.5, rv: 1530, brand: 'Arunai Pooja', deal: true, stock: 200, hl: ['12 hand-made clay lamps', 'Ideal for Karthigai Deepam', 'Soak in water for 30 minutes before use'], spec: [['Count', '12'], ['Diameter', '2.5 in'], ['Material', 'Clay']] },
    p7: { mrp: 260, rating: 4.4, rv: 520, brand: 'Chekku Gold', deal: true, stock: 70, hl: ['Cold-pressed gingelly oil', '500 ml with cotton wicks', 'Burns clean with little smoke'], spec: [['Volume', '500 ml'], ['Type', 'Cold-pressed'], ['Shelf life', '12 months']] },
    p8: { mrp: 850, rating: 4.6, rv: 330, brand: 'Mahabalipuram Stone', stock: 9, hl: ['Carved black stone', 'Round base, 4 inches tall', 'Hand polished'], spec: [['Material', 'Black granite'], ['Height', '4 in'], ['Weight', '1.1 kg']] },
    p9: { mrp: 220, rating: 4.2, rv: 410, brand: 'Pilgrim Press', stock: 55, hl: ['Pocket size, 96 pages', 'Temple, 8 lingams and the 14 km route', 'English and Tamil'], spec: [['Pages', '96'], ['Language', 'English, Tamil'], ['Binding', 'Paperback']] },
    p10: { mrp: 60, rating: 4.5, rv: 2680, brand: 'Arunachala Temple Trust', best: true, stock: 300, hl: ['Sacred ash, 100 g', 'Sealed pouch', 'Sample item for demo'], spec: [['Weight', '100 g'], ['Type', 'Vibhuti']] },
    p11: { mrp: 180, rating: 4.4, rv: 1890, brand: 'Arunachala Temple Trust', deal: true, stock: 35, hl: ['Box of six laddus', 'Made with ghee', 'Best eaten within five days'], spec: [['Count', '6'], ['Weight', '300 g'], ['Shelf life', '5 days']] },
    p12: { mrp: 699, rating: 4.3, rv: 590, brand: 'Rameswaram Beads', stock: 25, hl: ['Five-faced rudraksha', '108 + 1 beads', 'Cotton thread, knotted'], spec: [['Beads', '109'], ['Size', '8 mm'], ['Faces', '5']] },
  };
  const NEW = [
    { id: 'p13', name: 'Brass Pooja Bell', cat: 'pooja', price: 380, art: ['product', 'bell'], about: 'Hand bell with a long ring for daily pooja and temple use.', mrp: 520, rating: 4.5, rv: 380, brand: 'Kumbakonam Brass', stock: 30, hl: ['Solid brass', 'Clear, long ring', '4 inches tall'], spec: [['Material', 'Brass'], ['Height', '4 in'], ['Weight', '320 g']] },
    { id: 'p14', name: 'Conch Shell (Shankh), medium', cat: 'idols', price: 450, art: ['product', 'shankh'], about: 'Natural sea conch for pooja, cleaned and polished.', mrp: 600, rating: 4.4, rv: 210, brand: 'Rameswaram Beads', stock: 14, hl: ['Natural conch', 'Polished finish', 'About 6 inches'], spec: [['Length', '6 in'], ['Type', 'Natural']] },
    { id: 'p15', name: 'Sandalwood Sticks (50 g)', cat: 'pooja', price: 260, art: ['product', 'sandal'], about: 'Aged sandalwood sticks for grinding the paste used for tilak.', mrp: 340, rating: 4.3, rv: 470, brand: 'Mysore Heritage', stock: 22, hl: ['50 g, 6 to 8 sticks', 'Aged and fragrant', 'Sample item'], spec: [['Weight', '50 g'], ['Origin', 'Karnataka']] },
  ];
  D.products.forEach((p) => Object.assign(p, PX[p.id]));
  NEW.forEach((p) => D.products.push(p));
  D.products.forEach((p, i) => {
    p.slug = SP.slug(p.name);
    p.off = Math.round((1 - p.price / p.mrp) * 100);
    p.delivery = p.price >= 499 ? 0 : 40;
    p.views = [p.art, ['productview', p.art[1], 1], ['productview', p.art[1], 2], ['productview', p.art[1], 3]];
  });
  D.catArt = { pooja: ['product', 'poojakit'], lamps: ['product', 'lamp'], idols: ['product', 'lingam'], books: ['product', 'book'], prasadam: ['product', 'laddu'], others: ['product', 'mala'] };
  D.banners = [
    { t: 'Karthigai Deepam essentials', s: 'Clay lamps, gingelly oil and brass lamps. Delivered before 24 Nov.', cta: 'Shop lamps', cat: 'lamps', tone: 'a', art: ['product', 'claylamps'] },
    { t: 'Pooja kits, ready to carry', s: 'Everything for one temple visit in one basket.', cta: 'Shop pooja items', cat: 'pooja', tone: 'b', art: ['product', 'poojakit'] },
    { t: 'Prasadam from the temple town', s: 'Laddu, vibhuti and kumkum, packed fresh.', cta: 'Shop prasadam', cat: 'prasadam', tone: 'c', art: ['product', 'laddu'] },
  ];
  D.coupons = {
    DEEPAM10: { kind: 'pct', v: 10, min: 299, text: '10% off on orders above ₹299' },
    PILGRIM50: { kind: 'flat', v: 50, min: 499, text: '₹50 off on orders above ₹499' },
  };
  D.reviewsStore = [
    ['Meenakshi S.', 5, 'Good quality and packed well. Reached in two days.', 'Verified purchase'],
    ['Arun K.', 4, 'Value for money. The colour is slightly different from the picture.', 'Verified purchase'],
    ['Priya D.', 5, 'Bought for the temple visit. Exactly as described.', 'Verified purchase'],
  ];

  /* ---------- ride ---------- */
  D.vehicles = [
    { id: 'bike', label: 'Bike', tag: 'Fastest', sub: 'Quick, one person', base: 15, perKm: 9, min: 30, seats: 1, speed: 2.2 },
    { id: 'shareauto', label: 'Share Auto', tag: 'Cheapest', sub: 'Shared seat on set routes', base: 10, perKm: 6, min: 20, seats: 1, speed: 3.4 },
    { id: 'auto', label: 'Auto', tag: '', sub: 'Up to 3 people', base: 30, perKm: 15, min: 50, seats: 3, speed: 3 },
    { id: 'cab', label: 'Cab', tag: 'Comfort', sub: 'AC, up to 4 people', base: 120, perKm: 18, min: 200, seats: 4, speed: 2.8 },
  ];
  D.places.push({ n: 'Kubera Lingam', x: -1.2, y: -2.2 });
  D.places.forEach((p) => { if (p.n === 'Agni Lingam') { p.x = 1.9; p.y = 2.7; } if (p.n === 'Skandasramam') { p.x = -3.1; p.y = 0.5; p.up = true; } });
  D.savedPlaces = [
    { n: 'Tiruvannamalai Bus Stand', k: 'Bus stand' },
    { n: 'Tiruvannamalai Railway Station', k: 'Railway' },
    { n: 'Sri Ramanasramam', k: 'Ashram' },
    { n: 'Girivalam Start Point', k: 'Girivalam' },
  ];
  D.ridePromos = [
    { c: 'GIRI20', t: '₹20 off your first Girivalam ride', off: 20 },
    { c: 'TEMPLE10', t: '10% off rides to the temple', pct: 10 },
  ];
})();
