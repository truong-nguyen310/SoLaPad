import { getRecord } from "@/app/actions/fetch-record";
import { generateProgram } from "@/app/utils/anchor";
import { BN, utils } from "@coral-xyz/anchor";
import { AnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTransaction } from "../create/create-data-access";
import { useTransactionToast } from "../ui/ui-layout";

export function useGetProject({ mint }: { mint: PublicKey }) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const program = generateProgram(connection, wallet as AnchorWallet);

    const [projectKey] = PublicKey.findProgramAddressSync([
        Buffer.from("tatami-project"),
        mint.toBuffer()
    ], program.programId);

    return useQuery({
      queryKey: ['get-project', { endpoint: connection.rpcEndpoint, mint }],
      queryFn: () => program.account.project.fetch(projectKey),
    });
}

export function useGetDbProject({mint} : {mint: string}) {
    return useQuery({
        queryKey: ['get-db-project', {mint}],
        queryFn: () => getRecord(mint)
    })
}

export function useAirdropTokens({mint, setButtonText}: {mint: PublicKey, setButtonText: (s: string) => void}) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const transactionToast = useTransactionToast();
    const client = useQueryClient();

    return useMutation({
        mutationKey: [
            'airdrop-tokens',
            { endpoint: connection.rpcEndpoint, mint }
        ],
        mutationFn: async(
            {recipients, recipientsTokens} :
            {recipients: string[], recipientsTokens: bigint[]}
        ) => { 
            const program = generateProgram(connection, wallet as AnchorWallet);
            const programId = program.programId;

            const ixs: TransactionInstruction[] = [];
            
            const [vault] = PublicKey.findProgramAddressSync([Buffer.from("tatami-vault")], programId);
            const vaultTokenAccount = utils.token.associatedAddress({mint, owner: vault});

            const [project] = PublicKey.findProgramAddressSync([
                Buffer.from("tatami-project"),
                mint.toBuffer()
            ], programId);

            let signature: TransactionSignature = '';

            try {
                setButtonText("Distributing");

                for (let i = 0; i < recipients.length; i++) {
                    const receiver = new PublicKey(recipients[i]);
                    const recipientTokenAccount = utils.token.associatedAddress({mint, owner: receiver});
    
                    const ix = await program.methods.airdropTokens(new BN(recipientsTokens[i]))
                    .accounts({
                        mint,
                        vault,
                        vaultTokenAccount,
                        receiver,
                        recipientTokenAccount,
                        project
                    })
                    .instruction();
    
                    ixs.push(ix);
                };
    
                const {transaction, latestBlockhash} = await createTransaction(
                    {ixs, connection, payer: wallet.publicKey as PublicKey}
                );
                
                console.log(transaction);
                
                signature = await wallet.sendTransaction(transaction, connection);
                
                await connection.confirmTransaction(
                    { signature, ...latestBlockhash },
                    'confirmed'
                );
                
                setButtonText("Start Distribution")
                console.log(signature);
                return signature;
            } catch(error: unknown) {
                setButtonText("Try Again");
                console.log('error', `Transaction failed! ${error}`, signature);
                return error;
            }
        },
        onSuccess: (signature: string | unknown) => {
            if (signature && typeof signature === "string") {
                transactionToast(signature);
            }
            return Promise.all([
                client.invalidateQueries({
                    queryKey: ['get-project', { endpoint: connection.rpcEndpoint, mint }]
                }),
                client.invalidateQueries({
                    queryKey: ['get-db-project', {mint}],
                }),
            ]);
        },
        onError: (error) => {
            toast.error(`Transaction failed! ${error}`);
        },
    })
}