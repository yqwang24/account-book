import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, getMonthRange } from './utils'

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    const result = formatCurrency(1234.5)
    expect(result).toContain('1,234.50')
  })

  it('formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0.00')
  })

  it('formats negative numbers', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('500.00')
    expect(result).toContain('-')
  })

  it('formats small decimal values', () => {
    const result = formatCurrency(99.99)
    expect(result).toContain('99.99')
  })
})

describe('formatDate', () => {
  it('formats a valid date string', () => {
    const result = formatDate('2026-04-10')
    expect(result).toContain('Apr')
    expect(result).toContain('10')
    expect(result).toContain('2026')
  })

  it('formats date with single digit day', () => {
    const result = formatDate('2026-01-05')
    expect(result).toContain('Jan')
    expect(result).toContain('5')
    expect(result).toContain('2026')
  })
})

describe('getMonthRange', () => {
  it('returns correct start and end dates for April', () => {
    const { start, end } = getMonthRange(2026, 4)
    expect(start.getFullYear()).toBe(2026)
    expect(start.getMonth()).toBe(3) // April is month 3 (0-indexed)
    expect(start.getDate()).toBe(1)
    expect(end.getMonth()).toBe(3)
    expect(end.getDate()).toBe(30)
  })

  it('returns correct start and end dates for February (leap year)', () => {
    const { start, end } = getMonthRange(2024, 2)
    expect(start.getMonth()).toBe(1) // February is month 1
    expect(end.getDate()).toBe(29) // Leap year
  })

  it('returns correct start and end dates for February (non-leap year)', () => {
    const { start, end } = getMonthRange(2025, 2)
    expect(start.getMonth()).toBe(1)
    expect(end.getDate()).toBe(28)
  })

  it('returns correct start and end dates for December', () => {
    const { start, end } = getMonthRange(2026, 12)
    expect(start.getMonth()).toBe(11) // December is month 11
    expect(end.getDate()).toBe(31)
  })
})
