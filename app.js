/* Deka Sport Passion – demo. Parti comuni (fascia demo, menu, footer) e interazioni. */
(function () {
  var page = document.body.getAttribute('data-page') || '';
  /* Icona WhatsApp: fumetto con cornetta */
  var WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="bubble" d="M3 21l1.6-4.8A8.5 8.5 0 1 1 7.8 19.4z"/>' +
    '<path class="phone" d="M9.2 7.6c.3 0 .5.1.6.4l.7 1.6c.1.3 0 .5-.1.7l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.6c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.6v1c0 .6-.5 1.1-1.1 1.1A7.1 7.1 0 0 1 8.1 8.7c0-.6.5-1.1 1.1-1.1z"/></svg>';
  var WA_LINK = 'https://wa.me/393488112611';
  var HOURS = 'Lun e mer–sab: 9:00–12:30 · 15:30–19:30<br>Mar: 15:30–19:30<br>Dom: chiuso';

  /* Collega tutti i pulsanti WhatsApp delle pagine */
  document.querySelectorAll('a[data-wa]').forEach(function (a) {
    a.href = WA_LINK; a.target = '_blank'; a.rel = 'noopener';
  });

  var links = [
    ['index.html', 'Home', 'home'],
    ['servizi.html', 'Officina<span class="nav-long"> e biomeccanica</span>', 'servizi'],
    ['eventi.html', 'Eventi', 'eventi'],
    ['shop.html', 'Shop', 'shop'],
    ['contatti.html', 'Contatti', 'contatti']
  ];

  var top =
    '<div class="demo" role="note">Demo – proposta di Salvo per Deka Sport Passion, non è il sito ufficiale · ' +
    '<a href="https://www.instagram.com/_s_alvo/" target="_blank" rel="noopener">Instagram @_s_alvo</a>' +
    '<br><span class="todo">In giallo</span> le parti da completare con il negozio</div>' +
    '<header><div class="nav">' +
    '<a class="brand" href="index.html" aria-label="Deka Sport Passion, home"><img src="img/deka-logo.png" alt="Deka Sport Passion" width="446" height="180">' +
    '<span class="tag" aria-hidden="true"><b>Dal 1973</b>Romagna</span></a>' +
    '<nav aria-label="Menu principale">' +
    links.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[2] === page ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
    }).join('') +
    '</nav>' +
    '<a class="btn" href="servizi.html#prenota">Prenota</a>' +
    '</div></header>';

  var bottom =
    '<footer><div class="wrap"><div class="grid">' +
    '<div class="stack"><img src="img/deka-logo.png" alt="Deka Sport Passion" width="446" height="180"><span>Articoli e servizi sportivi dal 1973</span></div>' +
    '<div><h4>Dove siamo</h4>Via Ricci Curbastro 15/17<br>48020 Sant\'Agata sul Santerno (RA)<br><a href="tel:+39054545411">0545 45411</a></div>' +
    '<div><h4>Orari</h4>' + HOURS + '</div>' +
    '<div><h4>Seguici</h4><a href="https://www.instagram.com/dekasportpassion/" target="_blank" rel="noopener">Instagram</a><br>' +
    '<a href="https://www.facebook.com/dekasportpassion" target="_blank" rel="noopener">Facebook</a><br>' +
    '<a href="' + WA_LINK + '" target="_blank" rel="noopener">WhatsApp 348 811 2611</a></div>' +
    '</div><p class="legal">Sport Passion Srl · P.IVA 02413030392 · <a href="privacy.html">Privacy</a> · <a href="privacy.html#cookie">Cookie</a> · Sito dimostrativo</p></div></footer>' +
    '<a class="wa-float" href="' + WA_LINK + '" target="_blank" rel="noopener" aria-label="Scrivici su WhatsApp">' + WA_ICON + '</a>';

  document.body.insertAdjacentHTML('afterbegin', top);
  document.body.insertAdjacentHTML('beforeend', bottom);

  /* Copertina: orari di oggi e "aperto ora", calcolati sull'ora italiana */
  var nowHours = document.getElementById('now-hours');
  if (nowHours) {
    var OPEN = [[], [[540, 750], [930, 1170]], [[930, 1170]], [[540, 750], [930, 1170]],
      [[540, 750], [930, 1170]], [[540, 750], [930, 1170]], [[540, 750], [930, 1170]]]; /* dom…sab, minuti dalla mezzanotte */
    var DAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    var hm = function (m) { return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); };
    var nowTitle = document.getElementById('now-title');
    var nowState = document.getElementById('now-state');
    var updateNow = function () {
      var p = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
      var min = +p.hour * 60 + +p.minute;
      var today = OPEN[day];
      nowTitle.textContent = 'Orari di oggi, ' + DAYS[day];
      nowHours.textContent = today.length ? today.map(function (r) { return hm(r[0]) + '–' + hm(r[1]); }).join(' · ') : 'Chiuso';
      var open = today.filter(function (r) { return min >= r[0] && min < r[1]; })[0];
      var state;
      if (open) state = 'Aperto ora · chiude alle ' + hm(open[1]);
      else {
        var later = today.filter(function (r) { return r[0] > min; })[0];
        if (later) state = 'Chiuso ora · riapre alle ' + hm(later[0]);
        else {
          for (var i = 1; i <= 7 && !OPEN[(day + i) % 7].length; i++);
          state = 'Chiuso ora · riapre ' + (i === 1 ? 'domani' : DAYS[(day + i) % 7]) + ' alle ' + hm(OPEN[(day + i) % 7][0][0]);
        }
      }
      nowState.textContent = state;
      nowState.className = 'now-state' + (open ? ' open' : '');
      nowState.hidden = false;
    };
    updateNow();
    setInterval(updateNow, 60000);
  }

  /* Entrate sfalsate delle sezioni (niente se il telefono chiede meno movimento) */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.documentElement.classList.add('js');
    document.querySelectorAll('main section').forEach(function (sec) {
      sec.querySelectorAll('h1, h2, .lead, .btns, .now, .svc, .ride, .last-ride, .signs, .ebay, .card, .bike, .story-ph, .partners li, .pl-row, .bio-fig, .path li, .past, .reel, .panel, .map, .prose > *, .hint')
        .forEach(function (el, i) {
          if (el.closest('.rv')) return;
          el.classList.add('rv');
          el.style.transitionDelay = (i % 6) * 70 + 'ms';
          seen.observe(el);
        });
    });
  }

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

  /* Mappa Google caricata solo su richiesta: nessun cookie di terzi finché non la si apre */
  var map = document.getElementById('map-consent');
  if (map) map.querySelector('button').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.className = 'map';
    f.title = map.getAttribute('data-title');
    f.src = map.getAttribute('data-src');
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.replaceWith(f);
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
  var altro = form.elements.bici.querySelector('[data-altro]');

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
    /* Tipo di bici: "Altro" solo per l'officina, non per la biomeccanica */
    var bici = form.elements.bici;
    var bio = state.service === 'Biomeccanica';
    if (bio && altro.parentNode) { if (altro.selected) bici.selectedIndex = 0; altro.remove(); }
    else if (!bio && !altro.parentNode) bici.appendChild(altro);
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
