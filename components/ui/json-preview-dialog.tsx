'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from './button'
import { useToast } from './toast'
import { CopyIcon, DownloadIcon, XIcon } from 'lucide-react'
import { Page } from '@/types/schema'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { usePageStats } from '@/hooks'

interface JsonPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  page: Page | null
  title?: string
}

export function JsonPreviewDialog({ 
  open, 
  onOpenChange, 
  page, 
  title = "JSON Schema 预览"
}: JsonPreviewDialogProps) {
  const [copied, setCopied] = useState(false)
  const [jsonData, setJsonData] = useState('')
  const [dataHash, setDataHash] = useState('')
  const toast = useToast()
  
  // 获取页面统计信息
  const pageStats = usePageStats()

  // 实时更新 JSON 数据
  useEffect(() => {
    if (page) {
      const data = JSON.stringify(page, null, 2)
      setJsonData(data)
      // 生成简单的哈希用于 key
      setDataHash(data.length.toString() + data.slice(0, 50).replace(/\s/g, ''))
    } else {
      setJsonData('')
      setDataHash('')
    }
  }, [page])



  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // 显示复制成功 Toast
      toast.success('JSON 数据已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
      console.error('复制失败:', error)
    }
  }

  const handleDownload = () => {
    if (!page) return
    
    try {
      const fileName = `${page.name.replace(/[^a-zA-Z0-9]/g, '') || 'H5Page'}.json`
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败:', error)
    }
  }

    return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black opacity-50 fixed inset-0 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90vw] max-w-4xl h-[80vh] z-50 flex flex-col">
        {/* 对话框标头 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            {page && (
              <p className="text-sm text-gray-500 mt-1">
                页面: {page.name} | 组件数量: {page.components.length}
              </p>
            )}
          </div>
          <Dialog.Close asChild>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="关闭对话框"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </div>

        {/* JSON 内容区域 */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
            {jsonData ? (
              <SyntaxHighlighter
                key={`json-${dataHash}`}
                language="json"
                style={vscDarkPlus}
                className="h-full text-sm"
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  backgroundColor: '#1e1e1e',
                  height: '100%',
                  overflow: 'auto'
                }}
                showLineNumbers={true}
                wrapLines={true}
                lineNumberStyle={{
                  color: '#858585',
                  fontSize: '12px',
                  marginRight: '16px'
                }}
              >
                {jsonData}
              </SyntaxHighlighter>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
                无可用数据
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮区域 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            大小: {pageStats.jsonSize} bytes | 组件: {pageStats.componentCount} 个
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!jsonData}
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              {copied ? '已复制' : '复制'}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={!jsonData}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              下载 JSON
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  )
} 