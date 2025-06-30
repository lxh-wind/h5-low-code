'use client'

import React from 'react'
import { Component } from '@/types/schema'

interface PreviewRendererProps {
  component: Component
}

export function PreviewRenderer({ component }: PreviewRendererProps) {
  const { type, props, className, style, children } = component
  
  // 开发环境下的调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('PreviewRenderer Debug:', {
      componentType: type,
      componentId: component.id,
      precompiledClassName: className,
      originalStyle: style,
      hasClassName: !!className,
      hasStyle: !!style && Object.keys(style).length > 0,
    })
  }
  
  const renderComponent = () => {
    // 基础类名
    const baseClasses = 'transition-all duration-200'
    
    // 组合类名 - 优先使用预编译的 className
    const combinedClassName = [baseClasses, className].filter(Boolean).join(' ')
    
    // 内联样式 - 总是应用，作为className的补充或fallback
    const inlineStyle: React.CSSProperties = style ? {
      // 只有在没有className的情况下才使用全部样式作为fallback
      ...(className ? {} : {
        marginTop: style?.marginTop,
        marginRight: style?.marginRight,
        marginBottom: style?.marginBottom,
        marginLeft: style?.marginLeft,
        paddingTop: style?.paddingTop,
        paddingRight: style?.paddingRight,
        paddingBottom: style?.paddingBottom,
        paddingLeft: style?.paddingLeft,
        width: style?.width,
        height: style?.height,
        backgroundColor: style?.backgroundColor,
        color: style?.color,
        fontSize: style?.fontSize,
        fontWeight: style?.fontWeight,
        borderWidth: style?.borderWidth,
        borderStyle: style?.borderStyle,
        borderColor: style?.borderColor,
        borderRadius: style?.borderRadius,
        display: style?.display as any,
        textAlign: style?.textAlign as any,
      })
    } : {}

    // 开发环境下输出最终使用的样式
    if (process.env.NODE_ENV === 'development') {
      console.log('Final styles for', component.id, {
        className: combinedClassName,
        inlineStyle,
        usingFallback: !className && style && Object.keys(style).length > 0
      })
    }

    switch (type) {
      case 'text':
        return (
          <span className={combinedClassName} style={inlineStyle}>
            {props.text || '文本内容'}
          </span>
        )

      case 'button':
        return (
          <button
            className={`${combinedClassName} ${!className ? 'px-4 py-2 rounded hover:opacity-80 disabled:opacity-50' : ''}`}
            style={inlineStyle}
            disabled={props.disabled}
          >
            {props.text || '按钮'}
          </button>
        )

      case 'image':
        return (
          <img
            className={`${combinedClassName} ${!className ? 'block object-cover' : ''}`}
            style={inlineStyle}
            src={props.src || 'https://via.placeholder.com/200x150?text=图片'}
            alt={props.alt || '图片'}
          />
        )

      case 'input':
        return (
          <input
            className={`${combinedClassName} ${!className ? 'px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' : ''}`}
            style={inlineStyle}
            type={props.type || 'text'}
            placeholder={props.placeholder || '请输入内容'}
            readOnly // 预览模式下只读
          />
        )

      case 'container':
        return (
          <div className={`${combinedClassName} ${!className ? 'min-h-[50px]' : ''}`} style={inlineStyle}>
            {children && children.length > 0 ? (
              children.map((child: Component) => (
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
          <div className={combinedClassName} style={inlineStyle}>
            {children && children.length > 0 ? (
              children.map((child: Component) => (
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
          <div className={`${combinedClassName} ${!className ? 'bg-white rounded-lg shadow border' : ''}`} style={inlineStyle}>
            {children && children.length > 0 ? (
              children.map((child: Component) => (
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
          <div className={`${combinedClassName} ${!className ? 'border-t border-gray-300' : ''}`} style={inlineStyle} />
        )

      case 'space':
        return (
          <div className={combinedClassName} style={inlineStyle} />
        )

      default:
        return (
          <div className={combinedClassName} style={inlineStyle}>
            未知组件类型: {type}
          </div>
        )
    }
  }

  return renderComponent()
} 