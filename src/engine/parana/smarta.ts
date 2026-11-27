/**
 * Smarta Parana — its own profile, not a reuse of the Vaishnava rules.
 *
 * ParanaStart = Sunrise on Dwadashi. The Smarta profile does not defer the
 * Parana to the end of Hari Vasara; Hari Vasara is reported for reference only.
 */
import type { ParanaResult, SolarDay, TithiInterval } from '../types';
import { civilDate } from '../astronomy/time';
import { classify, paranaGeometry } from './shared';

export const SMARTA_PARANA_VERSION = 'SMARTA_DRIK/parana@1.0.0';

export function smartaParana(
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
    ruleProfile: 'SMARTA_DRIK',
    ruleVersion: SMARTA_PARANA_VERSION,
  };

  if (!dwadashi) {
    return { ...base, explanation: ['Dwadashi boundaries unavailable, so Parana cannot be derived.'] };
  }
  if (!paranaDaySolar?.sunrise) {
    return { ...base, explanation: ['Sunrise unavailable for the Parana day, so Parana cannot be derived.'] };
  }

  const { hariVasaraEnd, end } = paranaGeometry(dwadashi, paranaDaySolar);
  const start = paranaDaySolar.sunrise;
  const status = classify(start, end, dwadashi.end);

  const explanation = ['Parana is taken on Dwadashi, after sunrise.'];
  if (status === 'window') {
    explanation.push(
      end && end.getTime() === dwadashi.end.getTime()
        ? 'Parana must finish before Dwadashi ends.'
        : 'Parana must finish within the first third of the day (pratah-kala).',
    );
  } else if (status === 'after_time') {
    explanation.push('No pratah-kala window remains; break the fast after sunrise, before Dwadashi ends.');
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
