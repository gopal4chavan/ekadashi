/**
 * Browser geolocation.
 *
 * Permission is requested only from a user gesture — never on page load.
 * Coordinates stay in memory; only the resolved label is cached.
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracyMetres: number;
}

export class GeolocationError extends Error {
  readonly code: 'unsupported' | 'denied' | 'unavailable' | 'timeout';

  constructor(code: GeolocationError['code'], message: string) {
    super(message);
    this.name = 'GeolocationError';
    this.code = code;
  }
}

const TIMEOUT_MS = 10000;

export function requestCoordinates(): Promise<Coordinates> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.reject(
      new GeolocationError('unsupported', 'This browser does not support location access.'),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMetres: position.coords.accuracy,
        }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new GeolocationError('denied', 'Location permission was denied.'));
        } else if (error.code === error.TIMEOUT) {
          reject(new GeolocationError('timeout', 'Location request timed out.'));
        } else {
          reject(new GeolocationError('unavailable', 'Location is currently unavailable.'));
        }
      },
      { enableHighAccuracy: true, timeout: TIMEOUT_MS, maximumAge: 0 },
    );
  });
}
