import type { CategoryType } from '@/features/categories/types'

export interface Transaction {
  id: string
  book_id: string
  category_id: string
  type: CategoryType
  amount: number
  note: string
  transaction_date: string
  created_at: string
  updated_at: string
  category?: { name: string; color: string; icon: string }
}

export interface TransactionInput {
  category_id: string
  type: CategoryType
  amount: number
  note?: string
  transaction_date: string
}

export interface TransactionFilter {
  month?: number
  year?: number
  categoryId?: string
  type?: CategoryType
}