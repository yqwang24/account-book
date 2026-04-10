'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@account-book/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@account-book/ui'
import { Category } from '@/features/categories/types'

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
}

export function TransactionForm({ open, onOpenChange, onSubmit, categories }: TransactionFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>新增交易</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">类型</label>
            <Select onValueChange={v => form.setValue('type', v as 'income' | 'expense')}>
              <SelectTrigger><SelectValue placeholder="收入/支出" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="income">收入</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">分类</label>
            <Select onValueChange={v => form.setValue('category_id', v)}>
              <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
              <SelectContent>
                {categories.filter(c => c.type === form.watch('type')).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}