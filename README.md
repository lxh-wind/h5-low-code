# 🛠️ H5 低代码编辑器技术文档

> 专为移动端 H5 页面搭建设计  
> 具备组件拖拽、属性配置、实时预览、代码生成等功能  
> 技术栈：**Next.js 15 + React 19 + TailwindCSS + Zustand + radix-ui**

---

## 📌 项目亮点

- 🎨 **可视化编辑**: 拖拽式组件编辑，所见即所得
- 📱 **iPhone预览**: 真实的iPhone界面预览，完美还原移动端效果
- ⚙️ **属性配置**: 实时生效的属性面板，支持样式和行为配置
- 🌳 **组件树**: 支持嵌套、拖动、删除的层级结构管理
- 💾 **项目管理**: 本地存储与 mock 数据模拟
- 🧾 **代码生成**: 导出可运行的 React + Tailwind 源码
- ⏪ **撤销重做**: 支持编辑状态回滚与前进操作
- ✅ **响应式**: 完全纯前端，适配不同屏幕尺寸

---

## 🛠️ 技术栈

| 技术 | 用途 |
|---|---|
| Next.js 15 | App Router 架构，支持懒加载 |
| React 19 | Signals、性能优化 |
| TypeScript | 类型检查与代码提示 |
| TailwindCSS v4.* | 样式原子化、移动端布局 |
| Zustand | 状态管理（schema、撤销、选中） |
| @dnd-kit | 拖拽实现（排序、拖入） |
| React Hook Form + Zod | 属性表单与表单校验 |
| Radix UI / shadcn/ui | UI 基础交互组件 |
| JSZip + file-saver | 导出代码为 zip 包下载 |

---

## 🏗️ 项目架构

基于 **职责分离** 和 **就近原则** 的分层架构设计：

```
h5-low-code/
├── app/                          # Next.js App Router
│   ├── editor/                   # 编辑器页面
│   │   ├── components/           # 编辑器专用组件 (6个)
│   │   │   ├── Canvas.tsx        # 画布
│   │   │   ├── MaterialPanel.tsx # 物料面板
│   │   │   ├── PropertyPanel.tsx # 属性面板
│   │   │   ├── TreeView.tsx      # 组件树
│   │   │   ├── ComponentRenderer.tsx
│   │   │   └── SelectionBox.tsx
│   │   └── page.tsx
│   ├── HomePage/                 # 首页
│   │   ├── components/           # 首页专用组件 (11个)
│   │   │   ├── CreatePageDialog.tsx
│   │   │   ├── PageCard.tsx
│   │   │   ├── PageManagement.tsx
│   │   │   └── ...
│   │   └── page.tsx
│   └── preview/                  # 预览页面
├── components/                   # 全局共享组件
│   ├── common/                   # 通用组件 (4个)
│   │   ├── PhoneFrame.tsx        # 手机框架
│   │   ├── DeviceSelector.tsx    # 设备选择器
│   │   ├── Skeleton.tsx          # 骨架屏
│   │   └── PerformanceMonitor.tsx
│   ├── layout/                   # 布局组件 (2个)
│   │   ├── Toolbar.tsx           # 工具栏
│   │   └── PreviewRenderer.tsx   # 预览渲染器
│   └── ui/                       # 基础UI组件 (8个)
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...
├── lib/                          # 工具函数
├── store/                        # 状态管理
├── types/                        # 类型定义
└── materials/                    # 组件物料配置
```

### 🎯 组件分层说明

1. **页面级组件** (`app/[page]/components/`)
   - 高度耦合特定页面业务逻辑，不可复用
   - 可以直接访问页面级状态
   - 例：编辑器画布、首页页面卡片

2. **布局组件** (`components/layout/`)
   - 页面结构和布局相关，跨页面复用
   - 例：顶部工具栏、预览渲染器

3. **通用组件** (`components/common/`)
   - 纯展示组件，高度可复用，无业务逻辑
   - 例：手机框架、设备选择器、骨架屏

4. **基础UI组件** (`components/ui/`)
   - 最基础的UI组件，基于设计系统
   - 基于 shadcn/ui，纯UI展示

---

## 🧱 核心功能模块

| 模块 | 功能说明 |
|---|----|
| 🎨 组件物料库 | 左侧面板，常用 UI 组件集合 |
| 📐 可视化画布 | 拖拽组件、调整结构、嵌套编辑 |
| ⚙️ 属性面板 | 编辑当前组件属性（文本、样式、行为） |
| 🌳 组件层级管理 | 展示组件树，支持选中/嵌套拖动/删除 |
| 💾 项目管理 | 新建、保存、加载 mock 页面 |
| 🧾 代码生成器 | 导出可运行 React + Tailwind 源码 |
| ⏪ 撤销/重做 | 支持编辑状态回滚与前进操作 |

---

## 📱 界面布局

```
┌─────────────────────────────────────────────────────────────┐
│                        工具栏                                │
├──────────┬─────────────────────────────┬────────────────────┤
│          │                             │                    │
│  组件库  │        iPhone 预览          │     属性面板       │
│          │                             │                    │
│  ┌─────┐ │  ┌─────────────────────────┐ │  ┌──────────────┐ │
│  │ 🔤  │ │  │                         │ │  │   组件属性   │ │
│  │ 文本│ │  │                         │ │  │              │ │
│  └─────┘ │  │       iPhone 界面       │ │  │   样式设置   │ │
│          │  │                         │ │  │              │ │
│  ┌─────┐ │  │                         │ │  └──────────────┘ │
│  │ 🔘  │ │  └─────────────────────────┘ │                    │
│  │ 按钮│ │                             │                    │
│  └─────┘ │                             │                    │
├──────────┤                             │                    │
│ 组件树   │                             │                    │
│          │                             │                    │
└──────────┴─────────────────────────────┴────────────────────┘
```

---

## 🚀 快速开始

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **访问应用**
打开浏览器访问 `http://localhost:3000`

---

## 🎨 核心物料组件

- **文本**: 支持富文本编辑
- **按钮**: 可配置样式和点击事件
- **图片**: 支持本地上传和外链
- **输入框**: 多种输入类型支持
- **容器**: 布局容器，支持嵌套
- **列表**: 列表容器
- **卡片**: 卡片布局
- **分割线**: 内容分割
- **间距**: 空白间距

---

## 🎯 Toast 通知系统

我们提供了全局的 Toast 通知系统，通过 `useToast` hook 可以在任何组件中轻松调用。

### 基本用法

```tsx
import { useToast } from '@/components/ui'

function MyComponent() {
  const toast = useToast()

  const handleSuccess = () => {
    toast.success('操作成功！')
  }

  const handleError = () => {
    toast.error('操作失败，请重试')
  }

  const handleLoading = () => {
    toast.loading('正在处理中...')
  }

  return (
    <div>
      <button onClick={handleSuccess}>显示成功</button>
      <button onClick={handleError}>显示错误</button>
      <button onClick={handleLoading}>显示加载</button>
    </div>
  )
}
```

### API 说明

```tsx
const toast = useToast()

// 成功提示（绿色，自动关闭）
toast.success(message: string, duration?: number)

// 错误提示（红色，自动关闭）  
toast.error(message: string, duration?: number)

// 加载提示（蓝色，不自动关闭）
toast.loading(message: string)

// 通用方法
toast.toast(message: string, type?: 'success' | 'error' | 'loading', duration?: number)

// 手动关闭
toast.dismiss(id: string)
```

### 特性

- 🌍 **全局可用**：在任何组件中都可以调用
- 🎨 **自动样式**：success/error/loading 三种类型自动配色
- ⏱️ **智能关闭**：loading 类型不自动关闭，其他类型 3 秒后自动关闭
- 📱 **响应式**：适配移动端显示
- 🔄 **队列管理**：支持多个 Toast 同时显示

---

## 🔧 开发指南

### 添加新组件

1. **确定组件层级**
   - 只在一个页面使用？→ `app/[page]/components/`
   - 跨页面复用且无业务逻辑？→ `components/common/`
   - 用于页面布局？→ `components/layout/`
   - 基础UI组件？→ `components/ui/`

2. **创建组件文件**
   - 在 `types/schema.ts` 中添加组件类型
   - 在 `materials/components/` 中添加组件配置文件
   - 在对应目录创建组件文件
   - 更新索引文件导出

### 导入策略

```typescript
// 页面级组件 - 就近导入
import { Canvas, MaterialPanel } from './components'

// 全局组件 - 分类导入
import { PhoneFrame, DeviceSelector } from '@/components/common'
import { Toolbar } from '@/components/layout'
import { Button, Input } from '@/components/ui'
```

### 架构最佳实践

1. **优先就近原则** - 组件放在最接近使用者的地方
2. **避免过度抽象** - 不要为了复用而强行抽象
3. **保持层级清晰** - 每个层级的组件职责要明确
4. **适时重构** - 随着业务发展，适时调整组件层级

---

## 🎯 设计理念

- **直观性**: 拖拽式操作，降低学习成本
- **专业性**: iPhone真实预览，确保效果准确
- **高效性**: 实时编辑，即时反馈
- **扩展性**: 模块化设计，易于扩展新组件

---

