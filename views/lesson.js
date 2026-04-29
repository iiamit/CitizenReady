import { getSetting, getQuestion as getDBQuestion, putQuestion, getCategory, putCategory, logSession } from '../utils/db.js';
import { getQuestionsForCategory, getQuestion, resolveAnswer } from '../utils/storage.js';
import { CATEGORIES, ensureCategoryRecord, computeMastery } from '../utils/scheduler.js';
import { defaultRecord } from '../utils/srs.js';
import { getAllQuestions } from '../utils/db.js';
import { getVisual } from '../data/visuals.js';
import { t, getCurrentLocale } from '../utils/i18n.js';
import { getAudioUrl } from '../data/audio-manifest.js';

const KC_QUESTION_COUNT = 4;

export async function render(el, categoryId) {
  const settings = (await getSetting('setup')) ?? {};
  const stateCode = settings.state ?? '';
  const exemption = settings.exemption65_20 ?? false;

  // Determine category
  let cat;
  if (categoryId) {
    cat = CATEGORIES.find(c => c.id === categoryId);
  }
  if (!cat) {
    const { getNextCategory } = await import('../utils/scheduler.js');
    cat = await getNextCategory(exemption);
  }

  if (!cat) {
    el.innerHTML = `<div class="card" style="margin-top:24px;text-align:center;padding:32px;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h2 style="font-family:var(--font-display);">All lessons complete!</h2>
      <p style="color:var(--color-text-secondary);margin-top:8px;">You've covered every category. Keep drilling to maintain mastery.</p>
      <a href="#drill" class="btn btn-primary" style="margin-top:20px;display:inline-flex;">Go to Drill</a>
    </div>`;
    return;
  }

  const catRecord = await ensureCategoryRecord(cat.id);
  const questions = getQuestionsForCategory(cat.id, exemption);

  if (!questions.length) {
    el.innerHTML = `<div class="card" style="margin-top:24px;text-align:center;">No questions found for this category.</div>`;
    return;
  }

  // Session state
  let cardIndex = catRecord.currentCardIndex ?? 0;
  if (cardIndex >= questions.length) cardIndex = 0;
  let phase = 'intro'; // intro | learning | visual | kc | summary
  let kcIndex = 0;
  let kcQuestions = [];
  let kcResults = [];
  const sessionStart = Date.now();
  let activeAudioEl = null; // tracks current CDN audio so navigation can stop it

  function getPhase() { return phase; }

  async function showIntro() {
    phase = 'intro';
    el.innerHTML = `
      <div style="padding:16px 0;">
        <a href="#dashboard" style="font-size:13px;color:var(--color-text-secondary);">${t('btn.back')}</a>
        <div class="card fade-in" style="margin-top:16px;text-align:center;padding:32px 24px;">
          <div style="font-size:56px;margin-bottom:12px;" aria-hidden="true">${cat.icon}</div>
          <h1 style="font-family:var(--font-display);font-size:26px;margin-bottom:12px;">${cat.name}</h1>
          <p style="color:var(--color-text-secondary);font-size:15px;line-height:1.6;max-width:340px;margin:0 auto 24px;">
            ${getCategoryIntro(cat.id)}
          </p>
          <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:24px;">
            ${questions.length} question${questions.length !== 1 ? 's' : ''} in this category
            ${exemption ? ' · Starred questions only' : ''}
          </div>
          <button class="btn btn-primary btn-lg btn-full" id="start-learning-btn">${t('lesson.start')}</button>
        </div>
      </div>
    `;
    el.querySelector('#start-learning-btn').addEventListener('click', () => showLearningCard());
    // Mark lesson started
    if (!catRecord.lessonStarted) {
      catRecord.lessonStarted = true;
      await putCategory(catRecord);
    }
  }

  async function showLearningCard() {
    phase = 'learning';
    // Stop any audio still playing from the previous card
    speechSynthesis.cancel();
    if (activeAudioEl) { activeAudioEl.pause(); activeAudioEl.currentTime = 0; activeAudioEl = null; }
    if (cardIndex >= questions.length) {
      await showVisual();
      return;
    }

    const q = questions[cardIndex];
    const answers = resolveAnswer(q, stateCode);
    const qDBRecord = (await getDBQuestion(q.id)) ?? defaultRecord(q.id);

    el.innerHTML = `
      <div style="padding:16px 0;">
        <div class="session-progress">
          <div class="session-progress-bar">
            <div class="session-progress-fill" style="width:${Math.round((cardIndex / questions.length) * 100)}%"></div>
          </div>
          <span class="session-progress-label">Card ${cardIndex + 1} of ${questions.length}</span>
        </div>

        <div class="learning-card fade-in">
          <div class="q-meta">
            <span class="label">${cat.name}</span>
            <span style="display:flex;align-items:center;gap:6px;">
              ${q.starred65_20 ? '<span class="star-badge" aria-label="Starred for 65/20 exemption" title="Starred for 65/20 exemption">★</span>' : ''}
              <span class="label">Q.${String(q.number).padStart(3,'0')}</span>
              ${(getAudioUrl(q.number, getCurrentLocale()) || 'speechSynthesis' in window) ? `<button class="audio-btn" id="lesson-audio-btn" aria-label="${t('lesson.audio.play')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>` : ''}
            </span>
          </div>

          <div class="q-text">${q.question}</div>
          <hr class="divider">
          <div class="answer-label">${answers.length > 1 ? t('lesson.answers') : t('lesson.answer')}:</div>
          ${answers.map(a => `<div class="answer-text">${a}</div>`).join('')}

          ${q.context ? `
            <div class="section-label">${t('lesson.why')}</div>
            <div class="context-text">${q.context}</div>
          ` : ''}

          ${q.memoryTip ? `
            <div class="section-label">${t('lesson.tip')}</div>
            <div class="memory-tip">${q.memoryTip}</div>
          ` : ''}

          ${q.stateSpecific ? `
            <div class="verify-link" style="margin-top:12px;">
              ${t('state.specific')} <a href="https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates" target="_blank" rel="noopener">${t('verify.uscis')}</a>
            </div>
          ` : ''}
        </div>

        <div style="display:flex;gap:10px;margin-top:16px;">
          ${cardIndex > 0 ? `<button class="btn btn-ghost" id="prev-btn" style="flex:1;">${t('btn.prev')}</button>` : ''}
          <button class="btn btn-secondary btn-full" id="next-card-btn">${t('btn.next')}</button>
        </div>
      </div>
    `;

    // Audio player — tries USCIS CDN, falls back to Web Speech API
    const lessonAudioBtn = el.querySelector('#lesson-audio-btn');
    if (lessonAudioBtn) {
      const playIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      const stopIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      const audioUrl = getAudioUrl(q.number, getCurrentLocale());
      let audioEl = null;
      let usingSpeech = false;

      function resetBtn() {
        lessonAudioBtn.classList.remove('playing');
        lessonAudioBtn.innerHTML = playIcon;
        usingSpeech = false;
      }
      function playSpeech() {
        usingSpeech = true;
        const utt = new SpeechSynthesisUtterance(q.question);
        utt.lang = 'en-US';
        utt.onend = resetBtn;
        utt.onerror = resetBtn;
        speechSynthesis.speak(utt);
        lessonAudioBtn.classList.add('playing');
        lessonAudioBtn.innerHTML = stopIcon;
      }

      lessonAudioBtn.addEventListener('click', () => {
        if (usingSpeech) { speechSynthesis.cancel(); resetBtn(); return; }
        if (audioEl && !audioEl.paused) { audioEl.pause(); audioEl.currentTime = 0; resetBtn(); return; }
        // Pre-create utterance synchronously to preserve iOS gesture context for the fallback
        let pendingUtt = null;
        if ('speechSynthesis' in window) {
          pendingUtt = new SpeechSynthesisUtterance(q.question);
          pendingUtt.lang = 'en-US';
          pendingUtt.onend = resetBtn;
          pendingUtt.onerror = resetBtn;
        }
        function playSpeechFallback() {
          if (!pendingUtt) { resetBtn(); return; }
          usingSpeech = true;
          speechSynthesis.speak(pendingUtt);
          lessonAudioBtn.classList.add('playing');
          lessonAudioBtn.innerHTML = stopIcon;
        }
        if (audioUrl) {
          if (!audioEl) {
            audioEl = new Audio(audioUrl);
            activeAudioEl = audioEl;
            audioEl.addEventListener('ended', resetBtn);
          }
          audioEl.play()
            .then(() => { lessonAudioBtn.classList.add('playing'); lessonAudioBtn.innerHTML = stopIcon; })
            .catch(() => { audioEl = null; activeAudioEl = null; playSpeechFallback(); });
        } else {
          playSpeechFallback();
        }
      });
    }

    el.querySelector('#next-card-btn').addEventListener('click', async () => {
      // Mark question introduced
      const updated = { ...qDBRecord, introduced: true, lastSeen: new Date().toISOString().slice(0,10) };
      await putQuestion(updated);

      // Save progress
      catRecord.currentCardIndex = cardIndex + 1;
      await putCategory(catRecord);

      cardIndex++;
      if (cardIndex >= questions.length) {
        await showVisual();
      } else {
        await showLearningCard();
      }
    });

    el.querySelector('#prev-btn')?.addEventListener('click', () => {
      cardIndex--;
      showLearningCard();
    });
  }

  async function showVisual() {
    phase = 'visual';
    const svg = getVisual(cat.id);

    el.innerHTML = `
      <div style="padding:16px 0;">
        <h2 style="font-family:var(--font-display);margin-bottom:12px;">${cat.name}</h2>
        <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:16px;">${t('lesson.visual.title')}</p>
        <div class="visual-container fade-in">
          ${svg}
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="go-kc-btn" style="margin-top:20px;">
          ${t('lesson.visual.cta')}
        </button>
      </div>
    `;
    el.querySelector('#go-kc-btn').addEventListener('click', () => startKC());
  }

  function startKC() {
    phase = 'kc';
    // Pick 4 random questions from this category for KC
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    kcQuestions = shuffled.slice(0, Math.min(KC_QUESTION_COUNT, shuffled.length));
    kcIndex = 0;
    kcResults = [];
    showKCQuestion();
  }

  function showKCQuestion() {
    if (kcIndex >= kcQuestions.length) {
      showKCSummary();
      return;
    }

    const q = kcQuestions[kcIndex];
    const correctAnswers = resolveAnswer(q, stateCode);
    const correct = correctAnswers[0];

    // Build distractor pool from other categories
    const allQ = getQuestionsForCategory(cat.id, false);
    const distractors = allQ
      .filter(x => x.id !== q.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(x => resolveAnswer(x, stateCode)[0]);

    const options = [...distractors, correct].sort(() => Math.random() - 0.5);

    el.innerHTML = `
      <div style="padding:16px 0;">
        <div class="session-progress">
          <div class="session-progress-bar">
            <div class="session-progress-fill" style="width:${Math.round((kcIndex / kcQuestions.length) * 100)}%"></div>
          </div>
          <span class="session-progress-label">Question ${kcIndex + 1} of ${kcQuestions.length}</span>
        </div>
        <div class="label" style="margin-bottom:8px;">${t('lesson.kc.title')}</div>
        <div style="font-size:18px;font-weight:600;margin-bottom:20px;line-height:1.4;">${q.question}</div>
        <div id="kc-options">
          ${options.map(opt => `
            <button class="kc-option" data-answer="${encodeURIComponent(opt)}">${opt}</button>
          `).join('')}
        </div>
      </div>
    `;

    el.querySelectorAll('.kc-option').forEach(btn => {
      btn.addEventListener('click', async () => {
        const chosen = decodeURIComponent(btn.dataset.answer);
        const isCorrect = chosen === correct || correctAnswers.includes(chosen);

        // Disable all options
        el.querySelectorAll('.kc-option').forEach(b => b.disabled = true);

        if (isCorrect) {
          btn.classList.add('correct', 'correct-pulse');
          kcResults.push(true);
          // Update KC result in DB
          const dbQ = (await getDBQuestion(q.id)) ?? defaultRecord(q.id);
          await putQuestion({ ...dbQ, knowledgeCheckCorrect: true });
        } else {
          btn.classList.add('wrong', 'wrong-shake');
          // Show correct answer
          el.querySelectorAll('.kc-option').forEach(b => {
            if (b.dataset.answer === encodeURIComponent(correct)) b.classList.add('correct');
          });
          kcResults.push(false);
        }

        setTimeout(async () => {
          kcIndex++;
          if (kcIndex < kcQuestions.length) {
            showKCQuestion();
          } else {
            await showKCSummary();
          }
        }, 1000);
      });
    });
  }

  async function showKCSummary() {
    phase = 'summary';
    const correctCount = kcResults.filter(Boolean).length;
    const pct = Math.round((correctCount / kcResults.length) * 100);
    const duration = Math.round((Date.now() - sessionStart) / 1000);

    // Update category record
    catRecord.lessonCompleted = true;
    catRecord.lastLessonDate = new Date().toISOString().slice(0, 10);
    catRecord.lastReviewDate = new Date().toISOString().slice(0, 10);
    catRecord.currentCardIndex = 0;
    catRecord.knowledgeCheckScores = [...(catRecord.knowledgeCheckScores ?? []), pct / 100];

    const dbQs = await getAllQuestions();
    const qMap = Object.fromEntries(dbQs.map(q => [q.id, q]));
    catRecord.masteryScore = await computeMastery(cat.id, qMap);
    await putCategory(catRecord);

    // Log session
    await logSession({
      type: 'lesson',
      category: cat.id,
      durationSeconds: duration,
      knowledgeCheckScore: pct / 100,
    });

    // Confetti for good scores
    if (pct >= 75 && window.confetti) {
      window.confetti({ particleCount: 80, spread: 70, colors: ['#C8102E','#FFFFFF','#1A3A5C'] });
    }

    el.innerHTML = `
      <div style="padding:16px 0;">
        <div class="completion-card fade-in">
          <div class="completion-badge" aria-hidden="true">${pct >= 75 ? '🎉' : '📚'}</div>
          <h2 class="completion-title">${t('lesson.complete.title')}</h2>
          <p style="color:var(--color-text-secondary);margin-bottom:20px;">${cat.name}</p>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px;">
            <div style="text-align:center;">
              <div style="font-size:24px;font-weight:700;color:var(--color-primary);">${questions.length}</div>
              <div class="label">${t('lesson.complete.cards')}</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:24px;font-weight:700;color:${pct >= 75 ? 'var(--color-success)' : 'var(--color-warning)'};">${pct}%</div>
              <div class="label">${t('lesson.complete.kc')}</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:24px;font-weight:700;color:var(--color-primary);">${Math.floor(duration/60)}m</div>
              <div class="label">${t('lesson.complete.time')}</div>
            </div>
          </div>

          ${kcResults.some(r => !r) ? `
            <div style="margin-bottom:16px;text-align:left;">
              <div class="label" style="margin-bottom:8px;">Flagged for drill:</div>
              ${kcQuestions.filter((_,i) => !kcResults[i]).map(q => `
                <div style="font-size:14px;padding:6px 0;border-bottom:1px solid var(--color-border);">${q.question}</div>
              `).join('')}
            </div>
          ` : ''}

          <div style="display:flex;flex-direction:column;gap:10px;">
            <button class="btn btn-primary btn-full" id="start-drill-btn">${t('lesson.complete.drill')}</button>
            <a href="#dashboard" class="btn btn-ghost btn-full" style="display:flex;align-items:center;justify-content:center;">${t('lesson.complete.done')}</a>
          </div>
        </div>
      </div>
    `;

    el.querySelector('#start-drill-btn').addEventListener('click', () => {
      window.location.hash = '#drill';
    });

    if (pct >= 75) {
      import('canvas-confetti')
        .then(m => { m.default({ particleCount: 80, spread: 70, colors: ['#C8102E','#FFFFFF','#1A3A5C'] }); })
        .catch(() => {});
    }
  }

  await showIntro();
}

function getCategoryIntro(id) {
  const intros = {
    'constitution': 'The Constitution is the supreme law of the United States. Understanding it helps you know how America\'s government was designed to work and why.',
    'rights-freedoms': 'Americans enjoy important rights and freedoms protected by law. These were hard-won and are fundamental to what it means to be a citizen.',
    'branches': 'The US government has three branches that balance each other\'s power. This "checks and balances" system prevents any one person or group from having too much control.',
    'laws': 'Laws don\'t just happen — they go through a careful process. Understanding how a bill becomes a law shows you how citizens can influence government.',
    'president': 'The President leads the executive branch and is the most visible figure in US government. The role comes with great power and great responsibility.',
    'colonial': 'America\'s founding story is one of courage and revolution. These events from the 1600s and 1700s shaped the values the country was built on.',
    'civil-war': 'The Civil War was the most painful chapter in American history. The changes it brought — including abolishing slavery — fundamentally transformed the country.',
    'recent-history': 'The 20th and 21st centuries brought dramatic changes to America and the world. From world wars to civil rights to modern challenges, this history is still shaping us.',
    'geography': 'Knowing America\'s geography helps you understand its regions, borders, and how the country is organized from coast to coast.',
    'state-local': 'State and local governments handle many things that affect your daily life. Understanding their powers helps you participate as a citizen.',
    'symbols-holidays': 'America\'s symbols and holidays tell the story of the nation\'s values and history. Citizens are expected to know and respect these.',
    'voting': 'Voting is one of the most important rights and responsibilities of citizens. Knowing who can vote and run for office is core civic knowledge.',
    'rights-resp': 'Being a citizen means having both rights and responsibilities. Both matter for a healthy democracy.',
  };
  return intros[id] ?? 'Study the questions in this category to prepare for your civics test.';
}
