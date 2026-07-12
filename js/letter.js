/* ═══════════════════════════════════════════════
   LETTRE — machine à écrire
   ═══════════════════════════════════════════════ */
window.Letter = (function () {
  var TEXT = "Chloé,\n\nOn dit que l'amour est cette étrange force qui transforme le simple en éternel. Et depuis que ton nom habite mes pensées, je comprends mieux ces mots que les poètes poursuivaient sans fin.\n\nComme l'écrivait Victor Hugo, « aimer, c'est agir » — alors je t'écris, parce que mon cœur trouve dans tes silences plus de vérité que dans mille discours.\n\nIl y a dans ton prénom une douceur qui ressemble au printemps, une lumière calme qui traverse mes jours comme un soleil après l'orage. Et si Paul Éluard disait que « la courbe de tes yeux fait le tour de mon cœur », je crois que ton sourire, lui, a trouvé le chemin du mien sans jamais se perdre.\n\nTu es cette rare présence qui rend le temps plus léger, cette évidence que l'on ne cherche pas mais que l'on reconnaît dès qu'elle apparaît.\n\nL'amour ne consiste pas à se regarder l'un l'autre, mais à regarder ensemble dans la même direction. Avec toi, j'ai l'impression que même l'horizon devient plus beau.\n\nChloé, il existe des personnes qui marquent une vie comme une phrase inoubliable dans un livre qu'on relit sans cesse. Pour moi, tu es cette phrase.\n\nEt s'il fallait résumer tout ce que je ressens en quelques mots, ce serait simplement ceci :\n\ndans le grand désordre du monde, ton existence est l'une de mes plus belles certitudes.\n\n                                                         ♥";

  var typing = null, open = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openLetter() {
    if (open) return;
    open = true;
    document.getElementById('lettre-wrap').classList.add('on');
    var el = document.getElementById('l-text');
    var cur = document.getElementById('l-cursor');
    el.textContent = '';
    cur.style.display = 'inline-block';

    if (reducedMotion) {
      el.textContent = TEXT;
      cur.style.display = 'none';
      return;
    }

    var i = 0;
    function type() {
      if (i < TEXT.length) {
        el.textContent += TEXT[i];
        i++;
        var ch = TEXT[i - 1];
        var d = ch === '\n' ? 75 : '.!?,;:'.indexOf(ch) >= 0 ? 160 + Math.random() * 100 : 22 + Math.random() * 24;
        typing = setTimeout(type, d);
      } else {
        cur.style.display = 'none';
      }
    }
    type();
  }

  function closeLetter() {
    clearTimeout(typing);
    open = false;
    document.getElementById('lettre-wrap').classList.remove('on');
    document.getElementById('l-text').textContent = '';
    document.getElementById('l-cursor').style.display = 'inline-block';
  }

  function init() {
    document.querySelectorAll('[data-open-letter]').forEach(function (btn) {
      btn.addEventListener('click', openLetter);
    });
    document.getElementById('lettre-bg').addEventListener('click', closeLetter);
    document.querySelector('#lettre-box .btn-close').addEventListener('click', closeLetter);
  }

  return { init: init, open: openLetter, close: closeLetter };
})();
