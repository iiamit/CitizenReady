import { openDB, getSetting, putSetting } from './utils/db.js';
import { loadMergedData } from './utils/storage.js';
import { checkForUpdates, updateAppliedThisSession } from './utils/updater.js';
import { render as renderOnboarding } from './views/onboarding.js';
import { render as renderDashboard } from './views/dashboard.js';
import { render as renderLesson } from './views/lesson.js';
import { render as renderDrill } from './views/drill.js';
import { render as renderProgress } from './views/progress.js';
import { render as renderSettings } from './views/settings.js';

const root = document.getElementById('app-root');

// ── Theme ──────────────────────────────────────────────────────────────────
async function applyTheme() {
  const settings = await getSetting('setup');
  const theme = settings?.theme ?? 'system';
  document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-system');
  document.documentElement.classList.add(`theme-${theme}`);
}

// ── Navigation ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { hash: '#dashboard', label: 'Home',     icon: homeIcon() },
  { hash: '#lesson',    label: 'Lesson',   icon: lessonIcon() },
  { hash: '#drill',     label: 'Drill',    icon: drillIcon() },
  { hash: '#progress',  label: 'Progress', icon: progressIcon() },
  { hash: '#settings',  label: 'Settings', icon: settingsIcon() },
];

function buildNav(activeHash) {
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav';
  bottomNav.setAttribute('aria-label', 'Main navigation');

  const topNav = document.createElement('nav');
  topNav.className = 'top-nav';
  const brand = document.createElement('span');
  brand.className = 'brand';
  brand.textContent = 'CitizenReady';
  topNav.appendChild(brand);

  NAV_ITEMS.forEach(item => {
    // Bottom nav button
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (activeHash === item.hash ? ' active' : '');
    btn.setAttribute('aria-label', item.label);
    btn.setAttribute('aria-current', activeHash === item.hash ? 'page' : 'false');
    btn.innerHTML = item.icon + `<span>${item.label}</span>`;
    btn.addEventListener('click', () => { window.location.hash = item.hash; });
    bottomNav.appendChild(btn);

    // Top nav button
    const topBtn = document.createElement('button');
    topBtn.className = 'nav-item' + (activeHash === item.hash ? ' active' : '');
    topBtn.setAttribute('aria-label', item.label);
    topBtn.textContent = item.label;
    topBtn.addEventListener('click', () => { window.location.hash = item.hash; });
    topNav.appendChild(topBtn);
  });

  return { bottomNav, topNav };
}

export function navigate(hash) {
  window.location.hash = hash;
}

// ── Router ─────────────────────────────────────────────────────────────────
async function route() {
  await applyTheme();

  const hash = window.location.hash || '#dashboard';
  const [base, param] = hash.split('/');

  const settings = await getSetting('setup');
  const onboardingDone = settings?.onboardingComplete === true;

  // Clear root
  root.innerHTML = '';

  if (!onboardingDone && base !== '#onboarding') {
    window.location.hash = '#onboarding';
    return;
  }

  if (base !== '#onboarding') {
    const { bottomNav, topNav } = buildNav(base);
    root.appendChild(topNav);

    const pageEl = document.createElement('main');
    pageEl.className = 'page';
    pageEl.id = 'main-content';

    switch (base) {
      case '#dashboard': await renderDashboard(pageEl); break;
      case '#lesson':    await renderLesson(pageEl, param); break;
      case '#drill':     await renderDrill(pageEl); break;
      case '#progress':  await renderProgress(pageEl, param); break;
      case '#settings':  await renderSettings(pageEl); break;
      default:           await renderDashboard(pageEl);
    }

    root.appendChild(pageEl);
    root.appendChild(bottomNav);

    if (updateAppliedThisSession) {
      const banner = document.createElement('div');
      banner.className = 'notification-banner';
      banner.textContent = 'Content updated to the latest version.';
      root.insertBefore(banner, root.firstChild);
      setTimeout(() => banner.remove(), 5000);
    }
  } else {
    await renderOnboarding(root);
  }

  // Footer on every page (except onboarding)
  if (base !== '#onboarding') {
    const footer = document.createElement('footer');
    footer.className = 'footer-disclaimer';
    footer.innerHTML = 'CitizenReady is an independent study tool. It is not affiliated with or endorsed by USCIS. Always verify current answers at <a href="https://www.uscis.gov" target="_blank" rel="noopener">uscis.gov</a> before your interview.';
    root.appendChild(footer);
  }
}

// ── Startup ─────────────────────────────────────────────────────────────────
async function init() {
  try {
    await openDB();
    await loadMergedData();
    // Non-blocking update check
    checkForUpdates().catch(() => {});
  } catch (e) {
    console.error('Startup error:', e);
  }

  document.getElementById('loading-shell')?.remove();
  await route();
}

window.addEventListener('hashchange', route);
// type="module" scripts run after DOMContentLoaded, so the DOM is already ready here
init();

// ── SVG icons ────────────────────────────────────────────────────────────────
function homeIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
}
function lessonIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
}
function drillIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
}
function progressIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
}
function settingsIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
}
