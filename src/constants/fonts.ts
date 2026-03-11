export interface FontOption {
  value: string;
  label: string;
  family: string;
}

export const FONTS: FontOption[] = [
  { value: 'Inter', label: 'Inter (无衬线)', family: '"Inter", system-ui, sans-serif' },
  { value: 'Noto Serif SC', label: '思源宋体', family: '"Noto Serif SC", Georgia, serif' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (等宽)', family: '"JetBrains Mono", monospace' },
  { value: 'ZCOOL XiaoWei', label: '站酷小薇体', family: '"ZCOOL XiaoWei", cursive' },
  { value: 'Ma Shan Zheng', label: '马善政毛笔楷书', family: '"Ma Shan Zheng", cursive' },
  { value: 'system-ui', label: '系统默认', family: 'system-ui, -apple-system, sans-serif' },
];

export const getFontFamily = (fontName: string): string => {
  const font = FONTS.find(f => f.value === fontName);
  return font?.family || fontName;
};
