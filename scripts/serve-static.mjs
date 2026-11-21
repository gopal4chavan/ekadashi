import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'

const root = resolve('.output/public')
const port = Number(process.env.PORT || 4173)
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
}

createServer((request, response) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
  } catch {
    response.writeHead(400).end('Bad request')
    return
  }

  const target = resolve(root, `.${pathname}`)
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden')
    return
  }

  const candidates = [target, join(target, 'index.html'), `${target}.html`]
  const file = candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile())
  if (!file) {
    response.writeHead(404).end('Not found')
    return
  }

  response.writeHead(200, { 'Content-Type': contentTypes[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(response)
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`)
})
