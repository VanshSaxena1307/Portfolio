/* ============================================
   VANSH SAXENA PORTFOLIO — CURSOR.JS
   Custom animated cursor with magnetic trail
   ============================================ */

(function () {
  'use strict';

  /* Skip on touch devices */
  if (window.matchMedia('(hover: none)').matches) {
    document.getElementById('cursor').style.display = 'none';
    document.getElementById('cursor-trail').style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');

  if (!cursor || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let raf;

  /* ---- Track mouse ---- */
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  /* ---- Smooth trail ---- */
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.13;
    trailY += (mouseY - trailY) * 0.13;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  /* ---- Hover interactions ---- */
  const HOVER_SELECTORS = [
    'a', 'button', '.project-card', '.skill-card',
    '.cert-card', '.edu-card', '.social-link',
    '.contact-link', '.coding-card', '.journey-step',
    '.highlight-item', '.exp-item',
  ].join(', ');

  function addHoverListeners() {
    document.querySelectorAll(HOVER_SELECTORS).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        cursor.style.background = 'var(--accent2)';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        cursor.style.background = 'var(--accent)';
      });
    });
  }

  /* Run after DOM settles */
  if (document.readyState === 'complete') {
    addHoverListeners();
  } else {
    window.addEventListener('load', addHoverListeners);
  }

  /* ---- Hide cursor when leaving window ---- */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });

  /* ---- Click effect ---- */
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
})();
