import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "@/styles/theme";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SolanaProvider } from "@/contexts/SolanaProvider";
import { Toaster } from "react-hot-toast";
import Router from "next/router";
import withGA from "next-ga";
import { Analytics } from "@vercel/analytics/react";
import { ParticleContextProvider } from "@/contexts/ParticleContextProvider";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <ParticleContextProvider>
      <SolanaProvider>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Analytics />
            <Toaster />
          </QueryClientProvider>
        </ChakraProvider>
      </SolanaProvider>
    </ParticleContextProvider>
  );
}

export default withGA("G-9478EJWGHV", Router)(App);
