'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/store/editor'
import { ComponentRenderer } from './ComponentRenderer'
import { useDroppable } from '@dnd-kit/core'

export function Canvas() {
  const { getRootComponents, selectedComponentId, selectComponent, addComponent } = useEditorStore()
  
  // 获取根级组件（只渲染没有父组件的组件）
  const rootComponents = getRootComponents()

  // 为画布设置拖拽放置区域
  const {
    isOver,
    setNodeRef: setDropRef,
  } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas',
    },
  })

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 如果点击的是画布空白区域，取消选中
    if (e.target === e.currentTarget) {
      selectComponent(null)
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // 记录鼠标按下的位置，用于判断是否为拖拽
    const startX = e.clientX
    const startY = e.clientY
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      // 如果鼠标移动距离很小，认为是点击而不是拖拽
      const deltaX = Math.abs(upEvent.clientX - startX)
      const deltaY = Math.abs(upEvent.clientY - startY)
      
      if (deltaX < 5 && deltaY < 5) {
        // 检查点击的是否为空白区域
        const target = upEvent.target as HTMLElement
        if (target.classList.contains('min-h-full') || target.closest('.space-y-2')) {
          selectComponent(null)
        }
      }
      
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 拖拽处理已移至顶层 DndContext

  // 添加键盘事件监听器
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 按ESC键取消选中
      if (e.key === 'Escape' && selectedComponentId) {
        selectComponent(null)
      }
    }

    // 添加全局键盘事件监听器
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedComponentId, selectComponent])

  // 调试信息
  useEffect(() => {
    console.log('Canvas 组件数据:', {
      totalComponents: rootComponents.length,
      components: rootComponents.map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        hasChildren: !!c.children?.length,
        childrenCount: c.children?.length || 0,
        children: c.children?.map(child => ({
          id: child.id,
          type: child.type,
          name: child.name
        })) || []
      }))
    })
  }, [rootComponents])

  return (
    <div
      ref={setDropRef}
      onClick={handleCanvasClick}
      onMouseDown={handleCanvasMouseDown}
      className={`min-h-full w-full p-4 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
      }`}
    >
      {rootComponents.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400 text-center">
          <div>
            <div className="text-4xl mb-2">📱</div>
            <p className="text-sm">从左侧拖拽或点击组件来添加到页面</p>
            <p className="text-xs mt-2 opacity-75">选中组件后按 ESC 键可取消选中</p>
            {isOver && (
              <p className="text-xs mt-2 text-blue-600 font-medium">松开鼠标放置组件</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          {rootComponents.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={() => selectComponent(component.id)}
            />
          ))}
          {/* 添加提示信息 */}
          {selectedComponentId && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs opacity-75 pointer-events-none z-50">
              按 ESC 键取消选中
            </div>
          )}
          {isOver && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs pointer-events-none z-50">
              松开鼠标添加组件到页面
            </div>
          )}
        </div>
      )}
    </div>
  )
} 