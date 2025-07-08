import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, layoutService } from '../services/layoutService';
import { Element } from '../types';
import { sanitizeLayoutName } from '../utils/sanitize';
import { exportLayoutToHTML, downloadHTML } from '../utils/htmlExport';
import { layoutPersistence } from '../utils/layoutPersistence';

export const useLayoutState = (canvasDimensions?: { width: number; height: number }) => {
  const [currentLayout, setCurrentLayout] = useState<Layout | null>(null);
  const [layoutName, setLayoutName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const navigate = useNavigate();

  const saveLayout = async (elements: Element[]) => {
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
        // Layout ID is already stored from when the layout was loaded
      } else {
        // Create new layout
        const newLayout = await layoutService.createLayout(sanitizedName, elements);
        setCurrentLayout(newLayout);
        // Store layout ID for persistence when creating a new layout
        layoutPersistence.storeLayoutId(newLayout.id);
      }
      
      setLayoutName(sanitizedName);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save layout');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLayout = async () => {
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
      // Clear stored layout ID since layout is deleted
      layoutPersistence.clearLayoutId();
      // Navigate back to dashboard after successful deletion
      navigate('/dashboard');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to delete layout');
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadLayout = (elements: Element[]) => {
    if (elements.length === 0) {
      setSaveError('Cannot download empty layout');
      return;
    }

    const downloadName = currentLayout?.name || layoutName || 'Untitled Layout';
    const html = exportLayoutToHTML(
      elements, 
      downloadName, 
      canvasDimensions?.width || 800, 
      canvasDimensions?.height || 600
    );
    downloadHTML(html, downloadName);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return {
    // State
    currentLayout,
    layoutName,
    isSaving,
    saveError,
    isDeleting,
    isPreviewMode,
    
    // Setters
    setCurrentLayout,
    setLayoutName,
    setSaveError,
    
    // Operations
    saveLayout,
    deleteLayout,
    downloadLayout,
    togglePreviewMode,
  };
}; 