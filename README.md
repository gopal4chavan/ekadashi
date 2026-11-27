# ekadashi.in — Ekadashi dates (Astro)

Static Astro site for **Ekadashi kab hai**, **paran kab hai**, Smarta & Vaishnava calendars by Indian city.

## Stack

- Astro SSG (SEO-friendly HTML)
- Compact JSON calendar (`src/data/2026.json`)
- Mobile-first layout with reserved AdSense slots

## Develop

Requires Node `>=22.23.4`.

```bash
nvm use 22.23.4
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Brand and domain use **ekadashi** / `ekadashi.in`.
- Tier-1 cities: UP, MH, HR, UK, CG.
- Clock times are Delhi-anchored placeholders until per-city panchang generation is added.
