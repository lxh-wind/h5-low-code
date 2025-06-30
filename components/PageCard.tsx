'use client'

import { useState } from 'react'
import { Page } from '@/types/schema'
import { usePageStore } from '@/store/pages'
import { useRouter } from 'next/navigation'
import { 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  Calendar,
  FileText,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

interface PageCardProps {
  page: Page
}

export function PageCard({ page }: PageCardProps) {
  const router = useRouter()
  const { deletePage, duplicatePage, updatePage } = usePageStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: page.name,
    title: page.title,
    description: page.description || ''
  })
  const [showActions, setShowActions] = useState(false)

  const handleEdit = () => {
    if (isEditing) {
      // 保存编辑
      updatePage(page.id, {
        name: editForm.name,
        title: editForm.title,
        description: editForm.description
      })
      setIsEditing(false)
    } else {
      // 开始编辑
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: page.name,
      title: page.title,
      description: page.description || ''
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm(`确定要删除页面 "${page.name}" 吗？此操作不可撤销。`)) {
      deletePage(page.id)
    }
  }

  const handleDuplicate = () => {
    duplicatePage(page.id)
  }

  const handleOpenEditor = () => {
    router.push(`/editor?pageId=${page.id}`)
  }

  const handlePreview = () => {
    router.push(`/preview?pageId=${page.id}`)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* 页面预览区域 */}
      <div className="aspect-[9/16] bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {page.components.length} 个组件
            </p>
          </div>
        </div>
        
        {/* 悬浮操作按钮 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm"
              aria-label="更多操作"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={handlePreview}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  预览
                </button>
                <button
                  onClick={handleDuplicate}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  复制
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 页面信息区域 */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="页面名称"
            />
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="页面标题"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="页面描述（可选）"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                {page.name}
              </h3>
              <button
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
                aria-label="编辑页面信息"
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {page.title}
            </p>
            
            {page.description && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {page.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(page.updatedAt)}
              </div>
            </div>
            
            <button
              onClick={handleOpenEditor}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              编辑页面
            </button>
          </>
        )}
      </div>
    </div>
  )
} 