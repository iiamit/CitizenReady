import { getSetting, putSetting } from '../utils/db.js';
import { computeReadinessScore, readinessBand, getStreakDays, getDueCardCount } from '../utils/readiness.js';
import { getNextCategory, CATEGORIES } from '../utils/scheduler.js';
import { getAllQuestions, getAllCategories } from '../utils/db.js';
import { getQuestionsForCategory } from '../utils/storage.js';
import { isWeb } from '../utils/platform.js';

export async function render(el) {
  const settings = (await getSetting('setup')) ?? {};
  const exemption = settings.exemption65_20 ?? false;
  const state = settings.state ?? '';
  const interviewDate = settings.interviewDate ?? null;

  const [readiness, streak, nextCat, dbQuestions, dbCategories] = await Promise.all([
    computeReadinessScore(exemption),
    getStreakDays(),
    getNextCategory(exemption),
    getAllQuestions(),
    getAllCategories(),
  ]);

  const score = readiness.score;
  const qMap = Object.fromEntries(dbQuestions.map(q => [q.id, q]));
  const dueCount = getDueCardCount(qMap, exemption);
  const band = readinessBand(score);

  // Weak questions
  const weak = dbQuestions.filter(q => q.introduced && ((q.easeFactor ?? 2.5) < 1.5 || (q.missCount ?? 0) >= 2));

  // Pacing
  let pacingHtml = '';
  if (interviewDate) {
    const daysLeft = Math.ceil((new Date(interviewDate + 'T12:00:00') - Date.now()) / (1000 * 60 * 60 * 24));
    const dbCatMap = Object.fromEntries(dbCategories.map(c => [c.id, c]));
    const cats = exemption ? CATEGORIES.filter(c => getQuestionsForCategory(c.id, true).length > 0) : CATEGORIES;
    const unstartedCount = cats.filter(c => !dbCatMap[c.id]?.lessonStarted).length;
    if (daysLeft > 0) {
      pacingHtml = `
        <div class="pacing-alert">
          <strong>Interview in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong>
          ${unstartedCount > 0 ? ` — Cover ${unstartedCount} more categor${unstartedCount !== 1 ? 'ies' : 'y'} to stay on pace.` : ' — You are fully on pace! 🎉'}
        </div>
      `;
    } else if (daysLeft === 0) {
      pacingHtml = `<div class="pacing-alert"><strong>Your interview is today!</strong> Good luck. 🍀</div>`;
    }
  }

  // PWA install prompt (web only, not shown on Capacitor)
  const installDismissed = await getSetting('pwa_install_dismissed');
  const showInstallPrompt = isWeb() && window._deferredInstallPrompt && !installDismissed;

  el.innerHTML = `
    ${showInstallPrompt ? `
    <div class="install-banner fade-in" id="install-banner">
      <div style="font-size:28px;" aria-hidden="true">📱</div>
      <div class="install-banner-text">
        <div class="install-banner-title">Add CitizenReady to your home screen</div>
        <div class="install-banner-sub">Study offline, anytime.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">
        <button class="btn btn-primary" id="install-cta" style="padding:6px 14px;font-size:13px;">Install</button>
        <button class="btn btn-ghost" id="install-dismiss" style="padding:4px 8px;font-size:12px;">Not now</button>
      </div>
    </div>
    ` : ''}
    <div class="dashboard-header fade-in stagger-1">
      <div class="streak-block" aria-label="${streak} day study streak">
        <span class="streak-icon" aria-hidden="true">🔥</span>
        <span>${streak}-day streak</span>
      </div>
      <div class="readiness-block">
        ${gaugeHTML(score, band)}
      </div>
    </div>

    ${pacingHtml}

    <div class="action-cards fade-in stagger-2">
      <div class="action-card">
        <div class="card-title">Today's Lesson</div>
        <div class="card-subject">${nextCat ? nextCat.name : 'All categories complete'}</div>
        <div class="card-meta">${nextCat ? `${getQuestionsForCategory(nextCat.id, exemption).length} questions` : ''}</div>
        <button class="btn btn-primary btn-full" id="start-lesson-btn" ${!nextCat ? 'disabled' : ''}>
          Start Lesson
        </button>
      </div>
      <div class="action-card">
        <div class="card-title">Today's Drill</div>
        <div class="card-subject">${dueCount > 0 ? `${dueCount} cards due` : 'No cards due'}</div>
        <div class="card-meta">${dueCount > 0 ? 'Flashcard review' : 'Check back tomorrow'}</div>
        <button class="btn btn-primary btn-full" id="start-drill-btn" ${dueCount === 0 ? 'disabled' : ''}>
          Start Drill
        </button>
      </div>
    </div>

    ${weak.length > 0 ? `
    <div class="card fade-in stagger-3" style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <div class="label">Weak Areas</div>
          <div style="font-weight:700;margin-top:2px;">${weak.length} question${weak.length !== 1 ? 's' : ''} need review</div>
        </div>
        <a href="#progress" class="btn btn-ghost" style="flex-shrink:0;padding:8px 14px;font-size:13px;">Review Now</a>
      </div>
    </div>
    ` : ''}

    <h2 style="font-size:16px;font-weight:700;margin:20px 0 10px;" class="fade-in stagger-4">Categories</h2>
    <div class="category-grid fade-in stagger-5" id="category-grid"></div>
  `;

  // Category grid
  const grid = el.querySelector('#category-grid');
  const dbCatMap = Object.fromEntries(dbCategories.map(c => [c.id, c]));
  const cats = exemption ? CATEGORIES.filter(c => getQuestionsForCategory(c.id, true).length > 0) : CATEGORIES;

  cats.forEach(cat => {
    const dbCat = dbCatMap[cat.id];
    const mastery = dbCat?.masteryScore ?? 0;
    const status = !dbCat?.lessonStarted ? 'Not Started' : mastery >= 0.8 ? 'Mastered' : 'In Progress';
    const chipClass = status === 'Mastered' ? 'chip-green' : status === 'In Progress' ? 'chip-amber' : 'chip-neutral';

    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${cat.name} — ${status}`);
    card.innerHTML = `
      <span class="cat-icon" aria-hidden="true">${cat.icon}</span>
      <div class="cat-name">${cat.name}</div>
      <div class="mastery-bar"><div class="mastery-bar-fill" style="width:${Math.round(mastery*100)}%"></div></div>
      <span class="chip ${chipClass}">${status}</span>
    `;
    card.addEventListener('click', () => { window.location.hash = `#lesson/${cat.id}`; });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
    grid.appendChild(card);
  });

  el.querySelector('#start-lesson-btn')?.addEventListener('click', () => {
    window.location.hash = nextCat ? `#lesson/${nextCat.id}` : '#lesson';
  });
  el.querySelector('#start-drill-btn')?.addEventListener('click', () => {
    window.location.hash = '#drill';
  });

  // PWA install handlers
  el.querySelector('#install-cta')?.addEventListener('click', async () => {
    const prompt = window._deferredInstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') window._deferredInstallPrompt = null;
    el.querySelector('#install-banner')?.remove();
  });
  el.querySelector('#install-dismiss')?.addEventListener('click', async () => {
    await putSetting('pwa_install_dismissed', true);
    el.querySelector('#install-banner')?.remove();
  });

  // Animate gauge arc
  requestAnimationFrame(() => animateGauge(el, score, band));
}

function gaugeHTML(score, band) {
  const r = 70, cx = 90, cy = 90;
  const circumference = Math.PI * r;
  return `
    <div class="gauge-wrap" aria-label="Readiness score: ${score}%">
      <svg width="180" height="100" viewBox="0 0 180 100" role="img" aria-hidden="true">
        <path d="M20,90 A70,70 0 0,1 160,90" fill="none" stroke="var(--color-neutral-200)" stroke-width="12" stroke-linecap="round"/>
        <path id="gauge-arc" d="M20,90 A70,70 0 0,1 160,90" fill="none" stroke="${band.color}" stroke-width="12" stroke-linecap="round"
          stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" />
      </svg>
      <div class="gauge-score" style="margin-top:-12px;">${score}%</div>
      <div class="gauge-label">${band.label}</div>
    </div>
  `;
}

function animateGauge(el, score, band) {
  const arc = el.querySelector('#gauge-arc');
  if (!arc) return;
  const r = 70;
  const circumference = Math.PI * r;
  const target = circumference * (1 - score / 100);
  arc.style.transition = 'stroke-dashoffset 0.8s ease-out';
  arc.style.strokeDashoffset = target;
}
