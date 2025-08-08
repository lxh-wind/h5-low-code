"use client"

import { useEffect, useState, useMemo } from "react"
import type { ComponentData } from "@/store/editor"
import { usePageStore } from "@/store/pages"
import Head from "next/head"
import { useEventManager } from "@/hooks/use-event-manager"
import { AnimatedComponent } from "./animated-component"
import ComponentFactory from "./shared/component-factory"
import { pxToVw, convertStyleUnits } from "@/lib/unit-converter"

export function PreviewPage() {
  const [components, setComponents] = useState<ComponentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { executeComponentEvent } = useEventManager()
  const { getPageById } = usePageStore()
  
  // 计算预览页面的内容高度 - 使用vw单位适配
  const previewContentHeight = useMemo(() => {
    if (components.length === 0) {
      return "100vh"
    }

    // 找到最底部组件的位置，转换为vw单位
    const maxBottom = components.reduce((max, component) => {
      const componentBottom = (component.style.top || 0) + (component.style.height || 100)
      return Math.max(max, componentBottom)
    }, 0)

    // 转换px到vw (基于375px设计稿)
    const vwHeight = parseFloat(pxToVw(maxBottom + 100).replace('vw', ''))
    return Math.max(100, vwHeight) + "vw"
  }, [components])

  useEffect(() => {
    // 设置移动端viewport
    const setMobileViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        )
      }
    }

    setMobileViewport()

    // 从页面存储获取组件数据
    const loadComponents = () => {
      try {
        console.log("开始加载预览数据...")
        
        const urlParams = new URLSearchParams(window.location.search)
        const pageId = urlParams.get("pageId")
        
        if (!pageId) {
          console.log("缺少 pageId 参数")
          setError("缺少页面ID参数，请从首页选择要预览的页面")
          setIsLoading(false)
          return
        }

        console.log("从页面存储获取数据，pageId:", pageId)
        const pageData = getPageById(pageId)
        
        if (!pageData) {
          console.log("页面不存在")
          setError("页面不存在，请检查页面ID是否正确")
          setIsLoading(false)
          return
        }

        if (!pageData.components || pageData.components.length === 0) {
          console.log("页面无组件数据")
          setError("该页面暂无组件内容，请先在编辑器中添加组件")
          setIsLoading(false)
          return
        }

        const componentsData = JSON.stringify(pageData.components)

        const parsedComponents = JSON.parse(componentsData)
        console.log("解析后的组件数据:", parsedComponents)

        if (!Array.isArray(parsedComponents) || parsedComponents.length === 0) {
          setError("没有组件数据，请先在编辑器中添加组件")
          setIsLoading(false)
          return
        }

        setComponents(parsedComponents)
        setError(null)
        console.log("组件数据加载成功，共", parsedComponents.length, "个组件")
        console.log("组件详情:", parsedComponents)
      } catch (error) {
        console.error("解析组件数据失败:", error)
        setError(`数据解析失败: ${error instanceof Error ? error.message : "未知错误"}`)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(loadComponents, 100)
    return () => clearTimeout(timer)
  }, [])



  const renderPreviewComponent = (component: ComponentData) => {    // 处理组件事件
    const handleComponentEvent = (eventType: string, event: React.MouseEvent) => {
      // 阻止默认行为和冒泡
      event.preventDefault()
      event.stopPropagation()

      // 使用组件自身的事件配置
      const componentEvents = component.events || []
      
      // 执行事件
      executeComponentEvent(component.id, eventType, event as any, componentEvents)
    }
    return (
      <div
        key={component.id}
        className="absolute"
        style={{
          ...convertStyleUnits(component.style),
          zIndex: component.style.zIndex || 1,
        }}
      >
        <AnimatedComponent component={component} isPreview={true}>
          <ComponentFactory component={component} mode="preview" onEvent={handleComponentEvent} />
        </AnimatedComponent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">正在加载预览...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            关闭预览
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>H5预览</title>
      </Head>

      {/* 真实H5页面样式 */}
      <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "system-ui, -apple-system" }}>
        {/* 返回按钮 - 移动端样式 */}
        <div className="fixed top-2 left-2 z-50">
          <button
            onClick={() => window.close()}
            className="bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{
              width: pxToVw(32),
              height: pxToVw(32),
              fontSize: pxToVw(16),
            }}
          >
            ←
          </button>
        </div>

        {/* H5内容区域 */}
        <div className="w-full relative bg-white" style={{ minHeight: previewContentHeight }}>
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 p-8" style={{ minHeight: "100vh" }}>
              <div style={{ fontSize: "15vw", marginBottom: "4vw" }}>📱</div>
              <p style={{ fontSize: "4vw" }}>暂无内容</p>
              <p style={{ fontSize: "3vw", marginTop: "2vw" }}>请在编辑器中添加组件</p>
            </div>
          ) : (
            components.map((component) => renderPreviewComponent(component))
          )}
        </div>

        {/* 调试信息 - 仅开发环境 */}
        {process.env.NODE_ENV === "development" && (
          <div
            className="fixed bottom-2 right-2 bg-black text-white p-2 rounded opacity-70"
            style={{ fontSize: pxToVw(10) }}
          >
            <div>组件: {components.length}个</div>
            <div>
              视口: {typeof window !== 'undefined' ? `${window.innerWidth}×${window.innerHeight}` : ''}
            </div>
          </div>
        )}
      </div>

      {/* 移动端样式 */}
      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        input,
        textarea {
          -webkit-user-select: text;
          user-select: text;
        }

        /* 隐藏滚动条但保持滚动功能 */
        ::-webkit-scrollbar {
          display: none;
        }

        /* 移动端安全区域适配 */
        @supports (padding: max(0px)) {
          .safe-area-inset-top {
            padding-top: max(env(safe-area-inset-top), 0px);
          }
        }
      `}</style>
    </>
  )
}