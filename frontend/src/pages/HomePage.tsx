import React, { useState, useEffect, useRef } from 'react';
import { Element, ElementType } from '../types';
import { createElement, calculateGridPosition, calculateGridResize, willElementCollide } from '../services/elementService';
import { TextElement } from '../components/elements/TextElement';
import { ImageElement } from '../components/elements/ImageElement';
import { ButtonElement } from '../components/elements/ButtonElement';
import { UserBadge } from '../components/UserBadge';

const GRID_SIZE = 10;

export const HomePage: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Element[]>([]);

  // Keep the ref in sync with the state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  const addElement = (type: ElementType) => {
    if (isPreviewMode) return; // Disable adding elements in preview mode
    const newElement = createElement(type, 0, 0);
    setElements((prev) => [...prev, newElement]);
  };

  const startDrag = (id: string, e: React.MouseEvent) => {
    if (isPreviewMode) return; // Disable dragging in preview mode
    const elementsSnapshot = [...elements];
    const startX = e.clientX;
    const startY = e.clientY;

    const el = elements.find((el) => el.id === id);
    if (!el) return;

    const origX = el.x;
    const origY = el.y;

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = calculateGridPosition(
        origX, 
        origY, 
        e.clientX, 
        e.clientY, 
        startX, 
        startY, 
        el.width, 
        el.height
      );
      
      setElements((prev) =>
        prev.map((el) =>
          el.id === id
            ? { ...el, x, y }
            : el
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      const movedElement = elementsRef.current.find((el) => el.id === id);
      if (willElementCollide(movedElement, elementsRef.current)) {
        setElements(elementsSnapshot);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (id: string, e: React.MouseEvent) => {
    if (isPreviewMode) return; // Disable resizing in preview mode
    e.stopPropagation(); // Prevent triggering drag
    const elementsSnapshot = [...elements];
    const startX = e.clientX;
    const startY = e.clientY;

    const el = elements.find((el) => el.id === id);
    if (!el) return;

    const origWidth = el.width;
    const origHeight = el.height;

    const onMouseMove = (e: MouseEvent) => {
      const { width, height } = calculateGridResize(
        origWidth, 
        origHeight, 
        e.clientX, 
        e.clientY, 
        startX, 
        startY, 
        el.x, 
        el.y
      );

      setElements((prev) =>
        prev.map((el) =>
          el.id === id
            ? { ...el, width, height }
            : el
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      const resizedElement = elementsRef.current.find((el) => el.id === id);
      if (willElementCollide(resizedElement, elementsRef.current)) {
        setElements(elementsSnapshot);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderElement = (element: Element) => {
    const commonProps = {
      isPreviewMode,
      onMouseDown: (e: React.MouseEvent) => startDrag(element.id, e),
      onResize: (e: React.MouseEvent) => startResize(element.id, e),
    };

    switch (element.type) {
      case 'text':
        return <TextElement key={element.id} element={element as any} {...commonProps} />;
      case 'image':
        return <ImageElement key={element.id} element={element as any} {...commonProps} />;
      case 'button':
        return <ButtonElement key={element.id} element={element as any} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* User Badge - Top Right Corner */}
      <div className="absolute top-4 right-4 z-10">
        <UserBadge />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <button 
              className={`px-4 py-2 text-white transition-colors duration-200 ${
                isPreviewMode 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={() => addElement("text")}
              disabled={isPreviewMode}
            >
              Add Text
            </button>
            <button 
              className={`px-4 py-2 text-white transition-colors duration-200 ${
                isPreviewMode 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={() => addElement("image")}
              disabled={isPreviewMode}
            >
              Add Image
            </button>
            <button 
              className={`px-4 py-2 text-white transition-colors duration-200 ${
                isPreviewMode 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
              onClick={() => addElement("button")}
              disabled={isPreviewMode}
            >
              Add Button
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Preview Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Preview</label>
              <input
                type="checkbox"
                checked={isPreviewMode}
                onChange={(e) => setIsPreviewMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div
              ref={canvasRef}
              className="relative w-[800px] h-[600px] bg-gray-100 border border-gray-400"
              style={{ 
                backgroundSize: isPreviewMode ? '0px 0px' : `${GRID_SIZE}px ${GRID_SIZE}px`, 
                backgroundImage: isPreviewMode ? 'none' : "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)" 
              }}
            >
              {elements.map(renderElement)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 