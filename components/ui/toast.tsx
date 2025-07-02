'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { CheckCircleIcon, XCircleIcon, LoaderIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'loading'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const toastStyles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-600",
    close: "text-green-400 hover:text-green-600"
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600", 
    close: "text-red-400 hover:text-red-600"
  },
  loading: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    close: "text-blue-400 hover:text-blue-600"
  }
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconClass = "h-4 w-4 flex-shrink-0"
  
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={iconClass} />
    case 'error':
      return <XCircleIcon className={iconClass} />
    case 'loading':
      return <LoaderIcon className={cn(iconClass, "animate-spin")} />
  }
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: "top-center" | "top-right" | "bottom-center"
}

export function ToastProvider({ 
  children, 
  position = "top-center" 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2)
    const newToast: ToastItem = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    // 自動移除（loading 類型如果設置了有限時間也會自動移除）
    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, duration)
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const positionStyles = {
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4", 
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
  }

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        
        {/* 渲染所有 Toast */}
        {toasts.map(toast => {
          const styles = toastStyles[toast.type]
          
          return (
            <RadixToast.Root
              key={toast.id}
              duration={toast.duration}
              className={cn(
                "border rounded-lg shadow-md p-3 flex items-center gap-3 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide max-w-sm",
                styles.container
              )}
              onOpenChange={(open) => {
                if (!open) dismissToast(toast.id)
              }}
            >
              <ToastIcon type={toast.type} />
              <RadixToast.Title className="text-sm font-medium flex-1 min-w-0 truncate">
                {toast.message}
              </RadixToast.Title>
              <RadixToast.Close className={cn("transition-colors", styles.close)}>
                <XIcon className="h-3 w-3" />
              </RadixToast.Close>
            </RadixToast.Root>
          )
        })}

        <RadixToast.Viewport 
          className={cn(
            "fixed flex flex-col gap-2 w-80 max-w-[90vw] m-0 list-none z-[60] outline-none",
            positionStyles[position]
          )} 
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

// Hook for using toast
export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  return {
    success: (message: string, duration?: number) => context.showToast(message, 'success', duration),
    error: (message: string, duration?: number) => context.showToast(message, 'error', duration),
    loading: (message: string, duration?: number) => context.showToast(message, 'loading', duration ?? Infinity),
    dismiss: context.dismissToast,
    // 通用方法
    toast: context.showToast
  }
}

// 兼容旧版本的导出（逐步迁移用） 
export function Toast({ open, onOpenChange, type, message, duration = 3000 }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: ToastType
  message: string
  duration?: number
}) {
  const styles = toastStyles[type]
  
  return (
    <RadixToast.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(
        "border rounded-lg shadow-md p-3 flex items-center gap-3 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide max-w-sm",
        styles.container
      )}
    >
      <ToastIcon type={type} />
      <RadixToast.Title className="text-sm font-medium flex-1 min-w-0 truncate">
        {message}
      </RadixToast.Title>
      <RadixToast.Close className={cn("transition-colors", styles.close)}>
        <XIcon className="h-3 w-3" />
      </RadixToast.Close>
    </RadixToast.Root>
  )
}

 