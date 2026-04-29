// USCIS audio files for the civics test questions.
// English: Track%20{01-99}.mp3, 100.mp3.mp3 for question 100
// Spanish: Question_{01-100}_Spanish.mp3
// Questions 101-128 are new in the 2025 test and have no confirmed audio.

const BASE = 'https://www.uscis.gov/sites/default/files/document/audio';

export function getAudioUrl(number, lang = 'en') {
  if (number < 1 || number > 100) return null;
  const pad = String(number).padStart(2, '0');
  if (lang === 'es') return `${BASE}/Question_${pad}_Spanish.mp3`;
  if (number === 100) return `${BASE}/100.mp3.mp3`;
  return `${BASE}/Track%20${pad}.mp3`;
}
