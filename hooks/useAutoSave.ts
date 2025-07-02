import { useEffect } from 'react'
import { useEditorStore } from '@/store/editor'
import { usePageStore } from '@/store/pages'

/**
 * 自動保存 Hook
 * 監聽編輯器狀態變化，自動將當前頁面保存到 pages store
 */
export function useAutoSave() {
  const { currentPage, components, autoSave } = useEditorStore()
  const { updatePage } = usePageStore()

  useEffect(() => {
    if (!autoSave || !currentPage) return

    // 延遲保存，避免頻繁操作
    const timer = setTimeout(() => {
      updatePage(currentPage.id, {
        components,
        updatedAt: new Date()
      })
    }, 500) // 500ms 延遲

    return () => clearTimeout(timer)
  }, [components, currentPage, autoSave, updatePage])
}

/**
 * 手動保存 Hook
 * 提供手動保存當前頁面的功能
 */
export function useSaveCurrentPage() {
  const { currentPage, components } = useEditorStore()
  const { updatePage } = usePageStore()

  const saveCurrentPage = () => {
    if (!currentPage) {
      return false
    }

    try {
      updatePage(currentPage.id, {
        components,
        updatedAt: new Date()
      })
      return true
    } catch (error) {
      console.error('保存失敗:', error)
      return false
    }
  }

  return saveCurrentPage
} 