import * as Astronomy from 'astronomy-engine'
import { Temporal } from '@js-temporal/polyfill'
import type { AstronomyProvider, CelestialPosition, ObserverLocation, SunriseResult } from './types'

function normalizeDegrees(angle: number): number {
  return ((angle % 360) + 360) % 360
}

export class AstronomyEngineProvider implements AstronomyProvider {
  getPositions(date: Date): CelestialPosition {
    const angularDifference = normalizeDegrees(
      Astronomy.PairLongitude(Astronomy.Body.Moon, Astronomy.Body.Sun, date)
    )
    const sunLongitude = normalizeDegrees(Astronomy.SunPosition(date).elon)

    return {
      sunLongitude,
      moonLongitude: normalizeDegrees(sunLongitude + angularDifference),
      angularDifference
    }
  }

  getSunriseSunset(date: Date, location: ObserverLocation): SunriseResult {
    const instant = Temporal.Instant.from(date.toISOString())
    const localDate = instant.toZonedDateTimeISO(location.timezone).toPlainDate()
    const localMidnight = localDate.toZonedDateTime({
      timeZone: location.timezone,
      plainTime: '00:00'
    })
    const startOfLocalDay = new Date(Number(localMidnight.epochMilliseconds))
    const observer = new Astronomy.Observer(
      location.latitude,
      location.longitude,
      location.elevationMeters
    )

    const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, startOfLocalDay, 1)
    const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startOfLocalDay, 1)

    return {
      sunrise: sunrise?.date ?? null,
      sunset: sunset?.date ?? null
    }
  }
}

export const astronomyEngine = new AstronomyEngineProvider()
