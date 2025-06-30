import { Element } from '../types';

export interface HistoryAction {
  type: 'ADD' | 'DELETE' | 'UPDATE' | 'MOVE' | 'RESIZE';
  elementId?: string;
  previousState?: Element[];
  newState?: Element[];
  element?: Element;
  description: string;
}

export class HistoryService {
  private undoStack: HistoryAction[] = [];
  private redoStack: HistoryAction[] = [];
  private maxHistorySize = 50;

  // Add a new action to the history
  addAction(action: HistoryAction): void {
    this.undoStack.push(action);
    this.redoStack = []; // Clear redo stack when new action is added
    
    // Limit history size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
  }

  // Undo the last action
  undo(): HistoryAction | null {
    const action = this.undoStack.pop();
    if (action) {
      this.redoStack.push(action);
      return action;
    }
    return null;
  }

  // Redo the last undone action
  redo(): HistoryAction | null {
    const action = this.redoStack.pop();
    if (action) {
      this.undoStack.push(action);
      return action;
    }
    return null;
  }

  // Check if undo is available
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  // Check if redo is available
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // Clear all history (useful when loading a new layout)
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  // Get current history state for debugging
  getState() {
    return {
      undoStackLength: this.undoStack.length,
      redoStackLength: this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }
}

// Create a singleton instance
export const historyService = new HistoryService(); 