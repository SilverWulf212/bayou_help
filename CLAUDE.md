# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bayou Help is a community resource finder for Acadiana, Louisiana. It helps people find local resources for shelter, food, healthcare, jobs, and other needs through an AI-powered chat interface and a browsable resource directory.

**Target users**: People in difficult situations who need help finding local services. Content is written at a 6th grade reading level.

**Critical safety feature**: QuickExit button (bottom-right on all pages) immediately redirects to Google for users who need to leave quickly.

## Development Commands

```bash
# Install dependencies (from root)
npm install

# Run both client and server in dev mode
npm run dev

# Run only client (Vite on port 5173)
npm run dev:client

# Run only server (Express on port 3000)
npm run dev:server

# Build for production
npm run build

# Lint all workspaces
npm run lint

# E2E tests with Playwright
npm run test:e2e
npm run test:e2e:ui    # Interactive UI mode
```

## Architecture

### Monorepo Structure (npm workspaces)

```
client/     → React SPA (Vite, Tailwind, Radix UI)
server/     → Express API + static file server
shared/     → Code shared between client/server (prompts, SEO config)
```

### Request Flow

1. **Chat**: User message → `/api/chat` → safety check → keyword matching → Ollama LLM (or fallback) → response with resources
2. **Resources**: Stored in `server/src/data/resources.json`, served via `/api/resources`
3. **Production**: Server serves built client from `client/dist/` with SSR-like meta injection for SEO

### Key Design Decisions

**LLM Integration** (`server/src/services/llm.js`):
- Uses Ollama (default: `qwen2.5:7b`) at `localhost:11434`
- Falls back to keyword-matched responses if Ollama unavailable
- 30-second timeout on LLM requests

**Safety Escalation** (`server/src/routes/chat.js`):
- Regex patterns detect crisis keywords (suicide, domestic violence, trafficking, emergency)
- Immediate hardcoded responses with crisis hotline numbers bypass LLM

**SEO** (`shared/seo.js`, `server/src/index.js`):
- Server injects meta tags and critical content into HTML before serving
- Generates sitemap.xml and robots.txt dynamically

### Environment Variables

```
PORT=3000                      # Server port
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
ADMIN_PASSWORD=bayou-admin-2024
PUBLIC_ORIGIN=https://bayouhelp.org
```

### Client Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Landing | Hero + quick paths |
| `/chat` | Chat | AI chat interface |
| `/resources` | Resources | Filterable resource list |
| `/resources/:id` | ResourceDetail | Single resource page |
| `/privacy` | Privacy | Privacy policy |
| `/admin` | Admin | Resource management (password protected) |

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Chat with AI (rate limited) |
| `/api/resources` | GET | List resources (filterable by parish/category) |
| `/api/admin/login` | POST | Admin authentication (rate limited) |
| `/api/admin/resources` | POST/PUT/DELETE | CRUD for resources |
| `/api/health` | GET | Health check |
