import type { Template } from './types';

export const iphoneNoteTemplate: Template = {
  id: 'iphone-note',
  name: 'iPhone备忘录',
  category: 'note',
  thumbnail: '',
  layout: {
    aspectRatio: '9:16',
    width: 390,
    height: 844,
    textAreas: [
      {
        id: 'title',
        type: 'title',
        position: { x: 24, y: 146 },
        width: 'calc(100% - 48px)',
        defaultText: '产品迭代清单',
        style: {
          fontFamily: 'system-ui',
          fontSize: 35,
          fontWeight: 700,
          lineHeight: 1.08,
          textAlign: 'left',
          color: '#111111',
        },
      },
      {
        id: 'date',
        type: 'subtitle',
        position: { x: 24, y: 204 },
        width: 'calc(100% - 48px)',
        defaultText: '2026年3月11日 09:41',
        style: {
          fontFamily: 'system-ui',
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.35,
          textAlign: 'left',
          color: '#8e8e93',
        },
      },
      {
        id: 'body',
        type: 'body',
        position: { x: 24, y: 244 },
        width: 'calc(100% - 48px)',
        defaultText:
          '今天确认 3 个版本内必须落地的内容：\n\n○ 完成首页信息流重构走查\n○ 同步 iOS 空状态插画与动效稿\n○ 确认发版窗口、回滚方案和负责人\n\n设计侧已经补齐了组件标注，开发侧只剩两个交互边界需要最终确认。\n\n备注：中午前和客户端再过一遍手势返回逻辑。',
        style: {
          fontFamily: 'system-ui',
          fontSize: 21,
          fontWeight: 400,
          lineHeight: 1.48,
          textAlign: 'left',
          color: '#111111',
        },
      },
    ],
  },
  defaultContent: {
    title: '产品迭代清单',
    date: '2026年3月11日 09:41',
    body:
      '今天确认 3 个版本内必须落地的内容：\n\n○ 完成首页信息流重构走查\n○ 同步 iOS 空状态插画与动效稿\n○ 确认发版窗口、回滚方案和负责人\n\n设计侧已经补齐了组件标注，开发侧只剩两个交互边界需要最终确认。\n\n备注：中午前和客户端再过一遍手势返回逻辑。',
  },
  style: {
    fontFamily: 'system-ui',
    fontSize: 21,
    fontSizeScale: 1,
    lineHeight: 1.48,
    lineHeightOffset: 0,
    padding: 24,
    backgroundColor: '#fffef7',
    textColor: '#111111',
  },
  elementDefaults: {
    icon: true,
    icon2: true,
    date: true,
    author: false,
    count: false,
    qrcode: false,
    page: false,
    watermark: true,
  },
};
