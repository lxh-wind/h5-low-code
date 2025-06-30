/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './materials/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // 动态生成的任意值类名 - 修复正则表达式
    {
      pattern: /^m[trbl]?-\[[\d.]+(?:px|rem|em|%)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^p[trbl]?-\[[\d.]+(?:px|rem|em|%)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^w-\[[\d.]+(?:px|rem|em|%|vw|vh)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^h-\[[\d.]+(?:px|rem|em|%|vw|vh)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^(?:min-|max-)?[wh]-\[[\d.]+(?:px|rem|em|%|vw|vh)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^(?:bg|text|border)-\[#[0-9a-fA-F]{3,6}\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^text-\[[\d.]+(?:px|rem|em)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^border(?:-[trbl])?-\[[\d.]+(?:px|rem|em)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /^rounded(?:-[trbl])?-\[[\d.]+(?:px|rem|em)\]$/,
      variants: ['hover', 'focus', 'active']
    },
    // 常用的固定类名
    'mt-0', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6', 'mt-8', 'mt-12', 'mt-16',
    'mr-0', 'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-6', 'mr-8', 'mr-12', 'mr-16',
    'mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mb-12', 'mb-16',
    'ml-0', 'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-8', 'ml-12', 'ml-16',
    'pt-0', 'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6', 'pt-8', 'pt-12', 'pt-16',
    'pr-0', 'pr-1', 'pr-2', 'pr-3', 'pr-4', 'pr-5', 'pr-6', 'pr-8', 'pr-12', 'pr-16',
    'pb-0', 'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-8', 'pb-12', 'pb-16',
    'pl-0', 'pl-1', 'pl-2', 'pl-3', 'pl-4', 'pl-5', 'pl-6', 'pl-8', 'pl-12', 'pl-16',
    // 尺寸类名
    'w-auto', 'w-full', 'w-1/2', 'w-1/3', 'w-1/4',
    'h-auto', 'h-full', 'h-screen',
    // 字体类名
    'font-normal', 'font-bold',
    // 边框类名
    'border-solid', 'border-dashed', 'border-dotted', 'border-none',
    // 显示类名
    'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden',
    // 定位类名
    'static', 'relative', 'absolute', 'fixed', 'sticky',
    // 过渡类名
    'transition-all', 'duration-200',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        'mobile': '375px',
        'iphone': '390px',
      },
      width: {
        'iphone': '390px',
      },
      height: {
        'iphone': '844px',
      }
    },
  },
  plugins: [],
} 