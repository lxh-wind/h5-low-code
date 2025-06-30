'use client'

import { Page } from '@/types/schema'
import { useFavoriteStore } from '@/store/favorites'
import { Button, Card, CardContent } from '@/components/ui'
import { Heart, Star } from 'lucide-react'

interface FavoritePagesProps {
  favoritePages: Page[]
  onOpenPage: (pageId: string) => void
  isLoading: boolean
}

export function FavoritePages({ favoritePages, onOpenPage, isLoading }: FavoritePagesProps) {
  const { toggleFavorite } = useFavoriteStore()

  const handleRemoveFavorite = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发页面跳转
    toggleFavorite(pageId)
  }

  if (isLoading || favoritePages.length === 0) {
    return null
  }

  return (
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
            onClick={() => onOpenPage(page.id)}
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
  )
} 