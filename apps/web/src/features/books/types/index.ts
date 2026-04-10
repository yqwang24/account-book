export interface Book {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface BookInput {
  name: string
  description?: string
}
