'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePageStore } from '@/store/pages'
import { PageCard } from '@/components/PageCard'
import { CreatePageDialog } from '@/components/CreatePageDialog'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import * as Select from '@radix-ui/react-select'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  Folder,
  Smartphone,
  ChevronDown,
  Check,
  BarChart3,
  Clock,
  FileText,
  Palette,
  Zap,
  TrendingUp,
  Activity,
  Eye,
  Edit3,
  Download,
  Settings,
  Target,
  Award,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { pages } = usePageStore()
  const currentTime = useCurrentTime()
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated')

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
    router.push(`/editor?pageId=${pageId}`)
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
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('zh-CN')} {currentTime}
                  </p>
                </div>
              </div>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/editor')}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="快速编辑"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                新建页面
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 总页面数 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
          </div>

          {/* 总组件数 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
          </div>

          {/* 今日活跃 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
          </div>

          {/* 设计效率 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">设计效率</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalPages > 0 ? '98%' : '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Award className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-gray-600">比传统快 5x</span>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：页面管理（占3列） */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* 工具栏 */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <Folder className="w-6 h-6 text-gray-600" />
                    我的页面
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {filteredAndSortedPages.length}
                    </span>
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    {/* 快速操作 */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => {/* 导出所有页面 */}}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-all"
                        title="导出所有"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* 设置 */}}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded transition-all"
                        title="设置"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 视图切换 */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                        title="网格视图"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                        title="列表视图"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* 搜索框 */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="搜索页面名称、标题或描述..."
                    />
                  </div>

                  {/* 排序选择 */}
                  <Select.Root value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <Select.Trigger className="inline-flex items-center justify-between px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px] transition-all">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </Select.Icon>
                    </Select.Trigger>
                    
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                        <Select.Viewport className="p-1">
                          {sortOptions.map(option => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                              className="relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100"
                            >
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator className="absolute right-2">
                                <Check className="w-4 h-4 text-blue-600" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>

              {/* 页面列表 */}
              <div className="p-6">
                {filteredAndSortedPages.length === 0 ? (
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
                        <button
                          onClick={() => setShowCreateDialog(true)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-3 mx-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Plus className="w-5 h-5" />
                          创建第一个页面
                        </button>
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
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredAndSortedPages.map((page) => (
                      <PageCard key={page.id} page={page} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：活动面板（占1列） */}
          <div className="space-y-6">
            {/* 最近活动 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  最近活动
                </h3>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
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
              </div>
            </div>

            {/* 组件使用统计 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  组件统计
                </h3>
              </div>
              <div className="p-6">
                {Object.keys(stats.componentTypes).length === 0 ? (
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
              </div>
            </div>

            {/* 快速操作 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-600" />
                  快速操作
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">新建页面</span>
                </button>
                <button
                  onClick={() => router.push('/editor')}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">快速编辑</span>
                </button>
                <button
                  onClick={() => router.push('/preview')}
                  className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">预览模式</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 创建页面对话框 */}
      <CreatePageDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
} 