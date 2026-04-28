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

export async function getNextCategory(exemption65_20 = false) {
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

  // Priority 2: not yet started, in curriculum order
  const notStarted = candidates.find(cat => !dbMap[cat.id] || !dbMap[cat.id].lessonStarted);
  if (notStarted) return notStarted;

  // Priority 3: mastery < 70%, sorted lowest first
  const lowMastery = candidates
    .filter(cat => dbMap[cat.id] && (dbMap[cat.id].masteryScore ?? 0) < 0.7)
    .sort((a, b) => (dbMap[a.id].masteryScore ?? 0) - (dbMap[b.id].masteryScore ?? 0));
  if (lowMastery.length) return lowMastery[0];

  // Priority 4: mastery >= 70% but not reviewed in 7+ days
  const stale = candidates.find(cat => {
    const db = dbMap[cat.id];
    return db && (db.masteryScore ?? 0) >= 0.7 && daysSince(db.lastReviewDate) >= 7;
  });
  if (stale) return stale;

  // Priority 5: round-robin by oldest lastReviewDate
  return candidates.sort((a, b) => {
    const da = dbMap[a.id]?.lastReviewDate ?? '1970-01-01';
    const db2 = dbMap[b.id]?.lastReviewDate ?? '1970-01-01';
    return da < db2 ? -1 : 1;
  })[0];
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
