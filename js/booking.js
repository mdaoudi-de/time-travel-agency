/* ============================================================
   TimeTravel Agency — booking.js
   Réservation : sélection destination/classe/voyageurs,
   calcul du total en direct, validation, écran de confirmation.
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};
  var D = TT.data;

  var els = {};
  var state = { dest: 'paris', date: '', pax: 2, classe: 'decouverte', nom: '', email: '' };

  function $(id) { return document.getElementById(id); }

  function init() {
    els.form = $('resv-form');
    els.confirm = $('resv-confirm');
    els.destOptions = $('resv-dest-options');
    els.date = $('resv-date');
    els.pax = $('resv-pax');
    els.nom = $('resv-nom');
    els.email = $('resv-email');
    els.total = $('resv-total');
    els.error = $('resv-error');
    if (!els.form) return;

    renderDestOptions();
    bindClasseOptions();

    // Steppers voyageurs
    els.paxMinus = els.form.querySelector('[data-action="pax-minus"]');
    els.paxPlus = els.form.querySelector('[data-action="pax-plus"]');
    if (els.paxMinus) els.paxMinus.addEventListener('click', function () { setPax(state.pax - 1); });
    if (els.paxPlus) els.paxPlus.addEventListener('click', function () { setPax(state.pax + 1); });

    els.date.addEventListener('input', function () { state.date = els.date.value; clearError(); });
    els.nom.addEventListener('input', function () { state.nom = els.nom.value; clearError(); });
    els.email.addEventListener('input', function () { state.email = els.email.value; clearError(); });

    els.form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });

    updatePaxButtons();
    updateTotal();
  }

  function renderDestOptions() {
    els.destOptions.innerHTML = '';
    ['paris', 'cretace', 'florence'].forEach(function (k) {
      var d = D.DESTS[k];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'option-card' + (state.dest === k ? ' is-active' : '');
      b.setAttribute('data-resv-dest', k);
      b.setAttribute('aria-pressed', state.dest === k ? 'true' : 'false');
      b.innerHTML = '<span class="option-card__label"></span><span class="option-card__note"></span>';
      b.querySelector('.option-card__label').textContent = D.LABELS[k];
      b.querySelector('.option-card__note').textContent = d.prix + ' / pers.';
      b.addEventListener('click', function () { selectDest(k); });
      els.destOptions.appendChild(b);
    });
  }

  function bindClasseOptions() {
    els.form.querySelectorAll('[data-resv-classe]').forEach(function (b) {
      b.addEventListener('click', function () { selectClasse(b.getAttribute('data-resv-classe')); });
    });
  }

  function selectDest(k) {
    state.dest = k;
    els.destOptions.querySelectorAll('[data-resv-dest]').forEach(function (b) {
      var on = b.getAttribute('data-resv-dest') === k;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    updateTotal();
  }

  function selectClasse(k) {
    state.classe = k;
    els.form.querySelectorAll('[data-resv-classe]').forEach(function (b) {
      var on = b.getAttribute('data-resv-classe') === k;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    updateTotal();
  }

  function setPax(n) {
    state.pax = Math.max(1, Math.min(8, n));
    els.pax.textContent = state.pax;
    updatePaxButtons();
    updateTotal();
  }

  function updatePaxButtons() {
    if (els.paxMinus) els.paxMinus.disabled = state.pax <= 1;
    if (els.paxPlus) els.paxPlus.disabled = state.pax >= 8;
  }

  function computeTotal() {
    var d = D.DESTS[state.dest];
    var mult = state.classe === 'premiere' ? 1.45 : 1;
    return Math.round(d.prixN * state.pax * mult);
  }

  function updateTotal() {
    els.total.textContent = computeTotal().toLocaleString('fr-FR') + ' €';
  }

  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(msg) { els.error.textContent = msg; els.error.hidden = false; }

  /* Appelé par app.js quand on clique « Réserver <destination> » */
  function setDest(k) { selectDest(k); }

  function submit() {
    var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email.trim());
    var minDate = els.date.getAttribute('min') || '2026-06-15';
    if (!state.nom.trim()) { showError('Merci d\'indiquer votre nom complet.'); return; }
    if (!emailOk) { showError('Merci d\'indiquer un email valide (ex. nom@domaine.fr).'); return; }
    if (!state.date) { showError('Merci de choisir une date de départ.'); return; }
    if (state.date < minDate) { showError('Nos premières traversées partent le 15 juin 2026 — choisissez une date ultérieure.'); return; }
    clearError();
    var d = D.DESTS[state.dest];
    var total = computeTotal();
    var ref = 'TT-' + (state.dest === 'cretace' ? 'K65M' : Math.abs(d.year)) + '-' +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    var dateFr = state.date;
    try {
      dateFr = new Date(state.date + 'T12:00:00').toLocaleDateString('fr-FR',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {}

    $('confirm-ref').textContent = ref;
    $('confirm-nom').textContent = state.nom.trim();
    $('confirm-dest').textContent = state.dest === 'cretace' ? 'Le Crétacé · −65 000 000' : d.label;
    $('confirm-date').textContent = dateFr;
    $('confirm-pax').textContent = state.pax + (state.pax > 1 ? ' voyageurs' : ' voyageur');
    $('confirm-classe').textContent = state.classe === 'premiere' ? 'Première Temporelle' : 'Classe Découverte';
    $('confirm-total').textContent = total.toLocaleString('fr-FR') + ' €';

    els.form.hidden = true;
    els.confirm.hidden = false;
    window.scrollTo(0, 0);
  }

  function newResv() {
    state.nom = ''; state.email = ''; state.date = '';
    els.nom.value = ''; els.email.value = ''; els.date.value = '';
    clearError();
    els.confirm.hidden = true;
    els.form.hidden = false;
    window.scrollTo(0, 0);
  }

  TT.booking = { init: init, setDest: setDest, newResv: newResv };
})();
