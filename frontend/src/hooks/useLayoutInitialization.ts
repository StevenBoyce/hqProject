import { useEffect, useRef } from 'react';
import { Location } from 'react-router-dom';
import { Layout } from '../services/layoutService';
import { Element } from '../types';

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

    if (location.state?.selectedLayout) {
      const layout = location.state.selectedLayout as Layout;
      setCurrentLayout(layout);
      setElements(layout.content);
      setLayoutName(layout.name);
      // Clear the state to prevent re-loading on refresh
      window.history.replaceState({}, document.title);
      initialized.current = true;
    } else if (location.state?.templateElements) {
      // Handle template elements
      setCurrentLayout(null); // No existing layout since this is a new copy
      setElements(location.state.templateElements);
      setLayoutName(location.state.templateName || 'New Layout');
      // Clear the state to prevent re-loading on refresh
      window.history.replaceState({}, document.title);
      initialized.current = true;
    }
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