'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category, CategoryType } from '../types'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService'
import { Button } from '@account-book/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@account-book/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@account-book/ui'
import { Badge } from '@account-book/ui'
import { Trash2, Pencil, ArrowLeft } from 'lucide-react'
import { CategoryForm } from './CategoryForm'

interface CategoryListProps {
  bookId: string
  initialCategories: Category[]
}

export function CategoryList({ bookId, initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<CategoryType>('expense')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const loadCategories = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await getCategories(bookId)
      setCategories(data)
    } catch {
      setError('加载分类失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此分类？')) return
    try {
      await deleteCategory(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch {
      setError('删除分类失败')
    }
  }

  const handleCreate = async (data: { name: string; type: CategoryType; color?: string; icon?: string }) => {
    try {
      setLoading(true)
      if (editingCategory) {
        await updateCategory(editingCategory.id, data)
      } else {
        await createCategory(bookId, data)
      }
      setOpen(false)
      setEditingCategory(null)
      await loadCategories()
    } catch {
      setError(editingCategory ? '更新分类失败' : '创建分类失败')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const openForm = (type: CategoryType, category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormType(category.type)
    } else {
      setEditingCategory(null)
      setFormType(type)
    }
    setOpen(true)
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/books/${bookId}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">分类管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openForm('income')}>+ 收入分类</Button>
          <Button onClick={() => openForm('expense')}>+ 支出分类</Button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Tabs defaultValue="expense" className="w-full">
        <TabsList>
          <TabsTrigger value="income">收入 ({incomeCategories.length})</TabsTrigger>
          <TabsTrigger value="expense">支出 ({expenseCategories.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          {incomeCategories.length === 0 ? (
            <p className="text-muted-foreground">暂无收入分类</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {incomeCategories.map(cat => (
                <Card key={cat.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => openForm(cat.type, cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge style={{ backgroundColor: cat.color }}>{cat.color}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          {expenseCategories.length === 0 ? (
            <p className="text-muted-foreground">暂无支出分类</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {expenseCategories.map(cat => (
                <Card key={cat.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => openForm(cat.type, cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge style={{ backgroundColor: cat.color }}>{cat.color}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CategoryForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreate}
        defaultType={formType}
        initialValues={editingCategory ? { name: editingCategory.name, type: editingCategory.type, color: editingCategory.color, icon: editingCategory.icon } : undefined}
        mode={editingCategory ? 'edit' : 'create'}
      />
    </div>
  )
}
