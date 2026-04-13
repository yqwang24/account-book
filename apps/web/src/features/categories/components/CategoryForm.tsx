'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
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

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>{mode === 'edit' ? '编辑分类' : '新建分类'}</h2>
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
            <select
              {...form.register('type')}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
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
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">{mode === 'edit' ? '保存' : '创建'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
