import React, { ReactNode } from 'react';

interface CanvasElementProps {
  // Element positioning and sizing
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Interaction handlers
  onMouseDown?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  
  // State
  isPreviewMode: boolean;
  
  // Content slot
  children: ReactNode;
  
  // Overlay slots
  topLeftOverlay?: ReactNode;
  topRightOverlay?: ReactNode;
  bottomLeftOverlay?: ReactNode;
  bottomRightOverlay?: ReactNode;
  
  // Additional styling
  className?: string;
  style?: React.CSSProperties;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  x,
  y,
  width,
  height,
  onMouseDown,
  onDoubleClick,
  isPreviewMode,
  children,
  topLeftOverlay,
  topRightOverlay,
  bottomLeftOverlay,
  bottomRightOverlay,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`absolute border bg-white overflow-hidden group ${className} ${
        isPreviewMode ? 'border-transparent' : 'border-gray-300 cursor-move'
      }`}
      style={{
        left: x,
        top: y,
        width,
        height,
        ...style,
      }}
      onMouseDown={isPreviewMode ? undefined : onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {/* Main content */}
      {children}
      
      {/* Overlay slots - only show when not in preview mode */}
      {!isPreviewMode && (
        <>
          {topLeftOverlay && (
            <div className="absolute top-0 left-0 z-10">
              {topLeftOverlay}
            </div>
          )}
          
          {topRightOverlay && (
            <div className="absolute top-0 right-0 z-10">
              {topRightOverlay}
            </div>
          )}
          
          {bottomLeftOverlay && (
            <div className="absolute bottom-0 left-0 z-10">
              {bottomLeftOverlay}
            </div>
          )}
          
          {bottomRightOverlay && (
            <div className="absolute bottom-0 right-0 z-10">
              {bottomRightOverlay}
            </div>
          )}
        </>
      )}
    </div>
  );
}; 