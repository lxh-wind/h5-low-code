'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Skeleton } from '@/components/common'
import { 
  Smartphone,
  BookOpen,
  Upload,
  Plus
} from 'lucide-react'

interface HomeHeaderProps {
  currentTime: string
  isLoading: boolean
  onOpenTemplateLibrary: () => void
  onImportTemplate: () => void
  onCreatePage: () => void
}

export function HomeHeader({
  currentTime,
  isLoading,
  onOpenTemplateLibrary,
  onImportTemplate,
  onCreatePage
}: HomeHeaderProps) {
  const [isMounted] = useState(true)
  const [currentDate] = useState(() => new Date().toLocaleDateString('zh-CN'))

  return (
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
                  H5搭建 - 编辑器
                </h1>
                {isLoading || !isMounted ? (
                  <Skeleton className="h-4 w-32 mt-1" />
                ) : (
                  <p className="text-sm text-gray-500">
                    {currentDate} {currentTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：快速操作 */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onOpenTemplateLibrary}
            >
              <BookOpen className="w-4 h-4" />
              模板库
            </Button>
            <Button
              variant="ghost"
              onClick={onImportTemplate}
            >
              <Upload className="w-4 h-4" />
              导入模板
            </Button>
            <Button
              onClick={onCreatePage}
            >
              <Plus className="w-4 h-4" />
              新建页面
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 