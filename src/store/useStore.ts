import { create } from 'zustand';
import { templates, defaultTemplate } from '../templates';
import type {
  AspectRatio,
  CardContent,
  CardStyle,
  TextArea,
  TextAreaStyleOverrides,
  TextStyle,
} from '../templates/types';
import {
  GLOBAL_ELEMENT_CONTROLS,
  type GlobalElementControlId,
} from '../constants/editorControls';

export type EditorPanel =
  | 'elements'
  | 'ratio'
  | 'font'
  | 'typography'
  | 'spacing'
  | 'colors';

const getDefaultControlVisibility = () => {
  return Object.fromEntries(
    GLOBAL_ELEMENT_CONTROLS.map((control) => [control.id, control.defaultVisible])
  );
};

const getTemplateControlVisibility = (templateId: string) => {
  const template = templates.find((item) => item.id === templateId);
  return {
    ...getDefaultControlVisibility(),
    ...(template?.elementDefaults ?? {}),
  };
};

const inferControlId = (textArea: TextArea): GlobalElementControlId | null => {
  const id = textArea.id.toLowerCase();

  if (id.includes('date')) return 'date';
  if (id.includes('author')) return 'author';
  if (id.includes('title')) return 'title';
  if (
    id.includes('body') ||
    id.includes('content') ||
    id.includes('excerpt') ||
    id.includes('code') ||
    id.includes('quote') ||
    id.includes('text') ||
    id.includes('highlight')
  ) {
    return 'text';
  }

  if (textArea.type === 'title') return 'title';
  if (textArea.type === 'body' || textArea.type === 'quote') return 'text';

  return null;
};

interface EditorState {
  selectedTemplateId: string;
  aspectRatio: AspectRatio;
  content: CardContent;
  style: CardStyle;
  selectedTextAreaId: string | null;
  textAreaStyleOverrides: TextAreaStyleOverrides;
  visibleControls: Record<string, boolean>;
  activePanel: EditorPanel;

  selectTemplate: (id: string) => void;
  selectTextArea: (id: string | null) => void;
  updateContent: (textAreaId: string, text: string) => void;
  updateAspectRatio: (aspectRatio: AspectRatio) => void;
  updateStyle: (updates: Partial<CardStyle>) => void;
  updateTextAreaStyle: (textAreaId: string, updates: Partial<TextStyle>) => void;
  resetTextAreaStyle: (textAreaId: string) => void;
  toggleControlVisibility: (id: string) => void;
  setActivePanel: (panel: EditorPanel) => void;
  resetToTemplate: () => void;
}

export const useStore = create<EditorState>((set, get) => ({
  selectedTemplateId: defaultTemplate.id,
  aspectRatio: 'auto',
  content: { ...defaultTemplate.defaultContent },
  style: { ...defaultTemplate.style },
  selectedTextAreaId: null,
  textAreaStyleOverrides: {},
  visibleControls: getTemplateControlVisibility(defaultTemplate.id),
  activePanel: 'ratio',

  selectTemplate: (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    // 保留用户已编辑的内容，只更新样式
    set({
      selectedTemplateId: id,
      aspectRatio: 'auto',
      style: { ...template.style },
      selectedTextAreaId: null,
      textAreaStyleOverrides: {},
      visibleControls: getTemplateControlVisibility(id),
    });
  },

  selectTextArea: (id: string | null) => {
    set({ selectedTextAreaId: id });
  },

  updateContent: (textAreaId: string, text: string) => {
    set((state) => ({
      content: {
        ...state.content,
        [textAreaId]: text,
      },
    }));
  },

  updateAspectRatio: (aspectRatio: AspectRatio) => {
    set({ aspectRatio });
  },

  updateStyle: (updates: Partial<CardStyle>) => {
    set((state) => ({
      style: {
        ...state.style,
        ...updates,
      },
    }));
  },

  updateTextAreaStyle: (textAreaId: string, updates: Partial<TextStyle>) => {
    set((state) => ({
      textAreaStyleOverrides: {
        ...state.textAreaStyleOverrides,
        [textAreaId]: {
          ...state.textAreaStyleOverrides[textAreaId],
          ...updates,
        },
      },
    }));
  },

  resetTextAreaStyle: (textAreaId: string) => {
    set((state) => {
      const nextOverrides = { ...state.textAreaStyleOverrides };
      delete nextOverrides[textAreaId];

      return {
        textAreaStyleOverrides: nextOverrides,
      };
    });
  },

  toggleControlVisibility: (id: string) => {
    set((state) => {
      const nextVisible = !state.visibleControls[id];
      const nextContent = { ...state.content };

      if (nextVisible) {
        const template = templates.find((item) => item.id === state.selectedTemplateId);

        template?.layout.textAreas.forEach((textArea) => {
          if (inferControlId(textArea) !== id) return;

          const currentText = nextContent[textArea.id];
          if (typeof currentText === 'string' && currentText.trim().length > 0) return;

          nextContent[textArea.id] =
            template.defaultContent[textArea.id] ?? textArea.defaultText;
        });
      }

      return {
        content: nextContent,
        visibleControls: {
          ...state.visibleControls,
          [id]: nextVisible,
        },
      };
    });
  },

  setActivePanel: (panel: EditorPanel) => {
    set({ activePanel: panel });
  },

  resetToTemplate: () => {
    const { selectedTemplateId } = get();
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    set({
      aspectRatio: 'auto',
      content: { ...template.defaultContent },
      style: { ...template.style },
      selectedTextAreaId: null,
      textAreaStyleOverrides: {},
      visibleControls: getTemplateControlVisibility(selectedTemplateId),
    });
  },
}));
