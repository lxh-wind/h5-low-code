import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups } from '../../shared/common-styles'

export const textConfig: ExtendedComponentConfig = {
  id: 'text',
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
  description: '用于显示文本内容',
  propertyConfig: {
    props: [
      {
        title: '内容',
        key: 'content',
        controls: [
          {
            type: 'textarea',
            label: '文本内容',
            key: 'text',
            placeholder: '请输入文本内容'
          }
        ]
      }
    ],
    styles: commonStyleGroups
  }
} 