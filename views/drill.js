import { getSetting, getQuestion as getDBQuestion, putQuestion, getAllQuestions, logSession } from '../utils/db.js';
import { getQuestions, resolveAnswer } from '../utils/storage.js';
import { applyRating, defaultRecord, isDue } from '../utils/srs.js';
import { CATEGORIES } from '../utils/scheduler.js';

const SESSION_TARGET = 20; // max cards per session
let touchStartX = 0, touchStartY = 0;

export async function render(el) {
  const settings = (await getSetting('setup')) ?? {};
  const stateCode = settings.state ?? '';
  const exemption = settings.exemption65_20 ?? false;

  const allQ = getQuestions();
  const pool = exemption ? allQ.filter(q => q.starred65_20) : allQ;

  const dbQuestions = await getAllQuestions();
  const qMap = Object.fromEntries(dbQuestions.map(q => [q.id, q]));

  // Build due card queue
  const introduced = pool.filter(q => qMap[q.id]?.introduced);

  if (!introduced.length) {
    el.innerHTML = `
      <div class="card fade-in" style="margin-top:32px;text-align:center;padding:40px 24px;">
        <div style="font-size:48px;margin-bottom:12px;">📖</div>
        <h2 style="font-family:var(--font-display);margin-bottom:8px;">Complete your first lesson to unlock flashcard drills.</h2>
        <p style="color:var(--color-text-secondary);margin-bottom:24px;">You need to study at least one lesson before you can drill.</p>
        <a href="#lesson" class="btn btn-primary">Start a Lesson →</a>
      </div>
    `;
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  // Force-insert answer-updated flagged cards
  const updatedCards = introduced.filter(q => qMap[q.id]?.answerUpdatedFlag);
  const dueCards = introduced.filter(q => !qMap[q.id]?.answerUpdatedFlag && (qMap[q.id]?.nextReviewDate ?? '1970-01-01') <= today);

  let queue = [...updatedCards, ...dueCards].slice(0, SESSION_TARGET);

  if (!queue.length) {
    el.innerHTML = `
      <div class="card fade-in" style="margin-top:32px;text-align:center;padding:40px 24px;">
        <div style="font-size:48px;margin-bottom:12px;">✅</div>
        <h2 style="font-family:var(--font-display);margin-bottom:8px;">No cards due today!</h2>
        <p style="color:var(--color-text-secondary);margin-bottom:24px;">You're all caught up. Come back tomorrow for your next review session.</p>
        <a href="#dashboard" class="btn btn-secondary">Back to Dashboard</a>
      </div>
    `;
    return;
  }

  // Session state
  let sessionQueue = [...queue];
  let currentIdx = 0;
  let sessionResults = { gotit: 0, almost: 0, missed: 0 };
  let missedThisSession = new Set();
  let isFlipped = false;
  const sessionStart = Date.now();
  const totalCards = sessionQueue.length;

  function getCurrentCard() { return sessionQueue[currentIdx]; }

  async function showCard() {
    if (currentIdx >= sessionQueue.length) {
      await showSessionEnd();
      return;
    }
    isFlipped = false;
    const q = getCurrentCard();
    const dbRec = qMap[q.id] ?? defaultRecord(q.id);
    const answers = resolveAnswer(q, stateCode);

    const hasUpdate = dbRec.answerUpdatedFlag;

    el.innerHTML = `
      <div style="padding:16px 0;">
        <div class="session-progress">
          <div class="session-progress-bar">
            <div class="session-progress-fill" style="width:${Math.round((currentIdx / Math.max(sessionQueue.length,1)) * 100)}%"></div>
          </div>
          <span class="session-progress-label">Card ${currentIdx + 1} of ${sessionQueue.length}</span>
        </div>

        ${hasUpdate ? `<div class="notification-banner" style="border-radius:8px;margin-bottom:12px;font-size:13px;">⚠️ Answer updated — review the new answer below</div>` : ''}

        <div class="flashcard-scene" id="flashcard-scene" tabindex="0" role="button"
          aria-label="Flashcard — click or press Enter to reveal answer">
          <div class="flashcard" id="flashcard">
            <div class="flashcard-face flashcard-front">
              <div class="card-meta">
                <span class="label">${getCategoryName(q.category)}</span>
                <span style="display:flex;align-items:center;gap:6px;">
                  ${q.starred65_20 ? '<span class="star-badge" aria-label="Starred">★</span>' : ''}
                  <span class="label">Q.${String(q.number).padStart(3,'0')}</span>
                </span>
              </div>
              <div class="flashcard-question">${q.question}</div>
              <div class="flip-hint" aria-hidden="true">Tap to reveal answer</div>
            </div>
            <div class="flashcard-face flashcard-back" aria-live="polite">
              <div class="card-meta">
                <span class="label">${getCategoryName(q.category)}</span>
                <span class="label">Q.${String(q.number).padStart(3,'0')}</span>
              </div>
              <div class="flashcard-answer">${answers.join('<br>')}</div>
              <div class="flashcard-context">${q.context ? q.context.split('.')[0] + '.' : ''}</div>
              ${q.stateSpecific ? `<div class="verify-link" style="margin-top:8px;"><a href="https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates" target="_blank" rel="noopener">Verify at uscis.gov</a></div>` : ''}
            </div>
          </div>
        </div>

        <div id="rating-buttons" style="display:none;">
          <div class="rating-buttons">
            <button class="btn btn-error" id="missed-btn" aria-label="Missed it">Missed it</button>
            <button class="btn btn-warning" id="almost-btn" aria-label="Almost">Almost</button>
            <button class="btn btn-success" id="gotit-btn" aria-label="Got it">Got it</button>
          </div>
        </div>
      </div>
    `;

    const scene = el.querySelector('#flashcard-scene');
    const card = el.querySelector('#flashcard');
    const ratingButtons = el.querySelector('#rating-buttons');

    function flip() {
      if (isFlipped) return;
      isFlipped = true;
      card.classList.add('flipped');
      ratingButtons.style.display = 'block';
      scene.setAttribute('aria-label', 'Flashcard flipped — rate yourself using the buttons below');
    }

    scene.addEventListener('click', flip);
    scene.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });

    // Swipe support
    scene.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    scene.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 60 && Math.abs(dy) < 60) { flip(); return; }
      if (!isFlipped) { flip(); return; }
      if (Math.abs(dx) > 60 && Math.abs(dy) < Math.abs(dx)) {
        rate(dx > 0 ? 'gotit' : 'missed');
      } else if (dy < -60) {
        rate('almost');
      }
    }, { passive: true });

    async function rate(rating) {
      sessionResults[rating]++;
      const dbRec = qMap[q.id] ?? defaultRecord(q.id);
      const updated = applyRating(dbRec, rating);

      // Clear answer-updated flag if seen
      if (dbRec.answerUpdatedFlag) {
        updated.answerUpdatedFlag = false;
      }

      await putQuestion(updated);
      qMap[q.id] = updated; // update in-memory

      if (rating === 'missed' && !missedThisSession.has(q.id)) {
        missedThisSession.add(q.id);
        // Re-queue at end of session
        sessionQueue.push(q);
      }

      currentIdx++;
      await showCard();
    }

    el.querySelector('#gotit-btn')?.addEventListener('click', () => rate('gotit'));
    el.querySelector('#almost-btn')?.addEventListener('click', () => rate('almost'));
    el.querySelector('#missed-btn')?.addEventListener('click', () => rate('missed'));
  }

  async function showSessionEnd() {
    const duration = Math.round((Date.now() - sessionStart) / 1000);
    const reviewed = currentIdx;
    const correctPct = reviewed > 0 ? Math.round((sessionResults.gotit / reviewed) * 100) : 0;

    await logSession({
      type: 'drill',
      durationSeconds: duration,
      cardsReviewed: Math.min(reviewed, totalCards),
      correctPct: correctPct / 100,
    });

    const { getStreakDays } = await import('../utils/readiness.js');
    const streak = await getStreakDays();

    const missedQs = [...missedThisSession].map(id => queue.find(q => q.id === id)).filter(Boolean);

    // Confetti for good sessions
    if (correctPct >= 80 && reviewed >= 5) {
      import('https://cdn.jsdelivr.net/npm/canvas-confetti@1/dist/confetti.module.mjs')
        .then(m => { m.default({ particleCount: 60, spread: 60, colors: ['#C8102E','#FFFFFF','#1A3A5C'] }); })
        .catch(() => {});
    }

    el.innerHTML = `
      <div style="padding:16px 0;">
        <div class="completion-card fade-in">
          <div class="completion-badge" aria-hidden="true">${correctPct >= 80 ? '🌟' : correctPct >= 60 ? '👍' : '💪'}</div>
          <h2 class="completion-title">Drill Complete!</h2>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:20px 0;">
            <div style="text-align:center;">
              <div style="font-size:26px;font-weight:700;color:var(--color-primary);">${Math.min(reviewed, totalCards)}</div>
              <div class="label">Cards reviewed</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:26px;font-weight:700;color:${correctPct >= 75 ? 'var(--color-success)' : 'var(--color-warning)'};">${correctPct}%</div>
              <div class="label">Correct</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:26px;font-weight:700;color:var(--color-primary);">🔥 ${streak}</div>
              <div class="label">Day streak</div>
            </div>
          </div>

          ${missedQs.length ? `
            <div style="text-align:left;margin-bottom:20px;">
              <div class="label" style="margin-bottom:8px;">Weakest cards today:</div>
              ${missedQs.map(q => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--color-border);gap:8px;">
                  <div style="font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${q.question}</div>
                  <a href="#lesson/${q.category}" style="font-size:12px;color:var(--color-primary);flex-shrink:0;">Review in lesson</a>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <a href="#dashboard" class="btn btn-primary btn-full">Done for today →</a>
        </div>
      </div>
    `;
  }

  await showCard();
}

function getCategoryName(id) {
  return CATEGORIES.find(c => c.id === id)?.name ?? id;
}
