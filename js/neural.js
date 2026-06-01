/* ============================================
   VANSH SAXENA PORTFOLIO — NEURAL.JS
   Animated neural network canvas background
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('neural');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animFrame;
  let W, H;

  /* ---- Config ---- */
  const CONFIG = {
    nodeCount: 65,
    maxDist: 160,
    nodeSpeed: 0.38,
    nodeRadius: { min: 1, max: 2.2 },
    lineOpacityMax: 0.14,
    nodeColor: '108, 99, 255',
    accentColor: '56, 189, 248',
    pulseInterval: 2200,
  };

  /* ---- Resize ---- */
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ---- Init nodes ---- */
  function initNodes() {
    nodes = [];
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * CONFIG.nodeSpeed,
        vy: (Math.random() - 0.5) * CONFIG.nodeSpeed,
        r: Math.random() * (CONFIG.nodeRadius.max - CONFIG.nodeRadius.min) + CONFIG.nodeRadius.min,
        pulse: 0,
        color: Math.random() > 0.85 ? CONFIG.accentColor : CONFIG.nodeColor,
      });
    }
  }

  /* ---- Draw ---- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Update positions */
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      if (n.pulse > 0) n.pulse -= 0.02;
    });

    /* Draw edges */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * CONFIG.lineOpacityMax;
          const boost = Math.max(a.pulse, b.pulse) * 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.color}, ${alpha + boost})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    /* Draw nodes */
    nodes.forEach(n => {
      const r = n.r + n.pulse * 3;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color}, ${0.5 + n.pulse * 0.4})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  /* ---- Random pulse trigger ---- */
  function triggerPulse() {
    const idx = Math.floor(Math.random() * nodes.length);
    if (nodes[idx]) nodes[idx].pulse = 1;
    setTimeout(triggerPulse, CONFIG.pulseInterval + Math.random() * 1000);
  }

  /* ---- Mouse interaction ---- */
  let mouse = { x: -999, y: -999 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    nodes.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        n.vx += (dx / dist) * 0.06;
        n.vy += (dy / dist) * 0.06;
        /* Cap speed */
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > CONFIG.nodeSpeed * 3) {
          n.vx = (n.vx / speed) * CONFIG.nodeSpeed * 3;
          n.vy = (n.vy / speed) * CONFIG.nodeSpeed * 3;
        }
      }
    });
  });

  /* ---- Visibility API: pause when tab hidden ---- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      draw();
    }
  });

  /* ---- Init ---- */
  resize();
  initNodes();
  draw();
  setTimeout(triggerPulse, 1000);

  window.addEventListener('resize', () => {
    resize();
    initNodes();
  });
})();
