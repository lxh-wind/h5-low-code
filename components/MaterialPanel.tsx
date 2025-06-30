'use client'

import { getAllComponentConfigs } from '@/materials/configs'
import { ComponentConfig } from '@/types/schema'
import { useEditorStore } from '@/store/editor'
import * as Tooltip from '@radix-ui/react-tooltip'

interface MaterialItemProps {
  config: ComponentConfig
}

function MaterialItem({ config }: MaterialItemProps) {
  const { addComponent } = useEditorStore()

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
          onClick={handleClick}
          className="material-item w-full text-left"
          aria-label={`添加${config.name}组件`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.icon}</span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{config.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{config.description}</p>
            </div>
          </div>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
          点击添加 {config.name} 到页面
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
      <div className="space-y-3">
        {configs.map((config) => (
          <MaterialItem key={config.type} config={config} />
        ))}
      </div>
    </Tooltip.Provider>
  )
} 