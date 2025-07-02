import { ComponentRegistry, ExtendedComponentConfig, ComponentCategory } from './types'

/**
 * 组件注册器
 * 负责管理所有组件的注册、发现和获取
 */
class ComponentRegistryManager {
  private registry: ComponentRegistry = {}
  private categories: Map<ComponentCategory, string[]> = new Map()

  /**
   * 注册单个组件
   */
  register(componentType: string, category: ComponentCategory, config: ExtendedComponentConfig): void {
    if (this.registry[componentType]) {
      console.warn(`Component ${componentType} is already registered. Overriding...`)
    }

    this.registry[componentType] = {
      category,
      config
    }

    // 清空缓存
    this._allComponentsCache = null

    // 更新分类索引
    if (!this.categories.has(category)) {
      this.categories.set(category, [])
    }
    const categoryComponents = this.categories.get(category)!
    if (!categoryComponents.includes(componentType)) {
      categoryComponents.push(componentType)
    }

    console.log(`✅ Component '${componentType}' registered in category '${category}'`)
  }

  /**
   * 批量注册组件
   */
  registerBatch(components: Array<{ type: string; category: ComponentCategory; config: ExtendedComponentConfig }>): void {
    components.forEach(({ type, category, config }) => {
      this.register(type, category, config)
    })
  }

  /**
   * 获取组件配置
   */
  getComponent(componentType: string): ExtendedComponentConfig | null {
    const registration = this.registry[componentType]
    return registration ? registration.config : null
  }

  // 缓存所有组件的结果，避免重复创建对象
  private _allComponentsCache: { [key: string]: ExtendedComponentConfig } | null = null
  private _componentsCacheVersion = 0

  /**
   * 获取所有组件
   */
  getAllComponents(): { [key: string]: ExtendedComponentConfig } {
    // 如果缓存存在且版本匹配，直接返回缓存
    if (this._allComponentsCache && this._componentsCacheVersion === Object.keys(this.registry).length) {
      return this._allComponentsCache
    }

    // 重新构建缓存
    const result: { [key: string]: ExtendedComponentConfig } = {}
    Object.keys(this.registry).forEach(key => {
      result[key] = this.registry[key].config
    })
    
    this._allComponentsCache = result
    this._componentsCacheVersion = Object.keys(this.registry).length
    return result
  }

  /**
   * 按分类获取组件
   */
  getComponentsByCategory(category: ComponentCategory): { [key: string]: ExtendedComponentConfig } {
    const result: { [key: string]: ExtendedComponentConfig } = {}
    const componentTypes = this.categories.get(category) || []
    
    componentTypes.forEach(type => {
      const registration = this.registry[type]
      if (registration) {
        result[type] = registration.config
      }
    })
    
    return result
  }

  /**
   * 获取所有分类
   */
  getCategories(): ComponentCategory[] {
    return Array.from(this.categories.keys())
  }

  /**
   * 获取组件数量统计
   */
  getStats(): { total: number; byCategory: Record<ComponentCategory, number> } {
    const byCategory = {} as Record<ComponentCategory, number>
    
    this.categories.forEach((components, category) => {
      byCategory[category] = components.length
    })
    
    return {
      total: Object.keys(this.registry).length,
      byCategory
    }
  }

  /**
   * 检查组件是否存在
   */
  hasComponent(componentType: string): boolean {
    return this.registry[componentType] !== undefined
  }

  /**
   * 移除组件
   */
  unregister(componentType: string): boolean {
    const registration = this.registry[componentType]
    if (!registration) {
      return false
    }

    // 从分类中移除
    const categoryComponents = this.categories.get(registration.category)
    if (categoryComponents) {
      const index = categoryComponents.indexOf(componentType)
      if (index > -1) {
        categoryComponents.splice(index, 1)
      }
    }

    delete this.registry[componentType]
    console.log(`🗑️ Component '${componentType}' unregistered`)
    return true
  }

  /**
   * 清空所有组件
   */
  clear(): void {
    this.registry = {}
    this.categories.clear()
    console.log('🧹 All components cleared')
  }

  /**
   * 获取调试信息
   */
  debug(): void {
    console.group('🔍 Component Registry Debug Info')
    console.log('Total components:', Object.keys(this.registry).length)
    console.log('Categories:', Array.from(this.categories.keys()))
    
    this.categories.forEach((components, category) => {
      console.log(`📁 ${category}:`, components)
    })
    
    console.groupEnd()
  }
}

// 创建全局注册器实例
export const componentRegistry = new ComponentRegistryManager()

// 自动导入和注册函数
export async function autoRegisterComponents(): Promise<void> {
  console.log('🚀 Starting component auto-registration...')

  try {
    // 动态导入基础组件
    const basicComponents = await Promise.all([
      import('./components/basic/text.config').then(m => ({ type: 'text', category: 'basic' as const, config: m.textConfig })),
      import('./components/basic/button.config').then(m => ({ type: 'button', category: 'basic' as const, config: m.buttonConfig })),
      import('./components/basic/image.config').then(m => ({ type: 'image', category: 'basic' as const, config: m.imageConfig })),
    ])

    // 动态导入表单组件
    const formComponents = await Promise.all([
      import('./components/form/input.config').then(m => ({ type: 'input', category: 'form' as const, config: m.inputConfig })),
    ])

    // 动态导入布局组件
    const layoutComponents = await Promise.all([
      import('./components/layout/container.config').then(m => ({ type: 'container', category: 'layout' as const, config: m.containerConfig })),
      import('./components/layout/card.config').then(m => ({ type: 'card', category: 'layout' as const, config: m.cardConfig })),
      import('./components/layout/divider.config').then(m => ({ type: 'divider', category: 'layout' as const, config: m.dividerConfig })),
      import('./components/layout/space.config').then(m => ({ type: 'space', category: 'layout' as const, config: m.spaceConfig })),
    ])

    // 动态导入数据组件
    const dataComponents = await Promise.all([
      import('./components/data/list.config').then(m => ({ type: 'list', category: 'data' as const, config: m.listConfig })),
    ])

    // 注册所有组件
    componentRegistry.registerBatch([
      ...basicComponents,
      ...formComponents,
      ...layoutComponents,
      ...dataComponents
    ])

    console.log('✅ Component auto-registration completed')
    componentRegistry.debug()
  } catch (error) {
    console.error('❌ Component auto-registration failed:', error)
  }
}

// 兼容性函数 - 保持与现有代码的兼容性
export function getExtendedComponentConfig(type: string): ExtendedComponentConfig {
  const config = componentRegistry.getComponent(type)
  if (!config) {
    throw new Error(`Unknown component type: ${type}`)
  }
  return config
}

export function getAllComponentTypes(): string[] {
  return Object.keys(componentRegistry.getAllComponents())
}

// 缓存 getAllComponentConfigs 的结果
let _configsCache: ExtendedComponentConfig[] | null = null
let _configsCacheVersion = 0

export function getAllComponentConfigs(): ExtendedComponentConfig[] {
  const currentVersion = Object.keys(componentRegistry.getAllComponents()).length
  
  // 如果缓存存在且版本匹配，直接返回缓存
  if (_configsCache && _configsCacheVersion === currentVersion) {
    return _configsCache
  }
  
  // 重新构建缓存
  _configsCache = Object.values(componentRegistry.getAllComponents())
  _configsCacheVersion = currentVersion
  return _configsCache
} 