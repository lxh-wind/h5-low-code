# UI 组件库

基于 Radix UI 的现代化 React 组件库，为 H5 低代码编辑器提供统一的设计系统。

## 🎨 设计原则

- **一致性**: 统一的视觉风格和交互行为
- **可访问性**: 基于 Radix UI，符合 ARIA 标准
- **可定制**: 支持 Tailwind CSS 类名覆盖
- **类型安全**: 完整的 TypeScript 支持

## 📦 组件列表

### 基础组件

#### Button 按钮
```tsx
import { Button } from "@/components/ui"

// 基础用法
<Button>点击我</Button>

// 不同变体
<Button variant="default">默认</Button>
<Button variant="destructive">危险</Button>
<Button variant="outline">轮廓</Button>
<Button variant="secondary">次要</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>

// 不同尺寸
<Button size="sm">小号</Button>
<Button size="default">默认</Button>
<Button size="lg">大号</Button>
<Button size="icon">图标</Button>

// 加载状态
<Button loading>加载中...</Button>

// 带图标
<Button leftIcon={<Plus />}>新建</Button>
<Button rightIcon={<ArrowRight />}>下一步</Button>
```

#### Input 输入框
```tsx
import { Input } from "@/components/ui"
import { Search } from "lucide-react"

// 基础用法
<Input placeholder="请输入内容" />

// 带标签
<Input label="用户名" placeholder="请输入用户名" />

// 带错误信息
<Input 
  label="邮箱" 
  error="邮箱格式不正确" 
  placeholder="请输入邮箱"
/>

// 带帮助文本
<Input 
  label="密码" 
  helperText="密码长度至少8位" 
  type="password"
/>

// 带图标
<Input 
  leftIcon={<Search className="w-4 h-4" />}
  placeholder="搜索..."
/>
```

#### Textarea 文本域
```tsx
import { Textarea } from "@/components/ui"

// 基础用法
<Textarea placeholder="请输入描述" />

// 带标签和错误
<Textarea 
  label="页面描述" 
  error="描述不能为空"
  rows={4}
/>
```

#### Card 卡片
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui"

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述信息</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>
```

### 对话框组件

#### Dialog 对话框
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui"

<Dialog>
  <DialogTrigger asChild>
    <Button>打开对话框</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>对话框标题</DialogTitle>
      <DialogDescription>对话框描述信息</DialogDescription>
    </DialogHeader>
    <div>对话框内容</div>
  </DialogContent>
</Dialog>
```

#### AlertDialog 警告对话框
```tsx
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">删除</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认删除</AlertDialogTitle>
      <AlertDialogDescription>
        此操作无法撤销，确定要删除吗？
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction>确认删除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 选择器组件

#### Select 选择器
```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">选项1</SelectItem>
    <SelectItem value="option2">选项2</SelectItem>
    <SelectItem value="option3">选项3</SelectItem>
  </SelectContent>
</Select>
```

## 🎯 使用指南

### 1. 导入组件
```tsx
// 单独导入
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// 或从统一入口导入
import { Button, Input, Card } from "@/components/ui"
```

### 2. 自定义样式
所有组件都支持通过 `className` 属性自定义样式：

```tsx
<Button className="bg-purple-600 hover:bg-purple-700">
  自定义颜色
</Button>

<Input className="border-2 border-blue-500" />
```

### 3. 响应式设计
组件内置响应式支持，可以使用 Tailwind 的响应式前缀：

```tsx
<Button className="w-full sm:w-auto">
  响应式按钮
</Button>
```

## 🔧 开发指南

### 添加新组件
1. 在 `components/ui/` 目录下创建新组件文件
2. 遵循现有组件的结构和命名规范
3. 使用 `cn()` 函数合并类名
4. 添加完整的 TypeScript 类型定义
5. 在 `index.ts` 中导出新组件

### 样式规范
- 使用 Tailwind CSS 类名
- 支持 `className` 属性覆盖
- 保持一致的颜色和间距
- 添加 hover、focus 等交互状态

### 可访问性
- 使用语义化的 HTML 元素
- 添加适当的 ARIA 属性
- 支持键盘导航
- 确保足够的颜色对比度

## 📝 注意事项

1. **依赖要求**: 确保安装了以下依赖
   ```bash
   npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-alert-dialog
   npm install class-variance-authority tailwind-merge
   ```

2. **工具函数**: 组件依赖 `@/lib/utils` 中的 `cn` 函数，确保该函数存在

3. **图标**: 示例中使用了 `lucide-react` 图标库

4. **主题**: 组件使用了统一的设计令牌，可以通过修改 Tailwind 配置来自定义主题 