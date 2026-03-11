import React, { FC, useCallback } from 'react';
import clsx from 'clsx';

interface EditableTextProps {
  id: string;
  text: string;
  onTextChange: (id: string, text: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EditableText: FC<EditableTextProps> = ({
  id,
  text,
  onTextChange,
  className,
  style,
}) => {
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      const newText = e.currentTarget.textContent || '';
      onTextChange(id, newText);
    },
    [id, onTextChange]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    // 允许 Enter 键换行
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={clsx('outline-none', className)}
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
