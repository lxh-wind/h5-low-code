"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { useEditor } from "@/store/editor"
import { ComponentRenderer } from "@/components/component-renderer"
import { AlignmentGuides } from "@/components/alignment-guides"

interface AlignmentGuide {
  id: string
  type: "vertical" | "horizontal"
  position: number
  show: boolean
  color: string
  relatedComponents: string[]
}

// 常量定义
const ALIGNMENT_THRESHOLD = 8
const SPACING_DISTANCE = 20
const BOTTOM_MARGIN = 100
const CANVAS_PADDING = 24
const DEFAULT_COMPONENT_WIDTH = 200
const DEFAULT_COMPONENT_HEIGHT = 100

// 工具函数：检查是否应该对齐
const shouldAlign = (value1: number, value2: number): boolean => {
  return Math.abs(value1 - value2) < ALIGNMENT_THRESHOLD
}

// 工具函数：创建对齐指南
const createAlignmentGuide = (
  id: string,
  type: "vertical" | "horizontal",
  position: number,
  color: string,
  relatedComponents: string[]
): AlignmentGuide => ({
  id,
  type,
  position,
  show: true,
  color,
  relatedComponents,
})

export function Canvas() {
  const { components, addComponent, pageConfig, isCanvasSelected, setIsCanvasSelected } = useEditor()
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([])
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null)

  // 计算画布内容区域的实际高度
  const canvasContentHeight = useMemo(() => {
    if (components.length === 0) {
      return pageConfig.height - CANVAS_PADDING
    }

    // 找到最底部组件的位置
    const maxBottom = components.reduce((max, component) => {
      const componentBottom = (component.style.top || 0) + (component.style.height || DEFAULT_COMPONENT_HEIGHT)
      return Math.max(max, componentBottom)
    }, 0)

    // 至少保持配置的高度，如果内容超出则扩展，并添加底部边距
    const minHeight = pageConfig.height - CANVAS_PADDING
    const contentHeight = Math.max(minHeight, maxBottom + BOTTOM_MARGIN)

    return contentHeight
  }, [components, pageConfig.height])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()

    try {
      const dragData = e.dataTransfer.getData("application/json")

      if (!dragData || dragData.trim() === "") {
        console.warn("没有有效的拖拽数据")
        return
      }

      const componentData = JSON.parse(dragData)

      if (!componentData || !componentData.type) {
        console.warn("无效的组件数据结构:", componentData)
        return
      }

      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, pageConfig.width - DEFAULT_COMPONENT_WIDTH))
      const y = Math.max(0, e.clientY - rect.top)

      const newComponent = {
        id: `${componentData.type}-${Date.now()}`,
        type: componentData.type,
        props: { ...componentData.defaultProps },
        style: {
          position: "absolute",
          top: y,
          left: x,
          ...componentData.defaultStyle, // 使用组件配置中的默认样式
        },
      }

      addComponent(newComponent)
    } catch (error) {
      console.error("处理拖拽数据时出错:", error)
    }
  }, [addComponent, pageConfig.width])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // 点击画布本身时选中画布
    if (e.target === e.currentTarget) {
      setIsCanvasSelected(true)
    }
  }, [setIsCanvasSelected])

  // 处理组件拖拽时的对齐辅助线
  const handleComponentDrag = useCallback((componentId: string, newLeft: number, newTop: number) => {
    const guides: AlignmentGuide[] = []
    const currentComponent = components.find((comp) => comp.id === componentId)

    if (!currentComponent) return { left: newLeft, top: newTop, guides: [] }

    const componentWidth = currentComponent.style.width || DEFAULT_COMPONENT_WIDTH
    const componentHeight = currentComponent.style.height || DEFAULT_COMPONENT_HEIGHT
    const componentCenterX = newLeft + componentWidth / 2
    const componentCenterY = newTop + componentHeight / 2
    const componentRight = newLeft + componentWidth
    const componentBottom = newTop + componentHeight

    let alignedLeft = newLeft
    let alignedTop = newTop
    let hasVerticalAlignment = false
    let hasHorizontalAlignment = false

    // 与其他组件对齐
    components.forEach((comp) => {
      if (comp.id === componentId) return

      const compLeft = comp.style.left || 0
      const compTop = comp.style.top || 0
      const compWidth = comp.style.width || DEFAULT_COMPONENT_WIDTH
      const compHeight = comp.style.height || DEFAULT_COMPONENT_HEIGHT
      const compCenterX = compLeft + compWidth / 2
      const compCenterY = compTop + compHeight / 2
      const compRight = compLeft + compWidth
      const compBottom = compTop + compHeight

      // 垂直对齐线检测
      const verticalAlignments = [
        { position: compLeft, type: "left" },
        { position: compRight, type: "right" },
        { position: compCenterX, type: "center" },
      ]

      verticalAlignments.forEach(({ position, type }) => {
        let shouldAlignFlag = false
        const alignPosition = position

        if (type === "left" && shouldAlign(newLeft, position)) {
          alignedLeft = position
          shouldAlignFlag = true
        } else if (type === "right" && shouldAlign(componentRight, position)) {
          alignedLeft = position - componentWidth
          shouldAlignFlag = true
        } else if (type === "center" && shouldAlign(componentCenterX, position)) {
          alignedLeft = position - componentWidth / 2
          shouldAlignFlag = true
        }

        if (shouldAlignFlag && !hasVerticalAlignment) {
          hasVerticalAlignment = true
          guides.push(createAlignmentGuide(
            `v-${comp.id}-${type}`,
            "vertical",
            alignPosition,
            "component",
            [componentId, comp.id]
          ))
        }
      })

      // 水平对齐线检测
      const horizontalAlignments = [
        { position: compTop, type: "top" },
        { position: compBottom, type: "bottom" },
        { position: compCenterY, type: "center" },
      ]

      horizontalAlignments.forEach(({ position, type }) => {
        let shouldAlignFlag = false
        const alignPosition = position

        if (type === "top" && shouldAlign(newTop, position)) {
          alignedTop = position
          shouldAlignFlag = true
        } else if (type === "bottom" && shouldAlign(componentBottom, position)) {
          alignedTop = position - componentHeight
          shouldAlignFlag = true
        } else if (type === "center" && shouldAlign(componentCenterY, position)) {
          alignedTop = position - componentHeight / 2
          shouldAlignFlag = true
        }

        if (shouldAlignFlag && !hasHorizontalAlignment) {
          hasHorizontalAlignment = true
          guides.push(createAlignmentGuide(
            `h-${comp.id}-${type}`,
            "horizontal",
            alignPosition,
            "component",
            [componentId, comp.id]
          ))
        }
      })

      // 间距对齐线
      if (shouldAlign(newLeft, compRight + SPACING_DISTANCE)) {
        alignedLeft = compRight + SPACING_DISTANCE
        guides.push(createAlignmentGuide(
          `spacing-h-${comp.id}-right`,
          "vertical",
          compRight + SPACING_DISTANCE / 2,
          "spacing",
          [componentId, comp.id]
        ))
      } else if (shouldAlign(componentRight, compLeft - SPACING_DISTANCE)) {
        alignedLeft = compLeft - SPACING_DISTANCE - componentWidth
        guides.push(createAlignmentGuide(
          `spacing-h-${comp.id}-left`,
          "vertical",
          compLeft - SPACING_DISTANCE / 2,
          "spacing",
          [componentId, comp.id]
        ))
      }

      if (shouldAlign(newTop, compBottom + SPACING_DISTANCE)) {
        alignedTop = compBottom + SPACING_DISTANCE
        guides.push(createAlignmentGuide(
          `spacing-v-${comp.id}-bottom`,
          "horizontal",
          compBottom + SPACING_DISTANCE / 2,
          "spacing",
          [componentId, comp.id]
        ))
      } else if (shouldAlign(componentBottom, compTop - SPACING_DISTANCE)) {
        alignedTop = compTop - SPACING_DISTANCE - componentHeight
        guides.push(createAlignmentGuide(
          `spacing-v-${comp.id}-top`,
          "horizontal",
          compTop - SPACING_DISTANCE / 2,
          "spacing",
          [componentId, comp.id]
        ))
      }
    })

    // 与画布边缘对齐
    const canvasWidth = pageConfig.width - CANVAS_PADDING * 2
    const canvasCenterX = canvasWidth / 2

    const canvasAlignments = [
      { position: CANVAS_PADDING, type: "left", orientation: "vertical" },
      { position: canvasWidth - CANVAS_PADDING, type: "right", orientation: "vertical" },
      { position: canvasCenterX, type: "center", orientation: "vertical" },
      { position: CANVAS_PADDING, type: "top", orientation: "horizontal" },
    ]

    canvasAlignments.forEach(({ position, type, orientation }) => {
      if (orientation === "vertical") {
        if (type === "left" && shouldAlign(newLeft, position)) {
          alignedLeft = position
          guides.push(createAlignmentGuide(
            `canvas-${type}`,
            "vertical",
            position,
            "canvas",
            [componentId]
          ))
        } else if (type === "right" && shouldAlign(componentRight, position)) {
          alignedLeft = position - componentWidth
          guides.push(createAlignmentGuide(
            `canvas-${type}`,
            "vertical",
            position,
            "canvas",
            [componentId]
          ))
        } else if (type === "center" && shouldAlign(componentCenterX, position)) {
          alignedLeft = position - componentWidth / 2
          guides.push(createAlignmentGuide(
            `canvas-${type}`,
            "vertical",
            position,
            "canvas",
            [componentId]
          ))
        }
      } else {
        if (type === "top" && shouldAlign(newTop, position)) {
          alignedTop = position
          guides.push(createAlignmentGuide(
            `canvas-${type}`,
            "horizontal",
            position,
            "canvas",
            [componentId]
          ))
        }
      }
    })

    // 限制在画布边界内（水平方向限制，垂直方向不限制以允许扩展）
    alignedLeft = Math.max(0, Math.min(alignedLeft, pageConfig.width - componentWidth))
    alignedTop = Math.max(0, alignedTop) // 只限制不能拖到顶部以上

    setAlignmentGuides(guides)
    return { left: alignedLeft, top: alignedTop, guides }
  }, [components, pageConfig.width])

  const handleDragStart = useCallback((componentId: string) => {
    setDraggedComponentId(componentId)
    setAlignmentGuides([])
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedComponentId(null)
    setAlignmentGuides([])
  }, [])

  // 缓存计算结果
  const canvasStyle = useMemo(() => ({
    width: pageConfig.width,
    height: Math.max(pageConfig.height, canvasContentHeight + CANVAS_PADDING),
    backgroundColor: pageConfig.backgroundColor,
  }), [pageConfig.width, pageConfig.height, pageConfig.backgroundColor, canvasContentHeight])

  const contentAreaStyle = useMemo(() => ({
    height: canvasContentHeight
  }), [canvasContentHeight])

  return (
    <div className="py-8 px-4 min-h-full flex items-start justify-center">
      {/* 手机框架 */}
      <div
        className={`bg-white rounded-[2rem] shadow-2xl border-8 relative overflow-hidden transition-all duration-200 ${
          isCanvasSelected ? "border-blue-500 shadow-blue-200" : "border-gray-800"
        }`}
      >
        {/* 状态栏 */}
        <div className="h-6 bg-black flex items-center justify-center flex-shrink-0">
          <div className="w-16 h-1 bg-white rounded-full"></div>
        </div>

        {/* 画布区域 */}
        <div 
          className="w-full relative overflow-hidden" 
          style={canvasStyle}
        >
          <div
            className="w-full relative cursor-pointer"
            style={contentAreaStyle}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleCanvasClick}
          >
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="font-medium">拖拽组件到此处开始设计</p>
                  <p className="text-xs mt-1 text-gray-500">点击组件直接添加，拖拽即可移动</p>
                  <p className="text-xs mt-1 text-gray-500">点击画布可配置H5页面属性</p>
                  <p className="text-xs mt-1 text-gray-500">按ESC键可取消选中</p>
                </div>
              </div>
            )}

            {/* 画布选中状态提示 */}
            {isCanvasSelected && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
                H5页面已选中 - 按ESC取消选中
              </div>
            )}

            {/* 对齐辅助线 */}
            <AlignmentGuides guides={alignmentGuides} draggedComponentId={draggedComponentId} />

            {components.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                onDrag={handleComponentDrag}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}