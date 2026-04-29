// USCIS audio files for the civics test questions.
// The audio tracks on uscis.gov were recorded for the original 2008 100-question test.
// The app uses the 2025 128-question test, which renumbered and added questions.
// AUDIO_TRACK_MAP translates 2025 question numbers → 2008 audio track numbers.
// 2025 questions with no matching 2008 audio fall back to Web Speech API in the UI.
//
// English:  Track%20{01-99}.mp3, special case 100.mp3.mp3 for track 100
// Spanish:  Question_{01-100}_Spanish.mp3

const BASE = 'https://www.uscis.gov/sites/default/files/document/audio';

// 2025 question number → 2008 audio track number
const AUDIO_TRACK_MAP = {
  2:   1,   // supreme law of the land
  3:   2,   // what does the Constitution do
  7:   7,   // how many amendments
  12:  11,  // economic system (capitalism / free market)
  13:  12,  // rule of law
  15:  14,  // why three branches / checks and balances
  17:  15,  // President leads executive branch
  18:  16,  // Congress makes federal laws
  19:  17,  // two parts of Congress
  21:  18,  // 100 U.S. senators
  22:  19,  // senators serve 6 years
  23:  20,  // your state's U.S. senators
  24:  21,  // 435 voting House members
  25:  22,  // representatives serve 2 years
  29:  23,  // name your U.S. representative
  30:  47,  // Speaker of the House
  31:  24,  // senator represents all people of their state
  35:  25,  // why some states have more representatives
  36:  26,  // President elected for 4 years
  38:  28,  // name of the President now
  39:  29,  // name of the Vice President now
  40:  30,  // VP becomes President if President can no longer serve
  42:  32,  // Commander in Chief of the military
  43:  33,  // who signs bills into law
  44:  34,  // who vetoes bills
  47:  35,  // Cabinet advises the President
  48:  36,  // two Cabinet-level positions
  51:  37,  // what does the judicial branch do
  52:  38,  // highest court in the United States
  53:  39,  // how many justices on the Supreme Court
  57:  40,  // Chief Justice of the United States
  58:  41,  // one power only for the federal government
  59:  42,  // one power only for the states
  61:  43,  // governor of your state
  62:  44,  // capital of your state
  63:  48,  // amendments about who can vote
  66:  52,  // Pledge of Allegiance
  69:  55,  // two examples of civic participation
  73:  58,  // why colonists came to America
  74:  59,  // who lived in America before the Europeans
  75:  60,  // group taken and sold as slaves
  77:  61,  // why colonists declared independence from Britain
  78:  62,  // who wrote the Declaration of Independence
  79:  63,  // when was the Declaration of Independence adopted
  83:  67,  // writers of the Federalist Papers
  85:  68,  // Benjamin Franklin
  90:  71,  // Louisiana Purchase
  91:  72,  // one war fought by the U.S. in the 1800s
  92:  73,  // the Civil War (North vs South)
  94:  75,  // Abraham Lincoln
  95:  76,  // Emancipation Proclamation
  100: 78,  // one war fought by the U.S. in the 1900s
  105: 80,  // Roosevelt / Great Depression / World War II
  109: 83,  // Cold War concern
  113: 85,  // Martin Luther King Jr.
  115: 86,  // September 11, 2001
  117: 87,  // one American Indian tribe
  119: 94,  // capital of the United States
  120: 95,  // Statue of Liberty
  121: 96,  // why the flag has 13 stripes
  122: 97,  // why the flag has 50 stars
  123: 98,  // name of the national anthem
};

// These specific tracks use underscore in the filename instead of %20
const UNDERSCORE_TRACKS = new Set([28, 29, 39, 40, 46, 47, 51]);

export function getAudioUrl(number, lang = 'en') {
  const track = AUDIO_TRACK_MAP[number] ?? null;
  if (!track) return null;
  const pad = String(track).padStart(2, '0');
  if (lang === 'es') return `${BASE}/Question_${pad}_Spanish.mp3`;
  if (track === 100) return `${BASE}/100.mp3.mp3`;
  if (UNDERSCORE_TRACKS.has(track)) return `${BASE}/Track_${track}.mp3`;
  return `${BASE}/Track%20${pad}.mp3`;
}
