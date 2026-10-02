import { getSql, ensureTable } from '@/lib/db';
import { isAuthorized, UNAUTHORIZED } from '@/lib/auth';

export async function DELETE(req, { params }) {
  if (!isAuthorized(req)) {
    return Response.json({ error: UNAUTHORIZED }, { status: 401 });
  }
  await ensureTable();
  const sql = getSql();
  await sql`DELETE FROM bookmarks WHERE id = ${params.id}`;
  return Response.json({ ok: true });
}
