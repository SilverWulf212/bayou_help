# Deployment Guide

Deploy Bayou Help to Coolify at `coolify.sulverwulf.work` with domain `bayou.silverwulf.work`.

## Prerequisites

- Coolify instance running at `coolify.sulverwulf.work`
- Git repository accessible to Coolify
- Traefik configured for SSL termination

## Step 1: Create New Resource in Coolify

1. Go to Coolify dashboard
2. Click **+ New Resource** → **Application**
3. Select your Git provider and repository
4. Branch: `main`

## Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| Build Pack | **Dockerfile** |
| Dockerfile Location | `Dockerfile` (root) |
| Port | `3000` |

## Step 3: Environment Variables

Add these in Coolify → **Environment Variables**:

```
ADMIN_PASSWORD=<generate-a-strong-password>
OPENAI_API_KEY=<set-in-your-host>
PUBLIC_ORIGIN=https://bayou.silverwulf.work
NODE_ENV=production
PORT=3000
```

**Important:** Generate a secure ADMIN_PASSWORD. Do not use the demo password.

## Step 4: Domain Configuration

In Coolify → **Domain**:

| Setting | Value |
|---------|-------|
| Domain | `bayou.silverwulf.work` |
| HTTPS | Enabled (via Traefik) |
| Force HTTPS | Yes |

Traefik will automatically provision SSL via Let's Encrypt.

## Step 5: Persistent Storage (CRITICAL)

Without this, admin-created resources are **lost on every deploy**.

In Coolify → **Storages** → **+ Add**:

| Setting | Value |
|---------|-------|
| Source Path | `/data/bayou-help` |
| Destination Path | `/app/server/src/data` |

This mounts a persistent volume for `resources.json`.

## Step 6: Health Check

In Coolify → **Health Check**:

| Setting | Value |
|---------|-------|
| Path | `/api/health` |
| Port | `3000` |
| Interval | `30s` |

## Step 7: Deploy

1. Click **Deploy**
2. Watch build logs for errors
3. Once healthy, visit `https://bayou.silverwulf.work`

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads at `https://bayou.silverwulf.work`
- [ ] Chat works (test with "I need food")
- [ ] Crisis detection works (test with "I want to hurt myself" → 988 response)
- [ ] Resources page lists all resources
- [ ] Admin login works at `/admin`

## Troubleshooting

### "FATAL: ADMIN_PASSWORD environment variable is required"
→ Add `ADMIN_PASSWORD` to environment variables

### Chat returns fallback responses instead of GPT-4o-mini
→ Check `OPENAI_API_KEY` is set correctly

### Resources reset after deploy
→ Persistent storage not configured. Add volume mount (Step 5)

### 502 Bad Gateway
→ Check health check path is `/api/health` and port is `3000`

### SSL not working
→ Verify Traefik is configured and domain DNS points to Coolify server

## Updating

To deploy updates:
1. Push to `main` branch
2. Coolify auto-deploys (if webhook configured) or click **Redeploy**

Resources in `/app/server/src/data` persist across deploys.
