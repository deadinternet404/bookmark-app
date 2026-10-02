import { getSql, ensureTable } from '@/lib/db';

export async function GET() {
  await ensureTable();
  const sql = getSql();
  const rows =
    await sql`SELECT id, title, url, folder, created_at FROM bookmarks ORDER BY folder, created_at DESC`;
  return Response.json(rows);
}

export async function POST(req) {
  await ensureTable();
  const { title, url, folder } = await req.json();

  if (!title || !url) {
    return Response.json({ error: 'title and url are required' }, { status: 400 });
  }

  let cleanUrl = String(url).trim();
  if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl;
  const cleanFolder = (folder || '/').trim() || '/';

  const sql = getSql();
  const rows = await sql`
    INSERT INTO bookmarks (title, url, folder)
    VALUES (${String(title).trim()}, ${cleanUrl}, ${cleanFolder})
    RETURNING id, title, url, folder, created_at
  `;
  return Response.json(rows[0], { status: 201 });
}
