// apps/web/src/app/books/[bookId]/categories/page.tsx
import { getCategories } from '@/features/categories/services/categoryService'
import { CategoryList } from '@/features/categories/components/CategoryList'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function CategoriesPage({ params }: PageProps) {
  const { bookId } = await params
  const categories = await getCategories(bookId).catch(() => notFound())
  return <CategoryList bookId={bookId} initialCategories={categories} />
}
