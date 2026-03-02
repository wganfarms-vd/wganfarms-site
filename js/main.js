async function loadVarieties() {
  const el = document.querySelector('[data-varieties]');
  if (!el) return;

  try {
    const res = await fetch('data/varieties.json');
    if (!res.ok) throw new Error('Failed to fetch varieties');

    const items = await res.json();

    el.innerHTML = items.map(v => `
      <article class="card variety">
        <img
          src="assets/images/${v.image}"
          alt="${v.name}"
          loading="lazy"
          decoding="async"
          onerror="this.src='assets/images/placeholder.png'"
        >

        <div>
          <div class="meta">
            <span class="badge">${v.state}</span>
            <span class="badge">Heat: ${v.heat}</span>
          </div>

          <h3 style="margin:0 0 8px">${v.name}</h3>

          <p class="kv"><b>Origin:</b> ${v.origin}</p>
          <p class="kv"><b>Color:</b> ${v.color}</p>
          <p class="kv"><b>Best uses:</b> ${v.uses}</p>

          <hr class="sep">

          <details>
            <summary>Authenticity story & traditional drying</summary>
            <p><b>Why premium:</b> ${v.why}</p>
            <p><b>Traditional drying:</b> ${v.drying}</p>
            <p><b>The story:</b> ${v.story}</p>
          </details>
        </div>
      </article>
    `).join('');

  } catch (e) {
    el.innerHTML = '<p class="small">Could not load varieties data.</p>';
    console.error('Varieties load error:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadVarieties);
