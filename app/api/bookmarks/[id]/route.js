import { getSql, ensureTable } from '@/lib/db';

export async function DELETE(_req, { params }) {
  await ensureTable();
  const sql = getSql();
  await sql`DELETE FROM bookmarks WHERE id = ${params.id}`;
  return Response.json({ ok: true });
}
