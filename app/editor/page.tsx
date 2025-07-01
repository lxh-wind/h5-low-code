'use client'

import { Suspense } from 'react'
import { EditorPageContent } from './EditorPageContent'

function EditorPageLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载编辑器...</p>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorPageLoading />}>
      <EditorPageContent />
    </Suspense>
  )
}
