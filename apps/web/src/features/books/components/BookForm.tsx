'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'

const schema = z.object({
  name: z.string().min(1, '账本名称不能为空').max(50),
  description: z.string().max(200).optional(),
})

type FormData = z.infer<typeof schema>

interface BookFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => Promise<void>
}

export function BookForm({ open, onOpenChange, onSubmit }: BookFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) })

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '480px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#1f2937' }}>新建账本</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium">账本名称</label>
            <Input {...form.register('name')} placeholder="例如：我的账本" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">描述</label>
            <Input {...form.register('description')} placeholder="可选描述" />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">创建</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
