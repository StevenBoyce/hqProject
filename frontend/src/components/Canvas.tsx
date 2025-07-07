import React, { useRef, useEffect } from 'react';
import { Element } from '../types';
import { calculateGridPosition, calculateGridResize, willElementCollide } from '../utils/elementUtils';
import { TextElement } from './elements/TextElement';
import { ImageElement } from './elements/ImageElement';
import { ButtonElement } from './elements/ButtonElement';
import { HistoryAction } from '../utils/historyUtils';

interface CanvasProps {
  elements: Element[];
  setElements: (elements: Element[] | ((prev: Element[]) => Element[])) => void;
  isPreviewMode: boolean;
  isReadOnly?: boolean;
  onElementUpdate?: (elementId: string, updates: Partial<Element>) => void;
  onElementDelete?: (elementId: string) => void;
  onHistoryAction?: (action: HistoryAction) => void;
  canvasRef?: React.RefObject<HTMLDivElement>;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  setElements,
  isPreviewMode,
  isReadOnly = false,
  onElementUpdate,
  onElementDelete,
  onHistoryAction,
  canvasRef: externalCanvasRef
}) => {
  const internalCanvasRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Element[]>([]);
  const canvasRef = externalCanvasRef || internalCanvasRef;

  // Keep the ref in sync with the state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  const startDrag = (id: string, e: React.MouseEvent) => {
    if (isPreviewMode || isReadOnly) return; // Disable dragging in preview/read-only mode
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
      } else {
        // Track successful move in history
        if (onHistoryAction) {
          const action: HistoryAction = {
            type: 'MOVE',
            elementId: id,
            previousState: elementsSnapshot,
            newState: elementsRef.current,
            description: `Move ${movedElement?.type || 'element'}`,
          };
          onHistoryAction(action);
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startResize = (id: string, e: React.MouseEvent) => {
    if (isPreviewMode || isReadOnly) return; // Disable resizing in preview/read-only mode
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
      } else {
        // Track successful resize in history
        if (onHistoryAction) {
          const action: HistoryAction = {
            type: 'RESIZE',
            elementId: id,
            previousState: elementsSnapshot,
            newState: elementsRef.current,
            description: `Resize ${resizedElement?.type || 'element'}`,
          };
          onHistoryAction(action);
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderElement = (element: Element) => {
    const commonProps = {
      isPreviewMode: isPreviewMode || isReadOnly,
      onMouseDown: (e: React.MouseEvent) => startDrag(element.id, e),
      onResize: (e: React.MouseEvent) => startResize(element.id, e),
      onUpdate: onElementUpdate,
      onDelete: onElementDelete,
    };

    switch (element.type) {
      case 'text':
        return <TextElement key={element.id} element={element as import('../types').TextElement} {...commonProps} />;
      case 'image':
        return <ImageElement key={element.id} element={element as import('../types').ImageElement} {...commonProps} />;
      case 'button':
        return <ButtonElement key={element.id} element={element as import('../types').ButtonElement} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1">
      <div
        ref={canvasRef}
        className="w-full h-full relative bg-gray-100 border border-gray-400 rounded-lg"
        style={{ 
          backgroundImage: (isPreviewMode || isReadOnly) ? 'none' : "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)" 
        }}
      >
        {elements.map(renderElement)}
      </div>
    </div>
  );
}; 