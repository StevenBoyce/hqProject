/**
 * Copies text to clipboard using the modern Clipboard API
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    copyToClipboardFallback(text);
  }
};

/**
 * Fallback clipboard copy method for older browsers
 * @param text - The text to copy to clipboard
 */
export const copyToClipboardFallback = (text: string): void => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    alert('Share link copied to clipboard!');
  } catch (err) {
    alert('Failed to copy link. Please copy manually: ' + text);
  }
  document.body.removeChild(textArea);
};

/**
 * Shares a layout by copying its URL to clipboard
 * @param layoutId - The ID of the layout to share
 * @returns Promise that resolves when URL is copied
 */
export const shareLayout = async (layoutId: string): Promise<void> => {
  const shareUrl = `${window.location.origin}/layout/read-only/${layoutId}`;
  
  try {
    await copyToClipboard(shareUrl);
    alert('Share link copied to clipboard!');
  } catch (error) {
    // Fallback for older browsers
    copyToClipboardFallback(shareUrl);
  }
}; 