import React, { FC, useMemo, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import PhaserGameWrapper from "../components/PhaserGameWrapper";
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
    <Box bg="black">
      <Header onConnect={handleConnect} authStatus={authStatus} />
      <PhaserGameWrapper />
      <Footer />
    </Box>
  );
}
