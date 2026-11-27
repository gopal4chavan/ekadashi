/**
 * Compact timing tuple — numbers only for small JSON:
 * [fastYMD (YYYYMMDD), tithiStartHHMM, tithiEndHHMM, sunriseHHMM, hariVasaraEndHHMM, paranaStartHHMM, paranaEndHHMM]
 * HHMM is 0–2359 local time. Tithi may start previous calendar day; UI labels handle that.
 */
export type PackedTiming = [
  fastYmd: number,
  tithiStartHHMM: number,
  tithiEndHHMM: number,
  sunriseHHMM: number,
  hariVasaraEndHHMM: number,
  paranaStartHHMM: number,
  paranaEndHHMM: number,
];

export type EkadashiRow = {
  n: string;
  N: string;
  s: PackedTiming;
  v: PackedTiming;
};

export type YearCalendar = {
  y: number;
  /** City slug timings were computed for */
  b: string;
  e: EkadashiRow[];
};
