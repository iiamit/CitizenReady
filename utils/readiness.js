import { getAllQuestions, getAllCategories } from './db.js';
import { getQuestions } from './storage.js';

export async function computeReadinessScore(exemption65_20 = false) {
  const allQ = getQuestions();
  const pool = exemption65_20 ? allQ.filter(q => q.starred65_20) : allQ;
  const total = pool.length;
  if (!total) return 0;

  const [dbQuestions, dbCategories] = await Promise.all([
    getAllQuestions(),
    getAllCategories(),
  ]);
  const qMap = Object.fromEntries(dbQuestions.map(q => [q.id, q]));

  // 40% — category coverage: % of questions introduced via lesson
  const introduced = pool.filter(q => qMap[q.id]?.introduced).length;
  const coverage = introduced / total;

  // 40% — flashcard mastery: % of drilled questions with interval >= 3
  const mastered = pool.filter(q => (qMap[q.id]?.interval ?? 0) >= 3 && qMap[q.id]?.introduced).length;
  const flashcardMastery = total ? mastered / total : 0;

  // 20% — knowledge check accuracy: rolling average
  let kcScores = [];
  for (const cat of dbCategories) {
    if (cat.knowledgeCheckScores?.length) {
      kcScores = kcScores.concat(cat.knowledgeCheckScores);
    }
  }
  const kcAvg = kcScores.length
    ? kcScores.reduce((a, b) => a + b, 0) / kcScores.length
    : 0;

  const score = Math.min(Math.max(Math.round((coverage * 0.4 + flashcardMastery * 0.4 + kcAvg * 0.2) * 100), 0), 100);
  return { score, breakdown: { coverage, mastery: flashcardMastery, kc: kcAvg } };
}

export function readinessBand(score) {
  if (score < 50) return { label: 'Getting started', color: '#B71C1C' };
  if (score < 75) return { label: 'Building knowledge', color: '#E65100' };
  if (score < 90) return { label: 'On track', color: '#2E7D32' };
  return { label: 'Ready to test', color: '#1A3A5C' };
}

export async function getStreakDays() {
  const { getAllSessions } = await import('./db.js');
  const sessions = await getAllSessions();
  if (!sessions.length) return 0;

  const days = [...new Set(sessions.map(s => s.date))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);

  let streak = 0;
  let check = today;
  for (const day of days) {
    if (day === check) {
      streak++;
      const d = new Date(check);
      d.setDate(d.getDate() - 1);
      check = d.toISOString().slice(0, 10);
    } else if (day < check) {
      break;
    }
  }
  return streak;
}

export function getDueCardCount(questionRecords, exemption65_20 = false) {
  const allQ = getQuestions();
  const pool = exemption65_20 ? allQ.filter(q => q.starred65_20) : allQ;
  const today = new Date().toISOString().slice(0, 10);
  return pool.filter(q => {
    const r = questionRecords[q.id];
    return r?.introduced && (r.nextReviewDate ?? '1970-01-01') <= today;
  }).length;
}
