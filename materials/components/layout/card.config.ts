import { ExtendedComponentConfig } from '../../types'
import { commonStyleGroups } from '../../shared/common-styles'

export const cardConfig: ExtendedComponentConfig = {
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
  description: '卡片容器组件',
  propertyConfig: {
    props: [],
    styles: commonStyleGroups
  }
} 