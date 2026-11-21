<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]
const year = computed(() => Number(route.params.year))
const month = computed(() => String(route.params.month).toLowerCase())
const monthIndex = computed(() => months.indexOf(month.value))
const validRoute = computed(() => Number.isInteger(year.value) && year.value >= 2027 && year.value <= 2030 && monthIndex.value >= 0)
const monthTitle = computed(() => month.value.charAt(0).toUpperCase() + month.value.slice(1))
const annualPath = computed(() => `/ekadashi-calendar/${year.value}/`)
const previousPath = computed(() => {
  const date = new Date(Date.UTC(year.value, monthIndex.value - 1, 1))
  return `/ekadashi/${date.getUTCFullYear()}/${months[date.getUTCMonth()]}/`
})
const nextPath = computed(() => {
  const date = new Date(Date.UTC(year.value, monthIndex.value + 1, 1))
  return `/ekadashi/${date.getUTCFullYear()}/${months[date.getUTCMonth()]}/`
})

if (!validRoute.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ekadashi month not found' })
}

useSeoMeta({
  title: () => `Ekadashi ${monthTitle.value} ${year.value} – Dates & Parana Time`,
  description: () => `Check Ekadashi dates for ${monthTitle.value} ${year.value}, including Smarta and Vaishnava fasting dates, Tithi details, and local Parana timings.`,
  ogTitle: () => `Ekadashi in ${monthTitle.value} ${year.value}`,
  ogDescription: () => `Monthly Ekadashi calendar and calculation notes for ${monthTitle.value} ${year.value}.`
})

useHead(() => ({
  link: [{ rel: 'canonical', href: `${String(config.public.siteUrl).replace(/\/$/, '')}/ekadashi/${year.value}/${month.value}/` }]
}))
</script>

<template>
  <article class="section-wrap content-page">
    <p class="eyebrow"><span class="eyebrow-dot" /> Monthly Ekadashi calendar</p>
    <h1>Ekadashi in {{ monthTitle }} <em>{{ year }}.</em></h1>
    <p class="article-lede">Find Ekadashi fasting dates for {{ monthTitle }} {{ year }}, with Smarta and Vaishnava observance, Tithi, sunrise, and Parana timing information.</p>

    <div class="notice-card">
      <p class="notice-kicker">Calendar data status</p>
      <h2>Observance dates are being verified.</h2>
      <p>This page is reserved for the {{ monthTitle }} {{ year }} calendar. Fasting dates and Parana windows will be published after the astronomical calculations and observance rules have been checked against trusted Panchanga references. We do not show estimated dates as confirmed guidance.</p>
    </div>

    <h2>What this monthly calendar will include</h2>
    <p>Each confirmed Ekadashi occurrence will include the local fasting date, the Ekadashi Tithi start and end, sunrise and Arunodaya context, Smarta and Vaishnava observance where they differ, and the Parana window for the following day.</p>

    <h2>How Ekadashi dates are determined</h2>
    <p>Ekadashi is the eleventh lunar day (Tithi) in each paksha. The Tithi is based on the angular relationship between the Moon and Sun. The local sunrise, Dashami-vedha, and tradition-specific observance rules help determine the fasting day; Parana depends on the following day's local timings and relevant limits. Results can therefore differ by location.</p>
    <p>Read more about <NuxtLink to="/smarta-vs-vaishnava-ekadashi/">Smarta and Vaishnava observance</NuxtLink> and <NuxtLink to="/guides/how-parana-works/">how Parana works</NuxtLink>, or try the <NuxtLink to="/ekadashi-calculator/">astronomy calculator</NuxtLink>.</p>

    <h2>Frequently asked questions</h2>
    <h3>When is Ekadashi in {{ monthTitle }} {{ year }}?</h3>
    <p>The confirmed fasting dates for {{ monthTitle }} {{ year }} will appear here after local sunrise and observance-rule validation is complete.</p>
    <h3>What is the Parana time?</h3>
    <p>Parana is the time window for ending the fast, usually on the day after Ekadashi. Its exact timing depends on the observance date, local sunrise, and the applicable rule set; verified local timings will be shown with each occurrence.</p>
    <h3>Why can Ekadashi dates differ between cities?</h3>
    <p>Sunrise occurs at different local times, and observance rules use local sunrise in relation to the Tithi. A date shown for one city may not apply to another location.</p>

    <nav class="month-navigation" aria-label="Monthly calendar navigation">
      <NuxtLink v-if="year > 2027 || monthIndex > 0" :to="previousPath">← Previous month</NuxtLink>
      <span v-else aria-hidden="true" />
      <NuxtLink :to="annualPath">All {{ year }} months</NuxtLink>
      <NuxtLink v-if="year < 2030 || monthIndex < 11" :to="nextPath">Next month →</NuxtLink>
      <span v-else aria-hidden="true" />
    </nav>
  </article>
</template>
