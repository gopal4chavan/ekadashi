import type { AstronomyProvider } from './types'
import { normalizeAngle } from './tithi'

const SAMPLE_STEP_MS = 3 * 60 * 60 * 1000
const SEARCH_LIMIT_MS = 3 * 24 * 60 * 60 * 1000
const TIME_TOLERANCE_MS = 1000

export interface TithiInterval {
  start: Date
  end: Date
}

function forwardAngle(from: number, to: number): number {
  return normalizeAngle(to - from)
}

function sector(angle: number): number {
  return Math.floor(normalizeAngle(angle) / 12)
}

function bisectBoundary(
  provider: AstronomyProvider,
  lower: Date,
  upper: Date,
  boundaryOffset: number,
  lowerAngle: number
): Date {
  let low = lower.getTime()
  let high = upper.getTime()

  while (high - low > TIME_TOLERANCE_MS) {
    const middle = Math.floor((low + high) / 2)
    const middleAngle = provider.getPositions(new Date(middle)).angularDifference
    if (forwardAngle(lowerAngle, middleAngle) < boundaryOffset) low = middle
    else high = middle
  }

  return new Date(Math.round((low + high) / 2))
}

function findPreviousBoundary(provider: AstronomyProvider, instant: Date): Date {
  const endMs = instant.getTime()
  const endAngle = normalizeAngle(provider.getPositions(instant).angularDifference)
  const endSector = sector(endAngle)

  for (let offset = SAMPLE_STEP_MS; offset <= SEARCH_LIMIT_MS; offset += SAMPLE_STEP_MS) {
    const lower = new Date(endMs - offset)
    const lowerAngle = normalizeAngle(provider.getPositions(lower).angularDifference)
    if (sector(lowerAngle) !== endSector) {
      const boundaryAngle = endSector * 12
      const boundaryOffset = forwardAngle(lowerAngle, boundaryAngle)
      return bisectBoundary(provider, lower, new Date(endMs - offset + SAMPLE_STEP_MS), boundaryOffset, lowerAngle)
    }
  }

  throw new Error('Could not find the start of this Tithi within three days.')
}

function findNextBoundary(provider: AstronomyProvider, instant: Date): Date {
  const startMs = instant.getTime()
  const startAngle = normalizeAngle(provider.getPositions(instant).angularDifference)
  const startSector = sector(startAngle)

  for (let offset = SAMPLE_STEP_MS; offset <= SEARCH_LIMIT_MS; offset += SAMPLE_STEP_MS) {
    const upper = new Date(startMs + offset)
    const upperAngle = normalizeAngle(provider.getPositions(upper).angularDifference)
    if (sector(upperAngle) !== startSector) {
      const boundaryAngle = normalizeAngle((startSector + 1) * 12)
      const lower = new Date(startMs + offset - SAMPLE_STEP_MS)
      const lowerAngle = normalizeAngle(provider.getPositions(lower).angularDifference)
      const boundaryOffset = forwardAngle(lowerAngle, boundaryAngle)
      return bisectBoundary(provider, lower, upper, boundaryOffset, lowerAngle)
    }
  }

  throw new Error('Could not find the end of this Tithi within three days.')
}

export function findTithiInterval(provider: AstronomyProvider, instant: Date): TithiInterval {
  if (!Number.isFinite(instant.getTime())) throw new Error('A valid date is required.')
  return {
    start: findPreviousBoundary(provider, instant),
    end: findNextBoundary(provider, instant)
  }
}
