/**
 * 单位转换工具
 * 基于375px设计稿进行响应式转换
 */

export const DESIGN_WIDTH = 375; // 设计稿宽度

/**
 * 将px转换为vw单位
 * @param px - 像素值
 * @returns vw单位字符串
 */
export function pxToVw(px: number): string {
  return `${(px * 100) / DESIGN_WIDTH}vw`;
}

/**
 * 响应式单位转换
 * @param value - 数值
 * @param isPreview - 是否为预览模式
 * @returns 编辑模式返回px，预览模式返回vw
 */
export function convertUnit(value: string | number, isPreview: boolean = false): string {
  if (typeof value !== "number") return value as string;
  
  if (isPreview) {
    // 预览模式：转换为vw单位实现响应式
    return pxToVw(value);
  } else {
    // 编辑模式：保持px单位
    return `${value}px`;
  }
}

/**
 * 转换样式对象中的位置和尺寸单位
 * @param style - 样式对象
 * @returns 转换后的样式对象
 */
export function convertStyleUnits(style: any): any {
  const convertedStyle: any = { ...style };

  if (style.left !== undefined) {
    convertedStyle.left = pxToVw(style.left);
  }
  if (style.top !== undefined) {
    convertedStyle.top = pxToVw(style.top);
  }
  if (style.width !== undefined) {
    convertedStyle.width = pxToVw(style.width);
  }
  if (style.height !== undefined) {
    convertedStyle.height = pxToVw(style.height);
  }

  return convertedStyle;
}

/**
 * 获取响应式字体大小
 * @param fontSize - 字体大小（字符串或数字）
 * @param isPreview - 是否为预览模式
 * @returns 转换后的字体大小
 */
export function getFontSize(fontSize?: string | number, isPreview: boolean = false): string {
  if (!fontSize) return isPreview ? pxToVw(14) : "14px"; // 默认14px
  
  if (typeof fontSize === "number") {
    return convertUnit(fontSize, isPreview);
  }
  
  // 如果是字符串，检查是否需要转换
  const numValue = parseInt(fontSize.replace('px', ''));
  if (!isNaN(numValue)) {
    return convertUnit(numValue, isPreview);
  }
  
  return fontSize;
}