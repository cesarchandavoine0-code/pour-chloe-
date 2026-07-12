/* ═══════════════════════════════════════════════
   GALLERY — médaillon d'accueil + lightbox photo
   ═══════════════════════════════════════════════ */
window.Gallery = (function () {
  var PHOTOS = ['photo1.png', 'photo2.jpg', 'photo3.jpg'];
  var stageImgs = [];
  var stageIdx = 0;
  var lightboxIdx = 0;
  var slideTimer = null;

  function initStage() {
    var stage = document.getElementById('photo-stage');
    if (!stage) return;
    PHOTOS.forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Chloé';
      img.loading = i === 0 ? 'eager' : 'lazy';
      if (i === 0) img.classList.add('active');
      stage.appendChild(img);
      stageImgs.push(img);
    });

    slideTimer = setInterval(function () {
      stageImgs[stageIdx].classList.remove('active');
      stageIdx = (stageIdx + 1) % stageImgs.length;
      stageImgs[stageIdx].classList.add('active');
    }, 4500);

    document.getElementById('photo-wrap').addEventListener('click', function () {
      openLightbox(stageIdx);
    });
  }

  function openLightbox(index) {
    lightboxIdx = index;
    renderLightbox();
    document.getElementById('lightbox').classList.add('on');
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('on');
  }

  function renderLightbox() {
    var img = document.getElementById('lightbox-img');
    img.style.opacity = '0';
    setTimeout(function () {
      img.src = PHOTOS[lightboxIdx];
      img.style.opacity = '1';
    }, 140);
  }

  function next() { lightboxIdx = (lightboxIdx + 1) % PHOTOS.length; renderLightbox(); }
  function prev() { lightboxIdx = (lightboxIdx - 1 + PHOTOS.length) % PHOTOS.length; renderLightbox(); }

  function initLightbox() {
    document.getElementById('lightbox-bg').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-next').addEventListener('click', next);
    document.getElementById('lightbox-prev').addEventListener('click', prev);

    document.querySelectorAll('.story-media').forEach(function (media, i) {
      media.style.cursor = 'zoom-in';
      media.addEventListener('click', function () { openLightbox(i % PHOTOS.length); });
    });

    document.addEventListener('keydown', function (e) {
      if (!document.getElementById('lightbox').classList.contains('on')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    var touchX = null;
    var stage = document.getElementById('lightbox-stage');
    stage.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (dx > 40) prev(); else if (dx < -40) next();
      touchX = null;
    }, { passive: true });
  }

  function init() {
    initStage();
    initLightbox();
  }

  return { init: init, PHOTOS: PHOTOS };
})();
