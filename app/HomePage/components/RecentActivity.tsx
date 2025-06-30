'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { SkeletonActivity, Skeleton } from '@/components/common'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { Clock, Activity, Edit3 } from 'lucide-react'

interface RecentActivityProps {
  recentActivity: Array<{
    id: string
    name: string
    title: string
    action: string
    time: Date | string
    componentsCount: number
  }>
  isLoading: boolean
}

export function RecentActivity({ recentActivity, isLoading }: RecentActivityProps) {
  const { formatRelativeTime } = useTimeFormat()

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
            <Clock className="w-5 h-5 text-gray-600" />
            最近活动
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonActivity key={index} />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">暂无活动记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.componentsCount} 个组件 · {formatRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 