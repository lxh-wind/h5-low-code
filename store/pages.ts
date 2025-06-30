import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Page } from '@/types/schema'

interface PageState {
  // 页面数据
  pages: Page[]
  
  // Actions
  createPage: (name: string, title: string, description?: string) => Page
  updatePage: (pageId: string, updates: Partial<Page>) => void
  deletePage: (pageId: string) => void
  getPageById: (pageId: string) => Page | null
  duplicatePage: (pageId: string) => Page | null
  
  // 工具函数
  generatePageId: () => string
}

// 生成唯一ID
const generateId = () => `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export const usePageStore = create<PageState>()(
  persist(
    (set, get) => ({
      pages: [],
      
      createPage: (name, title, description) => {
        const { pages } = get()
        
        const newPage: Page = {
          id: generateId(),
          name,
          title,
          description,
          components: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        const updatedPages = [...pages, newPage]
        
        set({
          pages: updatedPages
        })
        
        return newPage
      },
      
      updatePage: (pageId, updates) => {
        const { pages } = get()
        
        const updatedPages = pages.map(page => 
          page.id === pageId 
            ? { ...page, ...updates, updatedAt: new Date() }
            : page
        )
        
        set({
          pages: updatedPages
        })
      },
      
      deletePage: (pageId) => {
        const { pages } = get()
        
        const updatedPages = pages.filter(page => page.id !== pageId)
        
        set({
          pages: updatedPages
        })
      },
      
      getPageById: (pageId) => {
        const { pages } = get()
        return pages.find(page => page.id === pageId) || null
      },
      
      duplicatePage: (pageId) => {
        const { pages } = get()
        
        const originalPage = pages.find(page => page.id === pageId)
        if (!originalPage) return null
        
        const duplicatedPage: Page = {
          ...originalPage,
          id: generateId(),
          name: `${originalPage.name} 副本`,
          title: `${originalPage.title} 副本`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        const updatedPages = [...pages, duplicatedPage]
        
        set({
          pages: updatedPages
        })
        
        return duplicatedPage
      },
      
      generatePageId: generateId
    }),
    {
      name: 'pages-storage',
      version: 1,
    }
  )
) 