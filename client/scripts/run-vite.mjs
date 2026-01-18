import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

let viteBin
try {
  viteBin = require.resolve('vite/bin/vite.js')
} catch (error) {
  console.error('Unable to resolve Vite. Try reinstalling dependencies.')
  console.error(error)
  process.exit(1)
}

const args = process.argv.slice(2)
const child = spawn(process.execPath, [viteBin, ...args], {
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})
