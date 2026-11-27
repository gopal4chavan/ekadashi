// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ekadashi.in',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  // Duplicate pages folded into the home page.
  redirects: {
    '/ekadashi-kab-hai': '/',
    '/ekadashi-calculator': '/',
  },
});
