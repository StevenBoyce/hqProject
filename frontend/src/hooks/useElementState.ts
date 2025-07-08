import { useState, useRef, useEffect } from 'react';
import { Element, ElementType } from '../types';
import { createElement } from '../utils/elementUtils';
import { HistoryAction } from '../utils/historyUtils';

export const useElementState = (
  addHistoryAction: (action: HistoryAction) => void
) => {
  const [elements, setElements] = useState<Element[]>([]);
  const elementsRef = useRef<Element[]>([]);

  // Keep the ref in sync with the state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  const addElement = (type: ElementType) => {
    const newElement = createElement(type, 0, 0);
    
    // Track history
    const action: HistoryAction = {
      type: 'ADD',
      elementId: newElement.id,
      element: newElement,
      description: `Add ${type} element`,
    };
    addHistoryAction(action);
    
    setElements((prev) => [...prev, newElement]);
  };

  const updateElement = (elementId: string, updates: Partial<Element>) => {
    const currentElement = elements.find(el => el.id === elementId);
    if (!currentElement) return;
    
    // Calculate the new state directly
    const newElements = elements.map((el) =>
      el.id === elementId
        ? { ...el, ...updates }
        : el
    );
    
    setElements(newElements);

    // Track update in history - store only the specific element
    const action: HistoryAction = {
      type: 'UPDATE',
      elementId,
      previousState: [currentElement], // Store only the previous element
      newState: [newElements.find(el => el.id === elementId)!], // Store only the new element
      description: `Update ${updates.type || 'element'}`,
    };
    addHistoryAction(action);
  };

  const deleteElement = (elementId: string) => {
    const deletedElement = elements.find((el) => el.id === elementId);
    
    setElements((prev) => prev.filter((el) => el.id !== elementId));

    // Track deletion in history
    const action: HistoryAction = {
      type: 'DELETE',
      elementId,
      element: deletedElement!,
      description: `Delete ${deletedElement?.type || 'element'}`,
    };
    addHistoryAction(action);
  };

  const setElementsWithHistory = (newElements: Element[] | ((prev: Element[]) => Element[])) => {
    setElements(newElements);
  };

  return {
    // State
    elements,
    elementsRef,
    
    // Operations
    addElement,
    updateElement,
    deleteElement,
    setElements: setElementsWithHistory,
  };
}; 