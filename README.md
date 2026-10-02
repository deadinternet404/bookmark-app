# bookmark-app

A simple directory-style bookmark manager. Save links, browse them like a
file listing. No design, just listings.

- Add a bookmark: title + URL + optional folder (default `/`)
- Browse grouped by folder, like directories
- Search across titles, URLs, and folders (press `/` to jump to search)
- Delete with `[x]`

## Stack

- Next.js 14 (App Router) — deploys to Vercel with zero config
- Postgres for storage (table is created automatically on first use)

## Database (free options)

This app needs a Postgres database. Free options, easiest first:

### Option A — Neon via Vercel Marketplace (recommended)
1. Push this repo to GitHub and import it in Vercel (see Deploy below).
2. In the Vercel dashboard, open your project → **Storage** → add the
   **Neon** integration (Neon is Vercel's native Postgres partner; the old
   Vercel Postgres is deprecated).
3. Pick the free plan and connect it to this project.
4. Vercel automatically adds `DATABASE_URL` to your project's environment
   variables. Redeploy — done. No extra signup needed.

### Option B — Neon directly (free tier)
1. Sign up at [neon.tech](https://neon.tech) (free tier is plenty for this).
2. Create a project and copy the connection string.
3. In Vercel: project → **Settings** → **Environment Variables** → add
   `DATABASE_URL` with the Neon connection string. Redeploy.

### Option C — Supabase (free tier)
1. Sign up at [supabase.com](https://supabase.com), create a free project.
2. Go to **Project Settings → Database** and copy the connection string.
3. Add it as `DATABASE_URL` in Vercel environment variables. Redeploy.

The app creates the `bookmarks` table itself on the first API call, so there
is nothing to migrate.

## Passkey protection

The whole app sits behind a passkey:

1. In Vercel: project → **Settings** → **Environment Variables** → add
   `PASSKEY` with your chosen passkey → **Save**.
2. Redeploy (or it applies on the next deployment).

Visitors see "Enter the passkey to access the page." A wrong passkey shows
"You are not authorized to access this page." Login lasts 30 days per device.

## Local development

```bash
npm install
# copy .env.example to .env.local and set POSTGRES_URL
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

**From the dashboard (easiest):**
1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Click **Deploy** (no build settings to change).
4. Add the database (Option A above) and redeploy if needed.

**From the CLI:**
```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production deployment
```

## API

- `GET /api/bookmarks` → list all, ordered by folder then newest first
- `POST /api/bookmarks` → `{ title, url, folder? }` (folder defaults to `/`)
- `DELETE /api/bookmarks/:id` → delete one
