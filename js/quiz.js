/* ============================================================
   TimeTravel Agency — quiz.js
   « L'oracle de Chronos » : 4 questions → scoring par
   destination → justification rédigée par l'IA (ou secours).
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};
  var D = TT.data;

  var els = {};
  var step = 0;
  var scores = { paris: 0, cretace: 0, florence: 0 };
  var answers = [];
  var resultDest = null;
  var opener = null;

  function $(id) { return document.getElementById(id); }

  function init() {
    els.modal = $('quiz-modal');
    els.asking = $('quiz-asking');
    els.busy = $('quiz-busy');
    els.done = $('quiz-done');
    els.progress = $('quiz-progress');
    els.question = $('quiz-dialog-title');
    els.options = $('quiz-options');
    els.resTitle = $('quiz-result-title');
    els.resText = $('quiz-result-text');
    if (!els.modal) return;
    els.modal.addEventListener('keydown', onKeydown);
    els.modal.addEventListener('mousedown', function (e) { if (e.target === els.modal) close(); });
  }

  function reset() {
    step = 0;
    scores = { paris: 0, cretace: 0, florence: 0 };
    answers = [];
    resultDest = null;
  }

  function open() {
    opener = document.activeElement;
    reset();
    els.modal.hidden = false;
    showPhase('asking');
    renderQuestion();
  }

  function close() {
    els.modal.hidden = true;
    if (opener && opener.focus) opener.focus();
  }

  function restart() {
    reset();
    showPhase('asking');
    renderQuestion();
  }

  function showPhase(phase) {
    els.asking.hidden = phase !== 'asking';
    els.busy.hidden = phase !== 'busy';
    els.done.hidden = phase !== 'done';
  }

  function renderQuestion() {
    var q = D.QUIZ[step];
    els.progress.textContent = "L'oracle de Chronos · " + (step + 1) + ' / ' + D.QUIZ.length;
    els.question.textContent = q.t;
    els.options.innerHTML = '';
    q.o.forEach(function (pair) {
      var label = pair[0], dest = pair[1];
      var b = document.createElement('button');
      b.className = 'quiz-option';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', function () { answer(dest, label); });
      els.options.appendChild(b);
    });
    var first = els.options.querySelector('button');
    if (first) first.focus();
  }

  function answer(dest, label) {
    scores[dest] = (scores[dest] || 0) + 1;
    answers.push(label);
    if (step < D.QUIZ.length - 1) {
      step++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    var winner = ['paris', 'florence', 'cretace'].sort(function (a, b) {
      return (scores[b] || 0) - (scores[a] || 0);
    })[0];
    resultDest = winner;
    showPhase('busy');
    TT.ai.quizReply(answers, winner).then(function (res) {
      els.resTitle.textContent = D.LABELS[winner];
      els.resText.textContent = res.text;
      showPhase('done');
      var go = els.done.querySelector('[data-action="quiz-go"]');
      if (go) go.focus();
    });
  }

  function goResult() {
    var dest = resultDest || 'paris';
    close();
    TT.app.go(dest);
  }

  /* ---------- Accessibilité : Échap + piège à focus ---------- */
  function onKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var focusables = els.modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    var list = Array.prototype.filter.call(focusables, function (el) { return el.offsetParent !== null; });
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  TT.quiz = { init: init, open: open, close: close, restart: restart, goResult: goResult };
})();
