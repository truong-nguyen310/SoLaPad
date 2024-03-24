import { PublicKey } from "@solana/web3.js";
import { FormButton } from "../create/form-component";
import { useAirdropTokens, useGetDbProject, useGetProject } from "./airdrop-data-access";
import allstarList from "@/app/utils/allstar/list";
import { useState } from "react";

export function AirdropBar({ mint }: { mint: PublicKey }) {
  const query = useGetProject({mint});
  
  const calcPaidBar = (value: number, totalValue: number) => {
    return Math.round(value/totalValue * 100);
  }

  return (
    <div className="w-full">
      {  
        query.data ? 
          <div className="w-full text-center">     
            <div className="m-auto w-11/12 md:w-2/3 lg:w-1/2 h-10 bg-[#9e9ea8] rounded-lg">
              <div className="bg-gradient-to-r from-golden-100 to-golden-200 h-10 rounded-lg" style={
                {width: `${calcPaidBar(query.data.recipientsPaid, query.data.recipients)}%`}}>
              </div>
            </div>
            <h3 className="text-2xl font-bold my-3">
              {calcPaidBar(query.data.recipientsPaid, query.data.recipients)}% Completed
            </h3>
          </div>
        : <div className="text-center">Loading....</div> 
      }
    </div>
  );
}

export function RecipientsInfo({mint}: {mint: PublicKey}) {
  const query = useGetProject({mint});

  return (
    <div className="flex flex-row gap-8">
      <div className="">Number of Recipients: {query.data ? query.data.recipients : "loading"}</div>
      <div className="">Recipients Paid: {query.data ? query.data.recipientsPaid : "loading"}</div>
    </div>
  )
}

export function DistributionButton({mint}: {mint: PublicKey}) {
  const [buttonText, setButtonText] = useState("Start Distribution");

  const query = useGetProject({mint});
  const dbQuery = useGetDbProject({mint: mint.toBase58()});
  const mutation = useAirdropTokens({mint, setButtonText});

  const handleClick = (
    totalRecipients: number,
    recipientsPaid: number,
    recipients: string[],
    recipientsTokens: bigint[],
    allstar: boolean,
    allstarTokens: bigint
  ) => {
    let updatedRecipients = [...recipients];
    let updatedTokens = [...recipientsTokens];

    if (allstar && allstarTokens) {
      const allstarAmount = allstarTokens / BigInt(allstarList.length);

      for (let i = 0; i < allstarList.length; i++) {
        updatedRecipients.push(allstarList[i]);
        updatedTokens.push(allstarAmount);
      }
    }

    const startIndex = recipientsPaid;
    const recipientsRemain = totalRecipients - recipientsPaid;
    const endIndex = recipientsRemain < 8 ? startIndex + recipientsRemain : startIndex + 8;

    if (endIndex > startIndex) {
      mutation.mutate({
        recipients: updatedRecipients.slice(startIndex, endIndex),
        recipientsTokens: updatedTokens.slice(startIndex, endIndex)
      })
    } else {
      return;
    }
  }

  return (
    <FormButton title={buttonText} addClass="bg-gradient-to-b from-golden-100 to-golden-200
      text-white py-3 px-5 text-sm" 
      disabled={query.data && dbQuery.data && !mutation.isPending ? false : true}
      onClick={() => handleClick(
        query.data ? query.data.recipients : 0,
        query.data ? query.data.recipientsPaid : 0,
        dbQuery.data && dbQuery.data.recipients ? dbQuery.data.recipients : [],
        dbQuery.data && dbQuery.data.recipientsTokens ? dbQuery.data.recipientsTokens : [],
        dbQuery.data && dbQuery.data.allstar ? dbQuery.data.allstar : false,
        dbQuery.data && dbQuery.data.allstarTokens ? dbQuery.data.allstarTokens : BigInt(0)
      )}
    />
  )
}