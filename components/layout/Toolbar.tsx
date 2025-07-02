'use client'

import { useEditorStore } from '@/store/editor'
import { generateReactCode } from '@/lib/codegen'
import { DeviceSelector } from '@/components/common'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as Toast from '@radix-ui/react-toast'
import { UndoIcon, RedoIcon, EyeIcon, SaveIcon, DownloadIcon, CheckCircleIcon, XCircleIcon, LoaderIcon } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Toolbar() {
  // const router = useRouter()
  const [toasts, setToasts] = useState<Array<{id: string, title: string, type: 'success' | 'error' | 'loading'}>>([])
  const { 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    currentPage,
    precompileStyles
  } = useEditorStore()

  const showToast = (title: string, type: 'success' | 'error' | 'loading' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, title, type }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleSave = () => {
    // TODO: 实现保存功能
    showToast('项目已保存', 'success')
    // 保存项目逻辑
  }

  const handleExport = () => {
    try {
      if (!currentPage) {
        showToast('没有可导出的页面', 'error')
        return
      }
      
      // 生成 TailwindCSS React 代码
      const reactCode = generateReactCode(currentPage)
      
      // 使用页面名称作为文件名
      const fileName = `${currentPage.name.replace(/[^a-zA-Z0-9]/g, '') || 'H5Page'}.tsx`
      
      // 创建下载文件
      const blob = new Blob([reactCode], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showToast('代码导出成功', 'success')
      // 导出成功
    } catch (error) {
      showToast('代码导出失败', 'error')
      console.error('导出代码失败:', error)
    }
  }

  const handlePreview = async () => {
    try {
      const loadingToastId = showToast('正在准备预览...', 'loading')
      
      // 在预览前先预编译样式
      precompileStyles()
      
      // 模拟预编译过程
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 移除loading toast
      removeToast(loadingToastId)
      
      // 使用 window.location 而不是 router.push 来避免 RSC 问题
      window.location.href = '/preview'
    } catch (error) {
      showToast('预览失败', 'error')
      console.error('预览失败:', error)
    }
  }

  return (
    <Toast.Provider swipeDirection="right">
      <Tooltip.Provider>
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* 左侧 - 项目信息 */}
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">H5 Low Code Editor</h1>
            <span className="text-sm text-gray-500">未命名项目</span>
          </div>

          {/* 中间 - 操作按钮 */}
          <div className="flex items-center space-x-2">
            {/* 机型选择 */}
            <DeviceSelector showTooltip />

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* 撤销 */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={undo}
                  disabled={!canUndo()}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  <UndoIcon className="h-4 w-4 mr-1" />
                  撤销
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                  撤销 (Ctrl+Z)
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            {/* 重做 */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={redo}
                  disabled={!canRedo()}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  <RedoIcon className="h-4 w-4 mr-1" />
                  重做
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                  重做 (Ctrl+Y)
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* 预览 */}
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handlePreview}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  预览
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                  预览页面
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* 右侧 - 主要操作 */}
          <div className="flex items-center space-x-3">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <SaveIcon className="h-4 w-4 mr-1" />
                  保存
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                  保存项目
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  导出
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                  导出代码
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </div>
      </Tooltip.Provider>

      {/* Toast 通知 */}
      {toasts.map(toast => (
        <Toast.Root
          key={toast.id}
          className="bg-white rounded-md shadow-lg border p-4 grid grid-cols-[auto_max-content] gap-x-4 items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id)
          }}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : toast.type === 'error' ? (
              <XCircleIcon className="h-5 w-5 text-red-500" />
            ) : (
              <LoaderIcon className="h-5 w-5 text-blue-500 animate-spin" />
            )}
            <Toast.Title className="text-sm font-medium text-gray-900">
              {toast.title}
            </Toast.Title>
          </div>
          <Toast.Close className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="h-4 w-4" />
          </Toast.Close>
        </Toast.Root>
      ))}

      <Toast.Viewport className="fixed top-20 left-1/2 transform -translate-x-1/2 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
    </Toast.Provider>
  )
} 