import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const repoRoot = path.resolve(__dirname, '..')
  const fromDir = path.join(repoRoot, 'client', 'dist')
  const toDir = path.join(repoRoot, 'dist')

  await fs.rm(toDir, { recursive: true, force: true })
  await fs.cp(fromDir, toDir, { recursive: true })

  const entries = await fs.readdir(toDir)
  if (entries.length === 0) {
    throw new Error('dist directory is empty after copy')
  }

  console.log(`Copied ${fromDir} -> ${toDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
