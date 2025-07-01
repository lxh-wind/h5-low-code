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
   * 在新窗口中打开页面，自动加上 basePath 和 origin
   */
  const openInNewTab = useCallback((path: string) => {
    if (typeof globalThis !== 'undefined' && globalThis.open) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const basePath = getBasePath()
      const fullPath = `${origin}${basePath}${path}`
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
   * 获取绝对路径（完整 URL，包含域名）
   */
  const getAbsoluteUrl = useCallback((path: string) => {
    if (typeof window === 'undefined') {
      // 服务端渲染时返回相对路径
      return getFullUrl(path)
    }
    
    const basePath = getBasePath()
    const fullPath = `${basePath}${path}`
    
    // 使用当前页面的 origin 拼接完整 URL
    return `${window.location.origin}${fullPath}`
  }, [getBasePath, getFullUrl])

  /**
   * 获取当前页面的完整 URL
   */
  const getCurrentAbsoluteUrl = useCallback(() => {
    if (typeof window === 'undefined') {
      return ''
    }
    return window.location.href
  }, [])

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
    getAbsoluteUrl,
    getCurrentAbsoluteUrl,
    goBack,
    goForward,
    basePath: getBasePath()
  }
}

/**
 * 页面跳转相关的 hooks
 */
export function usePageNavigation() {
  const { openInNewTab, navigateTo, getAbsoluteUrl } = useNavigation()

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

  /**
   * 获取编辑器页面的绝对路径
   */
  const getEditorAbsoluteUrl = useCallback((pageId?: string) => {
    const path = pageId ? `/editor?pageId=${pageId}` : '/editor'
    return getAbsoluteUrl(path)
  }, [getAbsoluteUrl])

  /**
   * 获取预览页面的绝对路径
   */
  const getPreviewAbsoluteUrl = useCallback((pageId?: string) => {
    const path = pageId ? `/preview?pageId=${pageId}` : '/preview'
    return getAbsoluteUrl(path)
  }, [getAbsoluteUrl])

  /**
   * 获取首页的绝对路径
   */
  const getHomeAbsoluteUrl = useCallback(() => {
    return getAbsoluteUrl('/')
  }, [getAbsoluteUrl])

  return {
    openEditor,
    openPreview,
    goToHome,
    goToHomePage,
    getEditorAbsoluteUrl,
    getPreviewAbsoluteUrl,
    getHomeAbsoluteUrl
  }
}
