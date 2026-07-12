/* ═══════════════════════════════════════════════
   MOMENTS — mini-clips silencieux en boucle
   ═══════════════════════════════════════════════ */
window.Moments = (function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var videos = document.querySelectorAll('.video-tile video');
    if (!videos.length) return;

    if (reducedMotion) {
      videos.forEach(function (v) {
        v.removeAttribute('loop');
        v.parentElement.addEventListener('click', function () {
          v.paused ? v.play() : v.pause();
        });
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });

    videos.forEach(function (v) { io.observe(v); });
  }

  return { init: init };
})();
