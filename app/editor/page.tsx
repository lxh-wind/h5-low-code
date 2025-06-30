'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MaterialPanel, Canvas, PropertyPanel, TreeView } from './components'
import { Toolbar } from '@/components/layout'
import { PhoneFrame } from '@/components/common'
import { useEditorStore } from '@/store/editor'
import { usePageStore } from '@/store/pages'
import { initializeEditor } from '@/lib/mock'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageId = searchParams.get('pageId')
  
  const { setCurrentPage } = useEditorStore()
  const { getPageById } = usePageStore()

  // 初始化编辑器数据
  useEffect(() => {
    if (pageId) {
      // 如果有 pageId，加载对应的页面
      const page = getPageById(pageId)
      if (page) {
        setCurrentPage(page)
      } else {
        // 页面不存在，跳转到首页
        router.push('/')
      }
    } else {
      // 没有 pageId，使用默认数据
      const { page } = initializeEditor()
      setCurrentPage(page)
    }
  }, [pageId, setCurrentPage, getPageById, router])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧面板 */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* 组件物料库 */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-900 mb-4">组件库</h3>
            <MaterialPanel />
          </div>
          
          {/* 组件树 */}
          <div className="h-64 border-t border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-900 mb-4">组件树</h3>
            <TreeView />
          </div>
        </div>

        {/* 中间画布区域 */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="relative">
            <PhoneFrame title="页面编辑">
              <Canvas />
            </PhoneFrame>
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-[420px] property-panel overflow-y-auto">
          <PropertyPanel />
        </div>
      </div>
    </div>
  )
}
