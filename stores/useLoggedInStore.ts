import { create } from 'zustand';

type LoggedInStatusState = {
  logInStatus: boolean;
  setLogInStatus: (loggedIn: boolean) => void;
};

export const useLoggedInStore = create<LoggedInStatusState>((set) => ({
  logInStatus: false,
  setLogInStatus: (logInStatus: boolean) => set({ logInStatus }),
}));