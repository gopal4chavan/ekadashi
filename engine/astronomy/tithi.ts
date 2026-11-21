export type Paksha = 'Shukla' | 'Krishna'

export interface TithiInfo {
  number: number
  paksha: Paksha
  angle: number
  lunarDay: number
  name: string
}

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima'
]

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

export function calculateTithi(angularDifference: number): TithiInfo {
  const angle = normalizeAngle(angularDifference)
  const lunarDay = Math.min(30, Math.floor(angle / 12) + 1)
  const paksha: Paksha = lunarDay <= 15 ? 'Shukla' : 'Krishna'
  const number = lunarDay <= 15 ? lunarDay : lunarDay - 15
  const name = number === 15 ? (paksha === 'Shukla' ? 'Purnima' : 'Amavasya') : (TITHI_NAMES[number - 1] ?? 'Pratipada')

  return { number, paksha, angle, lunarDay, name }
}
