'use client'

import React from 'react'
import { PropertyControl } from '@/materials'
import { processStyleValue } from '@/lib/utils'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import * as Switch from '@radix-ui/react-switch'
import { ChevronDownIcon, CheckIcon } from 'lucide-react'

interface DynamicPropertyControlProps {
  control: PropertyControl
  value: string | boolean | undefined
  onChange: (value: string | boolean) => void
}

export function DynamicPropertyControl({ control, value, onChange }: DynamicPropertyControlProps) {
  const { type, label, placeholder, options, min, max, step, unit } = control

  const handleChange = (newValue: string | boolean) => {
    if (typeof newValue === 'string' && type === 'number') {
      // 如果是数字类型，使用统一的样式处理函数
      const processedValue = processStyleValue(control.key, newValue)
      onChange(processedValue)
    } else {
      onChange(newValue)
    }
  }

  const renderControl = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
          />
        )

      case 'number':
        return (
          <div className="flex">
            <input
              type="number"
              value={typeof value === 'string' ? value.replace(/[^\d.-]/g, '') : ''}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
            />
            {unit && (
              <span className="px-2 py-1 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-xs text-gray-600 flex items-center">
                {unit}
              </span>
            )}
          </div>
        )

      case 'color':
        return (
          <div className="flex">
            <input
              type="color"
              value={(value as string) || '#ffffff'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded-l-md cursor-pointer"
              aria-label={label}
            />
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 px-2 py-1 border border-l-0 border-gray-300 rounded-r-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#ffffff"
            />
          </div>
        )

      case 'select':
        return (
          <Select.Root
            value={(value as string) || options?.[0]?.value || ''}
            onValueChange={(newValue) => handleChange(newValue)}
          >
            <Select.Trigger className="w-full inline-flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <Select.Viewport className="p-1">
                  {options?.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
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

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch.Root
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => handleChange(checked)}
              className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-5" />
            </Switch.Root>
            <Label.Root className="text-sm text-gray-700">
              {(value as boolean) ? '开启' : '关闭'}
            </Label.Root>
          </div>
        )

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
            rows={3}
          />
        )

      case 'url':
        return (
          <input
            type="url"
            value={(value as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder || 'https://'}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-1">
      <Label.Root className="block text-xs font-medium text-gray-700">
        {label}
      </Label.Root>
      {renderControl()}
    </div>
  )
} 