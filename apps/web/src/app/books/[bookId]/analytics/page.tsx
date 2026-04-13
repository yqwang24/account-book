'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getMonthlyStats, getCategoryStats, getMonthlyTrend } from '@/features/analytics/services/analyticsService'
import { StatCard } from '@/features/analytics/components/StatCard'
import { CategoryPieChart } from '@/features/analytics/components/CategoryPieChart'
import { MonthlyTrendChart } from '@/features/analytics/components/MonthlyTrendChart'
import { Button } from '@account-book/ui'
import { ArrowLeft } from 'lucide-react'
import type { MonthlyStats, CategoryStat, MonthlyTrend } from '@/features/analytics/types'

export default function AnalyticsPage() {
  const params = useParams()
  const bookId = params.bookId as string

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [stats, setStats] = useState<MonthlyStats>({ income: 0, expense: 0, balance: 0 })
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [trend, setTrend] = useState<MonthlyTrend[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [s, cs, t] = await Promise.all([
        getMonthlyStats(bookId, year, month),
        getCategoryStats(bookId, year, month),
        getMonthlyTrend(bookId, 6),
      ])
      setStats(s)
      setCategoryStats(cs)
      setTrend(t)
    } catch {
      setStats({ income: 0, expense: 0, balance: 0 })
      setCategoryStats([])
      setTrend([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bookId) loadData()
  }, [bookId, year, month])

  if (!bookId) return notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/books/${bookId}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">统计分析</h1>
        <div className="flex gap-2 items-end flex-wrap">
          <div>
            <label className="text-sm font-medium">年份</label>
            <select
              value={String(year)}
              onChange={e => setYear(+e.target.value)}
              className="w-[120px] border rounded-md px-3 py-2"
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={String(y)}>{y}年</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">月份</label>
            <select
              value={String(month)}
              onChange={e => setMonth(+e.target.value)}
              className="w-[100px] border rounded-md px-3 py-2"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={String(m)}>{m}月</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="本月收入" value={stats.income} type="income" />
            <StatCard title="本月支出" value={stats.expense} type="expense" />
            <StatCard title="本月结余" value={stats.balance} type="balance" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryPieChart data={categoryStats} />
            <MonthlyTrendChart data={trend} />
          </div>
        </>
      )}
    </div>
  )
}