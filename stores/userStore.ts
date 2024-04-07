import { Wallet } from "@/types/Wallet";
import { UserInfo } from "@particle-network/auth-core";
import { AnchorProvider } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { create } from "zustand";
import { ShdwDrive } from "@shadow-drive/sdk";

type Store = {
  loggedIn: boolean;
  loginType: string;
  username: string;
  solana_wallet_address: string;
  currentConnection: Connection | null;
  signTransaction: any | null;
  signAllTransactions: any | null;
  currentProvider: AnchorProvider | null;
  currentWallet: Wallet | null;
  currentUserInfo: UserInfo | null;
  shadowDriveConnection: ShdwDrive | null;
  ip_address: string;
  userProfilePic: string;
  setLogin: (
    status: boolean,
    loginType: string,
    username: string,
    solana_wallet_address: string,
    currentConnection: Connection | null,
    signTransaction: any | null,
    signAllTransactions: any | null,
    currentProvider: AnchorProvider | null,
    currentWallet: Wallet | null,
    currentUserInfo: UserInfo | null,
    shadowDriveConnection: ShdwDrive | null,
    ip_address: string
  ) => void;
};

export const userStore = create<Store>((set) => ({
  loggedIn: false,
  loginType: "",
  username: "",
  solana_wallet_address: "",
  currentConnection: null,
  signTransaction: null,
  signAllTransactions: null,
  currentProvider: null,
  currentWallet: null,
  currentUserInfo: null,
  shadowDriveConnection: null,
  ip_address: "",
  userProfilePic:
    "https://shdw-drive.genesysgo.net/5jHWA7UVajMawLH2wVCZdp3U4u42XsF8rSa1DcEQui72/profilePicWhite.svg",
  setLogin: (
    status,
    loginType,
    username,
    solana_wallet_address,
    currentConnection,
    signTransaction,
    signAllTransactions,
    currentProvider,
    currentWallet,
    currentUserInfo,
    shadowDriveConnection,
    ip_address
  ) =>
    set({
      loggedIn: status,
      loginType: loginType,
      username: username,
      solana_wallet_address: solana_wallet_address,
      currentConnection: currentConnection,
      signTransaction: signTransaction,
      signAllTransactions: signAllTransactions,
      currentProvider: currentProvider,
      currentWallet: currentWallet,
      currentUserInfo: currentUserInfo,
      shadowDriveConnection: shadowDriveConnection,
      ip_address: ip_address,
    }),
}));

export default userStore;
