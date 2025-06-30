'use client'

import { useState, useEffect } from 'react'

/**
 * 安全的时间格式化钩子，避免水合错误
 */
export function useTimeFormat() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatRelativeTime = (date: Date | string) => {
    if (!isMounted) {
      return '刚刚' // 服务端渲染时返回固定值
    }

    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return d.toLocaleDateString('zh-CN')
  }

  const formatDate = (date: Date | string) => {
    if (!isMounted) {
      return '2024/01/01' // 服务端渲染时返回固定值
    }

    return new Date(date).toLocaleDateString('zh-CN')
  }

  const formatDateTime = (date: Date | string) => {
    if (!isMounted) {
      return '2024/01/01 09:41' // 服务端渲染时返回固定值
    }

    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return {
    isMounted,
    formatRelativeTime,
    formatDate,
    formatDateTime
  }
} 