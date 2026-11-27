/**
 * Ekadashi names, derived from the lunar month and paksha.
 *
 * The lunar month (amanta, new moon to new moon) is named after the sidereal
 * sign the Sun occupies at the new moon that starts it: Meena gives Chaitra,
 * Mesha gives Vaishakha, and so on. A month whose two new moons find the Sun in
 * the same sign contains no sankranti and is the adhika (extra) month.
 *
 * Shukla Ekadashis are named by that month. Krishna Ekadashis follow the
 * purnimanta convention, so they take the name of the following month — for
 * example the Krishna Ekadashi of amanta Kartika is Utpanna.
 */
import { SunPosition } from 'astronomy-engine';
import { lahiriAyanamsa } from './astronomy/nakshatra';
import { elongation } from './astronomy/tithi';
import type { TithiInterval } from './types';

const MS_PER_DAY = 86_400_000;
const SYNODIC_MONTH_DAYS = 29.530588;
const MEAN_ELONGATION_DEGREES_PER_DAY = 360 / SYNODIC_MONTH_DAYS;
const SEARCH_WINDOW_DAYS = 4;
const PRECISION_MS = 1000;
const DEGREES_PER_SIGN = 30;
const MONTHS = 12;

/** Indexed from Chaitra. */
const SHUKLA_NAMES = [
  'Kamada', 'Mohini', 'Nirjala', 'Devshayani', 'Shravana Putrada', 'Parivartini',
  'Papankusha', 'Prabodhini', 'Mokshada (Vaikuntha)', 'Pausha Putrada', 'Jaya', 'Amalaki',
];

/** Indexed from Chaitra, by the purnimanta month. */
const KRISHNA_NAMES = [
  'Papmochani', 'Varuthini', 'Apara', 'Yogini', 'Kamika', 'Aja',
  'Indira', 'Rama', 'Utpanna', 'Saphala', 'Shattila', 'Vijaya',
];

const ADHIKA_SHUKLA_NAME = 'Padmini';
const ADHIKA_KRISHNA_NAME = 'Parama';

/** Elongation wrapped to [-180, 180), so a new moon is a rising zero crossing. */
function signedElongation(instant: Date): number {
  return ((elongation(instant) + 180) % 360) - 180;
}

/** The new moon within a few days of `guess`, found by bisection. */
function newMoonNear(guess: Date): Date {
  let low = guess.getTime() - SEARCH_WINDOW_DAYS * MS_PER_DAY;
  let high = guess.getTime() + SEARCH_WINDOW_DAYS * MS_PER_DAY;

  if (signedElongation(new Date(low)) >= 0 || signedElongation(new Date(high)) < 0) {
    throw new Error('No new moon found near the expected time.');
  }

  while (high - low > PRECISION_MS) {
    const mid = low + Math.floor((high - low) / 2);
    if (signedElongation(new Date(mid)) < 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date(high);
}

/** The new moon that starts the lunar month containing `instant`. */
function monthStart(instant: Date): Date {
  const daysSinceNewMoon = elongation(instant) / MEAN_ELONGATION_DEGREES_PER_DAY;
  return newMoonNear(new Date(instant.getTime() - daysSinceNewMoon * MS_PER_DAY));
}

function siderealSign(instant: Date): number {
  const sidereal = (((SunPosition(instant).elon - lahiriAyanamsa(instant)) % 360) + 360) % 360;
  return Math.floor(sidereal / DEGREES_PER_SIGN);
}

export function ekadashiName(ekadashi: TithiInterval): string {
  const start = monthStart(ekadashi.start);
  const end = newMoonNear(new Date(start.getTime() + SYNODIC_MONTH_DAYS * MS_PER_DAY));

  const startSign = siderealSign(start);
  const isAdhika = startSign === siderealSign(end);
  const shukla = ekadashi.paksha === 'shukla';

  if (isAdhika) return `${shukla ? ADHIKA_SHUKLA_NAME : ADHIKA_KRISHNA_NAME} Ekadashi`;

  // Meena (sign 11) starts Chaitra (month 0).
  const amantaMonth = (startSign + 1) % MONTHS;
  const name = shukla
    ? SHUKLA_NAMES[amantaMonth]
    : KRISHNA_NAMES[(amantaMonth + 1) % MONTHS];

  return `${name} Ekadashi`;
}
