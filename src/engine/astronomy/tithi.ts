/**
 * Tithi boundaries from the Moon–Sun elongation.
 *
 * A tithi spans 12 degrees of elongation, so the ayanamsa cancels out: only the
 * difference between the two apparent longitudes matters. Boundaries are found
 * by bisection to one-second resolution.
 */
import { EclipticGeoMoon, SunPosition } from 'astronomy-engine';
import type { TithiInterval } from '../types';

const DEGREES_PER_TITHI = 12;
const TITHI_PER_CYCLE = 30;
const BOUNDARY_PRECISION_MS = 1000;

const SHUKLA_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
];

const KRISHNA_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

/** Tithi indices for Ekadashi in each paksha. */
export const SHUKLA_EKADASHI_INDEX = 10;
export const KRISHNA_EKADASHI_INDEX = 25;

export function isEkadashiIndex(index: number): boolean {
  return index === SHUKLA_EKADASHI_INDEX || index === KRISHNA_EKADASHI_INDEX;
}

export function isDashamiIndex(index: number): boolean {
  return index === SHUKLA_EKADASHI_INDEX - 1 || index === KRISHNA_EKADASHI_INDEX - 1;
}

export function isDwadashiIndex(index: number): boolean {
  return index === SHUKLA_EKADASHI_INDEX + 1 || index === KRISHNA_EKADASHI_INDEX + 1;
}

/** Moon longitude minus Sun longitude, normalised to [0, 360). */
export function elongation(instant: Date): number {
  const sun = SunPosition(instant);
  const moon = EclipticGeoMoon(instant);
  return (((moon.lon - sun.elon) % 360) + 360) % 360;
}

export function tithiIndexAt(instant: Date): number {
  return Math.floor(elongation(instant) / DEGREES_PER_TITHI);
}

function describe(index: number): Pick<TithiInterval, 'index' | 'number' | 'paksha' | 'name'> {
  const paksha = index < 15 ? 'shukla' : 'krishna';
  const within = index % 15;
  const names = paksha === 'shukla' ? SHUKLA_NAMES : KRISHNA_NAMES;
  return { index, number: within + 1, paksha, name: names[within] };
}

/**
 * Instant at which the tithi index changes, bracketed by [before, after].
 * Elongation increases monotonically, so a plain bisection converges.
 */
function findBoundary(before: Date, after: Date): Date {
  let low = before.getTime();
  let high = after.getTime();
  const startIndex = tithiIndexAt(before);

  while (high - low > BOUNDARY_PRECISION_MS) {
    const mid = low + Math.floor((high - low) / 2);
    if (tithiIndexAt(new Date(mid)) === startIndex) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date(high);
}

/**
 * All tithi intervals overlapping [from, to]. The first and last intervals are
 * extended backwards/forwards so their true start and end instants are exact.
 */
export function tithiIntervals(from: Date, to: Date, stepMinutes = 60): TithiInterval[] {
  const stepMs = stepMinutes * 60000;
  const intervals: TithiInterval[] = [];

  let cursor = from;
  let cursorIndex = tithiIndexAt(cursor);
  let currentStart = findStartOfTithiContaining(cursor, cursorIndex, stepMs);

  while (cursor.getTime() <= to.getTime()) {
    const next = new Date(cursor.getTime() + stepMs);
    const nextIndex = tithiIndexAt(next);

    if (nextIndex !== cursorIndex) {
      const boundary = findBoundary(cursor, next);
      intervals.push({ ...describe(cursorIndex), start: currentStart, end: boundary });
      currentStart = boundary;
      cursorIndex = nextIndex;
    }

    cursor = next;
  }

  // Close the final, still-open interval by searching forward for its end.
  let tail = cursor;
  let guard = 0;
  while (tithiIndexAt(tail) === cursorIndex && guard < 48) {
    tail = new Date(tail.getTime() + stepMs);
    guard += 1;
  }
  intervals.push({
    ...describe(cursorIndex),
    start: currentStart,
    end: findBoundary(new Date(tail.getTime() - stepMs), tail),
  });

  return intervals;
}

/** Walks backwards to the exact start of the tithi active at `instant`. */
function findStartOfTithiContaining(instant: Date, index: number, stepMs: number): Date {
  let probe = instant;
  let guard = 0;

  while (tithiIndexAt(probe) === index && guard < 48) {
    probe = new Date(probe.getTime() - stepMs);
    guard += 1;
  }

  return findBoundary(probe, new Date(probe.getTime() + stepMs));
}

/** The tithi interval containing `instant`, or null when it is outside the list. */
export function tithiAt(intervals: TithiInterval[], instant: Date | null): TithiInterval | null {
  if (!instant) return null;
  const time = instant.getTime();
  return (
    intervals.find((t) => t.start.getTime() <= time && time < t.end.getTime()) ?? null
  );
}
