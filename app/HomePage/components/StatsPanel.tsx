'use client'

import { Card, CardContent } from '@/components/ui'
import { 
  SkeletonStatsCard 
} from '@/components/common'
import {
  FileText,
  Palette,
  Activity,
  TrendingUp,
  Target,
  Clock,
  Award
} from 'lucide-react'

interface StatsPanelProps {
  stats: {
    totalPages: number
    totalComponents: number
    todayPages: number
    weekPages: number
    avgComponentsPerPage: number
  }
  isLoading: boolean
}

export function StatsPanel({ stats, isLoading }: StatsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 总页面数 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总页面数</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPages}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">本周新增 {stats.weekPages}</span>
          </div>
        </CardContent>
      </Card>

      {/* 总组件数 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总组件数</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComponents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Target className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-gray-600">平均每页 {stats.avgComponentsPerPage} 个</span>
          </div>
        </CardContent>
      </Card>

      {/* 今日活跃 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日活跃</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayPages}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-gray-600">页面更新次数</span>
          </div>
        </CardContent>
      </Card>

      {/* 设计效率 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">设计效率</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalPages > 0 ? '98%' : '0%'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Award className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-gray-600">比传统快 5x</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 