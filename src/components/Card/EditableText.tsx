import React, { FC, useCallback } from 'react';
import clsx from 'clsx';

const EMPTY_TEXT_SENTINEL = '\u200B';

interface EditableTextProps {
  id: string;
  text: string;
  onTextChange: (id: string, text: string) => void;
  onSelect?: (id: string) => void;
  className?: string;
  selected?: boolean;
  style?: React.CSSProperties;
}

export const EditableText: FC<EditableTextProps> = ({
  id,
  text,
  onTextChange,
  onSelect,
  className,
  selected = false,
  style,
}) => {
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      const newText = (e.currentTarget.textContent || '').replace(
        /\u200B/g,
        ''
      );
      onTextChange(id, newText);
    },
    [id, onTextChange]
  );

  const handleSelect = useCallback(
    (e?: React.SyntheticEvent<HTMLElement>) => {
      e?.stopPropagation();
      onSelect?.(id);
    },
    [id, onSelect]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    // 允许 Enter 键换行
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  }, []);

  const minHeight =
    typeof style?.lineHeight === 'number' ? `${style.lineHeight}em` : '1em';

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onClick={handleSelect}
      onFocus={handleSelect}
      onKeyDown={handleKeyDown}
      className={clsx('outline-none', className)}
      style={{
        display: 'block',
        minHeight,
        cursor: 'text',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        outline: selected ? '2px solid rgba(14, 165, 233, 0.65)' : 'none',
        outlineOffset: '4px',
        borderRadius: 8,
        ...style,
      }}
    >
      {text || EMPTY_TEXT_SENTINEL}
    </div>
  );
};
