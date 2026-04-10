import { supabase } from '@/lib/supabase/client'
import type { Book, BookInput } from '../types'

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getBook(id: string): Promise<Book | null> {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).single()
  if (error) return null
  return data
}

export async function createBook(input: BookInput): Promise<Book> {
  const { data, error } = await supabase.from('books').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateBook(id: string, input: BookInput): Promise<Book> {
  const { data, error } = await supabase.from('books').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}
