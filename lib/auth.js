import { createHmac, timingSafeEqual } from 'node:crypto';

export const AUTH_COOKIE = 'bm_auth';
const TOKEN_SALT = 'bookmark-app-auth-v1';

function safeEqual(a, b) {
  const ba = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// The cookie value is an HMAC keyed by the passkey, so the server can verify
// it without storing any session state.
export function expectedToken() {
  return createHmac('sha256', process.env.PASSKEY || '')
    .update(TOKEN_SALT)
    .digest('hex');
}

export function passkeyMatches(input) {
  const passkey = process.env.PASSKEY;
  if (!passkey) return false;
  return safeEqual(input, passkey);
}

export function tokenIsValid(token) {
  if (!token || !process.env.PASSKEY) return false;
  return safeEqual(token, expectedToken());
}

export function isAuthorized(req) {
  const header = req.headers.get('cookie') || '';
  const m = header.match(new RegExp('(?:^|;\\s*)' + AUTH_COOKIE + '=([^;]*)'));
  return tokenIsValid(m && decodeURIComponent(m[1]));
}

export function authCookieHeader() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return (
    `${AUTH_COOKIE}=${expectedToken()}; Path=/; HttpOnly; SameSite=Lax; ` +
    `Max-Age=${60 * 60 * 24 * 30}${secure}`
  );
}

export function clearCookieHeader() {
  return `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export const UNAUTHORIZED = 'You are not authorized to access this page.';
