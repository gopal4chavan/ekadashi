import { describe, expect, it } from 'vitest'
import { calculateTithi } from '../../engine/astronomy/tithi'

describe('calculateTithi', () => {
  it('normalizes angles and maps Shukla Tithis', () => {
    expect(calculateTithi(0)).toMatchObject({ number: 1, paksha: 'Shukla', lunarDay: 1, name: 'Pratipada' })
    expect(calculateTithi(120)).toMatchObject({ number: 11, paksha: 'Shukla', name: 'Ekadashi' })
  })

  it('maps the Krishna half and wraps at 360 degrees', () => {
    expect(calculateTithi(180)).toMatchObject({ number: 1, paksha: 'Krishna', lunarDay: 16, name: 'Pratipada' })
    expect(calculateTithi(348)).toMatchObject({ number: 15, paksha: 'Krishna', name: 'Amavasya' })
    expect(calculateTithi(360)).toMatchObject({ number: 1, paksha: 'Shukla', angle: 0 })
  })
})
