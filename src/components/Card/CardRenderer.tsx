import { forwardRef } from 'react';
import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type {
  AspectRatio,
  CardContent,
  CardStyle,
  TextArea,
  Template,
} from '../../templates/types';
import type { GlobalElementControlId } from '../../constants/editorControls';
import { EditableText } from './EditableText';
import { getFontFamily } from '../../constants/fonts';
import { getAspectRatioPreset } from '../../constants/presets';
import { useStore } from '../../store/useStore';

interface CardRendererProps {
  template: Template;
  content: CardContent;
  style: CardStyle;
  aspectRatio?: AspectRatio;
  visibleControls?: Record<string, boolean>;
  editable?: boolean;
  className?: string;
}

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;

  const value = Number.parseInt(fullHex, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const toRgba = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const mixColor = (source: string, target: string, ratio: number) => {
  const from = hexToRgb(source);
  const to = hexToRgb(target);
  const mixChannel = (start: number, end: number) =>
    Math.round(start + (end - start) * ratio);

  return `rgb(${mixChannel(from.r, to.r)}, ${mixChannel(from.g, to.g)}, ${mixChannel(from.b, to.b)})`;
};

const IOS_NOTES_ACCENT = '#f2c200';
const IOS_NOTES_SEPARATOR = '#d1d1d6';
const IOS_NOTES_CHROME = '#f6f6f8';

const getSurfaceStyle = (
  template: Template,
  style: CardStyle
): CSSProperties => {
  const { backgroundColor, textColor } = style;

  switch (template.id) {
    case 'quote':
      return {
        background: `radial-gradient(circle at 20% 18%, ${toRgba(textColor, 0.08)}, transparent 28%), linear-gradient(145deg, ${mixColor(backgroundColor, '#fff7d6', 0.72)} 0%, ${backgroundColor} 52%, ${mixColor(backgroundColor, '#f59e0b', 0.18)} 100%)`,
      };
    case 'book':
      return {
        background: `linear-gradient(180deg, ${mixColor(backgroundColor, '#ffffff', 0.6)} 0%, ${backgroundColor} 100%)`,
        boxShadow: `inset 1px 0 0 ${toRgba(textColor, 0.06)}`,
      };
    case 'note':
      return {
        background: `radial-gradient(circle at 18% 14%, ${toRgba('#ffffff', 0.82)}, transparent 24%), linear-gradient(155deg, ${mixColor(backgroundColor, '#fffdf7', 0.82)} 0%, ${backgroundColor} 48%, ${mixColor(backgroundColor, '#d5bda4', 0.28)} 100%)`,
        boxShadow: `0 30px 64px ${toRgba('#2f241d', 0.16)}, inset 0 1px 0 ${toRgba('#ffffff', 0.48)}`,
        transform: `rotate(-0.65deg)`,
      };
    case 'iphone-note':
      return {
        background: `linear-gradient(180deg, ${IOS_NOTES_CHROME} 0%, ${IOS_NOTES_CHROME} 11%, ${mixColor(backgroundColor, '#fffefb', 0.6)} 11%, ${backgroundColor} 100%)`,
        boxShadow: `0 34px 80px ${toRgba('#0f172a', 0.16)}, inset 0 1px 0 ${toRgba('#ffffff', 0.82)}`,
      };
    case 'poster':
      return {
        background: `radial-gradient(circle at top right, ${toRgba('#f59e0b', 0.16)}, transparent 20%), linear-gradient(180deg, ${mixColor(backgroundColor, '#ffffff', 0.55)} 0%, ${backgroundColor} 100%)`,
        boxShadow: `0 24px 54px ${toRgba('#7c2d12', 0.12)}`,
      };
    case 'handwriting':
      return {
        background: `radial-gradient(circle at top right, ${toRgba('#ffffff', 0.68)}, transparent 24%), linear-gradient(180deg, ${mixColor(backgroundColor, '#fffaf0', 0.78)} 0%, ${backgroundColor} 100%)`,
        boxShadow: `0 26px 60px ${toRgba('#7c5a34', 0.14)}`,
      };
    case 'code':
      return {
        background: `linear-gradient(180deg, ${mixColor(backgroundColor, '#21314b', 0.35)} 0%, ${backgroundColor} 100%)`,
        boxShadow: `inset 0 1px 0 ${toRgba('#ffffff', 0.04)}, 0 30px 70px ${toRgba('#020617', 0.4)}`,
      };
    default:
      return {
        background: `linear-gradient(180deg, ${mixColor(backgroundColor, '#ffffff', 0.7)} 0%, ${backgroundColor} 100%)`,
        boxShadow: `0 26px 60px ${toRgba('#111827', 0.12)}`,
      };
  }
};

const getFrameClassName = (template: Template) => {
  switch (template.id) {
    case 'quote':
      return 'rounded-[34px]';
    case 'note':
      return 'rounded-[24px]';
    case 'iphone-note':
      return 'rounded-[42px]';
    case 'code':
      return 'rounded-[26px]';
    case 'poster':
      return 'rounded-[22px]';
    case 'handwriting':
      return 'rounded-[30px]';
    default:
      return 'rounded-[28px]';
  }
};

const adjustWidth = (width: string, paddingDelta: number, scaleX: number) => {
  const match = width.match(/^calc\(100%\s-\s(\d+)px\)$/);
  if (!match) {
    return width;
  }

  const nextPadding = Number.parseInt(match[1], 10) + paddingDelta * 2;
  return `calc(100% - ${Math.max(nextPadding * scaleX, 0)}px)`;
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

const renderGlobalElements = (
  template: Template,
  style: CardStyle,
  isVisible: (id: GlobalElementControlId) => boolean,
  missingControls: Set<GlobalElementControlId>
) => {
  if (template.id === 'iphone-note') {
    return (
      <>
        <div
          className="absolute left-1/2 top-[11px] z-[3] h-[30px] w-[126px] -translate-x-1/2 rounded-full"
          style={{ backgroundColor: '#111111' }}
        />
        <div
          className="absolute left-7 top-[18px] z-[3] text-[15px] font-semibold tracking-[-0.02em]"
          style={{ color: '#111111' }}
        >
          9:41
        </div>
        <div className="absolute right-7 top-[19px] z-[3] flex items-center gap-1.5">
          <div className="flex items-end gap-[2px]">
            {[6, 8, 10, 12].map((height) => (
              <span
                key={height}
                className="w-[3px] rounded-full"
                style={{ height, backgroundColor: '#111111' }}
              />
            ))}
          </div>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path
              d="M1.2 3.9C2.9 2.1 5 1.2 7.5 1.2C10 1.2 12.1 2.1 13.8 3.9"
              stroke="#111111"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M3.3 6.1C4.4 4.9 5.8 4.3 7.5 4.3C9.2 4.3 10.6 4.9 11.7 6.1"
              stroke="#111111"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M6.2 8.5C6.6 8.1 7 7.9 7.5 7.9C8 7.9 8.4 8.1 8.8 8.5"
              stroke="#111111"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="relative h-[12px] w-[23px] rounded-[4px] border"
            style={{ borderColor: '#111111' }}
          >
            <div
              className="absolute right-[-3px] top-[3px] h-[4px] w-[2px] rounded-r"
              style={{ backgroundColor: '#111111' }}
            />
            <div
              className="absolute inset-[2px] rounded-[2px]"
              style={{ backgroundColor: '#111111' }}
            />
          </div>
        </div>

        {isVisible('icon') && (
          <div className="absolute left-5 top-[58px] z-[3] flex items-center gap-1.5">
            <span
              className="text-[26px] leading-none"
              style={{ color: IOS_NOTES_ACCENT }}
            >
              ‹
            </span>
            <span
              className="text-[17px] font-medium tracking-[-0.02em]"
              style={{ color: IOS_NOTES_ACCENT }}
            >
              备忘录
            </span>
          </div>
        )}

        {isVisible('icon2') && (
          <div className="absolute right-5 top-[58px] z-[3] flex items-center gap-4">
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
              <path
                d="M11.5 15.8V5.7"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M7.8 9.4L11.5 5.7L15.2 9.4"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.2 12.7V16.4C5.2 17.8 6.3 18.9 7.7 18.9H15.3C16.7 18.9 17.8 17.8 17.8 16.4V12.7"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
              <circle cx="11.5" cy="11.5" r="9" stroke={IOS_NOTES_ACCENT} strokeWidth="1.8" />
              <circle cx="8.2" cy="11.5" r="1.1" fill={IOS_NOTES_ACCENT} />
              <circle cx="11.5" cy="11.5" r="1.1" fill={IOS_NOTES_ACCENT} />
              <circle cx="14.8" cy="11.5" r="1.1" fill={IOS_NOTES_ACCENT} />
            </svg>
          </div>
        )}

        {isVisible('watermark') && (
          <div
            className="absolute bottom-[8px] left-1/2 z-[3] h-[5px] w-[140px] -translate-x-1/2 rounded-full"
            style={{ backgroundColor: '#111111' }}
          />
        )}
      </>
    );
  }

  if (template.id === 'note') {
    return (
      <>
        {isVisible('icon') && (
          <div
            className="absolute left-6 top-6 z-[3] flex h-10 w-10 items-center justify-center rounded-full border text-[10px] font-black uppercase tracking-[0.24em]"
            style={{
              borderColor: toRgba('#ffffff', 0.48),
              backgroundColor: '#2f241d',
              color: '#f8f1e7',
              boxShadow: `0 12px 24px ${toRgba('#2f241d', 0.18)}`,
            }}
          >
            Pin
          </div>
        )}
        {missingControls.has('date') && isVisible('date') && (
          <div
            className="absolute right-[34px] top-[38px] z-[3] text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: toRgba(style.textColor, 0.72) }}
          >
            2026.03.11
          </div>
        )}
        {isVisible('icon2') && (
          <div
            className="absolute right-[34px] top-[62px] z-[3] rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em]"
            style={{
              backgroundColor: toRgba('#ffffff', 0.72),
              color: '#8a5a3b',
              boxShadow: `0 10px 20px ${toRgba('#8a5a3b', 0.1)}`,
            }}
          >
            Focus
          </div>
        )}
        {isVisible('count') && (
          <div
            className="absolute bottom-[30px] right-[30px] z-[3] flex h-12 w-12 items-center justify-center rounded-[18px] text-sm font-black"
            style={{
              backgroundColor: '#2f241d',
              color: '#f7efe4',
              boxShadow: `0 14px 26px ${toRgba('#2f241d', 0.14)}`,
            }}
          >
            03
          </div>
        )}
        {missingControls.has('author') && isVisible('author') && (
          <div
            className="absolute bottom-[44px] left-[34px] z-[3] rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{
              backgroundColor: toRgba('#ffffff', 0.72),
              color: '#5c4b3f',
            }}
          >
            JIANDAN CARD
          </div>
        )}
        {isVisible('qrcode') && (
          <div
            className="absolute bottom-[98px] right-[32px] z-[3] grid h-[58px] w-[58px] grid-cols-4 gap-[3px] rounded-[16px] border p-2"
            style={{
              borderColor: toRgba(style.textColor, 0.12),
              backgroundColor: '#fffdf9',
              boxShadow: `0 12px 24px ${toRgba('#2f241d', 0.08)}`,
            }}
          >
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="rounded-[2px]"
                style={{
                  backgroundColor:
                    [0, 1, 3, 4, 6, 9, 10, 12, 15].includes(index)
                      ? '#2f241d'
                      : 'transparent',
                }}
              />
            ))}
          </div>
        )}
        {isVisible('page') && (
          <div
            className="absolute bottom-[34px] right-[92px] z-[3] rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
            style={{
              backgroundColor: toRgba('#ffffff', 0.72),
              color: '#5c4b3f',
            }}
          >
            Page 01
          </div>
        )}
        {isVisible('watermark') && (
          <div
            className="absolute right-[18px] top-[146px] z-[3] -rotate-90 text-[10px] font-black uppercase tracking-[0.3em]"
            style={{ color: toRgba('#8a5a3b', 0.5) }}
          >
            DESK MEMO
          </div>
        )}
      </>
    );
  }

  if (template.id === 'poster') {
    return (
      <>
        {isVisible('icon') && (
          <div
            className="absolute left-6 top-6 z-[3] flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              color: '#fff7ed',
              boxShadow: `0 12px 24px ${toRgba('#ef4444', 0.2)}`,
            }}
          >
            荐
          </div>
        )}
        {isVisible('icon2') && (
          <div
            className="absolute right-6 top-6 z-[3] rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em]"
            style={{
              backgroundColor: '#111827',
              color: '#ffffff',
              boxShadow: `0 10px 18px ${toRgba('#111827', 0.12)}`,
            }}
          >
            NEW
          </div>
        )}
        {missingControls.has('date') && isVisible('date') && (
          <div
            className="absolute left-[82px] top-[36px] z-[3] text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: toRgba(style.textColor, 0.56) }}
          >
            2026 / 03 / 11
          </div>
        )}
        {isVisible('count') && (
          <div
            className="absolute right-6 top-[82px] z-[3] flex h-10 w-9 items-center justify-center rounded-[12px] border text-xs font-black"
            style={{
              borderColor: toRgba('#ef4444', 0.14),
              backgroundColor: toRgba('#ffffff', 0.8),
              color: '#ef4444',
              boxShadow: `0 14px 28px ${toRgba('#0f172a', 0.08)}`,
            }}
          >
            03
          </div>
        )}
        {missingControls.has('author') && isVisible('author') && (
          <div
            className="absolute bottom-10 left-7 z-[3] rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              backgroundColor: toRgba('#ffffff', 0.84),
              color: '#475569',
            }}
          >
            JIANDAN CARD
          </div>
        )}
        {isVisible('qrcode') && (
          <div
            className="absolute bottom-14 right-7 z-[3] grid h-[60px] w-[60px] grid-cols-4 gap-[3px] rounded-[16px] border p-2"
            style={{
              borderColor: toRgba('#111827', 0.1),
              backgroundColor: '#ffffff',
              boxShadow: `0 14px 28px ${toRgba('#111827', 0.08)}`,
            }}
          >
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="rounded-[2px]"
                style={{
                  backgroundColor:
                    [0, 1, 3, 4, 6, 9, 10, 12, 15].includes(index)
                      ? '#111827'
                      : 'transparent',
                }}
              />
            ))}
          </div>
        )}
        {isVisible('page') && (
          <div
            className="absolute bottom-7 right-7 z-[3] rounded-full px-3 py-1 text-[11px] font-black"
            style={{
              backgroundColor: '#111827',
              color: '#ffffff',
            }}
          >
            PAGE 01
          </div>
        )}
        {isVisible('watermark') && (
          <div
            className="absolute right-7 top-[208px] z-[3] text-[9px] font-black uppercase tracking-[0.24em]"
            style={{ color: toRgba('#64748b', 0.86) }}
          >
            JIANDAN CARD
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {isVisible('icon') && (
        <div
          className="absolute left-6 top-6 z-[3] flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold"
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            boxShadow: `0 10px 24px ${toRgba('#0f172a', 0.1)}`,
          }}
        >
          ✦
        </div>
      )}
      {isVisible('icon2') && (
        <div
          className="absolute right-6 top-6 z-[3] rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em]"
          style={{
            backgroundColor: '#111827',
            color: '#ffffff',
          }}
        >
          Note
        </div>
      )}
      {missingControls.has('date') && isVisible('date') && (
        <div
          className="absolute left-[76px] top-8 z-[3] text-xs font-semibold"
          style={{ color: toRgba(style.textColor, 0.7) }}
        >
          2026年3月11日
        </div>
      )}
      {isVisible('count') && (
        <div
          className="absolute right-6 top-[72px] z-[3] rounded-full px-3 py-1 text-xs font-black"
          style={{
            backgroundColor: '#ffffff',
            color: '#ef4444',
            boxShadow: `0 10px 24px ${toRgba('#0f172a', 0.08)}`,
          }}
        >
          03
        </div>
      )}
      {missingControls.has('author') && isVisible('author') && (
        <div
          className="absolute bottom-14 left-6 z-[3] rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: toRgba('#ffffff', 0.86),
            color: '#475569',
          }}
        >
          JIANDAN CARD
        </div>
      )}
      {isVisible('qrcode') && (
        <div
          className="absolute bottom-14 right-6 z-[3] grid h-14 w-14 grid-cols-4 gap-[3px] rounded-[12px] border p-2"
          style={{
            borderColor: toRgba(style.textColor, 0.12),
            backgroundColor: '#ffffff',
          }}
        >
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className="rounded-[2px]"
              style={{
                backgroundColor:
                  [0, 1, 3, 4, 6, 9, 10, 12, 15].includes(index)
                    ? '#111827'
                    : 'transparent',
              }}
            />
          ))}
        </div>
      )}
      {isVisible('page') && (
        <div
          className="absolute bottom-6 right-6 z-[3] rounded-full px-3 py-1 text-xs font-black"
          style={{
            backgroundColor: '#111827',
            color: '#ffffff',
          }}
        >
          P.01
        </div>
      )}
      {isVisible('watermark') && (
        <div
          className="absolute bottom-6 left-6 z-[3] rounded-full px-3 py-1 text-[11px] font-bold"
          style={{
            backgroundColor: toRgba('#ffffff', 0.78),
            color: '#475569',
          }}
        >
          JIANDAN CARD
        </div>
      )}
    </>
  );
};

const renderTemplateChrome = (
  template: Template,
  style: CardStyle
) => {
  const accent = mixColor(style.textColor, '#ffffff', 0.5);
  const warmAccent = mixColor(style.backgroundColor, '#f59e0b', 0.35);

  switch (template.id) {
    case 'quote':
      return (
        <>
          <div
            className="absolute left-8 top-7 text-[132px] font-black leading-none"
            style={{ color: toRgba(style.textColor, 0.08) }}
          >
            "
          </div>
          <div
            className="absolute inset-x-10 bottom-16 h-px"
            style={{ backgroundColor: toRgba(style.textColor, 0.18) }}
          />
          <div
            className="absolute right-10 top-10 h-24 w-24 rounded-full blur-2xl"
            style={{ backgroundColor: toRgba(warmAccent, 0.32) }}
          />
        </>
      );
    case 'book':
      return (
        <>
          <div
            className="absolute inset-y-0 left-0 w-4"
            style={{ backgroundColor: toRgba(style.textColor, 0.08) }}
          />
          <div
            className="absolute left-8 top-8 h-8 w-20 rounded-full"
            style={{ backgroundColor: toRgba(style.textColor, 0.06) }}
          />
          <div
            className="absolute bottom-0 right-0 h-24 w-24"
            style={{
              background: `linear-gradient(135deg, transparent 48%, ${toRgba(style.textColor, 0.06)} 49%, ${toRgba(style.textColor, 0.1)} 100%)`,
            }}
          />
        </>
      );
    case 'iphone-note':
      return (
        <>
          <div
            className="absolute inset-x-0 top-0 h-[52px]"
            style={{
              background: `linear-gradient(180deg, ${toRgba('#ffffff', 0.78)} 0%, ${toRgba('#ffffff', 0.14)} 100%)`,
            }}
          />
          <div
            className="absolute inset-x-0 top-[48px] h-[56px]"
            style={{
              background: IOS_NOTES_CHROME,
              borderBottom: `1px solid ${toRgba(IOS_NOTES_SEPARATOR, 0.78)}`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[94px]"
            style={{
              background: '#f7f7f8',
              borderTop: `1px solid ${toRgba(IOS_NOTES_SEPARATOR, 0.82)}`,
            }}
          />
          <div
            className="absolute left-0 right-0 top-[102px] h-px"
            style={{ backgroundColor: toRgba(IOS_NOTES_SEPARATOR, 0.7) }}
          />
          <div
            className="absolute right-[7px] top-[228px] h-[108px] w-[3px] rounded-full"
            style={{ backgroundColor: toRgba('#3c3c43', 0.24) }}
          />
          <div
            className="absolute bottom-[30px] left-[28px] right-[28px] z-[2] flex items-center justify-between"
            style={{ color: IOS_NOTES_ACCENT }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.2" stroke={IOS_NOTES_ACCENT} strokeWidth="1.8" />
              <path
                d="M8 12L10.9 14.9L16.3 9.3"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M8.7 12.1L12.7 16.1C14.4 17.8 17.1 17.8 18.8 16.1C20.5 14.4 20.5 11.7 18.8 10L14.5 5.7C13.2 4.4 11.1 4.4 9.8 5.7C8.5 7 8.5 9.1 9.8 10.4L13.9 14.5C14.7 15.3 16 15.3 16.8 14.5C17.6 13.7 17.6 12.4 16.8 11.6L13.6 8.4"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="rounded-[8px] px-1.5 py-0.5 text-[17px] font-semibold tracking-[-0.03em]"
              style={{ color: IOS_NOTES_ACCENT }}
            >
              Aa
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.7 7.2H17.3"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M6.7 12H17.3"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M6.7 16.8H13.4"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M16.6 15.3H18.8"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M17.7 14.2V16.4"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 8.6C6 7.4 6.9 6.5 8.1 6.5H15.9C17.1 6.5 18 7.4 18 8.6V15.4C18 16.6 17.1 17.5 15.9 17.5H8.1C6.9 17.5 6 16.6 6 15.4V8.6Z"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
              />
              <circle cx="9.3" cy="9.9" r="1.1" fill={IOS_NOTES_ACCENT} />
              <path
                d="M7.6 15.2L11 11.8L13.2 14L14.7 12.5L16.4 14.2"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.6 17.7L16.5 7.8C17.2 7.1 18.4 7.1 19.1 7.8C19.8 8.5 19.8 9.7 19.1 10.4L9.2 20.3L5.4 21L6.1 17.2L15.4 7.9"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.4 8.9L18 12.5"
                stroke={IOS_NOTES_ACCENT}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </>
      );
    case 'note':
      return (
        <>
          <div
            className="absolute inset-[18px] rounded-[28px] border"
            style={{
              borderColor: toRgba(style.textColor, 0.1),
              background: `linear-gradient(180deg, ${toRgba('#ffffff', 0.18)} 0%, transparent 30%)`,
            }}
          />
          <div
            className="absolute left-[26px] top-[26px] bottom-[26px] w-[12px] rounded-full"
            style={{
              background: `linear-gradient(180deg, ${toRgba('#b65f2c', 0.9)} 0%, ${toRgba('#d28d62', 0.88)} 100%)`,
              boxShadow: `0 10px 24px ${toRgba('#b65f2c', 0.18)}`,
            }}
          />
          <div
            className="absolute right-0 top-0 h-[110px] w-[110px]"
            style={{
              background: `linear-gradient(135deg, transparent 0 52%, ${toRgba('#ffffff', 0.86)} 52% 74%, ${toRgba('#d9c4ae', 0.92)} 74% 100%)`,
            }}
          />
          <div
            className="absolute left-[34px] right-[34px] top-[146px] h-px"
            style={{ backgroundColor: toRgba(style.textColor, 0.12) }}
          />
          <div
            className="absolute bottom-[24px] left-[24px] right-[24px] h-[78px] rounded-[24px] border"
            style={{
              borderColor: toRgba(style.textColor, 0.08),
              background: `linear-gradient(180deg, ${toRgba('#ffffff', 0.44)} 0%, ${toRgba('#f5eee4', 0.72)} 100%)`,
              boxShadow: `inset 0 1px 0 ${toRgba('#ffffff', 0.3)}`,
            }}
          />
          <div
            className="absolute left-[46px] top-[180px] bottom-[120px] w-[1px]"
            style={{ backgroundColor: toRgba(style.textColor, 0.08) }}
          />
          <div
            className="absolute left-[58px] right-[40px] top-[182px] bottom-[120px]"
            style={{
              backgroundImage: `radial-gradient(circle, ${toRgba(style.textColor, 0.12)} 0.6px, transparent 0.6px)`,
              backgroundSize: '14px 14px',
              opacity: 0.3,
            }}
          />
        </>
      );
    case 'poster':
      return (
        <>
          <div
            className="absolute left-[22px] right-[22px] top-[22px] bottom-[22px] rounded-[30px]"
            style={{
              border: `1px solid ${toRgba('#ffffff', 0.46)}`,
              background: `linear-gradient(180deg, ${toRgba('#ffffff', 0.24)} 0%, transparent 32%)`,
            }}
          />
          <div
            className="absolute left-0 top-0 h-[112px] w-[144px] rounded-br-[60px]"
            style={{
              background: `linear-gradient(135deg, ${toRgba('#93c5fd', 0.4)} 0%, ${toRgba('#dbeafe', 0.06)} 100%)`,
            }}
          />
          <div
            className="absolute right-[-22px] top-[148px] h-[118px] w-[118px] rounded-full blur-sm"
            style={{ backgroundColor: toRgba('#fb923c', 0.18) }}
          />
          <div
            className="absolute left-7 right-7 top-[70px] h-px"
            style={{ backgroundColor: toRgba(style.textColor, 0.08) }}
          />
          <div
            className="absolute left-7 top-[92px] rounded-full px-3 py-1 text-[10px] font-bold"
            style={{
              backgroundColor: toRgba('#ffffff', 0.72),
              color: '#ea580c',
            }}
          >
            方法论
          </div>
          <div
            className="absolute left-6 right-6 bottom-[112px] top-[116px] rounded-[30px]"
            style={{
              background: `linear-gradient(145deg, ${toRgba('#fff7d6', 0.4)} 0%, ${toRgba('#ffffff', 0.12)} 100%)`,
              border: `1px solid ${toRgba('#fdba74', 0.22)}`,
              boxShadow: `inset 0 1px 0 ${toRgba('#ffffff', 0.32)}`,
            }}
          />
          <div
            className="absolute right-6 top-[92px] h-7 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em]"
            style={{
              backgroundColor: '#fff7ed',
              color: '#ea580c',
              boxShadow: `0 10px 20px ${toRgba('#fb923c', 0.12)}`,
            }}
          >
            BIG TITLE
          </div>
          <div
            className="absolute bottom-[72px] right-7 grid grid-cols-3 gap-1"
            style={{ opacity: 0.32 }}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: '#f97316' }}
              />
            ))}
          </div>
        </>
      );
    case 'handwriting':
      return (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent 35px, ${toRgba(style.textColor, 0.06)} 36px)`,
            }}
          />
          <div
            className="absolute right-8 top-8 h-14 w-14 rounded-full border-2"
            style={{ borderColor: toRgba(style.textColor, 0.12) }}
          />
          <div
            className="absolute left-7 top-7 h-[calc(100%-56px)] w-[calc(100%-56px)] rounded-[24px] border"
            style={{ borderColor: toRgba(style.textColor, 0.08) }}
          />
        </>
      );
    case 'code':
      return (
        <>
          <div
            className="absolute inset-x-0 top-0 h-14"
            style={{ backgroundColor: toRgba('#020617', 0.34) }}
          />
          <div className="absolute left-5 top-5 flex gap-2">
            {['#fb7185', '#fbbf24', '#34d399'].map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div
            className="absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
            style={{
              color: toRgba('#ffffff', 0.65),
              backgroundColor: toRgba('#ffffff', 0.07),
            }}
          >
            snippet
          </div>
          <div
            className="absolute inset-x-5 bottom-5 top-20 rounded-[18px] border"
            style={{
              borderColor: toRgba('#ffffff', 0.08),
              backgroundImage: `linear-gradient(${toRgba('#ffffff', 0.03)} 1px, transparent 1px), linear-gradient(90deg, ${toRgba('#ffffff', 0.03)} 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
          />
        </>
      );
    default:
      return (
        <>
          <div
            className="absolute inset-x-8 top-8 h-px"
            style={{ backgroundColor: toRgba(style.textColor, 0.08) }}
          />
          <div
            className="absolute right-8 top-8 h-24 w-24 rounded-full blur-2xl"
            style={{ backgroundColor: toRgba(accent, 0.22) }}
          />
        </>
      );
  }
};

export const CardRenderer = forwardRef<HTMLDivElement, CardRendererProps>(
  (
    {
      template,
      content,
      style,
      aspectRatio = template.layout.aspectRatio,
      visibleControls,
      editable = true,
      className,
    },
    ref
  ) => {
    const updateContent = useStore((state) => state.updateContent);
    const selectedTextAreaId = useStore((state) => state.selectedTextAreaId);
    const selectTextArea = useStore((state) => state.selectTextArea);
    const textAreaStyleOverrides = useStore((state) => state.textAreaStyleOverrides);

    const { layout } = template;
    const effectiveAspectRatio =
      aspectRatio === 'auto' ? template.layout.aspectRatio : aspectRatio;
    const baseWidth = layout.width;
    const baseHeight = layout.height;
    const ratioPreset = getAspectRatioPreset(effectiveAspectRatio);
    const targetWidth = ratioPreset.width;
    const targetHeight = ratioPreset.height;
    const scaleX = targetWidth / baseWidth;
    const scaleY = targetHeight / baseHeight;
    const fontScale = Math.min(scaleX, scaleY);
    const paddingDelta = style.padding - template.style.padding;
    const hasGlobalFontOverride = style.fontFamily !== template.style.fontFamily;
    const isVisible = (id: string) =>
      visibleControls?.[id] ?? true;
    const controlIdsByArea = new Map(
      layout.textAreas.map((textArea) => [textArea.id, inferControlId(textArea)])
    );
    const missingControls = new Set<GlobalElementControlId>(
      ['date', 'author'].filter(
        (controlId) =>
          !layout.textAreas.some(
            (textArea) => controlIdsByArea.get(textArea.id) === controlId
          )
      ) as GlobalElementControlId[]
    );

    const rootStyle: CSSProperties = {
      width: targetWidth,
      height: targetHeight,
      color: style.textColor,
      ...getSurfaceStyle(template, style),
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'relative isolate overflow-hidden border border-white/50',
          getFrameClassName(template),
          className
        )}
        style={rootStyle}
        onClick={() => {
          if (editable) {
            selectTextArea(null);
          }
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${toRgba('#ffffff', 0.14)} 0%, transparent 26%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          {renderTemplateChrome(template, style)}
        </div>
        <div className="pointer-events-none absolute inset-0">
          {renderGlobalElements(
            template,
            style,
            (id) => isVisible(id),
            missingControls
          )}
        </div>

        {layout.textAreas.map((textArea) => {
          const controlId = controlIdsByArea.get(textArea.id);
          if (controlId && !isVisible(controlId)) {
            return null;
          }

          const text = content[textArea.id] ?? textArea.defaultText;
          const areaStyle = textArea.style || {};
          const areaOverrides = textAreaStyleOverrides[textArea.id] || {};
          const mergedAreaStyle = { ...areaStyle, ...areaOverrides };
          const hasAreaFontOverride = areaOverrides.fontFamily !== undefined;
          const hasAreaFontSizeOverride = areaOverrides.fontSize !== undefined;
          const hasAreaLineHeightOverride = areaOverrides.lineHeight !== undefined;
          const baseFontSize = mergedAreaStyle.fontSize || style.fontSize;
          const scaledFontSize =
            baseFontSize *
            (hasAreaFontSizeOverride ? 1 : style.fontSizeScale) *
            fontScale;
          const lineHeight = hasAreaLineHeightOverride
            ? mergedAreaStyle.lineHeight || style.lineHeight
            : (mergedAreaStyle.lineHeight || style.lineHeight) +
              style.lineHeightOffset / 100;

          const textStyle: CSSProperties = {
            position: 'absolute',
            left: (textArea.position.x + paddingDelta) * scaleX,
            top: (textArea.position.y + paddingDelta) * scaleY,
            width: adjustWidth(textArea.width, paddingDelta, scaleX),
            fontFamily: hasAreaFontOverride
              ? getFontFamily(areaOverrides.fontFamily as string)
              : hasGlobalFontOverride
              ? getFontFamily(style.fontFamily)
              : mergedAreaStyle.fontFamily
                ? getFontFamily(mergedAreaStyle.fontFamily)
                : getFontFamily(style.fontFamily),
            fontSize: scaledFontSize,
            fontWeight: mergedAreaStyle.fontWeight || 400,
            lineHeight,
            textAlign: mergedAreaStyle.textAlign || 'left',
            color: mergedAreaStyle.color || style.textColor,
            zIndex: 2,
          };

          if (editable) {
            return (
              <EditableText
                key={textArea.id}
                id={textArea.id}
                text={text}
                onTextChange={updateContent}
                onSelect={selectTextArea}
                selected={selectedTextAreaId === textArea.id}
                style={textStyle}
              />
            );
          }

          return (
            <div
              key={textArea.id}
              style={{
                ...textStyle,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    );
  }
);

CardRenderer.displayName = 'CardRenderer';
