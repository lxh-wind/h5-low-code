import { Component, Page, Project } from '@/types/schema'

// 示例组件数据
export const mockComponents: Component[] = [
  {
    id: 'comp_1',
    type: 'text',
    name: '标题文本',
    props: {
      text: '欢迎使用H5低代码编辑器'
    },
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333333',
      textAlign: 'center',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: '0px',
      marginRight: '0px',
    }
  },
  {
    id: 'comp_2',
    type: 'button',
    name: '主要按钮',
    props: {
      text: '开始体验'
    },
    style: {
      backgroundColor: '#1890ff',
      color: '#ffffff',
      paddingTop: '12px',
      paddingBottom: '12px',
      paddingLeft: '24px',
      paddingRight: '24px',
      borderRadius: '6px',
      fontSize: '16px',
      marginTop: '20px',
      marginBottom: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
      width: '200px'
    }
  }
]

// 示例页面数据
export const mockPage: Page = {
  id: 'page_1',
  name: '首页',
  title: '示例页面',
  description: '这是一个示例页面',
  config: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333333'
  },
  seo: {
    keywords: 'H5, 低代码, 编辑器',
    author: 'H5 Editor',
    ogTitle: '示例页面',
    ogDescription: '这是一个H5低代码编辑器生成的示例页面'
  },
  components: mockComponents,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z')
}

// 示例项目数据
export const mockProject: Project = {
  id: 'project_1',
  name: '示例项目',
  description: 'H5低代码编辑器示例项目',
  pages: [mockPage],
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z')
}

// 初始化编辑器数据
export function initializeEditor() {
  return {
    project: mockProject,
    page: mockPage,
    components: mockComponents
  }
} 