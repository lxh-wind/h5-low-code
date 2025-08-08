'use client'

import { useState } from 'react'
import { FileText, Smartphone, Monitor, Tablet, Eye, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Card,
  CardContent
} from '@/components/ui'

interface Template {
  id: string
  name: string
  title: string
  description: string
  category: string
  thumbnail: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  components: unknown[]
}

interface TemplateLibraryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: Template) => void
}

// 模拟模板数据
const mockTemplates: Template[] = [
  {
    id: 'template_1',
    name: 'product-showcase',
    title: '产品展示页',
    description: '适用于产品介绍和展示的H5页面模板，包含轮播图、产品列表等组件',
    category: '商业',
    thumbnail: '/templates/product-showcase.png',
    deviceType: 'mobile',
    components: []
  },
  {
    id: 'template_2',
    name: 'event-invitation',
    title: '活动邀请函',
    description: '精美的活动邀请函模板，适用于各种活动宣传',
    category: '活动',
    thumbnail: '/templates/event-invitation.png',
    deviceType: 'mobile',
    components: []
  },
  {
    id: 'template_3',
    name: 'company-profile',
    title: '企业介绍',
    description: '专业的企业介绍页面模板，展示企业文化和实力',
    category: '企业',
    thumbnail: '/templates/company-profile.png',
    deviceType: 'mobile',
    components: []
  },
  {
    id: 'template_4',
    name: 'personal-resume',
    title: '个人简历',
    description: '现代化的个人简历模板，突出个人技能和经验',
    category: '个人',
    thumbnail: '/templates/personal-resume.png',
    deviceType: 'mobile',
    components: []
  }
]

const categories = ['全部', '商业', '活动', '企业', '个人']

export function TemplateLibraryDialog({ isOpen, onClose, onSelectTemplate }: TemplateLibraryDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === '全部' || template.category === selectedCategory
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template)
    onClose()
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Tablet className="w-4 h-4" />
      case 'desktop': return <Monitor className="w-4 h-4" />
      default: return <Smartphone className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>模板库</DialogTitle>
          <DialogDescription>
            选择一个模板快速开始你的设计
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* 搜索和分类 */}
          <div className="space-y-4 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索模板..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* 模板网格 */}
          <div className="flex-1 overflow-y-auto py-6">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到模板</h3>
                <p className="text-gray-500">尝试调整搜索条件或分类筛选</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map(template => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                  >
                    {/* 模板预览 */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">模板预览</p>
                        </div>
                      </div>
                      
                      {/* 悬浮操作 */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {/* 预览模板 */}}
                          className="bg-white/95 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm"
                          title="预览模板"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* 模板信息 */}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
                          {template.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 ml-2">
                          {getDeviceIcon(template.deviceType)}
                        </div>
                      </div>
                        
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleSelectTemplate(template)}
                          className="text-xs"
                        >
                          使用模板
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 