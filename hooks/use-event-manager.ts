"use client"

import { useState, useCallback, useRef } from "react"
import type { EventConfig, EventAction } from "@/types/event-types"

interface ComponentEvents {
  [componentId: string]: EventConfig[]
}

export function useEventManager() {
  const [componentEvents, setComponentEvents] = useState<ComponentEvents>({})
  const eventTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // 为组件添加事件
  const addEventToComponent = useCallback((componentId: string, eventConfig: EventConfig) => {
    setComponentEvents((prev) => ({
      ...prev,
      [componentId]: [...(prev[componentId] || []), eventConfig],
    }))
  }, [])

  // 更新组件事件
  const updateComponentEvent = useCallback((componentId: string, eventId: string, updates: Partial<EventConfig>) => {
    setComponentEvents((prev) => ({
      ...prev,
      [componentId]: (prev[componentId] || []).map((event) =>
        event.id === eventId ? { ...event, ...updates } : event,
      ),
    }))
  }, [])

  // 删除组件事件
  const removeEventFromComponent = useCallback((componentId: string, eventId: string) => {
    setComponentEvents((prev) => ({
      ...prev,
      [componentId]: (prev[componentId] || []).filter((event) => event.id !== eventId),
    }))
  }, [])

  // 获取组件事件
  const getComponentEvents = useCallback(
    (componentId: string) => {
      return componentEvents[componentId] || []
    },
    [componentEvents],
  )

  // 执行事件动作
  const executeEventAction = useCallback(async (action: EventAction, context?: any) => {
    if (!action.enabled) return

    const executeAction = () => {
      try {
        switch (action.type) {
          case "navigate":
            if (action.config.url) {
              if (action.config.newTab) {
                window.open(action.config.url, "_blank")
              } else {
                window.location.href = action.config.url
              }
            }
            break

          case "showModal":
            if (action.config.message) {
              alert(action.config.message)
            }
            break

          case "copyText":
            if (action.config.text && navigator.clipboard) {
              navigator.clipboard.writeText(action.config.text)
              console.log("文本已复制:", action.config.text)
            }
            break

          case "showMessage":
            if (action.config.message) {
              // 创建临时消息提示
              const messageDiv = document.createElement("div")
              messageDiv.textContent = action.config.message
              messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                z-index: 9999;
                font-size: 14px;
              `
              document.body.appendChild(messageDiv)

              setTimeout(() => {
                if (messageDiv.parentNode) {
                  messageDiv.parentNode.removeChild(messageDiv)
                }
              }, action.config.duration || 3000)
            }
            break

          case "executeScript":
            if (action.config.script) {
              // 安全执行JavaScript代码
              try {
                const func = new Function("context", action.config.script)
                func(context)
              } catch (error) {
                console.error("脚本执行错误:", error)
              }
            }
            break

          case "sendRequest":
            if (action.config.url) {
              fetch(action.config.url, {
                method: action.config.method || "GET",
                headers: action.config.headers || {},
                body: action.config.body ? JSON.stringify(action.config.body) : undefined,
              })
                .then((response) => response.json())
                .then((data) => console.log("请求结果:", data))
                .catch((error) => console.error("请求失败:", error))
            }
            break

          case "toggleElement":
            if (action.config.targetId) {
              const targetElement = document.getElementById(action.config.targetId)
              if (targetElement) {
                targetElement.style.display = targetElement.style.display === "none" ? "" : "none"
              }
            }
            break

          case "playAnimation":
            if (action.config.animationClass && action.config.targetId) {
              const targetElement = document.getElementById(action.config.targetId)
              if (targetElement) {
                targetElement.classList.add(action.config.animationClass)
                setTimeout(() => {
                  targetElement.classList.remove(action.config.animationClass)
                }, action.config.duration || 1000)
              }
            }
            break

          default:
            console.warn("未知的事件动作类型:", action.type)
        }
      } catch (error) {
        console.error("事件动作执行失败:", error)
      }
    }

    // 如果有延迟，则延迟执行
    if (action.delay && action.delay > 0) {
      const timerId = setTimeout(executeAction, action.delay)
      eventTimers.current.set(action.id, timerId)
    } else {
      executeAction()
    }
  }, [])

  // 执行组件事件
  const executeComponentEvent = useCallback(
    (componentId: string, eventType: string, nativeEvent?: Event, events?: EventConfig[]) => {
      // 使用传入的 events 或从状态中获取
      const componentEventList = events || componentEvents[componentId] || []
      const targetEvent = componentEventList.find((event) => event.type === eventType && event.enabled)

      if (targetEvent) {
        targetEvent.actions.forEach((action) => {
          executeEventAction(action, { componentId, eventType, nativeEvent })
        })
      }
    },
    [componentEvents, executeEventAction],
  )

  // 清理所有定时器
  const clearAllTimers = useCallback(() => {
    eventTimers.current.forEach((timer) => clearTimeout(timer))
    eventTimers.current.clear()
  }, [])

  return {
    componentEvents,
    addEventToComponent,
    updateComponentEvent,
    removeEventFromComponent,
    getComponentEvents,
    executeComponentEvent,
    executeEventAction,
    clearAllTimers,
  }
}