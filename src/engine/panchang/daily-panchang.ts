/** Combines astronomy with a location's civil calendar. */
import type { CalculationLocation, DailyPanchang, TithiInterval } from '../types';
import { nakshatraAt } from '../astronomy/nakshatra';
import { solarDay } from '../astronomy/sun';
import { tithiAt } from '../astronomy/tithi';

export function dailyPanchang(
  location: CalculationLocation,
  date: string,
  intervals: TithiInterval[],
): DailyPanchang {
  const solar = solarDay(location, date);

  return {
    date,
    solar,
    tithiAtSunrise: tithiAt(intervals, solar.sunrise),
    tithiAtArunodaya: tithiAt(intervals, solar.arunodaya),
    nakshatraAtSunrise: nakshatraAt(solar.sunrise),
  };
}
