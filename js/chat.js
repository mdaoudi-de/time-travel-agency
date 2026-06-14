/* ============================================================
   TimeTravel Agency — chat.js
   Widget « Chronos » : ouverture, bulles, suggestions,
   panneau de clé Mistral, badge de mode (transparence IA).
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};
  var D = TT.data;

  var els = {};
  var history = [];
  var busy = false;
  var localHintShown = false;

  function $(id) { return document.getElementById(id); }

  function init() {
    els.fab = $('chat-fab');
    els.panel = $('chat');
    els.mode = $('chat-mode');
    els.gear = $('chat-gear');
    els.settings = $('chat-settings');
    els.keyInput = $('chat-key-input');
    els.keySave = $('chat-key-save');
    els.keyClear = $('chat-key-clear');
    els.keyStatus = $('chat-key-status');
    els.body = $('chat-body');
    els.suggestions = $('chat-suggestions');
    els.input = $('chat-input');
    els.send = $('chat-send');
    if (!els.panel) return;

    // Message d'accueil
    history.push({ role: 'assistant', text: D.CHAT_WELCOME });
    appendMessage('assistant', D.CHAT_WELCOME);
    renderSuggestions();
    updateMode();

    els.fab.addEventListener('click', toggle);
    els.gear.addEventListener('click', toggleSettings);
    els.keySave.addEventListener('click', saveKey);
    els.keyClear.addEventListener('click', clearKey);
    els.keyInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); saveKey(); } });
    els.send.addEventListener('click', function () { send(); });
    els.input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });
    els.panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close(); } });
  }

  /* ---------- Ouverture / fermeture ---------- */
  function open() {
    els.panel.hidden = false;
    els.fab.textContent = '×';
    els.fab.setAttribute('aria-expanded', 'true');
    setTimeout(function () { els.input.focus(); }, 50);
    scrollBottom();
  }
  function close() {
    els.panel.hidden = true;
    els.fab.textContent = 'C';
    els.fab.setAttribute('aria-expanded', 'false');
    els.fab.focus();
  }
  function toggle() { els.panel.hidden ? open() : close(); }

  /* ---------- Réglages clé ---------- */
  function toggleSettings() {
    var willOpen = els.settings.hidden;
    els.settings.hidden = !willOpen;
    els.gear.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) { els.keyInput.value = ''; els.keyInput.focus(); }
  }
  function setStatus(msg, isError) {
    els.keyStatus.textContent = msg || '';
    els.keyStatus.classList.toggle('is-error', !!isError);
  }
  function saveKey() {
    var k = els.keyInput.value.trim();
    if (!k) { setStatus('Saisissez une clé.', true); return; }
    TT.ai.setKey(k);
    updateMode();
    setStatus('Vérification…', false);
    TT.ai.verifyKey().then(function (r) {
      if (r.ok) { setStatus('Clé valide — IA Mistral activée ✓', false); els.keyInput.value = ''; }
      else if (r.reason === 'auth') { setStatus('Clé invalide ou expirée.', true); }
      else if (r.reason === 'rate') { setStatus('Quota atteint, réessayez plus tard.', true); }
      else if (r.reason === 'timeout') { setStatus('Délai dépassé — clé enregistrée tout de même.', false); }
      else { setStatus('Connexion impossible — clé enregistrée tout de même.', false); }
    });
  }
  function clearKey() {
    TT.ai.clearKey();
    updateMode();
    setStatus('Clé effacée — retour au mode local.', false);
  }
  function updateMode() {
    els.mode.textContent = TT.ai.hasKey()
      ? 'Concierge temporel · IA Mistral'
      : 'Concierge temporel · mode local';
  }

  /* ---------- Rendu des messages ---------- */
  function appendMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'msg--user' : 'msg--bot');
    div.textContent = text;               // textContent : jamais d'injection HTML
    els.body.appendChild(div);
    scrollBottom();
    return div;
  }
  function showTyping() {
    var div = document.createElement('div');
    div.className = 'msg--typing';
    div.id = 'chat-typing';
    div.innerHTML = '<span class="blink-dot"></span><span class="blink-dot"></span><span class="blink-dot"></span>';
    els.body.appendChild(div);
    scrollBottom();
  }
  function hideTyping() {
    var t = $('chat-typing');
    if (t) t.remove();
  }
  function scrollBottom() { els.body.scrollTop = els.body.scrollHeight; }

  function renderSuggestions() {
    els.suggestions.innerHTML = '';
    if (history.length > 1 || busy) { els.suggestions.hidden = true; return; }
    els.suggestions.hidden = false;
    D.CHAT_SUGGESTIONS.forEach(function (label) {
      var b = document.createElement('button');
      b.className = 'suggestion';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', function () { send(label); });
      els.suggestions.appendChild(b);
    });
  }

  /* ---------- Envoi ---------- */
  function send(forced) {
    var text = (typeof forced === 'string' ? forced : els.input.value).trim();
    if (!text || busy) return;
    history.push({ role: 'user', text: text });
    appendMessage('user', text);
    els.input.value = '';
    busy = true;
    renderSuggestions();
    showTyping();

    TT.ai.chatReply(history).then(function (res) {
      hideTyping();
      var text = res.text;
      if (res.source === 'local' && res.reason === 'no-key' && !localHintShown) {
        text += D.CHAT_LOCAL_HINT;
        localHintShown = true;
      }
      history.push({ role: 'assistant', text: res.text });
      appendMessage('assistant', text);
      busy = false;
    });
  }

  TT.chat = { init: init, open: open, close: close, toggle: toggle };
})();
