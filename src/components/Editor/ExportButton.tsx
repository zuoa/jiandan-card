import { useState, useRef } from 'react';
import clsx from 'clsx';
import { exportCard } from '../../utils/export';
import { useStore } from '../../store/useStore';
import { templates } from '../../templates';
import { CardRenderer } from '../Card/CardRenderer';

type ExportFormat = 'png' | 'jpeg';

export const ExportButton = () => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  const selectedTemplateId = useStore((state) => state.selectedTemplateId);
  const aspectRatio = useStore((state) => state.aspectRatio);
  const content = useStore((state) => state.content);
  const style = useStore((state) => state.style);
  const visibleControls = useStore((state) => state.visibleControls);

  const handleExport = async () => {
    if (!exportRef.current) return;

    setIsExporting(true);
    setError(null);

    try {
      await exportCard(exportRef.current, {
        format,
        quality: 1,
        pixelRatio: 2,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败');
    } finally {
      setIsExporting(false);
    }
  };

  const template = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur">
        <button
          onClick={() => setFormat('png')}
          className={clsx(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
            format === 'png'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-950'
          )}
        >
          PNG
        </button>
        <button
          onClick={() => setFormat('jpeg')}
          className={clsx(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
            format === 'jpeg'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-950'
          )}
        >
          JPG
        </button>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className={clsx(
          'rounded-full px-4 py-2 text-sm font-medium transition-all',
          'bg-slate-950 text-white hover:bg-slate-800',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isExporting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            导出中...
          </span>
        ) : (
          '导出图片'
        )}
      </button>

      {/* 错误提示 */}
      {error && (
        <span className="text-sm text-rose-500">{error}</span>
      )}

      <div className="absolute -left-[9999px]">
        {template && (
          <CardRenderer
            ref={exportRef}
            template={template}
            content={content}
            style={style}
            aspectRatio={aspectRatio}
            visibleControls={visibleControls}
            editable={false}
          />
        )}
      </div>
    </div>
  );
};
