'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useEditorStore } from '@/store/editor'
import * as Tooltip from '@radix-ui/react-tooltip'

interface SelectionBoxProps {
  children: React.ReactNode
  componentId: string
  isSelected: boolean
  componentName?: string
}

interface ToolbarState {
  top: number
  left: number
  visible: boolean
  isScrolling: boolean
}

export function SelectionBox({ children, componentId, isSelected, componentName }: SelectionBoxProps) {
  const { deleteComponent, selectComponent } = useEditorStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [toolbarState, setToolbarState] = useState<ToolbarState>({ 
    top: 0, 
    left: 0, 
    visible: false,
    isScrolling: false
  })
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const [isMounted, setIsMounted] = useState(false)

  // 确保客户端已挂载
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 计算工具栏位置
  const calculateToolbarPosition = useCallback(() => {
    if (!isSelected || !containerRef.current) {
      setToolbarState(prev => ({ ...prev, visible: false }))
      return
    }

    const rect = containerRef.current.getBoundingClientRect()
    const toolbarHeight = 32
    const margin = 6
    
    // 计算工具栏位置
    let top = rect.top - toolbarHeight - margin
    let left = rect.left
    
    // 边界检查
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    
    // 如果顶部空间不足，放到组件下方
    if (top < 10) {
      top = rect.bottom + margin
    }
    
    // 如果下方空间也不足，放在组件内部顶部
    if (top + toolbarHeight > viewportHeight - 10) {
      top = rect.top + margin
    }
    
    // 水平位置边界检查
    const toolbarWidth = 180
    if (left + toolbarWidth > viewportWidth - 10) {
      left = Math.max(10, viewportWidth - toolbarWidth - 10)
    }
    
    // 更新位置，可见性取决于是否正在滚动
    setToolbarState(prev => ({
      top,
      left,
      visible: !prev.isScrolling, // 只有不在滚动时才显示
      isScrolling: prev.isScrolling
    }))
  }, [isSelected])

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    // 滚动时隐藏工具栏
    setToolbarState(prev => ({ ...prev, isScrolling: true, visible: false }))
    
    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // 滚动停止后300ms重新计算位置并显示工具栏
    scrollTimeoutRef.current = setTimeout(() => {
      setToolbarState(prev => ({ 
        ...prev, 
        isScrolling: false
      }))
      // 滚动停止后重新计算位置
      calculateToolbarPosition()
    }, 300)
  }, [calculateToolbarPosition])

  // 监听选中状态变化
  useEffect(() => {
    if (isSelected) {
      calculateToolbarPosition()
    } else {
      setToolbarState(prev => ({ ...prev, visible: false }))
    }
  }, [isSelected, calculateToolbarPosition])

  // 监听滚动事件
  useEffect(() => {
    if (!isSelected) return

    // 监听多个可能的滚动容器
    const scrollContainers = [
      window,
      document.querySelector('.overflow-y-auto'),
      document.querySelector('.overflow-auto'),
      containerRef.current?.closest('.overflow-y-auto'),
      containerRef.current?.closest('.overflow-auto')
    ].filter(Boolean)

    scrollContainers.forEach(container => {
      container?.addEventListener('scroll', handleScroll, { passive: true })
    })

    window.addEventListener('resize', calculateToolbarPosition, { passive: true })

    return () => {
      scrollContainers.forEach(container => {
        container?.removeEventListener('scroll', handleScroll)
      })
      window.removeEventListener('resize', calculateToolbarPosition)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isSelected, handleScroll, calculateToolbarPosition])

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 实现复制功能
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteComponent(componentId)
  }

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: 实现移动功能
  }

  const renderToolbar = () => {
    if (!toolbarState.visible || !isMounted) return null

    return createPortal(
      <div 
        className="fixed flex items-center space-x-1 bg-blue-500 rounded-md px-2 py-1 shadow-lg pointer-events-auto transition-opacity duration-200"
        style={{
          top: `${toolbarState.top}px`,
          left: `${toolbarState.left}px`,
          zIndex: 9999,
        }}
      >
        <Tooltip.Provider>
          {/* 组件名称 */}
          <span className="text-xs text-white font-medium mr-1">
            {componentName || '组件'}
          </span>
          
          {/* 复制按钮 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleCopy}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-blue-600 rounded transition-colors"
                aria-label="复制组件"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                复制组件
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* 移动按钮 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleMove}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-blue-600 rounded transition-colors"
                aria-label="移动组件"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                移动组件
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* 删除按钮 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleDelete}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-red-500 rounded transition-colors"
                aria-label="删除组件"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                删除组件
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>,
      document.body
    )
  }

  return (
    <div ref={containerRef} className="relative group">
      {children}
      
      {isSelected && !toolbarState.isScrolling && (
        <>
          {/* 优化后的选中边框 */}
          <div className="absolute inset-0 border border-blue-500 rounded-sm pointer-events-none z-10 shadow-sm">
            {/* 四个角的小方块 - 更小更精致 */}
            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </div>
        </>
      )}
      
      {/* 使用Portal渲染工具栏 */}
      {renderToolbar()}
    </div>
  )
} 