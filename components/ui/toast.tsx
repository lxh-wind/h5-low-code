"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

// Toast 位置类型定义
export type ToastPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right'

// 位置样式映射
const positionStyles: Record<ToastPosition, string> = {
  'top-left': 'fixed top-4 left-4 z-[100] flex max-h-screen flex-col gap-2 w-full max-w-[420px]',
  'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen flex-col gap-2 w-full max-w-[420px]',
  'top-right': 'fixed top-4 right-4 z-[100] flex max-h-screen flex-col gap-2 w-full max-w-[420px]',
  'bottom-left': 'fixed bottom-4 left-4 z-[100] flex max-h-screen flex-col-reverse gap-2 w-full max-w-[420px]',
  'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen flex-col-reverse gap-2 w-full max-w-[420px]',
  'bottom-right': 'fixed bottom-4 right-4 z-[100] flex max-h-screen flex-col-reverse gap-2 w-full max-w-[420px]',
}

interface ToastViewportProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
  position?: ToastPosition
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, position = 'top-center', ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(positionStyles[position], className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

// Toast 类型定义
export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  action?: ToastActionElement
}

// Toast Context
const ToastContext = React.createContext<{
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
})

// Toast Provider 组件
interface ToastProviderWithStateProps extends React.ComponentProps<typeof ToastProvider> {
  position?: ToastPosition
}

export function ToastProviderWithState({ 
  children, 
  position = 'top-center',
  ...props 
}: ToastProviderWithStateProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const addToast = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { ...toast, id }])
    
    // 自动移除 (除了错误类型)
    if (toast.type !== 'error') {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3000)
    }
    
    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <ToastProvider {...props}>
        {children}
        <ToastViewport position={position} />
        {toasts.map(toast => {
          // 根據類型添加對應的圖標和樣式
          const getToastIcon = () => {
            switch (toast.type) {
              case 'success':
                return <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              case 'error':
                return <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-3 h-3 text-red-600" />
                </div>
              case 'warning':
                return <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              case 'info':
                return <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              default:
                return null
            }
          }

          return (
            <Toast
              key={toast.id}
              variant={toast.type === 'error' ? 'destructive' : 'default'}
              className={`${toast.type === 'success' ? 'border-green-200 bg-green-50' : ''} ${toast.type === 'warning' ? 'border-orange-200 bg-orange-50' : ''} ${toast.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                {getToastIcon()}
                <div className="grid gap-1 flex-1">
                  <ToastTitle className={`${toast.type === 'success' ? 'text-green-800' : ''} ${toast.type === 'warning' ? 'text-orange-800' : ''} ${toast.type === 'info' ? 'text-blue-800' : ''}`}>
                    {toast.title}
                  </ToastTitle>
                  {toast.description && (
                    <ToastDescription className={`${toast.type === 'success' ? 'text-green-700' : ''} ${toast.type === 'warning' ? 'text-orange-700' : ''} ${toast.type === 'info' ? 'text-blue-700' : ''}`}>
                      {toast.description}
                    </ToastDescription>
                  )}
                </div>
              </div>
              {toast.action}
              <ToastClose />
            </Toast>
          )
        })}
      </ToastProvider>
    </ToastContext.Provider>
  )
}

// useToast Hook
export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { addToast, removeToast } = context

  const toast = React.useCallback((
    type: ToastType,
    title: string,
    description?: string,
    action?: ToastActionElement
  ) => {
    return addToast({ type, title, description, action })
  }, [addToast])

  const success = React.useCallback((title: string, description?: string) => {
    return toast('success', title, description)
  }, [toast])

  const error = React.useCallback((title: string, description?: string) => {
    return toast('error', title, description)
  }, [toast])

  const warning = React.useCallback((title: string, description?: string) => {
    return toast('warning', title, description)
  }, [toast])

  const info = React.useCallback((title: string, description?: string) => {
    return toast('info', title, description)
  }, [toast])

  const dismiss = React.useCallback((id: string) => {
    removeToast(id)
  }, [removeToast])

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
  }
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}