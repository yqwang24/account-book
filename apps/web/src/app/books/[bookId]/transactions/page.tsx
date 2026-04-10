// apps/web/src/app/books/[bookId]/transactions/page.tsx
import { notFound } from 'next/navigation'
import { getTransactions } from '@/features/transactions/services/transactionService'
import { getCategories } from '@/features/categories/services/categoryService'
import { TransactionPageClient } from '@/features/transactions/components/TransactionPageClient'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function TransactionsPage({ params }: PageProps) {
  const { bookId } = await params
  const [transactions, categories] = await Promise.all([
    getTransactions(bookId).catch(() => []),
    getCategories(bookId).catch(() => []),
  ])
  if (!bookId) notFound()
  return <TransactionPageClient bookId={bookId} initialTransactions={transactions} categories={categories} />
}