import type { CardStyle } from '../templates/types';
import type { AspectRatio } from '../templates/types';

interface AspectRatioOption {
  value: AspectRatio;
  label: string;
  description: string;
  width?: number;
  height?: number;
}

export const DEFAULT_STYLE: CardStyle = {
  fontFamily: 'Inter',
  fontSize: 18,
  fontSizeScale: 1,
  lineHeight: 1.6,
  lineHeightOffset: 0,
  padding: 32,
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
};

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { value: 'auto' as const, label: '自动', description: '跟随模版' },
  { value: '1:1' as const, label: '正方形', description: '1:1', width: 400, height: 400 },
  { value: '2.35:1' as const, label: '公众号封面', description: '2.35:1', width: 564, height: 240 },
  { value: '3:4' as const, label: '小红书', description: '3:4', width: 375, height: 500 },
  { value: '3:7' as const, label: '小红书长文', description: '3:7', width: 300, height: 700 },
  { value: '4:3' as const, label: 'Instagram', description: '4:3', width: 480, height: 360 },
  { value: '7:5' as const, label: 'Pinterest', description: '7:5', width: 490, height: 350 },
  { value: '9:16' as const, label: '抖音', description: '9:16', width: 360, height: 640 },
  { value: '16:9' as const, label: 'YouTube', description: '16:9', width: 640, height: 360 },
  { value: '12:16' as const, label: '微博', description: '12:16', width: 360, height: 480 },
  { value: '210:297' as const, label: 'A4纸', description: '210:297', width: 420, height: 594 },
  { value: '105:297' as const, label: 'PDF双列', description: '105:297', width: 240, height: 679 },
];

export const getAspectRatioPreset = (aspectRatio: AspectRatio) => {
  const preset = ASPECT_RATIOS.find(
    (ratio) =>
      ratio.value === aspectRatio &&
      typeof ratio.width === 'number' &&
      typeof ratio.height === 'number'
  );

  if (preset) {
    return preset as AspectRatioOption & { width: number; height: number };
  }

  return {
    value: '3:4',
    label: '小红书',
    description: '3:4',
    width: 375,
    height: 500,
  };
};
