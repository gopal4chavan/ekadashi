<script setup lang="ts">
usePageMetadata({
  title: 'Ekadashi Astronomy Calculator',
  description: 'Explore the current Tithi, Sun–Moon longitude difference, Tithi boundaries, sunrise, and sunset for a local date and location.',
  path: '/ekadashi-calculator/'
})
</script>

<template>
  <section class="page-hero section-wrap compact-hero">
    <p class="eyebrow"><span class="eyebrow-dot" /> Astronomy proof of concept</p>
    <h1>Explore the <em>sky in time.</em></h1>
    <p class="hero-lede">Calculate the current Tithi and solar events for a local moment. This is the astronomy foundation—not an Ekadashi or Parana recommendation.</p>
  </section>
  <section class="section-wrap calculator-section"><AstronomyCalculator /></section>
</template>
