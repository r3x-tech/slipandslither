import userStore from "@/stores/userStore";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import { error } from "console";
import { useCallback } from "react";

type ButtonState = {
  buttonState:
    | "connecting"
    | "connected"
    | "disconnecting"
    | "has-wallet"
    | "no-wallet";
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSelectWallet?: () => void;
  publicKey?: PublicKey;
  walletIcon?: Wallet["adapter"]["icon"];
  walletName?: Wallet["adapter"]["name"];
};

type Config = {
  onSelectWallet: (config: {
    onSelectWallet: (walletName: Wallet["adapter"]["name"]) => void;
    wallets: Wallet[];
  }) => void;
};

export function useWalletMultiButton({ onSelectWallet }: Config): ButtonState {
  const {
    connect,
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    select,
    wallet,
    wallets,
  } = useWallet();
  let buttonState: ButtonState["buttonState"];
  if (connecting) {
    buttonState = "connecting";
    // console.log("1 - CONNECTING");
  } else if (connected) {
    buttonState = "connected";
    // console.log("1 - CONNECTED");
  } else if (disconnecting) {
    buttonState = "disconnecting";
    // console.log("1 - DISCONNECTING");
  } else if (wallet) {
    buttonState = "has-wallet";
    // console.log("1 - HAS WALLET");
  } else {
    buttonState = "no-wallet";
    // console.log("1 - NO WALLET FOUND");
  }
  const handleConnect = useCallback(async () => {
    console.log("1 - Running connection in uWMB hook");
    await connect().catch((error) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.error("Connect error: ", error);
    });
  }, [connect]);
  const handleDisconnect = useCallback(async () => {
    await disconnect().catch((error) => {
      // Silently catch because any errors are caught by the context `onError` handler
      console.error("Disconnect error: ", error);
    });
    // .then(() => {
    //   console.log("COMPLETED disconnectin SOLANANANAANANA");
    //   userStore.setState(
    //     {
    //       loggedIn: false,
    //       loginType: "",
    //       username: "",
    //       solana_wallet_address: "",
    //     },
    //     true
    //   );
    //   console.log(
    //     "ERASED USER STATE disconnectin SOLANANANAANANA, loggedIn is: ",
    //     userStore.getState().loggedIn
    //   );
    // });
  }, [disconnect]);
  const handleSelectWallet = useCallback(() => {
    console.log("1 - Selecting wallet in uWMB hook");
    onSelectWallet({ onSelectWallet: select, wallets });
  }, [onSelectWallet, select, wallets]);
  return {
    buttonState,
    onConnect: buttonState === "has-wallet" ? handleConnect : undefined,
    onDisconnect:
      buttonState !== "disconnecting" && buttonState !== "no-wallet"
        ? handleDisconnect
        : undefined,
    onSelectWallet: handleSelectWallet,
    publicKey: publicKey ?? undefined,
    walletIcon: wallet?.adapter.icon,
    walletName: wallet?.adapter.name,
  };
}
