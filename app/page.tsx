'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePageStore } from '@/store/pages'
import { PageCard } from '@/components/PageCard'
import { CreatePageDialog } from '@/components/CreatePageDialog'
import * as Select from '@radix-ui/react-select'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  Folder,
  Smartphone,
  ChevronDown,
  Check
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { pages } = usePageStore()
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated')

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧：标题 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    H5 低代码编辑器
                  </h1>
                  <p className="text-sm text-gray-500">
                    {pages.length} 个页面
                  </p>
                </div>
              </div>
            </div>

            {/* 右侧：新建按钮 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
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
        {/* 页面管理区域 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 工具栏 */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-600" />
                我的页面
              </h2>
              
              <div className="flex items-center gap-2">
                {/* 视图切换 */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    aria-label="网格视图"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    aria-label="列表视图"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="搜索页面名称、标题或描述..."
                />
              </div>

              {/* 排序选择 - 使用 Radix UI Select */}
              <Select.Root value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <Select.Trigger className="inline-flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]">
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
              <div className="text-center py-12">
                {pages.length === 0 ? (
                  // 无页面状态
                  <div>
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Folder className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">还没有页面</h3>
                    <p className="text-gray-500 mb-6">创建您的第一个 H5 页面开始设计吧</p>
                    <button
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto font-medium"
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
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredAndSortedPages.map((page) => (
                  <PageCard key={page.id} page={page} />
                ))}
              </div>
            )}
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