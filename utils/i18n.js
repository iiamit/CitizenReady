let _strings = {};

export function t(key, vars = {}) {
  let str = _strings[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

export async function loadLocale(lang = 'en') {
  try {
    const mod = await import(`../i18n/${lang}.js`);
    _strings = mod.default;
  } catch {
    // Fall back to English if locale not found
    if (lang !== 'en') {
      const mod = await import('../i18n/en.js');
      _strings = mod.default;
    }
  }
}

export function getCurrentLocale() {
  return localStorage.getItem('cr_locale') ?? 'en';
}

export async function setLocale(lang) {
  localStorage.setItem('cr_locale', lang);
  await loadLocale(lang);
}
