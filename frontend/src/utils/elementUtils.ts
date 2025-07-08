import { Element, DraggableElement } from '../types';

const GRID_SIZE = 10;

// Pure function to check if two rectangles overlap
export const doRectanglesOverlap = (rect1: DraggableElement, rect2: DraggableElement): boolean => {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect1.x >= rect2.x + rect2.width ||
    rect1.y + rect1.height <= rect2.y ||
    rect1.y >= rect2.y + rect2.height
  );
};

// Pure function to check if an element will collide with any other elements
export const willElementCollide = (
  element: DraggableElement | undefined, 
  allElements: DraggableElement[]
): boolean => {
  if (!element) return false;
  
  for (const otherElement of allElements) {
    if (element.id !== otherElement.id) {
      if (doRectanglesOverlap(element, otherElement)) {
        return true;
      }
    }
  }
  return false;
};

// Pure function to snap coordinates to grid
export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

// Pure function to clamp value to bounds
export const clampToBounds = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Pure function to clamp element position to canvas bounds
export const clampElementToCanvas = (
  element: DraggableElement, 
  canvasWidth: number, 
  canvasHeight: number
): DraggableElement => {
  return {
    ...element,
    x: clampToBounds(element.x, 0, canvasWidth - element.width),
    y: clampToBounds(element.y, 0, canvasHeight - element.height),
  };
};

// Pure function to calculate grid-snapped position from mouse movement
export const calculateGridPosition = (
  originalElementX: number,
  originalElementY: number,
  mouseX: number,
  mouseY: number,
  startMouseX: number,
  startMouseY: number,
  elementWidth: number,
  elementHeight: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } => {
  const dx = mouseX - startMouseX;
  const dy = mouseY - startMouseY;
  
  const newX = originalElementX + dx;
  const newY = originalElementY + dy;
  
  const snappedX = snapToGrid(newX);
  const snappedY = snapToGrid(newY);
  
  return {
    x: clampToBounds(snappedX, 0, canvasWidth - elementWidth),
    y: clampToBounds(snappedY, 0, canvasHeight - elementHeight),
  };
};

// Pure function to calculate grid-snapped resize dimensions
export const calculateGridResize = (
  startWidth: number,
  startHeight: number,
  mouseX: number,
  mouseY: number,
  startMouseX: number,
  startMouseY: number,
  elementX: number,
  elementY: number,
  canvasWidth: number,
  canvasHeight: number
): { width: number; height: number } => {
  const dx = mouseX - startMouseX;
  const dy = mouseY - startMouseY;
  
  const newWidth = Math.max(GRID_SIZE, startWidth + snapToGrid(dx));
  const newHeight = Math.max(GRID_SIZE, startHeight + snapToGrid(dy));
  
  return {
    width: clampToBounds(newWidth, GRID_SIZE, canvasWidth - elementX),
    height: clampToBounds(newHeight, GRID_SIZE, canvasHeight - elementY),
  };
};

// Pure function to create a new element with default properties
export const createElement = (type: Element['type'], x: number, y: number): Element => {
  const baseElement: DraggableElement = {
    id: crypto.randomUUID(),
    type,
    x: snapToGrid(x),
    y: snapToGrid(y),
    width: GRID_SIZE * 5,
    height: GRID_SIZE * 4,
  };

  switch (type) {
    case 'text':
      return {
        ...baseElement,
        text: 'Text Box',
        fontSize: 14,
        fontFamily: 'Arial',
      };
    case 'image':
      return {
        ...baseElement,
        src: '/placeholder-image.jpg',
        alt: 'Image',
      };
    case 'button':
      return {
        ...baseElement,
        text: 'Button',
        onClick: () => console.log('Button clicked'),
      };
    default:
      throw new Error(`Unknown element type: ${type}`);
  }
}; 