import React from 'react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  className?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ 
  onMouseDown, 
  className = '' 
}) => {
  return (
    <div
      className={`w-3 h-3 bg-gray-800 cursor-se-resize ${className}`}
      onMouseDown={onMouseDown}
    />
  );
}; 