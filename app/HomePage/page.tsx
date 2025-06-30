'use client'

import { useState, useMemo, useEffect } from 'react'
import { usePageStore } from '@/store/pages'
import { useFavoriteStore } from '@/store/favorites'
import { PageCard } from '@/components/PageCard'
import { CreatePageDialog } from '@/components/CreatePageDialog'
import { TemplateLibraryDialog } from '@/components/TemplateLibraryDialog'
import { ImportTemplateDialog } from '@/components/ImportTemplateDialog'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { 
  SkeletonStatsCard, 
  SkeletonPageCard, 
  SkeletonActivity, 
  SkeletonComponentStats,
  Skeleton
} from '@/components/Skeleton'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  Folder,
  Smartphone,
  BarChart3,
  Clock,
  FileText,
  Palette,
  TrendingUp,
  Activity,
  Edit3,
  Download,
  Settings,
  Target,
  Award,
  Sparkles,
  BookOpen,
  Upload,
  Heart,
  Star,
  Calendar,
  ExternalLink,
  Eye,
  Copy,
  Trash2,
  MoreVertical
} from 'lucide-react'

// 列表视图组件
function PageListItem({ page }: { page: any }) {
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { deletePage, duplicatePage } = usePageStore()
  const [showActions, setShowActions] = useState(false)
  
  const isPageFavorite = isFavorite(page.id)

  const handleEdit = () => {
    window.open(`/editor?pageId=${page.id}`, '_blank')
  }

  const handlePreview = () => {
    window.open(`/preview?pageId=${page.id}`, '_blank')
  }

  const handleDuplicate = () => {
    duplicatePage(page.id)
    setShowActions(false)
  }

  const handleDelete = () => {
    if (confirm(`确定要删除页面 "${page.name}" 吗？`)) {
      deletePage(page.id)
    }
    setShowActions(false)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(page.id)
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return d.toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* 页面图标 */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>

          {/* 页面信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {page.name}
                </h3>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {page.title}
                </p>
                {page.description && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {page.description}
                  </p>
                )}
              </div>
              
              {/* 元数据 */}
              <div className="flex items-center gap-6 text-xs text-gray-500 ml-4">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{page.components?.length || 0} 组件</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatTime(page.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 收藏按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={`w-8 h-8 ${isPageFavorite ? 'text-red-500' : 'text-gray-400'}`}
              title={isPageFavorite ? '取消收藏' : '添加收藏'}
            >
              <Heart className={`w-4 h-4 ${isPageFavorite ? 'fill-current' : ''}`} />
            </Button>

            {/* 预览按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreview}
              className="w-8 h-8 text-gray-400"
              title="预览页面"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {/* 编辑按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              leftIcon={<ExternalLink className="w-3 h-3" />}
              className="text-xs"
            >
              编辑
            </Button>

            {/* 更多操作 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActions(!showActions)}
                className="w-8 h-8 text-gray-400"
                title="更多操作"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showActions && (
                <>
                  {/* 点击外部关闭菜单的遮罩 */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowActions(false)}
                  />
                  
                  {/* 下拉菜单 */}
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-[120px]">
                    <button
                      onClick={handleDuplicate}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                      <span>复制</span>
                    </button>
                    
                    <div className="my-1 border-t border-gray-100" />
                    
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                      <span>删除</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function HomePage() {
  const { pages } = usePageStore()
  const { favoriteIds, toggleFavorite } = useFavoriteStore()
  const currentTime = useCurrentTime()
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated')
  const [isLoading, setIsLoading] = useState(true)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)

  // 模拟初始化加载
  useEffect(() => {
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
    
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const todayPages = pages.filter(page => 
      new Date(page.updatedAt) >= todayStart
    ).length
    
    const weekPages = pages.filter(page => 
      new Date(page.updatedAt) >= weekStart
    ).length

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
  }, [pages])

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

  // 排序选项
  const sortOptions = [
    { value: 'updated', label: '按更新时间' },
    { value: 'created', label: '按创建时间' },
    { value: 'name', label: '按名称排序' }
  ]

  // 过滤和排序页面
  const filteredAndSortedPages = pages
    .filter(page => 
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (page.description && page.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'name':
          return a.name.localeCompare(b.name, 'zh-CN')
        default:
          return 0
      }
    })

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

  // 处理取消收藏
  const handleRemoveFavorite = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发页面跳转
    toggleFavorite(pageId)
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

  // 格式化时间
  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return d.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧：标题 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    H5 低代码编辑器
                  </h1>
                  {isLoading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString('zh-CN')} {currentTime}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：快速操作 */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleOpenTemplateLibrary}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                模板库
              </Button>
              <Button
                variant="ghost"
                onClick={handleImportTemplate}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                导入模板
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                新建页面
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            // 骨架屏
            <>
              <SkeletonStatsCard />
              <SkeletonStatsCard />
              <SkeletonStatsCard />
              <SkeletonStatsCard />
            </>
          ) : (
            <>
              {/* 总页面数 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">总页面数</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPages}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">本周新增 {stats.weekPages}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 总组件数 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">总组件数</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComponents}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Palette className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <Target className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-gray-600">平均每页 {stats.avgComponentsPerPage} 个</span>
                  </div>
                </CardContent>
              </Card>

              {/* 今日活跃 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">今日活跃</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayPages}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <Clock className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-gray-600">页面更新次数</span>
                  </div>
                </CardContent>
              </Card>

              {/* 设计效率 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">设计效率</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.totalPages > 0 ? '98%' : '0%'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <Award className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-gray-600">比传统快 5x</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：页面管理（占3列） */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* 工具栏 */}
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-8 rounded-full" />
                    </div>
                  ) : (
                    <CardTitle className="flex items-center gap-3">
                      <Folder className="w-6 h-6 text-gray-600" />
                      我的页面
                      <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {filteredAndSortedPages.length}
                      </span>
                    </CardTitle>
                  )}
                  
                  <div className="flex items-center gap-3">
                    {/* 快速操作 */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {/* 导出所有页面 */}}
                        title="导出所有"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {/* 设置 */}}
                        title="设置"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* 视图切换 */}
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        title="网格视图"
                        className="h-8 px-2"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        title="列表视图"
                        className="h-8 px-2"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <>
                      {/* 搜索框骨架屏 */}
                      <div className="flex-1">
                        <Skeleton className="h-12 w-full rounded-lg" />
                      </div>
                      {/* 排序选择器骨架屏 */}
                      <Skeleton className="h-12 w-[140px] rounded-lg" />
                    </>
                  ) : (
                    <>
                      {/* 搜索框 */}
                      <div className="flex-1">
                        <Input
                          placeholder="搜索页面名称、标题或描述..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          leftIcon={<Search className="w-4 h-4" />}
                        />
                      </div>

                      {/* 排序选择 */}
                      <div className="min-w-[140px]">
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>

              {/* 收藏夹横向展示 */}
              {!isLoading && favoritePages.length > 0 && (
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      收藏的页面
                    </h3>
                    <span className="text-xs text-gray-500">{favoritePages.length} 个</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {favoritePages.map((page) => (
                      <Card 
                        key={page.id}
                        className="flex-shrink-0 w-48 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 hover:shadow-md transition-all cursor-pointer group relative"
                        onClick={() => handleOpenFavoritePage(page.id)}
                      >
                        {/* 取消收藏按钮 */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleRemoveFavorite(e, page.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md"
                          aria-label="取消收藏"
                        >
                          <Heart className="w-3 h-3 text-red-500 fill-current" />
                        </Button>
                        
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center">
                              <Star className="w-3 h-3 text-pink-600" />
                            </div>
                            <span className="text-xs font-medium text-pink-700 truncate flex-1">
                              {page.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {page.description || '暂无描述'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{page.components?.length || 0} 个组件</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-600">
                              点击编辑 →
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 页面列表 */}
              <CardContent className="p-6">
                {isLoading ? (
                  // 页面列表骨架屏
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-3'
                  }>
                    {Array.from({ length: 8 }).map((_, index) => (
                      viewMode === 'list' ? (
                        <Card key={index} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Skeleton variant="circular" width={48} height={48} />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-48 mb-1" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-16 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <SkeletonPageCard key={index} />
                      )
                    ))}
                  </div>
                ) : filteredAndSortedPages.length === 0 ? (
                  <div className="text-center py-16">
                    {pages.length === 0 ? (
                      // 无页面状态
                      <div>
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Sparkles className="w-16 h-16 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">开始你的创作之旅</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                          使用我们的可视化编辑器，轻松创建精美的 H5 页面，无需编程经验
                        </p>
                        <Button
                          onClick={() => setShowCreateDialog(true)}
                          size="lg"
                          leftIcon={<Plus className="w-5 h-5" />}
                          className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          创建第一个页面
                        </Button>
                      </div>
                    ) : (
                      // 搜索无结果状态
                      <div>
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的页面</h3>
                        <p className="text-gray-500">尝试使用其他关键词搜索</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // 页面网格/列表
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-3'
                  }>
                    {filteredAndSortedPages.map((page) => (
                      viewMode === 'list' ? (
                        <PageListItem key={page.id} page={page} />
                      ) : (
                        <PageCard key={page.id} page={page} />
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：统计面板（占1列，固定定位） */}
          <div className="space-y-6 sticky top-8 self-start">
            {/* 最近活动 */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ) : (
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    最近活动
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonActivity key={index} />
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">暂无活动记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Edit3 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.componentsCount} 个组件 · {formatTime(activity.time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 组件使用统计 */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ) : (
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    组件统计
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <SkeletonComponentStats />
                ) : Object.keys(stats.componentTypes).length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">暂无组件数据</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(stats.componentTypes)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ 
                                  width: `${(count / Math.max(...Object.values(stats.componentTypes))) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-6 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
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