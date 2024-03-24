import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { TatamiV2 } from "./idl/tatami";
import idl from "./idl/tatami.json";

export const generateProgram = (connection: Connection, anchorWallet: AnchorWallet) => {
    const programId = new PublicKey("HrKLeJB6yoSWkFzVSfsg8Yi3Zs4PKZ7qqjkMz978qqZv");
    const provider = new AnchorProvider(connection, anchorWallet, {commitment: "confirmed", skipPreflight: true});
    const program = new Program<TatamiV2>(idl as TatamiV2, programId, provider);

    return program;
}