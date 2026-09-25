/**
 * مؤسسة المعهد أنترناشيونال - ALMAAHED INTERNATIONAL
 * Presentation Controller
 */

function initPresentation() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  if (!totalSlides) return;

  let currentIndex = 0;

  // DOM Elements
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const sideBtnPrev = document.getElementById('sideBtnPrev');
  const sideBtnNext = document.getElementById('sideBtnNext');
  const dotsContainer = document.getElementById('dotsContainer');

  const btnTheme = document.getElementById('btnTheme');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnPrint = document.getElementById('btnPrint');

  // Build navigation dots
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `dot-btn ${idx === currentIndex ? 'active' : ''}`;
      dot.title = `الشريحة ${idx + 1}`;
      dot.setAttribute('aria-label', `الانتقال إلى الشريحة ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateUI() {
    // 1. Activate current slide and deactivate others
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.scrollTop = 0;
      } else {
        slide.classList.remove('active');
      }
    });

    // 2. Progress bar
    if (progressFill) {
      const percent = ((currentIndex + 1) / totalSlides) * 100;
      progressFill.style.width = `${percent}%`;
    }

    // 3. Counter display
    if (slideCounter) {
      const curStr = (currentIndex + 1).toString().padStart(2, '0');
      const totStr = totalSlides.toString().padStart(2, '0');
      slideCounter.textContent = `${curStr} / ${totStr}`;
    }

    // 4. Dot active state
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot-btn');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // 5. Button states
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalSlides - 1;

    if (btnPrev) btnPrev.disabled = isFirst;
    if (btnNext) btnNext.disabled = isLast;

    if (sideBtnPrev) {
      sideBtnPrev.style.opacity = isFirst ? '0.3' : '1';
      sideBtnPrev.style.pointerEvents = isFirst ? 'none' : 'auto';
    }
    if (sideBtnNext) {
      sideBtnNext.style.opacity = isLast ? '0.3' : '1';
      sideBtnNext.style.pointerEvents = isLast ? 'none' : 'auto';
    }

    // 6. Dynamic number counter for Slide 7
    if (currentIndex === 6) {
      animateCounters();
    }
  }

  // Count-up animation for metrics
  let countUpReqs = [];
  function animateCounters() {
    countUpReqs.forEach(cancelAnimationFrame);
    countUpReqs = [];

    const statValues = document.querySelectorAll('#slide-7 .stat-value');
    statValues.forEach(elem => {
      const rawText = elem.getAttribute('data-val') || elem.textContent.trim();
      const target = parseInt(rawText, 10);
      if (isNaN(target)) return;

      elem.setAttribute('data-val', target);
      elem.textContent = '0';

      const duration = 1200;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * target);
        elem.textContent = current;

        if (progress < 1) {
          countUpReqs.push(requestAnimationFrame(step));
        } else {
          elem.textContent = target;
        }
      }
      countUpReqs.push(requestAnimationFrame(step));
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;
    updateUI();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Button clicks
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
  if (sideBtnNext) sideBtnNext.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
  if (sideBtnPrev) sideBtnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowRight':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });

  // Touch swipe support (Mobile & Tablet)
  let touchStartX = 0;
  let touchEndX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // Theme toggle
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      document.body.classList.toggle('theme-dark');
    });
  }

  // Fullscreen toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);

  // Fullscreen state listener & Auto-hiding bars
  let controlsTimer = null;
  function handleFullscreenChange() {
    const isFS = !!document.fullscreenElement;
    if (isFS) {
      document.body.classList.add('fullscreen-mode');
      if (btnFullscreen) {
        btnFullscreen.innerHTML = '<span class="btn-symbol">🗗</span>';
        btnFullscreen.title = 'إنهاء ملء الشاشة (Esc)';
      }
      revealControlsTemporarily(1800);
    } else {
      document.body.classList.remove('fullscreen-mode', 'show-controls');
      if (btnFullscreen) {
        btnFullscreen.innerHTML = '<span class="btn-symbol">⛶</span>';
        btnFullscreen.title = 'ملء الشاشة';
      }
      if (controlsTimer) clearTimeout(controlsTimer);
    }
  }

  function revealControlsTemporarily(duration = 2200) {
    if (!document.fullscreenElement) return;
    document.body.classList.add('show-controls');
    if (controlsTimer) clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => {
      document.body.classList.remove('show-controls');
    }, duration);
  }

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  window.addEventListener('mousemove', () => {
    if (document.fullscreenElement) {
      revealControlsTemporarily(2000);
    }
  });

  // Clicking presentation background advances slide
  const stageEl = document.querySelector('.presentation-container');
  if (stageEl) {
    stageEl.addEventListener('click', (e) => {
      if (
        e.target.closest('button') ||
        e.target.closest('.navbar') ||
        e.target.closest('.bottom-bar') ||
        e.target.closest('.creative-card') ||
        e.target.closest('.keynote-question-box') ||
        e.target.closest('.finale-card')
      ) {
        return;
      }
      nextSlide();
    });
  }

  // Print / Save to PDF
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Initialize
  buildDots();
  updateUI();
}

// Resilient startup
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPresentation);
} else {
  initPresentation();
}
