/**
 * Sunrise and sunset for a location.
 *
 * Convention: upper limb of the Sun at the visible horizon, refraction included
 * (Astronomy Engine's default for `SearchRiseSet`), corrected for observer elevation.
 */
import { Body, Observer, SearchRiseSet } from 'astronomy-engine';
import type { CalculationLocation, SolarDay } from '../types';
import { addMinutes, startOfCivilDay } from './time';

export const SUNRISE_CONVENTION = 'upper-limb, refracted, elevation-corrected';

/** Arunodaya for the Vaishnava (GCAL-compatible) profile. */
export const ARUNODAYA_MINUTES_BEFORE_SUNRISE = 96;

function observerFor(location: CalculationLocation): Observer {
  return new Observer(location.latitude, location.longitude, location.elevation);
}

/**
 * First sunrise at or after `from`. Returns null in polar conditions where the
 * Sun does not cross the horizon within the search window.
 */
export function nextSunrise(location: CalculationLocation, from: Date, limitDays = 2): Date | null {
  const event = SearchRiseSet(Body.Sun, observerFor(location), 1, from, limitDays);
  return event ? event.date : null;
}

export function nextSunset(location: CalculationLocation, from: Date, limitDays = 2): Date | null {
  const event = SearchRiseSet(Body.Sun, observerFor(location), -1, from, limitDays);
  return event ? event.date : null;
}

/**
 * Sunrise/sunset that belong to a civil date in the location's timezone.
 *
 * Searching from local midnight keeps the result on the intended civil day even
 * where the UTC day boundary falls in the middle of the local day.
 */
export function solarDay(location: CalculationLocation, date: string): SolarDay {
  const midnight = startOfCivilDay(date, location.timezone);
  const sunrise = nextSunrise(location, midnight);
  const sunset = sunrise ? nextSunset(location, sunrise) : nextSunset(location, midnight);

  return {
    date,
    sunrise,
    sunset,
    arunodaya: sunrise ? addMinutes(sunrise, -ARUNODAYA_MINUTES_BEFORE_SUNRISE) : null,
  };
}
