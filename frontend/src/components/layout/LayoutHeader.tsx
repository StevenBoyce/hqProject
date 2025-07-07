import React from 'react';

interface LayoutHeaderProps {
  saveError: string | null;
  children: React.ReactNode;
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ saveError, children }) => {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      {children}
      
      {/* Save Error */}
      {saveError && (
        <div className="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {saveError}
        </div>
      )}
    </div>
  );
}; 