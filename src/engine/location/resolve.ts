/**
 * Turns raw coordinates or a city choice into a CalculationLocation.
 *
 * A nearby listed city supplies a verified timezone and elevation. Beyond that
 * radius the device timezone is used, and the UI must disclose it so the
 * visitor can correct it.
 */
import { getCity, nearestCity } from '../../data/cities';
import type { CalculationLocation } from '../types';
import type { Coordinates } from './geolocation';

/** Within this distance a listed city's timezone and elevation are trustworthy. */
const CITY_MATCH_RADIUS_KM = 120;

export interface ResolvedLocation {
  location: CalculationLocation;
  /** True when timezone/elevation came from the device rather than city data. */
  usedDeviceTimezone: boolean;
  nearestCityName: string;
  distanceKm: number;
}

function deviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function locationFromCity(slug: string): CalculationLocation | null {
  const city = getCity(slug);
  if (!city) return null;

  return {
    latitude: city.lat,
    longitude: city.lon,
    elevation: city.elevation,
    timezone: city.timezone,
    label: city.name,
    source: 'city',
  };
}

export function locationFromCoordinates(coords: Coordinates): ResolvedLocation {
  const { city, distanceKm } = nearestCity(coords.latitude, coords.longitude);
  const withinCity = distanceKm <= CITY_MATCH_RADIUS_KM;

  return {
    location: {
      latitude: coords.latitude,
      longitude: coords.longitude,
      elevation: withinCity ? city.elevation : 0,
      timezone: withinCity ? city.timezone : deviceTimezone(),
      label: withinCity ? `Near ${city.name}` : 'Your location',
      source: 'gps',
      accuracyMetres: coords.accuracyMetres,
    },
    usedDeviceTimezone: !withinCity,
    nearestCityName: city.name,
    distanceKm,
  };
}
