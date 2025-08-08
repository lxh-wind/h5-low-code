"use client"

import { useEditor } from "@/store/editor"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Trash2, Edit3, Check, X, GripVertical, Copy, Lock, Unlock } from "lucide-react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// 可排序的图层项组件
interface SortableLayerItemProps {
  component: any
  selectedId: string | null
  editingId: string | null
  editingName: string
  setSelectedId: (id: string) => void
  deleteComponent: (id: string) => void
  updateComponent: (id: string, updates: any) => void
  duplicateComponent: (id: string) => void
  startRename: (component: any) => void
  saveRename: () => void
  cancelRename: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  setEditingName: (name: string) => void
}

function SortableLayerItem({
  component,
  selectedId,
  editingId,
  editingName,
  setSelectedId,
  deleteComponent,
  updateComponent,
  duplicateComponent,
  startRename,
  saveRename,
  cancelRename,
  handleKeyDown,
  setEditingName,
}: SortableLayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
        selectedId === component.id ? "bg-blue-50 border border-blue-200" : ""
      } ${component.locked ? "opacity-60 bg-orange-50" : ""}`}
      onClick={() => setSelectedId(component.id)}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded mr-2"
      >
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>

      <div className="flex-1 min-w-0">
        {editingId === component.id ? (
          <div className="flex items-center gap-1">
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-6 text-sm px-2"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation()
                saveRename()
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation()
                cancelRename()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <div className="text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis text-gray-800">
              {component.name || component.type}
            </div>
            <div className="text-xs text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
              {component.id}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-end justify-center gap-1 ml-2">
        {editingId !== component.id && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
              disabled={component.locked}
              onClick={(e) => {
                e.stopPropagation()
                startRename(component)
              }}
              title="重命名"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
              disabled={component.locked}
              onClick={(e) => {
                e.stopPropagation()
                duplicateComponent(component.id)
              }}
              title="复制组件"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 w-6 p-0 hover:bg-gray-200 transition-colors ${
                component.locked ? 'text-orange-600' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation()
                updateComponent(component.id, {
                  locked: !component.locked
                })
              }}
              title={component.locked ? "解锁组件" : "锁定组件"}
            >
              {component.locked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-200 transition-colors"
            disabled={component.locked}
            onClick={(e) => {
              e.stopPropagation()
              const isHidden = component.style?.display === 'none'
              updateComponent(component.id, {
                style: {
                  ...component.style,
                  display: isHidden ? 'block' : 'none'
                }
              })
            }}
            title={component.style?.display === 'none' ? "显示组件" : "隐藏组件"}
          >
            {component.style?.display === 'none' ? (
              <EyeOff className="h-3 w-3 text-gray-400" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            disabled={component.locked}
            onClick={(e) => {
              e.stopPropagation()
              deleteComponent(component.id)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function LayerPanel() {
  const { components, selectedId, setSelectedId, deleteComponent, updateComponent, duplicateComponent, reorderComponents } = useEditor()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  // 开始重命名
  const startRename = (component: any) => {
    setEditingId(component.id)
    setEditingName(component.name || component.type)
  }

  // 保存重命名
  const saveRename = () => {
    if (editingId && editingName.trim()) {
      updateComponent(editingId, {
        name: editingName.trim()
      })
    }
    setEditingId(null)
    setEditingName("")
  }

  // 取消重命名
  const cancelRename = () => {
    setEditingId(null)
    setEditingName("")
  }

  // 处理回车键保存
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveRename()
    } else if (e.key === 'Escape') {
      cancelRename()
    }
  }

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = components.findIndex((item) => item.id === active.id)
      const newIndex = components.findIndex((item) => item.id === over?.id)
      
      reorderComponents(oldIndex, newIndex)
    }
  }

  return (
    <div className="border-t border-gray-200 flex-1 flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">图层面板</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {components.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">暂无图层</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {components.map((component) => (
                    <SortableLayerItem
                      key={component.id}
                      component={component}
                      selectedId={selectedId}
                      editingId={editingId}
                      editingName={editingName}
                      setSelectedId={setSelectedId}
                      deleteComponent={deleteComponent}
                      updateComponent={updateComponent}
                      duplicateComponent={duplicateComponent}
                      startRename={startRename}
                      saveRename={saveRename}
                      cancelRename={cancelRename}
                      handleKeyDown={handleKeyDown}
                      setEditingName={setEditingName}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}