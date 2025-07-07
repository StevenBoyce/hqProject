import { authUtils } from '../utils/authUtils';

export interface Layout {
  id: string;
  name: string;
  userId: string;
  content: any[];
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'recently-changed' | 'newest' | 'oldest';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const layoutService = {
  // Get all layouts for the current user
  getUserLayouts: async (): Promise<Layout[]> => {
    const username = authUtils.getUsername();
    if (!username) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/api/layouts?userId=${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch layouts: ${response.statusText}`);
    }

    return response.json();
  },

  // Create a new layout
  createLayout: async (name: string, content: any[]): Promise<Layout> => {
    const username = authUtils.getUsername();
    if (!username) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/api/layouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        userId: username,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create layout: ${response.statusText}`);
    }

    return response.json();
  },

  // Update an existing layout
  updateLayout: async (id: string, name: string, content: any[]): Promise<Layout> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update layout: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete a layout
  deleteLayout: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete layout: ${response.statusText}`);
    }
  },

  // Get a layout by ID (public, no authentication required)
  getLayoutById: async (id: string): Promise<Layout> => {
    const response = await fetch(`${API_BASE_URL}/api/layouts/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch layout: ${response.statusText}`);
    }

    return response.json();
  },

  // Sort layouts based on the selected option
  sortLayouts: (layouts: Layout[], sortOption: SortOption): Layout[] => {
    const sorted = [...layouts];
    
    switch (sortOption) {
      case 'recently-changed':
        return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return sorted;
    }
  },
}; 