import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const PUBLIC_DIR = path.resolve('public')
const MAX_WIDTH = 1920

const INPUT_EXTS = new Set(['.png', '.jpg', '.jpeg'])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walk(full)))
      continue
    }
    out.push(full)
  }
  return out
}

function isRasterImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return INPUT_EXTS.has(ext)
}

function webpPathFor(filePath) {
  return filePath.replace(/\.(png|jpe?g)$/i, '.webp')
}

async function optimizeOne(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath)

  const image = sharp(filePath)
  const meta = await image.metadata()

  const shouldResize = typeof meta.width === 'number' && meta.width > MAX_WIDTH

  const pipeline = shouldResize ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true }) : image

  const outPath = webpPathFor(filePath)

  // Use slightly higher quality for screenshots/text.
  await pipeline.webp({ quality: 78, effort: 5 }).toFile(outPath)

  await fs.unlink(filePath)

  return {
    rel,
    outRel: path.relative(PUBLIC_DIR, outPath),
    resized: shouldResize,
    width: meta.width,
    height: meta.height,
  }
}

async function main() {
  const files = await walk(PUBLIC_DIR)
  const targets = files.filter(isRasterImage)

  if (targets.length === 0) {
    console.log('No PNG/JPG images found under public/.')
    return
  }

  console.log(`Optimizing ${targets.length} image(s) in public/ ...`)

  const results = []
  for (const filePath of targets) {
    results.push(await optimizeOne(filePath))
  }

  console.log('Done. Converted to .webp and deleted originals:')
  for (const r of results) {
    const sizeInfo = r.width && r.height ? ` (${r.width}x${r.height}${r.resized ? ` -> max ${MAX_WIDTH}w` : ''})` : ''
    console.log(`- ${r.rel} -> ${r.outRel}${sizeInfo}`)
  }
}

await main()
