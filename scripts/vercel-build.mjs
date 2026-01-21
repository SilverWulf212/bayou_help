import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runOrThrow(command, args, options = {}) {
  const result = spawnSync(command, args, options)
  if (result.error) throw result.error
  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`Command failed (${result.status}): ${command} ${args.join(' ')}`)
  }
}

console.log('🔨 Building Bayou Help Client...')

// Build the client
runOrThrow(npmCmd, ['run', 'build', '-w', 'client'], {
  cwd: repoRoot,
  shell: process.platform === 'win32',
  stdio: 'inherit'
})

console.log('✅ Build complete!')
