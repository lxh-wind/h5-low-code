'use client'

import { useEditorStore } from '@/store/editor'
import { DeviceSelector } from '@/components/common'
import { JsonPreviewDialog, useToast } from '@/components/ui'
import { useRealTimePageData, usePageNavigation } from '@/hooks'
import * as Tooltip from '@radix-ui/react-tooltip'
import { UndoIcon, RedoIcon, EyeIcon, SaveIcon, FileJsonIcon } from 'lucide-react'
import { useState } from 'react'

export function Toolbar() {
  const [showJsonPreview, setShowJsonPreview] = useState(false)
  const toast = useToast()
  const { openPreview } = usePageNavigation()
  const { 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    precompileStyles,
    currentPage
  } = useEditorStore()
  
  // 使用自定义 Hook 获取实时页面数据
  const realTimePageData = useRealTimePageData()

  const handleSave = () => {
    // TODO: 实现保存功能
    toast.success('项目已保存')
    // 保存项目逻辑
  }

  const handleExportJson = () => {
    try {
      if (!realTimePageData) {
        toast.error('没有可导出的页面')
        return
      }
      
      // 显示 JSON 预览对话框
      setShowJsonPreview(true)
      
    } catch (error) {
      toast.error('JSON 预览失败')
      console.error('JSON 预览失败:', error)
    }
  }

  const handlePreview = async () => {
    try {
      toast.loading('正在准备预览...', 1000)
      
      // 在预览前先预编译样式
      precompileStyles()
      
      // 模拟预编译过程
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 使用公共導航 hook 跳轉到預覽頁面，傳遞當前頁面ID
      openPreview(currentPage?.id)
      
    } catch (error) {
      toast.error('预览失败')
      console.error('预览失败:', error)
    }
  }

  return (
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
                onClick={handleExportJson}
                className="inline-flex items-center justify-center px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <FileJsonIcon className="h-4 w-4 mr-1" />
                导出
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                预览并导出 JSON Schema
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>
      
      {/* JSON 预览对话框 */}
      <JsonPreviewDialog 
        open={showJsonPreview}
        onOpenChange={setShowJsonPreview}
        page={realTimePageData}
        title="JSON Schema 预览"
      />
    </Tooltip.Provider>
  )
} 