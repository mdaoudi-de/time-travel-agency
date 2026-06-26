/* ============================================================
   TimeTravel Agency — app.js
   Orchestrateur : routeur (hash), saut temporel cinématique,
   menu burger, apparitions au scroll, intégration des visuels,
   délégation d'événements, amorçage.
   Chargé en dernier : tous les autres modules sont prêts.
   ============================================================ */
(function () {
  'use strict';
  window.TT = window.TT || {};
  var D = TT.data;
  var YEARS = D.YEARS;

  var currentView = 'home';
  var jumping = false;
  var pending = null;
  var reduce = false;

  function $(id) { return document.getElementById(id); }

  function fmtYear(y) {
    return (y < 0 ? '−' : '') + Math.abs(Math.round(y)).toLocaleString('fr-FR');
  }

  /* ---------- Routeur ---------- */
  function viewFromHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    return Object.prototype.hasOwnProperty.call(YEARS, h) ? h : 'home';
  }

  function go(view) {
    if (view === currentView) {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      closeMenu();
      return;
    }
    closeMenu();
    location.hash = (view === 'home') ? '#/' : '#/' + view;
  }

  function route() {
    var view = viewFromHash();
    if (view === currentView) return;
    if (jumping) { pending = view; return; }
    transitionTo(view);
  }

  function transitionTo(to) {
    var fromY = YEARS[currentView], toY = YEARS[to];
    if (reduce || fromY === toY) {
      swap(to);
      finishPending();
      return;
    }
    jumping = true;
    showOverlay();
    var done = false;
    function complete() {
      if (done) return;
      done = true;
      clearTimeout(safety);
      hideOverlay(function () { jumping = false; finishPending(); });
    }
    // Filet de sécurité : si rAF est gelé (onglet en arrière-plan), on débloque quand même.
    var safety = setTimeout(complete, 3000);
    setTimeout(function () { swap(to); }, 420);
    animateCounter(fromY, toY, function () {
      setTimeout(complete, 320);
    });
  }

  function finishPending() {
    if (pending && pending !== currentView) {
      var p = pending; pending = null; transitionTo(p);
    } else {
      pending = null;
    }
  }

  function swap(to) {
    var views = document.querySelectorAll('.view');
    Array.prototype.forEach.call(views, function (s) {
      s.hidden = s.getAttribute('data-view') !== to;
    });
    currentView = to;
    updateChrome(to);
    window.scrollTo(0, 0);
  }

  function updateChrome(to) {
    var y = fmtYear(YEARS[to]);
    var hud = $('hud-year');
    if (hud) hud.textContent = y;
    Array.prototype.forEach.call(document.querySelectorAll('[data-hud-year]'), function (el) { el.textContent = y; });
    document.title = D.TITLES[to] || D.TITLES.home;
    Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-nav') === to);
    });
  }

  /* ---------- Overlay de saut ---------- */
  function showOverlay() {
    var ov = $('jump-overlay');
    if (!ov) return;
    ov.hidden = false;
    ov.setAttribute('aria-hidden', 'false');
    ov.style.opacity = '1';
  }
  function hideOverlay(cb) {
    var ov = $('jump-overlay');
    if (!ov) { cb && cb(); return; }
    ov.style.opacity = '0';
    setTimeout(function () {
      ov.hidden = true;
      ov.setAttribute('aria-hidden', 'true');
      ov.style.opacity = '1';
      cb && cb();
    }, 480);
  }
  function animateCounter(from, to, done) {
    var counter = $('jump-counter');
    var dur = 1700, t0 = performance.now();
    function tick(t) {
      var p = Math.min(1, (t - t0) / dur);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      var y = from + (to - from) * e;
      if (counter) counter.textContent = fmtYear(y);
      if (p < 1) requestAnimationFrame(tick);
      else done();
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Apparitions au scroll ---------- */
  function initReveals() {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) { io.observe(el); });
  }

  /* ---------- Visuels Session 1 (avec secours élégant) ---------- */
  function initImages() {
    var EXTS = ['.png', '.jpg', '.webp']; // ordre d'essai (png d'abord : visuels Session 1)
    Array.prototype.forEach.call(document.querySelectorAll('figure.media[data-img]'), function (fig) {
      var img = fig.querySelector('img');
      if (!img) return;
      var base = 'assets/img/' + fig.getAttribute('data-img');
      var i = 0;
      img.addEventListener('load', function () {
        img.classList.add('is-loaded');
        fig.classList.remove('media--missing');
      });
      img.addEventListener('error', function () {
        i++;
        if (i < EXTS.length) { img.src = base + EXTS[i]; return; }
        fig.classList.add('media--missing');
        img.style.display = 'none';
      });
      img.src = base + EXTS[0];
    });
  }

  /* ---------- Fonds vidéo des pages destination ---------- */
  function initHeroVideos() {
    if (reduce) return; // prefers-reduced-motion : on garde l'image fixe
    var vids = document.querySelectorAll('video[data-video]');
    if (!vids.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.1 });
    Array.prototype.forEach.call(vids, function (v) {
      v.muted = true; // garantit l'autoplay
      v.addEventListener('playing', function () { v.classList.add('is-playing'); });
      v.addEventListener('error', function () { v.style.display = 'none'; });
      v.src = 'assets/video/' + v.getAttribute('data-video') + '.mp4';
      io.observe(v);
    });
  }

  /* ---------- Header : état au scroll ---------- */
  function initHeader() {
    var header = $('site-header');
    if (!header) return;
    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu burger ---------- */
  function initBurger() {
    var burger = $('burger'), menu = $('mobile-menu');
    if (!burger || !menu) return;
    burger.addEventListener('click', function () {
      menu.hidden ? openMenu() : closeMenu();
    });
    // Échap + piège à focus tant que le menu est ouvert
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var list = Array.prototype.filter.call(
        menu.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; });
      if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function openMenu() {
    var burger = $('burger'), menu = $('mobile-menu');
    if (!menu) return;
    menu.hidden = false;
    if (burger) { burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fermer le menu'); }
    var first = menu.querySelector('.nav-link, .nav-cta, button');
    if (first) first.focus();
  }
  function closeMenu() {
    var burger = $('burger'), menu = $('mobile-menu');
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
      burger.focus();
    }
  }

  /* ---------- Délégation d'événements ---------- */
  function initDelegation() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-action]');
      if (!el) return;
      var action = el.getAttribute('data-action');
      switch (action) {
        case 'go': go(el.getAttribute('data-target')); break;
        case 'go-reserver':
          TT.booking.setDest(el.getAttribute('data-dest'));
          go('reserver');
          break;
        case 'scroll-dests': scrollToDests(); break;
        case 'open-quiz': TT.quiz.open(); break;
        case 'close-quiz': TT.quiz.close(); break;
        case 'restart-quiz': TT.quiz.restart(); break;
        case 'quiz-go': TT.quiz.goResult(); break;
        case 'open-chat': TT.chat.open(); break;
        case 'close-chat': TT.chat.close(); break;
        case 'gen-itin': TT.itinerary.generate(el.getAttribute('data-dest')); break;
        case 'new-resv': TT.booking.newResv(); break;
        // pax-minus / pax-plus / submit-resv : gérés dans booking.js
      }
    });
  }

  function scrollToDests() {
    if (currentView !== 'home') { go('home'); }
    var el = $('tt-destinations');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- Amorçage ---------- */
  function boot() {
    reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    TT.chat.init();
    TT.quiz.init();
    TT.itinerary.init();
    TT.booking.init();

    initImages();
    initHeroVideos();
    initReveals();
    initHeader();
    initBurger();
    initDelegation();
    window.addEventListener('hashchange', route);

    var initial = viewFromHash();
    if (initial !== 'home') swap(initial);
    else updateChrome('home');
  }

  TT.app = { go: go };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
