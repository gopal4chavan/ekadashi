const siteUrl = process.env.NUXT_SITE_URL || 'https://example.com'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-21',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/seo'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s | Ekadashi Calendar',
      meta: [
        { name: 'theme-color', content: '#f7f3ea' }
      ]
    }
  },
  site: {
    name: 'Ekadashi Calendar',
    url: siteUrl,
    trailingSlash: true
  },
  aiReady: false,
  runtimeConfig: {
    public: { siteUrl }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/ekadashi-calendar/',
        '/ekadashi-calculator/',
        '/ekadashi-dates/2027/',
        '/ekadashi-dates/2026/',
        '/smarta-vs-vaishnava-ekadashi/',
        '/guides/what-is-ekadashi/',
        '/guides/how-parana-works/'
      ]
    }
  },
  typescript: { strict: true }
})
