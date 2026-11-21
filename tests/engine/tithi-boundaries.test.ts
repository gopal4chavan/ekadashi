import { describe, expect, it } from 'vitest'
import { findTithiInterval } from '../../engine/astronomy/tithi-boundaries'
import type { AstronomyProvider, CelestialPosition, ObserverLocation, SunriseResult } from '../../engine/astronomy/types'

class LinearProvider implements AstronomyProvider {
  getPositions(date: Date): CelestialPosition {
    const elapsedHours = (date.getTime() - Date.UTC(2026, 0, 1)) / 3_600_000
    const angle = (119 + elapsedHours * 0.5 + 360) % 360
    return { sunLongitude: 0, moonLongitude: angle, angularDifference: angle }
  }

  getSunriseSunset(_date: Date, _location: ObserverLocation): SunriseResult {
    return { sunrise: null, sunset: null }
  }
}

describe('findTithiInterval', () => {
  it('finds both Tithi transitions across the 120-degree boundary', () => {
    const instant = new Date(Date.UTC(2026, 0, 1, 4))
    const interval = findTithiInterval(new LinearProvider(), instant)
    expect(Math.abs(interval.start.getTime() - Date.UTC(2026, 0, 1, 2))).toBeLessThanOrEqual(1000)
    expect(Math.abs(interval.end.getTime() - Date.UTC(2026, 0, 2, 2))).toBeLessThanOrEqual(1000)
  })

  it('rejects invalid instants', () => {
    expect(() => findTithiInterval(new LinearProvider(), new Date(Number.NaN))).toThrow('A valid date is required.')
  })
})
