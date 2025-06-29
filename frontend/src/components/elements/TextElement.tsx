import React from 'react';
import { TextElement as TextElementType } from '../../types';

interface TextElementProps {
  element: TextElementType;
  onMouseDown: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
  isPreviewMode: boolean;
}

export const TextElement: React.FC<TextElementProps> = ({ 
  element, 
  onMouseDown, 
  onResize, 
  isPreviewMode 
}) => {
  return (
    <div
      className={`absolute border-2 border-blue-500 bg-blue-100 p-2 ${
        isPreviewMode ? '' : 'cursor-move'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onMouseDown={onMouseDown}
    >
      <div className="text-sm font-bold mb-1">Text Element</div>
      {!isPreviewMode && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
          onMouseDown={onResize}
        />
      )}
    </div>
  );
}; 