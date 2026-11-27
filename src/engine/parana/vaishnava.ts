/**
 * Vaishnava (GCAL-compatible) Parana.
 *
 * ParanaStart = max(Sunrise, HariVasaraEnd) — the fast is never broken during
 * Hari Vasara, the first quarter of Dwadashi.
 */
import type { ParanaResult, SolarDay, TithiInterval } from '../types';
import { civilDate } from '../astronomy/time';
import { classify, paranaGeometry } from './shared';

export const VAISHNAVA_PARANA_VERSION = 'VAISHNAVA_GCAL/parana@1.0.0';

export function vaishnavaParana(
  fastingDate: string,
  dwadashi: TithiInterval | null,
  paranaDaySolar: SolarDay | null,
  timezone: string,
): ParanaResult {
  const base: ParanaResult = {
    fastingDate,
    paranaDate: paranaDaySolar?.date ?? null,
    startUtc: null,
    endUtc: null,
    status: 'unavailable',
    hariVasaraEndUtc: null,
    explanation: [],
    ruleProfile: 'VAISHNAVA_GCAL',
    ruleVersion: VAISHNAVA_PARANA_VERSION,
  };

  if (!dwadashi) {
    return { ...base, explanation: ['Dwadashi boundaries unavailable, so Parana cannot be derived.'] };
  }
  if (!paranaDaySolar?.sunrise) {
    return {
      ...base,
      hariVasaraEndUtc: null,
      explanation: ['Sunrise unavailable for the Parana day, so Parana cannot be derived.'],
    };
  }

  const { hariVasaraEnd, end } = paranaGeometry(dwadashi, paranaDaySolar);
  const sunrise = paranaDaySolar.sunrise;
  const start = new Date(Math.max(sunrise.getTime(), hariVasaraEnd.getTime()));
  const status = classify(start, end, dwadashi.end);

  const explanation = [
    'Parana is taken on Dwadashi, after sunrise.',
    hariVasaraEnd.getTime() > sunrise.getTime()
      ? 'Hari Vasara (first quarter of Dwadashi) ends after sunrise, so Parana starts when it ends.'
      : 'Hari Vasara ends before sunrise, so Parana starts at sunrise.',
  ];

  if (status === 'window') {
    explanation.push(
      end && end.getTime() === dwadashi.end.getTime()
        ? 'Parana must finish before Dwadashi ends.'
        : 'Parana must finish within the first third of the day.',
    );
  } else if (status === 'after_time') {
    explanation.push('No pratah-kala window remains; break the fast after the start time, before Dwadashi ends.');
  } else {
    explanation.push('No valid Parana window could be derived for this day.');
  }

  return {
    ...base,
    paranaDate: civilDate(start, timezone),
    startUtc: start.toISOString(),
    endUtc: status === 'window' && end ? end.toISOString() : null,
    status,
    hariVasaraEndUtc: hariVasaraEnd.toISOString(),
    explanation,
  };
}
