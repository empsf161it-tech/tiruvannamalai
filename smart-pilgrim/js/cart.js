/* Cart: cart -> address -> payment -> order placed, plus order history with tracking.
   Front-end preview only: no payment is taken and nothing is shipped. */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr, Sh = SP.shop;
  const view = SP.$('#view');
  const STAGES = ['Ordered', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  const S = { v: (location.hash || '').slice(1) === 'orders' ? 'orders' : (location.hash || '').slice(1) === 'checkout' ? 'address' : 'cart', pay: 'upi', addr: SP.store.get('addr', { name: '', phone: (SP.user() || {}).phone || '', pin: SP.store.get('pin', ''), line: '', city: 'Tiruvannamalai' }), last: null, cerr: '' };
  const orders = () => SP.store.get('orders', []);
  const saveOrders = (o) => SP.store.set('orders', o);

  const wrap = (inner, title) => '<div class="container cartp"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="store.html">Store</a><span>/</span><span aria-current="page">' + title + '</span></nav>' + inner + '</div>';
  const bar = (n) => '<ol class="bkbar" aria-label="Checkout steps">' + ['Cart', 'Address', 'Payment'].map((t, i) => '<li class="' + (i < n ? 'done' : i === n ? 'now' : '') + '"><span>' + (i < n ? I('check') : i + 1) + '</span>' + t + '</li>').join('') + '</ol>';

  function summary(t, cta) {
    const c = Sh.coupon();
    return '<aside class="csum"><h2>Price details</h2><div class="fare-lines"><div><span>Price (' + t.count + ' item' + (t.count > 1 ? 's' : '') + ')</span><span class="tnum">' + inr(t.mrp) + '</span></div><div class="ok"><span>Discount</span><span class="tnum">- ' + inr(t.disc) + '</span></div>' +
      (t.coupon ? '<div class="ok"><span>Coupon ' + esc(c.code) + '</span><span class="tnum">- ' + inr(t.coupon) + '</span></div>' : '') +
      '<div><span>Delivery</span><span class="tnum">' + (t.delivery ? inr(t.delivery) : '<b class="ok-t">Free</b>') + '</span></div><div class="total"><span>Total amount</span><span class="tnum">' + inr(t.total) + '</span></div></div>' +
      '<p class="csum__save">' + I('check') + 'You will save ' + inr(t.save) + ' on this order</p>' + (cta || '') + '</aside>';
  }
  function couponBox() {
    const c = Sh.coupon(), t = Sh.totals();
    return '<div class="cbox"><b>Apply coupon</b>' + (c ? '<div class="cbox__on">' + I('check') + '<span><b>' + esc(c.code) + '</b> ' + (t.couponOk ? 'applied' : 'needs ₹' + c.min + ' or more') + '</span><button type="button" class="linkbtn" data-rmc>Remove</button></div>' :
      '<form id="cf" class="rd-cpform"><input class="input" id="cc" placeholder="Try DEEPAM10 or PILGRIM50" autocomplete="off"><button class="btn btn--outline" type="submit">Apply</button></form><div class="field__error" id="ce" role="alert">' + esc(S.cerr) + '</div>') + '</div>';
  }

  function vCart() {
    const lines = Sh.lines();
    if (!lines.length) return wrap('<div class="cempty"><div class="cempty__art">' + SP.art.render(['product', 'claylamps']) + '</div><h1>Your cart is empty</h1><p class="muted">Add clay lamps, pooja kits or prasadam to get started.</p><a class="btn btn--primary btn--lg" href="store.html">Continue shopping</a><a class="linkbtn" href="cart.html#orders">View my orders</a></div>', 'Cart');
    const t = Sh.totals();
    return wrap('<h1 class="pagetitle">My cart <small>(' + t.count + ')</small></h1>' + bar(0) + '<div class="cgrid"><div class="cmain"><ul class="clines">' + lines.map((l) => '<li class="cl" data-line="' + l.p.id + '"><a class="cl__img" href="product.html#' + l.p.id + '">' + SP.media(Sh.photo(l.p, 0)) + '</a><div class="cl__info"><p class="pc__brand">' + esc(l.p.brand) + '</p><h3><a href="product.html#' + l.p.id + '">' + esc(l.p.name) + '</a></h3>' + Sh.priceBlock(l.p) + '<p class="small muted">Delivery by ' + Sh.deliveryDate(2) + (l.p.delivery ? '' : ' · Free') + '</p>' +
      '<div class="cl__act"><div class="qty qty--sm"><button type="button" data-q="-1" data-id="' + l.p.id + '" aria-label="Decrease quantity of ' + esc(l.p.name) + '"' + (l.q <= 1 ? ' disabled' : '') + '>' + I('minus') + '</button><output>' + l.q + '</output><button type="button" data-q="1" data-id="' + l.p.id + '" aria-label="Increase quantity of ' + esc(l.p.name) + '"' + (l.q >= 10 ? ' disabled' : '') + '>' + I('plus') + '</button></div><button type="button" class="linkbtn" data-rm="' + l.p.id + '">' + I('trash') + 'Remove</button></div></div><b class="cl__tot tnum">' + inr(l.p.price * l.q) + '</b></li>').join('') + '</ul>' + couponBox() +
      (t.delivery ? '<p class="cnote">' + I('pack') + 'Add items worth ' + inr(499 - (t.total - t.delivery)) + ' more for free delivery.</p>' : '') + '</div>' +
      summary(t, '<button class="btn btn--primary btn--lg btn--block" type="button" data-go="address">Place order</button><a class="linkbtn" href="store.html" style="justify-self:center">Continue shopping</a>') + '</div>' +
      '<div class="mbar mbar--shop"><div><small>Total</small><b>' + inr(t.total) + '</b></div><button class="btn btn--primary" type="button" data-go="address">Place order</button></div>', 'Cart');
  }
  function vAddress() {
    const lines = Sh.lines(); if (!lines.length) { S.v = 'cart'; return vCart(); }
    if (!S.addr.phone) S.addr.phone = (SP.user() || {}).phone || '';
    const a = S.addr, t = Sh.totals();
    return wrap('<h1 class="pagetitle">Delivery address</h1>' + bar(1) + '<div class="cgrid"><div class="cmain"><form id="af" class="fields fields--2 cform" novalidate>' +
      '<div class="field"><label for="an">Full name</label><input class="input" id="an" autocomplete="name" value="' + esc(a.name) + '"><div class="field__error" data-e="an"></div></div>' +
      '<div class="field"><label for="am">Mobile number</label><div class="phone"><span class="phone__cc">+91</span><input class="input" id="am" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" value="' + esc(a.phone) + '"></div><div class="field__error" data-e="am"></div></div>' +
      '<div class="field"><label for="ap">Pincode</label><input class="input" id="ap" inputmode="numeric" maxlength="6" autocomplete="postal-code" value="' + esc(a.pin) + '"><div class="field__error" data-e="ap"></div></div>' +
      '<div class="field"><label for="ac">City</label><input class="input" id="ac" autocomplete="address-level2" value="' + esc(a.city) + '"><div class="field__error" data-e="ac"></div></div>' +
      '<div class="field" style="grid-column:1/-1"><label for="al">Address (house no, street, landmark)</label><textarea class="textarea" id="al" autocomplete="street-address">' + esc(a.line) + '</textarea><div class="field__error" data-e="al"></div></div>' +
      '<div class="cform__nav"><button class="btn btn--soft btn--lg" type="button" data-go="cart">Back to cart</button><button class="btn btn--primary btn--lg" type="submit">Deliver here</button></div></form></div>' + summary(t) + '</div>', 'Checkout');
  }
  function vPay() {
    const lines = Sh.lines(); if (!lines.length) { S.v = 'cart'; return vCart(); }
    const t = Sh.totals(), a = S.addr;
    const opt = (v, ti, sm) => '<label class="radio"><input type="radio" name="pay" value="' + v + '"' + (S.pay === v ? ' checked' : '') + '><span><b>' + ti + '</b><small>' + sm + '</small></span></label>';
    return wrap('<h1 class="pagetitle">Payment</h1>' + bar(2) + '<div class="cgrid"><div class="cmain"><div class="bkbox"><div class="mybk__top"><b>Deliver to ' + esc(a.name) + '</b><button type="button" class="linkbtn" data-go="address">Change</button></div><p class="small muted">' + esc(a.line) + ', ' + esc(a.city) + ' ' + esc(a.pin) + ' · +91 ' + esc(a.phone) + '</p></div>' +
      '<div class="bkbox"><b>Choose payment method</b><div class="radios">' + opt('upi', 'UPI', 'Pay with any UPI app') + opt('card', 'Credit or debit card', 'Visa, Mastercard, RuPay') + opt('cod', 'Cash on delivery', 'Pay when the order arrives · ₹0 extra') + '</div><p class="demo-hint">' + I('info') + 'Preview only. No payment is taken.</p></div>' +
      '<div class="bkbox"><b>Review items (' + t.count + ')</b><ul class="rev-items">' + lines.map((l) => '<li>' + SP.media(Sh.photo(l.p, 0)) + '<span>' + esc(l.p.name) + '<small>Qty ' + l.q + '</small></span><b class="tnum">' + inr(l.p.price * l.q) + '</b></li>').join('') + '</ul></div></div>' +
      summary(t, '<button class="btn btn--primary btn--lg btn--block" type="button" data-place>' + (S.pay === 'cod' ? 'Place order' : 'Pay ' + inr(t.total)) + '</button>') + '</div>', 'Checkout');
  }
  function vDone() {
    const o = S.last, d = Sh.deliveryDate(2);
    return wrap('<div class="odone"><div class="success"><div class="success__mark">' + I('check') + '</div><h1 class="h3">Order placed</h1><p class="muted">Order <b>' + o.id + '</b> · ' + inr(o.total) + ' · ' + (o.pay === 'cod' ? 'Cash on delivery' : o.pay.toUpperCase()) + '</p></div>' +
      '<div class="bkbox"><b>Arriving ' + d + '</b><p class="small muted">' + esc(o.addr.line) + ', ' + esc(o.addr.city) + ' ' + esc(o.addr.pin) + '</p><ul class="rev-items">' + o.items.map((l) => { const p = Sh.product(l.id); return '<li>' + SP.media(Sh.photo(p, 0)) + '<span>' + esc(p.name) + '<small>Qty ' + l.q + '</small></span><b class="tnum">' + inr(p.price * l.q) + '</b></li>'; }).join('') + '</ul></div>' +
      '<div class="vch__act"><a class="btn btn--outline btn--lg" href="cart.html#orders" data-go="orders">Track order</a><a class="btn btn--primary btn--lg" href="store.html">Continue shopping</a></div><p class="small muted" style="text-align:center">Sample order for the design preview. Nothing will be shipped.</p></div>', 'Order placed');
  }
  function vOrders() {
    const all = orders();
    return wrap('<h1 class="pagetitle">My orders</h1>' + (all.length ? '<ul class="olist">' + all.map((o) => {
      const st = o.stage, cancelled = o.status === 'Cancelled';
      return '<li class="ord" data-o="' + o.id + '"><div class="ord__head"><div><b>' + o.id + '</b><small>' + new Date(o.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + inr(o.total) + '</small></div><span class="badge ' + (cancelled ? 'badge--bad' : st === 4 ? 'badge--ok' : 'badge--warn') + '">' + (cancelled ? 'Cancelled' : STAGES[st]) + '</span></div>' +
        '<ul class="rev-items">' + o.items.map((l) => { const p = Sh.product(l.id); return '<li>' + SP.media(Sh.photo(p, 0)) + '<span><a href="product.html#' + p.id + '">' + esc(p.name) + '</a><small>Qty ' + l.q + '</small></span><b class="tnum">' + inr(p.price * l.q) + '</b></li>'; }).join('') + '</ul>' +
        (cancelled ? '' : '<ol class="otrack" aria-label="Order status">' + STAGES.map((s, i) => '<li class="' + (i < st ? 'done' : i === st ? 'now' : '') + '"><span>' + (i <= st ? I('check') : '') + '</span>' + s + '</li>').join('') + '</ol>') +
        '<div class="ord__act">' + (cancelled || st === 4 ? '<button class="btn btn--outline btn--sm" type="button" data-reorder="' + o.id + '">Buy again</button>' : '<button class="btn btn--soft btn--sm" type="button" data-next-st="' + o.id + '">Preview next status</button>' + (st < 2 ? '<button class="btn btn--ghost btn--sm" type="button" data-cancel-o="' + o.id + '">Cancel order</button>' : '')) + '</div></li>';
    }).join('') + '</ul>' : '<div class="cempty"><div class="cempty__art">' + SP.art.render(['product', 'laddu']) + '</div><h2>No orders yet</h2><p class="muted">Your orders will show up here.</p><a class="btn btn--primary btn--lg" href="store.html">Start shopping</a></div>'), 'My orders');
  }

  function render() { view.innerHTML = S.v === 'orders' ? vOrders() : S.v === 'address' ? vAddress() : S.v === 'pay' ? vPay() : S.v === 'done' ? vDone() : vCart(); window.scrollTo({ top: 0 }); SP.refreshCart(); }
  const go = (v) => { S.v = v; history.replaceState(null, '', v === 'orders' ? '#orders' : v === 'address' || v === 'pay' ? '#checkout' : '#'); render(); };

  view.addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]'); if (q) { const id = q.dataset.id; SP.cart.setQty(id, SP.cart.qty(id) + +q.dataset.q); const y = scrollY; render(); scrollTo(0, y); return; }
    const rm = e.target.closest('[data-rm]'); if (rm) { SP.cart.setQty(rm.dataset.rm, 0); SP.toast('Removed from cart'); const y = scrollY; render(); scrollTo(0, y); return; }
    if (e.target.closest('[data-rmc]')) { SP.store.del('coupon'); S.cerr = ''; const y = scrollY; render(); scrollTo(0, y); return; }
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); const to = g.dataset.go; if (to === 'address' && S.v === 'cart' && !SP.user()) { SP.openLogin(() => go('address')); return; } go(to); return; }
    if (e.target.closest('[data-place]')) {
      const r = SP.$('input[name=pay]:checked', view); if (r) S.pay = r.value;
      const t = Sh.totals(), lines = Sh.lines();
      const o = { id: 'SPO-' + (70100 + Math.floor(Math.random() * 8800)), at: new Date().toISOString(), items: lines.map((l) => ({ id: l.p.id, q: l.q })), total: t.total, pay: S.pay, addr: S.addr, stage: 0, status: 'Active' };
      const all = orders(); all.unshift(o); saveOrders(all); S.last = o; SP.cart.clear(); SP.store.del('coupon'); S.v = 'done'; render(); return;
    }
    const ns = e.target.closest('[data-next-st]'); if (ns) { const all = orders(), o = all.find((x) => x.id === ns.dataset.nextSt); if (o) { o.stage = Math.min(4, o.stage + 1); saveOrders(all); const y = scrollY; render(); scrollTo(0, y); } return; }
    const co = e.target.closest('[data-cancel-o]'); if (co) { const all = orders(), o = all.find((x) => x.id === co.dataset.cancelO); if (o) { o.status = 'Cancelled'; saveOrders(all); SP.toast('Order cancelled'); const y = scrollY; render(); scrollTo(0, y); } return; }
    const ro = e.target.closest('[data-reorder]'); if (ro) { const o = orders().find((x) => x.id === ro.dataset.reorder); o.items.forEach((l) => SP.cart.add(l.id, l.q)); SP.toast('Items added to cart'); go('cart'); }
  });
  view.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'cf') {
      const c = SP.$('#cc').value.trim().toUpperCase();
      if (!D.coupons[c]) { S.cerr = c ? 'This coupon is not valid.' : 'Enter a coupon code.'; SP.$('#ce').textContent = S.cerr; return; }
      S.cerr = ''; SP.store.set('coupon', c); SP.toast(c + ' applied'); const y = scrollY; render(); scrollTo(0, y);
    } else if (e.target.id === 'af') {
      const g = (id) => SP.$('#' + id).value.trim(), a = { name: g('an'), phone: g('am'), pin: g('ap'), city: g('ac'), line: g('al') }, err = {};
      if (a.name.length < 3) err.an = 'Enter your full name.';
      if (!/^[6-9]\d{9}$/.test(a.phone)) err.am = 'Enter a valid 10-digit mobile number.';
      if (!/^[1-9]\d{5}$/.test(a.pin)) err.ap = 'Enter a valid 6-digit pincode.';
      if (a.city.length < 2) err.ac = 'Enter the city.';
      if (a.line.length < 8) err.al = 'Enter the full address.';
      SP.$$('[data-e]').forEach((n) => { n.textContent = err[n.dataset.e] || ''; });
      const first = Object.keys(err)[0]; if (first) { SP.$('#' + first).focus(); return; }
      S.addr = a; SP.store.set('addr', a); go('pay');
    }
  });
  view.addEventListener('input', (e) => { if (['am', 'ap'].includes(e.target.id)) e.target.value = e.target.value.replace(/\D/g, ''); });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h === 'orders' && S.v !== 'orders') go('orders'); });
  render();
})();
