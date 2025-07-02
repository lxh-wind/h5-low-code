import { ComponentConfig } from '@/types/schema'

// 属性控件类型
export interface PropertyControl {
  type: 'text' | 'number' | 'color' | 'select' | 'switch' | 'textarea' | 'url'
  label: string
  key: string
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  min?: number
  max?: number
  step?: number
  unit?: string
  description?: string
}

// 属性分组
export interface PropertyGroup {
  title: string
  key: string
  controls: PropertyControl[]
}

// 组件属性配置
export interface ComponentPropertyConfig {
  props?: PropertyGroup[]
  styles?: PropertyGroup[]
}

// 扩展的组件配置
export interface ExtendedComponentConfig extends ComponentConfig {
  propertyConfig: ComponentPropertyConfig
}

// 组件分类
export type ComponentCategory = 'basic' | 'form' | 'layout' | 'data' | 'media' | 'custom'

// 组件注册表类型
export interface ComponentRegistry {
  [componentType: string]: {
    category: ComponentCategory
    config: ExtendedComponentConfig
  }
} 