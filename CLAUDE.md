# Progetto: sito demo Deka Sport Passion

Lavoro di Salvo (Instagram @_s_alvo) per proporsi come social media manager a **Deka Sport Passion** (Sport Passion Srl, P.IVA 02413030392), negozio di articoli sportivi a conduzione familiare a Sant'Agata sul Santerno (RA), Via Ricci Curbastro 15/17. Salvo **non ha ancora parlato con il negozio**: vuole presentarsi con un prodotto pronto (sito demo + restyling Instagram + documento di proposta con prezzi).

Rispondi sempre in italiano. **Salvo vuole che tu gli faccia sempre domande** prima delle scelte importanti. Lavora solo da smartphone/tablet, nessun computer: dagli istruzioni pensate per il telefono.

## Il negozio
- Dal 1973. Sport di punta: ciclismo (corsa, gravel, MTB), bici nuove e usate, officina specializzata, biomeccanica, eventi/uscite in bici in Romagna con bar, ristoranti e agriturismi convenzionati.
- Anche: calcio, tennis, padel, racchettoni, pallavolo, atletica, running.
- Telefono negozio: 0545 45411 · WhatsApp: +39 348 811 2611 (confermato da Salvo).
- Orari: lun e mer–sab 9:00–12:30 · 15:30–19:30; mar 15:30–19:30; dom chiuso.
- Social: Instagram @dekasportpassion (~1.977 follower, 938 post), Facebook "Deka Sport Passion" (facebook.com/dekasportpassion, confermato da Salvo) (~6.315 follower, 98% recensioni positive su 28). Vendono anche su eBay ("DEKA SPORT PASSION", oltre 5.000 feedback).
- Vecchio sito sportpassion.biz in manutenzione; sui social linkano dekasportpassion.com. Non si sa chi gestisce il dominio.
- Somec (telai artigianali, Via San Martino 1/A, stesso paese, fondata 1973 da Oliviero Gallegati) è un'azienda separata; Deka vende bici Somec usate.
- Ultimo evento: Raduno Bike Off Road "La Sabbiona" – Memorial Babbo Fontigi, 11 ottobre 2026, Oriolo dei Fichi (Faenza). Reel: https://www.instagram.com/reel/DeEeomMHDno/ . Molti eventi li comunicano via WhatsApp e con locandine in negozio.

## Problemi trovati sui loro social (argomenti per la proposta)
Sito offline e due domini diversi; highlight Instagram "Chiuso, riapriremo a settembre" ancora in evidenza a fine ottobre; post del raduno pubblicato due volte; locandine con testo troppo piccolo; Instagram sottoutilizzato rispetto a Facebook e rapporto follower/seguiti quasi 1:1; officina, biomeccanica e usato non citati in bio; banner cookie del vecchio sito non conforme GDPR.

## Il sito (questo repository)
- Pubblicato con GitHub Pages dal ramo `main`: https://salvatorevirgillito04-code.github.io/dekasportpassion/ . Salvo vuole le modifiche online a ogni passo (portarle su `main`).
- HTML/CSS/JS statici, nessun build. Pagine: `index.html`, `servizi.html` (officina, biomeccanica, prenotazione), `eventi.html`, `shop.html`, `contatti.html`, `privacy.html` (informativa privacy e cookie di esempio, linkata dal footer). Fascia demo, menu e footer sono iniettati da `app.js` (anche link WhatsApp, orari, logica di prenotazione).
- Stile scelto da Salvo: sfondo avorio #FAF7F0, colori del brand (verde DEKA #6CE002 su nero #0B0F12; per testo verde su chiaro #2E6B00), font Barlow Condensed + Barlow.
- Ordine homepage voluto da Salvo: copertina → servizi → eventi → shop → bici in vetrina (nuove e usate) → storia e recensioni → invito a prenotare.
- Privacy (argomento per la proposta, il vecchio sito non era a norma): nessun cookie né richiesta a terzi finché l'utente non lo sceglie. Font Barlow ospitati in `fonts/` (niente Google Fonts); mappa Google in Contatti caricata solo toccando "Mostra la mappa" (scelta di Salvo, niente banner cookie). Se si aggiunge qualcosa di esterno (analytics, embed, pixel) va aggiornata `privacy.html` e serve consenso.
- Prenotazione: modulo con servizio, giorno e orario disponibili (segue gli orari reali; martedì solo pomeriggio, domenica esclusa). È solo dimostrativo: non invia nulla. Salvo vuole il modulo; eventuali cambi dopo aver parlato col titolare.
- Regole da mantenere finché il negozio non approva: fascia "Demo – proposta di Salvo, non è il sito ufficiale" con il suo Instagram, `noindex` su ogni pagina e `robots.txt` che blocca i motori di ricerca.
- Logo: `img/deka-logo.png` è la versione ripulita (scelta di Salvo, proposta B): tolta la pennellata verde e il riquadro nero, sfondo trasparente, **scritte DEKA / SPORT PASSION identiche all'originale (regola di Salvo: non modificarle mai)**. Nella barra in alto è affiancato dalla firma "Dal 1973 · Romagna" (`.brand .tag`). `img/deka-logo.jpg` è l'originale ritagliato da Instagram, tenuto come sorgente. Il logo è bianco/verde: va usato solo su fondo scuro. Quando possibile chiedere al negozio il file originale del logo.
- Icone servizi: SVG a tratto nella home; biomeccanica = gamba con articolazioni, angolo del ginocchio e cerchio della pedalata (richiesta di Salvo: forme che richiamano la biomeccanica).
- Foto: per ora solo la Cervélo S5 (ultimo arrivo, post del 17 settembre), ritagliata da screenshot del loro Instagram. Le parti da completare (evidenziate in giallo con `<span class="todo">`: nome evento, storia della famiglia, partner, modelli…; più "Prezzo in negozio" e "Foto in arrivo") vanno completate con dati veri: non inventarle.

## Prossimi passi previsti
**Priorità decisa da Salvo: il sito deve essere perfetto prima di passare a qualsiasi altra cosa.**
1. Controllare il sito su telefono pagina per pagina (Home, Officina e biomeccanica, Eventi, Shop, Contatti), facendo domande a Salvo su ogni sezione. Ultime correzioni fatte: logo ripulito con firma "Dal 1973 · Romagna"; nuova icona biomeccanica; copertina senza foto (scelta di Salvo; la Cervélo resta in vetrina) con pulsanti "Prenota l'officina" e "Scrivici su WhatsApp"; menu su telefono con voci corte tutte visibili (Home · Officina · Eventi · Shop · Contatti); categorie shop e partner su 2 colonne su telefono; segnaposto resi eleganti (scelta di Salvo): riquadro scuro con bici e "Foto in arrivo", "Prezzo in negozio", e le altre parti da completare evidenziate in giallo tratteggiato con la classe `todo` (spiegato nella fascia demo).
2. Restyling Instagram: bio, copertine highlight, 6–9 post di esempio.
3. Documento di proposta: analisi, servizi, calendario editoriale, prezzi di Salvo.
4. Dopo il sì: negozio online vero (Shopify consigliato, sincronizzabile con eBay e catalogo Instagram/Facebook), dominio intestato all'azienda, automazioni (programmazione post, risposte DM, canale WhatsApp eventi, richiesta recensioni).
