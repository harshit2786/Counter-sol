import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { test, expect } from "bun:test";
import { COUNTER_SIZE, schema } from "./types";
import * as borsh from "borsh";

const MyAcc = Keypair.generate();
const MyDataAccount = Keypair.generate();
const MyProgramPubKey = new PublicKey(
  "5zCoUANRHokBagRiqmfYytrKisTNtNtzV8cVSDxZqsnE"
);
const connection = new Connection("http://127.0.0.1:8899");

test("Account creation", async () => {
  const reqAirDrop = await connection.requestAirdrop(
    MyAcc.publicKey,
    1 * 1000000000
  );
  await connection.confirmTransaction(reqAirDrop);
  const data = await connection.getAccountInfo(MyAcc.publicKey);
  const lamports = await connection.getMinimumBalanceForRentExemption(
    COUNTER_SIZE
  );
  const ins = SystemProgram.createAccount({
    fromPubkey: MyAcc.publicKey,
    space: COUNTER_SIZE,
    programId: MyProgramPubKey,
    lamports,
    newAccountPubkey: MyDataAccount.publicKey,
  });
  const txn = new Transaction();
  txn.add(ins);
  const sig = await connection.sendTransaction(txn, [MyAcc, MyDataAccount]);
  await connection.confirmTransaction(sig);
  console.log(MyDataAccount.publicKey.toBase58());

  const dataInDataAccount = await connection.getAccountInfo(
    MyDataAccount.publicKey
  );
  if (dataInDataAccount?.data) {
    const desialisedData = borsh.deserialize(schema, dataInDataAccount?.data);
    console.log(desialisedData.count);
  }
});
