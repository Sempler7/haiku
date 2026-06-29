/* ==================== State ==================== */
let allLocales = [];

/* ==================== DOM refs ==================== */
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const empty = document.getElementById('empty');
const searchInput = document.getElementById('searchInput');
const countDisplay = document.getElementById('countDisplay');

/* ==================== Helpers ==================== */
function formatTime(timezone) {
  if (!timezone) return '—';
  try {
    return new Date().toLocaleTimeString('uk-UA', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    // Fallback: try to build Etc/GMT from UTC offset for territories without IANA timezone
    return '—';
  }
}

/* ==================== Render ==================== */
function renderLocales(locales) {
  if (!locales.length) {
    grid.innerHTML = '';
    grid.classList.remove('grid--visible');
    empty.classList.add('empty--visible');
    status.classList.remove('status--visible');
    countDisplay.textContent = '';
    return;
  }

  empty.classList.remove('empty--visible');
  grid.classList.add('grid--visible');

  grid.innerHTML = locales
    .map(l => {
      const time = formatTime(l.timezone);
      return `
        <article class="card">
          <div class="card__header">
            <span class="card__flag" style="background-image: url(https://flagcdn.com/24x18/${l.code.split('-').pop().toLowerCase()}.png)"></span>
            <span class="card__code">${l.code}</span>
          </div>
          <div class="card__name">${l.name}
            ${l.capital ? `<span class="card__capital">${l.capital}</span>` : ''}</div>
          <div class="card__details">
            <div class="card__detail" title="${l.language}">
              <span class="card__label">Мова</span>
              <span class="card__value">${l.language || '—'}</span>
            </div>
            <div class="card__detail" title="${l.currency}">
              <span class="card__label">Валюта</span>
              <span class="card__value">${l.currency || '—'}</span>
            </div>
            <div class="card__detail" title="${l.utcOffset}">
              <span class="card__label">UTC</span>
              <span class="card__value">${l.utcOffset || '—'}</span>
            </div>
            <div class="card__detail" title="${l.tld}">
              <span class="card__label">TLD</span>
              <span class="card__value">${l.tld || '—'}</span>
            </div>
            <div class="card__detail card__detail--time">
              🕐 <span class="card__value">${time}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  countDisplay.textContent = `${locales.length} / ${allLocales.length} локалей`;
}

function updateAllTimes() {
  const currentLocales = getFilteredLocales();
  if (currentLocales.length > 0 && currentLocales.length <= 60) {
    // Only live-update if manageable
    const items = grid.querySelectorAll('.card');
    currentLocales.forEach((l, i) => {
      const el = items[i]?.querySelector('.card__detail--time .card__value');
      if (el) el.textContent = formatTime(l.timezone);
    });
  }
}

function getFilteredLocales() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return allLocales;
  return allLocales.filter(l =>
    l.code.toLowerCase().includes(q) ||
    l.currency.toLowerCase().includes(q) ||
    l.name.toLowerCase().includes(q) ||
    l.capital.toLowerCase().includes(q) ||
    l.language.toLowerCase().includes(q) ||
    l.tld.toLowerCase().includes(q) ||
    l.utcOffset.toLowerCase().includes(q)
  );
}

/* ==================== Search ==================== */
let searchTimeout = null;

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const filtered = getFilteredLocales();
    renderLocales(filtered);
  }, 150);
}

/* ==================== Fetch ==================== */
async function loadLocales() {
  status.classList.remove('status--error');
  status.classList.add('status--visible');
  status.querySelector('span').textContent = 'Завантаження даних…';

  try {
    const res = await fetch('/api/locales');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allLocales = await res.json();
    status.classList.remove('status--visible');
    renderLocales(allLocales);
  } catch (err) {
    status.classList.add('status--error');
    status.querySelector('span').textContent = 'Помилка завантаження даних. Спробуйте оновити сторінку.';
    status.querySelector('.spinner')?.remove();
    grid.innerHTML = '';
    countDisplay.textContent = '';
    console.error('Failed to load locales:', err);
  }
}

/* ==================== Init ==================== */
searchInput.addEventListener('input', handleSearch);

// Live clock update every second
setInterval(() => {
  const visible = grid.querySelectorAll('.card').length;
  if (visible > 0 && visible <= 60) {
    updateAllTimes();
  }
}, 1000);

loadLocales();
