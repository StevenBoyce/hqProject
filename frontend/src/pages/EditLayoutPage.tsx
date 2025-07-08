import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Element } from '../types';
import { HistoryAction } from '../utils/historyUtils';
import { shareLayout } from '../utils/clipboardUtils';

// Custom hooks
import { useLayoutState } from '../hooks/useLayoutState';
import { useHistoryState } from '../hooks/useHistoryState';
import { useElementState } from '../hooks/useElementState';
import { useLayoutInitialization } from '../hooks/useLayoutInitialization';
import { useCanvasDimensions } from '../hooks/useCanvasDimensions';

// Components
import { Canvas } from '../components/Canvas';
import { LayoutHeader } from '../components/layout/LayoutHeader';
import { LayoutToolbar } from '../components/layout/LayoutToolbar';
import { ElementPalette } from '../components/layout/ElementPalette';

export const EditLayoutPage: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Track canvas dimensions
  const canvasDimensions = useCanvasDimensions(canvasRef);
  
  // Custom hooks for state management
  const layoutState = useLayoutState(canvasDimensions);
  const historyState = useHistoryState();
  const elementState = useElementState(historyState.addHistoryAction);

  // Initialize layout from navigation state
  useLayoutInitialization(
    location,
    layoutState.setCurrentLayout,
    elementState.setElements,
    layoutState.setLayoutName
  );

  // Clear history on initial load
  useEffect(() => {
    historyState.clearHistory();
  }, []);

  // Update undo/redo state when elements change
  useEffect(() => {
    historyState.updateHistoryState();
  }, [elementState.elements]);

  // Handle share layout
  const handleShareLayout = async () => {
    if (!layoutState.currentLayout) {
      layoutState.setSaveError('Cannot share unsaved layout');
      return;
    }

    try {
      await shareLayout(layoutState.currentLayout.id);
    } catch (error) {
      layoutState.setSaveError('Failed to share layout');
    }
  };

  // Handle element operations with history tracking
  const handleElementUpdate = (elementId: string, updates: Partial<Element>) => {
    elementState.updateElement(elementId, updates);
  };

  const handleElementDelete = (elementId: string) => {
    elementState.deleteElement(elementId);
  };

  const handleHistoryAction = (action: HistoryAction) => {
    historyState.addHistoryAction(action);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <LayoutHeader saveError={layoutState.saveError}>
        <LayoutToolbar 
          layoutName={layoutState.layoutName}
          onLayoutNameChange={layoutState.setLayoutName}
          onSave={() => layoutState.saveLayout(elementState.elements)}
          onUndo={() => historyState.undo(elementState.setElements)}
          onRedo={() => historyState.redo(elementState.setElements)}
          onDelete={layoutState.deleteLayout}
          onDownload={() => layoutState.downloadLayout(elementState.elements)}
          onShare={handleShareLayout}
          isPreviewMode={layoutState.isPreviewMode}
          onPreviewModeToggle={layoutState.togglePreviewMode}
          isSaving={layoutState.isSaving}
          isDeleting={layoutState.isDeleting}
          canUndo={historyState.canUndo}
          canRedo={historyState.canRedo}
          hasElements={elementState.elements.length > 0}
          hasLayout={!!layoutState.currentLayout}
        />
      </LayoutHeader>

      {/* Main Content */}
      <div className="flex flex-1 p-4 gap-4 overflow-hidden">
        <ElementPalette 
          onAddElement={elementState.addElement}
          isPreviewMode={layoutState.isPreviewMode}
        />

        <Canvas
          elements={elementState.elements}
          setElements={elementState.setElements}
          isPreviewMode={layoutState.isPreviewMode}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onHistoryAction={handleHistoryAction}
          canvasRef={canvasRef}
        />
      </div>
    </div>
  );
}; 