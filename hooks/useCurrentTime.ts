'use client'

import { useState, useEffect } from 'react'

interface TimeOptions {
  format?: '12' | '24'
  showSeconds?: boolean
  updateInterval?: number
}

export function useCurrentTime(options: TimeOptions = {}) {
  const {
    format = '24',
    showSeconds = false,
    updateInterval = 1000
  } = options

  const [time, setTime] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const updateTime = () => {
      const now = new Date()
      
      if (format === '12') {
        // 12小时制格式
        const timeString = now.toLocaleTimeString('zh-CN', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: showSeconds ? '2-digit' : undefined
        })
        setTime(timeString)
      } else {
        // 24小时制格式
        const hours = now.getHours().toString().padStart(2, '0')
        const minutes = now.getMinutes().toString().padStart(2, '0')
        const seconds = now.getSeconds().toString().padStart(2, '0')
        
        if (showSeconds) {
          setTime(`${hours}:${minutes}:${seconds}`)
        } else {
          setTime(`${hours}:${minutes}`)
        }
      }
    }

    // 立即更新一次
    updateTime()

    // 设置定时器
    const interval = setInterval(updateTime, updateInterval)

    // 清理函数
    return () => clearInterval(interval)
  }, [format, showSeconds, updateInterval, isMounted])

  // 在客户端挂载前返回固定的时间，避免水合错误
  return isMounted ? time : '09:41'
}

// 简化版本，直接返回常用的时间格式
export function useSimpleTime() {
  return useCurrentTime({ format: '24', showSeconds: false })
}

// 带秒数的版本
export function useDetailedTime() {
  return useCurrentTime({ format: '24', showSeconds: true })
} 