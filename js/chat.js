/* ============================================================
   TimeTravel Agency — chat.js
   Widget « Chronos » : ouverture, bulles, suggestions,
   badge de mode (transparence IA). La clé Mistral est lue depuis
   js/config.local.js (pas de saisie utilisateur).
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
