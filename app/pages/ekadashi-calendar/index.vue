<script setup lang="ts">
usePageMetadata({
  title: 'Ekadashi Calendar',
  description: 'A guide to upcoming Ekadashi dates, Smarta and Vaishnava observances, and local Parana timing methodology.',
  path: '/ekadashi-calendar/'
})
</script>

<template>
  <article class="section-wrap content-page">
    <p class="eyebrow"><span class="eyebrow-dot" /> Calendar</p>
    <h1>Ekadashi dates, <em>carefully calculated.</em></h1>
    <p class="article-lede">The public calendar is being prepared around a transparent astronomy engine and independently checked reference cases.</p>
    <div class="notice-card"><p class="notice-kicker">Calendar status</p><h2>Verified dates are not published yet.</h2><p>We’re first validating the Sun, Moon, Tithi boundaries, sunrise, and timezone handling. Once those results and the observance rules have been checked, this page will show the calendar without relying on unverified sample dates.</p></div>
    <h2>Choose a year</h2>
    <ul class="year-links"><li v-for="year in [2027, 2028, 2029, 2030]" :key="year"><NuxtLink :to="`/ekadashi-calendar/${year}/`">Ekadashi calendar {{ year }} <span>→</span></NuxtLink></li></ul>
    <p>Learn about <NuxtLink to="/smarta-vs-vaishnava-ekadashi/">Smarta and Vaishnava observance</NuxtLink> or explore the <NuxtLink to="/ekadashi-calculator/">astronomy calculator</NuxtLink>.</p>
  </article>
</template>
