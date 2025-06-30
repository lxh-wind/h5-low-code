import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Component, Page, Project } from '@/types/schema'
import { styleToTailwind } from '@/lib/utils'

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
  
  // 组件相关
  components: Component[]
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
    
    setCurrentPage: (page) => set({ 
      currentPage: page,
      components: page.components,
      selectedComponentId: null,
      hoveredComponentId: null,
    }),
    
    setComponents: (components) => {
      set({ components })
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
        // 添加到指定父组件
        const parentIndex = newComponents.findIndex(c => c.id === parentId)
        if (parentIndex !== -1) {
          const parent = newComponents[parentIndex]
          const children = parent.children || []
          const insertIndex = index !== undefined ? index : children.length
          
          newComponents[parentIndex] = {
            ...parent,
            children: [
              ...children.slice(0, insertIndex),
              newComponent,
              ...children.slice(insertIndex)
            ]
          }
        }
      } else {
        // 添加到根级别
        const insertIndex = index !== undefined ? index : newComponents.length
        newComponents = [
          ...newComponents.slice(0, insertIndex),
          newComponent,
          ...newComponents.slice(insertIndex)
        ]
      }
      
      set({ 
        components: newComponents,
        selectedComponentId: newComponent.id 
      })
      get().saveToHistory()
    },
    
    updateComponent: (id, updates) => {
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
      set({ components: newComponents })
      get().saveToHistory()
    },
    
    deleteComponent: (id) => {
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
      set({ 
        components: newComponents,
        selectedComponentId: null 
      })
      get().saveToHistory()
    },
    
    selectComponent: (id) => set({ selectedComponentId: id }),
    
    setHoveredComponent: (id) => set({ hoveredComponentId: id }),
    
    moveComponent: (dragId, hoverId, position) => {
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
                 const findChildren = (id: string): string[] => {
           const component = comps.find((c: Component) => c.id === id) || 
             comps.flatMap((c: Component) => c.children || []).find((c: Component) => c.id === id)
           return component?.children?.map((c: Component) => c.id) || []
         }
        
        const checkDescendant = (currentId: string): boolean => {
          if (currentId === childId) return true
          const children = findChildren(currentId)
          return children.some(checkDescendant)
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
        set({ components: finalComponents })
        get().saveToHistory()
      }
    },
    
    // 历史记录
    undo: () => {
      const { history, historyIndex } = get()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        set({ 
          components: history[newIndex],
          historyIndex: newIndex,
          selectedComponentId: null 
        })
      }
    },
    
    redo: () => {
      const { history, historyIndex } = get()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        set({ 
          components: history[newIndex],
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
      set({ components: updatedComponents })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('样式预编译完成')
      }
    },
  }))
) 