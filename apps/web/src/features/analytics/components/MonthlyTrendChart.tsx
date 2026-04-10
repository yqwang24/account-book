'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@account-book/ui'
import type { MonthlyTrend } from '../types'

interface MonthlyTrendChartProps {
  data: MonthlyTrend[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>月度趋势</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">暂无数据</p></CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>月度趋势</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#22C55E" name="收入" />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="支出" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}