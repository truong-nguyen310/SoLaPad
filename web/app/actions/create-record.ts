"use server"

import dbConnect from "../lib/db"
import Token from "../models/token.model";

export const createRecord = async(
    mint: string,
    recipients: Recipient[],
    airdropAllocation: bigint,
    allstarAllocation: bigint
) => {
    await dbConnect();

    const allstar = allstarAllocation ? true : false;
    const recipientsAddresses = recipients.map(r => r.pubkey)
    const recipientsTokens = recipients.map(r => r.amount);

    const token = await Token.create(
        {
            mint,
            allstar,
            airdropTokens: airdropAllocation,
            allstarTokens: allstarAllocation,
            recipients: recipientsAddresses,
            recipientsTokens
        }
    );

    return token._id.toString();
}