import { useRef } from 'react';
import { useStore, type EditorPanel } from '../../store/useStore';
import { templates } from '../../templates';
import { CardRenderer } from '../Card/CardRenderer';

const toolbarItems: Array<{
  id: EditorPanel;
  label: string;
  icon: string;
}> = [
  { id: 'elements', label: '元素', icon: '◎' },
  { id: 'ratio', label: '比例', icon: '◫' },
  { id: 'font', label: '字体', icon: 'F' },
  { id: 'typography', label: '排版', icon: 'T' },
  { id: 'spacing', label: '留白', icon: '↔' },
  { id: 'colors', label: '颜色', icon: '◐' },
];

export const PreviewArea = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const selectedTemplateId = useStore((state) => state.selectedTemplateId);
  const aspectRatio = useStore((state) => state.aspectRatio);
  const content = useStore((state) => state.content);
  const style = useStore((state) => state.style);
  const visibleControls = useStore((state) => state.visibleControls);
  const activePanel = useStore((state) => state.activePanel);
  const setActivePanel = useStore((state) => state.setActivePanel);
  const selectTextArea = useStore((state) => state.selectTextArea);

  const template = templates.find((t) => t.id === selectedTemplateId);
  if (!template) return null;

  return (
    <div
      className="relative flex h-full min-h-[420px] w-full overflow-auto bg-[#f5f7fb] p-4 sm:p-8"
      onClick={() => selectTextArea(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(226,232,240,0.75),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.4),_rgba(226,232,240,0.28))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative flex min-h-full w-full items-start justify-center pt-16">
        <div className="absolute left-0 top-0 rounded-full border border-slate-200/80 bg-white/88 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500 shadow-sm backdrop-blur">
          Live canvas
        </div>
        <div className="absolute right-0 top-0 flex flex-wrap items-center justify-end gap-2">
          {toolbarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
                activePanel === item.id
                  ? 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-900/10'
                  : 'border-slate-200/80 bg-white/92 text-slate-600 shadow-sm backdrop-blur hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[11px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <div className="absolute inset-8 rounded-[36px] bg-slate-900/8 blur-3xl" />
          <CardRenderer
            ref={cardRef}
            template={template}
            content={content}
            style={style}
            aspectRatio={aspectRatio}
            visibleControls={visibleControls}
            editable={true}
          />
        </div>
      </div>
    </div>
  );
};
