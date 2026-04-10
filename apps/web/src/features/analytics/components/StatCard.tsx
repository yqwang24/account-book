import { Card, CardHeader, CardTitle, CardContent } from '@account-book/ui'
import { formatCurrency } from '@account-book/ui'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  type: 'income' | 'expense' | 'balance'
}

export function StatCard({ title, value, type }: StatCardProps) {
  const color = type === 'income' ? 'text-green-600' : type === 'expense' ? 'text-red-600' : 'text-blue-600'
  const Icon = type === 'income' ? TrendingUp : type === 'expense' ? TrendingDown : DollarSign

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{formatCurrency(value)}</div>
      </CardContent>
    </Card>
  )
}