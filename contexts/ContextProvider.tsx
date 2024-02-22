import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { FC, ReactNode, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Connection } from "@solana/web3.js";
import { useConnectionStore } from "../stores/useConnectionStore";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint: string = process.env.NEXT_PUBLIC_ENDPOINT!;
  const { setConnection } = useConnectionStore();

  useEffect(() => {
    const connection = new Connection(endpoint, "confirmed");
    setConnection(connection);
  }, [setConnection, endpoint]);

  const wallets = useMemo(() => [], []);

  const onError = useCallback((error: WalletError) => {
    console.error("Wallet error: " + error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};
