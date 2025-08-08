'use client'

import { Page } from '@/types/schema'
import { PageCard } from './PageCard'
import { PageListItem } from './PageListItem'
import { FavoritePages } from './FavoritePages'
import {
  SkeletonPageCard,
  Skeleton
} from '@/components/common'
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
  Search,
  Grid3X3,
  List,
  Folder,
  Download,
  Settings,
  Plus,
  Sparkles
} from 'lucide-react'

interface PageManagementProps {
  pages: Page[]
  favoritePages: Page[]
  isLoading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  sortBy: 'updated' | 'created' | 'name'
  setSortBy: (sort: 'updated' | 'created' | 'name') => void
  onCreatePage: () => void
  onOpenFavoritePage: (pageId: string) => void
}

export function PageManagement({
  pages,
  favoritePages,
  isLoading,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onCreatePage,
  onOpenFavoritePage
}: PageManagementProps) {
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

  return (
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
            <>
              <CardTitle className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-gray-600" />
                我的页面
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {filteredAndSortedPages.length}
                </span>
              </CardTitle>
              <div className="flex items-center gap-3">
                {/* 快速操作 */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {/* 导出所有页面 */ }}
                    title="导出所有"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {/* 设置 */ }}
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
            </>
          )}


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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索页面名称、标题或描述..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 排序选择 */}
              <div className="min-w-[140px]">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'updated' | 'created' | 'name')}>
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
      <FavoritePages
        favoritePages={favoritePages}
        onOpenPage={onOpenFavoritePage}
        isLoading={isLoading}
      />

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
                  onClick={onCreatePage}
                  size="lg"
                  className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
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
  )
} 