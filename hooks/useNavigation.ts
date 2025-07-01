'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * 导航相关的 hooks，自动处理 basePath
 */
export function useNavigation() {
  const router = useRouter()
  
  // 获取 basePath，从环境变量中读取
  const getBasePath = useCallback(() => {
    const repoName = process.env.NEXT_PUBLIC_BASE_PATH || ''
    return repoName ? `/${repoName}` : ''
  }, [])

  /**
   * 在新窗口中打开页面，自动加上 basePath
   */
  const openInNewTab = useCallback((path: string) => {
    if (typeof globalThis !== 'undefined' && globalThis.open) {
      const basePath = getBasePath()
      const fullPath = `${basePath}${path}`
      globalThis.open(fullPath, '_blank')
    }
  }, [getBasePath])

  /**
   * 在当前窗口中导航，自动加上 basePath
   */
  const navigateTo = useCallback((path: string) => {
    router.push(path) // Next.js router 会自动处理 basePath
  }, [router])

  /**
   * 替换当前页面，自动加上 basePath
   */
  const replaceTo = useCallback((path: string) => {
    router.replace(path) // Next.js router 会自动处理 basePath
  }, [router])

  /**
   * 获取完整的 URL（包含 basePath）
   */
  const getFullUrl = useCallback((path: string) => {
    const basePath = getBasePath()
    return `${basePath}${path}`
  }, [getBasePath])

  /**
   * 返回上一页
   */
  const goBack = useCallback(() => {
    router.back()
  }, [router])

  /**
   * 前进到下一页
   */
  const goForward = useCallback(() => {
    router.forward()
  }, [router])

  return {
    openInNewTab,
    navigateTo,
    replaceTo,
    getFullUrl,
    goBack,
    goForward,
    basePath: getBasePath()
  }
}

/**
 * 页面跳转相关的 hooks
 */
export function usePageNavigation() {
  const { openInNewTab, navigateTo } = useNavigation()

  /**
   * 打开编辑器页面
   */
  const openEditor = useCallback((pageId?: string) => {
    const path = pageId ? `/editor?pageId=${pageId}` : '/editor'
    openInNewTab(path)
  }, [openInNewTab])

  /**
   * 打开预览页面
   */
  const openPreview = useCallback((pageId?: string) => {
    const path = pageId ? `/preview?pageId=${pageId}` : '/preview'
    openInNewTab(path)
  }, [openInNewTab])

  /**
   * 导航到首页
   */
  const goToHome = useCallback(() => {
    navigateTo('/')
  }, [navigateTo])

  /**
   * 导航到 HomePage
   */
  const goToHomePage = useCallback(() => {
    navigateTo('/HomePage')
  }, [navigateTo])

  return {
    openEditor,
    openPreview,
    goToHome,
    goToHomePage
  }
}
