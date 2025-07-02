import { ExtendedComponentConfig } from '../../types'

export const dividerConfig: ExtendedComponentConfig = {
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
  description: '用于分割内容的线条',
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
            placeholder: '1',
            min: 1,
            unit: 'px'
          }
        ]
      },
      {
        title: '外边距',
        key: 'margin',
        controls: [
          {
            type: 'number',
            label: '上',
            key: 'marginTop',
            placeholder: '16',
            min: 0,
            unit: 'px'
          },
          {
            type: 'number',
            label: '下',
            key: 'marginBottom',
            placeholder: '16',
            min: 0,
            unit: 'px'
          }
        ]
      },
      {
        title: '颜色',
        key: 'color',
        controls: [
          {
            type: 'color',
            label: '背景颜色',
            key: 'backgroundColor'
          }
        ]
      }
    ]
  }
} 