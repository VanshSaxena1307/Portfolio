/* ============================================
   VANSH SAXENA PORTFOLIO — ANIMATIONS.JS
   Scroll reveal, IntersectionObserver
   ============================================ */

(function () {
  'use strict';

  /* ---- Scroll Reveal ---- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          /* Stagger siblings that enter together */
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 60;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => revealObs.observe(el));

  /* ---- Scroll Progress Bar ---- */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(s => navObs.observe(s));

  /* ---- Nav shrink on scroll ---- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

})();
