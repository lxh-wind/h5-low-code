'use client'

import React from 'react'
import { Component } from '@/types/schema'
import Image from 'next/image'

interface PreviewRendererProps {
  component: Component
}

export function PreviewRenderer({ component }: PreviewRendererProps) {
  const { className } = component
  
  const renderComponent = (component: Component): React.ReactNode => {
    const { type, style } = component

    // 处理样式转换
    const processedStyle: React.CSSProperties = {}
    if (style) {
      Object.entries(style).forEach(([key, value]) => {
        if (value) {
          (processedStyle as Record<string, string>)[key] = value
        }
      })
    }

    // 组合样式：内联样式 + 预编译的类名
    const inlineStyle: React.CSSProperties = {
      ...processedStyle,
      boxSizing: 'border-box'
    }

    switch (type) {
      case 'text':
        return (
          <span className={className} style={inlineStyle}>
            {component.props.text || '文本内容'}
          </span>
        )

      case 'button':
        return (
          <button
            className={`${className} ${!className ? 'px-4 py-2 rounded hover:opacity-80 disabled:opacity-50' : ''}`}
            style={inlineStyle}
            disabled={component.props.disabled}
          >
            {component.props.text || '按钮'}
          </button>
        )

      case 'image':
        return (
          <Image
            key={component.id}
            style={inlineStyle}
            src={component.props.src || 'https://via.placeholder.com/200x150?text=图片'}
            alt={component.props.alt || '图片'}
            width={200}
            height={150}
          />
        )

      case 'input':
        return (
          <input
            className={`${className} ${!className ? 'px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' : ''}`}
            style={inlineStyle}
            type={component.props.type || 'text'}
            placeholder={component.props.placeholder || '请输入内容'}
            readOnly // 预览模式下只读
          />
        )

      case 'container':
        return (
          <div className={`${className} ${!className ? 'min-h-[50px]' : ''}`} style={inlineStyle}>
            {component.children && component.children.length > 0 ? (
              component.children.map((child: Component) => (
                <PreviewRenderer key={child.id} component={child} />
              ))
            ) : (
              <div className="text-gray-400 text-sm p-4 text-center">
                空容器
              </div>
            )}
          </div>
        )

      case 'list':
        return (
          <div className={className} style={inlineStyle}>
            {component.children && component.children.length > 0 ? (
              component.children.map((child: Component) => (
                <PreviewRenderer key={child.id} component={child} />
              ))
            ) : (
              <div className="text-gray-400 text-sm p-4 text-center">
                空列表
              </div>
            )}
          </div>
        )

      case 'card':
        return (
          <div className={`${className} ${!className ? 'bg-white rounded-lg shadow border' : ''}`} style={inlineStyle}>
            {component.children && component.children.length > 0 ? (
              component.children.map((child: Component) => (
                <PreviewRenderer key={child.id} component={child} />
              ))
            ) : (
              <div className="text-gray-400 text-sm p-4 text-center">
                空卡片
              </div>
            )}
          </div>
        )

      case 'divider':
        return (
          <div className={`${className} ${!className ? 'border-t border-gray-300' : ''}`} style={inlineStyle} />
        )

      case 'space':
        return (
          <div className={className} style={inlineStyle} />
        )

      default:
        return (
          <div className={className} style={inlineStyle}>
            未知组件类型: {type}
          </div>
        )
    }
  }

  return renderComponent(component)
} 