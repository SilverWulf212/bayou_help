import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

console.log('🔨 Building Bayou Help Client...')

// Build the client
execSync('npm run build -w bayou-help-client', {
  cwd: repoRoot,
  stdio: 'inherit'
})

console.log('📦 Copying dist files...')

// Copy dist files
execSync('node scripts/vercel-copy-client-dist.mjs', {
  cwd: repoRoot,
  stdio: 'inherit'
})

console.log('✅ Build complete!')
