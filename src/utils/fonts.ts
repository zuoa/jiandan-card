import { FONTS } from '../constants/fonts';

export interface FontLoadStatus {
  [fontName: string]: 'loading' | 'loaded' | 'error';
}

const fontLoadStatus: FontLoadStatus = {};

export function isFontLoaded(fontName: string): boolean {
  return fontLoadStatus[fontName] === 'loaded';
}

export async function loadFont(fontName: string): Promise<void> {
  if (fontLoadStatus[fontName] === 'loaded') {
    return;
  }

  const font = FONTS.find((f) => f.value === fontName);
  if (!font) {
    fontLoadStatus[fontName] = 'error';
    return;
  }

  fontLoadStatus[fontName] = 'loading';

  try {
    // 检查 document.fonts API
    if (document.fonts?.load) {
      // 使用 document.fonts.load 加载字体
      await document.fonts.load(`16px "${fontName}"`);
      fontLoadStatus[fontName] = 'loaded';
    } else {
      // 降级处理：假设 Google Fonts 已通过 <link> 加载
      fontLoadStatus[fontName] = 'loaded';
    }
  } catch (error) {
    console.warn(`Failed to load font: ${fontName}`, error);
    fontLoadStatus[fontName] = 'error';
  }
}

export async function loadAllFonts(): Promise<void> {
  const loadPromises = FONTS.map((font) => loadFont(font.value));
  await Promise.allSettled(loadPromises);
}

export function getFontLoadStatus(): FontLoadStatus {
  return { ...fontLoadStatus };
}
