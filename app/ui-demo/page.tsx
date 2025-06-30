'use client'

import { useState } from 'react'
import { 
  Button, 
  Input, 
  Textarea, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Edit, 
  Save,
  ArrowRight,
  Home
} from 'lucide-react'
import Link from 'next/link'

export default function UIDemo() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('提交成功！')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UI 组件演示</h1>
              <p className="text-gray-600 mt-2">基于 Radix UI 的组件库展示</p>
            </div>
            <Link href="/">
              <Button variant="outline" leftIcon={<Home className="w-4 h-4" />}>
                返回首页
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 按钮组件 */}
          <Card>
            <CardHeader>
              <CardTitle>Button 按钮</CardTitle>
              <CardDescription>不同变体和状态的按钮组件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">变体</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">默认</Button>
                  <Button variant="destructive">危险</Button>
                  <Button variant="outline">轮廓</Button>
                  <Button variant="secondary">次要</Button>
                  <Button variant="ghost">幽灵</Button>
                  <Button variant="link">链接</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">尺寸</h4>
                <div className="flex items-center gap-2">
                  <Button size="sm">小号</Button>
                  <Button size="default">默认</Button>
                  <Button size="lg">大号</Button>
                  <Button size="icon"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">状态</h4>
                <div className="flex gap-2">
                  <Button loading={loading} onClick={handleSubmit}>
                    {loading ? '提交中...' : '提交'}
                  </Button>
                  <Button disabled>禁用</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">带图标</h4>
                <div className="flex gap-2">
                  <Button leftIcon={<Plus className="w-4 h-4" />}>新建</Button>
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />}>下一步</Button>
                  <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                    下载
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 输入组件 */}
          <Card>
            <CardHeader>
              <CardTitle>Input & Textarea</CardTitle>
              <CardDescription>输入框和文本域组件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="用户名"
                placeholder="请输入用户名"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input 
                label="搜索"
                placeholder="搜索内容..."
                leftIcon={<Search className="w-4 h-4" />}
              />
              
              <Input 
                label="邮箱"
                placeholder="请输入邮箱"
                error="邮箱格式不正确"
              />
              
              <Input 
                label="密码"
                type="password"
                placeholder="请输入密码"
                helperText="密码长度至少8位"
              />
              
              <Textarea 
                label="描述"
                placeholder="请输入描述信息..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* 选择器组件 */}
          <Card>
            <CardHeader>
              <CardTitle>Select 选择器</CardTitle>
              <CardDescription>下拉选择组件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">页面类型</label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择页面类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">落地页</SelectItem>
                    <SelectItem value="product">产品页</SelectItem>
                    <SelectItem value="activity">活动页</SelectItem>
                    <SelectItem value="form">表单页</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectValue && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    已选择: {selectValue}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 对话框组件 */}
          <Card>
            <CardHeader>
              <CardTitle>Dialog 对话框</CardTitle>
              <CardDescription>模态对话框和警告对话框</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">普通对话框</h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">打开对话框</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>编辑页面信息</DialogTitle>
                      <DialogDescription>
                        修改页面的基本信息，包括名称、标题和描述。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input label="页面名称" placeholder="请输入页面名称" />
                      <Input label="页面标题" placeholder="请输入页面标题" />
                      <Textarea label="页面描述" placeholder="请输入页面描述" rows={3} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">取消</Button>
                      <Button>保存</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">警告对话框</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" leftIcon={<Trash2 className="w-4 h-4" />}>
                      删除页面
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作将永久删除该页面及其所有组件配置，且无法撤销。您确定要继续吗？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction>确认删除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* 卡片组件 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Card 卡片组件</CardTitle>
              <CardDescription>展示信息的卡片容器</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">页面统计</CardTitle>
                    <CardDescription>总页面数量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">24</div>
                    <p className="text-sm text-gray-500 mt-1">本周新增 3 个</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">组件统计</CardTitle>
                    <CardDescription>总组件数量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">156</div>
                    <p className="text-sm text-gray-500 mt-1">平均每页 6.5 个</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">活跃度</CardTitle>
                    <CardDescription>今日更新</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">8</div>
                    <p className="text-sm text-gray-500 mt-1">页面更新次数</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 底部说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>组件特性</CardTitle>
            <CardDescription>UI 组件库的主要特性和优势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">易于定制</h3>
                <p className="text-sm text-gray-500">支持 Tailwind CSS 类名覆盖</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Save className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">类型安全</h3>
                <p className="text-sm text-gray-500">完整的 TypeScript 支持</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">可访问性</h3>
                <p className="text-sm text-gray-500">基于 Radix UI，符合 ARIA 标准</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">一致性</h3>
                <p className="text-sm text-gray-500">统一的设计系统和交互</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 