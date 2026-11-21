import type { CelestialPosition } from './types'

export interface ReferenceCase {
  id: string
  source: string
  instantUtc: string
  location: { latitude: number; longitude: number; elevationMeters: number; timezone: string }
  expected: CelestialPosition & { sunriseUtc?: string; sunsetUtc?: string }
}

export interface ComparisonResult {
  sunLongitudeDifference: number
  moonLongitudeDifference: number
  angularDifferenceDifference: number
  sunriseDifferenceSeconds?: number
  sunsetDifferenceSeconds?: number
}

function signedAngularDifference(actual: number, expected: number): number {
  return ((actual - expected + 540) % 360) - 180
}

export function comparePositions(actual: CelestialPosition, expected: CelestialPosition): ComparisonResult {
  return {
    sunLongitudeDifference: signedAngularDifference(actual.sunLongitude, expected.sunLongitude),
    moonLongitudeDifference: signedAngularDifference(actual.moonLongitude, expected.moonLongitude),
    angularDifferenceDifference: signedAngularDifference(actual.angularDifference, expected.angularDifference)
  }
}
