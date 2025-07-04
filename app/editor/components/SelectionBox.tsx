'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
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
  const { deleteComponent, copyComponent, moveComponent, getComponentById, components } = useEditorStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [toolbarState, setToolbarState] = useState<ToolbarState>({ 
    top: 0, 
    left: 0, 
    visible: false,
    isScrolling: false
  })
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const [isMounted] = useState(true)

  // 确保客户端已挂载
  // Client-side mounting is handled by initial state

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
    
    // 获取视口尺寸
    const viewportHeight = globalThis.innerHeight
    const viewportWidth = globalThis.innerWidth
    
    // 如果顶部空间不足，放到组件下方
    if (top < 10) {
      top = rect.bottom + margin
    }
    
    // 如果下方空间也不足，放在组件内部顶部
    if (top + toolbarHeight > viewportHeight - 10) {
      top = rect.top + margin
    }
    
    // 水平位置边界检查
    const toolbarWidth = 220 // 增加宽度以容纳更多按钮
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

    globalThis.addEventListener('resize', calculateToolbarPosition, { passive: true })

    return () => {
      scrollContainers.forEach(container => {
        container?.removeEventListener('scroll', handleScroll)
      })
      globalThis.removeEventListener('resize', calculateToolbarPosition)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isSelected, handleScroll, calculateToolbarPosition])

  // 检查组件是否可以移动
  const getComponentMoveInfo = () => {
    const component = getComponentById(componentId)
    if (!component) return { canMoveUp: false, canMoveDown: false }
    
    // 获取同级组件
    const siblings = component.parentId 
      ? getComponentById(component.parentId)?.children || []
      : components.filter(comp => !comp.parentId)
    
    const currentIndex = siblings.findIndex(sibling => sibling.id === componentId)
    
    return {
      canMoveUp: currentIndex > 0,
      canMoveDown: currentIndex < siblings.length - 1
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    copyComponent(componentId)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteComponent(componentId)
  }

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const component = getComponentById(componentId)
    if (!component) return
    
    // 获取同级组件
    const siblings = component.parentId 
      ? getComponentById(component.parentId)?.children || []
      : components.filter(comp => !comp.parentId)
    
    const currentIndex = siblings.findIndex(sibling => sibling.id === componentId)
    
    // 如果不是第一个，则与前一个交换位置
    if (currentIndex > 0) {
      const previousSibling = siblings[currentIndex - 1]
      moveComponent(componentId, previousSibling.id, 'before')
    }
  }

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const component = getComponentById(componentId)
    if (!component) return
    
    // 获取同级组件
    const siblings = component.parentId 
      ? getComponentById(component.parentId)?.children || []
      : components.filter(comp => !comp.parentId)
    
    const currentIndex = siblings.findIndex(sibling => sibling.id === componentId)
    
    // 如果不是最后一个，则与后一个交换位置
    if (currentIndex < siblings.length - 1) {
      const nextSibling = siblings[currentIndex + 1]
      moveComponent(componentId, nextSibling.id, 'after')
    }
  }

  const renderToolbar = () => {
    if (!toolbarState.visible || !isMounted) return null

    const { canMoveUp, canMoveDown } = getComponentMoveInfo()

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

          {/* 向上移动按钮 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={canMoveUp ? handleMoveUp : undefined}
                disabled={!canMoveUp}
                className={`w-6 h-6 flex items-center justify-center text-white rounded transition-colors ${
                  canMoveUp 
                    ? 'hover:bg-blue-600 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                aria-label="向上移动"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                {canMoveUp ? '向上移动' : '已在顶部'}
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* 向下移动按钮 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={canMoveDown ? handleMoveDown : undefined}
                disabled={!canMoveDown}
                className={`w-6 h-6 flex items-center justify-center text-white rounded transition-colors ${
                  canMoveDown 
                    ? 'hover:bg-blue-600 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                aria-label="向下移动"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                {canMoveDown ? '向下移动' : '已在底部'}
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