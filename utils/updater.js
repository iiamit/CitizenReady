import { getContentOverride, putContentOverride, getSetting, putSetting } from './db.js';
import { MANIFEST } from '../data/content-manifest.js';
import { isOnline } from './platform.js';

const UPDATE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const FETCH_TIMEOUT_MS = 5000;

// Set this to your hosted update endpoint before launch
const UPDATE_ENDPOINT = 'https://citizenready.app/updates/latest.json';

async function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    return resp;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

function versionIsNewer(remote, local) {
  return remote && local && remote > local;
}

export let updateAppliedThisSession = false;
export let lastReleaseNotes = '';

export async function checkForUpdates(force = false) {
  try {
    if (!await isOnline()) return;

    const override = await getContentOverride('lastUpdateCheck');
    const lastCheck = override?.value ?? null;

    if (!force && lastCheck && (Date.now() - new Date(lastCheck).getTime()) < UPDATE_INTERVAL_MS) {
      return; // checked recently
    }

    const resp = await fetchWithTimeout(UPDATE_ENDPOINT, FETCH_TIMEOUT_MS);
    if (!resp.ok) return;

    const manifest = await resp.json();
    lastReleaseNotes = manifest.releaseNotes ?? '';

    let updated = false;

    if (manifest.questionsVersion && manifest.questionsUrl &&
        versionIsNewer(manifest.questionsVersion, MANIFEST.questionsVersion)) {
      const qResp = await fetchWithTimeout(manifest.questionsUrl, FETCH_TIMEOUT_MS);
      if (qResp.ok) {
        const qData = await qResp.json();
        await putContentOverride('questions-override', qData, manifest.questionsVersion, new Date().toISOString());
        updated = true;
      }
    }

    if (manifest.stateDataVersion && manifest.stateDataUrl &&
        versionIsNewer(manifest.stateDataVersion, MANIFEST.stateDataVersion)) {
      const sResp = await fetchWithTimeout(manifest.stateDataUrl, FETCH_TIMEOUT_MS);
      if (sResp.ok) {
        const sData = await sResp.json();
        await putContentOverride('state-override', sData, manifest.stateDataVersion, new Date().toISOString());
        updated = true;
      }
    }

    await putContentOverride('lastUpdateCheck', new Date().toISOString(), null, null);

    if (updated) {
      updateAppliedThisSession = true;
      // Flag questions whose answers changed
      await flagUpdatedAnswers();
    }
  } catch {
    // Network unreachable — silently continue on bundled data
  }
}

async function flagUpdatedAnswers() {
  const { getAllQuestions, putQuestion } = await import('./db.js');
  const { getQuestion } = await import('./storage.js');
  const dbQuestions = await getAllQuestions();
  for (const dbQ of dbQuestions) {
    if (!dbQ.introduced) continue;
    const live = getQuestion(dbQ.id);
    if (!live) continue;
    const liveAnswerStr = JSON.stringify(live.answers.slice().sort());
    const hasFlag = dbQ.answerUpdatedFlag;
    if (!hasFlag && liveAnswerStr !== JSON.stringify((dbQ._lastKnownAnswers ?? live.answers).slice().sort())) {
      await putQuestion({ ...dbQ, answerUpdatedFlag: true });
    }
  }
}
