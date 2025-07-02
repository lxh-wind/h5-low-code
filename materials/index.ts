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
let initPromise: Promise<void> | null = null

export async function initializeComponents(): Promise<void> {
  if (isInitialized) return
  
  // 如果已經有初始化請求在進行中，等待它完成
  if (initPromise) {
    return initPromise
  }
  
  console.log('🔧 Initializing component system...')
  
  initPromise = autoRegisterComponents()
    .then(() => {
      isInitialized = true
      console.log('✅ Component system initialized')
    })
    .catch(error => {
      console.error('❌ Component system initialization failed:', error)
      // 重置狀態，允許重試
      initPromise = null
      throw error
    })
  
  return initPromise
}

// 同步版本的初始化 - 如果還沒初始化就拋出錯誤
function ensureInitialized(): void {
  if (!isInitialized) {
    // 嘗試同步註冊基本組件
    try {
      // 同步導入基本組件配置
      const { textConfig } = require('./components/basic/text.config')
      const { buttonConfig } = require('./components/basic/button.config')
      const { imageConfig } = require('./components/basic/image.config')
      const { inputConfig } = require('./components/form/input.config')
      const { containerConfig } = require('./components/layout/container.config')
      const { cardConfig } = require('./components/layout/card.config')
      const { dividerConfig } = require('./components/layout/divider.config')
      const { spaceConfig } = require('./components/layout/space.config')
      const { listConfig } = require('./components/data/list.config')

      // 同步註冊所有組件
      componentRegistry.registerBatch([
        { type: 'text', category: 'basic', config: textConfig },
        { type: 'button', category: 'basic', config: buttonConfig },
        { type: 'image', category: 'basic', config: imageConfig },
        { type: 'input', category: 'form', config: inputConfig },
        { type: 'container', category: 'layout', config: containerConfig },
        { type: 'card', category: 'layout', config: cardConfig },
        { type: 'divider', category: 'layout', config: dividerConfig },
        { type: 'space', category: 'layout', config: spaceConfig },
        { type: 'list', category: 'data', config: listConfig },
      ])

      isInitialized = true
      console.log('✅ Components synchronized successfully')
    } catch (error) {
      console.error('❌ Synchronous component initialization failed:', error)
      throw new Error('Component system not initialized. Please ensure all component configs are available.')
    }
  }
}

// 替代原configs.ts的函数
export function getComponentConfig(type: ComponentType): ComponentConfig {
  // 確保組件系統已初始化
  ensureInitialized()
  
  const config = componentRegistry.getComponent(type)
  if (!config) {
    throw new Error(`Unknown component type: ${type}`)
  }
  return config
}

// 緩存結果避免重複計算
let _cachedComponentConfigs: ComponentConfig[] | null = null
let _configCacheVersion = 0

export function getAllComponentConfigs(): ComponentConfig[] {
  // 確保組件系統已初始化
  ensureInitialized()
  
  const allComponents = componentRegistry.getAllComponents()
  const currentVersion = Object.keys(allComponents).length
  
  // 如果緩存存在且版本匹配，直接返回緩存
  if (_cachedComponentConfigs && _configCacheVersion === currentVersion) {
    return _cachedComponentConfigs
  }
  
  // 重新構建緩存
  _cachedComponentConfigs = Object.values(allComponents)
  _configCacheVersion = currentVersion
  return _cachedComponentConfigs
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

// 立即初始化组件系统，确保首次使用时组件已就绪
initializeComponents().catch(error => {
  console.warn('⚠️ Component system initialization failed:', error)
}) 