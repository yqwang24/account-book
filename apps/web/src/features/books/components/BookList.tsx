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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">账本列表</h1>
          <p className="page-subtitle">管理您的所有账本</p>
        </div>
        <Button size="lg" onClick={() => setOpen(true)}>+ 新建账本</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <Link key={book.id} href={`/books/${book.id}`}>
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{book.name}</CardTitle>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={(e) => { e.preventDefault(); handleDelete(book.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{book.description || '暂无描述'}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    使用中
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {books.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">还没有账本</p>
            <p className="text-sm">点击上方按钮创建一个新账本</p>
          </div>
        )}
      </div>
      <BookForm open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </div>
  )
}
