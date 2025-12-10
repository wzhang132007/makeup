import { create } from 'zustand';
import { AppState, TreeState, ColorTheme } from './types';

export const useStore = create<AppState>((set) => ({
  treeState: 'CHAOS' as TreeState,
  progress: 0,
  isTransitioning: false,
  colorTheme: 'luxury' as ColorTheme,

  toggleState: () => set((state) => ({
    treeState: state.treeState === 'CHAOS' ? 'FORMED' : 'CHAOS',
    isTransitioning: true,
  })),

  setColorTheme: (theme: ColorTheme) => set({ colorTheme: theme }),
}));
