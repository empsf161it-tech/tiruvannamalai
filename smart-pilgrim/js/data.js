/* ==========================================================================
   Sample data for the design preview.
   Everything here is placeholder content. Hotel and restaurant names, prices,
   ratings, Annadanam timings and map positions must be researched and verified
   before launch. To use a real photo anywhere, add `photo: 'assets/img/name.jpg'`
   to the item; the illustration is used only when no photo is set.
   ========================================================================== */
(function () {
  'use strict';
  const SP = (window.SP = window.SP || {});

  SP.DATA = {
    /* Karthigai Deepam 2026 falls on Tuesday, 24 November (Drik Panchang). */
    festival: { name: 'Karthigai Deepam', sub: 'Maha Deepam on the hill', date: '2026-11-24' },

    announcements: [
      { date: 'Sample', title: 'Karthigai Deepam crowds', text: 'Expect long queues at the temple in the days around the festival. Plan Girivalam for early morning.' },
      { date: 'Sample', title: 'Temple timings', text: 'Darshan timings can change on festival days. Check the temple notice board on arrival.' },
      { date: 'Sample', title: 'Parking and rides', text: 'Roads near the East Gopuram can be closed during peak hours. Book a ride to the nearest open lane.' },
    ],

    girivalamTips: [
      { h: 'Before you start', items: ['Walk clockwise around the hill, keeping the hill on your right.', 'Carry drinking water and a small towel. Walking barefoot is traditional, but the road can be hot at midday.', 'Keep phone, money and ID in one zipped pocket.'] },
      { h: 'On the way', items: ['Each of the eight lingams has its own shrine. Offer a short prayer or just pass by.', 'Most walkers take four to six hours for the full 14 km, depending on crowds.', 'Rest points and Annadanam places are listed in this app. Hours are sample data for now.'] },
      { h: 'Full moon nights', items: ['Pournami is the busiest night. Roads fill from the evening.', 'Start early or after midnight to avoid the peak.', 'Keep children and older family members close. Agree a meeting point in case you get separated.'] },
    ],

    /* The eight Ashta Lingams in walking order, clockwise from the east.
       `angle` is degrees clockwise from north, used by the schematic map only. */
    lingams: [
      { n: 1, id: 'indra', name: 'Indra Lingam', dir: 'East', angle: 98, note: 'Guardian of the east. The first lingam on the clockwise route.' },
      { n: 2, id: 'agni', name: 'Agni Lingam', dir: 'South-east', angle: 140, note: 'Guardian of the south-east, the direction of fire.' },
      { n: 3, id: 'yama', name: 'Yama Lingam', dir: 'South', angle: 180, note: 'Guardian of the south.' },
      { n: 4, id: 'nirruthi', name: 'Nirruthi Lingam', dir: 'South-west', angle: 225, note: 'Guardian of the south-west.' },
      { n: 5, id: 'varuna', name: 'Varuna Lingam', dir: 'West', angle: 270, note: 'Guardian of the west, the direction of water.' },
      { n: 6, id: 'vayu', name: 'Vayu Lingam', dir: 'North-west', angle: 315, note: 'Guardian of the north-west, the direction of wind.' },
      { n: 7, id: 'kubera', name: 'Kubera Lingam', dir: 'North', angle: 0, note: 'Guardian of the north.' },
      { n: 8, id: 'eesanya', name: 'Eesanya Lingam', dir: 'North-east', angle: 45, note: 'Guardian of the north-east. The last lingam before the temple.' },
    ],

    /* ---------- Hotels ---------- */
    hotels: [
      { id: 'h1', name: 'Annamalai Residency', rating: 4.4, reviews: 1330, km: 2.1, price: 1200, food: true, ac: 'AC / Non-AC rooms', art: ['hotel', 0],
        about: 'Family-run stay with simple rooms and an in-house restaurant. Good for pilgrims who want a clean room and an early start.',
        facilities: ['Hot water', 'Parking', 'Wi-Fi', 'Restaurant', '24-hour check-in', 'Power backup'],
        rooms: [{ n: 'Standard Non-AC', p: 1200, left: 5, g: 2 }, { n: 'Deluxe AC', p: 1700, left: 3, g: 3 }, { n: 'Family Room AC', p: 2400, left: 1, g: 4 }] },
      { id: 'h2', name: 'Sri Arunachala Hotel', rating: 4.2, reviews: 850, km: 1.8, price: 1800, food: false, ac: 'AC rooms', art: ['hotel', 1],
        about: 'Compact AC rooms close to the temple streets. No restaurant on site, with several eateries within walking distance.',
        facilities: ['Hot water', 'Lift', 'Wi-Fi', 'Parking', 'Temple view'],
        rooms: [{ n: 'Standard AC', p: 1800, left: 4, g: 2 }, { n: 'Deluxe AC', p: 2300, left: 2, g: 3 }] },
      { id: 'h3', name: 'Deepam Heritage Inn', rating: 4.5, reviews: 620, km: 0.9, price: 3200, food: true, ac: 'AC rooms', art: ['hotel', 2],
        about: 'Courtyard rooms in a traditional style, a short walk from the East Gopuram. Breakfast and meals are served in the dining hall.',
        facilities: ['Courtyard', 'Restaurant', 'Hot water', 'Wi-Fi', 'Lift', 'Power backup', 'Temple view'],
        rooms: [{ n: 'Courtyard Room', p: 3200, left: 2, g: 2 }, { n: 'Heritage Suite', p: 4600, left: 1, g: 4 }] },
      { id: 'h4', name: 'Girivalam Lodge', rating: 3.9, reviews: 410, km: 1.2, price: 650, food: false, ac: 'Non-AC rooms', art: ['hotel', 3],
        about: 'Budget rooms for walkers who need a place to rest and freshen up. Basic and clean.',
        facilities: ['Hot water', 'Parking', 'Luggage room'],
        rooms: [{ n: 'Single Non-AC', p: 650, left: 6, g: 1 }, { n: 'Double Non-AC', p: 900, left: 4, g: 2 }, { n: 'Dormitory bed', p: 300, left: 12, g: 1 }] },
      { id: 'h5', name: 'Pournami Comforts', rating: 4.3, reviews: 980, km: 2.8, price: 2400, food: true, ac: 'AC / Non-AC rooms', art: ['hotel', 4],
        about: 'Mid-range hotel with a vegetarian restaurant and a large parking area, useful for groups arriving by car or bus.',
        facilities: ['Restaurant', 'Large parking', 'Hot water', 'Wi-Fi', 'Lift', 'Power backup'],
        rooms: [{ n: 'Deluxe Non-AC', p: 2400, left: 4, g: 3 }, { n: 'Deluxe AC', p: 3000, left: 3, g: 3 }, { n: 'Family Suite', p: 4200, left: 1, g: 5 }] },
      { id: 'h6', name: 'Karthigai Grand', rating: 4.6, reviews: 540, km: 1.4, price: 4800, food: true, ac: 'AC rooms', art: ['hotel', 5],
        about: 'A premium stay with large rooms, a rooftop view of the hill and in-room dining.',
        facilities: ['Rooftop view', 'Restaurant', 'Room service', 'Wi-Fi', 'Lift', 'Parking', 'Power backup'],
        rooms: [{ n: 'Premier Room', p: 4800, left: 3, g: 2 }, { n: 'Hill View Suite', p: 6900, left: 1, g: 3 }] },
      { id: 'h7', name: 'Ashta Lingam Stay', rating: 4.1, reviews: 275, km: 3.4, price: 1450, food: false, ac: 'AC / Non-AC rooms', art: ['hotel', 6],
        about: 'Quiet guest house on the Girivalam route, handy for walkers who want to start and finish on the same road.',
        facilities: ['Hot water', 'Parking', 'Wi-Fi', 'Early check-in'],
        rooms: [{ n: 'Standard Non-AC', p: 1450, left: 5, g: 2 }, { n: 'Standard AC', p: 1900, left: 2, g: 2 }] },
      { id: 'h8', name: 'Hillview Residency', rating: 4.7, reviews: 310, km: 3.0, price: 5600, food: true, ac: 'AC rooms', art: ['hotel', 7],
        about: 'Quiet premium rooms with balconies facing Arunachala. Breakfast included.',
        facilities: ['Balcony', 'Breakfast included', 'Restaurant', 'Wi-Fi', 'Lift', 'Parking', 'Power backup'],
        rooms: [{ n: 'Balcony Room', p: 5600, left: 2, g: 2 }, { n: 'Family Suite', p: 7800, left: 1, g: 4 }] },
    ],

    /* ---------- Restaurants ---------- */
    eats: [
      { id: 'e1', name: 'Ayyappan Mess', rating: 4.5, reviews: 2340, km: 2.0, veg: true, types: ['meals', 'tiffin'], popular: true, cost: 140, hours: '7:00 AM – 10:00 PM', area: 'Near the bus stand', art: ['food', 'meal'],
        about: 'Banana-leaf meals served hot and quickly. Busy at lunch, so go before 12:30 PM.',
        menu: [['Full meals', 130], ['Ghee pongal', 60], ['Idli (2)', 30], ['Medhu vada', 20], ['Filter coffee', 25]] },
      { id: 'e2', name: 'Arunai Veg Restaurant', rating: 4.4, reviews: 1980, km: 1.5, veg: true, types: ['tiffin', 'meals'], popular: true, cost: 120, hours: '6:30 AM – 10:30 PM', area: 'Car Street side', art: ['food', 'dosa'],
        about: 'Crisp dosas and soft idlis with several chutneys. Meals from noon.',
        menu: [['Masala dosa', 80], ['Ghee roast', 90], ['Pongal vada', 70], ['Meals', 140], ['Filter coffee', 25]] },
      { id: 'e3', name: 'Deepam Tiffin Centre', rating: 4.3, reviews: 1120, km: 0.8, veg: true, types: ['tiffin'], popular: true, cost: 90, hours: '6:00 AM – 11:00 AM, 4:30 PM – 9:30 PM', area: 'Near the East Gopuram', art: ['food', 'idli'],
        about: 'A short walk from the temple. Idli, vada and pongal for an early breakfast before darshan.',
        menu: [['Idli (3)', 40], ['Pongal', 50], ['Poori masala', 60], ['Medhu vada', 20], ['Tea', 15]] },
      { id: 'e4', name: 'Girivalam Meals Hotel', rating: 4.0, reviews: 760, km: 1.1, veg: false, types: ['meals'], popular: false, cost: 160, hours: '11:30 AM – 3:30 PM, 7:00 PM – 10:00 PM', area: 'On the Girivalam road', art: ['food', 'meal'],
        about: 'Full meals for walkers on the Girivalam road, with vegetarian and non-vegetarian plates.',
        menu: [['Veg meals', 120], ['Curd rice', 50], ['Lemon rice', 60], ['Egg meals', 150]] },
      { id: 'e5', name: 'Mani Sweets & Snacks', rating: 4.2, reviews: 640, km: 0.6, veg: true, types: ['snacks'], popular: false, cost: 80, hours: '8:00 AM – 9:30 PM', area: 'Near the temple', art: ['food', 'sweet'],
        about: 'Laddu, mysore pak and murukku to carry home, plus hot snacks in the evening.',
        menu: [['Mysore pak (100 g)', 100], ['Laddu (each)', 25], ['Murukku (100 g)', 50], ['Jalebi (100 g)', 60]] },
      { id: 'e6', name: 'Temple Street Vada Stall', rating: 4.1, reviews: 430, km: 0.3, veg: true, types: ['snacks'], popular: false, cost: 40, hours: '7:00 AM – 8:00 PM', area: 'Outside the temple', art: ['food', 'vada'],
        about: 'Quick hot vadas and bajjis for a snack between queues.',
        menu: [['Medhu vada', 15], ['Masala vada', 15], ['Onion bajji', 30], ['Tea', 12]] },
      { id: 'e7', name: 'Ashram Road Cafe', rating: 4.3, reviews: 510, km: 3.2, veg: true, types: ['snacks', 'tiffin'], popular: false, cost: 150, hours: '8:00 AM – 9:00 PM', area: 'Ramana Ashram Road', art: ['food', 'coffee'],
        about: 'Quiet cafe with filter coffee, fresh juice and light snacks. Good for a rest after Girivalam.',
        menu: [['Filter coffee', 40], ['Fresh juice', 70], ['Sandwich', 90], ['Idli sambar', 50]] },
      { id: 'e8', name: 'Sri Murugan Tiffin', rating: 4.2, reviews: 330, km: 1.9, veg: true, types: ['tiffin'], popular: false, cost: 80, hours: '6:30 AM – 10:30 AM, 5:00 PM – 9:30 PM', area: 'Near the railway station', art: ['food', 'idli'],
        about: 'Simple tiffin shop with soft idlis and sambar, popular with early train arrivals.',
        menu: [['Idli (3)', 35], ['Dosa', 45], ['Upma', 40], ['Coffee', 20]] },
      { id: 'e9', name: 'Hill View Biryani House', rating: 4.0, reviews: 890, km: 2.6, veg: false, types: ['meals'], popular: false, cost: 220, hours: '12:00 PM – 10:30 PM', area: 'Chengam Road', art: ['food', 'meal'],
        about: 'Non-vegetarian restaurant away from the temple streets, for groups who want a different menu.',
        menu: [['Chicken biryani', 190], ['Mutton biryani', 260], ['Parotta (2)', 50], ['Veg meals', 130]] },
    ],

    /* ---------- Annadanam ---------- */
    annadanam: [
      { id: 'a1', name: 'Arunachaleswarar Temple Annadanam', where: 'Within temple premises', km: 0, from: '11:30 AM', to: '2:00 PM', slot: 'lunch', group: 'temple', art: ['place', 'temple'], q: 'Arunachaleswarar Temple' },
      { id: 'a2', name: 'Sri Ramanasramam Annadanam', where: '3.5 km from the temple', km: 3.5, from: '12:00 PM', to: '1:30 PM', slot: 'lunch', group: 'ashram', art: ['place', 'ashram'], q: 'Sri Ramanasramam' },
      { id: 'a3', name: 'Girivalam Annadanam Center', where: 'On the Girivalam route, near Indra Lingam', km: 1.4, from: '7:00 PM', to: '9:00 PM', slot: 'dinner', group: 'route', art: ['place', 'roadside'], q: 'Indra Lingam' },
      { id: 'a4', name: 'Car Street Morning Tiffin Hall', where: '0.4 km from the temple', km: 0.4, from: '7:30 AM', to: '9:30 AM', slot: 'morning', group: 'hall', art: ['place', 'hall'], q: 'Car Street' },
      { id: 'a5', name: 'Pournami Annadanam Pandal', where: 'On the Girivalam route, full moon nights only', km: 2.2, from: '6:00 PM', to: '11:00 PM', slot: 'dinner', group: 'route', art: ['place', 'roadside'], q: 'Girivalam Path' },
      { id: 'a6', name: 'Ashta Lingam Trust Hall', where: 'Near Agni Lingam', km: 4.1, from: '12:30 PM', to: '2:30 PM', slot: 'lunch', group: 'hall', art: ['place', 'hall'], q: 'Agni Lingam' },
    ],

    /* ---------- Store ---------- */
    categories: [
      { id: 'pooja', label: 'Pooja Items', icon: 'pack' },
      { id: 'lamps', label: 'Lamps & Deepam', icon: 'lamp' },
      { id: 'idols', label: 'Idols', icon: 'idol' },
      { id: 'books', label: 'Books', icon: 'book' },
      { id: 'prasadam', label: 'Prasadam', icon: 'sweet' },
      { id: 'others', label: 'Others', icon: 'grid' },
    ],
    products: [
      { id: 'p1', name: 'Pooja Kit', cat: 'pooja', price: 299, art: ['product', 'poojakit'], about: 'Coconut, bananas, flowers, camphor, incense and kumkum in a small basket. Enough for one temple visit.' },
      { id: 'p2', name: 'Camphor (Karpooram) 100 g', cat: 'pooja', price: 120, art: ['product', 'camphor'], about: 'Pure camphor tablets for aarti. Sealed pack.' },
      { id: 'p3', name: 'Incense Sticks, pack of 3', cat: 'pooja', price: 90, art: ['product', 'incense'], about: 'Sandal and rose incense. About 20 sticks in each pack.' },
      { id: 'p4', name: 'Kumkum & Turmeric Set', cat: 'pooja', price: 80, art: ['product', 'kumkum'], about: 'Three small tins: kumkum, turmeric and sandal powder.' },
      { id: 'p5', name: 'Brass Agal Lamp', cat: 'lamps', price: 350, art: ['product', 'lamp'], about: 'Hand-finished brass lamp with a wide base. Burns gingelly oil or ghee.' },
      { id: 'p6', name: 'Clay Deepam Set (12)', cat: 'lamps', price: 100, art: ['product', 'claylamps'], about: 'Twelve clay lamps for Karthigai Deepam. Soak in water before use.' },
      { id: 'p7', name: 'Gingelly Oil for Lamps, 500 ml', cat: 'lamps', price: 210, art: ['product', 'oil'], about: 'Cold-pressed oil with cotton wicks in the box.' },
      { id: 'p8', name: 'Black Stone Lingam (small)', cat: 'idols', price: 650, art: ['product', 'lingam'], about: 'Carved black stone lingam with a round base, about 4 inches tall.' },
      { id: 'p9', name: 'Temple & Girivalam Guide Book', cat: 'books', price: 180, art: ['product', 'book'], about: 'A pocket guide to the temple, the eight lingams and the 14 km route. English and Tamil.' },
      { id: 'p10', name: 'Vibuthi (Pack)', cat: 'prasadam', price: 50, art: ['product', 'vibhuti'], about: 'Sacred ash in a 100 g pack.' },
      { id: 'p11', name: 'Temple Prasadam (Laddu Box)', cat: 'prasadam', price: 150, art: ['product', 'laddu'], about: 'Box of six laddus. Best eaten within five days.' },
      { id: 'p12', name: 'Rudraksha Mala', cat: 'others', price: 499, art: ['product', 'mala'], about: 'Five-faced rudraksha beads, 108 + 1, on a cotton thread.' },
    ],

    /* ---------- Ride ---------- */
    vehicles: [
      { id: 'bike', label: 'Bike', icon: 'bike', range: '₹30 – ₹100', base: 15, perKm: 9, min: 30, seats: 1 },
      { id: 'auto', label: 'Auto', icon: 'auto', range: '₹50 – ₹150', base: 30, perKm: 15, min: 50, seats: 3 },
      { id: 'shareauto', label: 'Share Auto', icon: 'shareauto', range: '₹20 – ₹60', base: 10, perKm: 6, min: 20, seats: 1 },
      { id: 'cab', label: 'Cab', icon: 'car', range: '₹200+', base: 120, perKm: 18, min: 200, seats: 4 },
    ],
    /* Rough positions in km (x east, y south) from the temple, for fare estimates only. */
    places: [
      { n: 'Arunachaleswarar Temple (East Gopuram)', x: 0, y: 0 },
      { n: 'Tiruvannamalai Bus Stand', x: -0.6, y: 1.9 },
      { n: 'Tiruvannamalai Railway Station', x: 1.4, y: 2.1 },
      { n: 'Sri Ramanasramam', x: -2.6, y: 1.3 },
      { n: 'Skandasramam', x: -2.9, y: 0.9 },
      { n: 'Indra Lingam', x: 0.3, y: 1.0 },
      { n: 'Agni Lingam', x: 1.6, y: 2.2 },
      { n: 'Eesanya Lingam', x: 0.9, y: -1.9 },
      { n: 'Girivalam Start Point', x: 0.2, y: 0.4 },
    ],
    quickRoutes: [
      ['Tiruvannamalai Bus Stand', 'Arunachaleswarar Temple (East Gopuram)'],
      ['Tiruvannamalai Railway Station', 'Arunachaleswarar Temple (East Gopuram)'],
      ['Arunachaleswarar Temple (East Gopuram)', 'Sri Ramanasramam'],
      ['Girivalam Start Point', 'Eesanya Lingam'],
    ],
    drivers: [
      { name: 'Murugan K.', rating: 4.9, rides: 1840, eta: 3, langs: 'Tamil, English', since: 2019 },
      { name: 'Selvam R.', rating: 4.8, rides: 1220, eta: 5, langs: 'Tamil, Telugu', since: 2020 },
      { name: 'Kumar P.', rating: 4.7, rides: 960, eta: 7, langs: 'Tamil, Hindi', since: 2021 },
    ],
    vehicleModels: { bike: 'Honda Activa', auto: 'Bajaj auto-rickshaw', shareauto: 'Piaggio shared auto', cab: 'Maruti Dzire' },
    pastRides: [
      { id: 'SP-24018', from: 'Tiruvannamalai Bus Stand', to: 'Arunachaleswarar Temple (East Gopuram)', vehicle: 'Auto', fare: 70, date: 'Pournami, last month', status: 'Completed' },
      { id: 'SP-23991', from: 'Sri Ramanasramam', to: 'Tiruvannamalai Railway Station', vehicle: 'Cab', fare: 240, date: 'Last month', status: 'Completed' },
      { id: 'SP-23950', from: 'Indra Lingam', to: 'Girivalam Start Point', vehicle: 'Bike', fare: 35, date: 'Last month', status: 'Cancelled' },
    ],
  };
})();
