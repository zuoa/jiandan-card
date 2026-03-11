import type { GlobalElementControlId } from '../constants/editorControls';

export type TemplateCategory =
  | 'default'
  | 'quote'
  | 'book'
  | 'note'
  | 'poster'
  | 'handwriting'
  | 'code';
export type AspectRatio =
  | 'auto'
  | '1:1'
  | '2.35:1'
  | '3:4'
  | '3:7'
  | '4:3'
  | '7:5'
  | '9:16'
  | '12:16'
  | '16:9'
  | '210:297'
  | '105:297';
export type TextAreaType = 'title' | 'body' | 'subtitle' | 'quote';

export interface TextArea {
  id: string;
  type: TextAreaType;
  position: { x: number; y: number };
  width: string;
  defaultText: string;
  style?: Partial<TextStyle>;
}

export interface CardLayout {
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  textAreas: TextArea[];
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  color?: string;
}

export interface CardStyle {
  fontFamily: string;
  fontSize: number;
  fontSizeScale: number;
  lineHeight: number;
  lineHeightOffset: number;
  padding: number;
  backgroundColor: string;
  textColor: string;
}

export interface CardContent {
  [textAreaId: string]: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnail: string;
  layout: CardLayout;
  defaultContent: CardContent;
  style: CardStyle;
  elementDefaults?: Partial<Record<GlobalElementControlId, boolean>>;
}
