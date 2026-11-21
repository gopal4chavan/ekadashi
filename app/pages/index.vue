<script setup lang="ts">
usePageMetadata({
  title: 'Ekadashi Calendar, Tithi & Parana Guide',
  description: 'Explore Ekadashi dates, learn how Parana works, and preview astronomy-based Tithi calculations for your location.',
  path: '/'
})
</script>

<template>
  <section class="hero section-wrap">
    <div class="hero-copy">
      <p class="eyebrow"><span class="eyebrow-dot" /> A clearer way to observe</p>
      <h1>Ekadashi, <em>with clarity.</em></h1>
      <p class="hero-lede">A thoughtful calendar and astronomy-led guide to Ekadashi, local sunrise, Tithi, and Parana—built for your place in the world.</p>
      <div class="hero-actions"><NuxtLink class="button button-primary" to="/ekadashi-calculator/">Try the astronomy calculator <span>→</span></NuxtLink><NuxtLink class="button button-quiet" to="/ekadashi-calendar/">Explore the calendar</NuxtLink></div>
    </div>
    <div class="hero-art" aria-hidden="true"><span class="orbit orbit-one" /><span class="orbit orbit-two" /><span class="hero-moon">☾</span><span class="hero-star">✦</span></div>
  </section>

  <section class="section-wrap intro-section">
    <div><p class="eyebrow muted">A reliable foundation</p><h2>Understand the sky.<br /><em>Honor the tradition.</em></h2></div>
    <p class="intro-copy">The Moon and Sun help determine Tithi; local sunrise and tradition inform observance. We’re building these layers carefully and keeping unverified fasting dates out of the calendar until they’re checked against trusted references.</p>
  </section>

  <section class="section-wrap link-section" aria-labelledby="explore-title">
    <div class="section-heading"><div><p class="eyebrow muted">Explore</p><h2 id="explore-title">A calendar you can trust begins with clear answers.</h2></div></div>
    <div class="link-grid">
      <NuxtLink class="link-card" to="/ekadashi-calendar/"><span class="card-index">01 / CALENDAR</span><h3>Ekadashi calendar</h3><p>See the calendar roadmap and how Smarta and Vaishnava dates will be presented.</p><span class="card-arrow">↗</span></NuxtLink>
      <NuxtLink class="link-card" to="/ekadashi-dates/2027/"><span class="card-index">02 / 2027</span><h3>Ekadashi dates 2027</h3><p>A year-specific page, ready for verified observance dates and local timings.</p><span class="card-arrow">↗</span></NuxtLink>
      <NuxtLink class="link-card" to="/ekadashi-calculator/"><span class="card-index">03 / CALCULATOR</span><h3>Explore Tithi</h3><p>Run a browser-based astronomy proof of concept for a date and location.</p><span class="card-arrow">↗</span></NuxtLink>
    </div>
  </section>

  <section class="section-wrap method-band"><span class="method-icon">✺</span><div><p class="eyebrow muted">What we’re validating first</p><h2>Solar and lunar positions, local sunrise, and Tithi boundaries.</h2><p>Read <NuxtLink to="/guides/what-is-ekadashi/">what Ekadashi means</NuxtLink> or learn <NuxtLink to="/guides/how-parana-works/">how Parana is determined</NuxtLink>.</p></div></section>
</template>
