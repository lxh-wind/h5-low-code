'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor'
import { getExtendedComponentConfig } from '@/materials'
import { PropertyGroup } from './PropertyGroup'
import { DynamicPropertyControl } from './DynamicPropertyControl'
import { processStyleValue } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
  // Radix UI 组件已在 DynamicPropertyControl 中使用

export function PropertyPanel() {
  const { 
    selectedComponentId, 
    getComponentById, 
    updateComponent,
    currentPage,
    updatePageConfig,
    updatePageSEO,
    updatePageInfo
  } = useEditorStore()
  const [activeTab, setActiveTab] = useState<'props' | 'style'>('props')
  
  const selectedComponent = selectedComponentId ? getComponentById(selectedComponentId) : null
  
  // 如果没有选中组件，显示页面配置
  if (!selectedComponent) {
    // 页面配置控件定义
    const pageConfigControls = [
      {
        type: 'text' as const,
        label: '页面名称',
        key: 'name',
        placeholder: '请输入页面名称'
      },
      {
        type: 'text' as const,
        label: '页面标题',
        key: 'title',
        placeholder: '请输入页面标题'
      },
      {
        type: 'textarea' as const,
        label: '页面描述',
        key: 'description',
        placeholder: '请输入页面描述'
      }
    ]

    const seoControls = [
      {
        type: 'text' as const,
        label: '关键词',
        key: 'keywords',
        placeholder: '请输入关键词，用逗号分隔'
      },
      {
        type: 'text' as const,
        label: '作者',
        key: 'author',
        placeholder: '请输入作者信息'
      },
      {
        type: 'text' as const,
        label: 'Open Graph 标题',
        key: 'ogTitle',
        placeholder: '社交媒体分享标题'
      },
      {
        type: 'textarea' as const,
        label: 'Open Graph 描述',
        key: 'ogDescription',
        placeholder: '社交媒体分享描述'
      }
    ]

    const pageStyleControls = [
      {
        type: 'color' as const,
        label: '背景颜色',
        key: 'backgroundColor'
      },
      {
        type: 'text' as const,
        label: '最小高度',
        key: 'minHeight',
        placeholder: '如：100vh, 600px'
      },
      {
        type: 'number' as const,
        label: '页面内边距',
        key: 'padding',
        placeholder: '20',
        min: 0,
        unit: 'px'
      },
      {
        type: 'select' as const,
        label: '字体家族',
        key: 'fontFamily',
        options: [
          { label: '系统字体', value: 'system-ui' },
          { label: 'Arial', value: 'Arial' },
          { label: 'Helvetica', value: 'Helvetica' }
        ]
      },
      {
        type: 'number' as const,
        label: '默认字体大小',
        key: 'fontSize',
        placeholder: '14',
        min: 8,
        max: 72,
        unit: 'px'
      },
      {
        type: 'text' as const,
        label: '行高',
        key: 'lineHeight',
        placeholder: '如：1.6, 24px'
      },
      {
        type: 'color' as const,
        label: '默认文字颜色',
        key: 'color'
      }
    ]

    return (
      <div className="h-full flex flex-col">
        <div className="property-section">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">📄</span>
            <div>
              <h3 className="font-medium text-gray-900">页面配置</h3>
              <p className="text-xs text-gray-500">{currentPage?.id}</p>
            </div>
          </div>
          
          {/* 标签切换 */}
          <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as 'props' | 'style')}>
            <Tabs.List className="flex border-b border-gray-200">
              <Tabs.Trigger
                value="props"
                className="px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700"
              >
                基本信息
              </Tabs.Trigger>
              <Tabs.Trigger
                value="style"
                className="px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700"
              >
                页面设置
              </Tabs.Trigger>
            </Tabs.List>

            {/* 页面配置内容 */}
            <div className="flex-1 overflow-y-auto">
              <Tabs.Content value="props">
                <div className="property-section">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">页面信息</h4>
                  <div className="space-y-3">
                    {pageConfigControls.map((control) => (
                      <DynamicPropertyControl
                        key={control.key}
                        control={control}
                        value={currentPage?.[control.key as keyof typeof currentPage] as string}
                        onChange={(value) => updatePageInfo({ [control.key]: value as string })}
                      />
                    ))}
                  </div>
                </div>

                <div className="property-section">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">SEO 设置</h4>
                  <div className="space-y-3">
                    {seoControls.map((control) => (
                      <DynamicPropertyControl
                        key={control.key}
                        control={control}
                        value={currentPage?.seo?.[control.key as keyof typeof currentPage.seo] as string}
                        onChange={(value) => updatePageSEO({ [control.key]: value as string })}
                      />
                    ))}
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="style">
                <div className="property-section">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">页面样式</h4>
                  <div className="space-y-3">
                    {pageStyleControls.map((control) => (
                      <DynamicPropertyControl
                        key={control.key}
                        control={control}
                        value={currentPage?.config?.[control.key as keyof typeof currentPage.config] as string}
                        onChange={(value) => {
                          const processedValue = typeof value === 'string' ? processStyleValue(control.key, value) : value
                          updatePageConfig({ [control.key]: processedValue })
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    )
  }

  // 如果有选中组件，显示组件配置
  const config = getExtendedComponentConfig(selectedComponent.type)
  const { propertyConfig } = config

  const handlePropsChange = (key: string, value: string | boolean) => {
    updateComponent(selectedComponentId!, {
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    })
  }

  const handleStyleChange = (key: string, value: string | boolean) => {
    const processedValue = typeof value === 'string' ? processStyleValue(key, value) : value
    updateComponent(selectedComponentId!, {
      style: {
        ...selectedComponent.style,
        [key]: processedValue
      }
    })
  }

  return (
    <div key={selectedComponentId} className="h-full flex flex-col">
      {/* 组件信息 */}
      <div className="property-section">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="font-medium text-gray-900">{config.name}</h3>
            <p className="text-xs text-gray-500">{selectedComponent.id}</p>
          </div>
        </div>
        
        {/* 标签切换 */}
        <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as 'props' | 'style')}>
          <Tabs.List className="flex border-b border-gray-200">
            <Tabs.Trigger
              value="props"
              className="px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700"
            >
              属性
            </Tabs.Trigger>
            <Tabs.Trigger
              value="style"
              className="px-3 py-2 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700"
            >
              样式
            </Tabs.Trigger>
          </Tabs.List>

          {/* 属性编辑区域 */}
          <div className="flex-1 overflow-y-auto">
            <Tabs.Content value="props">
              {propertyConfig.props && propertyConfig.props.length > 0 ? (
                propertyConfig.props.map((group) => (
                  <PropertyGroup
                    key={group.key}
                    group={group}
                    values={selectedComponent.props}
                    onChange={handlePropsChange}
                  />
                ))
              ) : (
                <div className="property-section">
                  <p className="text-sm text-gray-500 text-center py-8">
                    此组件没有可配置的属性
                  </p>
                </div>
              )}
            </Tabs.Content>

            <Tabs.Content value="style">
              {propertyConfig.styles && propertyConfig.styles.length > 0 ? (
                propertyConfig.styles.map((group) => (
                  <PropertyGroup
                    key={group.key}
                    group={group}
                    values={selectedComponent.style || {}}
                    onChange={handleStyleChange}
                  />
                ))
              ) : (
                <div className="property-section">
                  <p className="text-sm text-gray-500 text-center py-8">
                    此组件没有可配置的样式
                  </p>
                </div>
              )}
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  )
} 