/**
 * Compares engine output against the published 2026 Ekadashi dates.
 *
 * Run: npx tsx scripts/validate-engine.ts
 */
import { calculateEkadashis } from '../src/engine/index';
import { formatLocalTime } from '../src/engine/astronomy/time';
import { getCity } from '../src/data/cities';
import calendar from '../src/data/2026.json';
import type { YearCalendar } from '../src/data/schema';

const city = getCity('delhi')!;
const location = {
  latitude: city.lat,
  longitude: city.lon,
  elevation: city.elevation,
  timezone: city.timezone,
  label: city.name,
  source: 'city' as const,
};

const published = (calendar as YearCalendar).e.map((row) => {
  const ymd = String(row.s[0]);
  return { name: row.N, smarta: isoFrom(row.s[0]), vaishnava: isoFrom(row.v[0]) };
});

function isoFrom(ymd: number): string {
  const s = String(ymd);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

const output = calculateEkadashis(location, {
  count: 26,
  from: new Date('2026-01-01T00:00:00+05:30'),
});

console.log(`Engine: ${output.metadata.astronomyEngine}`);
console.log(`Ayanamsa: ${output.metadata.ayanamsa}`);
console.log(`Location: ${city.name} (${city.lat}, ${city.lon}) ${city.timezone}\n`);

let smartaMatches = 0;
let vaishnavaMatches = 0;

for (const result of output.results) {
  const { smarta, vaishnava } = result;
  const ref = published.find((p) => Math.abs(dayDiff(p.smarta, smarta.fastingDate)) <= 2);

  const smartaOk = ref?.smarta === smarta.fastingDate;
  const vaishnavaOk = ref?.vaishnava === vaishnava.fastingDate;
  if (smartaOk) smartaMatches += 1;
  if (vaishnavaOk) vaishnavaMatches += 1;

  const parana = smarta.parana.startUtc
    ? `${formatLocalTime(new Date(smarta.parana.startUtc), city.timezone)}` +
      (smarta.parana.endUtc
        ? `-${formatLocalTime(new Date(smarta.parana.endUtc), city.timezone)}`
        : ' onwards')
    : 'n/a';

  console.log(
    [
      (smarta.name ?? 'Unnamed').padEnd(32),
      `S ${smarta.fastingDate} ${smartaOk ? 'ok' : `!= ${ref?.smarta ?? '?'}`}`.padEnd(26),
      `V ${vaishnava.fastingDate} ${vaishnavaOk ? 'ok' : `!= ${ref?.vaishnava ?? '?'}`}`.padEnd(26),
      `paran ${parana}`.padEnd(26),
      smarta.flags.concat(vaishnava.flags).join(',') || '-',
    ].join(' '),
  );
}

function dayDiff(a: string, b: string): number {
  return (Date.parse(a) - Date.parse(b)) / 86_400_000;
}

console.log(
  `\nSmarta matches: ${smartaMatches}/${output.results.length}` +
    ` · Vaishnava matches: ${vaishnavaMatches}/${output.results.length}`,
);
