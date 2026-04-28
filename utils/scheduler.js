import { getAllCategories, getCategory, putCategory } from './db.js';
import { getQuestionsForCategory } from './storage.js';

export const CATEGORIES = [
  { id: 'constitution',       name: 'The Constitution',                    icon: '📜' },
  { id: 'rights-freedoms',    name: 'Rights and Freedoms',                 icon: '🗽' },
  { id: 'branches',           name: 'Branches of Government',              icon: '🏛️' },
  { id: 'laws',               name: 'How Laws Are Made',                   icon: '⚖️' },
  { id: 'president',          name: 'The President and Executive Branch',  icon: '🏩' },
  { id: 'colonial',           name: 'Colonial History and the Revolution', icon: '⚔️' },
  { id: 'civil-war',          name: 'The Civil War and Reconstruction',    icon: '🕊️' },
  { id: 'recent-history',     name: 'Recent American History',             icon: '📅' },
  { id: 'geography',          name: 'Geography',                           icon: '🗺️' },
  { id: 'state-local',        name: 'State and Local Government',          icon: '🏙️' },
  { id: 'symbols-holidays',   name: 'National Symbols and Holidays',       icon: '🦅' },
  { id: 'voting',             name: 'Who Can Vote and Run for Office',     icon: '🗳️' },
  { id: 'rights-resp',        name: 'Rights and Responsibilities',         icon: '🤝' },
];

const today = () => new Date().toISOString().slice(0, 10);

function daysSince(dateStr) {
  if (!dateStr) return Infinity;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff / (1000 * 60 * 60 * 24);
}

export async function getNextCategory(exemption65_20 = false, questionRecords = null) {
  const dbCats = await getAllCategories();
  const dbMap = Object.fromEntries(dbCats.map(c => [c.id, c]));

  let candidates = CATEGORIES;
  if (exemption65_20) {
    candidates = CATEGORIES.filter(cat =>
      getQuestionsForCategory(cat.id, true).length > 0
    );
  }

  // Priority 1: unfinished lesson in progress
  const inProgress = candidates.find(cat => {
    const db = dbMap[cat.id];
    return db && db.lessonStarted && !db.lessonCompleted;
  });
  if (inProgress) return inProgress;

  // Priority 2 (adaptive): categories where avg easeFactor is very low (hardest)
  if (questionRecords) {
    const veryHard = candidates.filter(cat => {
      if (!dbMap[cat.id]?.lessonStarted) return false;
      const qs = getQuestionsForCategory(cat.id, exemption65_20);
      const drilled = qs.filter(q => questionRecords[q.id]?.introduced);
      if (!drilled.length) return false;
      const avgEase = drilled.reduce((s, q) => s + (questionRecords[q.id]?.easeFactor ?? 2.5), 0) / drilled.length;
      return avgEase < 1.7;
    }).sort((a, b) => {
      const easeA = avgEaseFactor(getQuestionsForCategory(a.id), questionRecords);
      const easeB = avgEaseFactor(getQuestionsForCategory(b.id), questionRecords);
      return easeA - easeB;
    });
    if (veryHard.length) return veryHard[0];

    // Priority 3 (adaptive): categories with high recent miss rate
    const highMiss = candidates.filter(cat => {
      if (!dbMap[cat.id]?.lessonStarted) return false;
      const qs = getQuestionsForCategory(cat.id, exemption65_20);
      const drilled = qs.filter(q => questionRecords[q.id]?.introduced);
      if (drilled.length < 3) return false;
      const missRate = drilled.reduce((s, q) => s + (questionRecords[q.id]?.missCount ?? 0), 0) / drilled.length;
      return missRate > 0.4;
    });
    if (highMiss.length) return highMiss[0];
  }

  // Priority 4: not yet started, in curriculum order
  const notStarted = candidates.find(cat => !dbMap[cat.id] || !dbMap[cat.id].lessonStarted);
  if (notStarted) return notStarted;

  // Priority 5: mastery < 70%, sorted lowest first
  const lowMastery = candidates
    .filter(cat => dbMap[cat.id] && (dbMap[cat.id].masteryScore ?? 0) < 0.7)
    .sort((a, b) => (dbMap[a.id].masteryScore ?? 0) - (dbMap[b.id].masteryScore ?? 0));
  if (lowMastery.length) return lowMastery[0];

  // Priority 6: mastery >= 70% but not reviewed in 7+ days
  const stale = candidates.find(cat => {
    const db = dbMap[cat.id];
    return db && (db.masteryScore ?? 0) >= 0.7 && daysSince(db.lastReviewDate) >= 7;
  });
  if (stale) return stale;

  // Priority 7: round-robin by oldest lastReviewDate
  return candidates.sort((a, b) => {
    const da = dbMap[a.id]?.lastReviewDate ?? '1970-01-01';
    const db2 = dbMap[b.id]?.lastReviewDate ?? '1970-01-01';
    return da < db2 ? -1 : 1;
  })[0];
}

function avgEaseFactor(questions, qMap) {
  const drilled = questions.filter(q => qMap[q.id]?.introduced);
  if (!drilled.length) return 2.5;
  return drilled.reduce((s, q) => s + (qMap[q.id]?.easeFactor ?? 2.5), 0) / drilled.length;
}

export function weightedCardQueue(pool, qMap) {
  const today = new Date().toISOString().slice(0, 10);
  return pool
    .map(q => {
      const rec = qMap[q.id];
      if (!rec) return { q, weight: 1 };
      const daysOverdue = Math.max(0, (Date.now() - new Date(rec.nextReviewDate ?? today)) / (1000 * 60 * 60 * 24));
      const difficultyBonus = (2.5 - (rec.easeFactor ?? 2.5)) * 3;
      const missBonus = (rec.missCount ?? 0) * 0.5;
      return { q, weight: 1 + daysOverdue * 0.2 + difficultyBonus + missBonus };
    })
    .sort((a, b) => b.weight - a.weight)
    .map(({ q }) => q);
}

export async function ensureCategoryRecord(categoryId) {
  let rec = await getCategory(categoryId);
  if (!rec) {
    rec = {
      id: categoryId,
      lessonStarted: false,
      lessonCompleted: false,
      lastLessonDate: null,
      lastReviewDate: null,
      currentCardIndex: 0,
      knowledgeCheckScores: [],
      masteryScore: 0,
    };
    await putCategory(rec);
  }
  return rec;
}

export async function computeMastery(categoryId, questionRecords) {
  const qs = getQuestionsForCategory(categoryId);
  if (!qs.length) return 0;
  const introduced = qs.filter(q => questionRecords[q.id]?.introduced).length;
  const drilled = qs.filter(q => (questionRecords[q.id]?.interval ?? 0) >= 3).length;
  return (introduced / qs.length) * 0.5 + (drilled / qs.length) * 0.5;
}
