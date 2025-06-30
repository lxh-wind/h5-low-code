import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Style } from '@/types/schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 将样式对象转换为CSS字符串
export function styleToCSS(style: Style): string {
  const cssRules: string[] = []
  
  Object.entries(style).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // 将驼峰命名转换为CSS属性名
      const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      cssRules.push(`${cssProperty}: ${value}`)
    }
  })
  
  return cssRules.join('; ')
}

// 将CSS字符串转换为样式对象
export function cssToStyle(css: string): Record<string, string> {
  const style: Record<string, string> = {}
  
  css.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim())
    if (property && value) {
      // 将CSS属性名转换为驼峰命名
      const camelProperty: string = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      style[camelProperty] = value
    }
  })
  
  return style
}

// 生成唯一ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 深拷贝对象
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

// 防抖函数
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

// 检查是否为有效的URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 颜色工具函数
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// 获取对比色
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  
  // 计算亮度
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

interface StyleObject {
  [key: string]: string | undefined
}

interface TailwindMapping {
  [key: string]: (value: string) => string
}

// 独立的样式转换函数（从 useStyleToTailwind hook 提取）
export function styleToTailwind(style: StyleObject = {}): string {
  // TailwindCSS 映射规则 - 直接生成任意值类名
  const tailwindMapping: TailwindMapping = {
    // 间距映射 - 直接使用任意值语法
    marginTop: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'mt-0'
      // 常见值映射
      const commonValues: { [key: string]: string } = {
        '4px': 'mt-1', '8px': 'mt-2', '12px': 'mt-3', '16px': 'mt-4',
        '20px': 'mt-5', '24px': 'mt-6', '32px': 'mt-8', '48px': 'mt-12',
        '64px': 'mt-16', '1rem': 'mt-4', '1.5rem': 'mt-6', '2rem': 'mt-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `mt-[${normalizedValue}]`
    },
    
    marginRight: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'mr-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'mr-1', '8px': 'mr-2', '12px': 'mr-3', '16px': 'mr-4',
        '20px': 'mr-5', '24px': 'mr-6', '32px': 'mr-8', '48px': 'mr-12',
        '64px': 'mr-16', '1rem': 'mr-4', '1.5rem': 'mr-6', '2rem': 'mr-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `mr-[${normalizedValue}]`
    },
    
    marginBottom: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'mb-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'mb-1', '8px': 'mb-2', '12px': 'mb-3', '16px': 'mb-4',
        '20px': 'mb-5', '24px': 'mb-6', '32px': 'mb-8', '48px': 'mb-12',
        '64px': 'mb-16', '1rem': 'mb-4', '1.5rem': 'mb-6', '2rem': 'mb-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `mb-[${normalizedValue}]`
    },
    
    marginLeft: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'ml-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'ml-1', '8px': 'ml-2', '12px': 'ml-3', '16px': 'ml-4',
        '20px': 'ml-5', '24px': 'ml-6', '32px': 'ml-8', '48px': 'ml-12',
        '64px': 'ml-16', '1rem': 'ml-4', '1.5rem': 'ml-6', '2rem': 'ml-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `ml-[${normalizedValue}]`
    },
    
    paddingTop: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'pt-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'pt-1', '8px': 'pt-2', '12px': 'pt-3', '16px': 'pt-4',
        '20px': 'pt-5', '24px': 'pt-6', '32px': 'pt-8', '48px': 'pt-12',
        '64px': 'pt-16', '1rem': 'pt-4', '1.5rem': 'pt-6', '2rem': 'pt-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pt-[${normalizedValue}]`
    },
    
    paddingRight: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'pr-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'pr-1', '8px': 'pr-2', '12px': 'pr-3', '16px': 'pr-4',
        '20px': 'pr-5', '24px': 'pr-6', '32px': 'pr-8', '48px': 'pr-12',
        '64px': 'pr-16', '1rem': 'pr-4', '1.5rem': 'pr-6', '2rem': 'pr-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pr-[${normalizedValue}]`
    },
    
    paddingBottom: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'pb-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'pb-1', '8px': 'pb-2', '12px': 'pb-3', '16px': 'pb-4',
        '20px': 'pb-5', '24px': 'pb-6', '32px': 'pb-8', '48px': 'pb-12',
        '64px': 'pb-16', '1rem': 'pb-4', '1.5rem': 'pb-6', '2rem': 'pb-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pb-[${normalizedValue}]`
    },
    
    paddingLeft: (value: string) => {
      if (!value || value === '0' || value === '0px') return 'pl-0'
      const commonValues: { [key: string]: string } = {
        '4px': 'pl-1', '8px': 'pl-2', '12px': 'pl-3', '16px': 'pl-4',
        '20px': 'pl-5', '24px': 'pl-6', '32px': 'pl-8', '48px': 'pl-12',
        '64px': 'pl-16', '1rem': 'pl-4', '1.5rem': 'pl-6', '2rem': 'pl-8'
      }
      if (commonValues[value]) return commonValues[value]
      
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pl-[${normalizedValue}]`
    },
    
    // 尺寸映射
    width: (value: string) => {
      if (!value || value === 'auto') return 'w-auto'
      if (value === '100%') return 'w-full'
      if (value === '50%') return 'w-1/2'
      if (value === '33.333333%') return 'w-1/3'
      if (value === '25%') return 'w-1/4'
      return `w-[${value}]`
    },
    
    height: (value: string) => {
      if (!value || value === 'auto') return 'h-auto'
      if (value === '100%') return 'h-full'
      if (value === '100vh') return 'h-screen'
      return `h-[${value}]`
    },
    
    // 颜色映射
    color: (value: string) => {
      if (!value) return ''
      return `text-[${value}]`
    },
    
    backgroundColor: (value: string) => {
      if (!value) return ''
      return `bg-[${value}]`
    },
    
    // 字体映射
    fontSize: (value: string) => {
      if (!value) return ''
      return `text-[${value}]`
    },
    
    fontWeight: (value: string) => {
      if (!value || value === 'normal') return 'font-normal'
      if (value === 'bold') return 'font-bold'
      return `font-[${value}]`
    },
    
    // 边框映射
    borderWidth: (value: string) => {
      if (!value || value === '0') return ''
      return `border-[${value}]`
    },
    
    borderStyle: (value: string) => {
      if (!value || value === 'solid') return ''
      const borderStyleMap: { [key: string]: string } = {
        'dashed': 'border-dashed',
        'dotted': 'border-dotted',
        'double': 'border-double',
        'none': 'border-none',
      }
      return borderStyleMap[value] || ''
    },
    
    borderColor: (value: string) => {
      if (!value) return ''
      return `border-[${value}]`
    },
    
    borderRadius: (value: string) => {
      if (!value || value === '0') return ''
      return `rounded-[${value}]`
    },
    
    // 显示和定位
    display: (value: string) => {
      const displayMap: { [key: string]: string } = {
        'block': 'block',
        'inline': 'inline',
        'inline-block': 'inline-block',
        'flex': 'flex',
        'inline-flex': 'inline-flex',
        'grid': 'grid',
        'none': 'hidden',
      }
      return displayMap[value] || ''
    },
    
    position: (value: string) => {
      const positionMap: { [key: string]: string } = {
        'static': 'static',
        'relative': 'relative',
        'absolute': 'absolute',
        'fixed': 'fixed',
        'sticky': 'sticky',
      }
      return positionMap[value] || ''
    },
  }

  // 转换样式对象为 TailwindCSS 类名
  const classes: string[] = []
  
  Object.entries(style).forEach(([property, value]) => {
    if (value && tailwindMapping[property]) {
      const tailwindClass = tailwindMapping[property](value)
      if (tailwindClass) {
        classes.push(tailwindClass)
      }
    }
  })
  
  return classes.filter(Boolean).join(' ')
} 