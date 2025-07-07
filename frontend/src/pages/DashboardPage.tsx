import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, layoutService } from '../services/layoutService';
import { UserBadge } from '../components/UserBadge';
import { DeleteIcon } from '../icons';

export const DashboardPage: React.FC = () => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingLayoutId, setDeletingLayoutId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadLayouts();
  }, []);

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

  const handleLayoutClick = (layout: Layout) => {
    navigate('/layout', { state: { selectedLayout: layout } });
  };

  const handleCreateNewLayout = () => {
    navigate('/layout');
  };

  const handleUseAsTemplate = (layout: Layout) => {
    const newLayoutName = `COPY OF ${layout.name}`;
    navigate('/layout', { 
      state: {
        templateElements: layout.content,
        templateName: newLayoutName
      } 
    });
  };

  const handleDeleteLayout = async (layout: Layout, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!window.confirm(`Are you sure you want to delete "${layout.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingLayoutId(layout.id);
    setError(null);

    try {
      await layoutService.deleteLayout(layout.id);
      // Refresh the layouts list after successful deletion
      await loadLayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete layout');
    } finally {
      setDeletingLayoutId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Layout Builder
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create, edit, and manage your layouts
            </p>
            <button
              onClick={handleCreateNewLayout}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Create New Layout
            </button>
          </div>

          {/* Layouts Section */}
          <div className="bg-white rounded-xl shadow-lg border p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">My Layouts</h2>
              <button
                onClick={loadLayouts}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your layouts...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadLayouts}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Layouts Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layouts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No layouts yet</h3>
                    <p className="text-gray-600 mb-4">Create your first layout to get started!</p>
                    <button
                      onClick={handleCreateNewLayout}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Create Layout
                    </button>
                  </div>
                ) : (
                  layouts.map((layout) => (
                    <div
                      key={layout.id}
                      onClick={() => handleLayoutClick(layout)}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 hover:border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-md relative"
                    >
                      {/* Delete Icon - Top Left Corner */}
                      <div 
                        className="absolute top-2 left-2 p-1 hover:bg-red-100 rounded transition-colors duration-200"
                        onClick={(e) => handleDeleteLayout(layout, e)}
                        title="Delete layout"
                      >
                        <DeleteIcon 
                          size={16} 
                          className={`${
                            deletingLayoutId === layout.id 
                              ? 'text-gray-400' 
                              : 'text-red-600 hover:text-red-700'
                          } transition-colors duration-200`}
                        />
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800 text-lg truncate flex-1">
                          {layout.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2">
                          {layout.content.length} elements
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Updated: {formatDate(layout.updatedAt)}</p>
                        <p>Created: {formatDate(layout.createdAt)}</p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <button 
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseAsTemplate(layout);
                          }}
                        >
                          Use as template
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded border border-blue-300 hover:border-blue-400 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLayoutClick(layout);
                          }}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 