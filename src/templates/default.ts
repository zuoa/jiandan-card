import type { Template } from './types';

export const defaultTemplate: Template = {
  id: 'default',
  name: '默认简约',
  category: 'default',
  thumbnail: '',
  layout: {
    aspectRatio: '3:4',
    width: 375,
    height: 500,
    textAreas: [
      {
        id: 'title',
        type: 'title',
        position: { x: 32, y: 40 },
        width: 'calc(100% - 64px)',
        defaultText: '标题文字',
        style: {
          fontFamily: 'Noto Serif SC',
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1.4,
          textAlign: 'left',
        },
      },
      {
        id: 'body',
        type: 'body',
        position: { x: 32, y: 100 },
        width: 'calc(100% - 64px)',
        defaultText: '在这里输入正文内容。简洁的设计，让文字成为焦点。',
        style: {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.8,
          textAlign: 'left',
        },
      },
    ],
  },
  defaultContent: {
    title: '标题文字',
    body: '在这里输入正文内容。简洁的设计，让文字成为焦点。',
  },
  style: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontSizeScale: 1,
    lineHeight: 1.6,
    lineHeightOffset: 0,
    padding: 32,
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  },
  elementDefaults: {
    icon: false,
    icon2: false,
    date: false,
    author: false,
    count: false,
    qrcode: false,
    page: false,
    watermark: false,
  },
};
