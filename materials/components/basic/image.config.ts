import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups } from '../../shared/common-styles'

export const imageConfig: ExtendedComponentConfig = {
  id: 'image',
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
  description: '用于显示图片',
  propertyConfig: {
    props: [
      {
        title: '图片',
        key: 'image',
        controls: [
          {
            type: 'url',
            label: '图片地址',
            key: 'src',
            placeholder: '请输入图片URL'
          },
          {
            type: 'text',
            label: '替代文本',
            key: 'alt',
            placeholder: '请输入图片描述'
          }
        ]
      }
    ],
    styles: [
      ...commonStyleGroups,
      {
        title: '图片属性',
        key: 'imageProps',
        controls: [
          {
            type: 'select',
            label: '适应方式',
            key: 'objectFit',
            options: [
              { label: '填充', value: 'fill' },
              { label: '包含', value: 'contain' },
              { label: '覆盖', value: 'cover' },
              { label: '无', value: 'none' },
              { label: '缩小', value: 'scale-down' }
            ]
          }
        ]
      }
    ]
  }
} 