import { FC } from 'react';
import { useStore, type EditorPanel } from '../../store/useStore';
import { FONTS } from '../../constants/fonts';
import { BACKGROUND_COLORS, TEXT_COLORS } from '../../constants/colors';
import { ASPECT_RATIOS } from '../../constants/presets';
import { GLOBAL_ELEMENT_CONTROLS } from '../../constants/editorControls';

const panelTitles: Record<EditorPanel, { label: string; hint: string }> = {
  elements: { label: '元素开关', hint: '控制图标、作者、二维码、页码等显隐' },
  ratio: { label: '卡片比例', hint: '切换自动、社媒和纸张比例' },
  font: { label: '字体', hint: '选择卡片的主字体方案' },
  typography: { label: '排版', hint: '调整字号缩放和行距节奏' },
  spacing: { label: '留白', hint: '控制内容的边距和呼吸感' },
  colors: { label: '颜色', hint: '调整背景色和文字色' },
};

export const StylePanel: FC = () => {
  const aspectRatio = useStore((state) => state.aspectRatio);
  const style = useStore((state) => state.style);
  const visibleControls = useStore((state) => state.visibleControls);
  const activePanel = useStore((state) => state.activePanel);
  const updateAspectRatio = useStore((state) => state.updateAspectRatio);
  const updateStyle = useStore((state) => state.updateStyle);
  const toggleControlVisibility = useStore((state) => state.toggleControlVisibility);
  const resetToTemplate = useStore((state) => state.resetToTemplate);

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
              字体
            </label>
            <select
              value={style.fontFamily}
              onChange={(e) => updateStyle({ fontFamily: e.target.value })}
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
