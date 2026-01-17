# Issues

## Fixed

- ESLint v9 was configured without a flat config; added `client/eslint.config.js` and `server/eslint.config.js`, updated deps to support it.
- Client production build on Windows failed due to missing optional Rollup native package; added `@rollup/rollup-win32-x64-msvc` as an optional dep in `client/package.json`.
- Client chat history bug: `client/src/hooks/useChat.js` previously posted a stale `history` array due to closure; now uses a ref-backed append helper.
- Resume downloads: `client/src/hooks/useChat.js` now sets correct file names for `pdf`/`docx`.
- Duplicate resume-mode detection: `server/src/routes/chat.js` now uses `isInResumeMode` from `server/src/services/resume.js`.
- Admin auth hardcoded fallback password removed; server now requires `ADMIN_PASSWORD` env var.

## Remaining / Follow-ups

- Root `package.json` previously referenced a non-existent `server` build script; it now only builds the client. If you want a formal server build step (even if it’s a no-op), add a `build` script in `server/package.json` and restore the root pipeline.
- There are no unit/integration test suites configured (no `test` scripts). Consider adding at least:
  - Server: `node:test` or `vitest` + `supertest` for `/api/health`, `/api/chat`, `/api/resources`.
  - Client: `vitest` + `@testing-library/react` for `useChat`/pages.

## LLM Provider Selection

- Default provider is Ollama.
- Configure with server-side env vars (no UI):
  - `LLM_PROVIDER=ollama|openai|anthropic|gemini|mistral|deepseek|qwen`

Ollama (default)
- `OLLAMA_URL` (default `http://172.20.128.1:11434`)
- `OLLAMA_MODEL` (default `qwen2.5:7b`)

OpenAI
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default `gpt-4o-mini`)
- `OPENAI_BASE_URL` (default `https://api.openai.com/v1`)

Anthropic
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (default `claude-3-5-sonnet-latest`)

Gemini
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (default `gemini-1.5-flash`)

Mistral (OpenAI-compatible)
- `MISTRAL_API_KEY`
- `MISTRAL_MODEL` (default `mistral-small-latest`)
- `MISTRAL_BASE_URL` (default `https://api.mistral.ai/v1`)

DeepSeek (OpenAI-compatible)
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL` (default `deepseek-chat`)
- `DEEPSEEK_BASE_URL` (default `https://api.deepseek.com/v1`)

Qwen (OpenAI-compatible)
- `QWEN_API_KEY`
- `QWEN_MODEL` (default `qwen-plus`)
- `QWEN_BASE_URL` (default `https://dashscope.aliyuncs.com/compatible-mode/v1`)

Behavior
- If the selected provider is missing an API key or errors, the server falls back to Ollama.
- If Ollama is unavailable, the server uses canned fallback responses.

## E2E

- Added a runnable smoke test: `server/src/e2e-smoke.js`.
  - Run with server already up: `node server/src/e2e-smoke.js`
  - Optional: `BASE_URL=http://localhost:3001 node server/src/e2e-smoke.js`
