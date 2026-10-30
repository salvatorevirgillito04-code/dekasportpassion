/* Deka Sport Passion – demo. Negozio: catalogo, scheda prodotto, carrello, offerte in Home.
   I dati vengono da data/catalogo.js (elenco) e data/p/<id>.js (scheda), letti dal loro sito attuale. */
(function () {
  var CAT = window.DEKA_CATALOGO || [];
  var WA_LINK = 'https://wa.me/393488112611';
  /* Demo: gli ordini arrivano a Salvo finché il negozio non approva; poi rimettere WA_LINK */
  var DEMO_WA = 'https://wa.me/393450397323';
  var KEY = 'deka-carrello';
  var PER_PAGE = 24;

  /* Prezzi all'italiana (2.399 €, 84,90 €) scritti a mano: non tutti i browser hanno il formato italiano */
  var eur = function (n) {
    var parts = (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0).split('.');
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (parts[1] ? ',' + parts[1] : '') + ' €';
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };
  var byId = {};
  CAT.forEach(function (p) { byId[p.id] = p; });
  var param = function (k) { return new URLSearchParams(location.search).get(k) || ''; };
  var off = function (p) { return p.w ? Math.round((1 - p.p / p.w) * 100) : 0; };

  /* Carrello: resta solo nel browser di chi lo usa */
  var load = function () {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  };
  var save = function (items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* navigazione privata: il carrello vale solo per questa pagina */ }
    badge(items);
  };
  var badge = function (items) {
    var n = items.reduce(function (s, i) { return s + i.q; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = n;
      el.hidden = !n;
    });
  };
  badge(load());

  var card = function (p) {
    return '<a class="prod" href="prodotto.html?id=' + p.id + '">' +
      (p.f ? '<img src="img/p/' + p.id + '.jpg" alt="' + esc(p.n) + '" width="600" height="600" loading="lazy">'
           : '<span class="prod-nofoto">Foto in arrivo</span>') +
      '<span class="in"><span class="prod-sport">' + esc(p.s || p.c) + (p.b ? ' · ' + esc(p.b) : '') + '</span>' +
      '<span class="prod-name">' + esc(p.n) + '</span>' +
      '<span class="price">' + (p.w ? '<s>' + eur(p.w) + '</s> ' : '') + eur(p.p) + '</span>' +
      (p.w ? '<span class="badge">−' + off(p) + '%</span>' : '') + '</span></a>';
  };

  /* Home: le offerte più forti, una per sottocategoria */
  var offers = document.getElementById('offerte-grid');
  if (offers) {
    var seen = {};
    offers.innerHTML = CAT.filter(function (p) { return p.w && p.f; })
      .sort(function (a, b) { return off(b) - off(a); })
      .filter(function (p) { var k = p.c + p.s; if (seen[k]) return false; seen[k] = 1; return true; })
      .slice(0, 8).map(card).join('');
  }

  /* Catalogo con ricerca e filtri */
  var grid = document.getElementById('catalog-grid');
  if (grid) {
    var f = document.getElementById('filters');
    var state = { q: param('q'), cat: param('cat'), sub: param('sub'), brand: param('brand'), sort: param('sort') || 'new', off: param('off') === '1', shown: PER_PAGE };
    var count = function (list, key) {
      var m = {};
      list.forEach(function (p) { if (p[key]) m[p[key]] = (m[p[key]] || 0) + 1; });
      return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; }).map(function (k) { return [k, m[k]]; });
    };
    var options = function (sel, list, all, cur) {
      sel.innerHTML = '<option value="">' + all + '</option>' + list.map(function (x) {
        return '<option value="' + esc(x[0]) + '"' + (x[0] === cur ? ' selected' : '') + '>' + esc(x[0]) + ' (' + x[1] + ')</option>';
      }).join('');
    };
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    f.q.value = state.q;
    f.sort.value = state.sort;
    f.off.checked = state.off;
    var chips = document.getElementById('cat-chips');
    chips.innerHTML = [['', CAT.length]].concat(count(CAT, 'c')).map(function (x) {
      return '<button type="button" class="chip" data-cat="' + esc(x[0]) + '">' + (x[0] ? esc(x[0]) : 'Tutto') + '</button>';
    }).join('');

    var render = function () {
      var words = norm(state.q).split(/\s+/).filter(Boolean);
      var inCat = CAT.filter(function (p) { return !state.cat || p.c === state.cat; });
      options(f.sub, count(inCat, 's'), 'Tutte le sottocategorie', state.sub);
      f.sub.disabled = !state.cat;
      var inSub = inCat.filter(function (p) { return !state.sub || p.s === state.sub; });
      options(f.brand, count(inSub, 'b'), 'Tutti i marchi', state.brand);
      var list = inSub.filter(function (p) {
        if (state.brand && p.b !== state.brand) return false;
        if (state.off && !p.w) return false;
        var hay = norm(p.n + ' ' + p.b + ' ' + p.c + ' ' + p.s);
        return words.every(function (w) { return hay.indexOf(w) > -1; });
      });
      var sorts = {
        'new': function (a, b) { return b.id - a.id; },
        'asc': function (a, b) { return a.p - b.p; },
        'desc': function (a, b) { return b.p - a.p; },
        'off': function (a, b) { return off(b) - off(a); }
      };
      list.sort(sorts[state.sort] || sorts['new']);
      chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.cat === state.cat); });
      document.getElementById('catalog-count').textContent = list.length === 1 ? '1 prodotto' : list.length + ' prodotti';
      grid.innerHTML = list.slice(0, state.shown).map(card).join('') ||
        '<p class="empty">Nessun prodotto trovato. Prova a togliere qualche filtro o <a href="' + WA_LINK + '" target="_blank" rel="noopener">chiedici su WhatsApp</a>.</p>';
      var more = document.getElementById('catalog-more');
      more.hidden = list.length <= state.shown;
      more.textContent = 'Mostra altri ' + Math.min(PER_PAGE, list.length - state.shown) + ' prodotti';
      var u = new URLSearchParams();
      ['q', 'cat', 'sub', 'brand'].forEach(function (k) { if (state[k]) u.set(k, state[k]); });
      if (state.sort !== 'new') u.set('sort', state.sort);
      if (state.off) u.set('off', '1');
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
    };
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      state.cat = b.dataset.cat; state.sub = ''; state.brand = ''; state.shown = PER_PAGE;
      render();
    });
    f.addEventListener('input', function () {
      state.q = f.q.value; state.sub = f.sub.value; state.brand = f.brand.value;
      state.sort = f.sort.value; state.off = f.off.checked; state.shown = PER_PAGE;
      render();
    });
    f.addEventListener('submit', function (e) { e.preventDefault(); });
    document.getElementById('catalog-more').addEventListener('click', function () { state.shown += PER_PAGE; render(); });
    render();
  }

  /* Scheda prodotto */
  var pdp = document.getElementById('pdp');
  if (pdp) {
    var id = parseInt(param('id'), 10);
    var s = document.createElement('script');
    s.src = 'data/p/' + id + '.js';
    s.onerror = function () { pdp.innerHTML = '<p class="empty">Prodotto non trovato. <a href="shop.html">Torna allo shop</a></p>'; };
    s.onload = function () { showProduct(window.DEKA_PRODOTTO); };
    document.head.appendChild(s);
  }

  var showProduct = function (p) {
    document.title = p.n + ' – Deka Sport Passion (demo)';
    var sizes = p.sizes.filter(function (z) { return z.size; });
    var specs = [], text = [];
    p.desc.forEach(function (l) {
      var m = l.match(/^([A-ZÀ-Ü0-9 ()\/.'-]{3,40})\s*:\s*(.+)$/);
      if (m) specs.push([m[1].trim(), m[2].trim()]); else text.push(l);
    });
    var crumbs = '<a href="shop.html">Shop</a> / <a href="shop.html?cat=' + encodeURIComponent(p.c) + '">' + esc(p.c) + '</a>' +
      (p.s ? ' / <a href="shop.html?cat=' + encodeURIComponent(p.c) + '&amp;sub=' + encodeURIComponent(p.s) + '">' + esc(p.s) + '</a>' : '');
    pdp.innerHTML =
      '<div class="pdp-img">' + (p.f ? '<img src="img/p/' + p.id + '.jpg" alt="' + esc(p.n) + '" width="600" height="600">' : '<span class="prod-nofoto">Foto in arrivo</span>') + '</div>' +
      '<div class="pdp-info">' +
      '<p class="crumbs">' + crumbs + '</p>' +
      '<h1>' + esc(p.n) + '</h1>' +
      '<p class="pdp-meta">' + [p.b, p.color].filter(Boolean).map(esc).join(' · ') + '</p>' +
      '<p class="price pdp-price">' + (p.w ? '<s>' + eur(p.w) + '</s> ' : '') + '<span id="pdp-price">' + eur(p.p) + '</span>' + (p.w ? ' <span class="badge">−' + off(p) + '%</span>' : '') + '</p>' +
      (sizes.length ? '<fieldset><legend>Taglia</legend><div class="chips" id="pdp-sizes">' + sizes.map(function (z, i) {
        return '<button type="button" class="chip" data-i="' + i + '"' + (z.ok ? '' : ' disabled aria-label="' + esc(z.size) + ' non disponibile"') + ' aria-pressed="false">' + esc(z.size) + '</button>';
      }).join('') + '</div></fieldset>' : '') +
      '<div class="pdp-buy"><label class="qty">Quantità<input type="number" id="pdp-qty" min="1" max="9" value="1" inputmode="numeric"></label>' +
      '<button class="btn" type="button" id="pdp-add">Aggiungi al carrello</button></div>' +
      '<p class="pdp-note" id="pdp-note" aria-live="polite"></p>' +
      '<p>' + (p.store ? 'Ritiro gratis in negozio a Sant\'Agata sul Santerno, oppure ' : '') + 'spedizione in tutta Italia in 1–3 giorni lavorativi.</p>' +
      '<a class="more" href="' + WA_LINK + '?text=' + encodeURIComponent('Ciao Deka! Vorrei informazioni su: ' + p.n) + '" target="_blank" rel="noopener">Hai una domanda? Scrivici su WhatsApp →</a>' +
      '</div>' +
      ((text.length || specs.length) ? '<section class="pdp-desc"><h2>Descrizione</h2>' + text.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') +
        (specs.length ? '<table class="specs">' + specs.map(function (r) { return '<tr><th scope="row">' + esc(r[0].charAt(0) + r[0].slice(1).toLowerCase()) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>' : '') + '</section>' : '');
    var chosen = sizes.length === 1 && sizes[0].ok ? 0 : -1;
    var note = document.getElementById('pdp-note');
    var sz = document.getElementById('pdp-sizes');
    var mark = function () {
      if (!sz) return;
      sz.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', +c.dataset.i === chosen); });
      if (chosen > -1 && sizes[chosen].price) document.getElementById('pdp-price').textContent = eur(sizes[chosen].price);
    };
    if (sz) sz.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b || b.disabled) return;
      chosen = +b.dataset.i; note.textContent = ''; mark();
    });
    mark();
    document.getElementById('pdp-add').addEventListener('click', function () {
      if (sizes.length && chosen < 0) { note.textContent = 'Scegli prima la taglia'; return; }
      var size = sizes.length ? sizes[chosen].size : '';
      var price = sizes.length && sizes[chosen].price ? sizes[chosen].price : p.p;
      var q = Math.max(1, Math.min(9, parseInt(document.getElementById('pdp-qty').value, 10) || 1));
      var items = load();
      var found = items.filter(function (i) { return i.id === p.id && i.z === size; })[0];
      if (found) found.q = Math.min(9, found.q + q);
      else items.push({ id: p.id, n: p.n, z: size, p: price, q: q, f: p.f });
      save(items);
      note.innerHTML = 'Aggiunto al carrello. <a href="carrello.html">Vai al carrello →</a>';
    });
    var rel = document.getElementById('related-grid');
    if (rel) {
      var same = CAT.filter(function (x) { return x.id !== p.id && x.f && x.c === p.c && (!p.s || x.s === p.s); }).slice(0, 4);
      rel.innerHTML = same.map(card).join('');
      rel.closest('section').hidden = !same.length;
    }
  };

  /* Carrello */
  var cart = document.getElementById('cart');
  if (cart) {
    var ship = 'ritiro';
    var renderCart = function () {
      var items = load();
      var list = document.getElementById('cart-list');
      if (!items.length) {
        list.innerHTML = '<p class="empty">Il carrello è vuoto. <a href="shop.html">Vai allo shop →</a></p>';
        document.getElementById('cart-sum').hidden = true;
        return;
      }
      document.getElementById('cart-sum').hidden = false;
      list.innerHTML = items.map(function (i, k) {
        return '<div class="cart-row">' +
          (i.f ? '<img src="img/p/' + i.id + '.jpg" alt="" width="600" height="600">' : '<span class="prod-nofoto"></span>') +
          '<div><a href="prodotto.html?id=' + i.id + '">' + esc(i.n) + '</a>' + (i.z ? '<p class="prod-sport">Taglia ' + esc(i.z) + '</p>' : '') +
          '<div class="cart-qty"><button type="button" class="chip" data-k="' + k + '" data-d="-1" aria-label="Togli uno">−</button><span>' + i.q + '</span>' +
          '<button type="button" class="chip" data-k="' + k + '" data-d="1" aria-label="Aggiungi uno">+</button>' +
          '<button type="button" class="cart-del" data-k="' + k + '" data-d="x">Rimuovi</button></div></div>' +
          '<p class="price">' + eur(i.p * i.q) + '</p></div>';
      }).join('');
      var sub = items.reduce(function (s, i) { return s + i.p * i.q; }, 0);
      document.getElementById('cart-sub').textContent = eur(sub);
      document.getElementById('cart-ship').innerHTML = ship === 'ritiro' ? 'Gratis' : '<span class="todo">Costo da confermare</span>';
      document.getElementById('cart-total').textContent = eur(sub) + (ship === 'ritiro' ? '' : ' + spedizione');
    };
    cart.addEventListener('click', function (e) {
      var b = e.target.closest('[data-d]');
      if (!b) return;
      var items = load(), k = +b.dataset.k;
      if (b.dataset.d === 'x') items.splice(k, 1);
      else items[k].q = Math.max(1, Math.min(9, items[k].q + +b.dataset.d));
      save(items);
      renderCart();
    });
    cart.addEventListener('change', function (e) {
      if (e.target.name === 'ship') { ship = e.target.value; renderCart(); }
    });
    document.getElementById('cart-pay').addEventListener('click', function () {
      document.getElementById('cart-pay-info').hidden = false;
      document.getElementById('cart-pay-info').focus();
    });
    document.getElementById('cart-wa').addEventListener('click', function () {
      var items = load();
      var msg = 'Ciao Deka! Vorrei ordinare:\n' + items.map(function (i) {
        return '- ' + i.q + ' × ' + i.n + (i.z ? ' (taglia ' + i.z + ')' : '') + ' – ' + eur(i.p * i.q);
      }).join('\n') + '\nConsegna: ' + (ship === 'ritiro' ? 'ritiro in negozio' : 'spedizione a casa');
      window.open(DEMO_WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
    renderCart();
  }
})();
