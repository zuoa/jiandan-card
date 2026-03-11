import type { Template } from './types';

export const quoteTemplate: Template = {
  id: 'quote',
  name: '金句语录',
  category: 'quote',
  thumbnail: '',
  layout: {
    aspectRatio: '1:1',
    width: 400,
    height: 400,
    textAreas: [
      {
        id: 'quote',
        type: 'quote',
        position: { x: 40, y: 80 },
        width: 'calc(100% - 80px)',
        defaultText: '"生活不是等待暴风雨过去，而是学会在雨中跳舞。"',
        style: {
          fontFamily: 'Noto Serif SC',
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.6,
          textAlign: 'center',
        },
      },
      {
        id: 'author',
        type: 'subtitle',
        position: { x: 40, y: 280 },
        width: 'calc(100% - 80px)',
        defaultText: '— 维维安·格林',
        style: {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.4,
          textAlign: 'center',
        },
      },
    ],
  },
  defaultContent: {
    quote: '"生活不是等待暴风雨过去，而是学会在雨中跳舞。"',
    author: '— 维维安·格林',
  },
  style: {
    fontFamily: 'Noto Serif SC',
    fontSize: 22,
    fontSizeScale: 1,
    lineHeight: 1.6,
    lineHeightOffset: 0,
    padding: 40,
    backgroundColor: '#fef3c7',
    textColor: '#1f2937',
  },
  elementDefaults: {
    icon: false,
    icon2: false,
    date: false,
    title: false,
    count: false,
    qrcode: false,
    page: false,
    watermark: false,
    author: true,
  },
};
