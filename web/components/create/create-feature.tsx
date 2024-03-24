'use client'

import { createContext, useEffect, useState } from "react";
import {presets} from "../dashboard/presets";
import {createDaoAddress, FormDataError, joiValidation} from "../../app/utils/validation";
import { FormDisplay } from "./form-display";
import { FormReview } from "./form-review";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { FormComplete } from "./form-complete";
import { PublicKey } from "@solana/web3.js";
import { useDaoAvailCheck } from "./create-data-access";
import { FormLaunch } from "./form-launch";

export const FormContext = createContext<FormContextType | null>(null);

export default function CreateFeature() {
    const params = useParams<{type: string}>();
    const typeParam = params.type;
    const typeParamNum = parseInt(typeParam);

    let type = 7;

    if (typeParam && !isNaN(typeParamNum) && typeParamNum < 7 && typeParamNum > 0) {
        type = parseInt(typeParam)
    }

    const {connected} = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!connected) {
            toast.error(`Wallet is not connected!`);
            router.push('/');
        }
    }, [connected, router])
    
    const preset = presets[type-1];
    const defaultErrors = {
        name: "", symbol: "", supply: "", daoName: "", quorum: "", minToVote: "", voteDuration: "", img: ""
    };

    const [page, setPage] = useState(0);
    const [imgFile, setImgFile] = useState<File>();
    const [mint, setMint] = useState("");

    const [img, setImg] = useState<Blob>();
    const [formData, setFormData] = useState<FormContent>({
        name: "",
        symbol: "",
        supply: type === 5 ? BigInt(100) : BigInt(0),
        decimals: type === 5 ? 0 : 6,
        daoName: "",
        quorum: preset.quorum,
        minToVote: preset.minToVote,
        council: preset.council,
        voteDuration: preset.voteDuration,
        allocation: preset.allocation
    });
    const [formError, setFormError] = useState<FormDataError>(defaultErrors);

    const [buttonText, setButtonText] = useState("Launch Token");
    const [imgLink, setImgLink] = useState("");
    const [jsonLink, setJsonLink] = useState("");
    const [tx, setTx] = useState("");
    const [dbId, setDbId] = useState("");

    const daoAddress = new PublicKey(createDaoAddress(formData.daoName));
    const daoMutation = useDaoAvailCheck(daoAddress);

    const handleChange = (property: string, value: string | number | bigint | boolean) => {
        const data = {...formData};
        
        switch(property) {
            case "name":
                if (typeof value !== "string") return;
                data[property] = value;
                break;
            
            case "symbol":
                if (typeof value !== "string") return;
                data[property] = value.toUpperCase();
                break;

            case "supply":
                if (typeof value !== "bigint") return;
                data[property] = value;
                break;

            case "decimals":
                if (typeof value !== "number") return;
                data[property] = value;
                break;

            case "daoName":
                if (typeof value !== "string") return;
                data[property] = value;
                break;
    
            case "voteDuration":
                if (typeof value !== "number") return;
                data[property] = value;
                break;

            case "council":
                if (typeof value !== "boolean") return;
                data[property] = value;
                break;
            
            case "quorum":
                if (typeof value !== "number") return;
                data[property] = value;
                break;
            
            case "minToVote":
                if (typeof value !== "number") return;
                data[property] = value;
                break;
            
            default:
                return;
        }

        setFormError({...defaultErrors})
        setFormData(data);
    }

    const handleForm = async() => {
        const errors: FormDataError = {...defaultErrors};

        if (!img) {
            errors.img = "No image is selected"; 
            setFormError(errors);
            return;
        }

        const result = joiValidation(formData);

        if (result.error) {
            const newErrorInc = result.error.message.slice(1);
            const quoteIndex = newErrorInc.indexOf('"');
            
            const property = newErrorInc.slice(0,quoteIndex);
            const newError = newErrorInc.replace('"', '');
            
            errors[property] = newError;
            setFormError(errors);

            return;
        } else {
            console.log(formData.supply)
            if (formData.supply < BigInt(1)) {
                errors.supply = "The supply can't be lower than 1";
                setFormError(errors);
                return;
            }
            
            const isDaoExist = await daoMutation.mutateAsync();

            if (isDaoExist) {
                errors.daoName = "DAO with this name already exists";
                setFormError(errors);
                return;
            } else {
                setPage(1)
            }
        }
    }

    const handleImg = (selectImg: File | undefined) => {
        if (selectImg) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (e.target) {
                    const blob = new Blob([new Uint8Array(e.target.result as ArrayBuffer)], {type: selectImg.type });
                    setImg(blob);
                    setImgFile(selectImg);
                }
            };
            reader.readAsArrayBuffer(selectImg);
            setFormError({...defaultErrors})
        } else {
            setImg(undefined)
        }
    }

    return (
        <FormContext.Provider value={{formData, img, imgFile, type, mint, setPage, setMint}}>
            {   
                page === 3 ?
                    <FormComplete />
                : 
                page === 2 ? 
                    <FormLaunch imgLink={imgLink} jsonLink={jsonLink} tx={tx} dbId={dbId} buttonText={buttonText}
                    setImgLink={setImgLink} setJsonLink={setJsonLink} setTx={setTx} setButtonText={setButtonText}
                    setDbId={setDbId} />
                :    
                page === 1 ?
                    <FormReview />
                :
                    <FormDisplay preset={preset} formError={formError} handleChange={handleChange}
                    handleForm={handleForm} handleImg={handleImg} daoMutation={daoMutation}/>
            }
        </FormContext.Provider>
    )
}