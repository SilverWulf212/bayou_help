import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const resolveVitePackageJson = () => {
  try {
    return require.resolve('vite/package.json')
  } catch {
    return null
  }
}

const findPackageRootFromEntry = (entryPath) => {
  let dir = path.dirname(entryPath)
  while (dir && dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      if (pkg.name === 'vite') {
        return pkgPath
      }
    }
    dir = path.dirname(dir)
  }
  return null
}

let vitePackageJsonPath = resolveVitePackageJson()

if (!vitePackageJsonPath) {
  try {
    const viteEntry = require.resolve('vite')
    vitePackageJsonPath = findPackageRootFromEntry(viteEntry)
  } catch {
    vitePackageJsonPath = null
  }
}

if (!vitePackageJsonPath || !fs.existsSync(vitePackageJsonPath)) {
  console.error('Unable to resolve Vite. Try reinstalling dependencies.')
  process.exit(1)
}

const viteRoot = path.dirname(vitePackageJsonPath)
const vitePackage = JSON.parse(fs.readFileSync(vitePackageJsonPath, 'utf8'))
const viteBinRelative =
  typeof vitePackage.bin === 'string' ? vitePackage.bin : vitePackage.bin?.vite

if (!viteBinRelative) {
  console.error('Unable to resolve Vite CLI. Try reinstalling dependencies.')
  process.exit(1)
}

const viteBin = path.join(viteRoot, viteBinRelative)

if (!fs.existsSync(viteBin)) {
  console.error('Unable to resolve Vite CLI. Try reinstalling dependencies.')
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
