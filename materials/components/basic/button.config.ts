import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups } from '../../shared/common-styles'

export const buttonConfig: ExtendedComponentConfig = {
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
  description: '可点击的按钮组件',
  propertyConfig: {
    props: [
      {
        title: '内容',
        key: 'content',
        controls: [
          {
            type: 'text',
            label: '按钮文字',
            key: 'text',
            placeholder: '请输入按钮文字'
          }
        ]
      },
      {
        title: '状态',
        key: 'state',
        controls: [
          {
            type: 'switch',
            label: '禁用状态',
            key: 'disabled'
          }
        ]
      }
    ],
    styles: commonStyleGroups
  }
} 