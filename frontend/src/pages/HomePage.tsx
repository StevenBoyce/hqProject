import React, { useState, useEffect, useRef } from 'react';
import { Element, ElementType } from '../types';
import { createElement, calculateGridPosition, calculateGridResize, willElementCollide } from '../services/elementService';
import { TextElement } from '../components/elements/TextElement';
import { ImageElement } from '../components/elements/ImageElement';
import { ButtonElement } from '../components/elements/ButtonElement';
import { UserBadge } from '../components/UserBadge';
import { LayoutsPanel, LayoutsPanelRef } from '../components/LayoutsPanel';
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
  const layoutsPanelRef = useRef<LayoutsPanelRef>(null);

  // Keep the ref in sync with the state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  // Update layout name when current layout changes
  useEffect(() => {
    if (currentLayout) {
      setLayoutName(currentLayout.name);
    } else {
      setLayoutName('');
    }
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
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleLayoutSelect = (layout: Layout) => {
    setCurrentLayout(layout);
    setElements(layout.content);
    setSaveError(null); // Clear any previous save errors
    
    // Clear history when loading a new layout
    historyService.clear();
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
      if (currentLayout) {
        // Update existing layout
        const updatedLayout = await layoutService.updateLayout(
          currentLayout.id,
          sanitizeLayoutName(layoutName.trim()),
          elements
        );
        setCurrentLayout(updatedLayout);
      } else {
        // Create new layout
        const newLayout = await layoutService.createLayout(sanitizeLayoutName(layoutName.trim()), elements);
        setCurrentLayout(newLayout);
      }
      
      // Refresh the layouts panel to show the updated/new layout
      layoutsPanelRef.current?.refreshLayouts();
    } catch (error) {
      console.log(error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save layout');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewLayout = () => {
    // Clear the canvas
    setElements([]);
    
    // Reset current layout
    setCurrentLayout(null);
    
    // Clear layout name
    setLayoutName('');
    
    // Clear any save errors
    setSaveError(null);
    
    // Clear history
    historyService.clear();
  };

  const handleElementUpdate = (elementId: string, updates: Partial<Element>) => {
    const previousElement = elements.find(el => el.id === elementId);
    if (!previousElement) return;
    
    // Track history
    const action: HistoryAction = {
      type: 'UPDATE',
      elementId: elementId,
      previousState: [previousElement],
      newState: [{ ...previousElement, ...updates }],
      description: `Update ${previousElement.type} element`,
    };
    historyService.addAction(action);
    
    setElements((prev) =>
      prev.map((el) =>
        el.id === elementId
          ? { ...el, ...updates }
          : el
      )
    );
  };

  const handleElementDelete = (elementId: string) => {
    const deletedElement = elements.find(el => el.id === elementId);
    if (!deletedElement) return;
    
    // Track history
    const action: HistoryAction = {
      type: 'DELETE',
      elementId: elementId,
      element: deletedElement,
      description: `Delete ${deletedElement.type} element`,
    };
    historyService.addAction(action);
    
    setElements((prev) => prev.filter((el) => el.id !== elementId));
  };

  const handleUndo = () => {
    if (!canUndo) return;
    
    const action = historyService.undo();
    if (!action) return;
    
    // Apply the undo based on action type
    switch (action.type) {
      case 'ADD':
        // Remove the added element
        setElements(prev => prev.filter(el => el.id !== action.elementId));
        break;
      case 'DELETE':
        // Restore the deleted element
        if (action.element) {
          setElements(prev => [...prev, action.element!]);
        }
        break;
      case 'UPDATE':
        // Restore previous state
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
        // Restore previous state
        if (action.previousState) {
          setElements(action.previousState);
        }
        break;
    }
  };

  const handleRedo = () => {
    if (!canRedo) return;
    
    const action = historyService.redo();
    if (!action) return;
    
    // Apply the redo based on action type
    switch (action.type) {
      case 'ADD':
        // Add the element back
        if (action.element) {
          setElements(prev => [...prev, action.element!]);
        }
        break;
      case 'DELETE':
        // Remove the element again
        setElements(prev => prev.filter(el => el.id !== action.elementId));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex h-screen p-4 gap-4">
        {/* Left Sidebar - User Badge and Layouts Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          {/* User Badge - Top Left */}
          <UserBadge />
          
          {/* Layouts Panel */}
          <LayoutsPanel ref={layoutsPanelRef} onLayoutSelect={handleLayoutSelect} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Controls Row */}
          <div className="mb-4 space-y-4">
            {/* Name Input and Preview Toggle Row */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="layoutName" className="block text-sm font-medium text-gray-700 mb-1">
                  Layout Name
                </label>
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
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Preview</label>
                <input
                  type="checkbox"
                  checked={isPreviewMode}
                  onChange={(e) => setIsPreviewMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-3">
              <button 
                className={`px-4 py-2 text-white transition-colors duration-200 rounded-lg ${
                  isPreviewMode 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => addElement("text")}
                disabled={isPreviewMode}
              >
                Add Text
              </button>
              <button 
                className={`px-4 py-2 text-white transition-colors duration-200 rounded-lg ${
                  isPreviewMode 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => addElement("image")}
                disabled={isPreviewMode}
              >
                Add Image
              </button>
              <button 
                className={`px-4 py-2 text-white transition-colors duration-200 rounded-lg ${
                  isPreviewMode 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => addElement("button")}
                disabled={isPreviewMode}
              >
                Add Button
              </button>

              <div className="flex-1"></div> {/* Spacer */}

              <button
                onClick={handleUndo}
                disabled={!canUndo || isPreviewMode}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
                  !canUndo || isPreviewMode
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title="Undo"
              >
                Undo
              </button>

              <button
                onClick={handleRedo}
                disabled={!canRedo || isPreviewMode}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
                  !canRedo || isPreviewMode
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title="Redo"
              >
                Redo
              </button>

              <button
                onClick={handleSaveLayout}
                disabled={isSaving || isPreviewMode || elements.length === 0 || !layoutName.trim()}
                className={`px-6 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
                  isSaving || isPreviewMode || elements.length === 0 || !layoutName.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSaving ? 'Saving...' : currentLayout ? 'Save Changes' : 'Save Layout'}
              </button>

              <button
                onClick={handleCreateNewLayout}
                disabled={isSaving || isPreviewMode}
                className={`px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
                  isSaving || isPreviewMode
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title="Create New Layout"
              >
                +
              </button>
            </div>

            {/* Save Error */}
            {saveError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {saveError}
              </div>
            )}
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-gray-100 border border-gray-400 rounded-lg"
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
  );
}; 