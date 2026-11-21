<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import { astronomyEngine, cities, findTithiInterval, calculateTithi } from '../../engine'
import type { City } from '../../engine/location/cities'

const selectedCityId = ref('hyderabad')
const city = computed(() => cities.find(item => item.id === selectedCityId.value) ?? cities[0]!)
const dateTime = ref('')
const latitude = ref(city.value.latitude)
const longitude = ref(city.value.longitude)
const timezone = ref(city.value.timezone)
const result = shallowRef<ReturnType<typeof calculate> | null>(null)
const errorMessage = ref('')

function calculate() {
  const localDateTime = Temporal.PlainDateTime.from(dateTime.value)
  const instant = new Date(Number(localDateTime.toZonedDateTime(timezone.value, { disambiguation: 'reject' }).epochMilliseconds))
  const location: City = {
    ...city.value,
    latitude: Number(latitude.value),
    longitude: Number(longitude.value),
    timezone: timezone.value
  }
  const position = astronomyEngine.getPositions(instant)
  return {
    ...position,
    tithi: calculateTithi(position.angularDifference),
    interval: findTithiInterval(astronomyEngine, instant),
    sunTimes: astronomyEngine.getSunriseSunset(instant, location)
  }
}

function runCalculation() {
  errorMessage.value = ''
  try {
    result.value = calculate()
  } catch (error) {
    result.value = null
    errorMessage.value = error instanceof Error ? error.message : String(error)
  }
}

function setCity(next: string) {
  selectedCityId.value = next
  latitude.value = city.value.latitude
  longitude.value = city.value.longitude
  timezone.value = city.value.timezone
  result.value = null
}

function localTime(value: Date | null) {
  return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: timezone.value }).format(value) : 'No sunrise/sunset found for this date'
}

onMounted(() => {
  dateTime.value = Temporal.Now.plainDateTimeISO(timezone.value).toString({ smallestUnit: 'minute' })
})

watch(timezone, () => { result.value = null })
</script>

<template>
  <div class="calculator-layout">
    <form class="calculator-form" @submit.prevent="runCalculation">
      <label class="form-field"><span>Test location</span>
        <select :value="selectedCityId" @change="setCity(($event.target as HTMLSelectElement).value)">
          <option v-for="item in cities" :key="item.id" :value="item.id">{{ item.name }}, {{ item.country }}</option>
          <option value="custom" disabled>Custom coordinates — edit below</option>
        </select>
      </label>
      <label class="form-field"><span>Local date and time</span><input v-model="dateTime" type="datetime-local" required /></label>
      <div class="form-row">
        <label class="form-field"><span>Latitude</span><input v-model.number="latitude" type="number" min="-90" max="90" step="any" required /></label>
        <label class="form-field"><span>Longitude</span><input v-model.number="longitude" type="number" min="-180" max="180" step="any" required /></label>
      </div>
      <label class="form-field"><span>IANA timezone</span><input v-model="timezone" placeholder="Asia/Kolkata" required /></label>
      <button class="button button-primary" type="submit">Calculate astronomy <span aria-hidden="true">→</span></button>
      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
      <p class="form-help">Calculations run in your browser. Your location is not sent to a server.</p>
    </form>

    <div class="calculator-results">
      <TithiDetails v-if="result" :tithi="result.tithi" :interval="result.interval" :timezone="timezone" :sun-longitude="result.sunLongitude" :moon-longitude="result.moonLongitude" />
      <div v-else class="empty-result"><span class="empty-symbol">☾</span><h2>Explore a moment in the lunar calendar.</h2><p>Choose a location and local date/time to calculate the Sun–Moon angle, current Tithi, boundary instants, and local sunrise and sunset.</p></div>
      <div v-if="result" class="solar-card">
        <div><span>Local sunrise</span><strong>{{ localTime(result.sunTimes.sunrise) }}</strong></div>
        <div><span>Local sunset</span><strong>{{ localTime(result.sunTimes.sunset) }}</strong></div>
      </div>
      <ParanaDetails />
    </div>
  </div>
</template>
