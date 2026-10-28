/* Deka Sport Passion – demo. Parti comuni (fascia demo, menu, footer) e interazioni. */
(function () {
  var page = document.body.getAttribute('data-page') || '';
  var WA = 'M3 21l1.6-4.8A8.5 8.5 0 1 1 7.8 19.4z';
  var WA_LINK = 'https://wa.me/393488112611';
  var HOURS = 'Lun e mer–sab: 9:00–12:30 · 15:30–19:30<br>Mar: 15:30–19:30<br>Dom: chiuso';

  /* Collega tutti i pulsanti WhatsApp delle pagine */
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.href = WA_LINK; a.target = '_blank'; a.rel = 'noopener';
  });

  var links = [
    ['index.html', 'Home', 'home'],
    ['servizi.html', 'Officina e biomeccanica', 'servizi'],
    ['eventi.html', 'Eventi', 'eventi'],
    ['shop.html', 'Shop', 'shop'],
    ['contatti.html', 'Contatti', 'contatti']
  ];

  var top =
    '<div class="demo" role="note">Demo – proposta di Salvo per Deka Sport Passion, non è il sito ufficiale · ' +
    '<a href="https://www.instagram.com/_s_alvo/" target="_blank" rel="noopener">Instagram @_s_alvo</a></div>' +
    '<header><div class="nav">' +
    '<a href="index.html" aria-label="Deka Sport Passion, home"><img src="img/deka-logo.jpg" alt="Deka Sport Passion"></a>' +
    '<nav aria-label="Menu principale">' +
    links.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[2] === page ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
    }).join('') +
    '</nav>' +
    '<a class="btn" href="servizi.html#prenota">Prenota</a>' +
    '</div></header>';

  var bottom =
    '<footer><div class="wrap"><div class="grid">' +
    '<div class="stack"><img src="img/deka-logo.jpg" alt="Deka Sport Passion"><span>Articoli e servizi sportivi dal 1973</span></div>' +
    '<div><h4>Dove siamo</h4>Via Ricci Curbastro 15/17<br>48020 Sant\'Agata sul Santerno (RA)<br><a href="tel:+39054545411">0545 45411</a></div>' +
    '<div><h4>Orari</h4>' + HOURS + '</div>' +
    '<div><h4>Seguici</h4><a href="https://www.instagram.com/dekasportpassion/" target="_blank" rel="noopener">Instagram</a><br>' +
    '<a href="https://www.facebook.com/search/top?q=Deka%20Sport%20Passion" target="_blank" rel="noopener">Facebook</a><br>' +
    '<a href="' + WA_LINK + '" target="_blank" rel="noopener">WhatsApp 348 811 2611</a></div>' +
    '</div><p class="legal">Sport Passion Srl · P.IVA 02413030392 · Privacy · Cookie · Sito dimostrativo</p></div></footer>' +
    '<a class="wa-float" href="' + WA_LINK + '" target="_blank" rel="noopener" aria-label="Scrivici su WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + WA + '"></path></svg></a>';

  document.body.insertAdjacentHTML('afterbegin', top);
  document.body.insertAdjacentHTML('beforeend', bottom);

  /* Vetrina bici: Nuove / Usate */
  var tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-tab');
      tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('[data-group]').forEach(function (g) {
        g.hidden = g.getAttribute('data-group') !== t;
      });
    });
  });

  /* Prenotazione */
  var form = document.getElementById('booking');
  if (!form) return;
  var state = { service: 'Officina', day: 0, slot: null };
  var names = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  var months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var days = [];
  var d = new Date();
  while (days.length < 6) {
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d));
  }
  if (location.hash === '#biomeccanica') state.service = 'Biomeccanica';

  var elServ = document.getElementById('b-services');
  var elDays = document.getElementById('b-days');
  var elSlots = document.getElementById('b-slots');
  var elSum = document.getElementById('b-summary');
  var elDone = document.getElementById('b-done');
  var elDoneTxt = document.getElementById('b-done-text');

  function summary() {
    var dt = days[state.day];
    return state.slot
      ? state.service + ' · ' + names[dt.getDay()] + ' ' + dt.getDate() + ' ' + months[dt.getMonth()] + ' alle ' + state.slot
      : 'Scegli un orario per continuare';
  }

  function render() {
    elServ.innerHTML = ['Officina', 'Biomeccanica'].map(function (s) {
      return '<button type="button" class="chip" data-s="' + s + '" aria-pressed="' + (state.service === s) + '">' + s + '</button>';
    }).join('');
    elDays.innerHTML = days.map(function (dt, i) {
      return '<button type="button" class="chip" data-d="' + i + '" aria-pressed="' + (state.day === i) + '"><small>' +
        names[dt.getDay()] + '</small><strong>' + dt.getDate() + '</strong></button>';
    }).join('');
    /* Orari reali: mattina 9–12:30 (non il martedì), pomeriggio 15:30–19:30 */
    var morning = state.service === 'Officina' ? ['9:00', '10:00', '11:00'] : ['9:30'];
    var afternoon = state.service === 'Officina' ? ['15:30', '16:30', '17:30', '18:30'] : ['15:30', '17:30'];
    var times = (days[state.day].getDay() === 2 ? [] : morning).concat(afternoon);
    elSlots.innerHTML = times.map(function (t, i) {
      var busy = ((i + state.day * 2) % 4) === 1;
      return '<button type="button" class="chip" data-t="' + t + '"' + (busy ? ' disabled aria-label="' + t + ' occupato"' : '') +
        ' aria-pressed="' + (state.slot === t) + '">' + t + '</button>';
    }).join('');
    elSum.textContent = summary();
  }

  form.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.s) { state.service = b.dataset.s; state.slot = null; }
    else if (b.dataset.d) { state.day = +b.dataset.d; state.slot = null; }
    else if (b.dataset.t) { state.slot = b.dataset.t; }
    else return;
    render();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!state.slot) { elSum.textContent = 'Scegli prima un orario disponibile'; return; }
    form.hidden = true;
    elDoneTxt.textContent = summary() + '. In questa demo la richiesta non viene inviata: sul sito vero arriverà al negozio e ti confermeremo su WhatsApp.';
    elDone.hidden = false;
    elDone.focus();
  });

  document.getElementById('b-reset').addEventListener('click', function () {
    state.slot = null; form.reset(); render();
    elDone.hidden = true; form.hidden = false;
  });

  render();
})();
