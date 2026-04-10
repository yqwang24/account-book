import { getBooks } from '@/features/books/services/bookService'
import { getMonthlyStats, getCategoryStats, getMonthlyTrend } from '@/features/analytics/services/analyticsService'
import { StatCard } from '@/features/analytics/components/StatCard'
import { CategoryPieChart } from '@/features/analytics/components/CategoryPieChart'
import { MonthlyTrendChart } from '@/features/analytics/components/MonthlyTrendChart'

export default async function DashboardPage() {
  const books = await getBooks()
  const DEFAULT_BOOK_ID = books[0]?.id || null

  if (!DEFAULT_BOOK_ID) {
    return <div className="p-6">请先创建一个账本</div>
  }

  const now = new Date()
  const [stats, categoryStats, trend] = await Promise.all([
    getMonthlyStats(DEFAULT_BOOK_ID, now.getFullYear(), now.getMonth() + 1).catch(() => ({ income: 0, expense: 0, balance: 0 })),
    getCategoryStats(DEFAULT_BOOK_ID, now.getFullYear(), now.getMonth() + 1).catch(() => []),
    getMonthlyTrend(DEFAULT_BOOK_ID, 6).catch(() => []),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="本月收入" value={stats.income} type="income" />
        <StatCard title="本月支出" value={stats.expense} type="expense" />
        <StatCard title="本月结余" value={stats.balance} type="balance" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryPieChart data={categoryStats} />
        <MonthlyTrendChart data={trend} />
      </div>
    </div>
  )
}