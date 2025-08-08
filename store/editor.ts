"use client"

import { create } from 'zustand'
import type { EventConfig } from "@/types/event-types"

export interface ComponentData {
  id: string
  type: string
  name?: string // 组件自定义名称
  locked?: boolean // 组件锁定状态
  props: Record<string, any>
  style: Record<string, any>
  events?: EventConfig[] // 添加事件配置
  animations?: {
    entrance?: {
      type: string
      duration: number
      delay: number
      easing: string
    }
    hover?: {
      type: string
      duration: number
      scale?: number
      rotate?: number
      translateX?: number
      translateY?: number
    }
    click?: {
      type: string
      duration: number
      scale?: number
      rotate?: number
    }
  }
  children?: ComponentData[]
}

interface PageConfig {
  title: string
  description: string
  backgroundColor: string
  width: number
  height: number
}

interface HistoryState {
  components: ComponentData[]
  pageConfig: PageConfig
}

interface EditorState {
  components: ComponentData[]
  selectedId: string | null
  pageConfig: PageConfig
  isCanvasSelected: boolean
  
  // 历史记录管理
  history: HistoryState[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
  
  // Actions
  setComponents: (components: ComponentData[]) => void
  setSelectedId: (id: string | null) => void
  setPageConfig: (config: Partial<PageConfig>) => void
  setIsCanvasSelected: (selected: boolean) => void
  clearSelection: () => void
  addComponent: (component: ComponentData) => void
  updateComponent: (id: string, updates: Partial<ComponentData>) => void
  deleteComponent: (id: string) => void
  duplicateComponent: (id: string) => void
  reorderComponents: (fromIndex: number, toIndex: number) => void
  
  // 历史记录操作
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
    // 初始状态
    components: [],
  selectedId: null,
  isCanvasSelected: false,
  pageConfig: {
    title: "未命名H5页面",
    description: "H5页面描述",
    backgroundColor: "#ffffff",
    width: 375,
    height: 667,
  },
  
  // 历史记录初始状态
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
    
    // Actions
  setComponents: (components) => set({ components }),

  setSelectedId: (id) => {
    set({ selectedId: id })
    if (id) {
      set({ isCanvasSelected: false })
    }
  },

  setPageConfig: (config) => {
    set((state) => ({
      pageConfig: { ...state.pageConfig, ...config }
    }))
  },

  setIsCanvasSelected: (selected) => {
    set({ isCanvasSelected: selected })
    if (selected) {
      set({ selectedId: null })
    }
  },

  clearSelection: () => {
    set({ selectedId: null, isCanvasSelected: false })
  },

    addComponent: (component) => {
    set((state) => ({
      components: [...state.components, component]
    }))
    // 操作完成后保存新状态到历史记录
    const { saveToHistory } = get()
    saveToHistory()
  },
    
      updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((comp) => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    }))
    // 操作完成后保存新状态到历史记录
    const { saveToHistory } = get()
    saveToHistory()
  },
    
    deleteComponent: (id) => {
    const { selectedId } = get()
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
      selectedId: selectedId === id ? null : selectedId
    }))
    // 操作完成后保存新状态到历史记录
    const { saveToHistory } = get()
    saveToHistory()
  },

  duplicateComponent: (id) => {
    const { components } = get()
    const component = components.find((comp) => comp.id === id)
    if (component) {
      const newComponent = {
        ...component,
        id: `${component.type}-${Date.now()}`,
        style: {
          ...component.style,
          top: (component.style.top || 0) + 20,
          left: (component.style.left || 0) + 20,
        },
      }
      set((state) => ({
        components: [...state.components, newComponent]
      }))
      // 操作完成后保存新状态到历史记录
      const { saveToHistory } = get()
      saveToHistory()
    }
  },

  reorderComponents: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const newComponents = [...state.components]
      const [moved] = newComponents.splice(fromIndex, 1)
      newComponents.splice(toIndex, 0, moved)
      return { components: newComponents }
    })
    // 操作完成后保存新状态到历史记录
    const { saveToHistory } = get()
    saveToHistory()
  },

    // 历史记录管理
  saveToHistory: () => {
    const { components, pageConfig, history, historyIndex } = get()
    const newHistoryItem: HistoryState = {
      components: JSON.parse(JSON.stringify(components)),
      pageConfig: JSON.parse(JSON.stringify(pageConfig))
    }
    
    // 如果这是第一次保存（history为空）
    if (history.length === 0) {
      set({
        history: [newHistoryItem],
        historyIndex: 0,
        canUndo: false,
        canRedo: false
      })
      return
    }
    
    // 如果当前不在历史记录的末尾，删除后面的历史记录
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newHistoryItem)
    
    // 限制历史记录数量（最多50条）
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    
    const newIndex = newHistory.length - 1
    set({
      history: newHistory,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: false
    })
  },

      undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const historyItem = history[newIndex]
      set({
        components: historyItem.components,
        pageConfig: historyItem.pageConfig,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        selectedId: null // 撤销后清除选择
      })
    }
  },
    
      redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const historyItem = history[newIndex]
      set({
        components: historyItem.components,
        pageConfig: historyItem.pageConfig,
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
        selectedId: null // 重做后清除选择
      })
    }
  },
}))

// 创建 useEditor hook
export function useEditor() {
  const store = useEditorStore()
  
  return {
    components: store.components,
    selectedId: store.selectedId,
    pageConfig: store.pageConfig,
    isCanvasSelected: store.isCanvasSelected,
    canUndo: store.canUndo,
    canRedo: store.canRedo,
    setComponents: store.setComponents,
    setSelectedId: store.setSelectedId,
    setPageConfig: store.setPageConfig,
    setIsCanvasSelected: store.setIsCanvasSelected,
    clearSelection: store.clearSelection,
    addComponent: store.addComponent,
    updateComponent: store.updateComponent,
    deleteComponent: store.deleteComponent,
    duplicateComponent: store.duplicateComponent,
    reorderComponents: store.reorderComponents,
    undo: store.undo,
    redo: store.redo,
    saveToHistory: store.saveToHistory,
  }
}