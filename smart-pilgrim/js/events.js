/* Festival and event calendar data for Nov and Dec 2026.
   Dates come from published panchang listings (Drik Panchang and similar). Tithi times shift by hour and place,
   so every day carries a "confirm with the temple" note. Descriptions are general, not the temple's official programme. */
(function () {
  'use strict';
  const SP = window.SP, D = (SP.DATA = SP.DATA || {});
  const KIND = {
    deepam: { icon: '🪔', label: 'Deepam', rank: 1 },
    festival: { icon: '🎉', label: 'Festival', rank: 2 },
    pournami: { icon: '🌕', label: 'Pournami', rank: 3 },
    shivaratri: { icon: '🕉️', label: 'Shivaratri', rank: 4 },
    amavasai: { icon: '🌑', label: 'Amavasai', rank: 5 },
    pradosham: { icon: '🔱', label: 'Pradosham', rank: 6 },
    ekadashi: { icon: '🙏', label: 'Ekadashi', rank: 7 },
    somavaram: { icon: '🌼', label: 'Somavaram', rank: 8 },
    ganesha: { icon: '🐘', label: 'Sankashti', rank: 9 },
    murugan: { icon: '🦚', label: 'Murugan', rank: 9 },
    month: { icon: '🌅', label: 'New month', rank: 10 },
  };
  const T = {
    pradosham: 'Evening worship around sunset with abhishekam for Nandi and Shiva. The temple gets busier from late afternoon.',
    somavaram: 'Mondays of Karthigai are special for Shiva. Many devotees fast and come for an early darshan.',
    amavasai: 'New moon day. Many families offer prayers for ancestors. Expect a larger crowd in the morning.',
    ekadashi: 'Fasting day observed by many devotees. Temples hold special worship.',
  };
  const G = {
    girivalam: ['Girivalam guide', 'index.html#girivalam'], stay: ['Find a stay for this day', 'rooms.html'], ride: ['Book a ride', 'ride.html'],
    lamps: ['Buy deepam lamps', 'store.html#lamps'], food: ['Annadanam places', 'annadanam.html'], map: ['Open the map', 'map.html'],
  };
  // [date, kind, title, text, options { icon, big, go: [keys] }]
  const E = [
    ['2026-11-06', 'pradosham', 'Pradosham', T.pradosham],
    ['2026-11-08', 'festival', 'Deepavali', 'Festival of lights. Homes are lit with lamps and families visit temples in the morning. Shops and roads are busy.', { icon: '🎆', big: true, go: ['lamps', 'ride'] }],
    ['2026-11-08', 'amavasai', 'Amavasai (Lakshmi Puja)', T.amavasai],
    ['2026-11-17', 'month', 'Karthigai month begins', 'The sacred Karthigai month leads up to the Deepam festival. Lamps are lit at homes every evening and the town begins to fill with pilgrims.', { go: ['stay'] }],
    ['2026-11-20', 'ekadashi', 'Devutthana Ekadashi', T.ekadashi],
    ['2026-11-22', 'pradosham', 'Pradosham', T.pradosham + ' Two days before Karthigai Deepam, so expect extra visitors.', { go: ['stay'] }],
    ['2026-11-23', 'somavaram', 'Karthigai Somavaram 1', T.somavaram, { go: ['stay', 'ride'] }],
    ['2026-11-24', 'deepam', 'Karthigai Deepam', 'The biggest day of the year. The Bharani Deepam is lit early in the morning in the temple and the Maha Deepam is lit on top of the hill at dusk. Lakhs of devotees come and Girivalam goes on through the night. Book stays and rides early.', { big: true, go: ['stay', 'girivalam', 'lamps', 'food'] }],
    ['2026-11-24', 'pournami', 'Karthigai Pournami (full moon)', 'Full moon day. Girivalam usually runs from the evening before to the end of the Pournami tithi. Roads are closed to vehicles in places, so plan to walk the last stretch.', { go: ['girivalam', 'map'] }],
    ['2026-11-27', 'ganesha', 'Sankashti Chaturthi', 'Worship of Ganesha after moonrise. Many devotees fast through the day.'],
    ['2026-11-30', 'somavaram', 'Karthigai Somavaram 2', T.somavaram],
    ['2026-12-01', 'murugan', 'Kalabhairava Jayanti', 'Special worship of Kalabhairava, a fierce form of Shiva. Evening pujas draw devotees.'],
    ['2026-12-04', 'ekadashi', 'Utpanna Ekadashi', T.ekadashi],
    ['2026-12-06', 'pradosham', 'Pradosham', T.pradosham],
    ['2026-12-07', 'somavaram', 'Karthigai Somavaram 3', T.somavaram],
    ['2026-12-07', 'shivaratri', 'Masik Shivaratri', 'Monthly night worship of Shiva. Some devotees stay awake and chant through the night.'],
    ['2026-12-08', 'amavasai', 'Amavasai', T.amavasai],
    ['2026-12-14', 'somavaram', 'Karthigai Somavaram 4', T.somavaram],
    ['2026-12-15', 'murugan', 'Skanda Sashti', 'Observed for Murugan on the last day of Karthigai. Devotees fast and visit Murugan shrines, including Skandasramam on the hill.', { go: ['map'] }],
    ['2026-12-16', 'month', 'Margazhi begins', 'The month of early-morning worship. Temples hold pre-dawn pujas and the Tiruppavai and Tiruvempavai verses are sung.', { icon: '🌄' }],
    ['2026-12-20', 'ekadashi', 'Vaikunta Ekadasi', 'A major Ekadashi. Temples open special doors and draw large morning crowds.', { icon: '🙏', big: true }],
    ['2026-12-21', 'pradosham', 'Pradosham', T.pradosham],
    ['2026-12-24', 'festival', 'Arudra Darshan', 'The festival of Nataraja, held on the Thiruvathirai star in Margazhi. Special abhishekam and a procession of the deity.', { icon: '💃', big: true }],
    ['2026-12-24', 'pournami', 'Pournami (full moon)', 'Full moon day. Girivalam usually runs from the evening before to the end of the Pournami tithi.', { go: ['girivalam', 'map'] }],
  ];
  D.eventKinds = KIND;
  D.eventGo = G;
  D.events = E.map((e) => ({ date: e[0], kind: e[1], title: e[2], text: e[3], icon: (e[4] && e[4].icon) || KIND[e[1]].icon, big: !!(e[4] && e[4].big), go: ((e[4] && e[4].go) || []).slice(), rank: KIND[e[1]].rank - (e[4] && e[4].big ? 10 : 0) }));
  D.eventRange = ['2026-11-01', '2026-12-31'];
})();
