"use server"

import dbConnect from "../lib/db";
import Token from "../models/token.model";

export const getRecord = async(mint: string): Promise<TokenRecord>  => {
    await dbConnect();

    const record = await Token.findOne({mint});
    
    return {
        mint: record?.mint, 
        allstar: record?.allstar, 
        airdropTokens: record?.airdropTokens, 
        allstarTokens: record?.allstarTokens, 
        recipients: record?.recipients, 
        recipientsTokens: record?.recipientsTokens
    }
}