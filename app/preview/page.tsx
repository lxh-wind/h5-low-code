'use client'

import { Suspense } from 'react'
import { PreviewPageContent } from '@/app/preview/PreviewPageContent'

function PreviewPageLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载预览...</p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<PreviewPageLoading />}>
      <PreviewPageContent />
    </Suspense>
  )
} 