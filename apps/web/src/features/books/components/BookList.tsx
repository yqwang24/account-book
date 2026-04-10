'use client'

import { useState, useEffect } from 'react'
import { Book } from '../types'
import { getBooks, deleteBook } from '../services/bookService'
import { Button } from '@account-book/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@account-book/ui'
import { Plus, Trash2 } from 'lucide-react'

export function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBooks().then(setBooks).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此账本？')) return
    await deleteBook(id)
    setBooks(books.filter(b => b.id !== id))
  }

  if (loading) return <div>加载中...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账本列表</h1>
        <Button>+ 新建账本</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{book.description || '暂无描述'}</p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)} className="mt-4">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {books.length === 0 && <p className="text-muted-foreground">还没有账本，点击新建创建一个</p>}
      </div>
    </div>
  )
}
