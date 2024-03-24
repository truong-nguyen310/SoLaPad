import { PublicKey } from "@solana/web3.js";
import * as Joi from "joi";
import { REALMS_PROGRAM_ID } from "./constants";

export interface FormDataError {
    [key: string]: string,
}

export const joiValidation = (data: FormContent) => {
    const dataAny: any = {...data};
    dataAny.supply = dataAny.supply.toString(10);

    const schema = Joi.object({
        name: Joi.string().min(4).max(40).required(),
        symbol: Joi.string().alphanum().min(2).max(8).required(),
        supply: Joi.string().required(),
        decimals: Joi.number().required().min(0).max(16),
        daoName: Joi.string().min(4).max(40).required(),
        quorum: Joi.number().integer().min(1).max(100).required(),
        minToVote: Joi.number().integer().min(1).required(),
        voteDuration: Joi.number().integer().min(1).required(),
        council: Joi.bool().required(),
        allocation: Joi.array().items(Joi.number()).length(4)
    });

    return schema.validate(dataAny);
}

export const getImgBuff = async(img: Blob) => {
    try {
        const buf = await img.arrayBuffer();
        return Buffer.from(buf).toString('hex')
    } catch(e: unknown) {
        return e;
    }
}

export const createDaoAddress = (daoName: string) => {
    return PublicKey.findProgramAddressSync([
        Buffer.from("governance"),
        Buffer.from(daoName)
    ],
        REALMS_PROGRAM_ID
    )[0].toBase58();
}

export const validateTokenString = (num: string, decimals: number) => {
    const deci = num.split(".");
    
    if (deci[1]) {
        deci[1] = deci[1].padEnd(decimals, "0").slice(0,6)
    } else {
        deci[0] = deci[0] + "0".repeat(decimals)
    }

    return deci.join("");
}

export const addDecimals = (value: bigint, decimals: number) => {
    return value * BigInt(Math.pow(10, decimals));
}

export const removeDecimals = (value: bigint, decimals: number) => {
    const str = value.toString(10);
    return str.slice(0, str.length-decimals) + "." + str.slice(str.length-decimals);
}

export const removeDecimalsNum = (value: bigint, decimals: number) => {
    return value / BigInt(Math.pow(10, decimals));

}