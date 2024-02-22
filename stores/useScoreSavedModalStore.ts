import { create } from 'zustand';

type ScoreSavedModalState = {
  showScoreSavedModal: boolean;
  setShowScoreSavedModal: (showScoreSavedModal: boolean) => void;
};

export const useScoreSavedModalStore = create<ScoreSavedModalState>((set) => ({
  showScoreSavedModal: false,
  setShowScoreSavedModal: (showScoreSavedModal: boolean) => set({ showScoreSavedModal }),
}));

