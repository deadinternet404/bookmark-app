import { neon } from '@neondatabase/serverless';

let _sql = null;

// Lazy: only throws when a request actually needs the DB (and env is missing),
// so `next build` and the UI's error handling keep working without a database.
export function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    _sql = neon(url);
  }
  return _sql;
}

// Creates the table on first use so there's no separate migration step.
export async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      folder TEXT NOT NULL DEFAULT '/',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
