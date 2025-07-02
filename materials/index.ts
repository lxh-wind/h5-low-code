// 类型导出
export * from './types'

// 共享配置导出
export * from './shared/common-styles'

// 注册器导出
export * from './registry'

// 初始化函数
export { autoRegisterComponents } from './registry'

// 兼容性导出 - 完全替代原来的configs.ts
import { componentRegistry, autoRegisterComponents } from './registry'
import { ComponentConfig, ComponentType } from '@/types/schema'

// 确保组件在模块加载时自动注册
let isInitialized = false

export async function initializeComponents(): Promise<void> {
  if (isInitialized) return
  
  console.log('🔧 Initializing component system...')
  await autoRegisterComponents()
  isInitialized = true
  console.log('✅ Component system initialized')
}

// 替代原configs.ts的函数
export function getComponentConfig(type: ComponentType): ComponentConfig {
  const config = componentRegistry.getComponent(type)
  if (!config) {
    throw new Error(`Unknown component type: ${type}`)
  }
  return config
}

export function getAllComponentConfigs(): ComponentConfig[] {
  return Object.values(componentRegistry.getAllComponents())
}

// getExtendedComponentConfig 已经在 registry.ts 中导出，这里重新导出确保可用
export { getExtendedComponentConfig, getAllComponentTypes } from './registry'

// 获取组件统计信息的便捷函数
export function getComponentStats() {
  return componentRegistry.getStats()
}

// 按分类获取组件的便捷函数
export function getBasicComponents() {
  return componentRegistry.getComponentsByCategory('basic')
}

export function getLayoutComponents() {
  return componentRegistry.getComponentsByCategory('layout')
}

export function getFormComponents() {
  return componentRegistry.getComponentsByCategory('form')
}

export function getDataComponents() {
  return componentRegistry.getComponentsByCategory('data')
}

// 自动初始化系统
initializeComponents().catch(error => {
  console.warn('⚠️ Component system initialization failed:', error)
}) 