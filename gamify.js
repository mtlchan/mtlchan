/* gamify.js — Animated particles, progress bars, daily fact widget */

var Gamify = (function() {
  var SUBJECT_IDS = ['biology','archaeology','cv'];

  /* === PARTICLES === */
  var pCanvas, pCtx, particles = [];
  var PC = 22;

  function initParticles() {
    pCanvas = document.getElementById('particles-canvas');
    if (!pCanvas) return;
    pCtx = pCanvas.getContext('2d');
    resizeParticles();
    window.addEventListener('resize', resizeParticles);
    for (var i = 0; i < PC; i++) particles.push(spawnParticle());
    requestAnimationFrame(animParticles);
  }

  function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight - 30;
  }

  function spawnParticle() {
    var types = ['atom','molecule','dna'];
    var t = types[Math.floor(Math.random() * 3)];
    var colors = ['hsla(190,100%,50%,0.10)','hsla(190,100%,50%,0.13)','hsla(330,100%,50%,0.07)','hsla(330,100%,50%,0.09)'];
    var h = colors[Math.floor(Math.random() * 4)];
    return {
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      type: t,
      size: 14 + Math.random() * 22,
      color: h,
      angle: Math.random() * Math.PI * 2
    };
  }

  function drawAtom(p, tm) {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
    pCtx.fillStyle = p.color;
    pCtx.fill();
    for (var i = 0; i < 3; i++) {
      var a = tm * 0.001 + (i * Math.PI * 2) / 3;
      var ex = p.x + Math.cos(a) * p.size * 0.55;
      var ey = p.y + Math.sin(a) * p.size * 0.55 * 0.5;
      pCtx.beginPath();
      pCtx.arc(ex, ey, 1.5, 0, Math.PI * 2);
      pCtx.fillStyle = p.color;
      pCtx.fill();
    }
  }

  function drawMolecule(p) {
    var r = p.size * 0.2;
    var pos = [[-r, 0], [r, 0], [0, r * 0.7]];
    pCtx.fillStyle = p.color;
    pos.forEach(function(pt) {
      pCtx.beginPath();
      pCtx.arc(p.x + pt[0], p.y + pt[1], r * 0.7, 0, Math.PI * 2);
      pCtx.fill();
    });
    pCtx.beginPath();
    pCtx.moveTo(p.x + pos[0][0], p.y + pos[0][1]);
    pCtx.lineTo(p.x + pos[1][0], p.y + pos[1][1]);
    pCtx.lineTo(p.x + pos[2][0], p.y + pos[2][1]);
    pCtx.strokeStyle = p.color;
    pCtx.lineWidth = 1;
    pCtx.stroke();
  }

  function drawDNA(p, tm) {
    var wf = 0.08, wa = p.size * 0.28, seg = 8, sl = p.size * 2.2 / seg;
    for (var s = 0; s < 2; s++) {
      pCtx.beginPath();
      pCtx.strokeStyle = p.color;
      pCtx.lineWidth = 1.2;
      var off = s === 0 ? -p.size * 0.14 : p.size * 0.14;
      for (var i = 0; i <= seg; i++) {
        var py = p.y - p.size + i * sl;
        var px = p.x + Math.sin(py * wf + tm * 0.0004 + s * Math.PI) * wa + off;
        if (i === 0) pCtx.moveTo(px, py);
        else pCtx.lineTo(px, py);
      }
      pCtx.stroke();
    }
    for (var j = 0; j < seg; j++) {
      var py2 = p.y - p.size + j * sl;
      var x1 = p.x + Math.sin(py2 * wf + tm * 0.0004) * wa - p.size * 0.14;
      var x2 = p.x + Math.sin(py2 * wf + tm * 0.0004 + Math.PI) * wa + p.size * 0.14;
      pCtx.beginPath();
      pCtx.moveTo(x1, py2);
      pCtx.lineTo(x2, py2);
      pCtx.strokeStyle = p.color;
      pCtx.lineWidth = 0.8;
      pCtx.stroke();
    }
  }

  function animParticles(tm) {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -60) { p.x = pCanvas.width + 60; p.y = Math.random() * pCanvas.height; }
      if (p.x > pCanvas.width + 60) { p.x = -60; p.y = Math.random() * pCanvas.height; }
      if (p.y < -60) { p.y = pCanvas.height + 60; p.x = Math.random() * pCanvas.width; }
      if (p.y > pCanvas.height + 60) { p.y = -60; p.x = Math.random() * pCanvas.width; }
      if (p.type === 'atom') drawAtom(p, tm);
      else if (p.type === 'molecule') drawMolecule(p);
      else drawDNA(p, tm);
    });
    requestAnimationFrame(animParticles);
  }

  /* === PROGRESS BARS === */
  function isSubject(id) {
    return SUBJECT_IDS.indexOf(id) !== -1;
  }

  function initProgress(id) {
    try {
      var body = document.querySelector('#window-' + id + ' .window-body');
      if (!body) return;
      var fill = document.getElementById('prog-' + id);
      if (!fill) return;
      var saved = parseFloat(localStorage.getItem('prog_' + id) || '0');
      fill.style.width = saved + '%';
      body.addEventListener('scroll', function() {
        var pct = body.scrollHeight <= body.clientHeight ? 0 :
          Math.round(body.scrollTop / (body.scrollHeight - body.clientHeight) * 100);
        fill.style.width = pct + '%';
        try { localStorage.setItem('prog_' + id, pct); } catch(e) {}
      });
    } catch(e) {}
  }

  function getProgressBarHTML(id) {
    return '<div class="progress-bar"><div class="fill" id="prog-' + id + '"></div></div>';
  }

  /* === SLIDESHOW WIDGET === */
  var slides = [
    {file:'media/slideshow/slide_00_processed_IMG_8960.jpg',cap:'Surveying biodiversity at the Pennyhooks site'},
    {file:'media/slideshow/slide_01_processed_IMG_8752.jpg',cap:'Students excavating at the Pennyhooks archaeological site'},
    {file:'media/slideshow/slide_02_processed_IMG_9043.jpg',cap:'Exploring medieval history and science at Warwick Castle'},
    {file:'media/slideshow/slide_03_processed_IMG_3313.jpg',cap:'Class group photo from the school year'},
    {file:'media/slideshow/slide_04_processed_IMG_9030.jpg',cap:'Educational field trip to London landmarks'},
    {file:'media/slideshow/slide_05_processed_IMG_8594.jpg',cap:'Exploring the historic Roman Baths in the city of Bath'},
    {file:'media/slideshow/slide_06_processed_IMG_7902_2.jpg',cap:'Students during the bed and breakfast field trip'},
    {file:'media/slideshow/slide_07_processed_IMG_8763.jpg',cap:'Visiting Oxford for an educational tour'},
    {file:'media/slideshow/slide_08_processed_IMG_5558.jpg',cap:'The annual pinewood derby science and engineering challenge'},
    {file:'media/slideshow/slide_09_processed_IMG_7788.jpg',cap:'Students conducting experiments in the chemistry laboratory'},
    {file:'media/slideshow/slide_10_processed_IMG_7464_2.jpg',cap:'Biology students performing a frog dissection practical'},
    {file:'media/slideshow/slide_11_processed_IMG_7771.jpg',cap:'Hands-on learning at the CYLF science workshop'},
    {file:'media/slideshow/slide_12_processed_IMG_7715.jpg',cap:'Ecological field study at Mai Po Nature Reserve'},
    {file:'media/slideshow/slide_13_processed_IMG_8279.jpg',cap:'Observing lung anatomy during the dissection lab'},
    {file:'media/slideshow/slide_14_processed_IMG_7753.jpg',cap:'Homeroom class group picture'},
    {file:'media/slideshow/slide_15_processed_IMG_0104.JPG',cap:'Surveying biodiversity at the Pennyhooks site'},
    {file:'media/slideshow/slide_16_processed_IMG_8926.jpg',cap:'Surveying biodiversity at the Pennyhooks site'},
    {file:'media/slideshow/slide_17_processed_IMG_3273.jpg',cap:'Class group photo from the school year'},
    {file:'media/slideshow/slide_18_processed_IMG_5459.jpg',cap:'Class group photo from the school year'},
    {file:'media/slideshow/slide_19_processed_IMG_8754.jpg',cap:'Students excavating at the Pennyhooks archaeological site'}
  ];
  var slideIdx = 0;
  var slideTimer = null;
  var slidePaused = false;
  var SLIDE_INTERVAL = 5000; // 5 seconds

  function showSlide(idx) {
    slideIdx = ((idx % slides.length) + slides.length) % slides.length;
    var s = slides[slideIdx];
    var img = document.getElementById('slide-img');
    var cap = document.getElementById('slide-caption');
    var dot = document.getElementById('slide-counter');
    if (img) { img.style.display = ''; img.src = s.file; img.alt = s.cap; }
    if (cap) cap.textContent = s.cap;
    if (dot) dot.textContent = (slideIdx + 1) + '/' + slides.length;
  }

  function startSlideshow() {
    stopSlideshow();
    if (!slidePaused) {
      slideTimer = setInterval(function() { showSlide(slideIdx + 1); }, SLIDE_INTERVAL);
    }
  }

  function stopSlideshow() {
    if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
  }

  function nextSlide() {
    showSlide(slideIdx + 1);
    stopSlideshow();
    startSlideshow();
  }

  function prevSlide() {
    showSlide(slideIdx - 1);
    stopSlideshow();
    startSlideshow();
  }

  function togglePause() {
    slidePaused = !slidePaused;
    var btn = document.getElementById('slide-pause');
    if (btn) btn.innerHTML = slidePaused ? '\u25B6' : '\u23F8';
    if (slidePaused) { stopSlideshow(); }
    else { startSlideshow(); }
  }

  function toggleSlideshowWidget() {
    var w = document.getElementById('slideshow-widget');
    if (w) {
      w.classList.toggle('minimized');
      var btn = w.querySelector('.ss-btn-min');
      if (btn) btn.innerHTML = w.classList.contains('minimized') ? '+\uFE0E' : '\u2013';
    }
  }

  /* === INIT === */
  function init() {
    initParticles();
    showSlide(0);
    startSlideshow();
  }

  return {
    init: init,
    isSubject: isSubject,
    initProgress: initProgress,
    getProgressBarHTML: getProgressBarHTML,
    nextSlide: nextSlide,
    prevSlide: prevSlide,
    togglePause: togglePause,
    toggleSlideshowWidget: toggleSlideshowWidget
  };
})();

// Auto-init on load
Gamify.init();
