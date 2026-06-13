import { getSetting, putSetting, getAllCategories } from './db.js';
import { isAndroid } from './platform.js';

const SETTING_KEY = 'ratingSolicited';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.citizenready';

// Returns true when: ratingSolicited flag is NOT set AND 2+ categories completed.
// No side-effects — flag is only set when user explicitly taps "Rate the App".
export async function shouldPromptRating() {
  const already = await getSetting(SETTING_KEY);
  if (already) return false;
  const cats = await getAllCategories();
  return cats.filter(c => c.lessonCompleted === true).length >= 2;
}

// Triggers native Play Store review sheet on Android; falls back to Play Store URL.
export async function triggerNativeReview() {
  if (isAndroid()) {
    try {
      const { InAppReview } = await import('@capacitor-community/in-app-review');
      await InAppReview.requestReview();
    } catch {
      openPlayStorePage();
    }
  } else {
    openPlayStorePage();
  }
}

export function openPlayStorePage() {
  window.open(PLAY_STORE_URL, '_blank', 'noopener');
}

export async function markRatingSolicited() {
  await putSetting(SETTING_KEY, true);
}
