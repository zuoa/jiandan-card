export type GlobalElementControlId =
  | 'icon'
  | 'icon2'
  | 'date'
  | 'title'
  | 'text'
  | 'author'
  | 'count'
  | 'qrcode'
  | 'page'
  | 'watermark';

export interface GlobalElementControl {
  id: GlobalElementControlId;
  label: string;
  defaultVisible: boolean;
}

export const GLOBAL_ELEMENT_CONTROLS: GlobalElementControl[] = [
  { id: 'icon', label: '图标', defaultVisible: true },
  { id: 'icon2', label: '图标2', defaultVisible: false },
  { id: 'date', label: '日期', defaultVisible: true },
  { id: 'title', label: '标题', defaultVisible: true },
  { id: 'text', label: '文本', defaultVisible: true },
  { id: 'author', label: '作者', defaultVisible: false },
  { id: 'count', label: '计数', defaultVisible: true },
  { id: 'qrcode', label: '二维码', defaultVisible: false },
  { id: 'page', label: '页码', defaultVisible: false },
  { id: 'watermark', label: '水印', defaultVisible: true },
];
