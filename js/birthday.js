/* ═══════════════════════════════════════════════
   BIRTHDAY — carte d'anniversaire animée (18 ans)
   ═══════════════════════════════════════════════ */
window.Birthday = (function () {
  var ANIMATED_SELECTOR = '.figure-him, .figure-her, .kiss-heart, .kiss-heart-pulse, .confetti-heart';

  function replay() {
    var scene = document.getElementById('bday-scene');
    if (!scene) return;
    var els = scene.querySelectorAll(ANIMATED_SELECTOR);
    els.forEach(function (el) {
      el.style.animation = 'none';
      void getComputedStyle(el).animation;
    });
    els.forEach(function (el) { el.style.animation = ''; });
  }

  function unlockDate() {
    var cfg = window.App && window.App.CONFIG && window.App.CONFIG.birthdayUnlockDate;
    return cfg ? new Date(cfg + 'T00:00:00') : null;
  }

  function isUnlocked() {
    var d = unlockDate();
    return !d || Date.now() >= d.getTime();
  }

  function open() {
    if (!isUnlocked()) {
      var d = unlockDate();
      var when = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
      window.App && window.App.toast('✦ Patience… ce secret s\'ouvre le ' + when + ' ✦');
      return;
    }
    document.getElementById('birthday-wrap').classList.add('on');
    replay();
  }

  function close() {
    document.getElementById('birthday-wrap').classList.remove('on');
  }

  function init() {
    document.getElementById('birthday-bg').addEventListener('click', close);
    document.querySelector('#birthday-box .btn-close').addEventListener('click', close);
  }

  return { init: init, open: open, close: close };
})();
