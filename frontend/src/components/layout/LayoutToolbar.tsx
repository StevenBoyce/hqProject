import React from 'react';
import { UndoIcon, RedoIcon, DeleteIcon, DownloadIcon, ShareIcon } from '../../icons';
interface LayoutToolbarProps {
  layoutName: string;
  onLayoutNameChange: (name: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
  isPreviewMode: boolean;
  onPreviewModeToggle: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasElements: boolean;
  hasLayout: boolean;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  layoutName,
  onLayoutNameChange,
  onSave,
  onUndo,
  onRedo,
  onDelete,
  onDownload,
  onShare,
  isPreviewMode,
  onPreviewModeToggle,
  isSaving,
  isDeleting,
  canUndo,
  canRedo,
  hasElements,
  hasLayout,
}) => {
  const handleShare = () => {
    onShare();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-md">
          <input
            id="layoutName"
            type="text"
            value={layoutName}
            onChange={(e) => onLayoutNameChange(e.target.value)}
            placeholder="Enter layout name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPreviewMode}
          />
        </div>
        
        <button
          onClick={onSave}
          disabled={isSaving || isPreviewMode || !hasElements || !layoutName.trim()}
          className={`px-6 py-2 text-white font-medium rounded-lg transition-colors duration-200 ${
            isSaving || isPreviewMode || !hasElements || !layoutName.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Save
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo || isPreviewMode}
          className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
            !canUndo || isPreviewMode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          title="Undo"
        >
          <UndoIcon size={18} className="text-white" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo || isPreviewMode}
          className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
            !canRedo || isPreviewMode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          title="Redo"
        >
          <RedoIcon size={18} className="text-white" />
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting || !hasLayout || isPreviewMode}
          className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
            isDeleting || !hasLayout || isPreviewMode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          title="Delete Layout"
        >
          <DeleteIcon size={18} className="text-white" />
        </button>

        <button
          onClick={onDownload}
          disabled={!hasElements || isPreviewMode}
          className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
            !hasElements || isPreviewMode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          title="Download as HTML"
        >
          <DownloadIcon size={18} className="text-white" />
        </button>

        <button
          onClick={handleShare}
          disabled={!hasLayout || isPreviewMode}
          className={`min-h-10 px-3 py-2 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
            !hasLayout || isPreviewMode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title="Share Layout"
        >
          <ShareIcon size={18} className="text-white" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Preview Mode</label>
        <button
          onClick={onPreviewModeToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            isPreviewMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          role="switch"
          aria-checked={isPreviewMode}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isPreviewMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}; 