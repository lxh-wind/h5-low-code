import { ExtendedComponentConfig } from '../../types'

export const spaceConfig: ExtendedComponentConfig = {
  id: 'space',
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
  description: '用于增加组件间距',
  propertyConfig: {
    props: [],
    styles: [
      {
        title: '尺寸',
        key: 'size',
        controls: [
          {
            type: 'number',
            label: '宽度',
            key: 'width',
            placeholder: '100%',
            min: 0
          },
          {
            type: 'number',
            label: '高度',
            key: 'height',
            placeholder: '16',
            min: 1,
            unit: 'px'
          }
        ]
      }
    ]
  }
} 