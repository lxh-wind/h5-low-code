import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteState {
  favoriteIds: string[]
  
  // Actions
  addFavorite: (pageId: string) => void
  removeFavorite: (pageId: string) => void
  toggleFavorite: (pageId: string) => void
  isFavorite: (pageId: string) => boolean
  getFavoriteIds: () => string[]
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      
      addFavorite: (pageId) => {
        const { favoriteIds } = get()
        if (!favoriteIds.includes(pageId)) {
          set({ favoriteIds: [...favoriteIds, pageId] })
        }
      },
      
      removeFavorite: (pageId) => {
        const { favoriteIds } = get()
        set({ favoriteIds: favoriteIds.filter(id => id !== pageId) })
      },
      
      toggleFavorite: (pageId) => {
        const { favoriteIds, addFavorite, removeFavorite } = get()
        if (favoriteIds.includes(pageId)) {
          removeFavorite(pageId)
        } else {
          addFavorite(pageId)
        }
      },
      
      isFavorite: (pageId) => {
        const { favoriteIds } = get()
        return favoriteIds.includes(pageId)
      },
      
      getFavoriteIds: () => {
        const { favoriteIds } = get()
        return favoriteIds
      }
    }),
    {
      name: 'favorite-pages-storage',
      // 兼容旧的localStorage数据
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // 从旧的localStorage格式迁移数据
          if (typeof window !== 'undefined') {
            try {
              const oldFavorites = JSON.parse(localStorage.getItem('favoritePages') || '[]')
              return { favoriteIds: oldFavorites }
            } catch {
              return { favoriteIds: [] }
            }
          }
        }
        return persistedState
      },
      version: 1
    }
  )
) 