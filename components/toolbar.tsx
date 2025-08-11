"use client"

import { useEditor } from "@/store/editor"
import { usePageStore } from "@/store/pages"
import { Save, Undo, Redo, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { usePageNavigation } from "@/hooks/useNavigation"
import type { Component } from "@/types/schema"

interface ToolbarProps {
  pageId?: string | null
}

export function Toolbar({ pageId }: ToolbarProps) {
  const { components, canUndo, canRedo, undo, redo } = useEditor()
  const { updatePage, getPageById, createPage } = usePageStore()
  const { openPreview } = usePageNavigation()
  const [isClient, setIsClient] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setIsClient(true)
  }, [])



  // 将 ComponentData 转换为 Component 类型（用于页面存储）
  const convertComponentData = (componentData: any[]): Component[] => {
    return componentData.map(comp => ({
      ...comp,
      // 确保 type 字段符合 ComponentType 联合类型
      type: comp.type as any, // 临时使用 any 来绕过类型检查
    }))
  }

  // 统一的页面数据保存逻辑，与 HomePage 保持一致
  const savePageData = () => {
    if (!pageId) {
      return { 
        success: false, 
        title: "无法保存",
        description: "缺少页面ID，请从首页选择要编辑的页面"
      }
    }

    try {
      // 检查页面是否存在
      const existingPage = getPageById(pageId)
      
      if (existingPage) {
        // 页面存在，更新组件数据
        updatePage(pageId, {
          components: convertComponentData(components),
          updatedAt: new Date()
        })
        
        return { 
          success: true, 
          title: "页面更新成功",
          description: `已保存 ${components.length} 个组件到页面 "${existingPage.name}"`
        }
      } else {
        // 页面不存在，创建新页面
        const newPage = createPage(
          `页面-${pageId.slice(-8)}`, // 使用 pageId 后8位作为默认名称
          `未命名页面-${pageId.slice(-8)}`,
          "通过编辑器创建的页面"
        )
        
        // 更新新创建页面的组件数据
        updatePage(newPage.id, {
          components: convertComponentData(components),
          updatedAt: new Date()
        })
        
        return { 
          success: true, 
          title: "新页面创建成功",
          description: `已创建页面 "${newPage.name}" 并保存 ${components.length} 个组件`
        }
      }
    } catch (error) {
      console.error("保存页面数据失败:", error)
      return { 
        success: false, 
        title: "保存失败",
        description: error instanceof Error ? error.message : "未知错误，请重试"
      }
    }
  }

  const handlePreview = () => {
    if (!isClient) return
    
    try {
      // 确保有组件数据
      if (components.length === 0) {
        toast.warning('无法预览', '请先添加一些组件再预览')
        return
      }

      // 使用统一的保存逻辑保存页面数据
      const saveResult = savePageData()
      
      if (!saveResult.success) {
        toast.error(saveResult.title, saveResult.description)
        return
      }

      // 显示保存成功消息
      toast.info('正在打开预览', `${saveResult.description}，预览窗口即将打开`)

      console.log("预览数据保存:", saveResult.title)
      console.log("组件数量:", components.length)

      // 使用公共跳转方法打开预览
      const previewWindow = openPreview(pageId || undefined)
      if (!previewWindow) {
        toast.error('无法打开预览窗口', '请检查浏览器是否阻止了弹窗')
      }
    } catch (error) {
      console.error("预览失败:", error)
      toast.error('预览失败', error instanceof Error ? error.message : '未知错误，请重试')
    }
  }

  const handleSave = () => {
    if (!isClient) return
    
    try {
      // 使用统一的保存逻辑保存页面数据
      const saveResult = savePageData()
      
      console.log("保存数据:", JSON.stringify(components, null, 2))
      console.log("组件数量:", components.length)
      
      // 显示保存结果消息
      if (saveResult.success) {
        toast.success(saveResult.title, saveResult.description)
      } else {
        toast.error(saveResult.title, saveResult.description)
      }
    } catch (error) {
      console.error("保存失败:", error)
      toast.error('保存失败', error instanceof Error ? error.message : '未知错误，请重试')
    }
  }

  // 服务端渲染时显示加载状态
  if (!isClient) {
    return (
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800">H5 搭建-编辑器</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-20 bg-blue-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-800">H5 搭建-编辑器</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* 撤销重做 */}
        <Button
          variant="ghost"
          size="sm"
          disabled={!canUndo}
          onClick={canUndo ? undo : undefined}
          title="撤销 (Ctrl+Z)"
          className="gap-1"
        >
          <Undo className="h-4 w-4" />
          撤销
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canRedo}
          onClick={canRedo ? redo : undefined}
          title="重做 (Ctrl+Y)"
          className="gap-1"
        >
          <Redo className="h-4 w-4" />
          重做
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* 预览 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreview}
          className="gap-1"
        >
          <Eye className="h-4 w-4" />
          预览
        </Button>

        {/* 保存 */}
        <Button
          onClick={handleSave}
          className="gap-1"
        >
          <Save className="h-4 w-4" />
          保存
        </Button>
      </div>


    </div>
  )
}