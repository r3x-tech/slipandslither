const anchor = require("@project-serum/anchor");
import { OwnedStorageAccount, StorageAccountResponse } from "@/types/types";
import { apiRequest } from "./index";
import {
  ShdwDrive,
  ShadowUploadResponse,
  ShadowBatchUploadResponse,
  ShadowFile,
  ShadowEditResponse,
} from "@shadow-drive/sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import userStore from "@/stores/userStore";
import { error } from "console";
import * as bs58 from "bs58";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

export const setShdwConnection = async (
  connection: Connection,
  wallet: AnchorWallet
): Promise<any> => {
  console.log("connection: ", connection);
  console.log("anchorWallet: ", wallet);

  if (!process.env.NEXT_PUBLIC_PSKW) {
    throw Error("Failed to init shdw connection");
  }

  const keypair = Keypair.fromSecretKey(
    bs58.decode(process.env.NEXT_PUBLIC_PSKW)
  );
  let KEY: any = keypair;
  KEY.payer = keypair;

  try {
    const drive = await new ShdwDrive(connection, KEY).init();
    console.log("drive ", drive);
    if (drive) {
      userStore.setState({ shadowDriveConnection: drive });
    }
    return drive;
  } catch (error) {
    console.error("Error while connecting to shadow:", error);
    return null;
  }
};

export const createStorageAccount = async (
  bucketName: string,
  size: string
): Promise<StorageAccountResponse | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    if (drive) {
      const accountData = await drive.createStorageAccount(bucketName, size);
      return accountData;
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while creating storage account:", error);
    return null;
  }
};

export const getOwnedStorageAccounts = async (
  connection: any,
  wallet: any
): Promise<OwnedStorageAccount[] | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    if (drive) {
      const accts = await drive.getStorageAccounts();

      if (accts && accts.length > 0) {
        // let acctPubKey = new PublicKey(accts[0].publicKey);
        let acctPubKey = new PublicKey(
          "Hot7p6osENrZBtMrPhob19Bf9vorpK6JFq3mSuvu7bZx"
        );
        console.log(acctPubKey.toBase58());
      }
      return accts;
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while getting owned storage accounts:", error);
    return null;
  }
};

export const getStorageAccount = async (
  publicKey: string,
  connection: any,
  wallet: any
): Promise<OwnedStorageAccount | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    if (drive) {
      const acct = await drive.getStorageAccount(new PublicKey(publicKey));

      if (acct) {
        console.log(acct);
        return acct;
      } else {
        throw Error("No account found with the given public key");
      }
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while getting specific storage account:", error);
    return null;
  }
};

export type FileInput = File | FileList | Array<File>;

export const uploadSingleFile = async (
  connection: any,
  wallet: any,
  file: File
): Promise<ShadowUploadResponse | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;

    if (drive) {
      const accts = await drive.getStorageAccounts();
      if (accts && accts.length > 0) {
        // let acctPubKey = new PublicKey(accts[0].publicKey);
        let acctPubKey = new PublicKey(
          "Hot7p6osENrZBtMrPhob19Bf9vorpK6JFq3mSuvu7bZx"
        );

        const uploadResponse: ShadowUploadResponse = await drive.uploadFile(
          acctPubKey,
          file
        );
        return uploadResponse;
      } else {
        throw Error("No storage accounts found");
      }
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while uploading file:", error);
    return null;
  }
};

export const uploadMultipleFiles = async (
  connection: any,
  wallet: any,
  files: FileList | File[]
): Promise<ShadowBatchUploadResponse[] | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    console.log("MADE IT 1");

    if (drive) {
      const accts = await drive.getStorageAccounts();
      console.log("MADE IT 2");

      if (accts && accts.length > 0) {
        // let acctPubKey = new PublicKey(accts[0].publicKey);
        let acctPubKey = new PublicKey(
          "Hot7p6osENrZBtMrPhob19Bf9vorpK6JFq3mSuvu7bZx"
        );
        console.log("MADE IT 3");

        const uploadResponses: ShadowBatchUploadResponse[] = await Promise.all(
          Array.from(files).map(async (file: File) => {
            const response = await drive.uploadFile(acctPubKey, file);
            return {
              fileName: file.name,
              status: response.message,
              location: response.finalized_locations[0],
            };
          })
        );
        console.log("MADE IT 4");

        return uploadResponses;
      } else {
        throw Error("No storage accounts found");
      }
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while uploading multiple files:", error);
    return null;
  }
};

export const deleteFile = async (
  publicKey: string,
  url: string
): Promise<boolean> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    if (drive) {
      const acctPubKey = new PublicKey(publicKey);
      await drive.deleteFile(acctPubKey, url);
      return true;
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while deleting file:", error);
    return false;
  }
};

export const editFile = async (
  publicKey: string,
  url: string,
  data: File | ShadowFile
): Promise<ShadowEditResponse | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    if (drive) {
      const acctPubKey = new PublicKey(publicKey);
      const response = await drive.editFile(acctPubKey, url, data);
      return response;
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while editing (replacing) file:", error);
    return null;
  }
};

export const listStorageAccountFiles = async (
  publicKey: string
): Promise<string[] | null> => {
  try {
    const drive = userStore.getState().shadowDriveConnection;
    if (drive) {
      const acctPubKey = new PublicKey(publicKey);
      const response = await drive.listObjects(acctPubKey);
      return response.keys;
    } else {
      throw Error("Shadow Drive connection is null");
    }
  } catch (error) {
    console.error("Error while listing storage account files:", error);
    return null;
  }
};

// import bs58 from "bs58";
// import nacl from "tweetnacl";
// import crypto from "crypto";

// // Type definitions
// type FileData = {
//   fileName: string;
//   data: Blob;
//   contentType: string;
// };

// type KeyPair = {
//   secretKey: Uint8Array;
//   publicKey: Uint8Array;
// };

// const SHDW_DRIVE_ENDPOINT = "YOUR_ENDPOINT_HERE"; // Replace with your endpoint

// async function uploadFilesToShadowDrive(
//   files: FileData[],
//   storageAccount: string,
//   keypair: KeyPair
// ): Promise<Response> {
//   const allFileNames: string[] = files.map((file) => file.fileName);
//   const hashSum = crypto.createHash("sha256");
//   const hashedFileNames = hashSum.update(allFileNames.toString());
//   const fileNamesHashed = hashSum.digest("hex");

//   const msg = `Shadow Drive Signed Message:\nStorage Account: ${storageAccount}\nUpload files with hash: ${fileNamesHashed}`;

//   const fd = new FormData();
//   for (let j = 0; j < files.length; j++) {
//     const blob = new Blob([files[j].data], { type: files[j].contentType });
//     fd.append("file", blob, files[j].fileName);
//   }

//   const encodedMessage = new TextEncoder().encode(msg);
//   const signedMessage = nacl.sign.detached(encodedMessage, keypair.secretKey);
//   const signature = bs58.encode(signedMessage);

//   fd.append("message", signature);
//   fd.append("signer", keypair.publicKey.toString());
//   fd.append("storage_account", storageAccount.toString());
//   fd.append("fileNames", allFileNames.toString());

//   const request = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
//     method: "POST",
//     body: fd,
//   });

//   return request;
// }
