<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const year = computed(() => String(route.params.year))
const validYear = computed(() => /^\d{4}$/.test(year.value) && Number(year.value) >= 1900 && Number(year.value) <= 2200)

useSeoMeta({
  title: () => `Ekadashi Dates ${year.value} – Fasting Calendar`,
  description: () => `Ekadashi fasting calendar for ${year.value}. Verified dates and local Parana timings will appear after validation.`,
  ogTitle: () => `Ekadashi Calendar ${year.value}`,
  ogDescription: () => `Explore Ekadashi observances for ${year.value}.`
})
useHead(() => ({
  link: [{
    rel: 'canonical',
    href: `${String(config.public.siteUrl).replace(/\/$/, '')}${Number(year.value) >= 2027 && Number(year.value) <= 2030 ? `/ekadashi-calendar/${year.value}/` : `/ekadashi-dates/${year.value}/`}`
  }]
}))
</script>

<template>
  <article class="section-wrap content-page">
    <p class="eyebrow"><span class="eyebrow-dot" /> Year calendar</p>
    <template v-if="validYear">
      <h1>Ekadashi dates <em>{{ year }}.</em></h1>
      <p class="article-lede">A year-specific guide to fasting dates, local sunrise, Tithi, and Parana.</p>
      <div class="notice-card"><p class="notice-kicker">Validation in progress</p><h2>No unverified dates shown.</h2><p>The calendar will be populated after astronomical calculations and Smarta/Vaishnava rules have been reviewed against trusted Panchanga sources. In the meantime, explore the <NuxtLink to="/ekadashi-calculator/">astronomy proof of concept</NuxtLink>.</p></div>
    </template>
    <template v-else><h1>That calendar year <em>isn't available.</em></h1><p>Choose a year from the <NuxtLink to="/ekadashi-calendar/">Ekadashi calendar</NuxtLink>.</p></template>
  </article>
</template>
