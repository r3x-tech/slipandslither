import { create } from 'zustand';

type LoadingStatusState = {
  loadingStatus: boolean;
  setLoadingStatus: (loggedIn: boolean) => void;
};

export const useLoadingStore = create<LoadingStatusState>((set) => ({
  loadingStatus: false,
  setLoadingStatus: (loadingStatus: boolean) => set({ loadingStatus }),
}));