'use client'

import { useState, useMemo, useEffect } from 'react'
import { usePageStore } from '@/store/pages'
import { useFavoriteStore } from '@/store/favorites'
import { CreatePageDialog } from '@/components/CreatePageDialog'
import { TemplateLibraryDialog } from '@/components/TemplateLibraryDialog'
import { ImportTemplateDialog } from '@/components/ImportTemplateDialog'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import {
  HomeHeader,
  StatsPanel,
  PageManagement,
  RecentActivity,
  ComponentStats
} from './components'

export function HomePage() {
  const { pages } = usePageStore()
  const { favoriteIds } = useFavoriteStore()
  const currentTime = useCurrentTime()
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated')
  const [isLoading, setIsLoading] = useState(true)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 模拟初始化加载
  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800) // 800ms 后显示实际内容

    return () => clearTimeout(timer)
  }, [])

  // 统计数据
  const stats = useMemo(() => {
    const totalPages = pages.length
    const totalComponents = pages.reduce((sum, page) => {
      const countComponents = (components: any[]): number => {
        return components.reduce((count, comp) => {
          return count + 1 + (comp.children ? countComponents(comp.children) : 0)
        }, 0)
      }
      return sum + countComponents(page.components || [])
    }, 0)
    
    // 只在客户端计算时间相关的统计
    let todayPages = 0
    let weekPages = 0
    
    if (isMounted) {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      todayPages = pages.filter(page => 
        new Date(page.updatedAt) >= todayStart
      ).length
      
      weekPages = pages.filter(page => 
        new Date(page.updatedAt) >= weekStart
      ).length
    }

    // 组件类型统计
    const componentTypes: Record<string, number> = {}
    pages.forEach(page => {
      const countByType = (components: any[]) => {
        components.forEach(comp => {
          componentTypes[comp.type] = (componentTypes[comp.type] || 0) + 1
          if (comp.children) {
            countByType(comp.children)
          }
        })
      }
      countByType(page.components || [])
    })

    return {
      totalPages,
      totalComponents,
      todayPages,
      weekPages,
      componentTypes,
      avgComponentsPerPage: totalPages > 0 ? Math.round(totalComponents / totalPages) : 0
    }
  }, [pages, isMounted])

  // 最近活动
  const recentActivity = useMemo(() => {
    return pages
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(page => ({
        id: page.id,
        name: page.name,
        title: page.title,
        action: '更新',
        time: page.updatedAt,
        componentsCount: page.components?.length || 0
      }))
  }, [pages])

  // 收藏的页面
  const favoritePages = useMemo(() => {
    return pages.filter(page => favoriteIds.includes(page.id)).slice(0, 5)
  }, [pages, favoriteIds])

  const handleCreateSuccess = (pageId: string) => {
    // 在新标签页中打开编辑器
    window.open(`/editor?pageId=${pageId}`, '_blank')
  }

  // 处理模板库
  const handleOpenTemplateLibrary = () => {
    setShowTemplateDialog(true)
  }

  // 处理导入模板
  const handleImportTemplate = () => {
    setShowImportDialog(true)
  }

  // 处理收藏页面点击
  const handleOpenFavoritePage = (pageId: string) => {
    window.open(`/editor?pageId=${pageId}`, '_blank')
  }

  // 处理选择模板
  const handleSelectTemplate = (template: any) => {
    // 基于模板创建新页面
    console.log('选择模板:', template)
    // 这里应该调用页面创建逻辑，传入模板数据
  }

  // 处理导入模板成功
  const handleImportSuccess = (template: any) => {
    // 导入模板成功后的处理
    console.log('导入模板成功:', template)
    // 可以添加到本地模板库或直接创建页面
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 头部 */}
      <HomeHeader
        currentTime={currentTime}
        isLoading={isLoading}
        onOpenTemplateLibrary={handleOpenTemplateLibrary}
        onImportTemplate={handleImportTemplate}
        onCreatePage={() => setShowCreateDialog(true)}
      />

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计面板 */}
        <StatsPanel stats={stats} isLoading={isLoading} />

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：页面管理（占3列） */}
          <div className="lg:col-span-3">
            <PageManagement
              pages={pages}
              favoritePages={favoritePages}
              isLoading={isLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onCreatePage={() => setShowCreateDialog(true)}
              onOpenFavoritePage={handleOpenFavoritePage}
            />
          </div>

          {/* 右侧：统计面板（占1列，固定定位） */}
          <div className="space-y-6 sticky top-8 self-start">
            {/* 最近活动 */}
            <RecentActivity 
              recentActivity={recentActivity}
              isLoading={isLoading}
            />

            {/* 组件使用统计 */}
            <ComponentStats 
              componentTypes={stats.componentTypes}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* 创建页面对话框 */}
      <CreatePageDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* 模板库对话框 */}
      <TemplateLibraryDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* 导入模板对话框 */}
      <ImportTemplateDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  )
} 