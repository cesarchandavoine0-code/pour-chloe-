/* ═══════════════════════════════════════════════
   REVEAL — apparitions au défilement
   ═══════════════════════════════════════════════ */
window.Reveal = (function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function observe(selector, opts) {
    opts = opts || {};
    var els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (reducedMotion) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (opts.once !== false) io.unobserve(entry.target);
        } else if (opts.once === false) {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: opts.threshold || 0.22 });

    els.forEach(function (el) { io.observe(el); });
  }

  return { observe: observe };
})();
