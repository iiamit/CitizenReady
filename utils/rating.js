import { getSetting, putSetting, getAllCategories } from './db.js';
import { isAndroid, isIOS } from './platform.js';

const SETTING_KEY = 'ratingSolicited';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.citizenready';
const APP_STORE_URL = 'https://apps.apple.com/app/id6764369722';

// Returns true when: ratingSolicited flag is NOT set AND 2+ categories completed.
// No side-effects — flag is only set when user explicitly taps "Rate the App".
export async function shouldPromptRating() {
  const already = await getSetting(SETTING_KEY);
  if (already) return false;
  const cats = await getAllCategories();
  return cats.filter(c => c.lessonCompleted === true).length >= 2;
}

// Triggers native review sheet on iOS/Android; falls back to store URL.
export async function triggerNativeReview() {
  if (isAndroid() || isIOS()) {
    try {
      const { InAppReview } = await import('@capacitor-community/in-app-review');
      await InAppReview.requestReview();
    } catch {
      isAndroid() ? openPlayStorePage() : openAppStorePage();
    }
  } else {
    openAppStorePage();
  }
}

export function openPlayStorePage() {
  window.open(PLAY_STORE_URL, '_blank', 'noopener');
}

export function openAppStorePage() {
  window.open(APP_STORE_URL, '_blank', 'noopener');
}

export async function markRatingSolicited() {
  await putSetting(SETTING_KEY, true);
}
