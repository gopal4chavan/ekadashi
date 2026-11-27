/**
 * Nakshatra from the Moon's sidereal longitude (27 x 13deg20' = 360deg).
 *
 * Ayanamsa: Lahiri (Chitrapaksha), approximated with the standard linear drift
 * from J2000. This is configurable because the Vaishnava profile may require a
 * different sidereal reference once validated.
 */
import { EclipticGeoMoon } from 'astronomy-engine';
import type { NakshatraInterval } from '../types';

const DEGREES_PER_NAKSHATRA = 360 / 27;
const BOUNDARY_PRECISION_MS = 1000;

export const AYANAMSA = 'Lahiri (Chitrapaksha)';

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const J2000 = Date.UTC(2000, 0, 1, 12);
const DAYS_PER_YEAR = 365.25;
const LAHIRI_AT_J2000 = 23.853;
const PRECESSION_DEGREES_PER_YEAR = 50.29 / 3600;

export function lahiriAyanamsa(instant: Date): number {
  const years = (instant.getTime() - J2000) / (DAYS_PER_YEAR * 86400000);
  return LAHIRI_AT_J2000 + years * PRECESSION_DEGREES_PER_YEAR;
}

export function siderealMoonLongitude(instant: Date): number {
  const tropical = EclipticGeoMoon(instant).lon;
  return (((tropical - lahiriAyanamsa(instant)) % 360) + 360) % 360;
}

export function nakshatraIndexAt(instant: Date): number {
  return Math.floor(siderealMoonLongitude(instant) / DEGREES_PER_NAKSHATRA);
}

function findBoundary(before: Date, after: Date): Date {
  let low = before.getTime();
  let high = after.getTime();
  const startIndex = nakshatraIndexAt(before);

  while (high - low > BOUNDARY_PRECISION_MS) {
    const mid = low + Math.floor((high - low) / 2);
    if (nakshatraIndexAt(new Date(mid)) === startIndex) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date(high);
}

/** Nakshatra active at `instant`, with its exact start and end. */
export function nakshatraAt(instant: Date | null, stepMinutes = 60): NakshatraInterval | null {
  if (!instant) return null;

  const stepMs = stepMinutes * 60000;
  const index = nakshatraIndexAt(instant);

  let back = instant;
  let guard = 0;
  while (nakshatraIndexAt(back) === index && guard < 48) {
    back = new Date(back.getTime() - stepMs);
    guard += 1;
  }

  let forward = instant;
  guard = 0;
  while (nakshatraIndexAt(forward) === index && guard < 48) {
    forward = new Date(forward.getTime() + stepMs);
    guard += 1;
  }

  return {
    index,
    name: NAKSHATRA_NAMES[index],
    start: findBoundary(back, new Date(back.getTime() + stepMs)),
    end: findBoundary(new Date(forward.getTime() - stepMs), forward),
  };
}
