'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { SkeletonComponentStats, Skeleton } from '@/components/common'
import { BarChart3 } from 'lucide-react'

interface ComponentStatsProps {
  componentTypes: Record<string, number>
  isLoading: boolean
}

export function ComponentStats({ componentTypes, isLoading }: ComponentStatsProps) {
  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton className="h-5 w-20" />
          </div>
        ) : (
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            组件统计
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <SkeletonComponentStats />
        ) : Object.keys(componentTypes).length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">暂无组件数据</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(componentTypes)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(componentTypes))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-6 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 