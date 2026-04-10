'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@account-book/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@account-book/ui'
import type { CategoryType } from '../types'

const schema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(20),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '请选择颜色').default('#3B82F6'),
  icon: z.string().max(10).default(''),
})

type FormData = z.infer<typeof schema>

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
  defaultType: CategoryType
  initialValues?: Partial<FormData>
  mode?: 'create' | 'edit'
}

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#22C55E', '#16A34A', '#14B8A6',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
]

export function CategoryForm({ open, onOpenChange, onSubmit, defaultType, initialValues, mode = 'create' }: CategoryFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialValues?.name || '', type: initialValues?.type || defaultType, color: initialValues?.color || '#3B82F6', icon: initialValues?.icon || '' },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? '编辑分类' : '新建分类'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">分类名称</label>
            <Input {...form.register('name')} placeholder="例如：餐饮" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">类型</label>
            <Select onValueChange={(v) => form.setValue('type', v as CategoryType)} defaultValue={defaultType}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">收入</SelectItem>
                <SelectItem value="expense">支出</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">颜色</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => form.setValue('color', color)}
                  className={`w-8 h-8 rounded-full border-2 ${form.watch('color') === color ? 'border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">图标</label>
            <Input {...form.register('icon')} placeholder="例如：🍜" maxLength={10} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">创建</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
