import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')

const result = spawnSync(
  process.execPath,
  [path.join(repoRoot, 'scripts', 'vercel-copy-client-dist.mjs')],
  {
    cwd: repoRoot,
    stdio: 'inherit'
  }
)

process.exitCode = result.status ?? 1
