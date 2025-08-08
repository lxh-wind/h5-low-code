"use client"

import { useEditor } from "@/store/editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AnimationPanel } from "@/components/animation-panel"
import { EventPanel } from "@/components/event-panel"
import { useMemo } from "react"
import { Settings, Move, Palette, Type, ImageIcon, Square, MousePointer } from "lucide-react"

export function PropertyPanel() {
  const { components, selectedId, updateComponent, pageConfig, setPageConfig, isCanvasSelected } = useEditor()

  const selectedComponent = components.find((comp) => comp.id === selectedId)

  // 计算画布内容高度
  const canvasContentHeight = useMemo(() => {
    if (components.length === 0) {
      return pageConfig.height - 24
    }

    const maxBottom = components.reduce((max, component) => {
      const componentBottom = (component.style.top || 0) + (component.style.height || 100)
      return Math.max(max, componentBottom)
    }, 0)

    const minHeight = pageConfig.height - 24
    const contentHeight = Math.max(minHeight, maxBottom + 100)

    return contentHeight
  }, [components, pageConfig.height])

  // 获取组件类型图标
  const getComponentIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "button":
        return <MousePointer className="w-4 h-4" />
      case "container":
        return <Square className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  // 当选中画布时显示页面配置
  if (isCanvasSelected) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">H5页面配置</h3>
          </div>

          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                基本信息
              </h4>
              <div className="space-y-4 pl-6">
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">页面标题</Label>
                  <Input
                    value={pageConfig.title}
                    onChange={(e) => setPageConfig({ title: e.target.value })}
                    placeholder="请输入页面标题"
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">页面描述</Label>
                  <Textarea
                    value={pageConfig.description}
                    onChange={(e) => setPageConfig({ description: e.target.value })}
                    placeholder="请输入页面描述"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* 样式设置 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                页面样式
              </h4>
              <div className="space-y-4 pl-6">
                <div>
                  <Label className="text-sm text-gray-700 mb-2 block">背景颜色</Label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded border-2 border-gray-200 cursor-pointer"
                      style={{ backgroundColor: pageConfig.backgroundColor }}
                      onClick={() => document.getElementById("page-bg-color")?.click()}
                    />
                    <Input
                      id="page-bg-color"
                      type="color"
                      value={pageConfig.backgroundColor}
                      onChange={(e) => setPageConfig({ backgroundColor: e.target.value })}
                      className="sr-only"
                    />
                    <Input
                      value={pageConfig.backgroundColor}
                      onChange={(e) => setPageConfig({ backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1 h-10 font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">画布宽度 (px)</Label>
                    <Input
                      type="number"
                      value={pageConfig.width}
                      onChange={(e) => setPageConfig({ width: Number.parseInt(e.target.value) || 375 })}
                      min={320}
                      max={768}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">最小高度 (px)</Label>
                    <Input
                      type="number"
                      value={pageConfig.height}
                      onChange={(e) => setPageConfig({ height: Number.parseInt(e.target.value) || 667 })}
                      min={480}
                      max={1200}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 页面统计 */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">页面统计</h4>
              <div className="pl-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">组件数量</span>
                  <Badge variant="secondary">{components.length}个</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">当前画布高度</span>
                  <Badge variant="outline">{Math.round(canvasContentHeight)}px</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">扩展高度</span>
                  <Badge variant="outline" className="text-blue-600">
                    {Math.max(0, Math.round(canvasContentHeight - (pageConfig.height - 24)))}px
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <span>💡</span>按 <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">ESC</kbd>{" "}
              键可取消选中
            </p>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // 未选中组件时的状态
  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">属性面板</h3>
            <p className="text-sm text-gray-500 mb-4">请选择一个组件或点击画布来编辑属性</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <span>💡</span>按 <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">ESC</kbd>{" "}
              键可取消选中
            </p>
          </div>
        </div>
      </div>
    )
  }

  const updateProps = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [key]: value,
      },
    })
  }

  const updateStyle = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      style: {
        ...selectedComponent.style,
        [key]: value,
      },
    })
  }

  // 通用颜色选择器组件
  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div>
      <Label className="text-sm text-gray-700 mb-2 block">{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded border-2 border-gray-200 cursor-pointer"
          style={{ backgroundColor: value || "#000000" }}
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        />
        <Input
          id={`color-${label}`}
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <Input
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 h-10 font-mono text-sm"
        />
      </div>
    </div>
  )

  // 字体大小选择器组件
  const FontSizeSlider = ({ value, onChange, min = 12, max = 48 }: { value: string; onChange: (value: string) => void; min?: number; max?: number }) => {
    const numValue = parseInt(value) || 14
    return (
      <div>
        <Label className="text-sm text-gray-700 mb-2 block">字体大小</Label>
        <div className="space-y-3">
          <Slider
            value={[numValue]}
            onValueChange={([val]) => onChange(`${val}px`)}
            max={max}
            min={min}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{min}px</span>
            <Badge variant="outline" className="text-xs">{value || "14px"}</Badge>
            <span>{max}px</span>
          </div>
        </div>
      </div>
    )
  }

  const renderPropsEditor = () => {
    switch (selectedComponent.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">文本内容</Label>
              <Textarea
                value={selectedComponent.props.content || ""}
                onChange={(e) => updateProps("content", e.target.value)}
                placeholder="请输入文本内容"
                rows={3}
                className="resize-none"
              />
            </div>
            <FontSizeSlider 
              value={selectedComponent.props.fontSize || "14px"}
              onChange={(value) => updateProps("fontSize", value)}
            />
            <ColorPicker
              label="文本颜色"
              value={selectedComponent.props.color || "#000000"}
              onChange={(value) => updateProps("color", value)}
            />
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">字体粗细</Label>
              <Select
                value={selectedComponent.props.fontWeight || "normal"}
                onValueChange={(value) => updateProps("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择字体粗细" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lighter">较细</SelectItem>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="bold">粗体</SelectItem>
                  <SelectItem value="bolder">更粗</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">图片地址</Label>
              <Input
                value={selectedComponent.props.src || ""}
                onChange={(e) => updateProps("src", e.target.value)}
                placeholder="请输入图片URL"
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">替代文本</Label>
              <Input
                value={selectedComponent.props.alt || ""}
                onChange={(e) => updateProps("alt", e.target.value)}
                placeholder="请输入图片描述"
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">对象适应</Label>
              <Select
                value={selectedComponent.props.objectFit || "cover"}
                onValueChange={(value) => updateProps("objectFit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择适应方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">覆盖</SelectItem>
                  <SelectItem value="contain">包含</SelectItem>
                  <SelectItem value="fill">填充</SelectItem>
                  <SelectItem value="scale-down">缩小</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">边框圆角</Label>
              <div className="space-y-3">
                <Slider
                  value={[parseInt(selectedComponent.props.borderRadius) || 0]}
                  onValueChange={([value]) => updateProps("borderRadius", `${value}px`)}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0px</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedComponent.props.borderRadius || "0px"}
                  </Badge>
                  <span>50px</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">按钮文本</Label>
              <Input
                value={selectedComponent.props.text || ""}
                onChange={(e) => updateProps("text", e.target.value)}
                placeholder="请输入按钮文本"
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">按钮样式</Label>
              <Select
                value={selectedComponent.props.variant || "default"}
                onValueChange={(value) => updateProps("variant", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择按钮样式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">默认</SelectItem>
                  <SelectItem value="destructive">危险</SelectItem>
                  <SelectItem value="outline">轮廓</SelectItem>
                  <SelectItem value="secondary">次要</SelectItem>
                  <SelectItem value="ghost">幽灵</SelectItem>
                  <SelectItem value="link">链接</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ColorPicker
              label="背景颜色"
              value={selectedComponent.props.backgroundColor || "#3b82f6"}
              onChange={(value) => updateProps("backgroundColor", value)}
            />
            <ColorPicker
              label="文本颜色"
              value={selectedComponent.props.color || "#ffffff"}
              onChange={(value) => updateProps("color", value)}
            />
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">禁用状态</Label>
              <Switch
                checked={selectedComponent.props.disabled || false}
                onCheckedChange={(checked) => updateProps("disabled", checked)}
              />
            </div>
          </div>
        )

      case "input":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">占位符文本</Label>
              <Input
                value={selectedComponent.props.placeholder || ""}
                onChange={(e) => updateProps("placeholder", e.target.value)}
                placeholder="请输入占位符文本"
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">输入类型</Label>
              <Select
                value={selectedComponent.props.type || "text"}
                onValueChange={(value) => updateProps("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择输入类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">文本</SelectItem>
                  <SelectItem value="password">密码</SelectItem>
                  <SelectItem value="email">邮箱</SelectItem>
                  <SelectItem value="number">数字</SelectItem>
                  <SelectItem value="tel">电话</SelectItem>
                  <SelectItem value="url">网址</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">默认值</Label>
              <Input
                value={selectedComponent.props.value || ""}
                onChange={(e) => updateProps("value", e.target.value)}
                placeholder="请输入默认值"
                className="h-10"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">必填字段</Label>
              <Switch
                checked={selectedComponent.props.required || false}
                onCheckedChange={(checked) => updateProps("required", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">禁用状态</Label>
              <Switch
                checked={selectedComponent.props.disabled || false}
                onCheckedChange={(checked) => updateProps("disabled", checked)}
              />
            </div>
          </div>
        )

      case "container":
        return (
          <div className="space-y-4">
            <ColorPicker
              label="背景颜色"
              value={selectedComponent.props.backgroundColor || "#f5f5f5"}
              onChange={(value) => updateProps("backgroundColor", value)}
            />
            <ColorPicker
              label="边框颜色"
              value={selectedComponent.props.borderColor || "#e5e7eb"}
              onChange={(value) => updateProps("borderColor", value)}
            />
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">边框宽度</Label>
              <div className="space-y-3">
                <Slider
                  value={[parseInt(selectedComponent.props.borderWidth) || 1]}
                  onValueChange={([value]) => updateProps("borderWidth", `${value}px`)}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0px</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedComponent.props.borderWidth || "1px"}
                  </Badge>
                  <span>10px</span>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">内边距</Label>
              <div className="space-y-3">
                <Slider
                  value={[parseInt(selectedComponent.props.padding) || 16]}
                  onValueChange={([value]) => updateProps("padding", `${value}px`)}
                  max={50}
                  min={0}
                  step={2}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0px</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedComponent.props.padding || "16px"}
                  </Badge>
                  <span>50px</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "divider":
        return (
          <div className="space-y-4">
            <ColorPicker
              label="分割线颜色"
              value={selectedComponent.props.color || "#e0e0e0"}
              onChange={(value) => updateProps("color", value)}
            />
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">线条粗细</Label>
              <div className="space-y-3">
                <Slider
                  value={[parseInt(selectedComponent.props.thickness) || 1]}
                  onValueChange={([value]) => updateProps("thickness", value.toString())}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>1px</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedComponent.props.thickness || "1"}px
                  </Badge>
                  <span>10px</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "space":
        return (
          <div className="space-y-4">
            <ColorPicker
              label="背景颜色"
              value={selectedComponent.props.backgroundColor || "transparent"}
              onChange={(value) => updateProps("backgroundColor", value)}
            />
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">间距说明</Label>
              <p className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                间距组件用于在其他组件之间创建空白区域。您可以通过调整高度来控制间距大小。
              </p>
            </div>
          </div>
        )

      case "list":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">列表项 (每行一项)</Label>
              <Textarea
                value={(selectedComponent.props.items || []).join('\n')}
                onChange={(e) => updateProps("items", e.target.value.split('\n').filter(item => item.trim()))}
                placeholder="列表项 1&#10;列表项 2&#10;列表项 3"
                rows={4}
                className="resize-none"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">列表样式</Label>
              <Select
                value={selectedComponent.props.listStyle || "none"}
                onValueChange={(value) => updateProps("listStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择列表样式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无样式</SelectItem>
                  <SelectItem value="disc">实心圆点</SelectItem>
                  <SelectItem value="circle">空心圆点</SelectItem>
                  <SelectItem value="square">方块</SelectItem>
                  <SelectItem value="decimal">数字</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FontSizeSlider 
              value={selectedComponent.props.fontSize || "14px"}
              onChange={(value) => updateProps("fontSize", value)}
              min={10}
              max={24}
            />
          </div>
        )

      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">卡片标题</Label>
              <Input
                value={selectedComponent.props.title || ""}
                onChange={(e) => updateProps("title", e.target.value)}
                placeholder="请输入卡片标题"
                className="h-10"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">卡片内容</Label>
              <Textarea
                value={selectedComponent.props.content || ""}
                onChange={(e) => updateProps("content", e.target.value)}
                placeholder="请输入卡片内容"
                rows={3}
                className="resize-none"
              />
            </div>
            <ColorPicker
              label="背景颜色"
              value={selectedComponent.props.backgroundColor || "#ffffff"}
              onChange={(value) => updateProps("backgroundColor", value)}
            />
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">阴影大小</Label>
              <Select
                value={selectedComponent.props.shadow || "sm"}
                onValueChange={(value) => updateProps("shadow", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择阴影大小" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无阴影</SelectItem>
                  <SelectItem value="sm">小阴影</SelectItem>
                  <SelectItem value="md">中阴影</SelectItem>
                  <SelectItem value="lg">大阴影</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">该组件暂无可配置属性</p>
            <p className="text-xs text-gray-400">组件类型: {selectedComponent.type}</p>
          </div>
        )
    }
  }

  return (
    <ScrollArea className="h-full px-2">
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mt-4 mb-2 px-2 ">
          <TabsTrigger value="properties" className="text-sm flex-1 whitespace-nowrap">
            属性
          </TabsTrigger>
          <TabsTrigger value="animations" className="text-sm flex-1 whitespace-nowrap">
            动画
          </TabsTrigger>
          <TabsTrigger value="events" className="text-sm flex-1 whitespace-nowrap">
            事件
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="p-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              {getComponentIcon(selectedComponent.type)}
              <h3 className="font-semibold text-lg">组件属性</h3>
              <Badge variant="secondary" className="text-xs">
                {selectedComponent.type}
              </Badge>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  基本信息
                </h4>
                <div className="space-y-4 pl-6">
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">组件ID</Label>
                    <Input value={selectedComponent.id} disabled className="bg-gray-50 h-10 text-xs font-mono" />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">组件类型</Label>
                    <Input value={selectedComponent.type} disabled className="bg-gray-50 h-10" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 位置和尺寸 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Move className="w-4 h-4" />
                  位置和尺寸
                </h4>
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-700 mb-2 block">X坐标 (px)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.style.left || 0}
                        onChange={(e) => updateStyle("left", Number.parseInt(e.target.value))}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-700 mb-2 block">Y坐标 (px)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.style.top || 0}
                        onChange={(e) => updateStyle("top", Number.parseInt(e.target.value))}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-700 mb-2 block">宽度 (px)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.style.width || 100}
                        onChange={(e) => updateStyle("width", Number.parseInt(e.target.value))}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-700 mb-2 block">高度 (px)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.style.height || 100}
                        onChange={(e) => updateStyle("height", Number.parseInt(e.target.value))}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 组件属性 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  组件属性
                </h4>
                <div className="pl-6">{renderPropsEditor()}</div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <span>💡</span>按 <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">ESC</kbd>{" "}
                键可取消选中
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="animations" className="p-0">
          <AnimationPanel />
        </TabsContent>

        <TabsContent value="events" className="p-0">
          <EventPanel />
        </TabsContent>
      </Tabs>
    </ScrollArea>
  )
}