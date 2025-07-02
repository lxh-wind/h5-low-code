import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups, layoutStyleGroups } from '../../shared/common-styles'

export const listConfig: ExtendedComponentConfig = {
  id: 'list',
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
  description: '用于显示列表内容',
  propertyConfig: {
    props: [],
    styles: [
      ...commonStyleGroups,
      ...layoutStyleGroups
    ]
  }
} 