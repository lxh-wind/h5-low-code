'use client'

import { useState } from 'react'
import { Page } from '@/types/schema'
import { useFavoriteStore } from '@/store/favorites'
import { usePageStore } from '@/store/pages'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { Button, Card, CardContent } from '@/components/ui'
import { 
  FileText,
  Heart,
  Eye,
  ExternalLink,
  MoreVertical,
  Copy,
  Trash2,
  Calendar
} from 'lucide-react'

interface PageListItemProps {
  page: Page
}

export function PageListItem({ page }: PageListItemProps) {
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { deletePage, duplicatePage } = usePageStore()
  const { formatRelativeTime } = useTimeFormat()
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
                  <span>{formatRelativeTime(page.updatedAt)}</span>
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