import { useMemo } from 'react'
import { useEditorStore } from '@/store/editor'
import { Page } from '@/types/schema'

/**
 * 获取实时页面数据的自定义 Hook
 * 
 * 该 Hook 将 currentPage 的基本信息与画布中的实时组件数据合并，
 * 确保返回的页面数据始终包含最新的组件状态
 * 
 * @returns 包含实时组件数据的页面对象，如果没有当前页面则返回 null
 */
export function useRealTimePageData(): Page | null {
  const { currentPage, components } = useEditorStore()

  const realTimePageData = useMemo(() => {
    if (!currentPage) {
      return null
    }

    // 合并页面基本信息和实时组件数据
    return {
      ...currentPage,
      components, // 使用画布的实时组件数据
      updatedAt: new Date(), // 更新时间戳，确保数据新鲜度
    }
  }, [currentPage, components])

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