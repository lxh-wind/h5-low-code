import { useEffect } from 'react'
import { useEditorStore, type ComponentData } from '@/store/editor'
import { usePageStore } from '@/store/pages'
import type { Component } from '@/types/schema'

/**
 * 自動保存 Hook
 * 監聽編輯器狀態變化，自動將當前頁面保存到 pages store
 * 注意：目前暫時禁用自動保存功能，需要配合當前頁面管理實現
 */
export function useAutoSave() {
  const { components } = useEditorStore()
  const { updatePage } = usePageStore()

  // 暫時禁用自動保存，需要配合當前頁面管理系統
  useEffect(() => {
    // TODO: 實現自動保存邏輯
    // 需要添加當前頁面狀態管理
    console.log('編輯器組件已更新，待實現自動保存功能')
  }, [components, updatePage])
}

/**
 * 轉換 ComponentData 到 Component 類型的遞歸函數
 */
function convertComponentDataToComponent(componentData: ComponentData): Component {
  return {
    ...componentData,
    name: componentData.name || `${componentData.type}-component`, // 提供默認名稱
    props: componentData.props || {},
    style: componentData.style || {},
    children: componentData.children 
      ? componentData.children.map(convertComponentDataToComponent)
      : undefined
  }
}

/**
 * 手動保存 Hook
 * 提供手動保存當前頁面的功能
 * 注意：需要傳入頁面ID才能保存
 */
export function useSaveCurrentPage() {
  const { components } = useEditorStore()
  const { updatePage } = usePageStore()

  const saveCurrentPage = (pageId?: string) => {
    if (!pageId) {
      console.warn('保存失敗：未提供頁面ID')
      return false
    }

    try {
      // 轉換 ComponentData 到 Component 類型
      const convertedComponents: Component[] = components.map(convertComponentDataToComponent)

      updatePage(pageId, {
        components: convertedComponents,
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