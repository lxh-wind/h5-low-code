'use client'

import { useState, useMemo, useEffect } from 'react'
import { useEditorStore } from '@/store/editor'
import { TreeNode } from '@/lib/tree-manager'
import { ComponentType } from '@/types/schema'
import { getComponentConfig } from '@/materials/configs'
import { 
  XIcon, 
  SearchIcon,
  FileTextIcon,
  MousePointerClickIcon,
  ImageIcon,
  PencilIcon,
  BoxIcon,
  ListIcon,
  CreditCardIcon,
  MinusIcon,
  SpaceIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  GripVerticalIcon
} from 'lucide-react'
import { useDraggable, useDroppable } from '@dnd-kit/core'

// 组件类型对应的图标映射
const componentIcons = {
  text: FileTextIcon,
  button: MousePointerClickIcon,
  image: ImageIcon,
  input: PencilIcon,
  container: BoxIcon,
  list: ListIcon,
  card: CreditCardIcon,
  divider: MinusIcon,
  space: SpaceIcon,
}

// 树节点组件
interface TreeNodeItemProps {
  node: TreeNode
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleExpanded: (id: string) => void
  onMove: (dragId: string, hoverId: string, position: 'before' | 'after' | 'inside') => void
  isSelected: boolean
}

function TreeNodeItem({ node, onSelect, onDelete, onToggleExpanded, onMove, isSelected }: TreeNodeItemProps) {
  const config = getComponentConfig(node.type as ComponentType)
  const IconComponent = componentIcons[node.type as keyof typeof componentIcons] || FileTextIcon
  const hasChildren = node.children.length > 0

  // 拖拽源
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `tree-node-${node.id}`,
    data: {
      type: 'tree-node',
      nodeId: node.id,
      node: node
    },
  })

  // 拖拽目标 - 前面
  const {
    isOver: isOverBefore,
    setNodeRef: setDropBeforeRef,
  } = useDroppable({
    id: `tree-drop-before-${node.id}`,
    data: {
      type: 'tree-drop',
      nodeId: node.id,
      position: 'before',
      canHaveChildren: config.canHaveChildren
    },
  })

  // 拖拽目标 - 里面
  const {
    isOver: isOverInside,
    setNodeRef: setDropInsideRef,
  } = useDroppable({
    id: `tree-drop-inside-${node.id}`,
    data: {
      type: 'tree-drop',
      nodeId: node.id,
      position: 'inside',
      canHaveChildren: config.canHaveChildren
    },
    disabled: !config.canHaveChildren
  })

  // 拖拽目标 - 后面
  const {
    isOver: isOverAfter,
    setNodeRef: setDropAfterRef,
  } = useDroppable({
    id: `tree-drop-after-${node.id}`,
    data: {
      type: 'tree-drop',
      nodeId: node.id,
      position: 'after',
      canHaveChildren: config.canHaveChildren
    },
  })

  const handleClick = () => {
    onSelect(node.id)
  }

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpanded(node.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(node.id)
  }

  return (
    <div>
      {/* 拖拽区域 - 前面 */}
      <div 
        ref={setDropBeforeRef}
        className={`h-1 ${isOverBefore ? 'bg-blue-400' : ''}`}
      />
      
      <div
        ref={setDragRef}
        className={`group flex items-center py-1 px-2 cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-100 text-blue-800' : ''
        } ${isDragging ? 'opacity-50' : ''} ${
          isOverInside && config.canHaveChildren ? 'bg-green-50 border-l-2 border-green-400' : ''
        }`}
        style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* 拖拽手柄 */}
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded mr-1 cursor-grab active:cursor-grabbing"
        >
          <GripVerticalIcon className="h-3 w-3 text-gray-400" />
        </div>

        {/* 展开/收起按钮 */}
        {hasChildren ? (
          <button
            onClick={handleToggleExpanded}
            className="p-0.5 hover:bg-gray-200 rounded mr-1"
          >
            {node.isExpanded ? (
              <ChevronDownIcon className="h-3 w-3" />
            ) : (
              <ChevronRightIcon className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4 mr-1" />
        )}

        {/* 组件图标 */}
        <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
        
        {/* 组件名称 */}
        <span 
          ref={config.canHaveChildren ? setDropInsideRef : undefined}
          className="text-sm flex-1 truncate"
        >
          {node.name || config.name}
        </span>

        {/* 容器标识 */}
        {config.canHaveChildren && (
          <span className="text-xs px-1 py-0.5 bg-green-100 text-green-700 rounded text-[10px] mr-1">
            容器
          </span>
        )}

        {/* 隐藏状态标识 */}
        {!node.isVisible && (
          <span className="text-xs px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] mr-1">
            隐藏
          </span>
        )}

        {/* 删除按钮 */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded"
          aria-label="删除组件"
        >
          <XIcon className="h-3 w-3" />
        </button>
      </div>

      {/* 子节点 */}
      {hasChildren && node.isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              onSelect={onSelect}
              onDelete={onDelete}
              onToggleExpanded={onToggleExpanded}
              onMove={onMove}
              isSelected={isSelected}
            />
          ))}
        </div>
      )}
      
      {/* 拖拽区域 - 后面 */}
      <div 
        ref={setDropAfterRef}
        className={`h-1 ${isOverAfter ? 'bg-blue-400' : ''}`}
      />
    </div>
  )
}

export function TreeViewV2() {
  const { 
    getTreeNodes,
    selectedComponentId,
    selectComponent,
    deleteComponent,
    toggleNodeExpanded,
    moveComponent,
    treeManager
  } = useEditorStore()

  const [searchTerm, setSearchTerm] = useState('')
  
  // 获取树节点
  const treeNodes = getTreeNodes()

  // 调试：监听树节点变化
  useEffect(() => {
    console.log('TreeViewV2: 树节点更新', {
      nodeCount: treeNodes.length,
      nodes: treeNodes.map(n => ({ id: n.id, name: n.name, type: n.type })),
      treeManagerExists: !!treeManager
    })
  }, [treeNodes, treeManager])

  // 搜索过滤
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return treeNodes

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        const matchesSearch = 
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.type.toLowerCase().includes(searchTerm.toLowerCase())

        if (matchesSearch) {
          acc.push(node)
        } else if (node.children.length > 0) {
          const filteredChildren = filterNodes(node.children)
          if (filteredChildren.length > 0) {
            acc.push({
              ...node,
              children: filteredChildren,
              isExpanded: true // 搜索时自动展开
            })
          }
        }

        return acc
      }, [])
    }

    return filterNodes(treeNodes)
  }, [treeNodes, searchTerm])

  const handleSelect = (id: string) => {
    selectComponent(id)
  }

  const handleDelete = (id: string) => {
    console.log('TreeViewV2: 删除组件', id)
    console.log('TreeViewV2: 删除前节点数量', treeNodes.length)
    deleteComponent(id)
    // 延迟检查删除后的状态
    setTimeout(() => {
      const newNodes = getTreeNodes()
      console.log('TreeViewV2: 删除后节点数量', newNodes.length)
    }, 100)
  }

  const handleToggleExpanded = (id: string) => {
    toggleNodeExpanded(id)
  }

  const handleMove = (dragId: string, hoverId: string, position: 'before' | 'after' | 'inside') => {
    console.log('TreeViewV2: 移动组件', { dragId, hoverId, position })
    moveComponent(dragId, hoverId, position)
  }

  if (treeNodes.length === 0) {
    return (
      <div className="flex flex-col h-full">
        {/* 搜索框 */}
        <div className="p-3 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 空状态 */}
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-8">
          <div className="text-4xl mb-3">🌳</div>
          <p className="text-sm">暂无组件</p>
          <p className="text-xs text-gray-400 mt-1">拖拽组件到画布开始编辑</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 搜索框 */}
      <div className="p-3 border-b">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索组件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 提示信息 */}
      <div className="px-3 py-2 bg-blue-50 border-b text-xs text-blue-700">
        💡 单击选中，箭头展开/收起，拖拽手柄重新排序，支持搜索过滤
      </div>

      {/* 树结构 */}
      <div className="flex-1 overflow-y-auto">
        {filteredNodes.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onToggleExpanded={handleToggleExpanded}
            onMove={handleMove}
            isSelected={selectedComponentId === node.id}
          />
        ))}
      </div>
    </div>
  )
} 