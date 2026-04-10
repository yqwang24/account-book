import { supabase } from '@/lib/supabase/client'
import type { Category, CategoryInput } from '../types'

export async function getCategories(bookId: string): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').eq('book_id', bookId).order('type')
  if (error) throw error
  return data
}

export async function createCategory(bookId: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert({ ...input, book_id: bookId }).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase.from('categories').update(input).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
