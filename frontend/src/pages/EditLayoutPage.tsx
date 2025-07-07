import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Element, ElementType } from '../types';
import { createElement } from '../services/elementService';

import { UndoIcon, RedoIcon, DeleteIcon, DownloadIcon, ShareIcon } from '../icons';
import { Layout, layoutService } from '../services/layoutService';
import { sanitizeLayoutName } from '../utils/sanitize';
import { historyService, HistoryAction } from '../services/historyService';
import { Canvas } from '../components/Canvas';
import { exportLayoutToHTML, downloadHTML } from '../utils/htmlExport';

export const EditLayoutPage: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<Layout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState<string>('');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Element[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

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
        // Update existing layout
        const updatedLayout = await layoutService.updateLayout(currentLayout.id, sanitizedName, elements);
        setCurrentLayout(updatedLayout);
      } else {
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

  const handleDeleteLayout = async () => {
    if (!currentLayout) {
      setSaveError('No layout to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${currentLayout.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setSaveError(null);

    try {
      await layoutService.deleteLayout(currentLayout.id);
      // Navigate back to dashboard after successful deletion
      navigate('/dashboard');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to delete layout');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadLayout = () => {
    if (elements.length === 0) {
      setSaveError('Cannot download empty layout');
      return;
    }

    const downloadName = currentLayout?.name || layoutName || 'Untitled Layout';
    const html = exportLayoutToHTML(elements, downloadName);
    downloadHTML(html, downloadName);
  };

  const handleShareLayout = () => {
    if (!currentLayout) {
      setSaveError('Cannot share unsaved layout');
      return;
    }

    const shareUrl = `${window.location.origin}/layout/read-only/${currentLayout.id}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        copyToClipboardFallback(shareUrl);
      });
    } else {
      // Fallback for older browsers
      copyToClipboardFallback(shareUrl);
    }
  };

  const copyToClipboardFallback = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Share link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link. Please copy manually: ' + text);
    }
    document.body.removeChild(textArea);
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

  const handleHistoryAction = (action: HistoryAction) => {
    historyService.addAction(action);
    // Update undo/redo state immediately
    setCanUndo(historyService.canUndo());
    setCanRedo(historyService.canRedo());
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
              Save
            </button>

            <button
              onClick={handleUndo}
              disabled={!canUndo || isPreviewMode}
              className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
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
              className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                !canRedo || isPreviewMode
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title="Redo"
            >
              <RedoIcon size={18} className="text-white" />
            </button>

            <button
              onClick={handleDeleteLayout}
              disabled={isDeleting || !currentLayout || isPreviewMode}
              className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                isDeleting || !currentLayout || isPreviewMode
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              title="Delete Layout"
            >
              <DeleteIcon size={18} className="text-white" />
            </button>

            <button
              onClick={handleDownloadLayout}
              disabled={elements.length === 0 || isPreviewMode}
              className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                elements.length === 0 || isPreviewMode
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title="Download as HTML"
            >
              <DownloadIcon size={18} className="text-white" />
            </button>

            <button
              onClick={handleShareLayout}
              disabled={!currentLayout || isPreviewMode}
              className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
                !currentLayout || isPreviewMode
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title="Share Layout"
            >
              <ShareIcon size={18} className="text-white" />
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
        <Canvas
          elements={elements}
          setElements={setElements}
          isPreviewMode={isPreviewMode}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onHistoryAction={handleHistoryAction}
          canvasRef={canvasRef}
        />
      </div>
    </div>
  );
}; 