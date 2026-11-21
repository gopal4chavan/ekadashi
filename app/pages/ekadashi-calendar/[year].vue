<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const year = computed(() => Number(route.params.year))
const validYear = computed(() => Number.isInteger(year.value) && year.value >= 2027 && year.value <= 2030)
const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

if (!validYear.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ekadashi calendar year not found' })
}

useSeoMeta({
  title: () => `Ekadashi Calendar ${year.value} – Dates & Parana`,
  description: () => `Explore the Ekadashi calendar for ${year.value}, with monthly pages for fasting dates, Smarta and Vaishnava observance, and local Parana timings.`,
  ogTitle: () => `Ekadashi Calendar ${year.value}`,
  ogDescription: () => `Browse monthly Ekadashi calendar pages for ${year.value}.`
})

useHead(() => ({
  link: [{ rel: 'canonical', href: `${String(config.public.siteUrl).replace(/\/$/, '')}/ekadashi-calendar/${year.value}/` }]
}))
</script>

<template>
  <article class="section-wrap content-page">
    <p class="eyebrow"><span class="eyebrow-dot" /> Yearly Ekadashi calendar</p>
    <h1>Ekadashi calendar <em>{{ year }}.</em></h1>
    <p class="article-lede">Browse month-by-month Ekadashi calendar pages for {{ year }}, covering fasting dates, observance differences, Tithi, and Parana timing.</p>

    <div class="notice-card">
      <p class="notice-kicker">Calendar data status</p>
      <h2>Dates are published after validation.</h2>
      <p>The calculation engine and tradition-specific observance rules are being checked against trusted Panchanga references. Monthly pages explain what will be included and will show dates only after that review is complete.</p>
    </div>

    <h2>Choose a month</h2>
    <ul class="year-links">
      <li v-for="month in months" :key="month">
        <NuxtLink :to="`/ekadashi/${year}/${month}/`">
          Ekadashi in {{ month.charAt(0).toUpperCase() + month.slice(1) }} {{ year }} <span>→</span>
        </NuxtLink>
      </li>
    </ul>
    <p>For the calculation method, see <NuxtLink to="/smarta-vs-vaishnava-ekadashi/">Smarta and Vaishnava observance</NuxtLink> or <NuxtLink to="/guides/how-parana-works/">how Parana works</NuxtLink>.</p>
  </article>
</template>
