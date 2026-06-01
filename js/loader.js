/* ============================================
   VANSH SAXENA PORTFOLIO — LOADER.JS
   Premium loading screen with progress bar
   ============================================ */

(function () {
  'use strict';

  const MESSAGES = [
    'Initializing Portfolio...',
    'Loading Projects...',
    'Preparing Experience...',
    'Launching Developer Journey...',
    'Welcome, Recruiter! 🚀',
  ];

  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loader-bar');
  const pct     = document.getElementById('loader-pct');
  const msgEl   = document.getElementById('loader-msg');

  if (!loader) return;

  let progress  = 0;
  let msgIndex  = 0;

  /* Simulate loading progress */
  const interval = setInterval(() => {
    const increment = Math.random() * 14 + 4;
    progress = Math.min(progress + increment, 100);

    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';

    /* Cycle through messages */
    const newIndex = Math.min(Math.floor(progress / 22), MESSAGES.length - 1);
    if (newIndex !== msgIndex) {
      msgIndex = newIndex;
      msgEl.style.opacity = '0';
      setTimeout(() => {
        msgEl.textContent = MESSAGES[msgIndex];
        msgEl.style.opacity = '1';
      }, 150);
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(hideLoader, 450);
    }
  }, 110);

  function hideLoader() {
    loader.classList.add('fade-out');
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 900);
  }

  /* Prevent scroll during loading */
  document.body.style.overflow = 'hidden';

  /* Fallback: force hide after 5s in case of any hang */
  setTimeout(() => {
    if (document.getElementById('loader')) {
      clearInterval(interval);
      hideLoader();
    }
  }, 5000);
})();
