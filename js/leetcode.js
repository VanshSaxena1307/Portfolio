/* ============================================
   VANSH SAXENA PORTFOLIO — LEETCODE.JS
   Uses LeetCode's official GraphQL API directly
   from the browser (no third-party proxy needed)
   ============================================ */

(function () {
  'use strict';

  const USERNAME = 'Vansh_Saxena_2007';

  /* DOM refs */
  const loadingEl = document.getElementById('lc-loading');
  const statsEl   = document.getElementById('lc-stats');
  const totalBox  = document.getElementById('lc-total-box');
  const errorEl   = document.getElementById('lc-error');
  const easyEl    = document.getElementById('lc-easy');
  const medEl     = document.getElementById('lc-med');
  const hardEl    = document.getElementById('lc-hard');
  const totalEl   = document.getElementById('lc-total');

  if (!loadingEl) return;

  /* ---- Count-up animation ---- */
  function animateCount(el, target, duration = 1000) {
    if (!target || target === 0) return;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Render stats ---- */
  function renderStats({ easy, medium, hard, total }) {
    loadingEl.style.display  = 'none';
    statsEl.style.display    = 'grid';
    totalBox.style.display   = 'block';
    errorEl.style.display    = 'none';

    easyEl.textContent  = '0';
    medEl.textContent   = '0';
    hardEl.textContent  = '0';
    totalEl.textContent = '0';

    animateCount(easyEl,  easy,   900);
    animateCount(medEl,   medium, 900);
    animateCount(hardEl,  hard,   900);
    animateCount(totalEl, total,  1100);
  }

  /* ---- Show error ---- */
  const refreshBtn = document.getElementById('lc-refresh');

  function showError(msg) {
    loadingEl.style.display  = 'none';
    statsEl.style.display    = 'none';
    totalBox.style.display   = 'none';
    errorEl.style.display    = 'block';
    if (refreshBtn) refreshBtn.style.display = 'block';
    errorEl.innerHTML = `
      <p style="margin-bottom:6px">⚠️ ${msg || 'Could not load stats.'}</p>
      <a href="https://leetcode.com/u/Vansh_Saxena_2007/" target="_blank"
         style="color:var(--accent2);font-size:0.78rem;text-decoration:underline;">
         View live profile →
      </a>`;
  }

  /* ============================================================
     METHOD 1 — LeetCode Official GraphQL (direct, no proxy)
     Works when LeetCode doesn't block the browser origin.
  ============================================================ */
  async function fetchGraphQL() {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }`;

    const res = await fetch('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username: USERNAME } }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
    const json = await res.json();

    const nums = json?.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!nums) throw new Error('GraphQL: unexpected shape');

    const get = (d) => nums.find(x => x.difficulty === d)?.count ?? 0;
    return {
      easy:   get('Easy'),
      medium: get('Medium'),
      hard:   get('Hard'),
      total:  get('All'),
    };
  }

  /* ============================================================
     METHOD 2 — alfa-leetcode-api (Render hosted, CORS-friendly)
  ============================================================ */
  async function fetchAlfa() {
    const res = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error(`Alfa HTTP ${res.status}`);
    const d = await res.json();

    /* Shape: { totalSolved, easySolved, mediumSolved, hardSolved } */
    if (typeof d.totalSolved === 'undefined') throw new Error('Alfa: bad shape');
    return {
      easy:   d.easySolved   ?? 0,
      medium: d.mediumSolved ?? 0,
      hard:   d.hardSolved   ?? 0,
      total:  d.totalSolved  ?? 0,
    };
  }

  /* ============================================================
     METHOD 3 — leetcode-stats-api.herokuapp.com
  ============================================================ */
  async function fetchHeroku() {
    const res = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${USERNAME}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error(`Heroku HTTP ${res.status}`);
    const d = await res.json();
    if (d.status === 'error') throw new Error('Heroku: ' + d.message);
    if (typeof d.totalSolved === 'undefined') throw new Error('Heroku: bad shape');
    return {
      easy:   d.easySolved   ?? 0,
      medium: d.mediumSolved ?? 0,
      hard:   d.hardSolved   ?? 0,
      total:  d.totalSolved  ?? 0,
    };
  }

  /* ============================================================
     METHOD 4 — leetcode.com/u/{username}/ scrape via allorigins proxy
     Last resort — fetches the public profile page HTML and
     parses the __NEXT_DATA__ JSON blob embedded in it.
  ============================================================ */
  async function fetchScrape() {
    const profileUrl = encodeURIComponent(`https://leetcode.com/${USERNAME}/`);
    const res = await fetch(
      `https://api.allorigins.win/get?url=${profileUrl}`,
      { signal: AbortSignal.timeout(12000) }
    );
    if (!res.ok) throw new Error(`Scrape proxy HTTP ${res.status}`);
    const json = await res.json();
    const html = json.contents ?? '';

    /* Extract __NEXT_DATA__ */
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) throw new Error('Scrape: __NEXT_DATA__ not found');

    const data = JSON.parse(match[1]);
    const nums =
      data?.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data
        ?.matchedUser?.submitStats?.acSubmissionNum
      ?? data?.props?.pageProps?.data?.matchedUser?.submitStats?.acSubmissionNum;

    if (!nums) throw new Error('Scrape: stats not in __NEXT_DATA__');

    const get = (d) => nums.find(x => x.difficulty === d)?.count ?? 0;
    return {
      easy:   get('Easy'),
      medium: get('Medium'),
      hard:   get('Hard'),
      total:  get('All'),
    };
  }

  /* ============================================================
     RUNNER — try all methods in order, cache result in
     sessionStorage so repeat visits don't re-fetch
  ============================================================ */
  const CACHE_KEY = 'lc_stats_vansh';
  const CACHE_TTL = 15 * 60 * 1000; /* 15 minutes */

  function loadFromCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL) return data;
    } catch (_) {}
    return null;
  }

  function saveToCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch (_) {}
  }

  async function loadStats() {
    /* Check session cache first */
    const cached = loadFromCache();
    if (cached) {
      renderStats(cached);
      return;
    }

    const methods = [
      { name: 'GraphQL',   fn: fetchGraphQL },
      { name: 'Alfa API',  fn: fetchAlfa    },
      { name: 'Heroku API',fn: fetchHeroku  },
      { name: 'Scrape',    fn: fetchScrape  },
    ];

    for (const { name, fn } of methods) {
      try {
        console.log(`[LeetCode] trying ${name}...`);
        const stats = await fn();
        console.log(`[LeetCode] ✅ ${name} succeeded:`, stats);
        saveToCache(stats);
        renderStats(stats);
        return;
      } catch (e) {
        console.warn(`[LeetCode] ❌ ${name} failed:`, e.message);
      }
    }

    showError('All fetch methods failed. LeetCode may be blocking requests.');
  }

  /* Small delay so page paint isn't blocked */
  setTimeout(loadStats, 600);

  /* ---- Refresh button (optional — add id="lc-refresh" anywhere) ---- */
  document.addEventListener('click', (e) => {
    if (e.target.id === 'lc-refresh') {
      sessionStorage.removeItem(CACHE_KEY);
      loadingEl.style.display  = 'flex';
      statsEl.style.display    = 'none';
      totalBox.style.display   = 'none';
      errorEl.style.display    = 'none';
      setTimeout(loadStats, 300);
    }
  });

})();
