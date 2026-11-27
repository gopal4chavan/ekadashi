/**
 * Parana geometry shared by both profiles.
 *
 * HariVasaraEnd = DwadashiStart + DwadashiDuration / 4
 * ThirdOfDay    = Sunrise + (Sunset - Sunrise) / 3
 * ParanaEnd     = min(DwadashiEnd, ThirdOfDay)
 *
 * A missing or inverted window is reported as such; times are never invented.
 */
import type { ParanaStatus, SolarDay, TithiInterval } from '../types';

export interface ParanaGeometry {
  hariVasaraEnd: Date;
  thirdOfDay: Date | null;
  end: Date | null;
}

export function hariVasaraEnd(dwadashi: TithiInterval): Date {
  const quarter = (dwadashi.end.getTime() - dwadashi.start.getTime()) / 4;
  return new Date(dwadashi.start.getTime() + quarter);
}

export function thirdOfDay(solar: SolarDay): Date | null {
  if (!solar.sunrise || !solar.sunset) return null;
  const daylight = solar.sunset.getTime() - solar.sunrise.getTime();
  return new Date(solar.sunrise.getTime() + daylight / 3);
}

export function paranaGeometry(dwadashi: TithiInterval, solar: SolarDay): ParanaGeometry {
  const third = thirdOfDay(solar);
  const end = third
    ? new Date(Math.min(dwadashi.end.getTime(), third.getTime()))
    : dwadashi.end;

  return { hariVasaraEnd: hariVasaraEnd(dwadashi), thirdOfDay: third, end };
}

/**
 * Classifies a window.
 * - `window`     — a usable start/end pair.
 * - `after_time` — the start is known but no pratah-kala window remains before
 *                  Dwadashi ends; the fast is broken after `start`.
 * - `unavailable` — the inputs do not define a valid Parana for this profile.
 */
export function classify(start: Date | null, end: Date | null, dwadashiEnd: Date): ParanaStatus {
  if (!start) return 'unavailable';
  if (end && start.getTime() < end.getTime()) return 'window';
  if (start.getTime() < dwadashiEnd.getTime()) return 'after_time';
  return 'unavailable';
}
