-- CitizenReady v2 — Supabase schema
-- Run this in the Supabase SQL editor for your project.
-- Enable Row Level Security on all tables.

-- ── User progress snapshots ───────────────────────────────────────────────────
-- Stores the full IndexedDB export payload per device per user.
-- Sync strategy: last-write-wins per device; merged client-side on pull.
CREATE TABLE IF NOT EXISTS user_progress (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id   TEXT        NOT NULL,
  payload     JSONB       NOT NULL,
  app_version TEXT,
  synced_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_synced
  ON user_progress (user_id, synced_at DESC);

-- Row Level Security: users can only see their own progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users upsert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ── Cleanup function ──────────────────────────────────────────────────────────
-- Optional: keep only the 3 most recent device snapshots per user
-- to limit storage growth. Can be scheduled as a cron job in Supabase.
CREATE OR REPLACE FUNCTION cleanup_old_progress()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM user_progress
  WHERE id NOT IN (
    SELECT id
    FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY synced_at DESC) AS rn
      FROM user_progress
    ) ranked
    WHERE rn <= 5
  );
END;
$$;
