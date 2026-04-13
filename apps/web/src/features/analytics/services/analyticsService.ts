import { supabase } from '@/lib/supabase/client'
import type { MonthlyStats, CategoryStat, MonthlyTrend } from '../types'

export async function getMonthlyStats(bookId: string, year: number, month: number): Promise<MonthlyStats> {
  const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('book_id', bookId)
    .gte('transaction_date', start)
    .lte('transaction_date', end)

  if (error) throw error

  const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

  return { income, expense, balance: income - expense }
}

export async function getCategoryStats(bookId: string, year: number, month: number): Promise<CategoryStat[]> {
  const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('category_id, type, amount, category(name, color, icon)')
    .eq('book_id', bookId)
    .eq('type', 'expense')
    .gte('transaction_date', start)
    .lte('transaction_date', end)

  if (error) throw error

  const map = new Map<string, CategoryStat>()
  for (const tx of data) {
    const cat = tx.category as unknown as { name: string; color: string; icon: string }
    if (!map.has(tx.category_id)) {
      map.set(tx.category_id, { category_id: tx.category_id, category_name: cat.name, category_color: cat.color, category_icon: cat.icon, total: 0, count: 0 })
    }
    const stat = map.get(tx.category_id)!
    stat.total += Number(tx.amount)
    stat.count += 1
  }

  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export async function getMonthlyTrend(bookId: string, months: number = 6): Promise<MonthlyTrend[]> {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const { data, error } = await supabase
    .from('transactions')
    .select('type, amount, transaction_date')
    .eq('book_id', bookId)
    .gte('transaction_date', startDate.toISOString().split('T')[0])
    .lte('transaction_date', endDate.toISOString().split('T')[0])
    .order('transaction_date')

  if (error) throw error

  const map = new Map<string, { income: number; expense: number }>()

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(monthKey, { income: 0, expense: 0 })
  }

  for (const tx of data) {
    const monthKey = tx.transaction_date.substring(0, 7)
    if (map.has(monthKey)) {
      const entry = map.get(monthKey)!
      if (tx.type === 'income') entry.income += Number(tx.amount)
      else entry.expense += Number(tx.amount)
    }
  }

  return Array.from(map.entries()).map(([month, values]) => ({
    month,
    income: values.income,
    expense: values.expense,
  }))
}