/* ============================================================
   TimeTravel Agency — itinerary.js
   Chips de centres d'intérêt + génération d'itinéraire IA
   (jour par jour) par destination.
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};
  var D = TT.data;

  var sel = { paris: [], cretace: [], florence: [] };
  var busy = { paris: false, cretace: false, florence: false };

  function init() {
    Object.keys(D.CHIPS).forEach(function (dest) {
      var container = document.querySelector('.chips[data-chips="' + dest + '"]');
      if (!container) return;
      D.CHIPS[dest].forEach(function (label) {
        var b = document.createElement('button');
        b.className = 'chip';
        b.type = 'button';
        b.textContent = label;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { toggle(dest, label, b); });
        container.appendChild(b);
      });
    });
  }

  function toggle(dest, label, btn) {
    var arr = sel[dest];
    var i = arr.indexOf(label);
    if (i >= 0) { arr.splice(i, 1); btn.setAttribute('aria-pressed', 'false'); }
    else { arr.push(label); btn.setAttribute('aria-pressed', 'true'); }
  }

  function generate(dest) {
    if (busy[dest]) return;
    var busyEl = document.querySelector('.itin-busy[data-busy="' + dest + '"]');
    var outEl = document.querySelector('.itin-output[data-output="' + dest + '"]');
    busy[dest] = true;
    if (outEl) { outEl.hidden = true; outEl.textContent = ''; }
    if (busyEl) busyEl.hidden = false;

    TT.ai.itinReply(dest, sel[dest]).then(function (res) {
      if (busyEl) busyEl.hidden = true;
      if (outEl) { outEl.textContent = res.text; outEl.hidden = false; }
      busy[dest] = false;
    });
  }

  TT.itinerary = { init: init, generate: generate };
})();
