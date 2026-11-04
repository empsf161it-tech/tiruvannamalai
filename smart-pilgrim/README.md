# Thiruvannamalai Smart Pilgrim: front end

Mobile-first front end for the temple visitor website, with a ride app (Rapido style), hotel booking (MakeMyTrip style) and an e-commerce store. Plain HTML, CSS and JavaScript with no build step and no framework. All content is **sample data** for the design review phase.

## Run it

Open `index.html` directly, or serve the folder so offline features can work:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000. The offline map and service worker (`sw.js`) need `http://localhost` or `https://`.

## Pages

| Page | File | What it has |
| --- | --- | --- |
| Home | `index.html` | Hero with background video, festival calendar (Nov–Dec 2026) with special-day icons,  service image cards, top stays, ride banner, food picks, store picks, weather / Girivalam / festival strip, about, Girivalam guide, announcements |
| Ride | `ride.html` | Rapido-style app: map with pins and route, pickup and drop search, saved places, vehicle list with fares, coupon, payment choice, finding a captain, live tracking with ride PIN, receipt and rating, ride history |
| Rooms & Hotels | `rooms.html` | MakeMyTrip-style search bar (area, dates, rooms and guests, price), offers, popular areas, filters, sorting, result cards with photos, ratings, discounts and taxes, My bookings |
| Hotel detail | `hotel.html#h3` | Photo gallery and lightbox, room types with inclusions and cancellation, amenities, reviews, location, policies, sticky booking card, 3-step booking (review, guest details, payment) and voucher |
| Food | `food.html` | Type filters, popular places first, detail sheet with menu and prices, Google Maps directions |
| Annadanam | `annadanam.html` | Free meal places with timings, meal-time filter, map links |
| Store | `store.html` | E-commerce listing: search, banner carousel, category circles, deals with countdown, filters, sorting, ratings, discounts, add to cart |
| Product | `product.html#p5` | Image gallery, price and offers, pincode delivery check, quantity, add to cart / buy now, specifications, reviews, similar products |
| Cart | `cart.html` | Cart with quantity and coupons (`DEEPAM10`, `PILGRIM50`), address, payment, order placed, My orders with tracking (`cart.html#orders`) |
| Offline Map | `map.html` | Google Map (demo embed) with temple, Girivalam path and the eight lingams, plus an offline schematic map with layers and download |
| Profile | `profile.html` | Login gate, profile details form, my rides, hotel bookings, orders, saved hotels and products, theme choice (light / dark / system), notifications, clear demo data, log out |

Login (header button) is a phone number plus OTP sheet. The demo OTP is `1234` everywhere.

## Responsive behaviour

| Width | Layout |
| --- | --- |
| under 768 px | Single column, bottom tab bar (Home, Ride, Stay, Food, Map), hamburger menu for the rest, sheets slide up from the bottom |
| 768 to 1079 px | Two-column grids, hamburger menu, centred dialogs |
| 1080 px and up | Full header navigation, side panels on Ride and Map |

Tested at 320, 375, 820 and 1360 px, light and dark, with no horizontal scrolling. Light and dark themes follow the device setting.

## Files

```
css/styles.css      design tokens, header, tab bar, sheets, shared components
css/pages.css       Ride, Stay, Store and Home additions
js/common.js        header, tab bar, sheets, toast, OTP, login, cart store, photo slots
js/art.js           picture tiles: temple photo crops for places and stays, emoji tiles for food, rooms, products and vehicles
js/profile.js       profile page
js/events.js        festival and event dates for the calendar
js/calendar.js      calendar on the home page
js/data.js          base sample content
js/data2.js         richer sample content: hotel galleries and reviews, product ratings and offers, coupons
js/stay.js          shared hotel search state, price maths, booking flow and voucher
js/shop.js          shared store helpers: cards, cart maths, add buttons
js/<page>.js        one script per page
assets/img/         drop licensed photographs here (see below)
sw.js               offline caching (https or localhost only)
```

## Hero video and festival calendar

- **Hero video:** `assets/video/worship.mp4` plays muted and looped behind the home hero, with a pause button. The bundled clip is a slow-motion loop made from the temple photo and is a stand-in. Replace the file with your own worship video (MP4, H.264, 1280x720 or larger, no audio, under 5 MB is best for phones). If the file is missing, the photo shows. People who prefer reduced motion see the photo and can press play.
- **Calendar:** `js/events.js` holds the dates (Pournami, Amavasai, Pradosham, Karthigai Deepam, Deepavali, Vaikunta Ekadasi, Arudra Darshan and more) for November and December 2026, taken from published panchang listings. Add a row to extend it. Tap a day to see the events, with shortcuts to stays, rides, lamps and the Girivalam guide. Descriptions are general; confirm tithi timings and the temple's own programme before launch.
- **Profile:** a Profile tab on phones (it shows your initial once logged in), "Profile" in the header on desktop, and an item in the menu.

## Pictures, background and maps

- **Page background:** `assets/img/temple-bg.jpg` (the East Gopuram photo) sits behind every page under a soft cream or dark overlay (`.site-bg` in `css/pages.css`). Replace the file to change it.
- **Temple photos:** `assets/img/temple-*.jpg` are crops of that photo. They are used for the hero, places, Annadanam and as stand-ins for hotel photos.
- **Food, rooms, products, vehicles:** these still use warm picture tiles with an emoji because licensed photographs were not available. The drawn SVG illustrations have been removed. Only small interface icons and the offline schematic map are SVG.
- **Real photographs:** save a JPG into `assets/img/` using the name below and it is laid over the tile automatically (no code change). A missing file simply shows the tile.

| Slot | File name |
| --- | --- |
| Hotel | `<hotel-slug>.jpg` (cover), `<hotel-slug>-2.jpg` to `-5.jpg`. Example: `annamalai-residency.jpg` |
| Hotel room type | `<hotel-slug>-<room-slug>.jpg`. Example: `annamalai-residency-deluxe-ac.jpg` |
| Product | `<product-slug>.jpg`, then `-2.jpg` to `-4.jpg`. Example: `brass-agal-lamp.jpg` |
| Restaurant / Annadanam | `<name-slug>.jpg` |
| Home cards | `x-ride.jpg`, `x-stay.jpg`, `x-food.jpg`, `x-annadanam.jpg`, `x-store.jpg`, `x-map.jpg` |
| Areas, categories, banners | `area-<slug>.jpg`, `cat-<id>.jpg`, `banner-<slug>.jpg` |

A slug is the name in lower case with spaces and symbols turned into hyphens. Use licensed photographs only, under about 300 KB each.

- **Google Maps:** `SP.gmap({ q: 'place' })` or `SP.gmap({ saddr, daddr })` in `js/common.js` returns a keyless Google Maps embed. It is used on the Offline Map, Ride, hotel detail, Food and Annadanam pages. Embeds need internet. For production use the Maps Embed API with your own key.
- **Theme:** the sun/moon button in the header (and Settings on the profile page) switches light, dark and system. The choice is saved in this browser.

## Before launch

- Hotels, restaurants, prices, ratings, Annadanam timings and map positions are placeholders. Verify each one locally before publishing.
- Check the Ashta Lingam positions and the Girivalam route against local or official sources. The map is schematic and not to scale.
- Parking and emergency points are shown as disabled layers until verified.
- Ride booking and tracking, hotel booking and vouchers, cart, payment and order tracking are interface previews only. Drivers, availability, prices, coupons and OTP are simulated and need backend, payment and service integration in a later phase.
- Demo login OTP is `1234`. Coupons: `DEEPAM10`, `PILGRIM50` (store), `GIRI20`, `TEMPLE10` (ride).
- Karthigai Deepam is shown as 24 November 2026 (source: Drik Panchang). Confirm with the temple.
