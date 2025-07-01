'use client'

import React from 'react'
import { getAllComponentConfigs } from '@/materials/configs'
import { ComponentConfig } from '@/types/schema'
import { useEditorStore } from '@/store/editor'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useDraggable } from '@dnd-kit/core'

interface MaterialItemProps {
  config: ComponentConfig
}

function DraggableMaterialItem({ config }: MaterialItemProps) {
  const { addComponent } = useEditorStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `material-${config.type}`,
    data: {
      type: 'material',
      config: config,
    },
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = () => {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: config.type,
      name: config.name,
      props: config.defaultProps,
      style: config.defaultStyle,
    }
    addComponent(newComponent)
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={handleClick}
          className="material-item w-full text-left cursor-grab active:cursor-grabbing"
          aria-label={`添加${config.name}组件`}
        >
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">{config.icon}</span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{config.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{config.description}</p>
            </div>
            {config.canHaveChildren && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                容器
              </span>
            )}
          </div>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
          {config.canHaveChildren ? '拖拽到画布或点击添加容器组件' : '拖拽到画布或点击添加组件'}
          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}



export function MaterialPanel() {
  const configs = getAllComponentConfigs()

  return (
    <Tooltip.Provider>
      <div className="space-y-2">
        <div className="text-xs text-gray-500 px-2 py-1 bg-blue-50 rounded">
          💡 点击添加到页面，或拖拽到容器中
        </div>
        {configs.map((config) => (
          <DraggableMaterialItem key={config.type} config={config} />
        ))}
      </div>
    </Tooltip.Provider>
  )
} 