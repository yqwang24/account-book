import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBook } from '@/features/books/services/bookService'
import { getMonthlyStats } from '@/features/analytics/services/analyticsService'
import { StatCard } from '@/features/analytics/components/StatCard'
import { Button } from '@account-book/ui'
import { ArrowLeft, PlusCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ bookId: string }>
}

export default async function BookOverviewPage({ params }: PageProps) {
  const { bookId } = await params
  const book = await getBook(bookId)
  if (!book) notFound()

  const now = new Date()
  const stats = await getMonthlyStats(bookId, now.getFullYear(), now.getMonth() + 1).catch(() => ({ income: 0, expense: 0, balance: 0 }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/books">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{book.name}</h1>
          <p className="text-muted-foreground">{book.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="本月收入" value={stats.income} type="income" />
        <StatCard title="本月支出" value={stats.expense} type="expense" />
        <StatCard title="本月结余" value={stats.balance} type="balance" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href={`/books/${bookId}/transactions`}>
          <div className="border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">交易记录</h2>
            <p className="text-muted-foreground text-sm mb-4">查看和管理收支记录</p>
            <Button>+ 新增交易</Button>
          </div>
        </Link>
        <Link href={`/books/${bookId}/categories`}>
          <div className="border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">分类管理</h2>
            <p className="text-muted-foreground text-sm mb-4">管理收入和支出分类</p>
            <Button variant="outline">查看分类</Button>
          </div>
        </Link>
        <Link href={`/books/${bookId}/analytics`}>
          <div className="border rounded-lg p-6 hover:bg-accent transition-colors cursor-pointer">
            <h2 className="text-lg font-semibold mb-2">统计分析</h2>
            <p className="text-muted-foreground text-sm mb-4">查看收支趋势和分类占比</p>
            <Button variant="outline">查看统计</Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
