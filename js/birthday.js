/* ═══════════════════════════════════════════════
   BIRTHDAY — carte d'anniversaire animée (18 ans)
   ═══════════════════════════════════════════════ */
window.Birthday = (function () {
  var ANIMATED_SELECTOR = '.figure-him, .figure-her, .kiss-heart, .kiss-heart-pulse, .confetti-heart';
  var EARLY_CODE = '2008';
  var EARLY_KEY = 'chloe-bday-early-unlock';

  function isEarlyUnlocked() {
    try { return window.localStorage.getItem(EARLY_KEY) === '1'; } catch (e) { return false; }
  }

  function setEarlyUnlocked() {
    try { window.localStorage.setItem(EARLY_KEY, '1'); } catch (e) {}
  }

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

  function reveal() {
    document.getElementById('birthday-wrap').classList.add('on');
    replay();
  }

  function open() {
    if (isUnlocked() || isEarlyUnlocked()) {
      reveal();
      return;
    }
    var when = unlockDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    window.Pin.request({
      code: EARLY_CODE,
      title: 'Un secret avant l\'heure ?',
      sub: 'Entre le code si tu le connais',
      onSuccess: function () {
        setEarlyUnlocked();
        reveal();
      },
      onCancel: function () {
        window.App && window.App.toast('✦ Tu la verras le ' + when + ' ✦');
      }
    });
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
