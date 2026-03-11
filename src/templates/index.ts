import { defaultTemplate } from './default';
import { quoteTemplate } from './quote';
import { bookTemplate } from './book';
import { noteTemplate } from './note';
import { iphoneNoteTemplate } from './iphoneNote';
import { posterTemplate } from './poster';
import { handwritingTemplate } from './handwriting';
import { codeTemplate } from './code';
import type { Template, TemplateCategory } from './types';

export const templates: Template[] = [
  defaultTemplate,
  quoteTemplate,
  bookTemplate,
  noteTemplate,
  iphoneNoteTemplate,
  posterTemplate,
  handwritingTemplate,
  codeTemplate,
];

export const templatesByCategory: Record<TemplateCategory, Template[]> = {
  default: [defaultTemplate],
  quote: [quoteTemplate],
  book: [bookTemplate],
  note: [noteTemplate, iphoneNoteTemplate],
  poster: [posterTemplate],
  handwriting: [handwritingTemplate],
  code: [codeTemplate],
};

export const categoryLabels: Record<TemplateCategory, string> = {
  default: '简约',
  quote: '金句',
  book: '书摘',
  note: '便签',
  poster: '大字报',
  handwriting: '手写',
  code: '代码',
};

export {
  defaultTemplate,
  quoteTemplate,
  bookTemplate,
  noteTemplate,
  iphoneNoteTemplate,
  posterTemplate,
  handwritingTemplate,
  codeTemplate,
};
export * from './types';
