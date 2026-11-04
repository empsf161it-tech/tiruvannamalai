/* Product detail: gallery, price block, offers, delivery check, specs, reviews and similar items. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr, Sh = SP.shop;
  const view = SP.$('#view');
  const p = Sh.product((location.hash || '').slice(1));
  if (!p) { view.innerHTML = '<div class="container" style="padding-block:60px"><div class="empty"><b>We could not find that product</b><p>The link may be old.</p><a class="btn btn--primary" href="store.html">Back to the store</a></div></div>'; return; }
  document.title = p.name + ' | Thiruvannamalai Smart Pilgrim';
  const cat = Sh.cat(p.cat);
  let img = 0, qty = 1;
  const dist = [[5, 62], [4, 26], [3, 8], [2, 3], [1, 1]];
  const labels = ['Front', 'Close-up', 'Side', 'Detail'];

  function draw() {
    const w = Sh.wish().includes(p.id), inCart = SP.cart.qty(p.id);
    view.innerHTML =
      '<div class="container pd"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="store.html">Store</a><span>/</span><a href="store.html#' + p.cat + '">' + esc(cat.label) + '</a><span>/</span><span aria-current="page">' + esc(p.name) + '</span></nav>' +
      '<div class="pd__grid"><div class="pd__gal"><div class="pd__thumbs" role="tablist" aria-label="Product images">' + p.views.map((v, i) => '<button type="button" role="tab" data-img="' + i + '" aria-selected="' + (i === img) + '" aria-label="' + labels[i] + ' view">' + SP.media(Sh.photo(p, i)) + '</button>').join('') + '</div>' +
      '<div class="pd__main" id="pmain">' + SP.media(Sh.photo(p, img)) + '<button class="pd__heart icon-btn heart" type="button" data-wish="' + p.id + '" aria-pressed="' + w + '" aria-label="Save to wishlist">' + I('heart') + '</button>' + (p.best ? '<span class="pc__best">Bestseller</span>' : '') + '</div></div>' +
      '<div class="pd__info"><p class="pc__brand">' + esc(p.brand) + '</p><h1>' + esc(p.name) + '</h1>' +
      '<div class="pd__rate">' + Sh.ratingChip(p) + '<a href="#reviews" class="small" data-go="reviews">' + p.rv.toLocaleString('en-IN') + ' ratings</a></div>' +
      '<div class="pd__price">' + Sh.priceBlock(p, true) + '<small>Inclusive of all taxes</small></div>' +
      '<div class="pd__offers"><b>Offers</b><ul>' +
      '<li>' + I('star') + '<span><b>DEEPAM10</b>: 10% off on orders above ₹299</span></li><li>' + I('star') + '<span><b>PILGRIM50</b>: ₹50 off on orders above ₹499</span></li><li>' + I('pack') + '<span>Free delivery on orders above ₹499</span></li></ul></div>' +
      '<form class="pd__pin" id="pinf" novalidate><label for="pin"><b>Delivery</b></label><div class="pinrow"><input class="input" id="pin" inputmode="numeric" maxlength="6" placeholder="Enter pincode" autocomplete="postal-code" value="' + esc(SP.store.get('pin', '')) + '"><button class="btn btn--outline" type="submit">Check</button></div><p class="pd__pinout" id="pinout" role="status">Delivery by <b>' + Sh.deliveryDate(2) + '</b> to Tiruvannamalai (606601) · Cash on delivery available</p></form>' +
      '<div class="pd__buy"><div class="qty qty--lg" aria-label="Quantity"><button type="button" data-pq="-1" aria-label="Decrease quantity"' + (qty <= 1 ? ' disabled' : '') + '>' + I('minus') + '</button><output>' + qty + '</output><button type="button" data-pq="1" aria-label="Increase quantity"' + (qty >= 10 ? ' disabled' : '') + '>' + I('plus') + '</button></div>' +
      '<button class="btn btn--outline btn--lg" type="button" data-padd>' + I('cart') + (inCart ? 'Add more (' + inCart + ' in cart)' : 'Add to cart') + '</button><button class="btn btn--primary btn--lg" type="button" data-buy>Buy now</button></div>' +
      (p.stock <= 10 ? '<p class="stk stk--low">Only ' + p.stock + ' left in stock. Order soon.</p>' : '<p class="stk">In stock</p>') +
      '<ul class="pd__hl">' + p.hl.map((h) => '<li>' + I('check') + esc(h) + '</li>').join('') + '</ul></div></div>' +
      '<div class="pd__sections"><section class="hsec"><h2>About this item</h2><p>' + esc(p.about) + '</p></section>' +
      '<section class="hsec"><h2>Specifications</h2><dl class="specs">' + [['Brand', p.brand], ['Category', cat.label]].concat(p.spec).map((s) => '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>').join('') + '</dl><p class="small muted" style="margin-top:10px">Sample product details for the design preview.</p></section>' +
      '<section class="hsec" id="reviews"><h2>Ratings &amp; reviews</h2><div class="rv"><div class="rv__sum"><div class="rv__big"><b>' + p.rating.toFixed(1) + '</b><span>out of 5</span><small>' + p.rv.toLocaleString('en-IN') + ' ratings</small></div><div class="rv__bars">' + dist.map((d) => '<div class="rbar"><span>' + d[0] + ' ★</span><i><b style="width:' + d[1] + '%"></b></i><em>' + d[1] + '%</em></div>').join('') + '</div></div>' +
      '<ul class="rv__list">' + D.reviewsStore.map((r) => '<li><div class="rv__top"><span class="rd-avatar--sm">' + esc(r[0][0]) + '</span><div><b>' + esc(r[0]) + '</b><small>' + esc(r[3]) + '</small></div><span class="rchip">' + r[1] + '.0' + I('star') + '</span></div><p>' + esc(r[2]) + '</p></li>').join('') + '</ul></div></section></div>' +
      '<div class="sec-head"><h2>Similar products</h2><a href="store.html#' + p.cat + '">See all</a></div><div class="scroller deals" id="sim">' + D.products.filter((x) => x.cat === p.cat && x.id !== p.id).concat(D.products.filter((x) => x.cat !== p.cat && x.best)).slice(0, 6).map((x) => '<div class="dealc">' + Sh.card(x) + '</div>').join('') + '</div></div>' +
      '<div class="mbar mbar--shop"><div><s>' + inr(p.mrp) + '</s> <b>' + inr(p.price) + '</b></div><div class="mbar__btns"><button class="btn btn--outline" type="button" data-padd>Add to cart</button><button class="btn btn--primary" type="button" data-buy>Buy now</button></div></div>';
  }
  draw();
  Sh.bind(view);
  view.addEventListener('click', (e) => {
    const t = e.target.closest('[data-img]'); if (t) { img = +t.dataset.img; SP.$('#pmain .media').outerHTML = SP.media(Sh.photo(p, img)); SP.$$('[data-img]').forEach((b) => b.setAttribute('aria-selected', +b.dataset.img === img)); return; }
    const pq = e.target.closest('[data-pq]'); if (pq) { qty = Math.min(10, Math.max(1, qty + +pq.dataset.pq)); const o = SP.$('.pd__buy output'); o.textContent = qty; SP.$$('[data-pq]').forEach((b) => { b.disabled = (+b.dataset.pq < 0 && qty <= 1) || (+b.dataset.pq > 0 && qty >= 10); }); return; }
    if (e.target.closest('[data-padd]')) { SP.cart.add(p.id, qty); SP.toast(qty + ' added to cart'); const n = SP.cart.qty(p.id); SP.$$('.pd__buy [data-padd]').forEach((b) => { b.innerHTML = I('cart') + 'Add more (' + n + ' in cart)'; }); return; }
    if (e.target.closest('[data-buy]')) { if (!SP.cart.qty(p.id)) SP.cart.add(p.id, qty); location.href = 'cart.html#checkout'; return; }
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); SP.$('#' + g.dataset.go).scrollIntoView({ behavior: 'smooth' }); }
  });
  view.addEventListener('submit', (e) => {
    if (e.target.id !== 'pinf') return; e.preventDefault();
    const v = SP.$('#pin').value.trim(), o = SP.$('#pinout');
    if (!/^[1-9]\d{5}$/.test(v)) { o.className = 'pd__pinout bad'; o.textContent = 'Enter a valid 6-digit pincode.'; return; }
    SP.store.set('pin', v);
    const local = v.startsWith('6066');
    o.className = 'pd__pinout'; o.innerHTML = 'Delivery by <b>' + Sh.deliveryDate(local ? 2 : 5) + '</b> to ' + esc(v) + (local ? ' · Cash on delivery available' : ' · Prepaid only');
  });
  view.addEventListener('input', (e) => { if (e.target.id === 'pin') e.target.value = e.target.value.replace(/\D/g, ''); });
})();
