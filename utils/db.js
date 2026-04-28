const DB_NAME = 'citizenready_db';
const DB_VERSION = 1;

let _db = null;

export async function openDB() {
  if (_db) return _db;
  _db = await idb.openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('questions')) {
        const qs = db.createObjectStore('questions', { keyPath: 'id' });
        qs.createIndex('nextReviewDate', 'nextReviewDate');
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const ss = db.createObjectStore('sessions', { autoIncrement: true });
        ss.createIndex('date', 'date');
      }
      if (!db.objectStoreNames.contains('contentOverrides')) {
        db.createObjectStore('contentOverrides', { keyPath: 'key' });
      }
    }
  });
  return _db;
}

export async function getSetting(key) {
  const db = await openDB();
  const row = await db.get('settings', key);
  return row ? row.value : undefined;
}

export async function putSetting(key, value) {
  const db = await openDB();
  await db.put('settings', { key, value });
}

export async function getQuestion(id) {
  const db = await openDB();
  return db.get('questions', id);
}

export async function putQuestion(record) {
  const db = await openDB();
  await db.put('questions', record);
}

export async function getAllQuestions() {
  const db = await openDB();
  return db.getAll('questions');
}

export async function getCategory(id) {
  const db = await openDB();
  return db.get('categories', id);
}

export async function putCategory(record) {
  const db = await openDB();
  await db.put('categories', record);
}

export async function getAllCategories() {
  const db = await openDB();
  return db.getAll('categories');
}

export async function logSession(record) {
  const db = await openDB();
  await db.add('sessions', { ...record, date: new Date().toISOString().slice(0, 10) });
}

export async function getAllSessions() {
  const db = await openDB();
  return db.getAll('sessions');
}

export async function getContentOverride(key) {
  const db = await openDB();
  return db.get('contentOverrides', key);
}

export async function putContentOverride(key, value, version, fetchedAt) {
  const db = await openDB();
  await db.put('contentOverrides', { key, value, version, fetchedAt });
}

export async function exportAllData() {
  const db = await openDB();
  const [settings, questions, categories, sessions, contentOverrides] = await Promise.all([
    db.getAll('settings'),
    db.getAll('questions'),
    db.getAll('categories'),
    db.getAll('sessions'),
    db.getAll('contentOverrides'),
  ]);
  return { settings, questions, categories, sessions, contentOverrides, exportedAt: new Date().toISOString() };
}

export async function importAllData(data) {
  const db = await openDB();
  const tx = db.transaction(['settings', 'questions', 'categories', 'sessions', 'contentOverrides'], 'readwrite');
  await Promise.all([
    tx.objectStore('settings').clear(),
    tx.objectStore('questions').clear(),
    tx.objectStore('categories').clear(),
    tx.objectStore('sessions').clear(),
    tx.objectStore('contentOverrides').clear(),
  ]);
  for (const r of (data.settings || [])) tx.objectStore('settings').put(r);
  for (const r of (data.questions || [])) tx.objectStore('questions').put(r);
  for (const r of (data.categories || [])) tx.objectStore('categories').put(r);
  for (const r of (data.sessions || [])) tx.objectStore('sessions').add(r);
  for (const r of (data.contentOverrides || [])) tx.objectStore('contentOverrides').put(r);
  await tx.done;
}

export async function resetAllData() {
  const db = await openDB();
  const tx = db.transaction(['settings', 'questions', 'categories', 'sessions', 'contentOverrides'], 'readwrite');
  await Promise.all([
    tx.objectStore('settings').clear(),
    tx.objectStore('questions').clear(),
    tx.objectStore('categories').clear(),
    tx.objectStore('sessions').clear(),
    tx.objectStore('contentOverrides').clear(),
  ]);
  await tx.done;
}
