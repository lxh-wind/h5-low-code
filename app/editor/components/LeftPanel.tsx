'use client'

import dynamic from 'next/dynamic'
import * as Tabs from '@radix-ui/react-tabs'
import { TreeViewV2 } from './TreeViewV2'

const MaterialPanel = dynamic(
  () => import('./MaterialPanel').then(mod => mod.MaterialPanel),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded"></div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    )
  }
)

export function LeftPanel() {
  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <Tabs.Root defaultValue="materials" className="flex flex-col h-full">
        {/* Tab 导航 */}
        <Tabs.List className="flex border-b border-gray-200" aria-label="左侧面板选项">
          <Tabs.Trigger
            value="materials"
            className="
              flex-1 px-4 py-3 text-sm font-medium text-center transition-colors
              text-gray-500 hover:text-gray-700 hover:bg-gray-50
              data-[state=active]:text-blue-600 data-[state=active]:border-b-2 
              data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50
            "
          >
            <span className="mr-2">🧩</span>
            组件库
          </Tabs.Trigger>
          
          <Tabs.Trigger
            value="tree"
            className="
              flex-1 px-4 py-3 text-sm font-medium text-center transition-colors
              text-gray-500 hover:text-gray-700 hover:bg-gray-50
              data-[state=active]:text-blue-600 data-[state=active]:border-b-2 
              data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50
            "
          >
            <span className="mr-2">🌳</span>
            组件树
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab 内容 */}
        <Tabs.Content 
          value="materials" 
          className="flex-1 overflow-hidden focus:outline-none"
        >
          <div className="h-full p-4 overflow-y-auto">
            <MaterialPanel />
          </div>
        </Tabs.Content>
        
        <Tabs.Content 
          value="tree" 
          className="flex-1 overflow-hidden focus:outline-none"
        >
          <div className="h-full overflow-y-auto">
            <TreeViewV2 />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
} 