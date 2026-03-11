import { create } from 'zustand';
import { templates, defaultTemplate } from '../templates';
import type { AspectRatio, CardContent, CardStyle } from '../templates/types';
import { GLOBAL_ELEMENT_CONTROLS } from '../constants/editorControls';

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

interface EditorState {
  selectedTemplateId: string;
  aspectRatio: AspectRatio;
  content: CardContent;
  style: CardStyle;
  visibleControls: Record<string, boolean>;
  activePanel: EditorPanel;

  selectTemplate: (id: string) => void;
  updateContent: (textAreaId: string, text: string) => void;
  updateAspectRatio: (aspectRatio: AspectRatio) => void;
  updateStyle: (updates: Partial<CardStyle>) => void;
  toggleControlVisibility: (id: string) => void;
  setActivePanel: (panel: EditorPanel) => void;
  resetToTemplate: () => void;
}

export const useStore = create<EditorState>((set, get) => ({
  selectedTemplateId: defaultTemplate.id,
  aspectRatio: 'auto',
  content: { ...defaultTemplate.defaultContent },
  style: { ...defaultTemplate.style },
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
      visibleControls: getTemplateControlVisibility(id),
    });
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

  toggleControlVisibility: (id: string) => {
    set((state) => ({
      visibleControls: {
        ...state.visibleControls,
        [id]: !state.visibleControls[id],
      },
    }));
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
      visibleControls: getTemplateControlVisibility(selectedTemplateId),
    });
  },
}));
