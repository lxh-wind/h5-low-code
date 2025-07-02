import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from '@/components/ui'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'H5 Low Code Editor',
  description: '专为移动端 H5 页面搭建设计的低代码编辑器',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ToastProvider position="top-center">
          {children}
        </ToastProvider>
      </body>
    </html>
  )
} 