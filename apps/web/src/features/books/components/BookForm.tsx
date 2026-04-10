'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@account-book/ui'
import { Input } from '@account-book/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@account-book/ui'

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建账本</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit">创建</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
