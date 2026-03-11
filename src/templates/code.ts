import type { Template } from './types';

export const codeTemplate: Template = {
  id: 'code',
  name: '代码片段',
  category: 'code',
  thumbnail: '',
  layout: {
    aspectRatio: '4:3',
    width: 480,
    height: 360,
    textAreas: [
      {
        id: 'code',
        type: 'body',
        position: { x: 24, y: 24 },
        width: 'calc(100% - 48px)',
        defaultText: 'const greeting = "Hello, World!";\nconsole.log(greeting);\n\n// 代码是诗，逻辑是韵\nfunction sayHi(name) {\n  return `Hi, ${name}!`;\n}',
        style: {
          fontFamily: 'JetBrains Mono',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.6,
          textAlign: 'left',
        },
      },
    ],
  },
  defaultContent: {
    code: 'const greeting = "Hello, World!";\nconsole.log(greeting);\n\n// 代码是诗，逻辑是韵\nfunction sayHi(name) {\n  return `Hi, ${name}!`;\n}',
  },
  style: {
    fontFamily: 'JetBrains Mono',
    fontSize: 14,
    fontSizeScale: 1,
    lineHeight: 1.6,
    lineHeightOffset: 0,
    padding: 24,
    backgroundColor: '#1a1a2e',
    textColor: '#e2e8f0',
  },
  elementDefaults: {
    icon: false,
    icon2: true,
    date: false,
    title: false,
    author: false,
    count: true,
    qrcode: false,
    page: false,
    watermark: false,
  },
};
