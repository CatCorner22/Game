(() => {
  const parts = ['./app.part1.js', './app.part2.js', './app.part3.js'];
  Promise.all(parts.map(async (path) => {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
    return response.text();
  }))
    .then((source) => (0, eval)(source.join('\n')))
    .catch((error) => {
      console.error('[THRESHOLD] startup failed', error);
      const app = document.getElementById('app');
      if (!app) return;
      const message = String(error?.message || error || 'Unknown startup error').replace(/[<>&]/g, '');
      app.innerHTML = `<main style="min-height:100dvh;display:grid;place-items:center;padding:24px;background:#020617;color:#eaf8ff;font-family:system-ui"><section style="width:min(560px,100%);border:1px solid #22d3ee55;border-radius:16px;padding:24px;background:#071529"><p style="color:#22d3ee;font:700 11px ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase">Startup recovery</p><h1>THRESHOLD could not initialize</h1><p style="color:#9eb4c7">One or more game assets were blocked or incomplete. Reset the local preview state and reload this exact build.</p><pre style="white-space:pre-wrap;overflow:auto;padding:12px;border-radius:10px;background:#020617;color:#f7a8bb">${message}</pre><button id="resetAndReload" style="width:100%;min-height:52px;border:0;border-radius:10px;background:#22d3ee;color:#021018;font-weight:900">Reset local state and reload</button></section></main>`;
      document.getElementById('resetAndReload')?.addEventListener('click', () => {
        try {
          for (const key of Object.keys(localStorage)) if (key.startsWith('threshold.portable.')) localStorage.removeItem(key);
        } catch {}
        location.reload();
      });
    });
})();
