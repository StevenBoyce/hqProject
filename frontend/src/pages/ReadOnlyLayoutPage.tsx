import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, layoutService } from '../services/layoutService';
import { Canvas } from '../components/Canvas';
import { authUtils } from '../utils/authUtils';

export const ReadOnlyLayoutPage: React.FC = () => {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadLayout(id);
    }
  }, [id]);

  const loadLayout = async (layoutId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // Use the public endpoint to fetch the layout
      const foundLayout = await layoutService.getLayoutById(layoutId);
      setLayout(foundLayout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load layout');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading layout...</p>
        </div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Layout Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested layout could not be found.'}</p>
          {authUtils.isLoggedIn() ? (
            <a 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Go to Dashboard
            </a>
          ) : (
            <a 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Login
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{layout.name}</h1>
            <p className="text-gray-600 text-sm">Read-only view</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {layout.content.length} elements
            </span>
            {authUtils.isLoggedIn() ? (
              <a 
                href="/dashboard" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Back to Dashboard
              </a>
            ) : (
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <Canvas
            elements={layout.content}
            setElements={() => {}} // No-op for read-only
            isPreviewMode={true}
            isReadOnly={true}
          />
        </div>
      </div>
    </div>
  );
}; 