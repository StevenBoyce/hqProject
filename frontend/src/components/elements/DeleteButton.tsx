import React from 'react';

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent) => void;
  className?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onDelete, 
  className = '' 
}) => {
  return (
    <button
      onClick={onDelete}
      className={`w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${className}`}
      title="Delete element"
    >
      ×
    </button>
  );
}; 