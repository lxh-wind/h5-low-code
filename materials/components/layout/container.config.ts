import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups, layoutStyleGroups } from '../../shared/common-styles'

export const containerConfig: ExtendedComponentConfig = {
  id: 'container',
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
  description: '用于包含其他组件的容器',
  propertyConfig: {
    props: [],
    styles: [
      ...commonStyleGroups,
      ...layoutStyleGroups
    ]
  }
} 