'use client'

import { Transaction } from '../types'
import { formatCurrency, formatDate } from '@account-book/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@account-book/ui'
import { Button } from '@account-book/ui'
import { Trash2, Pencil } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日期</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>类型</TableHead>
          <TableHead className="text-right">金额</TableHead>
          <TableHead>备注</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(tx => (
          <TableRow key={tx.id}>
            <TableCell>{formatDate(tx.transaction_date)}</TableCell>
            <TableCell>
              <span style={{ color: tx.category?.color }}>{tx.category?.icon} {tx.category?.name}</span>
            </TableCell>
            <TableCell>
              <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {tx.type === 'income' ? '收入' : '支出'}
              </span>
            </TableCell>
            <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </TableCell>
            <TableCell className="text-muted-foreground">{tx.note || '-'}</TableCell>
            <TableCell className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(tx)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(tx.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">暂无交易记录</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}