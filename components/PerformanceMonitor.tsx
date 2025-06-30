'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMonitorProps {
  componentName: string
  enabled?: boolean
}

export function PerformanceMonitor({ componentName, enabled = false }: PerformanceMonitorProps) {
  const renderCountRef = useRef(0)
  const lastRenderTimeRef = useRef(Date.now())
  
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return
    
    renderCountRef.current += 1
    const now = Date.now()
    const timeSinceLastRender = now - lastRenderTimeRef.current
    
    // 如果渲染频率过高（小于16ms，即超过60fps），发出警告
    if (timeSinceLastRender < 16 && renderCountRef.current > 1) {
      console.warn(`⚠️ ${componentName} 渲染频率过高:`, {
        renderCount: renderCountRef.current,
        timeSinceLastRender,
        timestamp: new Date().toISOString()
      })
    }
    
    // 每100次渲染输出一次统计
    if (renderCountRef.current % 100 === 0) {
      console.log(`📊 ${componentName} 渲染统计:`, {
        totalRenders: renderCountRef.current,
        avgRenderInterval: (now - (lastRenderTimeRef.current - timeSinceLastRender * renderCountRef.current)) / renderCountRef.current
      })
    }
    
    lastRenderTimeRef.current = now
  })
  
  return null
}

// 高阶组件版本
export function withPerformanceMonitor<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  enabled = false
) {
  const WithPerformanceMonitor = (props: P) => {
    return (
      <>
        <PerformanceMonitor componentName={componentName} enabled={enabled} />
        <WrappedComponent {...props} />
      </>
    )
  }
  
  WithPerformanceMonitor.displayName = `withPerformanceMonitor(${componentName})`
  
  return WithPerformanceMonitor
} 