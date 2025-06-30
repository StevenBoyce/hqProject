import React, { useState, useRef, useEffect } from 'react';
import { TextElement as TextElementType } from '../../types';
import { sanitizeElementText } from '../../utils/sanitize';
import { CanvasElement } from './CanvasElement';
import { DeleteButton } from './DeleteButton';
import { ResizeHandle } from './ResizeHandle';

interface TextElementProps {
  element: TextElementType;
  onMouseDown: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
  isPreviewMode: boolean;
  onUpdate?: (elementId: string, updates: Partial<TextElementType>) => void;
  onDelete?: (elementId: string) => void;
}

export const TextElement: React.FC<TextElementProps> = ({ 
  element, 
  onMouseDown, 
  onResize, 
  isPreviewMode,
  onUpdate,
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    setIsEditing(true);
    setEditText(element.text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (editText !== element.text && onUpdate) {
      onUpdate(element.id, { text: sanitizeElementText(editText) });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (editText !== element.text && onUpdate) {
        onUpdate(element.id, { text: sanitizeElementText(editText) });
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(element.text); // Reset to original text
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(element.id);
    }
  };

  return (
    <CanvasElement
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
      isPreviewMode={isPreviewMode}
      className="p-2"
      topRightOverlay={!isPreviewMode ? <DeleteButton onDelete={handleDelete} /> : undefined}
      bottomRightOverlay={!isPreviewMode ? <ResizeHandle onMouseDown={onResize} /> : undefined}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="w-full h-full bg-transparent border-none outline-none text-sm font-bold"
          style={{
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
          }}
        />
      ) : (
        <div 
          className="text-sm font-bold mb-1"
          style={{
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
          }}
        >
          {element.text}
        </div>
      )}
    </CanvasElement>
  );
}; 