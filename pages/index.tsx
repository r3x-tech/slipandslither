import React, { FC, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Box, Button, Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import PhaserGameWrapper from "../components/PhaserGameWrapper";
import { ContextProvider } from "@/contexts/ContextProvider";
import { Footer } from "@/components/Footer";
require("@solana/wallet-adapter-react-ui/styles.css");

export default function HomePage() {
  const [authStatus, setAuthStatus] = useState("unauthenticated");

  const handleConnect = async () => {
    try {
      setAuthStatus("authenticated");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Header onConnect={handleConnect} authStatus={authStatus} />
      <PhaserGameWrapper />
      <Footer />
    </Box>
  );
}
