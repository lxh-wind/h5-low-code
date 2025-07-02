'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEditorStore } from '@/store/editor'
import { usePageStore } from '@/store/pages'
import { Component, Page } from '@/types/schema'
import { PreviewRenderer } from '@/components/layout'
import { DeviceSelector, PhoneFrame } from '@/components/common'
import { ArrowLeftIcon } from 'lucide-react'

export function PreviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageId = searchParams.get('pageId')
  
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  
  const { 
    components,
    precompileStyles
  } = useEditorStore()
  
  const { getPageById } = usePageStore()

  // 初始化预览数据
  useEffect(() => {
    const initPreview = async () => {
      try {
        setIsLoading(true)
        
        // 初始化项目数据
        // 如果有 pageId，加载对应页面
        if (pageId) {
          const page = getPageById(pageId)
          if (page) {
            setCurrentPage(page)
          } else {
            // 页面不存在，跳转到首页
            router.push('/')
            return
          }
        }
        
        precompileStyles()
        // 等待一帧，确保状态更新完成
        await new Promise(resolve => requestAnimationFrame(resolve))
      } catch (error) {
        console.error('预览初始化失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initPreview()
  }, [pageId, precompileStyles, getPageById, router])

  const handleBack = () => {
    if (pageId) {
      router.push(`/editor?pageId=${pageId}`)
    } else {
      router.push('/editor')
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载预览...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 预览工具栏 */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            返回编辑器
          </button>
          <h1 className="text-lg font-semibold text-gray-900">预览模式</h1>
        </div>

        {/* 机型选择器 */}
        <DeviceSelector showIcon />
      </div>

      {/* 预览内容区域 */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-center">
          <PhoneFrame 
            title={currentPage?.title || "H5 页面预览"} 
            maxHeight="calc(100vh - 200px)"
          >
            {(currentPage?.components || components).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-lg">暂无内容</p>
                <p className="text-sm mt-2">请返回编辑器添加组件</p>
              </div>
            ) : (
              <div 
                style={{
                  backgroundColor: currentPage?.config?.backgroundColor || '#ffffff',
                  color: currentPage?.config?.color || '#333333',
                  fontFamily: currentPage?.config?.fontFamily || 'system-ui, -apple-system, sans-serif',
                  fontSize: currentPage?.config?.fontSize || '14px',
                  lineHeight: currentPage?.config?.lineHeight || '1.6',
                  minHeight: currentPage?.config?.minHeight || 'auto',
                  padding: currentPage?.config?.padding || '16px',
                  maxWidth: currentPage?.config?.maxWidth || 'none',
                  marginLeft: currentPage?.config?.maxWidth ? 'auto' : 'initial',
                  marginRight: currentPage?.config?.maxWidth ? 'auto' : 'initial',
                }}
                className="space-y-2"
              >
                {(currentPage?.components || components).map((component: Component) => (
                  <PreviewRenderer key={component.id} component={component} pageConfig={currentPage?.config} />
                ))}
              </div>
            )}
          </PhoneFrame>
        </div>
      </div>
    </div>
  )
} 