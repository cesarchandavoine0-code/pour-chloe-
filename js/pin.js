/* ═══════════════════════════════════════════════
   PIN — clavier à code partagé (messagerie, carte anniversaire…)
   ═══════════════════════════════════════════════ */
window.Pin = (function () {
  var buffer = '';
  var expected = '2008';
  var onSuccess = null;
  var onCancel = null;

  function updateDots() {
    for (var i = 0; i < 4; i++) {
      document.getElementById('dot' + i).classList.toggle('filled', i < buffer.length);
    }
  }

  function request(opts) {
    opts = opts || {};
    expected = opts.code || '2008';
    onSuccess = typeof opts.onSuccess === 'function' ? opts.onSuccess : null;
    onCancel = typeof opts.onCancel === 'function' ? opts.onCancel : null;
    document.getElementById('pin-title').textContent = opts.title || 'Code secret';
    document.getElementById('pin-sub').textContent = opts.sub || 'Entrez votre PIN à 4 chiffres';
    buffer = '';
    updateDots();
    document.getElementById('pin-error').textContent = '';
    document.getElementById('pin-wrap').classList.add('on');
  }

  function cancel() {
    var cb = onCancel;
    buffer = '';
    updateDots();
    document.getElementById('pin-wrap').classList.remove('on');
    onSuccess = null;
    onCancel = null;
    if (cb) cb();
  }

  function press(val) {
    if (val === 'del') { buffer = buffer.slice(0, -1); updateDots(); return; }
    if (val === 'ok') { check(); return; }
    if (buffer.length >= 4) return;
    buffer += val;
    updateDots();
    if (buffer.length === 4) setTimeout(check, 150);
  }

  function check() {
    if (buffer === expected) {
      var cb = onSuccess;
      buffer = '';
      updateDots();
      document.getElementById('pin-wrap').classList.remove('on');
      onSuccess = null;
      onCancel = null;
      if (cb) cb();
    } else {
      document.getElementById('pin-error').textContent = 'Code incorrect';
      buffer = '';
      updateDots();
      setTimeout(function () { document.getElementById('pin-error').textContent = ''; }, 1800);
    }
  }

  function init() {
    document.getElementById('btn-pin-cancel').addEventListener('click', cancel);
    document.getElementById('pin-bg').addEventListener('click', cancel);
    document.querySelectorAll('.pin-key').forEach(function (key) {
      key.addEventListener('click', function () { press(key.dataset.key); });
    });
  }

  return { init: init, request: request, cancel: cancel };
})();
