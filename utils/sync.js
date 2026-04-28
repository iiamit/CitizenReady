import { exportAllData, importAllData } from './db.js';

const SUPABASE_URL = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_SUPABASE_URL ?? '') : '';
const SUPABASE_KEY = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '') : '';

let _client = null;

function getClient() {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    _client = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch {
    // dynamic import fallback handled below
  }
  return _client;
}

async function getClientAsync() {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const { createClient } = await import('@supabase/supabase-js');
    _client = createClient(SUPABASE_URL, SUPABASE_KEY);
    return _client;
  } catch {
    return null;
  }
}

export function isCloudEnabled() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export async function getCurrentUser() {
  const client = await getClientAsync();
  if (!client) return null;
  try {
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  return (await getCurrentUser()) !== null;
}

export async function signUp(email, password) {
  const client = await getClientAsync();
  if (!client) throw new Error('Cloud sync not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) await pushToCloud();
  return data;
}

export async function signIn(email, password) {
  const client = await getClientAsync();
  if (!client) throw new Error('Cloud sync not configured.');
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  // Merge cloud progress with local on sign-in
  await pullFromCloud();
  return data;
}

export async function signOut() {
  const client = await getClientAsync();
  if (!client) return;
  await client.auth.signOut();
}

export async function pushToCloud() {
  const client = await getClientAsync();
  if (!client) return;
  const user = await getCurrentUser();
  if (!user) return;
  try {
    const payload = await exportAllData();
    const { error } = await client
      .from('user_progress')
      .upsert(
        { user_id: user.id, device_id: getDeviceId(), payload, app_version: '2.0.0' },
        { onConflict: 'user_id,device_id' }
      );
    if (error) throw error;
  } catch (e) {
    console.warn('Cloud sync push failed:', e.message);
  }
}

export async function pullFromCloud() {
  const client = await getClientAsync();
  if (!client) return;
  const user = await getCurrentUser();
  if (!user) return;
  try {
    const { data, error } = await client
      .from('user_progress')
      .select('payload, synced_at')
      .eq('user_id', user.id)
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return;
    const local = await exportAllData();
    const merged = mergeProgress(local, data.payload);
    await importAllData(merged);
    await pushToCloud();
  } catch (e) {
    console.warn('Cloud sync pull failed:', e.message);
  }
}

function mergeProgress(local, remote) {
  const questions = mergeByHigherInterval(local.questions ?? [], remote.questions ?? []);
  // Settings: prefer local (most recent device in use)
  const settings = local.settings?.length ? local.settings : (remote.settings ?? []);
  // Categories: prefer local
  const categories = local.categories?.length ? local.categories : (remote.categories ?? []);
  // Sessions: union (both sets of sessions, may have duplicates but that's acceptable)
  const sessions = [...(local.sessions ?? []), ...(remote.sessions ?? [])];
  return {
    ...local,
    questions,
    settings,
    categories,
    sessions,
    contentOverrides: local.contentOverrides ?? remote.contentOverrides ?? []
  };
}

function mergeByHigherInterval(local, remote) {
  const map = new Map();
  for (const q of remote) map.set(q.id, q);
  for (const q of local) {
    const existing = map.get(q.id);
    if (!existing || (q.interval ?? 0) >= (existing.interval ?? 0)) {
      map.set(q.id, q);
    }
  }
  return [...map.values()];
}

function getDeviceId() {
  let id = localStorage.getItem('cr_device_id');
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    localStorage.setItem('cr_device_id', id);
  }
  return id;
}
