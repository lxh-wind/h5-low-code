import { Component, Page } from '@/types/schema'

// 样式转换为 TailwindCSS 类名
function styleToTailwind(style: { [key: string]: string } = {}): string {
  const classes: string[] = []
  
  Object.entries(style).forEach(([property, value]) => {
    if (!value || value === '0') return
    
    switch (property) {
      case 'marginTop':
        classes.push(value.includes('px') ? `mt-[${value}]` : `mt-[${value}]`)
        break
      case 'marginRight':
        classes.push(value.includes('px') ? `mr-[${value}]` : `mr-[${value}]`)
        break
      case 'marginBottom':
        classes.push(value.includes('px') ? `mb-[${value}]` : `mb-[${value}]`)
        break
      case 'marginLeft':
        classes.push(value.includes('px') ? `ml-[${value}]` : `ml-[${value}]`)
        break
      case 'paddingTop':
        classes.push(value.includes('px') ? `pt-[${value}]` : `pt-[${value}]`)
        break
      case 'paddingRight':
        classes.push(value.includes('px') ? `pr-[${value}]` : `pr-[${value}]`)
        break
      case 'paddingBottom':
        classes.push(value.includes('px') ? `pb-[${value}]` : `pb-[${value}]`)
        break
      case 'paddingLeft':
        classes.push(value.includes('px') ? `pl-[${value}]` : `pl-[${value}]`)
        break
      case 'width':
        if (value === '100%') classes.push('w-full')
        else classes.push(`w-[${value}]`)
        break
      case 'height':
        if (value === '100%') classes.push('h-full')
        else classes.push(`h-[${value}]`)
        break
      case 'color':
        classes.push(`text-[${value}]`)
        break
      case 'backgroundColor':
        classes.push(`bg-[${value}]`)
        break
      case 'fontSize':
        classes.push(`text-[${value}]`)
        break
      case 'fontWeight':
        if (value === 'bold') classes.push('font-bold')
        else if (value === 'normal') classes.push('font-normal')
        else classes.push(`font-[${value}]`)
        break
    }
  })
  
  return classes.join(' ')
}

// 生成组件代码
function generateComponentCode(component: Component, indent: number = 0): string {
  const { type, props, style, children } = component
  const indentStr = '  '.repeat(indent)
  const tailwindClasses = styleToTailwind(style)
  
  const getBaseClasses = (componentType: string): string => {
    const baseClasses: { [key: string]: string } = {
      text: 'transition-all duration-200',
      button: 'px-4 py-2 rounded transition-all hover:opacity-80',
      image: 'block object-cover',
      input: 'px-3 py-2 border rounded focus:outline-none focus:ring-2',
      container: 'min-h-[50px]',
      card: 'bg-white rounded-lg shadow border',
    }
    return baseClasses[componentType] || ''
  }
  
  const className = [getBaseClasses(type), tailwindClasses].filter(Boolean).join(' ')
  const classNameAttr = className ? ` className="${className}"` : ''
  
  switch (type) {
    case 'text':
      return `${indentStr}<div${classNameAttr}>${props.text || '文本内容'}</div>`
    case 'button':
      return `${indentStr}<button${classNameAttr}>${props.text || '按钮'}</button>`
    case 'image':
      return `${indentStr}<img${classNameAttr} src="${props.src || ''}" alt="${props.alt || '图片'}" />`
    case 'input':
      return `${indentStr}<input${classNameAttr} type="${props.type || 'text'}" placeholder="${props.placeholder || ''}" />`
    default: {
      let childrenCode = ''
      if (children && children.length > 0) {
        childrenCode = '\n' + children.map(child => generateComponentCode(child, indent + 1)).join('\n') + '\n' + indentStr
      }
      return `${indentStr}<div${classNameAttr}>${childrenCode}</div>`
    }
  }
}

// 生成完整的 React 组件代码
export function generateReactCode(page: Page, componentName?: string): string {
  const pageName = componentName || page.name || 'GeneratedPage'
  const safeComponentName = pageName.replace(/[^a-zA-Z0-9]/g, '').replace(/^\d/, 'Page$&')
  
  const componentBody = page.components.map(component => generateComponentCode(component, 2)).join('\n')
  
  // 构建页面样式
  const pageStyle: string[] = []
  if (page.config) {
    const config = page.config
    if (config.backgroundColor) {
      pageStyle.push(`backgroundColor: '${config.backgroundColor}'`)
    }
    if (config.color) {
      pageStyle.push(`color: '${config.color}'`)
    }
    if (config.fontFamily) {
      pageStyle.push(`fontFamily: '${config.fontFamily}'`)
    }
    if (config.fontSize) {
      pageStyle.push(`fontSize: '${config.fontSize}'`)
    }
    if (config.lineHeight) {
      pageStyle.push(`lineHeight: '${config.lineHeight}'`)
    }
    if (config.minHeight) {
      pageStyle.push(`minHeight: '${config.minHeight}'`)
    }
    if (config.padding) {
      pageStyle.push(`padding: '${config.padding}'`)
    }
    if (config.maxWidth) {
      pageStyle.push(`maxWidth: '${config.maxWidth}'`)
    }
  }
  
  const pageStyleStr = pageStyle.length > 0 ? `{${pageStyle.join(', ')}}` : '{}'
  
  // 生成 SEO meta 標籤
  const seoTags: string[] = []
  if (page.seo) {
    const seo = page.seo
    if (seo.keywords) {
      seoTags.push(`        <meta name="keywords" content="${seo.keywords}" />`)
    }
    if (seo.author) {
      seoTags.push(`        <meta name="author" content="${seo.author}" />`)
    }
    if (seo.ogTitle) {
      seoTags.push(`        <meta property="og:title" content="${seo.ogTitle}" />`)
    }
    if (seo.ogDescription) {
      seoTags.push(`        <meta property="og:description" content="${seo.ogDescription}" />`)
    }
    if (seo.ogImage) {
      seoTags.push(`        <meta property="og:image" content="${seo.ogImage}" />`)
    }
  }
  
  const seoHead = seoTags.length > 0 ? `import Head from 'next/head'

` : ''
  
  const seoSection = seoTags.length > 0 ? `      <Head>
        <title>${page.title}</title>
        <meta name="description" content="${page.description || ''}" />
${seoTags.join('\n')}
      </Head>
      ` : ''
  
  return `${seoHead}import React from 'react'

export default function ${safeComponentName}() {
  return (
    <>
      ${seoSection}<div 
        style={${pageStyleStr}}
        className="min-h-screen"
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
${componentBody}
        </div>
      </div>
    </>
  )
}`
}

// 保持向下兼容的舊函數
export function generateReactCodeFromComponents(components: Component[], componentName: string = 'GeneratedPage'): string {
  const mockPage: Page = {
    id: 'temp',
    name: componentName,
    title: componentName,
    description: '',
    components,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  return generateReactCode(mockPage, componentName)
}

// 生成 TailwindCSS 配置建议
export function generateTailwindConfig(): string {
  return `// tailwind.config.js - 移动端 H5 优化配置
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 移动端优化的间距系统
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // 移动端友好的字体大小
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
      // 移动端安全区域
      maxWidth: {
        'mobile': '375px',
        'tablet': '768px',
      },
      // 触摸友好的最小尺寸
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      }
    },
  },
  plugins: [],
}`
} 