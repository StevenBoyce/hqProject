import React from 'react';
import { ButtonElement as ButtonElementType } from '../../types';

interface ButtonElementProps {
  element: ButtonElementType;
  onMouseDown: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
  isPreviewMode: boolean;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({ 
  element, 
  onMouseDown, 
  onResize, 
  isPreviewMode 
}) => {
  return (
    <div
      className={`absolute border-2 border-purple-500 bg-purple-100 ${
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
      <button
        className="w-full h-full bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600 transition-colors"
        disabled={isPreviewMode}
      >
        {element.text}
      </button>
      {!isPreviewMode && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-purple-600 cursor-se-resize"
          onMouseDown={onResize}
        />
      )}
    </div>
  );
}; 