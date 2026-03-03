async function loadVarieties() {
  const grid = document.querySelector('[data-varieties]');
  if (!grid) return;

  // ✅ Match the NEW varieties.html
  const searchInput = document.getElementById('varSearch');
  const stateSelect = document.getElementById('stateFilter');
  const countEl = document.getElementById('varCount');

  let allItems = [];

  try {
    const res = await fetch('data/varieties.json');
    if (!res.ok) throw new Error('Failed to fetch varieties.json');

    allItems = await res.json();

    populateStates(allItems);
    render(allItems);
    updateCount(allItems.length);

  } catch (e) {
    grid.innerHTML = '<p class="small">Could not load varieties data.</p>';
    if (countEl) countEl.textContent = '0 varieties';
    console.error('Varieties load error:', e);
    return;
  }

  /* ================= RENDER ================= */
  function render(items) {
    if (!items.length) {
      grid.innerHTML = '<p class="small">No varieties found.</p>';
      updateCount(0);
      return;
    }

    grid.innerHTML = items.map(v => `
      <article class="card variety">
        <img
          src="assets/images/${v.image}"
          alt="${escapeHtml(v.name)}"
          loading="lazy"
          decoding="async"
          onerror="this.onerror=null;this.src='assets/images/placeholder.png';"
        >

        <div>
          <div class="meta">
            <span class="badge">${escapeHtml(v.state)}</span>
            <span class="badge">Heat: ${escapeHtml(v.heat)}</span>
          </div>

          <h3 style="margin:0 0 8px">${escapeHtml(v.name)}</h3>

          <p class="kv"><b>Origin:</b> ${escapeHtml(v.origin)}</p>
          <p class="kv"><b>Color:</b> ${escapeHtml(v.color)}</p>
          <p class="kv"><b>Best uses:</b> ${escapeHtml(v.uses)}</p>

          <hr class="sep">

          <details>
            <summary>Authenticity story & traditional drying</summary>
            <p><b>Why premium:</b> ${escapeHtml(v.why)}</p>
            <p><b>Traditional drying:</b> ${escapeHtml(v.drying)}</p>
            <p><b>The story:</b> ${escapeHtml(v.story)}</p>
          </details>
        </div>
      </article>
    `).join('');

    updateCount(items.length);
  }

  /* ================= STATE DROPDOWN ================= */
  function populateStates(items) {
    if (!stateSelect) return;

    const states = [...new Set(items.map(i => i.state).filter(Boolean))].sort();

    stateSelect.innerHTML = `
      <option value="">All states</option>
      ${states.map(s => `<option value="${escapeAttr(s)}">${escapeHtml(s)}</option>`).join('')}
    `;
  }

  /* ================= FILTER LOGIC ================= */
  function applyFilters() {
    let filtered = [...allItems];

    const q = (searchInput?.value || '').toLowerCase().trim();
    const stateVal = stateSelect?.value || '';

    if (q) {
      filtered = filtered.filter(v => {
        const name = (v.name || '').toLowerCase();
        const origin = (v.origin || '').toLowerCase();
        const uses = (v.uses || '').toLowerCase();
        return name.includes(q) || origin.includes(q) || uses.includes(q);
      });
    }

    if (stateVal) {
      filtered = filtered.filter(v => v.state === stateVal);
    }

    render(filtered);
  }

  /* ================= COUNT ================= */
  function updateCount(n) {
    if (countEl) countEl.textContent = `${n} varieties`;
  }

  /* ================= HELPERS ================= */
  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function escapeAttr(str) {
    // attribute-safe
    return escapeHtml(str).replaceAll('`', '&#096;');
  }

  /* ================= EVENTS ================= */
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (stateSelect) stateSelect.addEventListener('change', applyFilters);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadVarieties);
