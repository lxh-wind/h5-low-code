'use client'

import { useState, useCallback } from 'react'
import { useEditorStore } from '@/store/editor'
import { getComponentConfig } from '@/materials/configs'
import * as Tabs from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import * as Select from '@radix-ui/react-select'
import * as Label from '@radix-ui/react-label'
import { ChevronDownIcon, CheckIcon } from 'lucide-react'

export function PropertyPanel() {
  const { selectedComponentId, getComponentById, updateComponent } = useEditorStore()
  const [activeTab, setActiveTab] = useState<'props' | 'style'>('props')
  
  const selectedComponent = selectedComponentId ? getComponentById(selectedComponentId) : null
  
  if (!selectedComponent) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-4">⚙️</div>
        <p>选择一个组件来编辑属性</p>
      </div>
    )
  }

  const config = getComponentConfig(selectedComponent.type)

  const handlePropsChange = (key: string, value: any) => {
    updateComponent(selectedComponentId!, {
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    })
  }

  const handleStyleChange = (key: string, value: any) => {
    updateComponent(selectedComponentId!, {
      style: {
        ...selectedComponent.style,
        [key]: value
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
        
        {/* 标签切换 - Radix UI Tabs */}
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
              <div className="property-section">
                <h4 className="text-sm font-medium text-gray-900 mb-3">组件属性</h4>
                
                {selectedComponent.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <Label.Root className="block text-xs font-medium text-gray-700 mb-1">
                        文本内容
                      </Label.Root>
                      <input
                        type="text"
                        value={selectedComponent.props.text || ''}
                        onChange={(e) => handlePropsChange('text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="文本内容"
                        placeholder="请输入文本内容"
                      />
                    </div>
                  </div>
                )}

                {selectedComponent.type === 'button' && (
                  <div className="space-y-3">
                    <div>
                      <Label.Root className="block text-xs font-medium text-gray-700 mb-1">
                        按钮文字
                      </Label.Root>
                      <input
                        type="text"
                        value={selectedComponent.props.text || ''}
                        onChange={(e) => handlePropsChange('text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="按钮文字"
                        placeholder="请输入按钮文字"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch.Root
                        checked={selectedComponent.props.disabled || false}
                        onCheckedChange={(checked) => handlePropsChange('disabled', checked)}
                        className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-5" />
                      </Switch.Root>
                      <Label.Root className="text-xs font-medium text-gray-700">
                        禁用状态
                      </Label.Root>
                    </div>
                  </div>
                )}

                {selectedComponent.type === 'image' && (
                  <div className="space-y-3">
                    <div>
                      <Label.Root className="block text-xs font-medium text-gray-700 mb-1">
                        图片地址
                      </Label.Root>
                      <input
                        type="text"
                        value={selectedComponent.props.src || ''}
                        onChange={(e) => handlePropsChange('src', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="图片地址"
                        placeholder="请输入图片URL"
                      />
                    </div>
                    <div>
                      <Label.Root className="block text-xs font-medium text-gray-700 mb-1">
                        替代文本
                      </Label.Root>
                      <input
                        type="text"
                        value={selectedComponent.props.alt || ''}
                        onChange={(e) => handlePropsChange('alt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="替代文本"
                        placeholder="请输入图片描述"
                      />
                    </div>
                  </div>
                )}

                {selectedComponent.type === 'input' && (
                  <div className="space-y-3">
                    <div>
                      <Label.Root className="block text-xs font-medium text-gray-700 mb-1">
                        占位符
                      </Label.Root>
                      <input
                        type="text"
                        value={selectedComponent.props.placeholder || ''}
                        onChange={(e) => handlePropsChange('placeholder', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="占位符"
                        placeholder="请输入占位符文本"
                      />
                    </div>
                    <div>
                      <Label.Root className="block text-xs font-medium text-gray-700 mb-1">
                        输入类型
                      </Label.Root>
                      <Select.Root
                        value={selectedComponent.props.type || 'text'}
                        onValueChange={(value) => handlePropsChange('type', value)}
                      >
                        <Select.Trigger className="w-full inline-flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <Select.Value />
                          <Select.Icon>
                            <ChevronDownIcon className="h-4 w-4" />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <Select.Viewport className="p-1">
                              <Select.Item value="text" className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                <Select.ItemText>文本</Select.ItemText>
                                <Select.ItemIndicator className="absolute right-2">
                                  <CheckIcon className="h-4 w-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                              <Select.Item value="password" className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                <Select.ItemText>密码</Select.ItemText>
                                <Select.ItemIndicator className="absolute right-2">
                                  <CheckIcon className="h-4 w-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                              <Select.Item value="email" className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                <Select.ItemText>邮箱</Select.ItemText>
                                <Select.ItemIndicator className="absolute right-2">
                                  <CheckIcon className="h-4 w-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                              <Select.Item value="number" className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                <Select.ItemText>数字</Select.ItemText>
                                <Select.ItemIndicator className="absolute right-2">
                                  <CheckIcon className="h-4 w-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                              <Select.Item value="tel" className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                <Select.ItemText>电话</Select.ItemText>
                                <Select.ItemIndicator className="absolute right-2">
                                  <CheckIcon className="h-4 w-4" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>
                  </div>
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content value="style">
              <div className="property-section">
                <h4 className="text-sm font-medium text-gray-900 mb-3">样式设置</h4>
                
                <div className="space-y-4">
                  {/* 尺寸设置 */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">尺寸</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">宽度</Label.Root>
                        <input
                          type="number"
                          value={selectedComponent.style?.width || ''}
                          onChange={(e) => handleStyleChange('width', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="auto"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">高度</Label.Root>
                        <input
                          type="number"
                          value={selectedComponent.style?.height || ''}
                          onChange={(e) => handleStyleChange('height', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="auto"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 间距设置 */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-3">间距</h5>
                    
                    {/* 外边距 */}
                    <div className="mb-4">
                      <div className="mb-3">
                        <span className="text-xs text-gray-600">外边距</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">⬆</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.marginTop || ''}
                            onChange={(e) => handleStyleChange('marginTop', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">⬇</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.marginBottom || ''}
                            onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">⬅</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.marginLeft || ''}
                            onChange={(e) => handleStyleChange('marginLeft', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">➡</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.marginRight || ''}
                            onChange={(e) => handleStyleChange('marginRight', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 内边距 */}
                    <div className="mb-4">
                      <div className="mb-3">
                        <span className="text-xs text-gray-600">内边距</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">⬆</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.paddingTop || ''}
                            onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">⬇</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.paddingBottom || ''}
                            onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">⬅</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.paddingLeft || ''}
                            onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 w-4">➡</span>
                          <input
                            type="number"
                            value={selectedComponent.style?.paddingRight || ''}
                            onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 颜色设置 */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">颜色</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">文字颜色</Label.Root>
                        <div className="flex">
                          <input
                            type="color"
                            value={selectedComponent.style?.color || '#000000'}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            aria-label="选择文字颜色"
                            title="选择文字颜色"
                          />
                          <input
                            type="text"
                            value={selectedComponent.style?.color || ''}
                            onChange={(e) => handleStyleChange('color', e.target.value)}
                            className="flex-1 ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">背景颜色</Label.Root>
                        <div className="flex">
                          <input
                            type="color"
                            value={selectedComponent.style?.backgroundColor || '#ffffff'}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            aria-label="选择背景颜色"
                            title="选择背景颜色"
                          />
                          <input
                            type="text"
                            value={selectedComponent.style?.backgroundColor || ''}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            className="flex-1 ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 字体设置 */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">字体</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">字体大小</Label.Root>
                        <input
                          type="number"
                          value={selectedComponent.style?.fontSize || ''}
                          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="14"
                          min="1"
                          max="200"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">字体粗细</Label.Root>
                        <Select.Root
                          value={selectedComponent.style?.fontWeight || 'normal'}
                          onValueChange={(value) => handleStyleChange('fontWeight', value)}
                        >
                          <Select.Trigger className="w-full inline-flex items-center justify-between px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent">
                            <Select.Value />
                            <Select.Icon>
                              <ChevronDownIcon className="h-3 w-3" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 z-50">
                              <Select.Viewport className="p-1">
                                <Select.Item value="normal" className="relative flex items-center px-2 py-1 text-xs rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                  <Select.ItemText>正常</Select.ItemText>
                                  <Select.ItemIndicator className="absolute right-2">
                                    <CheckIcon className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="bold" className="relative flex items-center px-2 py-1 text-xs rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                  <Select.ItemText>粗体</Select.ItemText>
                                  <Select.ItemIndicator className="absolute right-2">
                                    <CheckIcon className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="lighter" className="relative flex items-center px-2 py-1 text-xs rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                  <Select.ItemText>细体</Select.ItemText>
                                  <Select.ItemIndicator className="absolute right-2">
                                    <CheckIcon className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                    </div>
                  </div>

                  {/* 边框设置 */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">边框</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">宽度</Label.Root>
                        <input
                          type="number"
                          value={selectedComponent.style?.borderWidth || ''}
                          onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                          max="50"
                        />
                      </div>
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">样式</Label.Root>
                        <Select.Root
                          value={selectedComponent.style?.borderStyle || 'solid'}
                          onValueChange={(value) => handleStyleChange('borderStyle', value)}
                        >
                          <Select.Trigger className="w-full inline-flex items-center justify-between px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent">
                            <Select.Value />
                            <Select.Icon>
                              <ChevronDownIcon className="h-3 w-3" />
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 z-50">
                              <Select.Viewport className="p-1">
                                <Select.Item value="solid" className="relative flex items-center px-2 py-1 text-xs rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                  <Select.ItemText>实线</Select.ItemText>
                                  <Select.ItemIndicator className="absolute right-2">
                                    <CheckIcon className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="dashed" className="relative flex items-center px-2 py-1 text-xs rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                  <Select.ItemText>虚线</Select.ItemText>
                                  <Select.ItemIndicator className="absolute right-2">
                                    <CheckIcon className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                                <Select.Item value="dotted" className="relative flex items-center px-2 py-1 text-xs rounded-sm cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none data-[highlighted]:bg-gray-100">
                                  <Select.ItemText>点线</Select.ItemText>
                                  <Select.ItemIndicator className="absolute right-2">
                                    <CheckIcon className="h-3 w-3" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                      <div>
                        <Label.Root className="block text-xs text-gray-600 mb-1">颜色</Label.Root>
                        <input
                          type="color"
                          value={selectedComponent.style?.borderColor || '#000000'}
                          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                          className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                          aria-label="选择边框颜色"
                          title="选择边框颜色"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 圆角设置 */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">圆角</h5>
                    <input
                      type="number"
                      value={selectedComponent.style?.borderRadius || ''}
                      onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  )
} 