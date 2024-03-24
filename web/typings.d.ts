interface FormContent {
    name: string,
    symbol: string,
    supply: bigint,
    decimals: number,
    daoName: string,
    quorum: number,
    minToVote: number,
    voteDuration: number,
    council: boolean,
    allocation: number[]
};

type FormLaunchProps = {
    imgLink: string,
    tx: string,
    dbId: string,
    jsonLink: string,
    buttonText: string
    setImgLink: (s: string) => void,
    setJsonLink: (s: string) => void,
    setTx: (s: string) => void,
    setDbId: (s: string) => void,
    setButtonText: (s: string) => void
}

type Recipient = {
    pubkey: string,
    amount: bigint
}

type CreateMetadataProp = {
    img: File, 
    address: PublicKey,
    formData: FormContent,
    isImg: string,
    isJson: string,
    isTx: string,
    isDbId: string,
    setButtonText: (s: string) => void,
    setImgLink: (s: string) => void,
    setJsonLink: (s: string) => void,
    setTx: (s: string) => void,
    setDbId: (s: string) => void,
}
  
type MutationProps = {
    teamWallet: PublicKey | null, 
    recipients: Recipient[], 
    allocation: bigint[]
}

type FormContextType = {
    img: Blob | undefined,
    imgFile: File | undefined,
    formData: FormContent,
    type: number,
    setPage: (page: number) => void,
    setMint: (s: string) => void,
    mint: string
}

type FormElements = {
    title: string,
    meta: string,
    children: ReactNode,
    addButton?: boolean,
    handleFn?: (e: ChangeEvent<HTMLInputElement>) => void
}

type FormInputProps = {
    name: string,
    placeholder: string,
    type: string,
    addClass?: string,
    value?: string | number,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    readonly?: boolean,
    errorMsg?: string
}

type FormButtonProps = {
    title: string,
    onClick?: () => void,
    disabled?: boolean,
    addClass?: string,
}

type DeleteButtonProps = {
    fn: (n: number) => void,
    index: number, 
    title: string,
    addClass?: string 
}

type PresetBoxProps = {
    title: string;
    desc: string[];
    price: number;
    type: number;
}

type Preset = {
    title: string,
    details: string[],
    price: number,
    link: string,
    voteDuration: number,
    council: boolean,
    minToVote: number,
    quorum: number,
    allocation: number[]
}

type TokenRecord = {
    mint: string | undefined,
    allstar: boolean | undefined,
    allstarTokens: bigint | undefined,
    recipients: string[] | undefined,
    recipientsTokens: bigint[] | undefined,
    airdropTokens: bigint | undefined
}