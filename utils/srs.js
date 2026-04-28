const MIN_EASE = 1.3;
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function defaultRecord(questionId) {
  return {
    id: questionId,
    introduced: false,
    lessonCompletedDate: null,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: today(),
    totalReviews: 0,
    missCount: 0,
    almostCount: 0,
    gotItCount: 0,
    knowledgeCheckCorrect: false,
    answerUpdatedFlag: false,
    lastSeen: null,
  };
}

export function applyRating(record, rating) {
  const r = { ...record };
  r.totalReviews += 1;
  r.lastSeen = today();

  if (rating === 'gotit') {
    r.gotItCount += 1;
    const newInterval = Math.max(Math.round(r.interval * r.easeFactor), 1);
    r.interval = newInterval;
    r.nextReviewDate = addDays(today(), newInterval);
  } else if (rating === 'almost') {
    r.almostCount += 1;
    r.interval = 1;
    r.easeFactor = Math.max(r.easeFactor - 0.15, MIN_EASE);
    r.nextReviewDate = addDays(today(), 1);
  } else if (rating === 'missed') {
    r.missCount += 1;
    r.interval = 0;
    r.easeFactor = Math.max(r.easeFactor - 0.20, MIN_EASE);
    r.nextReviewDate = today();
  }

  return r;
}

export function isDue(record) {
  return record.nextReviewDate <= today();
}

export function isWeak(record) {
  return record.easeFactor < 1.5 || record.missCount >= 2;
}
