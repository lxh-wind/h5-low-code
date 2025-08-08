"use client"

import { useState } from "react"
import { useEditor } from "@/store/editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, ExternalLink, MessageSquare, Copy, Code, Send, Eye, Play, Zap } from "lucide-react"

const eventTypes = [
  { value: "click", label: "点击", icon: "👆" },
  { value: "dblclick", label: "双击", icon: "👆👆" },
  { value: "longpress", label: "长按", icon: "👆⏱️" },
  { value: "input", label: "输入", icon: "⌨️" },
  { value: "change", label: "改变", icon: "🔄" },
  { value: "focus", label: "获得焦点", icon: "🎯" },
  { value: "blur", label: "失去焦点", icon: "👻" },
]

const eventActionTemplates = [
  {
    type: "navigate",
    name: "跳转页面",
    description: "跳转到指定URL",
    icon: "ExternalLink",
    configFields: [
      { key: "url", label: "URL地址", type: "url", required: true, placeholder: "https://example.com" },
      { key: "newTab", label: "新标签页打开", type: "boolean", defaultValue: true },
    ],
  },
  {
    type: "showMessage",
    name: "显示消息",
    description: "显示临时消息提示",
    icon: "MessageSquare",
    configFields: [
      { key: "message", label: "消息内容", type: "text", required: true, placeholder: "请输入消息内容" },
      { key: "duration", label: "显示时长(毫秒)", type: "number", defaultValue: 3000 },
    ],
  },
  {
    type: "copyText",
    name: "复制文本",
    description: "复制指定文本到剪贴板",
    icon: "Copy",
    configFields: [
      { key: "text", label: "要复制的文本", type: "textarea", required: true, placeholder: "请输入要复制的文本" },
    ],
  },
  {
    type: "executeScript",
    name: "执行脚本",
    description: "执行自定义JavaScript代码",
    icon: "Code",
    configFields: [
      {
        key: "script",
        label: "JavaScript代码",
        type: "textarea",
        required: true,
        placeholder: 'console.log("Hello World");',
      },
    ],
  },
  {
    type: "sendRequest",
    name: "发送请求",
    description: "发送HTTP请求",
    icon: "Send",
    configFields: [
      { key: "url", label: "请求URL", type: "url", required: true, placeholder: "https://api.example.com/data" },
      {
        key: "method",
        label: "请求方法",
        type: "select",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
        ],
        defaultValue: "GET",
      },
    ],
  },
  {
    type: "toggleElement",
    name: "切换元素",
    description: "显示或隐藏指定元素",
    icon: "Eye",
    configFields: [{ key: "targetId", label: "目标元素ID", type: "text", required: true, placeholder: "element-id" }],
  },
]

export function EventPanel() {
  const { components, selectedId, updateComponent } = useEditor()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [isAddingAction, setIsAddingAction] = useState(false)

  const selectedComponent = components.find((comp) => comp.id === selectedId)

  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">事件管理</h3>
            <p className="text-sm text-gray-500">请选择一个组件来配置事件</p>
          </div>
        </div>
      </div>
    )
  }

  const componentEvents = selectedComponent.events || []

  const addEvent = () => {
    const newEvent = {
      id: `event-${Date.now()}`,
      type: "click" as const,
      name: "点击事件",
      actions: [],
      enabled: true,
    }

    updateComponent(selectedComponent.id, {
      events: [...componentEvents, newEvent],
    })
    setIsAddingEvent(false)
  }

  const updateEvent = (eventId: string, updates: any) => {
    const updatedEvents = componentEvents.map((event: any) => (event.id === eventId ? { ...event, ...updates } : event))
    updateComponent(selectedComponent.id, { events: updatedEvents })
  }

  const deleteEvent = (eventId: string) => {
    const updatedEvents = componentEvents.filter((event: any) => event.id !== eventId)
    updateComponent(selectedComponent.id, { events: updatedEvents })
    if (selectedEventId === eventId) {
      setSelectedEventId(null)
    }
  }

  const addActionToEvent = (eventId: string, actionTemplate: any) => {
    const newAction = {
      id: `action-${Date.now()}`,
      type: actionTemplate.type,
      name: actionTemplate.name,
      config: actionTemplate.configFields.reduce(
        (acc: any, field: any) => {
          if (field.defaultValue !== undefined) {
            acc[field.key] = field.defaultValue
          }
          return acc
        },
        {} as Record<string, any>,
      ),
      enabled: true,
    }

    const updatedEvents = componentEvents.map((event: any) =>
      event.id === eventId ? { ...event, actions: [...event.actions, newAction] } : event,
    )
    updateComponent(selectedComponent.id, { events: updatedEvents })
    setIsAddingAction(false)
  }

  const updateAction = (eventId: string, actionId: string, updates: any) => {
    const updatedEvents = componentEvents.map((event: any) =>
      event.id === eventId
        ? {
            ...event,
            actions: event.actions.map((action: any) => (action.id === actionId ? { ...action, ...updates } : action)),
          }
        : event,
    )
    updateComponent(selectedComponent.id, { events: updatedEvents })
  }

  const deleteAction = (eventId: string, actionId: string) => {
    const updatedEvents = componentEvents.map((event: any) =>
      event.id === eventId ? { ...event, actions: event.actions.filter((action: any) => action.id !== actionId) } : event,
    )
    updateComponent(selectedComponent.id, { events: updatedEvents })
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "navigate":
        return <ExternalLink className="w-4 h-4" />
      case "showMessage":
        return <MessageSquare className="w-4 h-4" />
      case "copyText":
        return <Copy className="w-4 h-4" />
      case "executeScript":
        return <Code className="w-4 h-4" />
      case "sendRequest":
        return <Send className="w-4 h-4" />
      case "toggleElement":
        return <Eye className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const selectedEvent = componentEvents.find((event: any) => event.id === selectedEventId)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-lg">事件管理</h3>
        </div>
        <Button size="sm" onClick={() => setIsAddingEvent(true)} className="h-8 px-3">
          <Plus className="w-3 h-3 mr-1" />
          添加事件
        </Button>
      </div>

      {isAddingEvent && (
        <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">新建事件</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={addEvent}>
                确定
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingEvent(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs value={selectedEventId ? "config" : "list"} onValueChange={(value) => {
        if (value === "list") {
          setSelectedEventId(null)
        } else if (value === "config" && componentEvents.length > 0) {
          // 如果点击配置tab但没有选中事件，选中第一个事件
          if (!selectedEventId) {
            setSelectedEventId(componentEvents[0].id)
          }
        }
      }}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">事件列表</TabsTrigger>
          <TabsTrigger value="config" disabled={!selectedEventId}>
            事件配置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-3">
          {componentEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">暂无事件</p>
              <p className="text-xs mt-1">点击"添加事件"开始配置</p>
            </div>
          ) : (
            componentEvents.map((event: any) => (
              <div
                key={event.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedEventId === event.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedEventId(event.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{eventTypes.find((t) => t.value === event.type)?.icon || "⚡"}</div>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-gray-500">
                        {eventTypes.find((t) => t.value === event.type)?.label || event.type}
                        {event.actions.length > 0 && ` • ${event.actions.length}个动作`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={event.enabled}
                      onCheckedChange={(enabled) => updateEvent(event.id, { enabled })}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteEvent(event.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {selectedEvent && (
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">事件名称</Label>
                <Input
                  value={selectedEvent.name}
                  onChange={(e) => updateEvent(selectedEvent.id, { name: e.target.value })}
                  placeholder="请输入事件名称"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-2 block">事件类型</Label>
                <Select
                  value={selectedEvent.type}
                  onValueChange={(value) => updateEvent(selectedEvent.id, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">事件动作</h4>
                  <Button size="sm" onClick={() => setIsAddingAction(true)} className="h-8 px-3">
                    <Plus className="w-3 h-3 mr-1" />
                    添加动作
                  </Button>
                </div>

                {isAddingAction && (
                  <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                    <h5 className="font-medium mb-3">选择动作类型</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {eventActionTemplates.map((template) => (
                        <Button
                          key={template.type}
                          variant="outline"
                          className="justify-start h-auto p-3 bg-transparent"
                          onClick={() => addActionToEvent(selectedEvent.id, template)}
                        >
                          <div className="flex items-center gap-3">
                            {getActionIcon(template.type)}
                            <div className="text-left">
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" onClick={() => setIsAddingAction(false)}>
                        取消
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedEvent.actions.map((action: any, index: number) => (
                    <div key={action.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getActionIcon(action.type)}
                          <span className="font-medium">{action.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={action.enabled}
                            onCheckedChange={(enabled) => updateAction(selectedEvent.id, action.id, { enabled })}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                            onClick={() => deleteAction(selectedEvent.id, action.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* 动作配置字段 */}
                        {eventActionTemplates
                          .find((t) => t.type === action.type)
                          ?.configFields.map((field: any) => (
                            <div key={field.key}>
                              <Label className="text-sm text-gray-700 mb-1 block">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {field.type === "text" || field.type === "url" ? (
                                <Input
                                  value={action.config[field.key] || ""}
                                  onChange={(e) =>
                                    updateAction(selectedEvent.id, action.id, {
                                      config: { ...action.config, [field.key]: e.target.value },
                                    })
                                  }
                                  placeholder={field.placeholder}
                                />
                              ) : field.type === "number" ? (
                                <Input
                                  type="number"
                                  value={action.config[field.key] || ""}
                                  onChange={(e) =>
                                    updateAction(selectedEvent.id, action.id, {
                                      config: { ...action.config, [field.key]: Number(e.target.value) },
                                    })
                                  }
                                  placeholder={field.placeholder}
                                />
                              ) : field.type === "textarea" ? (
                                <Textarea
                                  value={action.config[field.key] || ""}
                                  onChange={(e) =>
                                    updateAction(selectedEvent.id, action.id, {
                                      config: { ...action.config, [field.key]: e.target.value },
                                    })
                                  }
                                  placeholder={field.placeholder}
                                  rows={3}
                                />
                              ) : field.type === "boolean" ? (
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={action.config[field.key] || false}
                                    onCheckedChange={(checked) =>
                                      updateAction(selectedEvent.id, action.id, {
                                        config: { ...action.config, [field.key]: checked },
                                      })
                                    }
                                  />
                                  <span className="text-sm text-gray-600">
                                    {action.config[field.key] ? "是" : "否"}
                                  </span>
                                </div>
                              ) : field.type === "select" ? (
                                <Select
                                  value={action.config[field.key] || ""}
                                  onValueChange={(value) =>
                                    updateAction(selectedEvent.id, action.id, {
                                      config: { ...action.config, [field.key]: value },
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option: any) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : null}
                            </div>
                          ))}

                        {/* 延迟执行 */}
                        <div>
                          <Label className="text-sm text-gray-700 mb-1 block">延迟执行(毫秒)</Label>
                          <Input
                            type="number"
                            value={action.delay || 0}
                            onChange={(e) =>
                              updateAction(selectedEvent.id, action.id, {
                                delay: Number(e.target.value),
                              })
                            }
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-xs text-orange-700 flex items-center gap-2">
          <span>⚡</span>事件将在预览模式下生效，编辑模式下不会触发
        </p>
      </div>
    </div>
  )
}