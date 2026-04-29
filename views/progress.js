import { getAllQuestions, getAllCategories } from '../utils/db.js';
import { getQuestionsForCategory } from '../utils/storage.js';
import { CATEGORIES, computeMastery } from '../utils/scheduler.js';
import { computeReadinessScore, readinessBand } from '../utils/readiness.js';
import { shareScoreCard } from '../utils/scorecard.js';
import { t } from '../utils/i18n.js';

export async function render(el) {
  const [dbQuestions, dbCategories] = await Promise.all([
    getAllQuestions(),
    getAllCategories(),
  ]);

  const qMap = Object.fromEntries(dbQuestions.map(q => [q.id, q]));
  const catMap = Object.fromEntries(dbCategories.map(c => [c.id, c]));

  const { score, breakdown } = await computeReadinessScore();
  const band = readinessBand(score);

  const catStats = await Promise.all(CATEGORIES.map(async cat => {
    const qs = getQuestionsForCategory(cat.id);
    const rec = catMap[cat.id];
    const mastery = await computeMastery(cat.id, qMap);
    const introduced = qs.filter(q => qMap[q.id]?.introduced).length;
    const weakCount = qs.filter(q => {
      const r = qMap[q.id];
      return r?.introduced && (r.easeFactor < 1.5 || (r.interval ?? 0) === 0);
    }).length;
    return { cat, qs, rec, mastery, introduced, weakCount };
  }));

  const allWeak = dbQuestions.filter(r => r.introduced && (r.easeFactor < 1.5 || (r.interval ?? 0) === 0));

  // Build a map from question id → category id for the weak list
  const qCatMap = {};
  CATEGORIES.forEach(cat => {
    getQuestionsForCategory(cat.id).forEach(q => { qCatMap[q.id] = cat.id; });
  });

  el.innerHTML = `
    <div style="padding:16px 0 40px;">
      <h1 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">${t('progress.title')}</h1>
      <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:20px;">${t('progress.subtitle')}</p>

      <div class="card fade-in" style="margin-bottom:20px;padding:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;">${t('progress.readiness')}</div>
            <div style="font-size:36px;font-weight:700;color:${band.color};">${score}%</div>
            <div style="font-size:14px;font-weight:600;color:${band.color};">${t(band.key)}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center;">
            <div>
              <div style="font-size:20px;font-weight:700;color:var(--color-primary);">${Math.round(breakdown.coverage * 100)}%</div>
              <div style="font-size:10px;color:var(--color-text-secondary);">${t('progress.coverage')}</div>
            </div>
            <div>
              <div style="font-size:20px;font-weight:700;color:var(--color-primary);">${Math.round(breakdown.mastery * 100)}%</div>
              <div style="font-size:10px;color:var(--color-text-secondary);">${t('progress.mastery')}</div>
            </div>
            <div>
              <div style="font-size:20px;font-weight:700;color:var(--color-primary);">${Math.round(breakdown.kc * 100)}%</div>
              <div style="font-size:10px;color:var(--color-text-secondary);">${t('progress.kc')}</div>
            </div>
          </div>
        </div>
        ${score > 0 ? `<button class="btn btn-secondary" id="share-score-btn" style="width:100%;margin-top:12px;">
          ${t('progress.share')} 📤
        </button>` : ''}
      </div>

      <h2 style="font-family:var(--font-display);font-size:17px;margin-bottom:12px;">${t('progress.categories')}</h2>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">
        ${catStats.map(s => buildCategoryCard(s, qMap)).join('')}
      </div>

      ${allWeak.length ? `
        <h2 style="font-family:var(--font-display);font-size:17px;margin-bottom:12px;">${t('progress.weak.title')} (${allWeak.length})</h2>
        <div class="card" style="padding:0;overflow:hidden;margin-bottom:24px;">
          ${buildWeakList(allWeak, qMap, qCatMap)}
        </div>
      ` : ''}

      ${!allWeak.length && dbQuestions.filter(r => r.introduced).length > 0 ? `
        <div class="card" style="text-align:center;padding:28px 20px;margin-bottom:24px;">
          <div style="font-size:36px;margin-bottom:8px;">🏆</div>
          <div style="font-weight:700;font-size:16px;margin-bottom:4px;">${t('progress.noweak')}</div>
          <div style="color:var(--color-text-secondary);font-size:13px;">Keep up the daily drills to maintain your mastery.</div>
        </div>
      ` : ''}
    </div>
  `;

  // Share score card
  el.querySelector('#share-score-btn')?.addEventListener('click', async () => {
    const btn = el.querySelector('#share-score-btn');
    btn.disabled = true;
    btn.textContent = 'Generating…';
    try {
      await shareScoreCard(score, catStats.map(s => ({ name: s.cat.name, mastery: s.mastery })));
    } catch (e) {
      alert('Could not share score card. Please try again.');
    }
    btn.disabled = false;
    btn.innerHTML = 'Share My Score 📤';
  });

  el.querySelectorAll('.cat-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.catId;
      const detail = el.querySelector(`#cat-detail-${id}`);
      const isOpen = detail.style.display !== 'none';
      detail.style.display = isOpen ? 'none' : 'block';
      btn.textContent = isOpen ? 'Show questions ▾' : 'Hide ▴';
    });
  });
}

function buildCategoryCard({ cat, qs, rec, mastery, introduced, weakCount }, qMap) {
  const pct = Math.round(mastery * 100);
  const notStarted = !rec?.lessonStarted;
  const completed = rec?.lessonCompleted;

  let statusLabel, statusColor;
  if (notStarted) {
    statusLabel = t('progress.status.notstarted');
    statusColor = 'var(--color-text-secondary)';
  } else if (pct >= 70) {
    statusLabel = t('progress.status.mastered');
    statusColor = 'var(--color-success)';
  } else {
    statusLabel = t('progress.status.inprogress');
    statusColor = 'var(--color-warning)';
  }

  const questionRows = qs.map(q => {
    const r = qMap[q.id];
    const isIntroduced = r?.introduced;
    const interval = r?.interval ?? 0;
    let dot, dotColor;
    if (isIntroduced && interval >= 3) {
      dot = '●'; dotColor = 'var(--color-success)';
    } else if (isIntroduced) {
      dot = '◑'; dotColor = 'var(--color-warning)';
    } else {
      dot = '○'; dotColor = 'var(--color-text-secondary)';
    }
    return `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--color-border);">
        <span style="color:${dotColor};font-size:14px;flex-shrink:0;">${dot}</span>
        <span style="font-size:12px;color:var(--color-text-secondary);flex-shrink:0;">Q.${String(q.number).padStart(3,'0')}</span>
        <span style="font-size:13px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${q.question}</span>
        ${isIntroduced ? `<span style="font-size:11px;color:var(--color-text-secondary);flex-shrink:0;">${interval}d</span>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="card" style="padding:16px;">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="font-size:28px;line-height:1;flex-shrink:0;">${cat.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
            <div style="font-weight:700;font-size:15px;">${cat.name}</div>
            <span style="font-size:12px;color:${statusColor};font-weight:600;flex-shrink:0;">${statusLabel}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <div style="flex:1;background:var(--color-border);border-radius:4px;height:6px;overflow:hidden;">
              <div style="width:${pct}%;background:${pct >= 70 ? 'var(--color-success)' : 'var(--color-warning)'};height:100%;border-radius:4px;transition:width 0.4s;"></div>
            </div>
            <span style="font-size:12px;color:var(--color-text-secondary);flex-shrink:0;">${pct}%</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
            <div style="font-size:11px;color:var(--color-text-secondary);">
              ${introduced}/${qs.length} introduced
              ${weakCount ? ` · <span style="color:var(--color-warning);">${weakCount} weak</span>` : ''}
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <a href="#lesson/${cat.id}" style="font-size:12px;color:var(--color-primary);">${t('progress.review')}</a>
              ${introduced > 0 ? `<button class="cat-expand-btn" data-cat-id="${cat.id}" style="font-size:12px;background:none;border:none;color:var(--color-text-secondary);cursor:pointer;padding:0;">Show questions ▾</button>` : ''}
            </div>
          </div>
        </div>
      </div>
      ${introduced > 0 ? `
        <div id="cat-detail-${cat.id}" style="display:none;margin-top:12px;border-top:1px solid var(--color-border);padding-top:8px;">
          ${questionRows}
          <div style="margin-top:8px;display:flex;gap:14px;font-size:11px;color:var(--color-text-secondary);">
            <span>● Mastered</span><span>◑ Learning</span><span>○ Not studied</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function buildWeakList(allWeak, qMap, qCatMap) {
  const visible = allWeak.slice(0, 20);
  const rows = visible.map(r => {
    const catId = qCatMap[r.id];
    const qs = catId ? getQuestionsForCategory(catId) : [];
    const question = qs.find(q => q.id === r.id);
    if (!question) return '';
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--color-border);gap:8px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${question.question}</div>
          <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;">
            Q.${String(question.number).padStart(3,'0')} · ${r.interval ?? 0} day interval
          </div>
        </div>
        <a href="#lesson/${catId}" style="font-size:12px;color:var(--color-primary);white-space:nowrap;flex-shrink:0;">Review →</a>
      </div>
    `;
  }).join('');

  const overflow = allWeak.length > 20
    ? `<div style="padding:12px 16px;font-size:12px;color:var(--color-text-secondary);">+ ${allWeak.length - 20} more — complete drills to improve</div>`
    : '';

  return rows + overflow;
}
