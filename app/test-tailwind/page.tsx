'use client'

import { styleToTailwind } from '@/lib/utils'
import { useState } from 'react'

export default function TestTailwindPage() {
  const [testStyle, setTestStyle] = useState({
    marginTop: '20px',
    paddingLeft: '30px',
    backgroundColor: '#ff0000',
    fontSize: '18px',
    width: '200px',
    height: '100px'
  })

  const generatedClasses = styleToTailwind(testStyle)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">TailwindCSS 任意值语法测试</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">测试样式对象：</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(testStyle, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">生成的 TailwindCSS 类名：</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {generatedClasses}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">应用效果测试：</h2>
        <div 
          className={`${generatedClasses} border border-gray-300`}
          style={{ border: '1px solid #ccc' }}
        >
          这是测试元素
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">手动任意值测试：</h2>
        <div className="mt-[20px] pl-[30px] bg-[#ff0000] text-[18px] w-[200px] h-[100px] border border-gray-300 text-white flex items-center">
          手动任意值测试
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">常见值测试：</h2>
        <div className="mt-4 pl-6 bg-red-500 text-lg w-48 h-24 border border-gray-300 text-white flex items-center">
          常见值测试
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">样式编辑器：</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">marginTop:</label>
            <input 
              type="text" 
              value={testStyle.marginTop}
              onChange={(e) => setTestStyle({...testStyle, marginTop: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="例如: 20px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">paddingLeft:</label>
            <input 
              type="text" 
              value={testStyle.paddingLeft}
              onChange={(e) => setTestStyle({...testStyle, paddingLeft: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="例如: 30px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">backgroundColor:</label>
            <input 
              type="text" 
              value={testStyle.backgroundColor}
              onChange={(e) => setTestStyle({...testStyle, backgroundColor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="例如: #ff0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">fontSize:</label>
            <input 
              type="text" 
              value={testStyle.fontSize}
              onChange={(e) => setTestStyle({...testStyle, fontSize: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="例如: 18px"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 