import type { Template } from './types';

export const handwritingTemplate: Template = {
  id: 'handwriting',
  name: '手写风格',
  category: 'handwriting',
  thumbnail: '',
  layout: {
    aspectRatio: '3:4',
    width: 375,
    height: 500,
    textAreas: [
      {
        id: 'title',
        type: 'title',
        position: { x: 36, y: 48 },
        width: 'calc(100% - 72px)',
        defaultText: '手写的温度',
        style: {
          fontFamily: 'Ma Shan Zheng',
          fontSize: 32,
          fontWeight: 400,
          lineHeight: 1.3,
          textAlign: 'center',
        },
      },
      {
        id: 'body',
        type: 'body',
        position: { x: 36, y: 120 },
        width: 'calc(100% - 72px)',
        defaultText: '在这个数字化的时代，手写的文字依然有着不可替代的温度。每一笔每一画，都承载着书写者的心意。',
        style: {
          fontFamily: 'ZCOOL XiaoWei',
          fontSize: 18,
          fontWeight: 400,
          lineHeight: 2,
          textAlign: 'left',
        },
      },
    ],
  },
  defaultContent: {
    title: '手写的温度',
    body: '在这个数字化的时代，手写的文字依然有着不可替代的温度。每一笔每一画，都承载着书写者的心意。',
  },
  style: {
    fontFamily: 'ZCOOL XiaoWei',
    fontSize: 18,
    fontSizeScale: 1,
    lineHeight: 2,
    lineHeightOffset: 0,
    padding: 36,
    backgroundColor: '#fef9c3',
    textColor: '#374151',
  },
  elementDefaults: {
    icon: false,
    icon2: false,
    date: false,
    author: true,
    count: false,
    qrcode: false,
    page: false,
    watermark: true,
  },
};
