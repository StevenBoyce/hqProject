import React, { useState, useRef, useEffect } from 'react';
import { TextElement as TextElementType } from '../../types';
import { sanitizeElementText } from '../../utils/sanitize';

interface TextElementProps {
  element: TextElementType;
  onMouseDown: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
  isPreviewMode: boolean;
  onUpdate?: (elementId: string, updates: Partial<TextElementType>) => void;
}

export const TextElement: React.FC<TextElementProps> = ({ 
  element, 
  onMouseDown, 
  onResize, 
  isPreviewMode,
  onUpdate 
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

  return (
    <div
      className={`absolute border bg-white p-2 overflow-hidden ${
        isPreviewMode ? 'border-transparent' : 'border-gray-300 cursor-move'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
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
      {!isPreviewMode && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 cursor-se-resize"
          onMouseDown={onResize}
        />
      )}
    </div>
  );
}; 