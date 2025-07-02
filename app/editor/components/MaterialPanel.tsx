'use client'

import React, { useMemo, memo, useCallback } from 'react'
import { getAllComponentConfigs } from '@/materials'
import { ComponentConfig } from '@/types/schema'
import { useEditorStore } from '@/store/editor'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useDraggable } from '@dnd-kit/core'

interface MaterialItemProps {
  config: ComponentConfig
  onAddComponent: (config: ComponentConfig) => void
  index: number // 添加索引确保唯一性
}

// 純客戶端的可拖拽材料項目組件
const DraggableMaterialItem = memo(function DraggableMaterialItem({ config, onAddComponent, index }: MaterialItemProps) {
  // 使用組件類型和索引確保 ID 唯一性
  const uniqueId = `material-${config.type}-${index}`
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: uniqueId,
    data: {
      type: 'material',
      config: config,
    },
  })

  const handleClick = useCallback(() => {
    onAddComponent(config)
  }, [config, onAddComponent])

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
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
          className="material-item w-full text-left cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors"
          aria-label={`添加${config.name}組件`}
        >
          <div className="flex items-center space-x-3 p-2 rounded-lg">
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
          {config.canHaveChildren ? '拖拽到畫布或點擊添加容器組件' : '拖拽到畫布或點擊添加組件'}
          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
})

export const MaterialPanel = memo(function MaterialPanel() {
  // 使用 useMemo 確保 configs 的引用穩定
  const configs = useMemo(() => getAllComponentConfigs(), [])

  // 使用 useCallback 穩定函數引用，在事件處理中直接獲取最新狀態
  const handleAddComponent = useCallback((config: ComponentConfig) => {
    const newComponent = {
      id: `comp_${Date.now()}`,
      type: config.type,
      name: config.name,
      props: config.defaultProps,
      style: config.defaultStyle,
    }

    // 直接獲取最新狀態，避免訂閱導致的重新渲染
    useEditorStore.getState().addComponent(newComponent)
  }, [])

  // 如果組件配置為空，顯示加載狀態
  if (configs.length === 0) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
          🔄 正在加載組件庫...
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    )
  }

  console.log('MaterialPanel - configs',configs);

  return (
    <Tooltip.Provider>
      <div className="space-y-2">
        <div className="text-xs text-gray-500 px-2 py-1 bg-blue-50 rounded">
          💡 點擊添加到頁面，或拖拽到容器中
        </div>
        {configs.map((config, index) => (
          <DraggableMaterialItem
            key={config.id}
            config={config}
            onAddComponent={handleAddComponent}
            index={index}
          />
        ))}
      </div>
    </Tooltip.Provider>
  )
}) 