import { useMemo } from 'react'

interface StyleObject {
  [key: string]: string | undefined
}

interface TailwindMapping {
  [key: string]: (value: string) => string
}

export function useStyleToTailwind(style: StyleObject = {}) {
  // TailwindCSS 映射规则 - 直接生成任意值类名
  const tailwindMapping: TailwindMapping = useMemo(() => ({
    // 间距映射 - 直接使用任意值语法
    marginTop: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `mt-[${normalizedValue}]`
    },
    
    marginRight: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `mr-[${normalizedValue}]`
    },
    
    marginBottom: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `mb-[${normalizedValue}]`
    },
    
    marginLeft: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `ml-[${normalizedValue}]`
    },
    
    paddingTop: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pt-[${normalizedValue}]`
    },
    
    paddingRight: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pr-[${normalizedValue}]`
    },
    
    paddingBottom: (value: string) => {
      if (!value || value === '0') return ''
      const normalizedValue = value.includes('px') || value.includes('%') || value.includes('rem') || value.includes('em') ? value : `${value}px`
      return `pb-[${normalizedValue}]`
    },
    
    paddingLeft: (value: string) => {
      if (!value || value === '0') return ''
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
  }), [])

  // 转换样式对象为 TailwindCSS 类名
  const tailwindClasses = useMemo(() => {
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
  }, [style, tailwindMapping])

  // 生成 CSS 变量作为备用方案
  const cssVariables = useMemo(() => {
    const vars: { [key: string]: string } = {}
    
    Object.entries(style).forEach(([property, value]) => {
      if (value) {
        // 将 camelCase 转换为 kebab-case
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase()
        vars[`--${cssProperty}`] = value
      }
    })
    
    return vars
  }, [style])

  return {
    // TailwindCSS 类名
    className: tailwindClasses,
    // CSS 变量作为备用方案
    cssVariables,
    // 获取特定属性的 Tailwind 类名
    getPropertyClass: (property: string, value: string) => {
      return tailwindMapping[property]?.(value) || ''
    },
    // 检查是否有有效的样式
    hasStyles: Object.keys(style).some(key => style[key] && style[key] !== '0'),
  }
} 