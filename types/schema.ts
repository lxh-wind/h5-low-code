import { z } from 'zod'
import type { EventConfig } from './event-types'

// 基础组件类型
export const ComponentTypes = [
  'text',
  'button', 
  'image',
  'input',
  'container',
  'list',
  'card',
  'divider',
  'space'
] as const

export type ComponentType = typeof ComponentTypes[number]

// 样式属性schema
export const StyleSchema = z.object({
  width: z.string().optional(),
  height: z.string().optional(),
  // 定位
  position: z.string().optional(),
  top: z.string().optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  bottom: z.string().optional(),
  zIndex: z.string().optional(),
  // 外边距
  margin: z.string().optional(),
  marginTop: z.string().optional(),
  marginRight: z.string().optional(),
  marginBottom: z.string().optional(),
  marginLeft: z.string().optional(),
  // 内边距
  padding: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingRight: z.string().optional(),
  paddingBottom: z.string().optional(),
  paddingLeft: z.string().optional(),
  // 颜色
  backgroundColor: z.string().optional(),
  color: z.string().optional(),
  // 字体
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  // 边框
  border: z.string().optional(),
  borderWidth: z.string().optional(),
  borderStyle: z.string().optional(),
  borderColor: z.string().optional(),
  borderRadius: z.string().optional(),
  // 阴影
  boxShadow: z.string().optional(),
  // 布局
  display: z.string().optional(),
  flexDirection: z.enum(['row', 'column']).optional(),
  justifyContent: z.enum(['flex-start', 'center', 'flex-end', 'space-between', 'space-around']).optional(),
  alignItems: z.enum(['flex-start', 'center', 'flex-end', 'stretch']).optional(),
  gap: z.string().optional(),
  // 图片
  objectFit: z.enum(['fill', 'contain', 'cover', 'none', 'scale-down']).optional(),
})

// 组件属性schema
export const ComponentPropsSchema = z.object({
  text: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  placeholder: z.string().optional(),
  value: z.string().optional(),
  href: z.string().optional(),
  target: z.enum(['_self', '_blank']).optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  type: z.string().optional(),
})

// 动画配置类型
export interface AnimationConfig {
  entrance?: {
    type: string
    duration: number
    delay: number
    easing: string
  }
  hover?: {
    type: string
    duration: number
    scale?: number
    rotate?: number
    translateX?: number
    translateY?: number
  }
  click?: {
    type: string
    duration: number
    scale?: number
    rotate?: number
  }
}

// 先定义基础类型
export type Style = z.infer<typeof StyleSchema>
export type ComponentProps = z.infer<typeof ComponentPropsSchema>

// 定义组件类型（递归类型）
export interface Component {
  id: string
  type: ComponentType
  name: string
  props: ComponentProps
  style: Style
  className?: string // 新增：预编译的 TailwindCSS 类名
  events?: EventConfig[] // 新增：事件配置
  animations?: AnimationConfig // 新增：动画配置
  children?: Component[]
  parentId?: string
}

// 组件schema
export const ComponentSchema: z.ZodType<Component> = z.lazy(() => z.object({
  id: z.string(),
  type: z.enum(ComponentTypes),
  name: z.string(),
  props: ComponentPropsSchema,
  style: StyleSchema,
  className: z.string().optional(),
  children: z.array(ComponentSchema).optional(),
  parentId: z.string().optional(),
}))

// 页面配置schema
export const PageConfigSchema = z.object({
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  minHeight: z.string().optional(),
  padding: z.string().optional(),
  paddingTop: z.string().optional(),
  paddingBottom: z.string().optional(),
  paddingLeft: z.string().optional(),
  paddingRight: z.string().optional(),
  maxWidth: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  lineHeight: z.string().optional(),
  color: z.string().optional(),
})

// 页面SEO schema
export const PageSEOSchema = z.object({
  keywords: z.string().optional(),
  author: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
})

// 页面schema
export const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string().optional(),
  config: PageConfigSchema.optional(),
  seo: PageSEOSchema.optional(),
  components: z.array(ComponentSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// 项目schema
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  pages: z.array(PageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// 导出类型
export type PageConfig = z.infer<typeof PageConfigSchema>
export type PageSEO = z.infer<typeof PageSEOSchema>
export type Page = z.infer<typeof PageSchema>
export type Project = z.infer<typeof ProjectSchema>

// 组件配置接口
export interface ComponentConfig {
  id: string // 添加唯一標識符
  type: ComponentType
  name: string
  icon: string
  category?: string // 组件分类
  defaultProps: ComponentProps
  defaultStyle: Style
  canHaveChildren: boolean
  description: string
}

// 拖拽数据接口
export interface DragData {
  type: 'component' | 'existing'
  componentType?: ComponentType
  componentId?: string
  component?: Component
} 