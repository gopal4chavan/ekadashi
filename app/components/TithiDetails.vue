<script setup lang="ts">
import type { TithiInfo } from '../../engine/astronomy/tithi'

defineProps<{
  tithi: TithiInfo
  interval: { start: Date; end: Date }
  timezone: string
  sunLongitude: number
  moonLongitude: number
}>()

function localDateTime(value: Date, timezone: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: timezone
  }).format(value)
}
</script>

<template>
  <section class="result-card" aria-live="polite">
    <p class="eyebrow">Astronomical snapshot</p>
    <div class="result-main">
      <div><p class="result-label">Current tithi</p><h2>{{ tithi.paksha }} {{ tithi.name }}</h2></div>
      <p class="angle-value">{{ tithi.angle.toFixed(3) }}°</p>
    </div>
    <div class="result-grid">
      <div><span>Begins · local</span><strong>{{ localDateTime(interval.start, timezone) }}</strong></div>
      <div><span>Ends · local</span><strong>{{ localDateTime(interval.end, timezone) }}</strong></div>
      <div><span>Sun longitude</span><strong>{{ sunLongitude.toFixed(4) }}°</strong></div>
      <div><span>Moon longitude</span><strong>{{ moonLongitude.toFixed(4) }}°</strong></div>
    </div>
    <p class="result-footnote">Tithi is derived from the apparent Sun–Moon longitude difference. These astronomy results are a research preview, not a fasting or Parana instruction.</p>
  </section>
</template>
