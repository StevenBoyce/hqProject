import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Element, ElementType } from '../types';
import { createElement, calculateGridPosition, calculateGridResize, willElementCollide } from '../services/elementService';
import { TextElement } from '../components/elements/TextElement';
import { ImageElement } from '../components/elements/ImageElement';
import { ButtonElement } from '../components/elements/ButtonElement';
import { UndoIcon, RedoIcon } from '../icons';
import { Layout, layoutService } from '../services/layoutService';
import { sanitizeLayoutName } from '../utils/sanitize';
import { historyService, HistoryAction } from '../services/historyService';

const GRID_SIZE = 10;

export const HomePage: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<Layout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState<string>('');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Element[]>([]);
  const location = useLocation();

  // Keep the ref in sync with the state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  // Clear history on initial load
  useEffect(() => {
    historyService.clear();
  }, []);

  // Check for selected layout or template from dashboard
  useEffect(() => {
    if (location.state?.selectedLayout) {
      const layout = location.state.selectedLayout as Layout;
      setCurrentLayout(layout);
      setElements(layout.content);
      setLayoutName(layout.name);
      // Clear the state to prevent re-loading on refresh
      window.history.replaceState({}, document.title);
    } else if (location.state?.templateElements) {
      // Handle template elements
      setCurrentLayout(null); // No existing layout since this is a new copy
      setElements(location.state.templateElements);
      setLayoutName(location.state.templateName || 'New Layout');
      // Clear the state to prevent re-loading on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Update layout name when current layout changes
  useEffect(() => {
    if (currentLayout) {
      setLayoutName(currentLayout.name);
    }
    // Don't clear layout name when currentLayout is null, as it might be set by template
  }, [currentLayout]);

  // Update undo/redo state when history changes
  useEffect(() => {
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
  }, [elements]); // Re-check when elements change

  const addElement = (type: ElementType) => {
    if (isPreviewMode) return; // Disable adding elements in preview mode
    const newElement = createElement(type, 0, 0);
    
    // Track history
    const action: HistoryAction = {
      type: 'ADD',
      elementId: newElement.id,
      element: newElement,
      description: `Add ${type} element`,
    };
    historyService.addAction(action);
    
    setElements((prev) => [...prev, newElement]);
    
    // Update undo/redo state immediately
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
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
      } else {
        // Track successful move in history
        const action: HistoryAction = {
          type: 'MOVE',
          elementId: id,
          previousState: elementsSnapshot,
          newState: elementsRef.current,
          description: `Move ${movedElement?.type || 'element'}`,
        };
        historyService.addAction(action);
        // Update undo/redo state immediately
        setCanUndo(historyService.canUndo());
        setCanRedo(historyService.canRedo());
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
      } else {
        // Track successful resize in history
        const action: HistoryAction = {
          type: 'RESIZE',
          elementId: id,
          previousState: elementsSnapshot,
          newState: elementsRef.current,
          description: `Resize ${resizedElement?.type || 'element'}`,
        };
        historyService.addAction(action);
        // Update undo/redo state immediately
        setCanUndo(historyService.canUndo());
        setCanRedo(historyService.canRedo());
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleSaveLayout = async () => {
    if (elements.length === 0) {
      setSaveError('Cannot save empty layout');
      return;
    }

    if (!layoutName.trim()) {
      setSaveError('Please enter a layout name');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const sanitizedName = sanitizeLayoutName(layoutName.trim());
      
      if (currentLayout) {
        console.log('Current layout:', currentLayout)
        console.log('Layout ID being sent:', currentLayout.id)
        // Update existing layout
        const updatedLayout = await layoutService.updateLayout(currentLayout.id, sanitizedName, elements);
        setCurrentLayout(updatedLayout);
      } else {
        console.log("creating new layout")
        // Create new layout
        const newLayout = await layoutService.createLayout(sanitizedName, elements);
        setCurrentLayout(newLayout);
      }
      
      setLayoutName(sanitizedName);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save layout');
    } finally {
      setIsSaving(false);
    }
  };

  const handleElementUpdate = (elementId: string, updates: Partial<Element>) => {
    const elementsSnapshot = [...elements];
    
    setElements((prev) =>
      prev.map((el) =>
        el.id === elementId
          ? { ...el, ...updates }
          : el
      )
    );

    // Track update in history
    const action: HistoryAction = {
      type: 'UPDATE',
      elementId,
      previousState: elementsSnapshot,
      newState: elementsRef.current,
      description: `Update ${updates.type || 'element'}`,
    };
    historyService.addAction(action);
    
    // Update undo/redo state immediately
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
  };

  const handleElementDelete = (elementId: string) => {
    const deletedElement = elements.find((el) => el.id === elementId);
    
    setElements((prev) => prev.filter((el) => el.id !== elementId));

    // Track deletion in history
    const action: HistoryAction = {
      type: 'DELETE',
      elementId,
      element: deletedElement!,
      description: `Delete ${deletedElement?.type || 'element'}`,
    };
    historyService.addAction(action);
    
    // Update undo/redo state immediately
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
  };

  const handleUndo = () => {
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
        if (action.previousState) {
          setElements(prev => 
            prev.map(el => 
              el.id === action.elementId 
                ? action.previousState![0] 
                : el
            )
          );
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
    
    // Update undo/redo state immediately
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
  };

  const handleRedo = () => {
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
        if (action.newState) {
          setElements(prev => 
            prev.map(el => 
              el.id === action.elementId 
                ? action.newState![0] 
                : el
            )
          );
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
    
    // Update undo/redo state immediately
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
  };

  const renderElement = (element: Element) => {
    const commonProps = {
      isPreviewMode,
      onMouseDown: (e: React.MouseEvent) => startDrag(element.id, e),
      onResize: (e: React.MouseEvent) => startResize(element.id, e),
      onUpdate: handleElementUpdate,
      onDelete: handleElementDelete,
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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Layout Name and Preview Controls */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-md">
              <input
                id="layoutName"
                type="text"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                placeholder="Enter layout name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isPreviewMode}
              />
            </div>
            
            <button
              onClick={handleSaveLayout}
              disabled={isSaving || isPreviewMode || elements.length === 0 || !layoutName.trim()}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
                isSaving || isPreviewMode || elements.length === 0 || !layoutName.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              onClick={handleUndo}
              disabled={!canUndo || isPreviewMode}
              className={`px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                !canUndo || isPreviewMode
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title="Undo"
            >
              <UndoIcon size={18} className="text-white" />
            </button>

            <button
              onClick={handleRedo}
              disabled={!canRedo || isPreviewMode}
              className={`px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                !canRedo || isPreviewMode
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title="Redo"
            >
              <RedoIcon size={18} className="text-white" />
            </button>

          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Preview Mode</label>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isPreviewMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={isPreviewMode}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isPreviewMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Save Error */}
        {saveError && (
          <div className="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {saveError}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-4 gap-4 overflow-hidden">
        {/* Left Sidebar - Controls */}
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
                onClick={() => addElement("text")}
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
                onClick={() => addElement("image")}
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
                onClick={() => addElement("button")}
                disabled={isPreviewMode}
              >
                Button
              </button>
            </div>
          </div>


        </div>

        {/* Canvas */}
        <div className="flex-1">
          <div
            ref={canvasRef}
            className="w-full h-full relative bg-gray-100 border border-gray-400 rounded-lg"
            style={{ 
              backgroundImage: isPreviewMode ? 'none' : "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)" 
            }}
          >
            {elements.map(renderElement)}
          </div>
        </div>
      </div>
    </div>
  );
}; 