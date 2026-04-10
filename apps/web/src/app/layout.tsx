import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/features/layout/Sidebar'

export const metadata: Metadata = {
  title: '记账本',
  description: '个人记账应用',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}