import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { AuthType } from "@particle-network/auth-core";
import { Solana } from "@particle-network/chains";
import { PromptSettingType } from "@particle-network/auth-core-modal";

// const NoSSRAuthCoreContextProvider = dynamic(
//   () => Promise.resolve(AuthCoreContextProvider),
//   { ssr: false }
// );

const NoSSRAuthCoreContextProvider = dynamic(
  async () =>
    (await import("@particle-network/auth-core-modal")).AuthCoreContextProvider,
  { ssr: false }
);

export const ParticleProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NoSSRAuthCoreContextProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID!,
        clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY!,
        appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID!,
        authTypes: [AuthType.phone],
        themeType: "dark",
        fiatCoin: "USD",
        language: "en",
        // promptSettingConfig: {
        //   promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
        //   promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        // },
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
