import { QUESTIONS_2025 } from '../data/questions-2025.js';
import { STATE_DATA } from '../data/state-data.js';
import { MANIFEST } from '../data/content-manifest.js';
import { getContentOverride } from './db.js';

let _questions = null;
let _stateData = null;

function versionIsNewer(overrideVersion, bundledVersion) {
  if (!overrideVersion) return false;
  return overrideVersion > bundledVersion;
}

export async function loadMergedData() {
  const [qOverride, sOverride] = await Promise.all([
    getContentOverride('questions-override'),
    getContentOverride('state-override'),
  ]);

  if (qOverride && versionIsNewer(qOverride.version, MANIFEST.questionsVersion)) {
    _questions = qOverride.value;
  } else {
    _questions = QUESTIONS_2025;
  }

  if (sOverride && versionIsNewer(sOverride.version, MANIFEST.stateDataVersion)) {
    _stateData = sOverride.value;
  } else {
    _stateData = STATE_DATA;
  }
}

export function getQuestions() {
  return _questions;
}

export function getStateData(stateCode) {
  return stateCode ? _stateData[stateCode] : _stateData;
}

export function getQuestionsForCategory(categoryId, exemption65_20 = false) {
  let qs = _questions.filter(q => q.category === categoryId);
  if (exemption65_20) qs = qs.filter(q => q.starred65_20);
  return qs;
}

export function getQuestion(id) {
  return _questions.find(q => q.id === id);
}

export function resolveAnswer(question, stateCode) {
  if (!question.stateSpecific || !stateCode) return question.answers;
  const sd = _stateData[stateCode];
  if (!sd) return question.answers;

  if (question.id === 'Q061') {
    return sd.governor ? [sd.governor] : question.answers;
  }
  if (question.id === 'Q062') {
    return sd.capital ? [sd.capital] : question.answers;
  }
  if (question.id === 'Q023') {
    return sd.senators && sd.senators.length ? sd.senators : question.answers;
  }
  return question.answers;
}

export function getBundledVersions() {
  return {
    questionsVersion: MANIFEST.questionsVersion,
    stateDataVersion: MANIFEST.stateDataVersion,
  };
}
