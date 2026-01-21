# bayou_help

## Vercel deployment

- Root Directory: repo root (`.`)
- Node: `24.x` (pinned via `engines`)
- Build: `node scripts/vercel-build.mjs`
- Output Directory: `client/dist`

### Database

- If Vercel Postgres is attached/configured, the serverless API will automatically create the `resources` table/indexes on first use and seed the baseline dataset if the table is empty.
- If Postgres is not configured, the app still works (resources + chat) using bundled fallback data.

