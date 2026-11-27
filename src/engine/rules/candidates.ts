/**
 * Day candidates for one Ekadashi tithi — the input both rule profiles resolve.
 *
 * A candidate is a civil day whose sunrise falls inside the Ekadashi tithi.
 * Zero candidates means kshaya (the tithi fits between two sunrises); two means
 * vriddhi (it spans two sunrises). The profiles resolve those cases differently.
 */
import type { CalculationLocation, DailyPanchang, TithiInterval } from '../types';
import { addDaysToCivilDate, civilDate } from '../astronomy/time';
import { dailyPanchang } from '../panchang/daily-panchang';

export interface EkadashiCandidates {
  ekadashi: TithiInterval;
  dwadashi: TithiInterval | null;
  /** Panchang for every day the tithi can touch, keyed by civil date. */
  days: Map<string, DailyPanchang>;
  /** Civil dates whose sunrise falls inside the Ekadashi tithi. */
  sunriseDays: string[];
}

export function buildCandidates(
  location: CalculationLocation,
  ekadashi: TithiInterval,
  intervals: TithiInterval[],
): EkadashiCandidates {
  const firstDay = addDaysToCivilDate(civilDate(ekadashi.start, location.timezone), -1);
  const days = new Map<string, DailyPanchang>();

  for (let offset = 0; offset <= 3; offset += 1) {
    const date = addDaysToCivilDate(firstDay, offset);
    days.set(date, dailyPanchang(location, date, intervals));
  }

  const sunriseDays = [...days.values()]
    .filter((day) => day.tithiAtSunrise?.index === ekadashi.index)
    .map((day) => day.date);

  const dwadashi = intervals.find((t) => t.start.getTime() === ekadashi.end.getTime()) ?? null;

  return { ekadashi, dwadashi, days, sunriseDays };
}
