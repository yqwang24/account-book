export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  book_id: string
  name: string
  type: CategoryType
  color: string
  icon: string
  created_at: string
}

export interface CategoryInput {
  name: string
  type: CategoryType
  color?: string
  icon?: string
}
