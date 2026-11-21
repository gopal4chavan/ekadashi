# Ekadashi Calendar

SEO-first static Nuxt 4 website with a browser-side astronomy proof of concept. The astronomy engine is kept independent of the Nuxt UI. Ekadashi observance rules and public fasting/Parana dates are intentionally not implemented or published until astronomical results and tradition rules have been validated.

## Requirements

- Node.js 22.22.3 or newer supported release (see `.node-version`)
- npm

Install and run locally:

```sh
npm install
npm run dev
```

Typecheck and run the engine unit tests:

```sh
npm run typecheck
npm test
```

After generating, preview the actual static files locally with `npm run preview:static`.

## Static hosting

Set the canonical public domain, then generate the static files:

```sh
cp .env.example .env
# Edit NUXT_SITE_URL in .env to your real HTTPS domain.
npm run generate
```

Upload the contents of `.output/public/` to Hostinger's `public_html` directory. No Node server is required at runtime. Nuxt uses prerendered pages, and the Nuxt SEO module provides sitemap/robots/schema integrations. Do not publish a build while the example domain is configured.

## Initial routes

- `/` — product landing page
- `/ekadashi-calendar/` — calendar overview
- `/ekadashi-dates/2026/` and `/ekadashi-dates/2027/` — year landing pages
- `/ekadashi-calculator/` — local astronomy/Tithi proof of concept
- `/smarta-vs-vaishnava-ekadashi/` — observance overview
- `/guides/what-is-ekadashi/` and `/guides/how-parana-works/` — educational pages

## Calculation engine

- `engine/astronomy` defines a provider interface, Astronomy Engine adapter, Tithi classification and Tithi boundary search.
- `engine/location` holds a small starter city list. Users may adjust coordinates and timezone in the calculator.
- `engine/astronomy/comparison.ts` provides provider-independent comparison helpers.
- `data/reference-cases/` intentionally contains no fabricated Swiss Ephemeris values. Add sourced reference cases only after deciding how to use Swiss Ephemeris without distributing its AGPL-licensed implementation in the production bundle.

Astronomy Engine performs its calculations in UTC. Local date/time input is converted with the IANA timezone using Temporal; sunrise and sunset are searched from the start of that local civil day. The numerical bisection tolerance is one second, which is not a claim of one-second astronomical accuracy.

## Validation still needed

The calculator is a research preview, not a Panchanga or fasting recommendation. Before publishing Ekadashi dates or Parana windows, add independently sourced reference fixtures for Hyderabad, Mumbai, New Delhi, London, and New York; record actual provider differences; validate sunrise conventions; and separately implement/review Smarta, Vaishnava, Dashami-vedha, Mahadvadashi, Hari Vasara, and Parana rules.
