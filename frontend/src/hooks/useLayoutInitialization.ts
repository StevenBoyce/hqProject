import { useEffect, useRef } from 'react';
import { Location } from 'react-router-dom';
import { Layout } from '../services/layoutService';
import { Element } from '../types';
import { layoutPersistence } from '../utils/layoutPersistence';

export const useLayoutInitialization = (
  location: Location,
  setCurrentLayout: (layout: Layout | null) => void,
  setElements: (elements: Element[]) => void,
  setLayoutName: (name: string) => void
) => {
  const initialized = useRef(false);

  useEffect(() => {
    // Only run initialization once on mount
    if (initialized.current) return;

    const initializeLayout = async () => {
      if (location.state?.selectedLayout) {
        // Case 1: Layout passed via navigation state (normal flow)
        const layout = location.state.selectedLayout as Layout;
        
        // Store layout ID IMMEDIATELY and synchronously before anything else
        layoutPersistence.storeLayoutId(layout.id);
        
        // Now set the state
        setCurrentLayout(layout);
        setElements(layout.content);
        setLayoutName(layout.name);
        
        // Clear the state to prevent re-loading on refresh
        window.history.replaceState({}, document.title);
        initialized.current = true;
      } else if (location.state?.templateElements) {
        // Case 2: Template elements passed via navigation state
        setCurrentLayout(null); // No existing layout since this is a new copy
        setElements(location.state.templateElements);
        setLayoutName(location.state.templateName || 'New Layout');
        
        // Clear any stored layout ID since this is a new layout
        layoutPersistence.clearLayoutId();
        
        // Clear the state to prevent re-loading on refresh
        window.history.replaceState({}, document.title);
        initialized.current = true;
      } else {
        // Case 3: No navigation state - check localStorage for persisted layout ID
        const storedLayoutId = layoutPersistence.getStoredLayoutId();
        
        if (storedLayoutId) {
          try {
            // Fetch the layout by ID from the API
            const layout = await import('../services/layoutService').then(module => 
              module.layoutService.getLayoutById(storedLayoutId)
            );
            
            setCurrentLayout(layout);
            setElements(layout.content);
            setLayoutName(layout.name);
            
            // Keep the layout ID stored for future refreshes
            layoutPersistence.storeLayoutId(layout.id);
            
            initialized.current = true;
          } catch (error) {
            console.warn('Failed to load persisted layout:', error);
            // Clear invalid stored layout ID
            layoutPersistence.clearLayoutId();
            initialized.current = true;
          }
        } else {
          // Case 4: No stored layout ID - start with empty layout
          setCurrentLayout(null);
          setElements([]);
          setLayoutName('New Layout');
          initialized.current = true;
        }
      }
    };

    initializeLayout();
  }, []); // Empty dependency array - only run on mount

  // Update layout name when current layout changes (separate effect)
  useEffect(() => {
    if (location.state?.selectedLayout) {
      const layout = location.state.selectedLayout as Layout;
      setLayoutName(layout.name);
    }
    // Don't clear layout name when currentLayout is null, as it might be set by template
  }, [location.state?.selectedLayout, setLayoutName]);
}; 