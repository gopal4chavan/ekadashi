/**
 * Shared engine contracts.
 *
 * Every instant is stored as a UTC `Date`. Civil dates are ISO `YYYY-MM-DD`
 * strings resolved in the location's own timezone, never the device timezone.
 */

export type RuleProfile = 'SMARTA_DRIK' | 'VAISHNAVA_GCAL';

export type LocationSource = 'gps' | 'city' | 'manual';

export interface CalculationLocation {
  latitude: number;
  longitude: number;
  /** Metres above sea level. */
  elevation: number;
  /** IANA timezone, e.g. `Asia/Kolkata`. */
  timezone: string;
  label: string;
  source: LocationSource;
  /** GPS accuracy in metres when reported by the browser. */
  accuracyMetres?: number;
}

export interface SolarDay {
  /** Civil date in the location's timezone. */
  date: string;
  sunrise: Date | null;
  sunset: Date | null;
  /** Profile-specific pre-sunrise reference instant. */
  arunodaya: Date | null;
}

export interface TithiInterval {
  /** 0-based index within the lunar month: 10 = Shukla Ekadashi, 25 = Krishna Ekadashi. */
  index: number;
  /** 1-based tithi number within its paksha (1..15). */
  number: number;
  paksha: 'shukla' | 'krishna';
  name: string;
  start: Date;
  end: Date;
}

export interface NakshatraInterval {
  index: number;
  name: string;
  start: Date;
  end: Date;
}

export interface DailyPanchang {
  date: string;
  solar: SolarDay;
  tithiAtSunrise: TithiInterval | null;
  tithiAtArunodaya: TithiInterval | null;
  nakshatraAtSunrise: NakshatraInterval | null;
}

export interface EkadashiEvent {
  /** The Ekadashi tithi interval itself. */
  ekadashi: TithiInterval;
  /** The Dwadashi that follows it — required for Parana. */
  dwadashi: TithiInterval | null;
}

export type ParanaStatus = 'window' | 'after_time' | 'unavailable';

export interface ParanaResult {
  /** Civil date of the fast. */
  fastingDate: string;
  /** Civil date on which the fast is broken (Dwadashi). */
  paranaDate: string | null;
  startUtc: string | null;
  endUtc: string | null;
  status: ParanaStatus;
  /** Hari Vasara end — first quarter of Dwadashi. */
  hariVasaraEndUtc: string | null;
  explanation: string[];
  ruleProfile: RuleProfile;
  ruleVersion: string;
}

export interface ObservanceResult {
  ruleProfile: RuleProfile;
  ruleVersion: string;
  /** Display name, e.g. `Utpanna Ekadashi`, or null when unnamed. */
  name: string | null;
  fastingDate: string;
  ekadashiStartUtc: string;
  ekadashiEndUtc: string;
  sunriseUtc: string | null;
  sunsetUtc: string | null;
  arunodayaUtc: string | null;
  parana: ParanaResult;
  /** Human-readable reasons for the chosen date — shown in the UI. */
  explanation: string[];
  /** Vriddhi / kshaya / dashami-viddha flags that changed the result. */
  flags: string[];
}

export interface CalculationMetadata {
  astronomyEngine: string;
  ayanamsa: string;
  sunriseConvention: string;
  location: CalculationLocation;
  calculatedAtUtc: string;
}

export interface CalculationOutput {
  metadata: CalculationMetadata;
  results: Array<{
    smarta: ObservanceResult;
    vaishnava: ObservanceResult;
    /** True when the two traditions fast on different civil dates. */
    datesDiffer: boolean;
  }>;
}
