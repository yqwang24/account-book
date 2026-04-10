import { notFound } from 'next/navigation'
import { getBook } from '@/features/books/services/bookService'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function BookOverviewPage({ params }: PageProps) {
  const { bookId } = await params
  const book = await getBook(bookId)
  if (!book) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold">{book.name}</h1>
      <p className="text-muted-foreground">{book.description}</p>
    </div>
  )
}
