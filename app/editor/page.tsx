"use client"
import { ComponentPanel } from "@/components/component-panel"
import { Canvas } from "@/components/canvas"
import { PropertyPanel } from "@/components/property-panel"
import { Toolbar } from "@/components/toolbar"
import { LayerPanel } from "@/components/layer-panel"
import { useEditor } from "@/store/editor"
import { usePageStore } from "@/store/pages"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"

// 样式常量
const PANEL_STYLES = {
  left: "min-w-80 max-w-80 flex-shrink-0 bg-white border-r border-gray-200",
  right: "min-w-90 max-w-90 flex-shrink-0 bg-white border-l border-gray-200"
} as const

// 工具函数
const parseStorageData = (data: string | null): any[] | null => {
  if (!data) return null
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

// 加载状态组件
const PanelSkeleton = () => (
  <div className="p-4 space-y-4">
    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
  </div>
)

// 无页面ID引导组件
const NoPageIdGuide = () => (
  <div className="h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md mx-auto text-center p-8">
      <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        需要选择页面才能开始编辑
      </h1>
      
      <p className="text-gray-600 mb-8">
        请从首页选择要编辑的页面，或者创建一个新页面开始您的设计之旅
      </p>
      
      <div className="space-y-3">
        <button
          onClick={() => window.location.href = '/HomePage'}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          返回首页
        </button>
        
        <button
          onClick={() => window.location.href = '/HomePage'}
          className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          创建新页面
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 提示</h3>
        <p className="text-sm text-blue-700">
          编辑器需要与具体页面关联才能正常工作，这样可以确保您的设计内容得到妥善保存
        </p>
      </div>
    </div>
  </div>
)

// 编辑器布局组件
const EditorLayout = ({ 
  isLoading, 
  pageId 
}: { 
  isLoading: boolean
  pageId: string | null 
}) => {
  // 如果没有 pageId，显示引导界面
  if (!isLoading && !pageId) {
    return <NoPageIdGuide />
  }

  return (
  <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
    {/* 顶部工具栏 */}
    {isLoading ? (
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800">H5 搭建-编辑器</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-20 bg-blue-200 rounded"></div>
        </div>
      </div>
    ) : (
      <Toolbar pageId={pageId} />
    )}

    {/* 主要编辑区域 */}
    <div className="flex-1 flex overflow-hidden">
      {/* 左侧面板 */}
      <div className={`${PANEL_STYLES.left} ${isLoading ? '' : 'flex flex-col overflow-hidden'}`}>
        {isLoading ? <PanelSkeleton /> : (
          <>
            <ComponentPanel />
            <LayerPanel />
          </>
        )}
      </div>

      {/* 中间画布区域 */}
      <div className="flex-1 flex justify-center bg-gray-100 overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-gray-400">初始化中...</div>
          </div>
        ) : (
          <Canvas />
        )}
      </div>

      {/* 右侧属性面板 */}
      <div className={`${PANEL_STYLES.right} ${isLoading ? '' : 'overflow-hidden'}`}>
        {isLoading ? <PanelSkeleton /> : <PropertyPanel />}
      </div>
    </div>
  </div>
  )
}

function EditorContent() {
  const { clearSelection, undo, redo, canUndo, canRedo, saveToHistory, setComponents } = useEditor()
  const { getPageById } = usePageStore()
  const searchParams = useSearchParams()
  const pageId = searchParams.get('pageId')
  const [isClient, setIsClient] = useState(false)
  const historyInitialized = useRef(false)
  const dataLoaded = useRef(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 加载初始数据的函数
  const loadInitialData = useCallback(() => {
    try {
      if (!pageId) {
        console.log("缺少 pageId 参数，无法编辑")
        // 不加载任何数据，保持空状态
        setComponents([])
        return
      }

      console.log("正在加载页面数据，pageId:", pageId)
      
      // 统一从页面存储加载数据
      const pageData = getPageById(pageId)
      if (pageData && pageData.components) {
        console.log("从页面存储加载数据")
        setComponents(pageData.components)
      } else {
        console.log("页面不存在或无组件数据，使用空状态")
        setComponents([])
      }
    } catch (error) {
      console.error("加载初始数据失败:", error)
      setComponents([])
    }
  }, [pageId, getPageById, setComponents])

  // 初始化数据加载
  useEffect(() => {
    if (isClient) {
      // 当 pageId 变化时，重置历史记录初始化状态
      historyInitialized.current = false
      dataLoaded.current = true
      loadInitialData()
    }
  }, [isClient, pageId, loadInitialData])

  // 单独的effect来初始化历史记录，确保在数据加载后执行
  useEffect(() => {
    if (isClient && !historyInitialized.current && dataLoaded.current) {
      historyInitialized.current = true
      // 延迟一下确保组件状态已更新
      setTimeout(() => {
        saveToHistory()
      }, 100)
    }
  }, [isClient, saveToHistory, dataLoaded.current])

  // 监听键盘快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC键取消选中
      if (event.key === "Escape") {
        clearSelection()
        return
      }

      // 撤销重做快捷键
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z" && !event.shiftKey && canUndo) {
          event.preventDefault()
          undo()
          return
        }
        
        if ((event.key === "y" || (event.key === "z" && event.shiftKey)) && canRedo) {
          event.preventDefault()
          redo()
          return
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [clearSelection, undo, redo, canUndo, canRedo])

  return <EditorLayout isLoading={!isClient} pageId={pageId} />
}

export default function LowCodeEditor() {
  return <EditorContent />
}