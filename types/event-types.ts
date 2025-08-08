/**
 * 事件类型定义
 */

// 事件触发类型
export type EventType = 'click' | 'dblclick' | 'mousedown' | 'mouseup' | 'mouseover' | 'mouseout' | 'touchstart' | 'touchend' | 'longpress'

// 事件动作类型
export type EventActionType = 'navigate' | 'showModal' | 'hideModal' | 'showToast' | 'executeScript' | 'sendRequest' | 'toggleElement' | 'playAnimation' | 'custom'

// 事件动作配置
export interface EventAction {
  id: string
  type: EventActionType
  name: string
  config: Record<string, any> // 动作具体配置
  enabled: boolean
  delay?: number // 延迟执行时间(毫秒)
}

// 事件配置
export interface EventConfig {
  id: string
  type: EventType // 改为与实际使用一致的 type
  name: string
  actions: EventAction[] // 改为 actions 数组
  enabled: boolean
  description?: string
}

// 事件执行结果
export interface EventExecutionResult {
  success: boolean
  error?: string
  data?: any
}

// 事件执行上下文
export interface EventContext {
  componentId: string
  eventType: string
  nativeEvent?: Event
  target?: HTMLElement
  component?: any
  event?: any
}