'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rectangular' | 'text'
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function Skeleton({ 
  className, 
  variant = 'default',
  width,
  height,
  animate = true,
  ...props 
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseClasses = cn(
    'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    animate && 'animate-pulse',
    {
      'rounded-md': variant === 'default' || variant === 'rectangular',
      'rounded-full': variant === 'circular',
      'rounded-sm h-4': variant === 'text',
    },
    className
  )

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div 
      className={baseClasses}
      style={style}
      {...props}
    />
  )
}

// 预定义的骨架屏组件
export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 space-y-4', className)} {...props}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = 40, className, ...props }: { size?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton 
      variant="circular" 
      width={size} 
      height={size}
      className={className}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 1, className, ...props }: { lines?: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          variant="text" 
          className={index === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
}

export function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton 
      className={cn('h-10 w-24 rounded-lg', className)}
      {...props}
    />
  )
}

// 统计卡片骨架屏
export function SkeletonStatsCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Skeleton variant="circular" width={16} height={16} />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

// 页面卡片骨架屏
export function SkeletonPageCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm', className)} {...props}>
      <div className="aspect-[4/3] bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-16" />
          <div className="flex space-x-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  )
}

// 活动列表骨架屏
export function SkeletonActivity({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg', className)} {...props}>
      <SkeletonAvatar size={32} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

// 组件统计骨架屏
export function SkeletonComponentStats({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-16 rounded-full" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      ))}
    </div>
  )
} 