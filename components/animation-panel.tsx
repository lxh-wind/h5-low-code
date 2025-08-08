"use client"

import { useEditor } from "@/store/editor"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Zap, MousePointer, Eye } from "lucide-react"
import { useState } from "react"

const entranceAnimations = [
  { value: "none", label: "无动画" },
  { value: "fadeIn", label: "淡入" },
  { value: "slideInLeft", label: "从左滑入" },
  { value: "slideInRight", label: "从右滑入" },
  { value: "slideInUp", label: "从下滑入" },
  { value: "slideInDown", label: "从上滑入" },
  { value: "zoomIn", label: "缩放进入" },
  { value: "bounceIn", label: "弹跳进入" },
  { value: "rotateIn", label: "旋转进入" },
  { value: "flipInX", label: "水平翻转进入" },
  { value: "flipInY", label: "垂直翻转进入" },
]

const hoverAnimations = [
  { value: "none", label: "无动画" },
  { value: "scale", label: "缩放" },
  { value: "rotate", label: "旋转" },
  { value: "translateY", label: "上下移动" },
  { value: "pulse", label: "脉冲" },
  { value: "heartBeat", label: "心跳" },
  { value: "wobble", label: "摇摆" },
]

const clickAnimations = [
  { value: "none", label: "无动画" },
  { value: "bounce", label: "弹跳" },
  { value: "pulse", label: "脉冲" },
  { value: "heartBeat", label: "心跳" },
  { value: "flash", label: "闪烁" },
  { value: "rubberBand", label: "橡皮筋" },
]

const easingOptions = [
  { value: "ease", label: "缓动" },
  { value: "ease-in", label: "缓入" },
  { value: "ease-out", label: "缓出" },
  { value: "ease-in-out", label: "缓入缓出" },
  { value: "linear", label: "线性" },
  { value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", label: "弹性" },
]

export function AnimationPanel() {
  const { components, selectedId, updateComponent } = useEditor()
  const [previewKey, setPreviewKey] = useState(0)

  const selectedComponent = components.find((comp) => comp.id === selectedId)

  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">动画设置</h3>
            <p className="text-sm text-gray-500">请选择一个组件来设置动画</p>
          </div>
        </div>
      </div>
    )
  }

  const updateAnimation = (category: string, key: string, value: any) => {
    const currentAnimations = selectedComponent.animations || {}
    updateComponent(selectedComponent.id, {
      animations: {
        ...currentAnimations,
        [category]: {
          ...currentAnimations[category],
          [key]: value,
        },
      },
    })
  }

  const previewAnimation = () => {
    const previewElement = document.getElementById(`component-${selectedComponent.id}`)
    if (!previewElement) {
      console.warn('未找到预览元素:', `component-${selectedComponent.id}`)
      return
    }

    if (!animations.entrance?.type || animations.entrance.type === "none") {
      console.warn('没有设置入场动画')
      return
    }

    const animationType = animations.entrance.type
    const duration = animations.entrance.duration || 1
    
    console.log('开始预览动画:', { animationType, duration })
    
    // 使用 Animate.css 类名
    const animationClass = getAnimateCSSClass(animationType)
    
    // 移除之前的动画类
    previewElement.classList.remove('animate__animated')
    previewElement.classList.forEach(className => {
      if (className.startsWith('animate__')) {
        previewElement.classList.remove(className)
      }
    })
    
    // 设置动画持续时间
    previewElement.style.setProperty('--animate-duration', `${duration}s`)
    
    // 添加新的动画类
    previewElement.classList.add('animate__animated', animationClass)
    
    // 动画结束后清除类名
    const handleAnimationEnd = () => {
      previewElement.classList.remove('animate__animated', animationClass)
      previewElement.style.removeProperty('--animate-duration')
      previewElement.removeEventListener('animationend', handleAnimationEnd)
    }
    
    previewElement.addEventListener('animationend', handleAnimationEnd)
    
    setPreviewKey((prev) => prev + 1)
  }

  // 获取 Animate.css 类名
  const getAnimateCSSClass = (type: string) => {
    switch (type) {
      case 'fadeIn': return 'animate__fadeIn'
      case 'slideInLeft': return 'animate__slideInLeft'
      case 'slideInRight': return 'animate__slideInRight'
      case 'slideInUp': return 'animate__slideInUp'
      case 'slideInDown': return 'animate__slideInDown'
      case 'zoomIn': return 'animate__zoomIn'
      case 'bounceIn': return 'animate__bounceIn'
      case 'rotateIn': return 'animate__rotateIn'
      case 'flipInX': return 'animate__flipInX'
      case 'flipInY': return 'animate__flipInY'
      default: return 'animate__fadeIn'
    }
  }

  const resetAnimations = () => {
    updateComponent(selectedComponent.id, {
      animations: {},
    })
  }



  const animations = selectedComponent.animations || {}

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-lg">动画设置</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previewAnimation} className="h-8 px-3 bg-transparent">
            <Play className="w-3 h-3 mr-1" />
            预览
          </Button>
          <Button variant="outline" size="sm" onClick={resetAnimations} className="h-8 px-3 bg-transparent">
            <RotateCcw className="w-3 h-3 mr-1" />
            重置
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 进入动画 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            进入动画
          </h4>
          <div className="space-y-4 pl-6">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">动画类型</Label>
              <Select
                value={animations.entrance?.type || "none"}
                onValueChange={(value) => updateAnimation("entrance", "type", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entranceAnimations.map((anim) => (
                    <SelectItem key={anim.value} value={anim.value}>
                      {anim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {animations.entrance?.type && animations.entrance.type !== "none" && (
              <>
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">持续时间</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[animations.entrance?.duration || 0.6]}
                      onValueChange={([value]) => updateAnimation("entrance", "duration", value)}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>0.1s</span>
                      <Badge variant="outline" className="text-xs">
                        {animations.entrance?.duration || 0.6}s
                      </Badge>
                      <span>3.0s</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">延迟时间</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[animations.entrance?.delay || 0]}
                      onValueChange={([value]) => updateAnimation("entrance", "delay", value)}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>0s</span>
                      <Badge variant="outline" className="text-xs">
                        {animations.entrance?.delay || 0}s
                      </Badge>
                      <span>2.0s</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">缓动函数</Label>
                  <Select
                    value={animations.entrance?.easing || "ease"}
                    onValueChange={(value) => updateAnimation("entrance", "easing", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {easingOptions.map((easing) => (
                        <SelectItem key={easing.value} value={easing.value}>
                          {easing.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* 悬停动画 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            悬停动画
          </h4>
          <div className="space-y-4 pl-6">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">动画类型</Label>
              <Select
                value={animations.hover?.type || "none"}
                onValueChange={(value) => updateAnimation("hover", "type", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hoverAnimations.map((anim) => (
                    <SelectItem key={anim.value} value={anim.value}>
                      {anim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {animations.hover?.type && animations.hover.type !== "none" && (
              <>
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">持续时间</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[animations.hover?.duration || 0.3]}
                      onValueChange={([value]) => updateAnimation("hover", "duration", value)}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>0.1s</span>
                      <Badge variant="outline" className="text-xs">
                        {animations.hover?.duration || 0.3}s
                      </Badge>
                      <span>1.0s</span>
                    </div>
                  </div>
                </div>

                {animations.hover.type === "scale" && (
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">缩放比例</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[animations.hover?.scale || 1.1]}
                        onValueChange={([value]) => updateAnimation("hover", "scale", value)}
                        max={1.5}
                        min={0.8}
                        step={0.05}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>0.8</span>
                        <Badge variant="outline" className="text-xs">
                          {animations.hover?.scale || 1.1}
                        </Badge>
                        <span>1.5</span>
                      </div>
                    </div>
                  </div>
                )}

                {animations.hover.type === "rotate" && (
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">旋转角度</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[animations.hover?.rotate || 5]}
                        onValueChange={([value]) => updateAnimation("hover", "rotate", value)}
                        max={360}
                        min={-360}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>-360°</span>
                        <Badge variant="outline" className="text-xs">
                          {animations.hover?.rotate || 5}°
                        </Badge>
                        <span>360°</span>
                      </div>
                    </div>
                  </div>
                )}

                {animations.hover.type === "translateY" && (
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">移动距离</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[animations.hover?.translateY || -5]}
                        onValueChange={([value]) => updateAnimation("hover", "translateY", value)}
                        max={20}
                        min={-20}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>-20px</span>
                        <Badge variant="outline" className="text-xs">
                          {animations.hover?.translateY || -5}px
                        </Badge>
                        <span>20px</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* 点击动画 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            点击动画
          </h4>
          <div className="space-y-4 pl-6">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">动画类型</Label>
              <Select
                value={animations.click?.type || "none"}
                onValueChange={(value) => updateAnimation("click", "type", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clickAnimations.map((anim) => (
                    <SelectItem key={anim.value} value={anim.value}>
                      {anim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {animations.click?.type && animations.click.type !== "none" && (
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">持续时间</Label>
                <div className="space-y-3">
                  <Slider
                    value={[animations.click?.duration || 0.6]}
                    onValueChange={([value]) => updateAnimation("click", "duration", value)}
                    max={2}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>0.1s</span>
                    <Badge variant="outline" className="text-xs">
                      {animations.click?.duration || 0.6}s
                    </Badge>
                    <span>2.0s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 预览触发器 */}
      <div className="hidden">
        <div key={previewKey} className="animate-preview-trigger" />
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-700 flex items-center gap-2">
          <span>✨</span>动画效果在预览模式下可以完整体验
        </p>
      </div>
    </div>
  )
}