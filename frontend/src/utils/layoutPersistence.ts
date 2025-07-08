/**
 * Utility for managing layout ID persistence in localStorage
 * Handles storing and retrieving the current layout ID to prevent loss on refresh
 */

const LAYOUT_ID_KEY = 'hq_layout_builder_current_layout_id';

export const layoutPersistence = {
  /**
   * Store the current layout ID in localStorage
   * @param layoutId - The ID of the layout being edited
   */
  storeLayoutId: (layoutId: string): void => {
    try {
      localStorage.setItem(LAYOUT_ID_KEY, layoutId);
    } catch (error) {
      console.warn('Failed to store layout ID in localStorage:', error);
    }
  },

  /**
   * Retrieve the stored layout ID from localStorage
   * @returns The stored layout ID or null if not found
   */
  getStoredLayoutId: (): string | null => {
    try {
      return localStorage.getItem(LAYOUT_ID_KEY);
    } catch (error) {
      console.warn('Failed to retrieve layout ID from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear the stored layout ID from localStorage
   * Called when leaving the EditLayoutPage
   */
  clearLayoutId: (): void => {
    try {
      localStorage.removeItem(LAYOUT_ID_KEY);
    } catch (error) {
      console.warn('Failed to clear layout ID from localStorage:', error);
    }
  },

  /**
   * Check if there's a stored layout ID
   * @returns True if a layout ID is stored, false otherwise
   */
  hasStoredLayoutId: (): boolean => {
    return layoutPersistence.getStoredLayoutId() !== null;
  },
}; 