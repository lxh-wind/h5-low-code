'use client'

import { PreviewRenderer } from '@/components/PreviewRenderer'
import { Component } from '@/types/schema'
import { styleToTailwind } from '@/lib/utils'

export default function TestPreviewPage() {
  // 创建测试组件
  const testComponents: Component[] = [
    {
      id: 'test_1',
      type: 'text',
      name: '测试文本',
      props: {
        text: '这是一个测试文本'
      },
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ff0000',
        textAlign: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginTop: '10px',
        marginBottom: '10px',
      },
      // 手动预编译样式
      className: styleToTailwind({
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ff0000',
        textAlign: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginTop: '10px',
        marginBottom: '10px',
      })
    },
    {
      id: 'test_2',
      type: 'button',
      name: '测试按钮',
      props: {
        text: '点击我'
      },
      style: {
        backgroundColor: '#1890ff',
        color: '#ffffff',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderRadius: '6px',
        fontSize: '16px',
        marginTop: '20px',
        marginBottom: '20px',
        display: 'block',
        width: '200px'
      },
      className: styleToTailwind({
        backgroundColor: '#1890ff',
        color: '#ffffff',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderRadius: '6px',
        fontSize: '16px',
        marginTop: '20px',
        marginBottom: '20px',
        display: 'block',
        width: '200px'
      })
    },
    {
      id: 'test_3',
      type: 'text',
      name: '无className测试',
      props: {
        text: '这个组件没有预编译className，应该使用fallback样式'
      },
      style: {
        fontSize: '18px',
        color: '#00ff00',
        paddingTop: '15px',
        paddingBottom: '15px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        textAlign: 'center'
      }
      // 故意不设置className来测试fallback
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">预览渲染器测试</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">测试组件信息</h2>
          {testComponents.map((component, index) => (
            <div key={component.id} className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-medium">组件 {index + 1}: {component.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>原始样式:</strong> {JSON.stringify(component.style)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>TailwindCSS类名:</strong> {component.className || '无'}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">渲染结果</h2>
          <div className="space-y-4 border-2 border-dashed border-gray-300 p-4 rounded">
            {testComponents.map((component) => (
              <div key={component.id} className="border border-gray-200 p-2 rounded">
                <PreviewRenderer component={component} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 