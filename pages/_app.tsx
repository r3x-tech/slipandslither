import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "@/styles/theme";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Router from "next/router";
import withGA from "next-ga";
import { Analytics } from "@vercel/analytics/react";
import { ParticleProvider } from "@particle-network/provider";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <ParticleProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Analytics />
          <Toaster />
        </QueryClientProvider>
      </ChakraProvider>
    </ParticleProvider>
  );
}

export default withGA("G-9478EJWGHV", Router)(App);
