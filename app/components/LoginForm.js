'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!passkey) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setError('You are not authorized to access this page.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>~/bookmarks</h1>
      <p>Enter the passkey to access the page.</p>
      <form className="login-form" onSubmit={submit}>
        <input
          type="password"
          placeholder="passkey"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          autoComplete="current-password"
          autoFocus
        />
        <button type="submit" disabled={busy}>
          {busy ? 'checking...' : 'enter'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
