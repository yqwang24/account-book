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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={`/books/${bookId}/transactions`} className="group">
          <div className="border-0 rounded-2xl p-8 h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-xl font-bold mb-2">交易记录</h2>
            <p className="text-blue-100 text-sm mb-6">查看和管理收支记录</p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 group-hover:shadow-md transition-shadow">+ 新增交易</Button>
          </div>
        </Link>
        <Link href={`/books/${bookId}/categories`} className="group">
          <div className="border-0 rounded-2xl p-8 h-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-xl font-bold mb-2">分类管理</h2>
            <p className="text-emerald-100 text-sm mb-6">管理收入和支出分类</p>
            <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50">管理分类</Button>
          </div>
        </Link>
        <Link href={`/books/${bookId}/analytics`} className="group">
          <div className="border-0 rounded-2xl p-8 h-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-xl font-bold mb-2">统计分析</h2>
            <p className="text-purple-100 text-sm mb-6">查看收支趋势和分类占比</p>
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">查看统计</Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
