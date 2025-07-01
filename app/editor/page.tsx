'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Canvas, PropertyPanel, LeftPanel } from './components'
import { Toolbar } from '@/components/layout'
import { PhoneFrame } from '@/components/common'
import { useEditorStore } from '@/store/editor'
import { usePageStore } from '@/store/pages'
import { initializeEditor } from '@/lib/mock'
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageId = searchParams.get('pageId')
  
  const { setCurrentPage, addComponent, moveComponent } = useEditorStore()
  const { getPageById } = usePageStore()

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // 处理全局拖拽事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // 检查是否是从 MaterialPanel 拖拽的组件
    if (active.data.current?.type === 'material') {
      const config = active.data.current.config
      
      const newComponent = {
        id: `comp_${Date.now()}`,
        type: config.type,
        name: config.name,
        props: config.defaultProps,
        style: config.defaultStyle,
      }

      // 检查拖拽目标
      if (over.id === 'canvas-drop-zone') {
        // 拖拽到画布空白区域，添加到根级别
        addComponent(newComponent)
      } else if (typeof over.id === 'string' && over.id.startsWith('component-')) {
        // 拖拽到容器组件中
        const targetComponentId = over.id.replace('component-', '')
        addComponent(newComponent, targetComponentId)
      }
    }
    
    // 检查是否是树节点拖拽
    else if (active.data.current?.type === 'tree-node' && over.data.current?.type === 'tree-drop') {
      const dragNodeId = active.data.current.nodeId
      const dropNodeId = over.data.current.nodeId
      const position = over.data.current.position as 'before' | 'after' | 'inside'
      
      if (dragNodeId !== dropNodeId) {
        moveComponent(dragNodeId, dropNodeId, position)
      }
    }
  }

  // 初始化编辑器数据
  useEffect(() => {
    if (pageId) {
      // 如果有 pageId，加载对应的页面
      const page = getPageById(pageId)
      if (page) {
        setCurrentPage(page)
      } else {
        // 页面不存在，跳转到首页
        router.push('/')
      }
    } else {
      // 没有 pageId，使用默认数据
      const { page } = initializeEditor()
      setCurrentPage(page)
    }
  }, [pageId, setCurrentPage, getPageById, router])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        {/* 顶部工具栏 */}
        <Toolbar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧面板 */}
          <LeftPanel />

          {/* 中间画布区域 */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="relative">
              <PhoneFrame title="页面编辑">
                <Canvas />
              </PhoneFrame>
            </div>
          </div>

          {/* 右侧属性面板 */}
          <div className="w-[420px] property-panel overflow-y-auto">
            <PropertyPanel />
          </div>
        </div>
      </div>
    </DndContext>
  )
}
