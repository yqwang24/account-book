export interface MonthlyStats {
  income: number
  expense: number
  balance: number
}

export interface CategoryStat {
  category_id: string
  category_name: string
  category_color: string
  category_icon: string
  total: number
  count: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expense: number
}