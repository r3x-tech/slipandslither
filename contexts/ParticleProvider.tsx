import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { AuthType } from "@particle-network/auth-core";
import { Solana } from "@particle-network/chains";
import { PromptSettingType } from "@particle-network/auth-core-modal";

const NoSSRAuthCoreContextProvider = dynamic(
  async () =>
    (await import("@particle-network/auth-core-modal")).AuthCoreContextProvider,
  { ssr: false }
);

// // Dynamically import to avoid SSR issues
// const NoSSRAuthCoreContextProvider = dynamic(
//   () => Promise.resolve(AuthCoreContextProvider),
//   { ssr: false }
// );

require("@solana/wallet-adapter-react-ui/styles.css");

export const ParticleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

  const wallets = useMemo(() => {
    return [];
  }, []);

  const onError = useCallback((error: WalletError) => {
    console.error("Wallet error: " + error);
  }, []);

  return (
    <NoSSRAuthCoreContextProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        appId: process.env.NEXT_PUBLIC_APP_ID!,
        authTypes: [AuthType.email],
        themeType: "dark",
        fiatCoin: "USD",
        language: "en",
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
          promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        },
        wallet: {
          visible: false,
          customStyle: {
            supportChains: [Solana],
          },
        },
      }}
    >
      {children}
    </NoSSRAuthCoreContextProvider>
  );
};
