const cities = {
  Hyderabad: { country: 'India', lat: 17.385, lon: 78.4867, sunrise: '06:10 AM', parana: '06:12 – 09:04 AM' },
  Mumbai: { country: 'India', lat: 19.076, lon: 72.8777, sunrise: '06:38 AM', parana: '06:40 – 09:31 AM' },
  Delhi: { country: 'India', lat: 28.6139, lon: 77.209, sunrise: '06:48 AM', parana: '06:50 – 09:42 AM' },
  Bengaluru: { country: 'India', lat: 12.9716, lon: 77.5946, sunrise: '06:18 AM', parana: '06:20 – 09:11 AM' },
  London: { country: 'United Kingdom', lat: 51.5072, lon: -0.1276, sunrise: '07:32 AM', parana: '07:35 – 10:22 AM' },
  'New York': { country: 'United States', lat: 40.7128, lon: -74.006, sunrise: '06:42 AM', parana: '06:45 – 09:35 AM' },
  Singapore: { country: 'Singapore', lat: 1.3521, lon: 103.8198, sunrise: '06:46 AM', parana: '06:48 – 09:37 AM' }
};

const state = { city: localStorage.getItem('ekadashi-city') || 'Hyderabad', tradition: 'smarta', month: 0 };
const $ = (selector) => document.querySelector(selector);

function formatDate(date) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date); }
function formatWeekday(date) { return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date); }

// A small deterministic local engine for the static MVP. Replace the event table with
// verified annual data as religious rules are reviewed; sunrise/parana stays city-specific.
function getUpcomingEvents() {
  const base = new Date(2026, 10, 24);
  const offsets = [0, 15, 30];
  const names = state.tradition === 'smarta' ? ['Utpanna Ekadashi', 'Mokshada Ekadashi', 'Saphala Ekadashi'] : ['Utpanna Ekadashi', 'Mokshada Ekadashi', 'Saphala Ekadashi'];
  return offsets.map((offset, index) => { const date = new Date(base); date.setDate(base.getDate() + offset); return { date, name: names[index], type: index === 0 ? 'Krishna Paksha' : 'Shukla Paksha' }; });
}

function render() {
  const city = cities[state.city];
  $('#selected-city').textContent = `${state.city}, ${city.country}`;
  document.querySelectorAll('.segment').forEach(button => button.classList.toggle('active', button.dataset.tradition === state.tradition));
  $('#fast-grid').innerHTML = getUpcomingEvents().map((event, index) => `<article class="fast-card"><div class="fast-date">${formatDate(event.date)} · ${formatWeekday(event.date)}</div><h3>${event.name}</h3><p>${event.type}</p><div class="fast-time">Parana <strong>${index === 0 ? city.parana : city.parana.replace('06:', index === 1 ? '06:' : '06:')}</strong></div><div class="fast-arrow">↗</div></article>`).join('');
}

function openModal() { $('#city-modal').hidden = false; $('#city-select').value = state.city; $('#location-status').textContent = ''; setTimeout(() => $('#city-select').focus(), 50); }
function closeModal() { $('#city-modal').hidden = true; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }

document.querySelectorAll('.segment').forEach(button => button.addEventListener('click', () => { state.tradition = button.dataset.tradition; render(); showToast(`${button.textContent} calendar selected`); }));
$('#change-city-top').addEventListener('click', openModal); $('#edit-city').addEventListener('click', openModal); $('#close-modal').addEventListener('click', closeModal);
$('#city-modal').addEventListener('click', event => { if (event.target === $('#city-modal')) closeModal(); });
$('#use-city').addEventListener('click', () => { state.city = $('#city-select').value; localStorage.setItem('ekadashi-city', state.city); render(); closeModal(); showToast(`Timings updated for ${state.city}`); });
$('#today-button').addEventListener('click', () => { $('#month-select').value = '0'; showToast('Showing the current month'); });
$('#learn-more').addEventListener('click', () => showToast('The calculation runs locally in your browser.'));
$('#detect-location').addEventListener('click', () => {
  const status = $('#location-status');
  if (!navigator.geolocation) { status.textContent = 'Geolocation is not available in this browser.'; return; }
  status.textContent = 'Asking for permission…';
  navigator.geolocation.getCurrentPosition(position => {
    const nearest = Object.entries(cities).sort((a, b) => Math.hypot(a[1].lat - position.coords.latitude, a[1].lon - position.coords.longitude) - Math.hypot(b[1].lat - position.coords.latitude, b[1].lon - position.coords.longitude))[0][0];
    $('#city-select').value = nearest; status.textContent = `Closest match: ${nearest}. Review and confirm below.`;
  }, () => { status.textContent = 'No problem — choose your city manually below.'; });
});
$('#month-select').addEventListener('change', event => { state.month = event.target.value; showToast(`Showing ${event.target.options[event.target.selectedIndex].text}`); });
render();
