const siteUrl = process.env.NUXT_SITE_URL || 'https://example.com'
const calendarYears = [2027, 2028, 2029, 2030]
const calendarRoutes = calendarYears.flatMap((year) => [
  `/ekadashi-calendar/${year}/`,
  ...Array.from({ length: 12 }, (_, month) => {
    const monthName = new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(2020, month, 1)))
      .toLowerCase()
    return `/ekadashi/${year}/${monthName}/`
  })
])

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
        ...calendarRoutes,
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
