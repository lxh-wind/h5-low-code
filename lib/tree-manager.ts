import { Component } from '@/types/schema'

// 树节点的统一接口
export interface TreeNode {
  id: string
  type: string
  name: string
  component: Component
  children: TreeNode[]
  parent?: TreeNode
  depth: number
  isVisible: boolean
  isExpanded: boolean
}

// 树管理器 - 单一数据源和操作接口
export class TreeManager {
  private nodes: Map<string, TreeNode> = new Map()
  private rootNodes: TreeNode[] = []
  private expandedState: Map<string, boolean> = new Map()

  constructor(components: Component[], preserveExpandedState?: Map<string, boolean>) {
    if (preserveExpandedState) {
      this.expandedState = new Map(preserveExpandedState)
    }
    this.buildTree(components)
  }

  // 从组件数组构建树结构
  private buildTree(components: Component[]) {
    this.nodes.clear()
    this.rootNodes = []

    // 第一遍：创建所有节点
    components.forEach(component => {
      const node: TreeNode = {
        id: component.id,
        type: component.type,
        name: component.name,
        component,
        children: [],
        depth: 0,
        isVisible: true,
        isExpanded: this.expandedState.get(component.id) ?? true // 使用保存的展开状态，默认为true
      }
      this.nodes.set(component.id, node)
    })

    // 第二遍：建立父子关系
    components.forEach(component => {
      const node = this.nodes.get(component.id)!
      
      if (component.parentId) {
        const parent = this.nodes.get(component.parentId)
        if (parent) {
          node.parent = parent
          node.depth = parent.depth + 1
          parent.children.push(node)
        }
      } else {
        this.rootNodes.push(node)
      }
    })

    // 第三遍：计算可见性
    this.updateVisibility()
  }

  // 更新可见性（考虑父节点隐藏状态）
  private updateVisibility() {
    const updateNodeVisibility = (node: TreeNode) => {
      // 如果父节点隐藏或折叠，子节点也不可见
      const parentVisible = !node.parent || (node.parent.isVisible && node.parent.isExpanded)
      const componentVisible = !node.component.style?.display || node.component.style.display !== 'none'
      
      node.isVisible = parentVisible && componentVisible
      
      // 递归更新子节点
      node.children.forEach(updateNodeVisibility)
    }

    this.rootNodes.forEach(updateNodeVisibility)
  }

  // 获取树的根节点
  getRootNodes(): TreeNode[] {
    return this.rootNodes
  }

  // 获取指定节点
  getNode(id: string): TreeNode | undefined {
    return this.nodes.get(id)
  }

  // 获取所有可见节点（扁平化，用于虚拟化渲染）
  getVisibleNodes(): TreeNode[] {
    const visibleNodes: TreeNode[] = []
    
    const collectVisible = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.isVisible) {
          visibleNodes.push(node)
          if (node.isExpanded) {
            collectVisible(node.children)
          }
        }
      })
    }
    
    collectVisible(this.rootNodes)
    return visibleNodes
  }

  // 移动节点
  moveNode(dragId: string, hoverId: string, position: 'before' | 'after' | 'inside'): Component[] {
    const dragNode = this.nodes.get(dragId)
    const hoverNode = this.nodes.get(hoverId)
    
    if (!dragNode || !hoverNode) return this.toComponentArray()

    // 防止将节点移动到自己的子节点中
    if (this.isDescendant(dragNode, hoverNode)) {
      return this.toComponentArray()
    }

    // 从原位置移除
    this.removeNodeFromParent(dragNode)

    // 插入到新位置
    switch (position) {
      case 'inside':
        dragNode.parent = hoverNode
        dragNode.depth = hoverNode.depth + 1
        hoverNode.children.push(dragNode)
        break
      
      case 'before':
      case 'after':
        const targetParent = hoverNode.parent
        const targetArray = targetParent ? targetParent.children : this.rootNodes
        const hoverIndex = targetArray.indexOf(hoverNode)
        const insertIndex = position === 'before' ? hoverIndex : hoverIndex + 1
        
        dragNode.parent = targetParent
        dragNode.depth = targetParent ? targetParent.depth + 1 : 0
        targetArray.splice(insertIndex, 0, dragNode)
        break
    }

    this.updateVisibility()
    return this.toComponentArray()
  }

  // 切换节点展开状态
  toggleExpanded(id: string): void {
    const node = this.nodes.get(id)
    if (node) {
      node.isExpanded = !node.isExpanded
      this.expandedState.set(id, node.isExpanded) // 保存展开状态
      this.updateVisibility()
    }
  }

  // 获取展开状态Map，用于创建新实例时保持状态
  getExpandedState(): Map<string, boolean> {
    return new Map(this.expandedState)
  }

  // 删除节点
  deleteNode(id: string): Component[] {
    const node = this.nodes.get(id)
    if (!node) return this.toComponentArray()

    this.removeNodeFromParent(node)
    this.removeNodeFromMap(node)
    
    return this.toComponentArray()
  }

  // 辅助方法：从父节点中移除
  private removeNodeFromParent(node: TreeNode) {
    if (node.parent) {
      const index = node.parent.children.indexOf(node)
      if (index > -1) {
        node.parent.children.splice(index, 1)
      }
    } else {
      const index = this.rootNodes.indexOf(node)
      if (index > -1) {
        this.rootNodes.splice(index, 1)
      }
    }
  }

  // 辅助方法：从Map中递归移除节点
  private removeNodeFromMap(node: TreeNode) {
    this.nodes.delete(node.id)
    node.children.forEach(child => this.removeNodeFromMap(child))
  }

  // 辅助方法：检查是否为后代节点
  private isDescendant(ancestor: TreeNode, descendant: TreeNode): boolean {
    let current = descendant.parent
    while (current) {
      if (current === ancestor) return true
      current = current.parent
    }
    return false
  }

  // 转换为组件数组（用于更新store）
  toComponentArray(): Component[] {
    const components: Component[] = []
    
    const collectComponents = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        const component = {
          ...node.component,
          parentId: node.parent?.id
        }
        components.push(component)
        collectComponents(node.children)
      })
    }
    
    collectComponents(this.rootNodes)
    return components
  }

  // 更新组件数据
  updateComponent(id: string, updates: Partial<Component>): Component[] {
    const node = this.nodes.get(id)
    if (node) {
      node.component = { ...node.component, ...updates }
      // 如果更新了显示相关属性，重新计算可见性
      if (updates.style) {
        this.updateVisibility()
      }
    }
    return this.toComponentArray()
  }
} 