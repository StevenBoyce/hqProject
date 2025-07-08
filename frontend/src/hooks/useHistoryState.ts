import { useState, useEffect } from 'react';
import { Element } from '../types';
import { historyService, HistoryAction } from '../utils/historyUtils';

export const useHistoryState = () => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateHistoryState = () => {
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
  };

  const addHistoryAction = (action: HistoryAction) => {
    historyService.addAction(action);
    updateHistoryState();
  };

  const undo = (setElements: (elements: Element[] | ((prev: Element[]) => Element[])) => void) => {
    const action = historyService.undo();
    if (!action) return;

    switch (action.type) {
      case 'ADD':
        setElements((prev) => prev.filter((el) => el.id !== action.elementId));
        break;
      case 'DELETE':
        if (action.element) {
          setElements((prev) => [...prev, action.element!]);
        }
        break;
      case 'UPDATE':
        // Apply the previous state
        if (action.previousState && action.previousState.length > 0) {
          const previousElement = action.previousState[0]; // Get the first (and only) element
          if (previousElement) {
            setElements(prev => {
              const newElements = prev.map(el => 
                el.id === action.elementId 
                  ? previousElement
                  : el
              );
              return newElements;
            });
          }
        }
        break;
      case 'MOVE':
      case 'RESIZE':
        // Apply the previous state
        if (action.previousState) {
          setElements(action.previousState);
        }
        break;
    }
    
    updateHistoryState();
  };

  const redo = (setElements: (elements: Element[] | ((prev: Element[]) => Element[])) => void) => {
    const action = historyService.redo();
    if (!action) return;

    switch (action.type) {
      case 'ADD':
        if (action.element) {
          setElements((prev) => [...prev, action.element!]);
        }
        break;
      case 'DELETE':
        setElements((prev) => prev.filter((el) => el.id !== action.elementId));
        break;
      case 'UPDATE':
        // Apply the new state
        if (action.newState && action.newState.length > 0) {
          const newElement = action.newState[0]; // Get the first (and only) element
          if (newElement) {
            setElements(prev => {
              const newElements = prev.map(el => 
                el.id === action.elementId 
                  ? newElement
                  : el
              );
              return newElements;
            });
          }
        }
        break;
      case 'MOVE':
      case 'RESIZE':
        // Apply the new state
        if (action.newState) {
          setElements(action.newState);
        }
        break;
    }
    
    updateHistoryState();
  };

  const clearHistory = () => {
    historyService.clear();
    updateHistoryState();
  };

  return {
    // State
    canUndo,
    canRedo,
    
    // Operations
    addHistoryAction,
    undo,
    redo,
    clearHistory,
    updateHistoryState,
  };
}; 