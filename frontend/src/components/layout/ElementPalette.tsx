import React from 'react';
import { ElementType } from '../../types';

interface ElementPaletteProps {
  onAddElement: (type: ElementType) => void;
  isPreviewMode: boolean;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({ onAddElement, isPreviewMode }) => {
  return (
    <div className="flex-shrink-0 flex flex-col gap-4">
      {/* Element Controls */}
      <div className="bg-white rounded-lg shadow-md border p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add...</h3>
        
        <div className="flex flex-col space-y-3">
          <button 
            className={`w-24 px-3 py-2 text-white transition-colors duration-200 rounded-lg ${
              isPreviewMode 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            onClick={() => onAddElement("text")}
            disabled={isPreviewMode}
          >
            Text
          </button>
          <button 
            className={`w-24 px-3 py-2 text-white transition-colors duration-200 rounded-lg ${
              isPreviewMode 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            onClick={() => onAddElement("image")}
            disabled={isPreviewMode}
          >
            Image
          </button>
          <button 
            className={`w-24 px-3 py-2 text-white transition-colors duration-200 rounded-lg ${
              isPreviewMode 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            onClick={() => onAddElement("button")}
            disabled={isPreviewMode}
          >
            Button
          </button>
        </div>
      </div>
    </div>
  );
}; 