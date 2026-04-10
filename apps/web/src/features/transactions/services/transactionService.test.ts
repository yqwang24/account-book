import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from './transactionService'
import { supabase } from '@/lib/supabase/client'

// Mock the supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}))

describe('transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTransactions', () => {
    it('returns transactions for a book', async () => {
      const mockData = [
        {
          id: '1',
          book_id: 'book-1',
          category_id: 'cat-1',
          type: 'expense',
          amount: 100,
          note: 'Test',
          transaction_date: '2026-04-10',
          created_at: '2026-04-10',
          updated_at: '2026-04-10',
          category: { name: 'Food', color: '#FF0000', icon: 'utensils' },
        },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await getTransactions('book-1')

      expect(supabase.from).toHaveBeenCalledWith('transactions')
      expect(result).toEqual(mockData)
      expect(result[0].amount).toBe(100)
    })

    it('throws error when query fails', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      await expect(getTransactions('book-1')).rejects.toThrow('Query failed')
    })

    it('applies filter for year and month', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      await getTransactions('book-1', { year: 2026, month: 4 })

      expect(mockQuery.gte).toHaveBeenCalled()
      expect(mockQuery.lte).toHaveBeenCalled()
    })
  })

  describe('createTransaction', () => {
    it('creates a new transaction', async () => {
      const input = {
        category_id: 'cat-1',
        type: 'expense' as const,
        amount: 50,
        note: 'Coffee',
        transaction_date: '2026-04-10',
      }

      const mockData = { id: 'new-1', book_id: 'book-1', ...input }
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await createTransaction('book-1', input)

      expect(mockQuery.insert).toHaveBeenCalledWith({ ...input, book_id: 'book-1' })
      expect(result.id).toBe('new-1')
      expect(result.amount).toBe(50)
    })
  })

  describe('updateTransaction', () => {
    it('updates an existing transaction', async () => {
      const input = {
        category_id: 'cat-1',
        type: 'expense' as const,
        amount: 75,
        note: 'Updated',
        transaction_date: '2026-04-10',
      }

      const mockData = { id: 'tx-1', book_id: 'book-1', ...input }
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      const result = await updateTransaction('tx-1', input)

      expect(mockQuery.update).toHaveBeenCalledWith(input)
      expect(result.amount).toBe(75)
    })
  })

  describe('deleteTransaction', () => {
    it('deletes a transaction', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      await deleteTransaction('tx-1')

      expect(mockQuery.delete).toHaveBeenCalled()
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'tx-1')
    })

    it('throws error when delete fails', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
      }
      ;(supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockQuery as any)

      await expect(deleteTransaction('tx-1')).rejects.toThrow('Delete failed')
    })
  })
})
