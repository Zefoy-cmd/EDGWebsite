// ErDuGamer – fælles script for alle sider

const CONSENT_KEY = 'edg-cookie-consent';
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_DAYS = 365;

/* ---------- Årstal i footer ---------- */

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* ---------- Mobilmenu ---------- */

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Sticky mobil-CTA ---------- */
// Skjules mens hero-CTA'en er synlig, og mens cookiebanneret er åbent.

const mobileCta = document.querySelector('.mobile-cta');
const heroCta = document.querySelector('[data-hero-cta]');
let heroCtaVisible = false;

function updateMobileCta() {
  if (!mobileCta) return;
  const bannerOpen = document.body.classList.contains('cookie-banner-open');
  mobileCta.classList.toggle('is-hidden', heroCtaVisible || bannerOpen);
}

if (mobileCta) {
  document.body.classList.add('has-mobile-cta');

  if (heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      heroCtaVisible = entry.isIntersecting;
      updateMobileCta();
    }).observe(heroCta);
  } else {
    updateMobileCta();
  }
}

/* ---------- Events med loading state ---------- */

const eventList = document.querySelector('[data-events]');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function renderSkeletons(count = 3) {
  eventList.setAttribute('aria-busy', 'true');
  eventList.innerHTML = Array.from({ length: count }, () => `
    <article class="card skeleton" aria-hidden="true">
      <div class="skeleton-line short"></div>
      <div class="skeleton-line title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line last"></div>
    </article>`).join('');
}

function renderMessage({ label, title, text, retry = false }) {
  eventList.innerHTML = `
    <div class="state-message">
      <p class="state-label">${escapeHtml(label)}</p>
      <p class="state-title">${escapeHtml(title)}</p>
      <p class="state-text">${escapeHtml(text)}</p>
      ${retry ? '<button type="button" class="button button-primary" data-retry>Prøv igen ↻</button>' : ''}
    </div>`;
}

async function loadEvents() {
  renderSkeletons();
  try {
    const response = await fetch('/events.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const events = await response.json();

    if (!Array.isArray(events) || events.length === 0) {
      renderMessage({
        label: 'Næste level loader …',
        title: 'Ingen events endnu',
        text: 'Der er ingen planlagte events lige nu – kig forbi igen snart, eller skriv til os med en idé.',
      });
      return;
    }

    eventList.innerHTML = events.map((event) => `
      <article class="card">
        <span class="event-tag">${escapeHtml(event.tag)}</span>
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.description)}</p>
        ${event.when ? `<p class="event-meta">▶ ${escapeHtml(event.when)}</p>` : ''}
      </article>`).join('');
  } catch (error) {
    console.error('Kunne ikke hente events:', error);
    renderMessage({
      label: 'Fejl · Forbindelsen røg',
      title: 'Lag spike!',
      text: 'Vi kunne ikke hente events lige nu.',
      retry: true,
    });
  } finally {
    eventList.setAttribute('aria-busy', 'false');
  }
}

if (eventList) {
  eventList.addEventListener('click', (event) => {
    const retry = event.target.closest('[data-retry]');
    if (retry) {
      retry.classList.add('is-loading');
      loadEvents();
    }
  });
  loadEvents();
}

/* ---------- Loading state på knapper der forlader siden ---------- */
// Giver feedback mens en side åbner.

document.querySelectorAll('[data-loading-on-click]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target === '_blank') return;
    link.classList.add('is-loading');
    link.setAttribute('aria-busy', 'true');
  });
});

// Nulstil knapper hvis brugeren navigerer tilbage (bfcache)
window.addEventListener('pageshow', () => {
  document.querySelectorAll('.is-loading').forEach((el) => {
    el.classList.remove('is-loading');
    el.removeAttribute('aria-busy');
  });
});

/* ---------- Cookiebanner ---------- */
// Samtykket gemmes i localStorage (nødvendig for at huske valget).
// Når der tilføjes statistik/marketing-scripts, så indlæs dem i
// onConsent() eller lyt på eventet 'edg:consent'.

function readConsent() {
  try {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY));
    if (!consent || consent.version !== CONSENT_VERSION) return null;
    const ageDays = (Date.now() - new Date(consent.date).getTime()) / 86400000;
    return ageDays > CONSENT_MAX_AGE_DAYS ? null : consent;
  } catch {
    return null;
  }
}

function saveConsent(choices) {
  const consent = {
    version: CONSENT_VERSION,
    date: new Date().toISOString(),
    necessary: true,
    statistics: Boolean(choices.statistics),
    marketing: Boolean(choices.marketing),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    /* privat browsing e.l. – valget gælder kun denne side */
  }
  onConsent(consent);
}

function onConsent(consent) {
  window.edgConsent = consent;
  document.dispatchEvent(new CustomEvent('edg:consent', { detail: consent }));

  // Eksempel:
  // if (consent.statistics) { /* indlæs statistik-script her */ }
}

const banner = document.createElement('section');
banner.className = 'cookie-banner';
banner.hidden = true;
banner.setAttribute('role', 'dialog');
banner.setAttribute('aria-labelledby', 'cookie-title');
banner.setAttribute('aria-describedby', 'cookie-desc');
banner.innerHTML = `
  <h2 id="cookie-title">Cookies</h2>
  <p id="cookie-desc">
    Vi bruger nødvendige cookies for at siden virker. Med dit samtykke vil vi også bruge
    cookies til statistik og marketing. Du kan altid ændre dit valg.
    Læs mere i vores <a href="/privatlivspolitik#cookies">privatlivspolitik</a>.
  </p>
  <fieldset class="cookie-options" hidden>
    <legend class="sr-only">Vælg cookies</legend>
    <label>
      <input type="checkbox" checked disabled />
      <span>Nødvendige <small>Får siden til at fungere og husker dit cookievalg. Kan ikke fravælges.</small></span>
    </label>
    <label>
      <input type="checkbox" name="statistics" />
      <span>Statistik <small>Hjælper os med at forstå, hvordan siden bruges.</small></span>
    </label>
    <label>
      <input type="checkbox" name="marketing" />
      <span>Marketing <small>Bruges til at vise relevant indhold og annoncer.</small></span>
    </label>
  </fieldset>
  <div class="cookie-actions">
    <button type="button" class="button button-secondary" data-cookie="reject">Kun nødvendige</button>
    <button type="button" class="button button-primary" data-cookie="accept">Accepter alle</button>
    <button type="button" class="button button-secondary" data-cookie="save" hidden>Gem valg</button>
    <button type="button" class="link-button" data-cookie="settings">Tilpas indstillinger</button>
  </div>`;

document.body.appendChild(banner);

const options = banner.querySelector('.cookie-options');
const saveButton = banner.querySelector('[data-cookie="save"]');
const settingsButton = banner.querySelector('[data-cookie="settings"]');

function openBanner({ showSettings = false } = {}) {
  const consent = readConsent();
  options.querySelector('[name="statistics"]').checked = Boolean(consent?.statistics);
  options.querySelector('[name="marketing"]').checked = Boolean(consent?.marketing);
  toggleSettings(showSettings);
  banner.hidden = false;
  document.body.classList.add('cookie-banner-open');
  updateMobileCta();
}

function closeBanner() {
  banner.hidden = true;
  document.body.classList.remove('cookie-banner-open');
  updateMobileCta();
}

function toggleSettings(show) {
  options.hidden = !show;
  saveButton.hidden = !show;
  settingsButton.hidden = show;
}

banner.addEventListener('click', (event) => {
  const action = event.target.closest('[data-cookie]')?.dataset.cookie;
  if (!action) return;

  if (action === 'settings') {
    toggleSettings(true);
    return;
  }
  if (action === 'accept') saveConsent({ statistics: true, marketing: true });
  if (action === 'reject') saveConsent({ statistics: false, marketing: false });
  if (action === 'save') {
    saveConsent({
      statistics: options.querySelector('[name="statistics"]').checked,
      marketing: options.querySelector('[name="marketing"]').checked,
    });
  }
  closeBanner();
});

document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
  button.addEventListener('click', () => openBanner({ showSettings: true }));
});

const existingConsent = readConsent();
if (existingConsent) {
  onConsent(existingConsent);
} else {
  openBanner();
}
