/** Formatting shared by the calculator and the calendar page. */
import { formatLocalDate, formatLocalTime } from '../engine/astronomy/time';
import type { ParanaResult } from '../engine/types';

/**
 * Renders a civil date (`YYYY-MM-DD`) that is already resolved in the
 * location's timezone, so it must not be shifted again.
 */
export function formatFastingDate(civilDate: string): string {
  return formatLocalDate(new Date(`${civilDate}T12:00:00Z`), 'UTC');
}

/** Parana as date + window, or date + "after <time>" when no window remains. */
export function formatParanaWindow(parana: ParanaResult, timezone: string): string {
  if (!parana.startUtc) return 'Not available';

  const start = new Date(parana.startUtc);
  const date = formatLocalDate(start, timezone);
  const startTime = formatLocalTime(start, timezone);

  if (parana.status === 'window' && parana.endUtc) {
    return `${date}, ${startTime} – ${formatLocalTime(new Date(parana.endUtc), timezone)}`;
  }

  return `${date}, after ${startTime}`;
}

/** Parana clock window only, for dense list rows. */
export function formatParanaTimes(parana: ParanaResult, timezone: string): string {
  if (!parana.startUtc) return 'n/a';

  const startTime = formatLocalTime(new Date(parana.startUtc), timezone);
  if (parana.status === 'window' && parana.endUtc) {
    return `${startTime} – ${formatLocalTime(new Date(parana.endUtc), timezone)}`;
  }

  return `after ${startTime}`;
}
