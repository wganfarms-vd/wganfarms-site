async function loadVarieties() {
  const grid = document.querySelector('[data-varieties]');
  if (!grid) return;

  const searchInput = document.querySelector('[data-variety-search]');
  const stateSelect = document.querySelector('[data-variety-state]');
  const countEl = document.querySelector('[data-varieties-count]');

  let allItems = [];

  try {
    const res = await fetch('data/varieties.json');
    if (!res.ok) throw new Error('Failed to fetch varieties');

    allItems = await res.json();

    render(allItems);
    populateStates(allItems);

  } catch (e) {
    grid.innerHTML = '<p class="small">Could not load varieties data.</p>';
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

    updateCount(items.length);
  }

  /* ================= STATE DROPDOWN ================= */
  function populateStates(items) {
    if (!stateSelect) return;

    const states = [...new Set(items.map(i => i.state))].sort();

    stateSelect.innerHTML = `
      <option value="">All States</option>
      ${states.map(s => `<option value="${s}">${s}</option>`).join('')}
    `;
  }

  /* ================= FILTER LOGIC ================= */
  function applyFilters() {
    let filtered = [...allItems];

    const searchVal = searchInput?.value?.toLowerCase().trim() || '';
    const stateVal = stateSelect?.value || '';

    // search filter
    if (searchVal) {
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(searchVal) ||
        v.origin.toLowerCase().includes(searchVal) ||
        v.uses.toLowerCase().includes(searchVal)
      );
    }

    // state filter
    if (stateVal) {
      filtered = filtered.filter(v => v.state === stateVal);
    }

    render(filtered);
  }

  /* ================= COUNT ================= */
  function updateCount(n) {
    if (countEl) {
      countEl.textContent = `${n} varieties`;
    }
  }

  /* ================= EVENTS ================= */
  searchInput?.addEventListener('input', applyFilters);
  stateSelect?.addEventListener('change', applyFilters);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', loadVarieties);
