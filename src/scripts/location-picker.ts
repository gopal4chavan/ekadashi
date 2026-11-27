/**
 * Wires the shared location header: the searchable city dropdown (with its GPS
 * action) and the status line.
 *
 * The caller receives a resolved location and decides what to render, so every
 * page shares one permission and storage flow.
 */
import type { CalculationLocation } from '../engine/types';
import { GeolocationError, requestCoordinates } from '../engine/location/geolocation';
import { locationFromCity, locationFromCoordinates } from '../engine/location/resolve';
import { initCityCombobox } from './city-combobox';

const STORAGE_KEY = 'ekadashi-calculator-city';
const FALLBACK_CITY = 'lucknow';

function readStoredCity(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || FALLBACK_CITY;
  } catch {
    return FALLBACK_CITY;
  }
}

function rememberCity(slug: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {
    // Storage is optional; private mode and quota failures are not fatal.
  }
}

export function initLocationPicker(
  root: HTMLElement,
  onLocation: (location: CalculationLocation) => void,
): void {
  const statusText = root.querySelector<HTMLElement>('[data-loc-text]');
  const errorBox = root.querySelector<HTMLElement>('[data-loc-error]');
  const comboboxRoot = root.querySelector<HTMLElement>('[data-city-combobox]');

  if (!comboboxRoot) {
    throw new Error('Location picker is missing its city combobox.');
  }

  const setStatus = (message: string) => {
    if (statusText) statusText.textContent = message;
  };

  const setError = (message: string | null) => {
    if (!errorBox) return;
    errorBox.hidden = !message;
    if (message) errorBox.textContent = message;
  };

  const initialCity = root.dataset.initialCity;
  const opensCityPage = root.dataset.cityNav === 'true';

  const combobox = initCityCombobox(comboboxRoot, {
    onCity: (slug) => {
      if (opensCityPage) {
        window.location.assign(`/ekadashi/${slug}`);
      } else {
        useCity(slug);
      }
    },
    onGps: () => void useGps(),
  });

  function useCity(slug: string, remember = true): void {
    const location = locationFromCity(slug);
    if (!location) {
      setError('That city is not in the list.');
      return;
    }

    setError(null);
    combobox.select(slug);
    combobox.setLabel(location.label);
    setStatus(`Showing ${location.label} · ${location.timezone}`);
    if (remember) rememberCity(slug);
    onLocation(location);
  }

  async function useGps(): Promise<void> {
    setStatus('Requesting location…');
    setError(null);

    try {
      const coords = await requestCoordinates();
      const resolved = locationFromCoordinates(coords);

      combobox.select(null);
      combobox.setLabel(resolved.location.label);
      setStatus(
        `${resolved.location.label} · ${resolved.location.timezone}` +
          ` · ±${Math.round(coords.accuracyMetres)} m` +
          (resolved.usedDeviceTimezone ? ' · timezone from your device' : ''),
      );
      onLocation(resolved.location);
    } catch (error) {
      setError(
        error instanceof GeolocationError
          ? `${error.message} Choose a city instead.`
          : 'Could not read your location. Choose a city instead.',
      );
      setStatus('Using the selected city.');
    }
  }

  useCity(initialCity ?? readStoredCity(), false);
}
