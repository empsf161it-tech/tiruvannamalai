/* Shop: shared helpers for the store, product and cart pages (e-commerce preview). */
(function () {
  'use strict';
  const SP = window.SP, D = SP.DATA, I = SP.icon, esc = SP.esc, inr = SP.inr;
  const Sh = (SP.shop = {});

  Sh.product = (id) => D.products.find((p) => p.id === id);
  Sh.cat = (id) => D.categories.find((c) => c.id === id);
  Sh.deliveryDate = (days) => { const d = new Date(); d.setDate(d.getDate() + (days || 2)); return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); };
  Sh.wish = () => SP.store.get('wish:products', []);
  Sh.toggleWish = (id) => { const w = Sh.wish(), i = w.indexOf(id); if (i > -1) w.splice(i, 1); else w.push(id); SP.store.set('wish:products', w); return i === -1; };
  Sh.photo = (p, i) => ({ art: (p.views || [p.art])[i || 0], slug: p.slug + (i ? '-' + (i + 1) : ''), alt: p.name });
  Sh.ratingChip = (p) => '<span class="rchip' + (p.rating < 4 ? ' rchip--mid' : '') + '">' + p.rating.toFixed(1) + I('star') + '</span><span class="rcount">(' + p.rv.toLocaleString('en-IN') + ')</span>';
  Sh.priceBlock = (p, big) => '<span class="pr' + (big ? ' pr--big' : '') + '"><b>' + inr(p.price) + '</b><s>' + inr(p.mrp) + '</s><em>' + p.off + '% off</em></span>';
  Sh.stockLabel = (p) => (p.stock <= 10 ? '<span class="stk stk--low">Only ' + p.stock + ' left</span>' : '');

  /* qty control or add button, driven by the cart */
  Sh.addControl = (p, cls) => {
    const q = SP.cart.qty(p.id);
    return q
      ? '<div class="qty qty--sm ' + (cls || '') + '" data-ctl="' + p.id + '"><button type="button" data-q="-1" data-id="' + p.id + '" aria-label="Remove one ' + esc(p.name) + '">' + I(q === 1 ? 'trash' : 'minus') + '</button><output aria-live="polite">' + q + '</output><button type="button" data-q="1" data-id="' + p.id + '" aria-label="Add one more ' + esc(p.name) + '"' + (q >= 10 ? ' disabled' : '') + '>' + I('plus') + '</button></div>'
      : '<button class="btn btn--primary btn--sm ' + (cls || '') + '" type="button" data-add="' + p.id + '" data-ctl="' + p.id + '">' + I('cart') + 'Add</button>';
  };

  Sh.card = (p) => {
    const w = Sh.wish().includes(p.id);
    return '<article class="pc" data-pid="' + p.id + '"><a class="pc__img" href="product.html#' + p.id + '" aria-label="View ' + esc(p.name) + '">' + SP.media(Sh.photo(p, 0)) +
      (p.off >= 20 ? '<span class="pc__off">' + p.off + '% off</span>' : '') + (p.best ? '<span class="pc__best">Bestseller</span>' : '') + '</a>' +
      '<button class="pc__heart heart" type="button" data-wish="' + p.id + '" aria-pressed="' + w + '" aria-label="Save ' + esc(p.name) + '">' + I('heart') + '</button>' +
      '<div class="pc__body"><p class="pc__brand">' + esc(p.brand) + '</p><h3><a href="product.html#' + p.id + '">' + esc(p.name) + '</a></h3><div class="pc__rate">' + Sh.ratingChip(p) + '</div>' +
      Sh.priceBlock(p) + '<p class="pc__del">' + (p.delivery ? '' : '<span class="free">Free delivery</span> · ') + 'by ' + Sh.deliveryDate(2) + '</p>' + Sh.stockLabel(p) +
      '<div class="pc__act">' + Sh.addControl(p) + '</div></div></article>';
  };

  /* cart maths */
  Sh.lines = () => SP.cart.get().map((l) => ({ p: Sh.product(l.id), q: l.q })).filter((l) => l.p);
  Sh.coupon = () => { const c = SP.store.get('coupon', ''); return c && D.coupons[c] ? Object.assign({ code: c }, D.coupons[c]) : null; };
  Sh.totals = (lines) => {
    lines = lines || Sh.lines();
    const mrp = lines.reduce((a, l) => a + l.p.mrp * l.q, 0), price = lines.reduce((a, l) => a + l.p.price * l.q, 0), c = Sh.coupon();
    let cd = 0; if (c && price >= c.min) cd = c.kind === 'pct' ? Math.round(price * c.v / 100) : c.v;
    const after = price - cd, delivery = lines.length && after < 499 ? 40 : 0;
    return { mrp, price, disc: mrp - price, coupon: cd, couponOk: !c || price >= c.min, delivery, total: after + delivery, count: lines.reduce((a, l) => a + l.q, 0), save: mrp - price + cd };
  };

  /* shared add/remove handling (event delegation) */
  Sh.bind = (root, after) => {
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-add]');
      if (a) { SP.cart.add(a.dataset.add); SP.toast('Added to cart'); Sh.refreshCtl(root, a.dataset.add); if (after) after(); return; }
      const q = e.target.closest('[data-q]');
      if (q) { const id = q.dataset.id; SP.cart.setQty(id, SP.cart.qty(id) + +q.dataset.q); Sh.refreshCtl(root, id); if (after) after(); return; }
      const w = e.target.closest('[data-wish]');
      if (w) { e.preventDefault(); const on = Sh.toggleWish(w.dataset.wish); SP.$$('[data-wish="' + w.dataset.wish + '"]', root).forEach((b) => b.setAttribute('aria-pressed', on)); SP.toast(on ? 'Saved to your wishlist' : 'Removed from wishlist'); }
    });
  };
  Sh.refreshCtl = (root, id) => {
    const p = Sh.product(id), tmp = document.createElement('div');
    SP.$$('[data-ctl="' + id + '"]', root).forEach((el) => { tmp.innerHTML = Sh.addControl(p, /qty--lg/.test(el.className) ? 'qty--lg' : /btn--lg/.test(el.className) ? 'btn--lg' : ''); el.replaceWith(tmp.firstChild); });
  };
})();
