"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ComponentData } from "@/store/editor"
import { convertUnit, getFontSize } from "@/lib/unit-converter"

interface ComponentFactoryProps {
  component: ComponentData
  mode: "editor" | "preview"
  onEvent?: (eventType: string, event: React.MouseEvent) => void
}

/**
 * 组件渲染工厂
 */
export const ComponentFactory: React.FC<ComponentFactoryProps> = ({
  component,
  mode,
  onEvent
}) => {
  const isPreview = mode === "preview"

  // 统一的事件处理
  const handleEvent = (eventType: string) => (e: React.MouseEvent) => {
    if (isPreview && onEvent) {
      onEvent(eventType, e)
    }
  }

  // 统一的交互样式类
  const getInteractionClass = (baseClass: string = "") => {
    const interaction = isPreview ? "cursor-pointer" : "pointer-events-none"
    return `${baseClass} ${interaction}`.trim()
  }

  try {
    switch (component.type) {
      // ========== 基础组件 ==========
      case "text":
        return (
          <div
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              color: component.props.color || "#000",
              fontSize: getFontSize(component.props.fontSize, isPreview),
              fontWeight: component.props.fontWeight || "normal",
              wordBreak: "break-word",
              lineHeight: "1.4",
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            {component.props.content || "文本内容"}
          </div>
        )

      case "image":
        return (
          <img
            src={
              component.props.src ||
              "https://img4.yishouapp.com/obs/public_prefix/2025/6/25/12cd92ea3ce549964a2f3d349f2b1651.png"
            }
            alt={component.props.alt || "图片"}
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              objectFit: component.props.objectFit || "cover",
              borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(4, isPreview),
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "https://img4.yishouapp.com/obs/public_prefix/2025/6/25/12cd92ea3ce549964a2f3d349f2b1651.png"
            }}
          />
        )

      case "button":
        const buttonStyle = {
          width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
          height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
          backgroundColor: component.props.backgroundColor || "#3b82f6",
          color: component.props.color || "#fff",
          fontSize: getFontSize(component.props.fontSize || 16, isPreview),
          fontWeight: "500",
          borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(6, isPreview),
          border: "none",
        }

        const buttonClass = isPreview
          ? "w-full h-full active:scale-95 transition-transform touch-manipulation"
          : getInteractionClass()

        return (
          <Button
            variant={component.props.variant || "default"}
            className={buttonClass}
            style={buttonStyle}
            onClick={(e) => {
              handleEvent("click")(e)
              if (isPreview && navigator.vibrate) {
                navigator.vibrate(50)
              }
            }}
            onDoubleClick={handleEvent("dblclick")}
            disabled={component.props.disabled}
          >
            {component.props.text || "按钮"}
          </Button>
        )

      case "container":
        return (
          <div
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              backgroundColor: component.props.backgroundColor || "transparent",
              borderColor: component.props.borderColor || "#d1d5db",
              borderWidth: component.props.borderWidth ? convertUnit(parseInt(component.props.borderWidth), isPreview) : convertUnit(1, isPreview),
              borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(8, isPreview),
              padding: component.props.padding ? convertUnit(parseInt(component.props.padding), isPreview) : convertUnit(16, isPreview),
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            <span style={{ 
              color: component.props.color || "#6b7280", 
              fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(14, isPreview) 
            }}>
              {component.props.placeholder || "容器组件"}
            </span>
          </div>
        )

      // ========== 媒体组件 ==========
      case "video":
        return (
          <div
            className={getInteractionClass()}
            style={{ 
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(8, isPreview)
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            {component.props.src ? (
              <video
                src={component.props.src}
                className={getInteractionClass()}
                controls={isPreview}
                autoPlay={component.props.autoplay && isPreview}
                muted={component.props.autoplay}
                style={{
                  width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
                  height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
                  backgroundColor: component.props.backgroundColor || "#000",
                  borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(8, isPreview),
                }}
              />
            ) : (
              <div 
                style={{
                  width: "100%",
                  height: "100%", 
                  backgroundColor: component.props.backgroundColor || "#374151",
                  borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(8, isPreview),
                  color: component.props.color || "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ 
                    fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(24, isPreview), 
                    marginBottom: convertUnit(8, isPreview) 
                  }}>📹</div>
                  <span style={{ fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(14, isPreview) }}>
                    {component.props.placeholder || "视频组件"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )

      case "audio":
        return (
          <div
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              backgroundColor: component.props.backgroundColor || "#f3f4f6",
              borderRadius: component.props.borderRadius ? convertUnit(parseInt(component.props.borderRadius), isPreview) : convertUnit(8, isPreview),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            {component.props.src ? (
              <audio
                src={component.props.src}
                controls={isPreview}
                className="w-full"
                style={{ maxWidth: "100%", pointerEvents: isPreview ? "auto" : "none" }}
              />
            ) : (
              <div style={{ color: component.props.color || "#6b7280", display: "flex", alignItems: "center", gap: convertUnit(8, isPreview) }}>
                <span style={{ fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(16, isPreview) }}>🎵</span>
                <span style={{ fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(14, isPreview) }}>
                  {component.props.placeholder || "音频组件"}
                </span>
              </div>
            )}
          </div>
        )

      // ========== 表单组件 ==========
      case "input":
        return (
          <Input
            type={component.props.type || "text"}
            placeholder={component.props.placeholder || "请输入内容"}
            value={component.props.value || (isPreview ? "" : component.props.placeholder || "请输入内容")}
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              fontSize: getFontSize(component.props.fontSize, isPreview),
              color: component.props.color || "#000",
              backgroundColor: component.props.backgroundColor || "#fff",
            }}
            disabled={component.props.disabled}
            readOnly={!isPreview}
            required={component.props.required}
            onChange={isPreview ? (e) => {
              console.log("输入值:", e.target.value)
            } : undefined}
            onClick={handleEvent("click")}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={component.props.placeholder || "请输入内容"}
            value={component.props.value || (isPreview ? "" : component.props.placeholder || "请输入内容")}
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              fontSize: getFontSize(component.props.fontSize, isPreview),
              color: component.props.color || "#000",
              backgroundColor: component.props.backgroundColor || "#fff",
            }}
            disabled={component.props.disabled}
            readOnly={!isPreview}
            required={component.props.required}
            onChange={isPreview ? (e) => {
              console.log("输入值:", e.target.value)
            } : undefined}
            onClick={handleEvent("click")}
          />
        )

      // ========== 工具组件 ==========
      case "divider":
        return (
          <div
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            <Separator
              className="w-full"
              style={{
                height: component.props.thickness ? convertUnit(parseInt(component.props.thickness), isPreview) : convertUnit(1, isPreview),
                backgroundColor: component.props.color || "#e0e0e0",
              }}
            />
          </div>
        )

      case "space":
        return (
          <div
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              backgroundColor: component.props.backgroundColor || "transparent",
              position: "relative",
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            {!isPreview && (
              <div style={{
                position: "absolute",
                inset: "0",
                border: "2px dashed #d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: "0.5",
                transition: "opacity 0.2s",
              }}>
                <span 
                  style={{ 
                    color: component.props.color || "#6b7280", 
                    fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(12, isPreview),
                    backgroundColor: "white",
                    padding: convertUnit(4, isPreview),
                    borderRadius: convertUnit(2, isPreview),
                  }}>
                  {component.props.placeholder || "间距"}
                </span>
              </div>
            )}
          </div>
        )

      // ========== 数据组件 ==========
      case "list":
        const items = component.props.items || ["列表项 1", "列表项 2", "列表项 3"]
        const listStyle = component.props.listStyle || "none"

        return (
          <div
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            <ul
              style={{
                listStyleType: listStyle,
                paddingLeft: listStyle !== "none" ? convertUnit(24, isPreview) : "0",
                fontSize: getFontSize(component.props.fontSize, isPreview),
                color: component.props.color || "#000",
                margin: 0,
                height: "100%",
                overflow: "auto",
              }}
            >
              {items.map((item: string, index: number) => (
                <li key={index} style={{ wordBreak: "break-word", marginBottom: convertUnit(4, isPreview) }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )

      case "card":
        return (
          <Card
            className={getInteractionClass()}
            style={{
              width: component.props.width ? convertUnit(component.props.width, isPreview) : "100%",
              height: component.props.height ? convertUnit(component.props.height, isPreview) : "100%",
              backgroundColor: component.props.backgroundColor || "#fff",
              boxShadow: component.props.shadow === "none" ? "none" :
                component.props.shadow === "lg" ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" :
                  component.props.shadow === "md" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" :
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleEvent("click")}
            onDoubleClick={handleEvent("dblclick")}
          >
            {component.props.title && (
              <CardHeader style={{ paddingBottom: convertUnit(8, isPreview) }}>
                <CardTitle style={{ fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(16, isPreview) }}>
                  {component.props.title}
                </CardTitle>
              </CardHeader>
            )}
            <CardContent style={{ paddingTop: 0 }}>
              <p style={{ 
                fontSize: getFontSize(component.props.fontSize, isPreview) || convertUnit(14, isPreview),
                color: component.props.color || "#666",
                margin: 0
              }}>
                {component.props.content || "卡片内容"}
              </p>
            </CardContent>
          </Card>
        )

      default:
        return (
          <div>
            <span>未知组件: {component.type}</span>
          </div>
        )
    }
  } catch (error) {
    console.error("组件渲染错误:", error)
    return (
      <div>
        <span>渲染错误</span>
      </div>
    )
  }
}

export default ComponentFactory