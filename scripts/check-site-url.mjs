import { readFileSync } from 'node:fs'

let siteUrl = process.env.NUXT_SITE_URL

if (!siteUrl) {
  try {
    const envFile = readFileSync('.env', 'utf8')
    const match = envFile.match(/^\s*NUXT_SITE_URL\s*=\s*["']?([^\r\n"']+)/m)
    siteUrl = match?.[1]?.trim()
  } catch {
    // The validation below reports a single actionable message if .env is missing.
  }
}

if (!siteUrl) {
  console.error('Set NUXT_SITE_URL to the public HTTPS domain before generating the static website.')
  process.exit(1)
}

try {
  const parsed = new URL(siteUrl)
  if (parsed.protocol !== 'https:' || parsed.hostname.endsWith('.example')) throw new Error()
} catch {
  console.error('NUXT_SITE_URL must be the public HTTPS domain, for example https://yourdomain.com.')
  process.exit(1)
}
