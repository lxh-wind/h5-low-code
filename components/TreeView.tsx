'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor'
import { Component } from '@/types/schema'
import { getComponentConfig } from '@/materials/configs'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ChevronDownIcon, ChevronRightIcon, GripVerticalIcon, XIcon } from 'lucide-react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TreeNodeProps {
  component: Component
  level: number
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

function SortableTreeNode({ component, level, isSelected, onSelect, onDelete }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const config = getComponentConfig(component.type)
  const hasChildren = component.children && component.children.length > 0

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: component.id,
    data: {
      type: 'component',
      component,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(component.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(component.id)
  }

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <Tooltip.Provider>
      <div ref={setNodeRef} style={style} {...attributes}>
        <div
          className={`group flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-100 text-blue-700' : ''
          } ${isDragging ? 'opacity-50' : ''} ${
            isOver ? 'bg-blue-50 border border-blue-300' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleClick}
        >
          {/* 拖拽手柄 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                {...listeners}
                className="w-4 h-4 flex items-center justify-center mr-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
              >
                <GripVerticalIcon className="h-3 w-3" />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                拖拽排序
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* 展开/收起按钮 */}
          {hasChildren ? (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                                 <button
                   onClick={toggleExpanded}
                   className="w-4 h-4 flex items-center justify-center mr-1 hover:bg-gray-200 rounded transition-colors"
                   aria-label={isExpanded ? '收起' : '展开'}
                 >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-3 w-3" />
                  ) : (
                    <ChevronRightIcon className="h-3 w-3" />
                  )}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                  {isExpanded ? '收起' : '展开'}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ) : (
            <div className="w-4 h-4 mr-1"></div>
          )}

          {/* 组件图标和名称 */}
          <span className="text-sm mr-1">{config.icon}</span>
          <span className="text-xs flex-1 truncate">
            {component.name || config.name}
          </span>

          {/* 删除按钮 */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
                             <button
                 onClick={handleDelete}
                 className="w-4 h-4 flex items-center justify-center ml-1 hover:bg-red-100 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-all"
                 aria-label="删除组件"
               >
                <XIcon className="h-3 w-3" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
                删除组件
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        {/* 子组件 */}
        {hasChildren && isExpanded && (
          <SortableTreeList components={component.children!} level={level + 1} />
        )}
      </div>
    </Tooltip.Provider>
  )
}

interface SortableTreeListProps {
  components: Component[]
  level: number
}

function SortableTreeList({ components, level }: SortableTreeListProps) {
  const { selectedComponentId, selectComponent, deleteComponent } = useEditorStore()

  return (
    <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
      <div>
        {components.map((component: Component) => (
          <SortableTreeNode
            key={component.id}
            component={component}
            level={level}
            isSelected={selectedComponentId === component.id}
            onSelect={selectComponent}
            onDelete={deleteComponent}
          />
        ))}
      </div>
    </SortableContext>
  )
}

function DragOverlayComponent({ component }: { component: Component | null }) {
  if (!component) return null

  const config = getComponentConfig(component.type)

  return (
    <div className="flex items-center py-1 px-2 rounded bg-white shadow-lg border">
      <span className="text-sm mr-1">{config.icon}</span>
      <span className="text-xs">
        {component.name || config.name}
      </span>
    </div>
  )
}

export function TreeView() {
  const { 
    components, 
    selectedComponentId, 
    selectComponent, 
    deleteComponent,
    moveComponent 
  } = useEditorStore()

  const [activeComponent, setActiveComponent] = useState<Component | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const component = components.find(c => c.id === active.id) ||
      components.flatMap(c => getAllChildren(c)).find(c => c.id === active.id)
    setActiveComponent(component || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveComponent(null)

    if (!over || active.id === over.id) {
      return
    }

    // 获取拖拽的组件和目标组件
    const dragId = active.id as string
    const hoverId = over.id as string

    // 获取目标组件的配置，判断是否可以包含子组件
    const findComponent = (id: string): Component | null => {
      return components.find(c => c.id === id) ||
        components.flatMap(c => getAllChildren(c)).find(c => c.id === id) || null
    }

    const targetComponent = findComponent(hoverId)
    if (!targetComponent) return

    const targetConfig = getComponentConfig(targetComponent.type)
    
    // 如果目标组件可以包含子组件，默认插入为子组件，否则插入到后面
    const position = targetConfig.canHaveChildren ? 'inside' : 'after'

    moveComponent(dragId, hoverId, position)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // 可以在这里添加更复杂的拖拽逻辑，比如显示插入指示器
    // 暂时保持简单，具体的位置判断在 handleDragEnd 中处理
  }

  // 递归获取所有子组件
  const getAllChildren = (component: Component): Component[] => {
    if (!component.children) return []
    return component.children.concat(
      component.children.flatMap(child => getAllChildren(child))
    )
  }

  if (components.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="text-2xl mb-2">🌳</div>
        <p className="text-xs">暂无组件</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="space-y-1">
        <SortableTreeList components={components} level={0} />
      </div>
      
      <DragOverlay>
        <DragOverlayComponent component={activeComponent} />
      </DragOverlay>
    </DndContext>
  )
} 