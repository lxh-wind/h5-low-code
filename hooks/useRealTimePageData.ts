import { useMemo } from 'react'
import { useEditorStore } from '@/store/editor'
import { Page } from '@/types/schema'

/**
 * 获取实时页面数据的自定义 Hook
 * 
 * 注意：目前暫時禁用，因為缺少當前頁面管理功能
 * TODO: 需要配合頁面管理系統實現當前頁面狀態
 * 
 * @returns 暫時返回 null，待實現當前頁面管理後啟用
 */
export function useRealTimePageData(): Page | null {
  const { components } = useEditorStore()

  const realTimePageData = useMemo(() => {
    // TODO: 實現當前頁面管理後，這裡應該合併頁面基本信息和實時組件數據
    // 暫時返回 null
    console.log('實時頁面數據功能待實現，組件數量:', components.length)
    return null
  }, [components])

  return realTimePageData
}

/**
 * 获取实时页面数据的 JSON 字符串
 * 
 * @param pretty 是否格式化输出，默认为 true
 * @returns JSON 字符串，如果没有数据则返回空字符串
 */
export function useRealTimePageJson(pretty: boolean = true): string {
  const pageData = useRealTimePageData()
  
  return useMemo(() => {
    if (!pageData) {
      return ''
    }
    
    return pretty 
      ? JSON.stringify(pageData, null, 2)
      : JSON.stringify(pageData)
  }, [pageData, pretty])
}

/**
 * 获取实时页面统计信息
 * 
 * @returns 页面统计信息对象
 */
export function usePageStats() {
  const pageData = useRealTimePageData()
  
  return useMemo(() => {
    if (!pageData) {
      return {
        componentCount: 0,
        jsonSize: 0,
        hasPage: false
      }
    }

    const jsonString = JSON.stringify(pageData)
    
    return {
      componentCount: pageData.components.length,
      jsonSize: new Blob([jsonString]).size,
      hasPage: true,
      pageName: pageData.name,
      pageTitle: pageData.title
    }
  }, [pageData])
} 