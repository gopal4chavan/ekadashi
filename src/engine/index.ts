/**
 * Ekadashi calculation engine.
 *
 * The same entry point serves the browser calculator and any precomputed
 * calendar generation, so the religious rules exist in exactly one place.
 */
import type { CalculationLocation, CalculationOutput } from './types';
import { isEkadashiIndex, tithiIntervals } from './astronomy/tithi';
import { AYANAMSA } from './astronomy/nakshatra';
import { SUNRISE_CONVENTION } from './astronomy/sun';
import { ekadashiName } from './names';
import { buildCandidates } from './rules/candidates';
import { resolveSmarta } from './rules/smarta';
import { resolveVaishnava } from './rules/vaishnava';

export const ASTRONOMY_ENGINE = 'astronomy-engine@2.1.19';

const SCAN_STEP_MINUTES = 180;
const DAYS_PER_EKADASHI = 15;
const MS_PER_DAY = 86_400_000;

export interface CalculateOptions {
  /** How many upcoming Ekadashis to resolve. 24 covers twelve months. */
  count?: number;
  /** Start of the search; defaults to now. */
  from?: Date;
}

export function calculateEkadashis(
  location: CalculationLocation,
  options: CalculateOptions = {},
): CalculationOutput {
  const { count = 24, from = new Date() } = options;

  // Pad the scan so the tithi around `from` and the Dwadashi after the last
  // Ekadashi are both fully bracketed.
  const scanStart = new Date(from.getTime() - 3 * MS_PER_DAY);
  const scanEnd = new Date(from.getTime() + (count * DAYS_PER_EKADASHI + 10) * MS_PER_DAY);
  const intervals = tithiIntervals(scanStart, scanEnd, SCAN_STEP_MINUTES);

  const results: CalculationOutput['results'] = [];

  for (const ekadashi of intervals.filter((t) => isEkadashiIndex(t.index))) {
    if (ekadashi.end.getTime() < from.getTime()) continue;
    if (results.length >= count) break;

    const candidates = buildCandidates(location, ekadashi, intervals);
    const smarta = resolveSmarta(location, candidates, null);
    const vaishnava = resolveVaishnava(location, candidates, null);

    // Both traditions observe the same Ekadashi, so one name covers the pair
    // even when the civil dates differ.
    const name = ekadashiName(ekadashi);

    results.push({
      smarta: { ...smarta, name },
      vaishnava: { ...vaishnava, name },
      datesDiffer: smarta.fastingDate !== vaishnava.fastingDate,
    });
  }

  return {
    metadata: {
      astronomyEngine: ASTRONOMY_ENGINE,
      ayanamsa: AYANAMSA,
      sunriseConvention: SUNRISE_CONVENTION,
      location,
      calculatedAtUtc: new Date().toISOString(),
    },
    results,
  };
}

export * from './types';
