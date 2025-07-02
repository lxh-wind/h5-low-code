'use client'

import React from 'react'
import { PropertyGroup as PropertyGroupType } from '@/materials'
import { DynamicPropertyControl } from './DynamicPropertyControl'

interface PropertyGroupProps {
  group: PropertyGroupType
  values: Record<string, string | boolean | undefined>
  onChange: (key: string, value: string | boolean) => void
}

export function PropertyGroup({ group, values, onChange }: PropertyGroupProps) {
  const { title, controls } = group

  return (
    <div className="property-section">
      <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      <div className="space-y-3">
        {controls.map((control) => (
          <DynamicPropertyControl
            key={control.key}
            control={control}
            value={values[control.key]}
            onChange={(value) => onChange(control.key, value)}
          />
        ))}
      </div>
    </div>
  )
} 