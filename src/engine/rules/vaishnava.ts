/**
 * VAISHNAVA_GCAL — GCAL-compatible Vaishnava fasting-day resolver.
 *
 * Documented rules:
 * 1. Normal         — Ekadashi at sunrise and not Dashami-viddha; fast that day.
 * 2. Dashami-viddha — Dashami is still running at arunodaya (96 minutes before
 *                     sunrise); the fast moves to the next day.
 * 3. Vriddhi        — Ekadashi spans two sunrises; the later day is suddha.
 * 4. Kshaya         — no sunrise falls inside the tithi; the following day is used.
 *
 * Not implemented in this version: the eight Mahadvadashi types. Results are
 * labelled accordingly rather than guessed.
 */
import type { CalculationLocation, ObservanceResult } from '../types';
import { addDaysToCivilDate, civilDate } from '../astronomy/time';
import { isDashamiIndex } from '../astronomy/tithi';
import { vaishnavaParana } from '../parana/vaishnava';
import type { EkadashiCandidates } from './candidates';

export const VAISHNAVA_RULE_VERSION = 'VAISHNAVA_GCAL@1.0.0';

export const MAHADVADASHI_NOTE =
  'Mahadvadashi classification is not applied in this rule version.';

export function resolveVaishnava(
  location: CalculationLocation,
  candidates: EkadashiCandidates,
  name: string | null,
): ObservanceResult {
  const { ekadashi, dwadashi, days, sunriseDays } = candidates;
  const explanation: string[] = [];
  const flags: string[] = [];

  let fastingDate: string;

  if (sunriseDays.length > 1) {
    fastingDate = sunriseDays[sunriseDays.length - 1];
    flags.push('vriddhi');
    explanation.push('Ekadashi tithi spans two sunrises (vriddhi).');
    explanation.push('The Vaishnava profile fasts on the later, suddha day.');
  } else if (sunriseDays.length === 1) {
    fastingDate = sunriseDays[0];
    explanation.push('Ekadashi tithi is present at sunrise on this day.');
  } else {
    fastingDate = addDaysToCivilDate(civilDate(ekadashi.start, location.timezone), 1);
    flags.push('kshaya');
    explanation.push('No sunrise falls inside the Ekadashi tithi (kshaya).');
    explanation.push('The fast is kept on the following day.');
  }

  // Dashami-viddha: Dashami still running 96 minutes before sunrise.
  const arunodayaTithi = days.get(fastingDate)?.tithiAtArunodaya ?? null;
  if (arunodayaTithi && isDashamiIndex(arunodayaTithi.index)) {
    fastingDate = addDaysToCivilDate(fastingDate, 1);
    flags.push('dashami-viddha');
    explanation.push('Dashami was still running at arunodaya, 96 minutes before sunrise.');
    explanation.push('The fast moves to the next day so it is not Dashami-viddha.');
  } else if (arunodayaTithi) {
    explanation.push('Ekadashi is already running at arunodaya, so the day is not Dashami-viddha.');
  }

  // Detect — but do not resolve — the conditions under which a Mahadvadashi
  // would move the fast, so the UI can tell the user to verify locally.
  if (dwadashi) {
    const dwadashiSunrises = [...days.values()].filter(
      (day) => day.tithiAtSunrise?.index === dwadashi.index,
    ).length;

    if (dwadashiSunrises > 1 || sunriseDays.length > 1) {
      flags.push('possible-mahadvadashi');
      explanation.push(
        dwadashiSunrises > 1
          ? 'Dwadashi spans two sunrises, which some calendars treat as a Mahadvadashi.'
          : 'Ekadashi spans two sunrises, which some calendars treat as a Mahadvadashi.',
      );
    }
  }

  explanation.push(MAHADVADASHI_NOTE);

  const solar = days.get(fastingDate)?.solar ?? null;
  const paranaDay = days.get(addDaysToCivilDate(fastingDate, 1))?.solar ?? null;
  const parana = vaishnavaParana(fastingDate, dwadashi, paranaDay, location.timezone);

  return {
    ruleProfile: 'VAISHNAVA_GCAL',
    ruleVersion: VAISHNAVA_RULE_VERSION,
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
