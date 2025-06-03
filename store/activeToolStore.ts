import { create } from 'zustand';

export type ToolType =
  | 'lessonWords'
  | 'quiz'
  | 'cloze'
  | 'photoQuiz'
  | 'dragTrueOrFalse'
  | 'presentWord'
  | 'sentenceBuilder'
  | 'cameraActivity'
  | 'badgeAward'
  | 'reorderGame'
  | null;

interface ActiveToolState {
  activeTool: ToolType;
  resetCallbacks: Map<ToolType, () => void>;
  setActiveTool: (tool: ToolType) => void;
  closeActiveTool: () => void;
  registerResetCallback: (tool: ToolType, callback: () => void) => void;
  unregisterResetCallback: (tool: ToolType) => void;
}

export const useActiveToolStore = create<ActiveToolState>((set, get) => ({
  activeTool: null,
  resetCallbacks: new Map(),

  setActiveTool: (tool: ToolType) => {
    const state = get();
    // Reset all other tools when changing to a new tool
    state.resetCallbacks.forEach((callback, toolType) => {
      if (toolType !== tool) {
        callback();
      }
    });
    set({ activeTool: tool });
  },

  closeActiveTool: () => {
    const state = get();
    // Reset the current tool when closing
    if (state.activeTool) {
      const callback = state.resetCallbacks.get(state.activeTool);
      if (callback) callback();
    }
    set({ activeTool: null });
  },

  registerResetCallback: (tool: ToolType, callback: () => void) => {
    set(state => ({
      resetCallbacks: new Map(state.resetCallbacks).set(tool, callback),
    }));
  },

  unregisterResetCallback: (tool: ToolType) => {
    set(state => {
      const newCallbacks = new Map(state.resetCallbacks);
      newCallbacks.delete(tool);
      return { resetCallbacks: newCallbacks };
    });
  },
}));
