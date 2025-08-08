"use client"

import React from "react"
import { AnimatedComponent } from "@/components/animated-component"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useEditor } from "@/store/editor"
import { Trash2, Copy } from "lucide-react"
import ComponentFactory from "@/components/shared/component-factory"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ComponentRendererProps {
  component: any
  onDrag?: (componentId: string, left: number, top: number) => { left: number; top: number; guides: any[] }
  onDragStart?: (componentId: string) => void
  onDragEnd?: () => void
  isPreview?: boolean
}

export function ComponentRenderer({
  component,
  onDrag,
  onDragStart,
  onDragEnd,
  isPreview = false,
}: ComponentRendererProps) {
  const { selectedId, setSelectedId, updateComponent, deleteComponent, duplicateComponent } = useEditor()
  const [isDragging, setIsDragging] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, componentX: 0, componentY: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const isSelected = selectedId === component.id

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview || component.locked) return 

    // 检查是否点击了按钮区域，如果是则不处理拖拽
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="button"]')) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    // 选中组件
    setSelectedId(component.id)

    // 记录拖拽开始的位置
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      componentX: component.style.left || 0,
      componentY: component.style.top || 0,
    })

    // 开始拖拽
    setIsDragging(true)
    onDragStart?.(component.id)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isPreview) return

    // 计算鼠标移动的距离
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    // 计算新的组件位置
    const newLeft = dragStart.componentX + deltaX
    const newTop = dragStart.componentY + deltaY

    // 使用对齐功能
    if (onDrag) {
      const { left: alignedLeft, top: alignedTop } = onDrag(component.id, newLeft, newTop)

      updateComponent(component.id, {
        style: {
          ...component.style,
          left: alignedLeft,
          top: alignedTop,
        },
      })
    } else {
      // 基本边界限制
      const componentWidth = component.style.width || 200
      const maxLeft = 375 - componentWidth
      const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft))
      const constrainedTop = Math.max(0, newTop)

      updateComponent(component.id, {
        style: {
          ...component.style,
          left: constrainedLeft,
          top: constrainedTop,
        },
      })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      onDragEnd?.()
    }
  }

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDragging && !isPreview) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, isPreview])

  // 如果组件被隐藏，在编辑模式下不渲染，在预览模式下也要隐藏
  if (component.style.display === 'none') {
    return null
  }

  return (
    <AnimatedComponent component={component} isPreview={isPreview}>
      <div
        ref={elementRef}
        className={`absolute select-none ${
          isPreview ? "" : isDragging ? "cursor-grabbing" : 
          component.locked ? "cursor-not-allowed" : "cursor-grab"
        } ${isSelected && !isPreview ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
        style={{
          top: component.style.top || 0,
          left: component.style.left || 0,
          width: component.style.width || 200,
          height: component.style.height || 100,
          zIndex: isDragging ? 100 : isSelected ? 10 : 1,
          display: component.style.display || 'block', // 确保显示/隐藏状态生效
        }}
        onMouseDown={handleMouseDown}
        id={`component-${component.id}`}
      >
       <ComponentFactory component={component} mode="editor" />

        {/* 选中状态的操作按钮 - 只在编辑模式且非拖拽且选中时显示 */}
        {isSelected && !isDragging && !isPreview && (
          <div className="absolute -top-8 left-0 flex gap-1 bg-white border border-gray-200 rounded shadow-lg opacity-90 hover:opacity-100 transition-opacity z-50">
            <Button
              size="sm"
              variant="ghost"
              className={`h-6 w-6 p-0 hover:bg-gray-100 ${component.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!component.locked) {
                  console.log('复制组件:', component.id)
                  duplicateComponent(component.id)
                }
              }}
              title={component.locked ? "组件已锁定" : "复制组件"}
              disabled={component.locked}
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`h-6 w-6 p-0 hover:bg-gray-100 text-red-500 hover:text-red-600 ${component.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!component.locked) {
                  console.log('点击删除按钮:', component.id)
                  setShowDeleteDialog(true)
                }
              }}
              title={component.locked ? "组件已锁定" : "删除组件"}
              disabled={component.locked}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent className="top-[20%] translate-y-0">
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除组件</AlertDialogTitle>
                  <AlertDialogDescription>
                    您确定要删除这个 {component.type} 组件吗？此操作无法撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                    取消
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      console.log('确认删除组件:', component.id)
                      deleteComponent(component.id)
                      setShowDeleteDialog(false)
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* 组件信息标签 - 只在编辑模式且选中且非拖拽时显示 */}
        {isSelected && !isDragging && !isPreview && (
          <div className="absolute -bottom-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded text-center min-w-max">
            {component.type} ({Math.round(component.style.left || 0)}, {Math.round(component.style.top || 0)})
          </div>
        )}
      </div>
    </AnimatedComponent>
  )
}