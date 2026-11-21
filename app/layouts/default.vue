<script setup lang="ts">
const navigation = [
  { label: 'Calendar', to: '/ekadashi-calendar/' },
  { label: 'Calculator', to: '/ekadashi-calculator/' },
  { label: 'Guides', to: '/guides/what-is-ekadashi/' }
]
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <NuxtLink class="brand" to="/" aria-label="Ekadashi Calendar home">
        <span class="brand-mark">ॐ</span>
        <span>ekadashi</span>
      </NuxtLink>
      <nav class="main-nav" aria-label="Main navigation">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
      <NuxtLink class="header-cta" to="/ekadashi-calculator/">Explore the calculator <span aria-hidden="true">↗</span></NuxtLink>
    </header>

    <main id="main-content"><slot /></main>

    <footer class="site-footer">
      <NuxtLink class="brand footer-brand" to="/"><span class="brand-mark">ॐ</span><span>ekadashi</span></NuxtLink>
      <p>A thoughtful guide to Ekadashi, astronomy, and local observance.</p>
      <span class="footer-note">English · Worldwide</span>
    </footer>
  </div>
</template>
