import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'node_modules/@cometpisces/tarot-kit-images/images')
const target = path.join(root, 'public/tarot-art')

if (!fs.existsSync(source)) throw new Error('Install dependencies before building tarot images')
fs.mkdirSync(target, { recursive: true })

const files = fs.readdirSync(source).filter((file) => file.endsWith('.png')).sort()
let converted = 0
for (const file of files) {
  const input = path.join(source, file)
  const output = path.join(target, file.replace(/\.png$/, '.webp'))
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs) continue
  execFileSync('cwebp', ['-quiet', '-q', '78', '-m', '6', input, '-o', output])
  converted += 1
}

console.log(`Tarot images ready: ${files.length} total, ${converted} converted`)
