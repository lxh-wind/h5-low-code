'use client'

import React, { memo, useCallback, useState, useEffect } from 'react'
import { getAllComponentConfigs, initializeComponents } from '@/materials'
import { ComponentConfig } from '@/types/schema'
import { useEditorStore } from '@/store/editor'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useDraggable } from '@dnd-kit/core'

interface MaterialItemProps {
  config: ComponentConfig
  onAddComponent: (config: ComponentConfig) => void
  index: number // 添加索引確保唯一性
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
  const [configs, setConfigs] = useState<ComponentConfig[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 異步初始化組件系統
  useEffect(() => {
    let isMounted = true

    const initComponents = async () => {
      try {
        console.log('🔧 MaterialPanel: 開始初始化組件系統...')
        await initializeComponents()
        
        if (isMounted) {
          const allConfigs = getAllComponentConfigs()
          console.log('✅ MaterialPanel: 組件初始化完成，獲取到', allConfigs.length, '個組件')
          setConfigs(allConfigs)
          setIsInitialized(true)

        }
      } catch (error) {
        console.error('❌ MaterialPanel: 組件初始化失敗:', error)
        if (isMounted) {
          setIsInitialized(true)
        }

      }
    }

    initComponents()

    return () => {
      isMounted = false
    }
  }, [])

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


  // 如果組件未初始化完成，顯示加載狀態
  if (!isInitialized) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
          🔄 正在加載組件庫...
        </div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    )
  }

  // 如果初始化完成但沒有組件，顯示錯誤狀態
  if (configs.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded">
          ⚠️ 組件庫加載失敗，請刷新頁面重試
        </div>
      </div>
    )
  }


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