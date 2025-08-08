"use client"

import { useEffect, useState } from "react"

interface AlignmentGuide {
  id: string
  type: "vertical" | "horizontal"
  position: number
  show: boolean
  color: string
  relatedComponents: string[]
}

interface AlignmentGuidesProps {
  guides: AlignmentGuide[]
  draggedComponentId: string | null
}

export function AlignmentGuides({ guides, draggedComponentId }: AlignmentGuidesProps) {
  const [visibleGuides, setVisibleGuides] = useState<AlignmentGuide[]>([])

  useEffect(() => {
    if (draggedComponentId) {
      setVisibleGuides(guides)
    } else {
      const timer = setTimeout(() => {
        setVisibleGuides([])
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [guides, draggedComponentId])

  const getGuideColorClass = (color: string) => {
    switch (color) {
      case "component":
        return "bg-blue-500"
      case "canvas":
        return "bg-red-500"
      case "spacing":
        return "bg-amber-500"
      default:
        return "bg-blue-500"
    }
  }

  const getGuideColorValue = (color: string) => {
    switch (color) {
      case "component":
        return "#3b82f6"
      case "canvas":
        return "#ef4444"
      case "spacing":
        return "#f59e0b"
      default:
        return "#3b82f6"
    }
  }

  return (
    <>
      {visibleGuides.map((guide) => (
        <div key={guide.id}>
          {/* 主对齐线 */}
          <div
            className={`absolute pointer-events-none z-50 transition-opacity duration-150 ${guide.type === "vertical" ? "w-px h-full top-0" : "h-px w-full left-0"} ${getGuideColorClass(guide.color)} ${guide.show ? "opacity-100" : "opacity-0"}`}
            style={{
              [guide.type === "vertical" ? "left" : "top"]: guide.position,
              boxShadow: `0 0 4px ${getGuideColorValue(guide.color)}40`,
            }}
          />

          {/* 对齐点标记 */}
          {guide.show && (
            <div
              className="absolute w-1.5 h-1.5 rounded-full border-2 border-white pointer-events-none z-50 transition-all duration-150"
              style={{
                [guide.type === "vertical" ? "left" : "top"]: guide.position - 3,
                [guide.type === "vertical" ? "top" : "left"]: "50%",
                transform: guide.type === "vertical" ? "translateY(-50%)" : "translateX(-50%)",
                backgroundColor: getGuideColorValue(guide.color),
                boxShadow: `0 0 8px ${getGuideColorValue(guide.color)}60`,
              }}
            />
          )}

          {/* 间距标记 */}
          {guide.color === "spacing" && guide.show && (
            <>
              <div
                className={`absolute pointer-events-none z-45 transition-all duration-150 opacity-80 ${getGuideColorClass(guide.color)}`}
                style={{
                  [guide.type === "vertical" ? "left" : "top"]: guide.position - 10,
                  [guide.type === "vertical" ? "top" : "left"]: "50%",
                  transform: guide.type === "vertical" ? "translateY(-50%)" : "translateX(-50%)",
                  width: guide.type === "vertical" ? "20px" : "1px",
                  height: guide.type === "vertical" ? "1px" : "20px",
                }}
              />
              <div
                className={`absolute pointer-events-none z-45 transition-all duration-150 opacity-80 ${getGuideColorClass(guide.color)}`}
                style={{
                  [guide.type === "vertical" ? "left" : "top"]: guide.position + 10,
                  [guide.type === "vertical" ? "top" : "left"]: "50%",
                  transform: guide.type === "vertical" ? "translateY(-50%)" : "translateX(-50%)",
                  width: guide.type === "vertical" ? "20px" : "1px",
                  height: guide.type === "vertical" ? "1px" : "20px",
                }}
              />
            </>
          )}
        </div>
      ))}

      {/* 对齐提示文字 */}
      {visibleGuides.length > 0 && draggedComponentId && (
        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm border border-white/20 text-xs px-3 py-2 rounded-lg pointer-events-none z-50 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">组件对齐</span>
            </div>
            {visibleGuides.some((g) => g.color === "canvas") && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">画布对齐</span>
              </div>
            )}
            {visibleGuides.some((g) => g.color === "spacing") && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">等距对齐</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}