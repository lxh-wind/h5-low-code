'use client'

import React from 'react'
import Image from 'next/image'
import { Component } from '@/types/schema'
import { useEditorStore } from '@/store/editor'
import { SelectionBox } from './SelectionBox'
import { useDroppable } from '@dnd-kit/core'
import { getComponentConfig } from '@/materials'
import { processStyleValue } from '@/lib/utils'

// 提取重复的空状态拖拽区域组件
const EmptyDropZone: React.FC<{ isOver: boolean }> = ({ isOver }) => (
  <div style={{
    color: isOver ? '#2196f3' : '#9ca3af',
    fontSize: '14px',
    padding: '16px',
    textAlign: 'center',
    border: isOver ? '2px dashed #2196f3' : '2px dashed #d1d5db',
    borderRadius: '4px',
    backgroundColor: isOver ? '#e3f2fd' : 'transparent',
  }}>
    {isOver ? '松开鼠标放置组件' : '拖拽组件到这里'}
  </div>
)

interface ComponentRendererProps {
  component: Component
  isSelected: boolean
  onSelect: () => void
  mode?: 'editor' | 'preview' // 新增模式参数
}

export function ComponentRenderer({ 
  component, 
  isSelected, 
  onSelect,
  mode = 'editor' // 默认为编辑器模式
}: ComponentRendererProps) {
  const { type, props, style, children } = component
  const { selectedComponentId, selectComponent, currentPage } = useEditorStore()
  
  // 为容器组件设置拖拽放置区域
  const config = getComponentConfig(type)
  const {
    isOver,
    setNodeRef: setDropRef,
  } = useDroppable({
    id: `component-${component.id}`,
    disabled: !config.canHaveChildren || mode !== 'editor',
    data: {
      type: 'container',
      componentId: component.id,
    },
  })
  
  // 使用统一的样式处理函数已在顶部导入
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (mode === 'editor') {
      onSelect()
    }
  }

  const renderComponent = () => {
    // 通用样式处理逻辑（编辑器模式和预览模式都使用）
    // 将组件样式转换为 React.CSSProperties
    const convertedStyle: React.CSSProperties = {}
    if (style) {
      Object.entries(style).forEach(([key, value]) => {
        if (value) {
          (convertedStyle as Record<string, unknown>)[key] = processStyleValue(key, value)
        }
      })
    }

    // 构建基本样式，包含继承的页面配置
    const inheritedStyle: React.CSSProperties = {}
    const pageConfig = currentPage?.config
    
    // 如果组件没有设置字体属性，则继承页面配置
    if (pageConfig) {
      if (!convertedStyle.fontFamily && pageConfig.fontFamily) {
        inheritedStyle.fontFamily = pageConfig.fontFamily
      }
      if (!convertedStyle.fontSize && pageConfig.fontSize) {
        inheritedStyle.fontSize = pageConfig.fontSize
      }
      if (!convertedStyle.lineHeight && pageConfig.lineHeight) {
        inheritedStyle.lineHeight = pageConfig.lineHeight
      }
      if (!convertedStyle.color && pageConfig.color) {
        inheritedStyle.color = pageConfig.color
      }
    }

    const baseStyle: React.CSSProperties = {
      cursor: mode === 'editor' ? 'pointer' : 'default',
      transition: mode === 'editor' ? 'all 0.2s' : 'none',
      ...inheritedStyle,
      ...convertedStyle
    }

    switch (type) {
      case 'text':
        return (
          <div
            style={baseStyle}
            onClick={handleClick}
          >
            {props.text || '文本内容'}
          </div>
        )

      case 'button':
        return (
          <button
            style={{
              ...baseStyle,
              paddingTop: convertedStyle?.paddingTop || convertedStyle?.padding || '0px',
              paddingRight: convertedStyle?.paddingRight || convertedStyle?.padding || '0px',
              paddingBottom: convertedStyle?.paddingBottom || convertedStyle?.padding || '0px',
              paddingLeft: convertedStyle?.paddingLeft || convertedStyle?.padding || '0px',
              borderRadius: convertedStyle?.borderRadius || '4px',
              border: convertedStyle?.border || 'none',
              backgroundColor: convertedStyle?.backgroundColor || '#1890ff',
              color: convertedStyle?.color || '#ffffff',
              fontSize: convertedStyle?.fontSize || '14px',
            }}
            disabled={props.disabled}
            onClick={handleClick}
          >
            {props.text || '按钮'}
          </button>
        )

      case 'image':
        return (
          <Image
            style={{
              ...baseStyle,
              display: 'block',
              objectFit: 'cover',
              width: convertedStyle?.width || 'auto',
              height: convertedStyle?.height || 'auto',
            }}
            src={props.src || 'https://via.placeholder.com/200x150?text=图片'}
            alt={props.alt || '图片'}
            width={200}
            height={150}
            onClick={handleClick}
          />
        )

      case 'input':
        return (
          <input
            style={{
              ...baseStyle,
              paddingTop: convertedStyle?.paddingTop || convertedStyle?.padding || '8px',
              paddingRight: convertedStyle?.paddingRight || convertedStyle?.padding || '12px',
              paddingBottom: convertedStyle?.paddingBottom || convertedStyle?.padding || '8px',
              paddingLeft: convertedStyle?.paddingLeft || convertedStyle?.padding || '12px',
              border: convertedStyle?.border || '1px solid #d9d9d9',
              borderRadius: convertedStyle?.borderRadius || '4px',
              fontSize: convertedStyle?.fontSize || '14px',
              width: convertedStyle?.width || '100%',
            }}
            type={props.type || 'text'}
            placeholder={props.placeholder || '请输入内容'}
            onClick={handleClick}
            readOnly={mode === 'preview'} // 预览模式下只读
            onChange={() => {}} // 预览模式下不响应输入
          />
        )

      case 'container':
        return (
          <div
            ref={setDropRef}
            style={{
              ...baseStyle,
              minHeight: '50px',
              paddingTop: convertedStyle?.paddingTop || convertedStyle?.padding || '16px',
              paddingRight: convertedStyle?.paddingRight || convertedStyle?.padding || '16px',
              paddingBottom: convertedStyle?.paddingBottom || convertedStyle?.padding || '16px',
              paddingLeft: convertedStyle?.paddingLeft || convertedStyle?.padding || '16px',
              backgroundColor: convertedStyle?.backgroundColor || '#f5f5f5',
              borderRadius: convertedStyle?.borderRadius || '4px',
              display: convertedStyle?.display || 'flex',
              flexDirection: (convertedStyle?.flexDirection as 'row' | 'column') || 'column',
              gap: convertedStyle?.gap,
              // 拖拽悬停时的视觉反馈（仅编辑器模式）
              ...(mode === 'editor' && isOver && {
                backgroundColor: '#e3f2fd',
                border: '2px dashed #2196f3',
              }),
            }}
            onClick={handleClick}
          >
            {children && children.length > 0 ? (
              children.map((child: Component) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={selectedComponentId === child.id}
                  onSelect={() => selectComponent(child.id)}
                  mode={mode}
                />
              ))
            ) : (
              mode === 'editor' && <EmptyDropZone isOver={isOver} />
            )}
          </div>
        )

      case 'list':
        return (
          <div
            ref={setDropRef}
            style={{
              ...baseStyle,
              display: convertedStyle?.display || 'flex',
              flexDirection: (convertedStyle?.flexDirection as 'row' | 'column') || 'column',
              gap: convertedStyle?.gap,
              // 拖拽悬停时的视觉反馈（仅编辑器模式）
              ...(mode === 'editor' && isOver && {
                backgroundColor: '#e3f2fd',
                border: '2px dashed #2196f3',
                borderRadius: '4px',
                padding: '8px',
              }),
            }}
            onClick={handleClick}
          >
            {children && children.length > 0 ? (
              children.map((child: Component) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={selectedComponentId === child.id}
                  onSelect={() => selectComponent(child.id)}
                  mode={mode}
                />
              ))
            ) : (
              mode === 'editor' && <EmptyDropZone isOver={isOver} />
            )}
          </div>
        )

      case 'card':
        return (
          <div
            ref={setDropRef}
            style={{
              ...baseStyle,
              backgroundColor: convertedStyle?.backgroundColor || '#ffffff',
              border: convertedStyle?.border || '1px solid #e8e8e8',
              borderRadius: convertedStyle?.borderRadius || '8px',
              paddingTop: convertedStyle?.paddingTop || convertedStyle?.padding || '16px',
              paddingRight: convertedStyle?.paddingRight || convertedStyle?.padding || '16px',
              paddingBottom: convertedStyle?.paddingBottom || convertedStyle?.padding || '16px',
              paddingLeft: convertedStyle?.paddingLeft || convertedStyle?.padding || '16px',
              boxShadow: convertedStyle?.boxShadow || '0 2px 8px rgba(0,0,0,0.1)',
              // 拖拽悬停时的视觉反馈（仅编辑器模式）
              ...(mode === 'editor' && isOver && {
                backgroundColor: '#e3f2fd',
                border: '2px dashed #2196f3',
              }),
            }}
            onClick={handleClick}
          >
            {children && children.length > 0 ? (
              children.map((child: Component) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={selectedComponentId === child.id}
                  onSelect={() => selectComponent(child.id)}
                  mode={mode}
                />
              ))
            ) : (
              mode === 'editor' && <EmptyDropZone isOver={isOver} />
            )}
          </div>
        )

      case 'divider':
        return (
          <div
            style={{
              ...baseStyle,
              width: convertedStyle?.width || '100%',
              height: convertedStyle?.height || '1px',
              backgroundColor: convertedStyle?.backgroundColor || '#e8e8e8',
              margin: convertedStyle?.margin || '16px 0',
            }}
            onClick={handleClick}
          />
        )

      case 'space':
        return (
          <div
            style={{
              ...baseStyle,
              width: convertedStyle?.width || '100%',
              height: convertedStyle?.height || '16px',
            }}
            onClick={handleClick}
          />
        )

      default:
        return (
          <div
            style={baseStyle}
            onClick={handleClick}
          >
            未知组件类型: {type}
          </div>
        )
    }
  }

  // 编辑器模式下使用 SelectionBox
  if (mode === 'editor') {
    return (
      <SelectionBox
        componentId={component.id}
        isSelected={isSelected}
        componentName={component.name}
      >
        {renderComponent()}
      </SelectionBox>
    )
  }

  // 预览模式下直接返回组件
  return renderComponent()
} 