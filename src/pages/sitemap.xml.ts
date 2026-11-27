import type { APIRoute } from 'astro';
import { cities } from '../data/cities';

export const GET: APIRoute = () => {
  const base = 'https://ekadashi.in';
  const staticPaths = ['', '/ekadashi-calendar', '/ekadashi-paran-kab-hai', '/ekadashi'];
  const urls = [
    ...staticPaths.map((p) => `${base}${p || '/'}`),
    ...cities.map((c) => `${base}/ekadashi/${c.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
