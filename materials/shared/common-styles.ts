import { PropertyGroup } from '../types'

// 通用样式控件配置
export const commonStyleGroups: PropertyGroup[] = [
  {
    title: '尺寸',
    key: 'size',
    controls: [
      {
        type: 'number',
        label: '宽度',
        key: 'width',
        placeholder: 'auto',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '高度',
        key: 'height',
        placeholder: 'auto',
        min: 0,
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
        placeholder: '0',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '右',
        key: 'marginRight',
        placeholder: '0',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '下',
        key: 'marginBottom',
        placeholder: '0',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '左',
        key: 'marginLeft',
        placeholder: '0',
        min: 0,
        unit: 'px'
      }
    ]
  },
  {
    title: '内边距',
    key: 'padding',
    controls: [
      {
        type: 'number',
        label: '上',
        key: 'paddingTop',
        placeholder: '0',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '右',
        key: 'paddingRight',
        placeholder: '0',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '下',
        key: 'paddingBottom',
        placeholder: '0',
        min: 0,
        unit: 'px'
      },
      {
        type: 'number',
        label: '左',
        key: 'paddingLeft',
        placeholder: '0',
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
        label: '文字颜色',
        key: 'color'
      },
      {
        type: 'color',
        label: '背景颜色',
        key: 'backgroundColor'
      }
    ]
  },
  {
    title: '字体',
    key: 'font',
    controls: [
      {
        type: 'number',
        label: '字体大小',
        key: 'fontSize',
        placeholder: '14',
        min: 1,
        max: 200,
        unit: 'px'
      },
      {
        type: 'select',
        label: '字体粗细',
        key: 'fontWeight',
        options: [
          { label: '正常', value: 'normal' },
          { label: '粗体', value: 'bold' },
          { label: '细体', value: 'lighter' }
        ]
      }
    ]
  },
  {
    title: '边框',
    key: 'border',
    controls: [
      {
        type: 'number',
        label: '边框宽度',
        key: 'borderWidth',
        placeholder: '0',
        min: 0,
        max: 50,
        unit: 'px'
      },
      {
        type: 'select',
        label: '边框样式',
        key: 'borderStyle',
        options: [
          { label: '实线', value: 'solid' },
          { label: '虚线', value: 'dashed' },
          { label: '点线', value: 'dotted' }
        ]
      },
      {
        type: 'color',
        label: '边框颜色',
        key: 'borderColor'
      },
      {
        type: 'number',
        label: '圆角',
        key: 'borderRadius',
        placeholder: '0',
        min: 0,
        max: 100,
        unit: 'px'
      }
    ]
  }
]

// 布局相关样式组
export const layoutStyleGroups: PropertyGroup[] = [
  {
    title: '布局',
    key: 'layout',
    controls: [
      {
        type: 'select',
        label: '显示方式',
        key: 'display',
        options: [
          { label: '块级', value: 'block' },
          { label: '弹性', value: 'flex' },
          { label: '网格', value: 'grid' },
          { label: '隐藏', value: 'none' }
        ]
      },
      {
        type: 'select',
        label: '弹性方向',
        key: 'flexDirection',
        options: [
          { label: '横向', value: 'row' },
          { label: '纵向', value: 'column' }
        ]
      },
      {
        type: 'select',
        label: '主轴对齐',
        key: 'justifyContent',
        options: [
          { label: '开始', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '结束', value: 'flex-end' },
          { label: '空间分布', value: 'space-between' },
          { label: '环绕分布', value: 'space-around' }
        ]
      },
      {
        type: 'select',
        label: '交叉轴对齐',
        key: 'alignItems',
        options: [
          { label: '开始', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '结束', value: 'flex-end' },
          { label: '拉伸', value: 'stretch' }
        ]
      },
      {
        type: 'number',
        label: '间距',
        key: 'gap',
        placeholder: '0',
        min: 0,
        unit: 'px'
      }
    ]
  }
] 