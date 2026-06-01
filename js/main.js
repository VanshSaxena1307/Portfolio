/* ============================================
   VANSH SAXENA PORTFOLIO — MAIN.JS
   Role rotator, GitHub grid, mobile menu,
   contact form, scroll-to-top, misc utils
   ============================================ */

(function () {
  'use strict';

  /* ============================================================
     1. ROLE ROTATOR
  ============================================================ */
  const ROLES = [
    '"Full Stack Developer"',
    '"AI Explorer"',
    '"Web Developer"',
    '"Coder"',
    '"Problem Solver"',
    '"Tech Builder"',
    '"Future AI Engineer"',
  ];

  const roleEl = document.getElementById('role-text');
  let roleIdx  = 0;

  if (roleEl) {
    setInterval(() => {
      roleEl.style.opacity = '0';
      setTimeout(() => {
        roleIdx = (roleIdx + 1) % ROLES.length;
        roleEl.textContent  = ROLES[roleIdx];
        roleEl.style.opacity = '1';
      }, 320);
    }, 2200);
  }

  /* ============================================================
     2. GITHUB CONTRIBUTION GRID (decorative heatmap)
  ============================================================ */
  const ghGrid = document.getElementById('gh-grid');

  if (ghGrid) {
    const LEVELS = ['', 'l1', 'l2', 'l3', 'l4'];
    const TOTAL_CELLS = 182; /* 26 cols × 7 rows */

    /* Simulate a realistic contribution pattern */
    for (let i = 0; i < TOTAL_CELLS; i++) {
      const cell = document.createElement('div');
      cell.className = 'gh-cell';

      const rand = Math.random();
      if (rand > 0.72) {
        /* Weighted toward lower levels */
        const weights = [0, 0.45, 0.30, 0.15, 0.10];
        let cumulative = 0;
        const r2 = Math.random();
        for (let lvl = 1; lvl < weights.length; lvl++) {
          cumulative += weights[lvl];
          if (r2 < cumulative) {
            cell.classList.add(LEVELS[lvl]);
            break;
          }
        }
      }

      /* Tooltip */
      cell.title = rand > 0.72 ? `${Math.floor(Math.random() * 8 + 1)} contributions` : 'No contributions';

      ghGrid.appendChild(cell);
    }
  }

  /* ============================================================
     3. MOBILE HAMBURGER MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const navCta    = document.getElementById('nav-cta');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');

      if (isOpen) {
        navLinks.classList.add('mobile-open');
        if (navCta) navCta.classList.add('mobile-open');
      } else {
        navLinks.classList.remove('mobile-open');
        if (navCta) navCta.classList.remove('mobile-open');
      }
    });

    /* Close menu on link click */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        if (navCta) navCta.classList.remove('mobile-open');
      });
    });
  }

  /* ============================================================
     4. CONTACT FORM
  ============================================================ */
  const submitBtn = document.getElementById('contact-submit');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name    = document.getElementById('cf-name')?.value.trim();
      const email   = document.getElementById('cf-email')?.value.trim();
      const message = document.getElementById('cf-msg')?.value.trim();

      if (!name || !email || !message) {
        submitBtn.textContent = 'Please fill all fields ⚠️';
        submitBtn.style.background = '#f59e0b';
        setTimeout(() => {
          submitBtn.textContent  = 'Send Message ✉';
          submitBtn.style.background = '';
        }, 2500);
        return;
      }

      /* mailto fallback */
      const subject  = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:vanshsaxena2007@outlook.com?subject=${subject}&body=${body}`;

      submitBtn.textContent  = 'Opening Mail App... 📬';
      submitBtn.style.background = 'var(--green)';
      setTimeout(() => {
        submitBtn.textContent  = 'Send Message ✉';
        submitBtn.style.background = '';
      }, 3000);
    });
  }

  /* ============================================================
     5. SMOOTH ANCHOR SCROLL (offset for fixed nav)
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     6. RESUME DOWNLOAD BUTTON
     Replace href with your actual resume link or file path
  ============================================================ */
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    /* Update this URL to your Google Drive / Dropbox / direct link */
    resumeBtn.setAttribute('href', 'assets/Vansh_Saxena_Resume.pdf');
    resumeBtn.setAttribute('download', 'Vansh_Saxena_Resume.pdf');
    resumeBtn.setAttribute('target', '_blank');
  }

  /* ============================================================
     7. STAT COUNTER ANIMATION (About section highlights)
  ============================================================ */
  const highlightNums = document.querySelectorAll('.highlight-item .num');

  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const raw = el.textContent.trim();
          /* Only animate numeric values */
          const num = parseInt(raw.replace(/\D/g, ''));
          if (!isNaN(num) && num > 0) {
            animCount(el, num);
          }
          counterObs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  highlightNums.forEach(el => counterObs.observe(el));

  function animCount(el, target) {
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(iv);
    }, 35);
  }

  /* ============================================================
     8. YEAR AUTO-UPDATE IN FOOTER
  ============================================================ */
  const yearEl = document.querySelector('.footer-left');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace('2025', year);
  }

  /* ============================================================
     9. LAZY-LOAD IMAGES (if any added later)
  ============================================================ */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }

  /* ============================================================
     10. CONSOLE EASTER EGG
  ============================================================ */
  console.log(
    '%c👋 Hey there, developer!',
    'font-size: 18px; font-weight: bold; color: #6c63ff;'
  );
  console.log(
    '%cLooking at my source code? I like your curiosity 😄\nLet\'s connect: vanshsaxena2007@outlook.com',
    'font-size: 13px; color: #9898b8;'
  );

})();
