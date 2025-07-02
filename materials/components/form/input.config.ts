import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups } from '../../shared/common-styles'

export const inputConfig: ExtendedComponentConfig = {
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
  description: '用于用户输入',
  propertyConfig: {
    props: [
      {
        title: '输入框',
        key: 'input',
        controls: [
          {
            type: 'text',
            label: '占位符',
            key: 'placeholder',
            placeholder: '请输入占位符文本'
          },
          {
            type: 'select',
            label: '输入类型',
            key: 'type',
            options: [
              { label: '文本', value: 'text' },
              { label: '密码', value: 'password' },
              { label: '邮箱', value: 'email' },
              { label: '数字', value: 'number' },
              { label: '电话', value: 'tel' }
            ]
          }
        ]
      }
    ],
    styles: commonStyleGroups
  }
} 