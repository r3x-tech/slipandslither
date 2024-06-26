// import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { NFT, ServiceCharge, TxResponse } from "@/types/types";
import axios from "axios";
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";

export async function signAndSendTransaction(
  encodedTx: string,
  connection: Connection | null,
  signTransaction: any
) {
  try {
    if (!connection) {
      throw Error("No wallet connection");
    }
    if (!signTransaction) {
      throw Error("Signing tx unavailable");
    }
    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTx, "base64")
    );
    // const recoveredTransaction = getRawTransaction(encodedTx);
    const signedTx = await signTransaction(recoveredTransaction);
    console.log(
      "signed tx: ",
      Buffer.from(signedTx!.serialize()).toString("base64")
    );
    const txnSignature = await connection.sendRawTransaction(
      signedTx.serialize()
    );
    return txnSignature;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw error;
  }
}

function getRawTransaction(
  encodedTransaction: string
): Transaction | VersionedTransaction {
  let recoveredTransaction: Transaction | VersionedTransaction;
  try {
    recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
  } catch (error) {
    recoveredTransaction = VersionedTransaction.deserialize(
      Buffer.from(encodedTransaction, "base64")
    );
  }
  return recoveredTransaction;
}
