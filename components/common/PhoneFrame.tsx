'use client'

import { useEditorStore } from '@/store/editor'
import { useSimpleTime } from '@/hooks/useCurrentTime'
import { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  title?: string
  maxHeight?: string
  className?: string
}

export function PhoneFrame({ 
  children, 
  title = "标题", 
  maxHeight,
  className = "" 
}: PhoneFrameProps) {
  const { currentDevice } = useEditorStore()
  const currentTime = useSimpleTime()

  return (
    <div className={`iphone-frame ${className}`}>
      <div 
        className="iphone-screen relative overflow-hidden"
        style={{
          width: `${currentDevice.width}px`,
          height: `${currentDevice.height}px`,
          ...(maxHeight && { maxHeight })
        }}
      >
        {/* 刘海 */}
        {currentDevice.hasNotch && <div className="iphone-notch"></div>}
        
        {/* 状态栏 */}
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-2 text-black text-sm font-medium z-20 bg-white"
          style={{ height: `${currentDevice.safeAreaTop || 20}px` }}
        >
          <span>{currentTime}</span>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
            </div>
            <svg className="w-6 h-4 fill-black" viewBox="0 0 24 16">
              <path d="M2 4h20v8H2V4zm18 6V6H4v4h16z"/>
            </svg>
            <div className="w-6 h-3 border border-black rounded-sm">
              <div className="w-4 h-2 bg-black rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>
        
        {/* 页面标题栏 */}
        <div 
          className="absolute left-0 right-0 h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10"
          style={{ top: `${currentDevice.safeAreaTop || 20}px` }}
        >
          <h1 className="text-lg font-medium text-gray-900">{title}</h1>
          <div className="flex items-center space-x-2">
            <button className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">⋯</span>
            </button>
            <button className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>
        
        {/* 页面内容区域 */}
        <div 
          className="absolute left-0 right-0 bg-white overflow-y-auto"
          style={{ 
            top: `${(currentDevice.safeAreaTop || 20) + 48}px`, // 状态栏高度 + 标题栏高度
            bottom: `${currentDevice.safeAreaBottom || 0}px`,
            height: `${currentDevice.height - (currentDevice.safeAreaTop || 20) - 48 - (currentDevice.safeAreaBottom || 0)}px`
          }}
        >
          {children}
        </div>
        
        {/* 底部安全区域 - Home指示器 */}
        {(currentDevice.safeAreaBottom || 0) > 0 && (
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white flex items-center justify-center z-10"
            style={{ height: `${currentDevice.safeAreaBottom || 0}px` }}
          >
            {/* Home指示器 */}
            <div className="w-32 h-1 bg-black rounded-full opacity-60"></div>
          </div>
        )}
        
        {/* 确保整个屏幕区域都有背景色 */}
        <div 
          className="absolute inset-0 bg-white -z-10"
          style={{ borderRadius: '32px' }}
        ></div>
      </div>
    </div>
  )
} 