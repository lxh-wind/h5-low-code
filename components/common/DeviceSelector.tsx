'use client'

import { useEditorStore, DEVICE_CONFIGS } from '@/store/editor'
import * as Select from '@radix-ui/react-select'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ChevronDownIcon, CheckIcon, SmartphoneIcon } from 'lucide-react'

interface DeviceSelectorProps {
  showIcon?: boolean
  showTooltip?: boolean
  className?: string
}

export function DeviceSelector({ 
  showIcon = false, 
  showTooltip = false,
  className = "inline-flex items-center justify-between px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
}: DeviceSelectorProps) {
  const { currentDevice, setCurrentDevice } = useEditorStore()

  const selector = (
    <Select.Root
      value={currentDevice.id}
      onValueChange={(value) => {
        const device = DEVICE_CONFIGS.find(d => d.id === value)
        if (device) setCurrentDevice(device)
      }}
    >
      <Select.Trigger className={className}>
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <Select.Viewport className="p-1">
            {DEVICE_CONFIGS.map(device => (
              <Select.Item
                key={device.id}
                value={device.id}
                className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100"
              >
                <Select.ItemText>{device.name}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2">
                  <CheckIcon className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )

  if (showTooltip) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {selector}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-xs" sideOffset={5}>
            选择手机机型
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    )
  }

  if (showIcon) {
    return (
      <div className="flex items-center space-x-3">
        <SmartphoneIcon className="h-5 w-5 text-gray-500" />
        {selector}
      </div>
    )
  }

  return selector
} 