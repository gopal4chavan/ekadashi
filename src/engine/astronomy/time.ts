/** Civil-date helpers that always resolve in the location's timezone. */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Civil date (`YYYY-MM-DD`) of an instant in the given IANA timezone. */
export function civilDate(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

/** Offset (minutes east of UTC) that the timezone uses at the given instant. */
export function timezoneOffsetMinutes(instant: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);

  const value = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour') % 24,
    value('minute'),
    value('second'),
  );

  return Math.round((asUtc - instant.getTime()) / 60000);
}

/** Instant of local midnight that starts the given civil date in `timezone`. */
export function startOfCivilDay(date: string, timezone: string): Date {
  const match = ISO_DATE.exec(date);
  if (!match) throw new Error(`Invalid civil date: ${date}`);

  const [, year, month, day] = match;
  const naiveUtc = Date.UTC(Number(year), Number(month) - 1, Number(day));

  // Offset can differ either side of a DST change, so resolve it twice.
  const firstGuess = new Date(naiveUtc - timezoneOffsetMinutes(new Date(naiveUtc), timezone) * 60000);
  const offset = timezoneOffsetMinutes(firstGuess, timezone);
  return new Date(naiveUtc - offset * 60000);
}

export function addDaysToCivilDate(date: string, days: number): string {
  const match = ISO_DATE.exec(date);
  if (!match) throw new Error(`Invalid civil date: ${date}`);

  const [, year, month, day] = match;
  const shifted = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + days));
  return shifted.toISOString().slice(0, 10);
}

export function addMinutes(instant: Date, minutes: number): Date {
  return new Date(instant.getTime() + minutes * 60000);
}

/** Formats an instant as local clock time for the location, e.g. `6:39 AM`. */
export function formatLocalTime(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(instant);
}

/** Formats an instant as a local date, e.g. `Fri, 4 Dec 2026`. */
export function formatLocalDate(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(instant);
}

/** Formats a civil date string without re-deriving an instant. */
export function formatCivilDate(date: string, timezone: string): string {
  return formatLocalDate(startOfCivilDay(date, timezone), timezone);
}
