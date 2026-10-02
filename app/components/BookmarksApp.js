'use client';

import { useEffect, useMemo, useState } from 'react';

export default function BookmarksApp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ title: '', url: '', folder: '' });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookmarks');
      if (res.status === 401) {
        window.location.reload(); // session expired -> back to passkey screen
        return;
      }
      if (!res.ok) throw new Error('failed to load');
      setItems(await res.json());
    } catch (e) {
      setError('Could not load bookmarks. Is the database connected? (See README.)');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed to save');
      setForm({ title: '', url: '', folder: '' });
      await load();
    } catch (e) {
      setError('Could not save. Is the database connected? (See README.)');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this bookmark?')) return;
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((b) => b.id !== id));
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.reload();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.folder.toLowerCase().includes(q)
    );
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const b of filtered) {
      const f = b.folder || '/';
      if (!map.has(f)) map.set(f, []);
      map.get(f).push(b);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <main>
      <div className="topbar">
        <h1>~/bookmarks</h1>
        <button className="del" onClick={logout} title="log out">
          [logout]
        </button>
      </div>

      <form className="add-form" onSubmit={add}>
        <input
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="https://example.com/..."
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <input
          placeholder="folder (default: /)"
          value={form.folder}
          onChange={(e) => setForm({ ...form, folder: e.target.value })}
        />
        <button type="submit" disabled={saving}>
          {saving ? 'saving...' : '+ add'}
        </button>
      </form>

      <div className="toolbar">
        <input
          placeholder="/ filter..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">loading...</p>}
      {!loading && !error && groups.length === 0 && (
        <p className="empty">no bookmarks yet. add one above.</p>
      )}

      {groups.map(([folder, list]) => (
        <section key={folder} className="dir">
          <h2 className="dir-head">{folder}</h2>
          {list.map((b, i) => (
            <div className="entry" key={b.id}>
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <a href={b.url} target="_blank" rel="noreferrer">
                {b.title}
              </a>
              <span className="url">{b.url}</span>
              <span className="date">
                {new Date(b.created_at).toLocaleDateString()}
              </span>
              <button className="del" onClick={() => remove(b.id)} title="delete">
                [x]
              </button>
            </div>
          ))}
        </section>
      ))}

      {groups.length > 0 && (
        <p className="count">
          {filtered.length} bookmark{filtered.length === 1 ? '' : 's'} in{' '}
          {groups.length} folder{groups.length === 1 ? '' : 's'}
        </p>
      )}
    </main>
  );
}
