'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button
} from '@/components/ui'

interface ImportTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (template: { id: string; name: string; data: unknown }) => void
}

export function ImportTemplateDialog({ isOpen, onClose, onImportSuccess }: ImportTemplateDialogProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)
    
    // 检查文件类型
    if (!file.name.endsWith('.json')) {
      setError('请选择 JSON 格式的模板文件')
      return
    }
    
    // 检查文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('文件大小不能超过 5MB')
      return
    }
    
    setSelectedFile(file)
  }

  const handleImport = async () => {
    if (!selectedFile) return
    
    setImporting(true)
    setError(null)
    
    try {
      const text = await selectedFile.text()
      const templateData = JSON.parse(text)
      
      // 验证模板数据结构
      if (!templateData.name || !templateData.components) {
        throw new Error('无效的模板文件格式')
      }
      
      // 生成新的模板ID
      const importedTemplate = {
        ...templateData,
        id: `imported_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imported: true
      }
      
      onImportSuccess(importedTemplate)
      onClose()
      
      // 重置状态
      setSelectedFile(null)
      setError(null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败，请检查文件格式')
    } finally {
      setImporting(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>导入模板</DialogTitle>
          <DialogDescription>
            从本地文件导入模板
          </DialogDescription>
        </DialogHeader>

            {/* 文件上传区域 */}
            <div className="space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="选择模板文件"
                  aria-label="选择模板文件"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        点击选择文件或拖拽到此处
                      </p>
                      <p className="text-xs text-gray-500">
                        支持 JSON 格式，最大 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* 说明文本 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  导入说明：
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 支持从编辑器导出的 JSON 模板文件</li>
                  <li>• 导入后会自动生成新的模板ID</li>
                  <li>• 确保文件包含完整的组件结构</li>
                </ul>
              </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="flex-1"
            >
              {importing ? '导入中...' : '导入模板'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 