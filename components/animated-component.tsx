"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import classNames from "classnames"
import type { ComponentData } from "@/store/editor"

interface AnimatedComponentProps {
  component: ComponentData
  children: React.ReactNode
  isPreview?: boolean
}

// 常量定义
const ANIMATE_BASE_CLASS = 'animate__animated'
const ANIMATE_INFINITE_CLASS = 'animate__infinite'
const INTERSECTION_THRESHOLD = 0.1

// 动画类名映射
const ENTRANCE_ANIMATIONS = {
  fadeIn: 'animate__fadeIn',
  slideInUp: 'animate__slideInUp',
  slideInDown: 'animate__slideInDown',
  slideInLeft: 'animate__slideInLeft',
  slideInRight: 'animate__slideInRight',
  zoomIn: 'animate__zoomIn',
  bounceIn: 'animate__bounceIn',
  rotateIn: 'animate__rotateIn',
  flipInX: 'animate__flipInX',
  flipInY: 'animate__flipInY',
} as const

const HOVER_ANIMATIONS = {
  pulse: 'animate__pulse',
  heartBeat: 'animate__heartBeat',
  wobble: 'animate__wobble',
} as const

const CLICK_ANIMATIONS = {
  bounce: 'animate__bounce',
  pulse: 'animate__pulse',
  heartBeat: 'animate__heartBeat',
  flash: 'animate__flash',
  rubberBand: 'animate__rubberBand',
} as const

export function AnimatedComponent({ component, children, isPreview = false }: AnimatedComponentProps) {
  // 编辑模式下始终可见，预览模式下根据动画配置决定
  const [isVisible, setIsVisible] = useState(!isPreview)
  const [isClicked, setIsClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  const animations = useMemo(() => component.animations || {}, [component.animations])

  // 进入动画的观察器 - 只在预览模式下生效
  useEffect(() => {
    // 编辑模式下直接显示，不需要进入动画
    if (!isPreview) {
      setIsVisible(true)
      return
    }

    if (!animations.entrance?.type || animations.entrance.type === "none") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = (animations.entrance?.delay || 0) * 1000
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: INTERSECTION_THRESHOLD },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [animations.entrance, isPreview])

  // 点击动画处理
  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) return // 编辑模式下不触发点击动画

    if (animations.click?.type && animations.click.type !== "none") {
      setIsClicked(true)
      const duration = (animations.click.duration || 0.6) * 1000
      setTimeout(() => {
        setIsClicked(false)
      }, duration)
    }
  }

  // 悬停处理
  const handleMouseEnter = () => {
    if (isPreview && animations.hover?.type && animations.hover.type !== "none") {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (isPreview) {
      setIsHovered(false)
    }
  }

  const animationClasses = useMemo(() => {
    const classes = []

    // 进入动画 - 只在预览模式下应用
    if (isPreview && animations.entrance?.type && animations.entrance.type !== "none" && isVisible) {
      classes.push(ANIMATE_BASE_CLASS)
      const animationClass = ENTRANCE_ANIMATIONS[animations.entrance.type as keyof typeof ENTRANCE_ANIMATIONS]
      if (animationClass) {
        classes.push(animationClass)
      }
    }

    // 悬停动画 - 使用 Animate.css 无限循环动画
    if (isHovered && animations.hover?.type && animations.hover.type !== "none") {
      const animationClass = HOVER_ANIMATIONS[animations.hover.type as keyof typeof HOVER_ANIMATIONS]
      if (animationClass) {
        classes.push(ANIMATE_BASE_CLASS, ANIMATE_INFINITE_CLASS, animationClass)
      }
      // 对于 scale, rotate, translateY 等自定义效果，仍使用CSS transitions
    }

    // 点击动画 - 使用 Animate.css
    if (isClicked && animations.click?.type && animations.click.type !== "none") {
      classes.push(ANIMATE_BASE_CLASS)
      const animationClass = CLICK_ANIMATIONS[animations.click.type as keyof typeof CLICK_ANIMATIONS]
      if (animationClass) {
        classes.push(animationClass)
      }
    }

    return classes.join(' ')
  }, [isPreview, animations, isVisible, isHovered, isClicked])

  // 获取CSS变量样式
  const animationStyles = useMemo(() => {
    const styles: React.CSSProperties & Record<string, any> = {}

    // 设置动画持续时间
    if (animations.entrance?.duration) {
      styles['--animate-duration'] = `${animations.entrance.duration}s`
    }

    // 设置动画延迟
    if (animations.entrance?.delay) {
      styles['--animate-delay'] = `${animations.entrance.delay}s`
    }

    // 悬停动画 - 对于自定义效果使用CSS transitions
    if (isHovered && animations.hover?.type && animations.hover.type !== "none") {
      // 只对非Animate.css动画使用CSS transitions
      if (!(animations.hover.type in HOVER_ANIMATIONS)) {
        const duration = animations.hover.duration || 0.3
        styles.transition = `all ${duration}s ease`

        const transforms = []
        if (animations.hover.scale) {
          transforms.push(`scale(${animations.hover.scale})`)
        }
        if (animations.hover.rotate) {
          transforms.push(`rotate(${animations.hover.rotate}deg)`)
        }
        if (animations.hover.translateX) {
          transforms.push(`translateX(${animations.hover.translateX}px)`)
        }
        if (animations.hover.translateY) {
          transforms.push(`translateY(${animations.hover.translateY}px)`)
        }

        if (transforms.length > 0) {
          styles.transform = transforms.join(" ")
        }
      } else {
        // 为Animate.css动画设置持续时间
        if (animations.hover.duration) {
          styles['--animate-duration'] = `${animations.hover.duration}s`
        }
      }
    }

    // 点击动画的持续时间设置
    if (isClicked && animations.click?.type && animations.click.type !== "none") {
      if (animations.click.duration) {
        styles['--animate-duration'] = `${animations.click.duration}s`
      }
    }

    return styles
  }, [animations, isHovered, isClicked])

  return (
    <div
      ref={elementRef}
      className={classNames(animationClasses, "w-full h-full")}
      style={useMemo(() => ({
        ...animationStyles,
        // 编辑模式下确保组件始终可见
        ...((!isPreview && animations.entrance?.type && animations.entrance.type !== "none") ? {
          visibility: 'visible' as const,
          opacity: 1
        } : {})
      }), [animationStyles, isPreview, animations.entrance?.type])}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}