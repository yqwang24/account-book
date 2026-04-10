import { supabase } from '@/lib/supabase/client'
import type { Transaction, TransactionInput, TransactionFilter } from '../types'

export async function getTransactions(bookId: string, filter?: TransactionFilter): Promise<Transaction[]> {
  let query = supabase.from('transactions').select('*, category(name, color, icon)').eq('book_id', bookId)

  if (filter?.year && filter?.month) {
    const start = new Date(filter.year, filter.month - 1, 1).toISOString().split('T')[0]
    const end = new Date(filter.year, filter.month, 0).toISOString().split('T')[0]
    query = query.gte('transaction_date', start).lte('transaction_date', end)
  }
  if (filter?.categoryId) query = query.eq('category_id', filter.categoryId)
  if (filter?.type) query = query.eq('type', filter.type)

  const { data, error } = await query.order('transaction_date', { ascending: false })
  if (error) throw error
  return data
}

export async function createTransaction(bookId: string, input: TransactionInput): Promise<Transaction> {
  const { data, error } = await supabase.from('transactions').insert({ ...input, book_id: bookId }).select('*, category(name, color, icon)').single()
  if (error) throw error
  return data
}

export async function updateTransaction(id: string, input: TransactionInput): Promise<Transaction> {
  const { data, error } = await supabase.from('transactions').update(input).eq('id', id).select('*, category(name, color, icon)').single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}