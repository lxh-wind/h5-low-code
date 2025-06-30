'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { usePageStore } from '@/store/pages'
import { useFavoriteStore } from '@/store/favorites'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { Page } from '@/types/schema'
import { 
  FileText, 
  MoreVertical, 
  Heart, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Calendar,
  ExternalLink,
  X
} from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'

interface PageCardProps {
  page: Page
}

export function PageCard({ page }: PageCardProps) {
  const { updatePage, deletePage, duplicatePage } = usePageStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { formatDateTime } = useTimeFormat()
  const [showActions, setShowActions] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null)
  const [editForm, setEditForm] = useState({
    name: page.name,
    title: page.title,
    description: page.description || ''
  })

  const isPageFavorite = isFavorite(page.id)

  const handleEdit = () => {
    updatePage(page.id, editForm)
    setShowEditDialog(false)
    setShowActions(false)
  }

  const handleOpenEditDialog = () => {
    setEditForm({
      name: page.name,
      title: page.title,
      description: page.description || ''
    })
    setShowEditDialog(true)
    setShowActions(false)
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: page.name,
      title: page.title,
      description: page.description || ''
    })
    setShowEditDialog(false)
  }

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true)
    setShowActions(false)
  }

  const handleConfirmDelete = () => {
    deletePage(page.id)
    setShowDeleteDialog(false)
  }

  const handleDuplicate = () => {
    duplicatePage(page.id)
    setShowActions(false)
  }

  const handleOpenEditor = () => {
    window.open(`/editor?pageId=${page.id}`, '_blank')
  }

  const handlePreview = () => {
    window.open(`/preview?pageId=${page.id}`, '_blank')
  }

  const handleToggleFavorite = () => {
    toggleFavorite(page.id)
  }

  // 计算菜单位置
  const getMenuPosition = () => {
    if (!buttonRef) return { top: 0, right: 0 }
    const rect = buttonRef.getBoundingClientRect()
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    }
  }

  return (
    <>
      <div 
        className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
        onClick={() => setShowActions(false)}
      >
        {/* 页面预览区域 */}
        <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-8 h-8 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                {page.components.length} 组件
              </p>
            </div>
          </div>
          
          {/* 悬浮操作按钮组 */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            {/* 收藏按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleToggleFavorite()
              }}
              className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/20 ${
                isPageFavorite 
                  ? 'bg-red-50/95 hover:bg-red-100/95' 
                  : 'bg-white/95 hover:bg-white'
              }`}
              aria-label={isPageFavorite ? '取消收藏' : '添加收藏'}
            >
              <Heart className={`w-4 h-4 ${isPageFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            
            {/* 更多操作按钮 */}
            <button
              ref={setButtonRef}
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(!showActions)
              }}
              className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
              aria-label="更多操作"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 页面信息区域 */}
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate flex-1 mr-2 text-sm">
              {page.name}
            </h3>
          </div>
          
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            {page.title}
          </p>
          
          {page.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {page.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="truncate">{formatDateTime(page.updatedAt)}</span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEditor()
            }}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            编辑页面
          </button>
        </div>
      </div>

      {/* 使用 Portal 渲染下拉菜单 */}
      {showActions && typeof window !== 'undefined' && createPortal(
        <>
          {/* 点击外部关闭菜单的遮罩 */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowActions(false)}
          />
          
          {/* 下拉菜单 */}
          <div 
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999] min-w-[140px] animate-in slide-in-from-top-2 duration-200"
            style={{
              top: getMenuPosition().top,
              right: getMenuPosition().right
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePreview()
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              <span>预览页面</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenEditDialog()
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
              <span>编辑信息</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDuplicate()
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-500" />
              <span>复制页面</span>
            </button>
            
            <div className="my-1 border-t border-gray-100" />
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenDeleteDialog()
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>删除页面</span>
            </button>
          </div>
        </>,
        document.body
      )}

      {/* 编辑弹窗 */}
      <Dialog.Root open={showEditDialog} onOpenChange={setShowEditDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  编辑页面信息
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="关闭"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    页面名称
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="请输入页面名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    页面标题
                  </label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="请输入页面标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    页面描述
                  </label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="请输入页面描述"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  取消
                </Button>
                <Button
                  onClick={handleEdit}
                  disabled={!editForm.name.trim() || !editForm.title.trim()}
                >
                  保存
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 删除确认弹窗 */}
      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  确认删除
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="关闭"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>

              <p className="text-gray-600 mb-6">
                确定要删除页面 <strong>&quot;{page.name}&quot;</strong> 吗？此操作无法撤销。
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                >
                  删除
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
} 