'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Book } from '../types'
import { getBooks, deleteBook, createBook } from '../services/bookService'
import { Button } from '@account-book/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@account-book/ui'
import { Trash2 } from 'lucide-react'
import { BookForm } from './BookForm'

export function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setError(null)
      const data = await getBooks()
      setBooks(data)
    } catch (err) {
      setError('加载账本失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此账本？')) return
    try {
      await deleteBook(id)
      setBooks(books.filter(b => b.id !== id))
    } catch {
      setError('删除账本失败')
    }
  }

  const handleCreate = async (data: { name: string; description?: string }) => {
    await createBook(data)
    setOpen(false)
    await loadBooks()
  }

  if (loading) return <div>加载中...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账本列表</h1>
        <Button type="button" onClick={() => setOpen(true)}>+ 新建账本</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <Link key={book.id} href={`/books/${book.id}`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{book.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{book.description || '暂无描述'}</p>
                <div className="mt-4" onClick={(e) => e.preventDefault()}>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(book.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {books.length === 0 && <p className="text-muted-foreground">还没有账本，点击新建创建一个</p>}
      </div>
      <BookForm open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </div>
  )
}
