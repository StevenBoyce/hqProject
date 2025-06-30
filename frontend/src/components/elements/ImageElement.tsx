import React, { useState, useEffect } from 'react';
import { ImageElement as ImageElementType } from '../../types';
import { CanvasElement } from './CanvasElement';
import { DeleteButton } from './DeleteButton';
import { ResizeHandle } from './ResizeHandle';

interface ImageElementProps {
  element: ImageElementType;
  isPreviewMode: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResize: (e: React.MouseEvent) => void;
  onDelete?: (elementId: string) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({ 
  element, 
  isPreviewMode, 
  onMouseDown, 
  onResize,
  onDelete
}) => {
  const [photoId, setPhotoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

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

  // Fallback image URL using a different service
  const getFallbackUrl = () => {
    const width = Math.round(element.width);
    const height = Math.round(element.height);
    return `https://via.placeholder.com/${width}x${height}/cccccc/666666?text=Image`;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    setIsLoading(false);
    setImageLoaded(false);
    
    // If picsum.photos failed, try fallback
    if (!useFallback && e.currentTarget.src.includes('picsum.photos')) {
      console.log('Switching to fallback image service');
      setUseFallback(true);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(element.id);
    }
  };

  // Start loading when entering preview mode
  useEffect(() => {
    if (isPreviewMode && photoId && !imageLoaded) {
      setIsLoading(true);
      const imageUrl = useFallback ? getFallbackUrl() : getPicsumUrl();
      console.log('Loading image:', imageUrl);
    }
  }, [isPreviewMode, photoId, imageLoaded, useFallback]);

  // Reset fallback when photoId changes
  useEffect(() => {
    setUseFallback(false);
  }, [photoId]);

  return (
    <CanvasElement
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      onMouseDown={isPreviewMode ? undefined : onMouseDown}
      isPreviewMode={isPreviewMode}
      topRightOverlay={!isPreviewMode ? <DeleteButton onDelete={handleDelete} /> : undefined}
      bottomRightOverlay={!isPreviewMode ? <ResizeHandle onMouseDown={onResize} /> : undefined}
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
              src={useFallback ? getFallbackUrl() : getPicsumUrl()}
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
    </CanvasElement>
  );
}; 