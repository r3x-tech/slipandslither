import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider as ParticleNetworkProvider } from "@particle-network/provider";
import { SolanaWallet } from "@particle-network/solana-wallet";
import { Solana } from "@raindrop-studios/events-client";

// Define the context type
interface ParticleContextType {
  particle: ParticleNetwork | null;
  particleProvider: ParticleNetworkProvider | null;
  solanaWallet: SolanaWallet | null;
}

const ParticleContext = createContext<ParticleContextType | null>(null);

export const useParticle = () => useContext(ParticleContext);

// Define the type for the props
interface ParticleContextProviderProps {
  children: ReactNode;
}

export const ParticleContextProvider = ({
  children,
}: ParticleContextProviderProps) => {
  const [particle, setParticle] = useState<ParticleNetwork | null>(null);
  const [particleProvider, setParticleProvider] =
    useState<ParticleNetworkProvider | null>(null);
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY &&
      process.env.NEXT_PUBLIC_PARTICLE_APP_ID
    ) {
      const particle = new ParticleNetwork({
        projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID,
        clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY,
        appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID,
        chainName: "solana",
        chainId: 101, //optional: current chain id, default 1.
        wallet: {
          //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
          displayWalletEntry: false, //show wallet entry when connect particle.
          defaultWalletEntryPosition: WalletEntryPosition.TR, //wallet entry position
          uiMode: "dark", //optional: light or dark, if not set, the default is the same as web auth.
          supportChains: [{ id: 101, name: "Solana" }], // optional: web wallet support chains.
          customStyle: {}, //optional: custom wallet style
        },
        securityAccount: {
          //optional: particle security account config
          //prompt set payment password. 0: None, 1: Once(default), 2: Always
          promptSettingWhenSign: 2,
          //prompt set master password. 0: None(default), 1: Once, 2: Always
          promptMasterPasswordSettingWhenLogin: 1,
        },
      });

      const currentParticleProvider = new ParticleNetworkProvider(
        particle.auth
      );
      // if (typeof window !== "undefined") {
      //   window.solana = particleProvider;
      // }
      const currentSolanaWallet = new SolanaWallet(particle.auth);

      setParticle(particle);
      setParticleProvider(currentParticleProvider);
      setSolanaWallet(currentSolanaWallet);
    }
  }, [particleProvider]);

  return (
    <ParticleContext.Provider
      value={{ particle, particleProvider, solanaWallet }}
    >
      {children}
    </ParticleContext.Provider>
  );
};
