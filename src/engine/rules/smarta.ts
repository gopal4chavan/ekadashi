/**
 * SMARTA_DRIK — Drik-compatible Smarta fasting-day resolver.
 *
 * Documented rules (each is tested independently):
 * 1. Normal   — Ekadashi tithi is present at one sunrise; fast that day.
 * 2. Vriddhi  — present at two sunrises; Smarta fasts on the first.
 * 3. Kshaya   — present at no sunrise; fast on the day the tithi begins.
 *
 * This is deliberately not reduced to "Ekadashi exists at sunrise".
 */
import type { CalculationLocation, ObservanceResult } from '../types';
import { addDaysToCivilDate, civilDate } from '../astronomy/time';
import { smartaParana } from '../parana/smarta';
import type { EkadashiCandidates } from './candidates';

export const SMARTA_RULE_VERSION = 'SMARTA_DRIK@1.0.0';

export function resolveSmarta(
  location: CalculationLocation,
  candidates: EkadashiCandidates,
  name: string | null,
): ObservanceResult {
  const { ekadashi, dwadashi, days, sunriseDays } = candidates;
  const explanation: string[] = [];
  const flags: string[] = [];

  let fastingDate: string;

  if (sunriseDays.length === 1) {
    fastingDate = sunriseDays[0];
    explanation.push('Ekadashi tithi is present at sunrise on this day.');
  } else if (sunriseDays.length > 1) {
    fastingDate = sunriseDays[0];
    flags.push('vriddhi');
    explanation.push('Ekadashi tithi spans two sunrises (vriddhi).');
    explanation.push('The Smarta profile fasts on the first of the two days.');
  } else {
    fastingDate = civilDate(ekadashi.start, location.timezone);
    flags.push('kshaya');
    explanation.push('Ekadashi tithi begins and ends between two sunrises (kshaya).');
    explanation.push('The fast is kept on the day the tithi begins.');
  }

  const solar = days.get(fastingDate)?.solar ?? null;
  const paranaDay = days.get(addDaysToCivilDate(fastingDate, 1))?.solar ?? null;
  const parana = smartaParana(fastingDate, dwadashi, paranaDay, location.timezone);

  return {
    ruleProfile: 'SMARTA_DRIK',
    ruleVersion: SMARTA_RULE_VERSION,
    name,
    fastingDate,
    ekadashiStartUtc: ekadashi.start.toISOString(),
    ekadashiEndUtc: ekadashi.end.toISOString(),
    sunriseUtc: solar?.sunrise?.toISOString() ?? null,
    sunsetUtc: solar?.sunset?.toISOString() ?? null,
    arunodayaUtc: solar?.arunodaya?.toISOString() ?? null,
    parana,
    explanation,
    flags,
  };
}
