import { ComponentConfig, ComponentType } from '@/types/schema'

export const componentConfigs: Record<ComponentType, ComponentConfig> = {
  text: {
    type: 'text',
    name: '文本',
    icon: '🔤',
    defaultProps: {
      text: '文本内容'
    },
    defaultStyle: {
      fontSize: '14',
      color: '#333333',
      paddingTop: '8',
      paddingRight: '8',
      paddingBottom: '8',
      paddingLeft: '8',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: false,
    description: '用于显示文本内容'
  },
  
  button: {
    type: 'button',
    name: '按钮',
    icon: '🔘',
    defaultProps: {
      text: '按钮'
    },
    defaultStyle: {
      backgroundColor: '#1890ff',
      color: '#ffffff',
      paddingTop: '8',
      paddingRight: '16',
      paddingBottom: '8',
      paddingLeft: '16',
      borderRadius: '4',
      border: 'none',
      fontSize: '14',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: false,
    description: '可点击的按钮组件'
  },
  
  image: {
    type: 'image',
    name: '图片',
    icon: '🖼️',
    defaultProps: {
      src: 'https://img4.yishouapp.com/obs/public_prefix/2025/6/25/12cd92ea3ce549964a2f3d349f2b1651.png',
      alt: '图片'
    },
    defaultStyle: {
      width: '100%',
      height: 'auto',
      borderRadius: '4',
      objectFit: 'cover',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: false,
    description: '用于显示图片'
  },
  
  input: {
    type: 'input',
    name: '输入框',
    icon: '📝',
    defaultProps: {
      placeholder: '请输入内容',
      type: 'text'
    },
    defaultStyle: {
      width: '100%',
      paddingTop: '8',
      paddingRight: '12',
      paddingBottom: '8',
      paddingLeft: '12',
      border: '1px solid #d9d9d9',
      borderRadius: '4',
      fontSize: '14',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: false,
    description: '用于用户输入'
  },
  
  container: {
    type: 'container',
    name: '容器',
    icon: '📦',
    defaultProps: {},
    defaultStyle: {
      paddingTop: '16',
      paddingRight: '16',
      paddingBottom: '16',
      paddingLeft: '16',
      backgroundColor: '#f5f5f5',
      borderRadius: '4',
      display: 'flex',
      flexDirection: 'column',
      gap: '8',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: true,
    description: '用于包含其他组件的容器'
  },
  
  list: {
    type: 'list',
    name: '列表',
    icon: '📋',
    defaultProps: {},
    defaultStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: true,
    description: '用于显示列表内容'
  },
  
  card: {
    type: 'card',
    name: '卡片',
    icon: '🎴',
    defaultProps: {},
    defaultStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #e8e8e8',
      borderRadius: '8',
      paddingTop: '16',
      paddingRight: '16',
      paddingBottom: '16',
      paddingLeft: '16',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: true,
    description: '卡片容器组件'
  },
  
  divider: {
    type: 'divider',
    name: '分割线',
    icon: '➖',
    defaultProps: {},
    defaultStyle: {
      width: '100%',
      height: '1',
      backgroundColor: '#e8e8e8',
      marginTop: '16',
      marginRight: '0',
      marginBottom: '16',
      marginLeft: '0',
    },
    canHaveChildren: false,
    description: '用于分割内容的线条'
  },
  
  space: {
    type: 'space',
    name: '间距',
    icon: '⬜',
    defaultProps: {},
    defaultStyle: {
      width: '100%',
      height: '16',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
    },
    canHaveChildren: false,
    description: '用于增加组件间距'
  }
}

export const getComponentConfig = (type: ComponentType): ComponentConfig => {
  return componentConfigs[type]
}

export const getAllComponentConfigs = (): ComponentConfig[] => {
  return Object.keys(componentConfigs).map(key => componentConfigs[key as ComponentType])
} 