"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type, ImageIcon, Square, MousePointer, Video, Music } from "lucide-react"
import { useEditor } from "@/store/editor"
import type { ComponentConfig } from "@/types/schema"

const componentTypes = {
  basic: [
    { 
      type: "text", 
      name: "文本", 
      icon: Type, 
      defaultProps: { content: "请输入文本" },
      defaultStyle: { width: 150, height: 40 }
    },
    {
      type: "image",
      name: "图片",
      icon: ImageIcon,
      defaultProps: {
        src: "https://img4.yishouapp.com/obs/public_prefix/2025/6/25/12cd92ea3ce549964a2f3d349f2b1651.png",
        alt: "默认图片",
      },
      defaultStyle: { width: 200, height: 120 }
    },
    { 
      type: "button", 
      name: "按钮", 
      icon: MousePointer, 
      defaultProps: { text: "点击按钮", variant: "default" },
      defaultStyle: { width: 200, height: 44 }
    },
    { 
      type: "container", 
      name: "容器", 
      icon: Square, 
      defaultProps: { backgroundColor: "#f5f5f5" },
      defaultStyle: { width: 200, height: 100 }
    },
  ],

  media: [
    { 
      type: "video", 
      name: "视频", 
      icon: Video, 
      defaultProps: { src: "", autoplay: false },
      defaultStyle: { width: 200, height: 120 }
    },
    { 
      type: "audio", 
      name: "音频", 
      icon: Music, 
      defaultProps: { src: "" },
      defaultStyle: { width: 200, height: 40 }
    },
  ],
  form: [
    { 
      type: "input", 
      name: "输入框", 
      icon: Type, 
      defaultProps: { placeholder: "请输入内容" },
      defaultStyle: { width: 200, height: 40 }
    },
    { 
      type: "textarea", 
      name: "文本域", 
      icon: Type, 
      defaultProps: { placeholder: "请输入内容" },
      defaultStyle: { width: 200, height: 80 }
    },
  ],
  utility: [
    { 
      type: "divider", 
      name: "分割线", 
      icon: Type, 
      defaultProps: { color: "#e0e0e0", thickness: "1" },
      defaultStyle: { width: 200, height: 1 }
    },
    { 
      type: "space", 
      name: "间距", 
      icon: Square, 
      defaultProps: { backgroundColor: "transparent" },
      defaultStyle: { width: 200, height: 20 }
    },
  ],
}

export function ComponentPanel() {
  const { components, addComponent } = useEditor()
  const [searchTerm, setSearchTerm] = useState("")

  const calculateDefaultPosition = (componentConfig: Partial<ComponentConfig>) => {
    const canvasWidth = 375 - 48
    const componentWidth = Number(componentConfig.defaultStyle?.width) || 200
    const margin = 8

    // 第一个组件放在左上角
    if (components.length === 0) {
      return { top: margin, left: margin }
    }

    // 找到最后添加的组件（ID最大的组件，因为ID包含时间戳）
    const lastComponent = components.reduce((latest, current) => {
      // 比较ID中的时间戳部分
      const latestTimestamp = parseInt(latest.id.split('-').pop() || '0')
      const currentTimestamp = parseInt(current.id.split('-').pop() || '0')
      return currentTimestamp > latestTimestamp ? current : latest
    })

    const lastLeft = lastComponent.style.left || 0
    const lastTop = lastComponent.style.top || 0
    const lastWidth = lastComponent.style.width || 200
    const lastHeight = lastComponent.style.height || 100

    // 尝试在最后一个组件右侧放置
    const rightPosition = lastLeft + lastWidth + margin
    
    // 检查右侧是否有足够的水平空间
    if (rightPosition + componentWidth <= canvasWidth - margin) {
      return {
        top: lastTop,
        left: rightPosition
      }
    }

    // 如果右侧空间不够，换到下一行
    // 使用所有同行组件中的最大高度来确定下一行的位置
    const currentRowComponents = components.filter(comp => 
      Math.abs((comp.style.top || 0) - lastTop) < margin
    )
    
    const maxHeightInRow = Math.max(
      lastHeight,
      ...currentRowComponents.map(comp => comp.style.height || 100)
    )

    return {
      top: lastTop + maxHeightInRow + margin,
      left: margin
    }
  }

  const handleDragStart = (e: React.DragEvent, componentConfig: Partial<ComponentConfig>) => {
    try {
      const dragData = JSON.stringify(componentConfig)
      e.dataTransfer.setData("application/json", dragData)
      e.dataTransfer.effectAllowed = "copy"
    } catch (error) {
      console.error("设置拖拽数据时出错:", error)
    }
  }

  const handleAddComponent = (componentConfig: Partial<ComponentConfig>) => {
    try {
      const position = calculateDefaultPosition(componentConfig)

      const newComponent = {
        id: `${componentConfig.type}-${Date.now()}`,
        type: componentConfig.type!,  // 使用非空断言，因为我们确定这里有值
        props: { ...componentConfig.defaultProps },
        style: {
          position: "absolute",
          top: position.top,
          left: position.left,
          ...componentConfig.defaultStyle, // 使用配置中的默认样式
        },
      }
      addComponent(newComponent)
    } catch (error) {
      console.error("添加组件时出错:", error)
    }
  }

  const filteredComponents = Object.entries(componentTypes).reduce(
    (acc, [category, components]) => {
      const filtered = components.filter((comp) => comp.name.toLowerCase().includes(searchTerm.toLowerCase()))
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col flex-1">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold mb-3 text-gray-800">组件库</h3>
        <Input
          placeholder="搜索组件..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <ScrollArea className="flex-1 px-2">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mt-4 mb-2 px-2">
            <TabsTrigger value="basic" className="text-xs font-medium flex-1 whitespace-nowrap">
              基础
            </TabsTrigger>
            <TabsTrigger value="media" className="text-xs font-medium flex-1 whitespace-nowrap">
              媒体
            </TabsTrigger>
            <TabsTrigger value="form" className="text-xs font-medium flex-1 whitespace-nowrap">
              表单
            </TabsTrigger>
            <TabsTrigger value="utility" className="text-xs font-medium flex-1 whitespace-nowrap">
              工具
            </TabsTrigger>
          </TabsList>

          {Object.entries(filteredComponents).map(([category, components]) => (
            <TabsContent key={category} value={category} className="py-2 px-2 space-y-2">
              {components.map((component) => {
                const Icon = component.icon
                return (
                  <div
                    key={component.type}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200 select-none"
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    onClick={() => handleAddComponent(component)}
                    title={`拖拽或点击添加${component.name}`}
                  >
                    <Icon className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">{component.name}</span>
                  </div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      </ScrollArea>
    </div>
  )
}