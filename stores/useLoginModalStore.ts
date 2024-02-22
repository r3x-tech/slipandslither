import { create } from "zustand";

type LoginModalState = {
  showLoginModal: boolean;
  setShowLoginModal: (showLoginModal: boolean) => void;
};

export const useLoginModalStore = create<LoginModalState>((set) => ({
  showLoginModal: false,
  setShowLoginModal: (showLoginModal: boolean) => set({ showLoginModal }),
}));
