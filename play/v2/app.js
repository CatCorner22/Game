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
      if (app) app.innerHTML = `<section class="shell"><article class="panel" style="padding:20px"><p class="eyebrow">Startup error</p><h2 style="margin-top:8px">THRESHOLD could not load</h2><p class="muted">Refresh the page. If the problem persists, open the newest playable link.</p></article></section>`;
    });
})();
