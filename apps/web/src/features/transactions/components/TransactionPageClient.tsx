'use client'

import { useState } from 'react'
import { Transaction } from '../types'
import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from '../services/transactionService'
import { Category } from '@/features/categories/types'
import { TransactionList } from './TransactionList'
import { TransactionFilters } from './TransactionFilters'
import { TransactionForm } from './TransactionForm'
import { Button } from '@account-book/ui'

interface TransactionPageClientProps {
  bookId: string
  initialTransactions: Transaction[]
  categories: Category[]
}

export function TransactionPageClient({ bookId, initialTransactions, categories }: TransactionPageClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const loadTransactions = async (filter?: { year: number; month: number; categoryId?: string }) => {
    try {
      setError(null)
      setLoading(true)
      const data = await getTransactions(bookId, filter)
      setTransactions(data)
    } catch {
      setError('加载交易记录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此交易？')) return
    try {
      await deleteTransaction(id)
      setTransactions(transactions.filter(t => t.id !== id))
    } catch {
      setError('删除失败')
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setOpen(true)
  }

  const handleCreate = async (data: { type: 'income' | 'expense'; category_id: string; amount: number; note?: string; transaction_date: string }) => {
    try {
      setLoading(true)
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data)
      } else {
        await createTransaction(bookId, data)
      }
      await loadTransactions()
      setOpen(false)
      setEditingTransaction(null)
    } catch {
      setError(editingTransaction ? '更新交易失败' : '创建交易失败')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEditingTransaction(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">交易记录</h1>
        <Button onClick={() => setOpen(true)}>+ 新增交易</Button>
      </div>

      <TransactionFilters
        onFilterChange={(filter) => loadTransactions(filter)}
        categories={categories}
      />

      {error && <p className="text-red-500">{error}</p>}
      {loading ? <p>加载中...</p> : <TransactionList transactions={transactions} onDelete={handleDelete} onEdit={handleEdit} />}

      <TransactionForm
        open={open}
        onOpenChange={(v) => { if (!v) handleClose(); }}
        onSubmit={handleCreate}
        categories={categories}
        editingTransaction={editingTransaction}
      />
    </div>
  )
}