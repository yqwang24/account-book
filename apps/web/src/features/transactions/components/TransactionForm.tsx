'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
import { Category } from '@/features/categories/types'
import type { Transaction } from '../types'

const schema = z.object({
  type: z.enum(['income', 'expense']),
  category_id: z.string().min(1, '请选择分类'),
  amount: z.number().min(0.01, '金额必须大于0'),
  note: z.string().optional(),
  transaction_date: z.string().min(1, '请选择日期'),
})

type FormData = z.infer<typeof schema>

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
  categories: Category[]
  editingTransaction?: Transaction | null
}

export function TransactionForm({ open, onOpenChange, onSubmit, categories, editingTransaction }: TransactionFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: editingTransaction ? {
      type: editingTransaction.type,
      category_id: editingTransaction.category_id,
      amount: editingTransaction.amount,
      note: editingTransaction.note || '',
      transaction_date: editingTransaction.transaction_date,
    } : {
      type: 'expense',
      category_id: '',
      amount: 0,
      note: '',
      transaction_date: new Date().toISOString().split('T')[0],
    }
  })
  const selectedType = form.watch('type')
  const filteredCategories = categories.filter(c => c.type === selectedType && c.id && c.name)

  useEffect(() => {
    if (open) {
      if (editingTransaction) {
        form.reset({
          type: editingTransaction.type,
          category_id: editingTransaction.category_id,
          amount: editingTransaction.amount,
          note: editingTransaction.note || '',
          transaction_date: editingTransaction.transaction_date,
        })
      } else {
        form.reset({
          type: 'expense',
          category_id: '',
          amount: 0,
          note: '',
          transaction_date: new Date().toISOString().split('T')[0],
        })
      }
    }
  }, [open, editingTransaction, form])

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '480px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1f2937' }}>{editingTransaction ? '编辑交易' : '新增交易'}</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium">类型</label>
            <select
              {...form.register('type')}
              className="w-full border rounded-md px-3 py-2"
              onChange={(e) => form.setValue('type', e.target.value as 'income' | 'expense')}
            >
              <option value="">收入/支出</option>
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
            {form.formState.errors.type && (
              <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">分类</label>
            <select
              {...form.register('category_id')}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">选择分类</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
            {form.formState.errors.category_id && (
              <p className="text-sm text-destructive">{form.formState.errors.category_id.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">金额</label>
            <Input type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} placeholder="0.00" />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">日期</label>
            <Input type="date" {...form.register('transaction_date')} />
            {form.formState.errors.transaction_date && (
              <p className="text-sm text-destructive">{form.formState.errors.transaction_date.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">备注</label>
            <Input {...form.register('note')} placeholder="可选备注" />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">{editingTransaction ? '保存' : '创建'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}