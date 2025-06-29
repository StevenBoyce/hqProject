import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Layout, SortOption, layoutService } from '../services/layoutService';

interface LayoutsPanelProps {
  onLayoutSelect?: (layout: Layout) => void;
  className?: string;
}

export interface LayoutsPanelRef {
  refreshLayouts: () => void;
}

export const LayoutsPanel = forwardRef<LayoutsPanelRef, LayoutsPanelProps>(
  ({ onLayoutSelect, className = '' }, ref) => {
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>('recently-changed');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLayouts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userLayouts = await layoutService.getUserLayouts();
        setLayouts(userLayouts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load layouts');
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadLayouts();
    }, []);

    // Expose refresh function to parent component
    useImperativeHandle(ref, () => ({
      refreshLayouts: loadLayouts,
    }));

    const handleSortChange = (newSortOption: SortOption) => {
      setSortOption(newSortOption);
    };

    const handleLayoutClick = (layout: Layout) => {
      onLayoutSelect?.(layout);
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const sortedLayouts = layoutService.sortLayouts(layouts, sortOption);

    return (
      <div className={`bg-white rounded-lg shadow-md border p-4 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">My Layouts</h3>
          
          {/* Sort Options */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recently-changed">Recently Changed</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading layouts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={loadLayouts}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Layouts List */}
        {!isLoading && !error && (
          <div className="space-y-2">
            {sortedLayouts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No layouts yet</p>
                <p className="text-sm">Create your first layout to get started!</p>
              </div>
            ) : (
              sortedLayouts.map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => handleLayoutClick(layout)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-800 truncate">{layout.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {layout.content.length} elements
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated: {formatDate(layout.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }
); 