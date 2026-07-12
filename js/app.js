/* ═══════════════════════════════════════════════
   APP — configuration, init, petites features
   ═══════════════════════════════════════════════ */
window.App = (function () {

  /* Personnalise ici : */
  var CONFIG = {
    // Date de début (YYYY-MM-DD) pour afficher un compteur "depuis le...".
    // Laisse à null pour masquer le compteur.
    startDate: null,
    musicLabel: { off: '♪', on: '❚❚' },
    // La carte d'anniversaire ne s'ouvre qu'à partir de cette date (YYYY-MM-DD, minuit heure locale).
    birthdayUnlockDate: '2026-08-19'
  };

  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._to);
    t._to = setTimeout(function () { t.classList.remove('on'); }, 3200);
  }

  function initPreloader() {
    var pl = document.getElementById('preloader');
    window.addEventListener('load', function () {
      setTimeout(function () { pl.classList.add('hidden'); }, 350);
    });
    // filet de sécurité si "load" tarde
    setTimeout(function () { pl.classList.add('hidden'); }, 3500);
  }

  function initScrollCue() {
    var cue = document.getElementById('scroll-cue');
    if (!cue) return;
    cue.addEventListener('click', function () {
      var story = document.getElementById('story');
      if (story) story.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function initStartButton() {
    var btn = document.getElementById('btn-start');
    if (!btn) return;
    btn.addEventListener('click', function () {
      btn.innerHTML = '♥';
      btn.style.fontSize = '1.5rem';
      btn.style.letterSpacing = '0';
      Music.tryPlay();
      window.Birthday.open();
    }, { once: false });
  }

  var Music = (function () {
    var on = false, broken = false;
    var el = document.getElementById('music');
    var btn = document.getElementById('btn-music');

    el.addEventListener('error', function () {
      broken = true;
    });

    function setIcon() {
      btn.textContent = on ? CONFIG.musicLabel.on : CONFIG.musicLabel.off;
      btn.classList.toggle('playing', on);
    }

    function tryPlay() {
      if (on) return;
      if (broken) {
        toast('Ajoute un vrai fichier music.mp3 pour la musique');
        return;
      }
      el.play().then(function () {
        on = true;
        setIcon();
        toast('♪ Musique activée');
      }).catch(function () {
        toast('Clique sur la note pour activer le son ♪');
      });
    }

    function toggle() {
      if (on) {
        el.pause();
        on = false;
        setIcon();
      } else {
        tryPlay();
      }
    }

    function init() {
      btn.addEventListener('click', toggle);
      setIcon();
    }

    return { init: init, tryPlay: tryPlay };
  })();

  function initTogetherCounter() {
    var el = document.getElementById('together-counter');
    if (!el) return;
    if (!CONFIG.startDate) { el.classList.add('hide'); return; }
    var start = new Date(CONFIG.startDate).getTime();
    function tick() {
      var diff = Date.now() - start;
      if (diff < 0) { el.classList.add('hide'); return; }
      var days = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      el.innerHTML = 'Ensemble depuis <b>' + days + '</b> jours, <b>' + h + '</b>h <b>' + m + '</b>min';
    }
    tick();
    setInterval(tick, 60000);
  }

  function initReasonCards() {
    document.querySelectorAll('.flip-card').forEach(function (card) {
      card.addEventListener('click', function () { card.classList.toggle('flipped'); });
    });
  }

  function initReveals() {
    Reveal.observe('.reveal');
    Reveal.observe('.reveal-scale');
  }

  function init() {
    initPreloader();
    initScrollCue();
    initStartButton();
    Music.init();
    initTogetherCounter();
    initReasonCards();
    initReveals();
    window.Gallery.init();
    window.Letter.init();
    window.Birthday.init();
    window.Messenger.init();
    window.Moments.init();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { toast: toast, CONFIG: CONFIG };
})();
