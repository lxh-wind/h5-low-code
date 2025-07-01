'use client'

import { useState } from 'react'
import { usePageStore } from '@/store/pages'
import { X, Plus } from 'lucide-react'

interface CreatePageDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (pageId: string) => void
}

export function CreatePageDialog({ isOpen, onClose, onSuccess }: CreatePageDialogProps) {
  const { createPage } = usePageStore()
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.title.trim()) return

    setIsSubmitting(true)
    try {
      const newPage = createPage(form.name.trim(), form.title.trim(), form.description.trim() || undefined)
      if (newPage) {
        onSuccess?.(newPage.id)
        handleClose()
      }
    } catch (error) {
      console.error('创建页面失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setForm({ name: '', title: '', description: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            创建新页面
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="关闭对话框"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="page-name" className="block text-sm font-medium text-gray-700 mb-2">
              页面名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="page-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入页面名称，如：首页、产品详情"
              required
            />
          </div>

          <div>
            <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 mb-2">
              页面标题 <span className="text-red-500">*</span>
            </label>
            <input
              id="page-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入页面标题，如：欢迎来到我们的网站"
              required
            />
          </div>

          <div>
            <label htmlFor="page-description" className="block text-sm font-medium text-gray-700 mb-2">
              页面描述
            </label>
            <textarea
              id="page-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="输入页面描述（可选）"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting || !form.name.trim() || !form.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  创建页面
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 