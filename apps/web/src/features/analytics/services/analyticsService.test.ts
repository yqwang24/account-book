import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMonthlyStats, getCategoryStats, getMonthlyTrend } from './analyticsService'
import { supabase } from '@/lib/supabase/client'

// Mock the supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
    }),
  },
}))

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMonthlyStats', () => {
    it('calculates correct income, expense, and balance', async () => {
      const mockData = [
        { type: 'income', amount: 1000 },
        { type: 'income', amount: 500 },
        { type: 'expense', amount: 200 },
        { type: 'expense', amount: 100 },
        { type: 'expense', amount: 50 },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      }
      mockQuery.select.mockResolvedValue({ data: mockData, error: null })
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getMonthlyStats('book-1', 2026, 4)

      expect(supabase.from).toHaveBeenCalledWith('transactions')
      expect(result.income).toBe(1500) // 1000 + 500
      expect(result.expense).toBe(350) // 200 + 100 + 50
      expect(result.balance).toBe(1150) // 1500 - 350
    })

    it('returns zero balances when no transactions', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      }
      mockQuery.select.mockResolvedValue({ data: [], error: null })
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getMonthlyStats('book-1', 2026, 4)

      expect(result.income).toBe(0)
      expect(result.expense).toBe(0)
      expect(result.balance).toBe(0)
    })
  })

  describe('getCategoryStats', () => {
    it('aggregates expenses by category', async () => {
      const mockData = [
        {
          category_id: 'cat-1',
          type: 'expense',
          amount: 100,
          category: { name: 'Food', color: '#FF0000', icon: 'utensils' },
        },
        {
          category_id: 'cat-1',
          type: 'expense',
          amount: 50,
          category: { name: 'Food', color: '#FF0000', icon: 'utensils' },
        },
        {
          category_id: 'cat-2',
          type: 'expense',
          amount: 200,
          category: { name: 'Transport', color: '#00FF00', icon: 'car' },
        },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      }
      mockQuery.select.mockResolvedValue({ data: mockData, error: null })
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getCategoryStats('book-1', 2026, 4)

      expect(result.length).toBe(2)

      const foodStat = result.find(s => s.category_id === 'cat-1')
      expect(foodStat?.total).toBe(150)
      expect(foodStat?.count).toBe(2)

      const transportStat = result.find(s => s.category_id === 'cat-2')
      expect(transportStat?.total).toBe(200)
      expect(transportStat?.count).toBe(1)
    })

    it('sorts categories by total descending', async () => {
      const mockData = [
        { category_id: 'cat-1', type: 'expense', amount: 50, category: { name: 'A', color: '#000', icon: 'x' } },
        { category_id: 'cat-2', type: 'expense', amount: 200, category: { name: 'B', color: '#000', icon: 'x' } },
        { category_id: 'cat-3', type: 'expense', amount: 100, category: { name: 'C', color: '#000', icon: 'x' } },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      }
      mockQuery.select.mockResolvedValue({ data: mockData, error: null })
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getCategoryStats('book-1', 2026, 4)

      expect(result[0].category_id).toBe('cat-2') // 200 is highest
      expect(result[1].category_id).toBe('cat-3') // 100 is middle
      expect(result[2].category_id).toBe('cat-1') // 50 is lowest
    })
  })

  describe('getMonthlyTrend', () => {
    it('returns trends for specified number of months with correct data structure', async () => {
      const mockData = [
        { type: 'income', amount: 1000 },
        { type: 'expense', amount: 300 },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      }
      mockQuery.select.mockResolvedValue({ data: mockData, error: null })
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getMonthlyTrend('book-1', 6)

      expect(result.length).toBe(6)
      expect(supabase.from).toHaveBeenCalledWith('transactions')

      // Verify the data structure of each month entry
      result.forEach((monthData) => {
        expect(monthData).toHaveProperty('month')
        expect(monthData).toHaveProperty('income')
        expect(monthData).toHaveProperty('expense')
        // Month should be in YYYY-MM format
        expect(monthData.month).toMatch(/^\d{4}-\d{2}$/)
      })
    })

    it('defaults to 6 months when not specified', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      }
      mockQuery.select.mockResolvedValue({ data: [], error: null })
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getMonthlyTrend('book-1')

      expect(result.length).toBe(6)
    })
  })
})
