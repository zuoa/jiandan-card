import { FC, useMemo } from 'react';
import clsx from 'clsx';
import { templates, categoryLabels, type TemplateCategory } from '../../templates';
import { useStore } from '../../store/useStore';
import { CardRenderer } from '../Card/CardRenderer';

const categoryOrder: TemplateCategory[] = [
  'default',
  'quote',
  'book',
  'note',
  'poster',
  'handwriting',
  'code',
];

export const TemplatePanel: FC = () => {
  const selectedTemplateId = useStore((state) => state.selectedTemplateId);
  const selectTemplate = useStore((state) => state.selectTemplate);

  const orderedTemplates = useMemo(() => {
    const rank = new Map(categoryOrder.map((category, index) => [category, index]));
    return [...templates].sort((left, right) => {
      return (rank.get(left.category) ?? 0) - (rank.get(right.category) ?? 0);
    });
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.98))] p-3">
      <div className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          Templates
        </p>
        <h2 className="mt-1 text-base font-semibold text-slate-900">选择卡片模版</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {orderedTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => selectTemplate(template.id)}
            className={clsx(
              'group relative overflow-hidden rounded-[20px] border p-2.5 text-left transition-all',
              'focus:outline-none focus:ring-2 focus:ring-slate-300',
              selectedTemplateId === template.id
                ? 'border-slate-900 bg-slate-950 text-white shadow-xl shadow-slate-900/10'
                : 'border-slate-200 bg-white/90 text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'
            )}
          >
            <div className="overflow-hidden rounded-[16px] bg-slate-100">
              <div className="flex h-24 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_48%)]">
                <div
                  className="pointer-events-none origin-center"
                  style={{
                    transform: `scale(${Math.min(
                      88 / template.layout.width,
                      88 / template.layout.height
                    )})`,
                  }}
                >
                  <CardRenderer
                    template={template}
                    content={template.defaultContent}
                    style={template.style}
                    editable={false}
                    className="shadow-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold leading-5">{template.name}</div>
                <div
                  className={clsx(
                    'mt-0.5 text-[11px]',
                    selectedTemplateId === template.id
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  )}
                >
                  {template.layout.aspectRatio}
                </div>
              </div>
              <div
                className={clsx(
                  'shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]',
                  selectedTemplateId === template.id
                    ? 'bg-white/10 text-white'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                {categoryLabels[template.category as TemplateCategory]}
              </div>
            </div>

            {selectedTemplateId === template.id && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
