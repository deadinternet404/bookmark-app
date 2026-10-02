import {
  passkeyMatches,
  authCookieHeader,
  clearCookieHeader,
  UNAUTHORIZED,
} from '@/lib/auth';

export async function POST(req) {
  const { passkey } = await req.json().catch(() => ({}));
  if (!passkeyMatches(passkey)) {
    return Response.json({ error: UNAUTHORIZED }, { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': authCookieHeader(),
    },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearCookieHeader(),
    },
  });
}
