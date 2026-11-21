export interface ObserverLocation {
  latitude: number
  longitude: number
  elevationMeters: number
  timezone: string
}

export interface CelestialPosition {
  sunLongitude: number
  moonLongitude: number
  angularDifference: number
}

export interface SunriseResult {
  sunrise: Date | null
  sunset: Date | null
}

export interface AstronomyProvider {
  getPositions(date: Date): CelestialPosition
  getSunriseSunset(date: Date, location: ObserverLocation): SunriseResult
}
