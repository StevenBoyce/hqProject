import React, { useState, useEffect } from 'react';
import { ImageElement as ImageElementType } from '../../types';

interface ImageElementProps {
  element: ImageElementType;
  isPreviewMode: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({ 
  element, 
  isPreviewMode, 
  onMouseDown, 
  onResize 
}) => {
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate random photo ID when component mounts
  useEffect(() => {
    if (!photoId) {
      setPhotoId(Math.floor(Math.random() * 401)); // 0-400
    }
  }, [photoId]);

  // Generate Picsum URL based on element dimensions and photo ID
  const getPicsumUrl = () => {
    if (!photoId) return '';
    
    const width = Math.round(element.width);
    const height = Math.round(element.height);
    
    // If width and height are the same, use single dimension
    if (width === height) {
      return `https://picsum.photos/id/${photoId}/${width}`;
    }
    
    return `https://picsum.photos/id/${photoId}/${width}/${height}`;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageLoaded(false);
  };

  // Start loading when entering preview mode
  useEffect(() => {
    if (isPreviewMode && photoId && !imageLoaded) {
      setIsLoading(true);
    }
  }, [isPreviewMode, photoId, imageLoaded]);

  return (
    <div
      className={`absolute border bg-white overflow-hidden ${
        isPreviewMode ? 'border-transparent' : 'border-gray-300 cursor-move'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onMouseDown={isPreviewMode ? undefined : onMouseDown}
    >
      {isPreviewMode ? (
        <>
          {isLoading && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
          {photoId && (
            <img
              src={getPicsumUrl()}
              alt={element.alt}
              className={`w-full h-full object-cover ${isLoading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
            />
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span>{element.alt}</span>
        </div>
      )}
      
      {/* Resize handle - only show when not in preview mode */}
      {!isPreviewMode && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 cursor-se-resize"
          onMouseDown={onResize}
        />
      )}
    </div>
  );
}; 