import { create } from 'zustand';
import { Connection } from '@solana/web3.js';

type ConnectionState = {
  connection: Connection | null;
  setConnection: (connection: Connection | null) => void;
};

const useConnectionStore = create<ConnectionState>((set) => ({
  connection: null,
  setConnection: (connection: Connection | null) => set({ connection }),
}));

export { useConnectionStore };
export const connectionStore = useConnectionStore.getState;
