"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useToast, type ToastPosition } from '@/components/ui/toast'

interface ToastDemoProps {
  position?: ToastPosition
}

export function ToastDemo({ position = 'top-center' }: ToastDemoProps) {
  const toast = useToast()

  const showSuccessToast = () => {
    toast.success('操作成功！', '您的数据已经成功保存到服务器')
  }

  const showErrorToast = () => {
    toast.error('操作失败', '网络连接异常，请检查您的网络设置')
  }

  const showWarningToast = () => {
    toast.warning('注意提醒', '您有未保存的更改，请及时保存')
  }

  const showInfoToast = () => {
    toast.info('提示信息', '系统将在5分钟后进行维护更新')
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Toast 消息测试 - {position}</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={showSuccessToast} variant="default">
          成功消息
        </Button>
        <Button onClick={showErrorToast} variant="destructive">
          错误消息
        </Button>
        <Button onClick={showWarningToast} variant="secondary">
          警告消息
        </Button>
        <Button onClick={showInfoToast} variant="outline">
          信息消息
        </Button>
      </div>
    </div>
  )
}