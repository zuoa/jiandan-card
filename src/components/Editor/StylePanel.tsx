import { FC } from 'react';
import { useStore, type EditorPanel } from '../../store/useStore';
import { FONTS } from '../../constants/fonts';
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../constants/colors';
import { ASPECT_RATIOS } from '../../constants/presets';
import { GLOBAL_ELEMENT_CONTROLS } from '../../constants/editorControls';
import { templates } from '../../templates';
import type { TextArea } from '../../templates/types';

const panelTitles: Record<EditorPanel, { label: string; hint: string }> = {
  elements: { label: '元素开关', hint: '控制图标、作者、二维码、页码等显隐' },
  ratio: { label: '卡片比例', hint: '切换自动、社媒和纸张比例' },
  font: { label: '字体', hint: '选择卡片的主字体方案' },
  typography: { label: '排版', hint: '调整字号缩放和行距节奏' },
  spacing: { label: '留白', hint: '控制内容的边距和呼吸感' },
  colors: { label: '颜色', hint: '调整背景色和文字色' },
};

const getTextAreaLabel = (textArea: TextArea, index: number) => {
  const id = textArea.id.toLowerCase();

  if (id.includes('subtitle')) return '副标题';
  if (id.includes('title')) return '标题';
  if (id.includes('author')) return '作者';
  if (id.includes('date')) return '日期';
  if (id.includes('quote')) return '引用';
  if (id.includes('code')) return '代码';
  if (id.includes('content') || id.includes('body') || id.includes('text')) {
    return `正文 ${index + 1}`;
  }

  switch (textArea.type) {
    case 'title':
      return '标题';
    case 'subtitle':
      return '副标题';
    case 'quote':
      return '引用';
    default:
      return `文本 ${index + 1}`;
  }
};

export const StylePanel: FC = () => {
  const selectedTemplateId = useStore((state) => state.selectedTemplateId);
  const aspectRatio = useStore((state) => state.aspectRatio);
  const style = useStore((state) => state.style);
  const selectedTextAreaId = useStore((state) => state.selectedTextAreaId);
  const textAreaStyleOverrides = useStore((state) => state.textAreaStyleOverrides);
  const visibleControls = useStore((state) => state.visibleControls);
  const activePanel = useStore((state) => state.activePanel);
  const selectTextArea = useStore((state) => state.selectTextArea);
  const updateAspectRatio = useStore((state) => state.updateAspectRatio);
  const updateStyle = useStore((state) => state.updateStyle);
  const updateTextAreaStyle = useStore((state) => state.updateTextAreaStyle);
  const resetTextAreaStyle = useStore((state) => state.resetTextAreaStyle);
  const toggleControlVisibility = useStore((state) => state.toggleControlVisibility);
  const resetToTemplate = useStore((state) => state.resetToTemplate);
  const template = templates.find((item) => item.id === selectedTemplateId);
  const textAreas = template?.layout.textAreas ?? [];
  const selectedTextArea =
    textAreas.find((textArea) => textArea.id === selectedTextAreaId) ?? null;
  const selectedTextAreaLabel = selectedTextArea
    ? getTextAreaLabel(selectedTextArea, textAreas.findIndex((textArea) => textArea.id === selectedTextArea.id))
    : null;
  const selectedAreaStyle = selectedTextArea
    ? {
        ...selectedTextArea.style,
        ...textAreaStyleOverrides[selectedTextArea.id],
      }
    : null;
  const hasSelectedAreaOverride = selectedTextArea
    ? Object.keys(textAreaStyleOverrides[selectedTextArea.id] ?? {}).length > 0
    : false;
  const currentFontFamily = selectedAreaStyle?.fontFamily ?? style.fontFamily;
  const currentFontSize = selectedAreaStyle?.fontSize ?? style.fontSize;
  const currentLineHeight = selectedAreaStyle?.lineHeight ?? style.lineHeight;
  const currentFontWeight = selectedAreaStyle?.fontWeight ?? 400;
  const isAreaMode = Boolean(selectedTextArea);

  return (
    <div className="h-full overflow-y-auto border-l border-slate-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Controls
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            {panelTitles[activePanel].label}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{panelTitles[activePanel].hint}</p>
        </div>
        <button
          onClick={resetToTemplate}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          重置
        </button>
      </div>

      <div className="space-y-6">
        {template && (activePanel === 'font' || activePanel === 'typography') ? (
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  编辑区域
                </label>
                <p className="mt-1 text-sm text-slate-500">
                  {isAreaMode
                    ? `当前调整只作用于「${selectedTextAreaLabel}」`
                    : '未选中文本时，字体和排版控制会作用于整张卡片。'}
                </p>
              </div>
              {selectedTextArea && hasSelectedAreaOverride ? (
                <button
                  onClick={() => resetTextAreaStyle(selectedTextArea.id)}
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                >
                  重置区域
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => selectTextArea(null)}
                className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                  !selectedTextArea
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                }`}
              >
                全部区域
              </button>
              {textAreas.map((textArea, index) => (
                <button
                  key={textArea.id}
                  onClick={() => selectTextArea(textArea.id)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                    selectedTextAreaId === textArea.id
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {getTextAreaLabel(textArea, index)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activePanel === 'elements' ? (
          <div className="rounded-[24px] border border-slate-900/90 bg-[#171a21] p-4 text-white shadow-sm">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              元素开关
            </label>
            <div className="space-y-2">
              {GLOBAL_ELEMENT_CONTROLS.map((control) => {
                const enabled = visibleControls[control.id] ?? control.defaultVisible;

                return (
                  <button
                    key={control.id}
                    onClick={() => toggleControlVisibility(control.id)}
                    className="flex w-full items-center justify-between rounded-2xl px-1 py-1 text-left transition hover:bg-white/5"
                  >
                    <span className="text-sm text-slate-200">{control.label}</span>
                    <span
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                        enabled ? 'bg-teal-500' : 'bg-slate-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                          enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {activePanel === 'ratio' ? (
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              卡片比例
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => updateAspectRatio(ratio.value)}
                  className={`rounded-2xl border px-3 py-3 text-left transition-all ${
                    aspectRatio === ratio.value
                      ? 'border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-900/10'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-medium">{ratio.label}</div>
                  <div
                    className={`mt-1 text-[11px] ${
                      aspectRatio === ratio.value ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {ratio.description}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">支持自动、封面、社媒、长图和纸张比例，预览和导出都会同步。</p>
          </div>
        ) : null}

        {activePanel === 'font' ? (
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {isAreaMode ? `${selectedTextAreaLabel} 字体` : '字体'}
            </label>
            <select
              value={currentFontFamily}
              onChange={(e) => {
                if (selectedTextArea) {
                  updateTextAreaStyle(selectedTextArea.id, {
                    fontFamily: e.target.value,
                  });
                  return;
                }

                updateStyle({ fontFamily: e.target.value });
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {activePanel === 'typography' ? (
          <>
            {selectedTextArea ? (
              <>
                <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    字号: {Math.round(currentFontSize)}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="96"
                    step="1"
                    value={currentFontSize}
                    onChange={(e) =>
                      updateTextAreaStyle(selectedTextArea.id, {
                        fontSize: parseInt(e.target.value, 10),
                      })
                    }
                    className="range-slider w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>10</span>
                    <span>96</span>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    字重
                  </label>
                  <select
                    value={currentFontWeight}
                    onChange={(e) =>
                      updateTextAreaStyle(selectedTextArea.id, {
                        fontWeight: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    {[300, 400, 500, 600, 700, 800].map((weight) => (
                      <option key={weight} value={weight}>
                        {weight}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    行距: {currentLineHeight.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2.4"
                    step="0.05"
                    value={currentLineHeight}
                    onChange={(e) =>
                      updateTextAreaStyle(selectedTextArea.id, {
                        lineHeight: parseFloat(e.target.value),
                      })
                    }
                    className="range-slider w-full"
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>1.0</span>
                    <span>2.4</span>
                  </div>
                </div>
              </>
            ) : (
              <>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                字号缩放: {style.fontSizeScale.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={style.fontSizeScale}
                onChange={(e) =>
                  updateStyle({ fontSizeScale: parseFloat(e.target.value) })
                }
                className="range-slider w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>0.5x</span>
                <span>3x</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                行距偏移: {style.lineHeightOffset > 0 ? '+' : ''}
                {style.lineHeightOffset}
              </label>
              <input
                type="range"
                min="-10"
                max="30"
                step="1"
                value={style.lineHeightOffset}
                onChange={(e) =>
                  updateStyle({ lineHeightOffset: parseInt(e.target.value, 10) })
                }
                className="range-slider w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>-10</span>
                <span>+30</span>
              </div>
            </div>
              </>
            )}
          </>
        ) : null}

        {activePanel === 'spacing' ? (
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              内边距: {style.padding}px
            </label>
            <input
              type="range"
              min="0"
              max="60"
              step="4"
              value={style.padding}
              onChange={(e) =>
                updateStyle({ padding: parseInt(e.target.value, 10) })
              }
              className="range-slider w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>0</span>
              <span>60</span>
            </div>
          </div>
        ) : null}

        {activePanel === 'colors' ? (
          <>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                背景色
              </label>
              <div className="grid grid-cols-6 gap-2">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateStyle({ backgroundColor: color.value })}
                    className={`h-9 w-9 rounded-2xl border-2 transition-all hover:scale-105 ${
                      style.backgroundColor === color.value
                        ? 'border-slate-900 shadow-md'
                        : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                文字颜色
              </label>
              <div className="grid grid-cols-6 gap-2">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateStyle({ textColor: color.value })}
                    className={`h-9 w-9 rounded-2xl border-2 transition-all hover:scale-105 ${
                      style.textColor === color.value
                        ? 'border-slate-900 shadow-md'
                        : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
