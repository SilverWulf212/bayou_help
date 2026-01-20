import { readFile } from 'node:fs/promises'
import path from 'node:path'

const schemaPath = path.resolve('scripts/db/schema.sql')
const schema = await readFile(schemaPath, 'utf8')

process.stdout.write(schema)
