import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Component, Page, Project } from '@/types/schema'
import { styleToTailwind } from '@/lib/utils'
import { TreeManager, TreeNode } from '@/lib/tree-manager'

// 手机机型配置
export interface DeviceConfig {
  id: string
  name: string
  width: number
  height: number
  safeAreaTop: number
  safeAreaBottom: number
  hasNotch: boolean
}

export const DEVICE_CONFIGS: DeviceConfig[] = [
  {
    id: 'iphone14pro',
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    hasNotch: true
  },
  {
    id: 'iphone14',
    name: 'iPhone 14',
    width: 390,
    height: 844,
    safeAreaTop: 47,
    safeAreaBottom: 34,
    hasNotch: true
  },
  {
    id: 'iphonese',
    name: 'iPhone SE',
    width: 375,
    height: 667,
    safeAreaTop: 20,
    safeAreaBottom: 0,
    hasNotch: false
  },
  {
    id: 'xiaomi13',
    name: '小米 13',
    width: 393,
    height: 851,
    safeAreaTop: 47,
    safeAreaBottom: 24,
    hasNotch: true
  },
  {
    id: 'huaweip60',
    name: '华为 P60',
    width: 393,
    height: 852,
    safeAreaTop: 44,
    safeAreaBottom: 24,
    hasNotch: true
  }
]

interface EditorState {
  // 当前项目
  currentProject: Project | null
  currentPage: Page | null
  
  // 组件相关 - 使用TreeManager统一管理
  treeManager: TreeManager | null
  components: Component[] // 保持兼容性，但作为只读数据
  selectedComponentId: string | null
  hoveredComponentId: string | null
  
  // 历史记录
  history: Component[][]
  historyIndex: number
  
  // UI状态
  isDragging: boolean
  previewMode: boolean
  currentDevice: DeviceConfig
  
  // Actions
  setCurrentProject: (project: Project) => void
  setCurrentPage: (page: Page) => void
  setComponents: (components: Component[]) => void
  addComponent: (component: Component, parentId?: string, index?: number) => void
  updateComponent: (id: string, updates: Partial<Component>) => void
  deleteComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  setHoveredComponent: (id: string | null) => void
  moveComponent: (dragId: string, hoverId: string, position: 'before' | 'after' | 'inside') => void
  
  // 树管理器相关方法
  getTreeNodes: () => TreeNode[]
  getVisibleTreeNodes: () => TreeNode[]
  getRootComponents: () => Component[]
  toggleNodeExpanded: (id: string) => void
  
  // 历史记录
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveToHistory: () => void
  
  // UI状态
  setIsDragging: (isDragging: boolean) => void
  setPreviewMode: (previewMode: boolean) => void
  setCurrentDevice: (device: DeviceConfig) => void
  
  // 工具函数
  getComponentById: (id: string) => Component | null
  getComponentChildren: (parentId: string) => Component[]
  getComponentPath: (id: string) => Component[]
  generateUniqueId: () => string
  
  // 样式预编译
  precompileStyles: () => void
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    currentProject: null,
    currentPage: null,
    treeManager: null,
    components: [],
    selectedComponentId: null,
    hoveredComponentId: null,
    history: [[]],
    historyIndex: 0,
    isDragging: false,
    previewMode: false,
    currentDevice: DEVICE_CONFIGS[1], // 默认使用iPhone 14
    
    // Actions
    setCurrentProject: (project) => set({ currentProject: project }),
    
    setCurrentPage: (page) => {
      const treeManager = new TreeManager(page.components)
      set({ 
        currentPage: page,
        components: page.components,
        treeManager,
        selectedComponentId: null,
        hoveredComponentId: null,
      })
    },
    
    setComponents: (components) => {
      const treeManager = new TreeManager(components)
      set({ 
        components,
        treeManager
      })
      get().saveToHistory()
    },
    
    addComponent: (component, parentId, index) => {
      const { components, generateUniqueId } = get()
      const newComponent = { 
        ...component, 
        id: generateUniqueId(),
        parentId: parentId || undefined 
      }
      
      let newComponents = [...components]
      
      if (parentId) {
        // 添加到指定父组件的 children 中（递归查找父组件）
        const addToParent = (comps: Component[]): Component[] => {
          return comps.map(comp => {
            if (comp.id === parentId) {
              const children = comp.children || []
              const insertIndex = index !== undefined ? index : children.length
              return {
                ...comp,
                children: [
                  ...children.slice(0, insertIndex),
                  newComponent,
                  ...children.slice(insertIndex)
                ]
              }
            }
            if (comp.children) {
              return { ...comp, children: addToParent(comp.children) }
            }
            return comp
          })
        }
        newComponents = addToParent(newComponents)
      } else {
        // 添加到根级别
        const insertIndex = index !== undefined ? index : newComponents.length
        newComponents = [
          ...newComponents.slice(0, insertIndex),
          newComponent,
          ...newComponents.slice(insertIndex)
        ]
      }
      
      // 创建新的 TreeManager，保持展开状态
      const { treeManager: currentTreeManager } = get()
      const newTreeManager = new TreeManager(newComponents, currentTreeManager?.getExpandedState())
      
      set({ 
        components: newComponents,
        treeManager: newTreeManager,
        selectedComponentId: newComponent.id 
      })
      get().saveToHistory()
    },
    
    updateComponent: (id, updates) => {
      const { treeManager } = get()
      
      if (treeManager) {
        // 使用 TreeManager 更新组件
        const newComponents = treeManager.updateComponent(id, updates)
        const newTreeManager = new TreeManager(newComponents, treeManager.getExpandedState())
        
        set({ 
          components: newComponents,
          treeManager: newTreeManager
        })
        get().saveToHistory()
      } else {
        // 兜底：使用原来的递归更新逻辑
        const { components } = get()
        
        const updateComponentRecursive = (comps: Component[]): Component[] => {
          return comps.map(comp => {
            if (comp.id === id) {
              return { ...comp, ...updates }
            }
            if (comp.children) {
              return { ...comp, children: updateComponentRecursive(comp.children) }
            }
            return comp
          })
        }
        
        const newComponents = updateComponentRecursive(components)
        const { treeManager: currentTreeManager } = get()
        const newTreeManager = new TreeManager(newComponents, currentTreeManager?.getExpandedState())
        
        set({ 
          components: newComponents,
          treeManager: newTreeManager
        })
        get().saveToHistory()
      }
    },
    
    deleteComponent: (id) => {
      const { treeManager } = get()
      
      if (treeManager) {
        // 使用 TreeManager 删除组件
        const newComponents = treeManager.deleteNode(id)
        const newTreeManager = new TreeManager(newComponents, treeManager.getExpandedState())
        
        set({ 
          components: newComponents,
          treeManager: newTreeManager,
          selectedComponentId: null 
        })
        get().saveToHistory()
      } else {
        // 兜底：使用原来的递归删除逻辑
        const { components } = get()
        
        const deleteComponentRecursive = (comps: Component[]): Component[] => {
          return comps
            .filter(comp => comp.id !== id)
            .map(comp => ({
              ...comp,
              children: comp.children ? deleteComponentRecursive(comp.children) : undefined
            }))
        }
        
        const newComponents = deleteComponentRecursive(components)
        const newTreeManager = new TreeManager(newComponents)
        
        set({ 
          components: newComponents,
          treeManager: newTreeManager,
          selectedComponentId: null 
        })
        get().saveToHistory()
      }
    },
    
    selectComponent: (id) => set({ selectedComponentId: id }),
    
    setHoveredComponent: (id) => set({ hoveredComponentId: id }),
    
    moveComponent: (dragId, hoverId, position) => {
      const { treeManager } = get()
      
      if (treeManager) {
        // 使用 TreeManager 移动组件
        const newComponents = treeManager.moveNode(dragId, hoverId, position)
        const newTreeManager = new TreeManager(newComponents, treeManager.getExpandedState())
        
        set({ 
          components: newComponents,
          treeManager: newTreeManager
        })
        get().saveToHistory()
      } else {
        // 兜底：使用原来的递归移动逻辑
        const { components } = get()
        
        // 递归查找并移除拖拽的组件
        const findAndRemoveComponent = (comps: Component[], targetId: string): { component: Component | null, newComps: Component[] } => {
          for (let i = 0; i < comps.length; i++) {
            if (comps[i].id === targetId) {
              const component = comps[i]
              const newComps = [...comps.slice(0, i), ...comps.slice(i + 1)]
              return { component, newComps }
            }
            
            if (comps[i].children) {
              const result = findAndRemoveComponent(comps[i].children || [], targetId)
              if (result.component) {
                const newComps = [...comps]
                newComps[i] = { ...newComps[i], children: result.newComps }
                return { component: result.component, newComps }
              }
            }
          }
          return { component: null, newComps: comps }
        }
        
        // 递归插入组件
        const insertComponent = (comps: Component[], targetId: string, component: Component, position: 'before' | 'after' | 'inside'): Component[] => {
          for (let i = 0; i < comps.length; i++) {
            if (comps[i].id === targetId) {
              if (position === 'inside') {
                // 插入为子组件
                const children = comps[i].children || []
                return [
                  ...comps.slice(0, i),
                  { ...comps[i], children: [...children, { ...component, parentId: targetId }] },
                  ...comps.slice(i + 1)
                ]
              } else if (position === 'before') {
                // 插入到目标组件前面
                return [
                  ...comps.slice(0, i),
                  { ...component, parentId: comps[i].parentId },
                  ...comps.slice(i)
                ]
              } else {
                // 插入到目标组件后面
                return [
                  ...comps.slice(0, i + 1),
                  { ...component, parentId: comps[i].parentId },
                  ...comps.slice(i + 1)
                ]
              }
            }
            
            if (comps[i].children) {
              const newChildren = insertComponent(comps[i].children || [], targetId, component, position)
              if (newChildren !== comps[i].children) {
                return [
                  ...comps.slice(0, i),
                  { ...comps[i], children: newChildren },
                  ...comps.slice(i + 1)
                ]
              }
            }
          }
          return comps
        }
        
        // 检查是否试图将组件移动到自己的子组件中
        const isDescendant = (parentId: string, childId: string, comps: Component[]): boolean => {
          const findComponent = (id: string, components: Component[]): Component | null => {
            for (const comp of components) {
              if (comp.id === id) return comp
              if (comp.children) {
                const found = findComponent(id, comp.children)
                if (found) return found
              }
            }
            return null
          }
          
          const checkDescendant = (currentId: string): boolean => {
            if (currentId === childId) return true
            const component = findComponent(currentId, comps)
            if (component?.children) {
              return component.children.some(child => checkDescendant(child.id))
            }
            return false
          }
          
          return checkDescendant(parentId)
        }
        
        // 避免将组件移动到自己或自己的子组件中
        if (dragId === hoverId || isDescendant(dragId, hoverId, components)) {
          return
        }
        
        // 执行移动操作
        const { component: draggedComponent, newComps: componentsWithoutDragged } = findAndRemoveComponent(components, dragId)
        
        if (draggedComponent) {
          const finalComponents = insertComponent(componentsWithoutDragged, hoverId, draggedComponent, position)
          const { treeManager: currentTreeManager } = get()
          const newTreeManager = new TreeManager(finalComponents, currentTreeManager?.getExpandedState())
          
          set({ 
            components: finalComponents,
            treeManager: newTreeManager
          })
          get().saveToHistory()
        }
      }
    },
    
    // 历史记录
    undo: () => {
      const { history, historyIndex } = get()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        const components = history[newIndex]
        const newTreeManager = new TreeManager(components)
        
        set({ 
          components,
          treeManager: newTreeManager,
          historyIndex: newIndex,
          selectedComponentId: null 
        })
      }
    },
    
    redo: () => {
      const { history, historyIndex } = get()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        const components = history[newIndex]
        const newTreeManager = new TreeManager(components)
        
        set({ 
          components,
          treeManager: newTreeManager,
          historyIndex: newIndex,
          selectedComponentId: null 
        })
      }
    },
    
    canUndo: () => get().historyIndex > 0,
    
    canRedo: () => get().historyIndex < get().history.length - 1,
    
    saveToHistory: () => {
      const { components, history, historyIndex } = get()
      
      // 检查是否与当前历史记录相同，避免重复保存
      const currentHistory = history[historyIndex]
      if (currentHistory && JSON.stringify(currentHistory) === JSON.stringify(components)) {
        return
      }
      
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...components])
      
      // 限制历史记录数量
      if (newHistory.length > 50) {
        newHistory.shift()
      } else {
        set({ historyIndex: historyIndex + 1 })
      }
      
      set({ history: newHistory })
    },
    
    // UI状态
    setIsDragging: (isDragging) => set({ isDragging }),
    
    setPreviewMode: (previewMode) => set({ previewMode }),
    
    setCurrentDevice: (device) => set({ currentDevice: device }),
    
    // 工具函数
    getComponentById: (id) => {
      const { components } = get()
      
      const findComponent = (comps: Component[]): Component | null => {
        for (const comp of comps) {
          if (comp.id === id) return comp
          if (comp.children) {
            const found = findComponent(comp.children)
            if (found) return found
          }
        }
        return null
      }
      
      return findComponent(components)
    },
    
    getComponentChildren: (parentId) => {
      const parent = get().getComponentById(parentId)
      return parent?.children || []
    },
    
    getComponentPath: (id) => {
      const { components } = get()
      const path: Component[] = []
      
      const findPath = (comps: Component[], targetId: string, currentPath: Component[]): boolean => {
        for (const comp of comps) {
          const newPath = [...currentPath, comp]
          if (comp.id === targetId) {
            path.push(...newPath)
            return true
          }
          if (comp.children && findPath(comp.children, targetId, newPath)) {
            return true
          }
        }
        return false
      }
      
      findPath(components, id, [])
      return path
    },
    
    generateUniqueId: () => {
      return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    
    // 树管理器相关方法
    getTreeNodes: () => {
      const { treeManager } = get()
      return treeManager ? treeManager.getRootNodes() : []
    },

    getVisibleTreeNodes: () => {
      const { treeManager } = get()
      return treeManager ? treeManager.getVisibleNodes() : []
    },

    getRootComponents: () => {
      const { treeManager } = get()
      if (treeManager) {
        // 从 TreeManager 获取根节点，递归构建带有 children 的组件结构
        const convertTreeNodeToComponent = (node: TreeNode): Component => {
          return {
            ...node.component,
            children: node.children.map(convertTreeNodeToComponent)
          }
        }
        
        return treeManager.getRootNodes().map(convertTreeNodeToComponent)
      } else {
        // 兜底：从 components 数组中构建层级结构
        const { components } = get()
        const rootComponents = components.filter(comp => !comp.parentId)
        
        // 递归构建子组件结构
        const buildChildren = (parentId: string): Component[] => {
          return components
            .filter(comp => comp.parentId === parentId)
            .map(comp => ({
              ...comp,
              children: buildChildren(comp.id)
            }))
        }
        
        return rootComponents.map(comp => ({
          ...comp,
          children: buildChildren(comp.id)
        }))
      }
    },

    toggleNodeExpanded: (id) => {
      const { treeManager } = get()
      if (treeManager) {
        treeManager.toggleExpanded(id)
        // 创建新的实例来触发重新渲染，保持展开状态
        const newTreeManager = new TreeManager(treeManager.toComponentArray(), treeManager.getExpandedState())
        set({ treeManager: newTreeManager })
      }
    },

    // 样式预编译 - 递归处理所有组件
    precompileStyles: () => {
      const { components } = get()
      
      if (process.env.NODE_ENV === 'development') {
        console.log('开始样式预编译，原始组件数量:', components.length)
      }
      
      const precompileComponentStyles = (comps: Component[]): Component[] => {
        return comps.map(comp => {
          // 将样式转换为 TailwindCSS 类名
          const className = styleToTailwind(comp.style)
          
          const updatedComp: Component = {
            ...comp,
            className
          }
          
          // 递归处理子组件
          if (comp.children && comp.children.length > 0) {
            updatedComp.children = precompileComponentStyles(comp.children)
          }
          
          return updatedComp
        })
      }
      
      const updatedComponents = precompileComponentStyles(components)
      const treeManager = new TreeManager(updatedComponents)
      set({ 
        components: updatedComponents,
        treeManager
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('样式预编译完成')
      }
    },
  }))
) 