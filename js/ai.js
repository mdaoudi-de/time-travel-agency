/* ============================================================
   TimeTravel Agency — ai.js
   Couche IA à deux niveaux :
   1) Mistral AI (mistral-small-latest) si une clé est présente ;
   2) moteur local (base de connaissances) en secours — la démo
      ne casse jamais, même sans clé ni réseau.
   Aucune manipulation du DOM ici.
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};
  var D = TT.data;

  var ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';
  var MODEL = 'mistral-small-latest';
  var PLACEHOLDER = 'COLLEZ_VOTRE_CLE_MISTRAL_ICI';
  var defaultIdx = 0;       // rotation des réponses par défaut

  /* ---------- Clé : lue depuis js/config.local.js (window.TT_CONFIG) ---------- */
  function getKey() {
    var cfg = window.TT_CONFIG;
    var k = (cfg && typeof cfg.mistralKey === 'string') ? cfg.mistralKey.trim() : '';
    return k === PLACEHOLDER ? '' : k;
  }
  function hasKey() { return !!getKey(); }

  /* ---------- Appel Mistral bas niveau ---------- */
  function complete(messages, opts) {
    opts = opts || {};
    var key = getKey();
    if (!key) return Promise.resolve({ ok: false, reason: 'no-key' });

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 20000);

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: opts.temperature != null ? opts.temperature : 0.7,
        max_tokens: opts.maxTokens || 400
      }),
      signal: ctrl.signal
    }).then(function (res) {
      clearTimeout(timer);
      if (res.status === 401) return { ok: false, reason: 'auth' };
      if (res.status === 429) return { ok: false, reason: 'rate' };
      if (!res.ok) return { ok: false, reason: 'http' };
      return res.json().then(function (data) {
        var text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        text = (text || '').trim();
        return text ? { ok: true, text: text } : { ok: false, reason: 'empty' };
      });
    }).catch(function (e) {
      clearTimeout(timer);
      return { ok: false, reason: e && e.name === 'AbortError' ? 'timeout' : 'network' };
    });
  }

  /* ---------- Moteur local : normalisation ---------- */
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')   // retire les accents
      .replace(/['’`]/g, ' ')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function detectDest(normQ, tokens) {
    var best = null, bestScore = 0;
    Object.keys(D.DEST_KEYWORDS).forEach(function (key) {
      var score = 0;
      D.DEST_KEYWORDS[key].forEach(function (kw) {
        if (kw.indexOf(' ') >= 0) { if (normQ.indexOf(kw) >= 0) score += 2; }
        else if (tokens.indexOf(kw) >= 0) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = key; }
    });
    return best ? D.DESTS[best] : null;
  }

  function bestIntent(normQ, tokens) {
    var best = null, bestScore = 0;
    D.INTENTS.forEach(function (intent) {
      var score = 0;
      intent.kw.forEach(function (kw) {
        if (kw.indexOf(' ') >= 0) { if (normQ.indexOf(kw) >= 0) score += 2; }
        else if (tokens.indexOf(kw) >= 0) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore >= 1 ? best : null;
  }

  /* Réponse locale cohérente avec le catalogue */
  function localAnswer(question) {
    var normQ = normalize(question);
    var tokens = normQ ? normQ.split(' ') : [];
    var dest = detectDest(normQ, tokens);
    var intent = bestIntent(normQ, tokens);
    if (intent) return intent.answer(dest);
    if (dest) return D.destPitch(dest);
    var reply = D.DEFAULT_REPLIES[defaultIdx % D.DEFAULT_REPLIES.length];
    defaultIdx++;
    return reply;
  }

  /* Itinéraire local : trame de base + journées thématiques selon les chips */
  function localItinerary(destKey, selLabels) {
    var data = D.FALLBACK_ITIN[destKey];
    var days = D.DESTS[destKey].days;
    var lines = data.base.slice();
    var chosen = (selLabels || []).slice(0, days - 1);
    chosen.forEach(function (label, i) {
      var line = data.byChip[label];
      if (line) lines[i + 1] = line;
    });
    return lines.map(function (line, i) {
      return line.replace(/^Jour\s+\S+/, 'Jour ' + (i + 1));
    }).join('\n');
  }

  /* ---------- Réponses haut niveau (utilisées par les modules) ---------- */
  function chatReply(history) {
    var lastUser = '';
    for (var i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'user') { lastUser = history[i].text; break; }
    }
    if (!hasKey()) {
      return Promise.resolve({ text: localAnswer(lastUser), source: 'local', reason: 'no-key' });
    }
    var messages = [{ role: 'system', content: D.SYS }];
    history.slice(-12).forEach(function (m) {
      messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text });
    });
    return complete(messages, { temperature: 0.7, maxTokens: 300 }).then(function (r) {
      if (r.ok) return { text: r.text, source: 'mistral' };
      return { text: localAnswer(lastUser), source: 'local', reason: r.reason };
    });
  }

  function quizReply(answers, destKey) {
    var fallback = D.FALLBACK_QUIZ[destKey];
    if (!hasKey()) return Promise.resolve({ text: fallback, source: 'local', reason: 'no-key' });
    var messages = [
      { role: 'system', content: D.SYS },
      { role: 'user', content: D.buildQuizPrompt(answers, D.DESTS[destKey].label) }
    ];
    return complete(messages, { temperature: 0.8, maxTokens: 220 }).then(function (r) {
      return r.ok ? { text: r.text, source: 'mistral' } : { text: fallback, source: 'local', reason: r.reason };
    });
  }

  function itinReply(destKey, selLabels) {
    var fallback = localItinerary(destKey, selLabels);
    if (!hasKey()) return Promise.resolve({ text: fallback, source: 'local', reason: 'no-key' });
    var messages = [
      { role: 'system', content: D.SYS },
      { role: 'user', content: D.buildItinPrompt(destKey, selLabels) }
    ];
    return complete(messages, { temperature: 0.8, maxTokens: 500 }).then(function (r) {
      return r.ok ? { text: r.text, source: 'mistral' } : { text: fallback, source: 'local', reason: r.reason };
    });
  }

  TT.ai = {
    getKey: getKey, hasKey: hasKey,
    complete: complete,
    localAnswer: localAnswer, localItinerary: localItinerary,
    chatReply: chatReply, quizReply: quizReply, itinReply: itinReply
  };
})();
