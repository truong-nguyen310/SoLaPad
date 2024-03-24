import Image from "next/image"
import { ChangeEvent, ReactNode } from "react"

export default function FormComponent({title, meta, children, addButton, handleFn}: FormElements) {
    return (
        <div className="bg-back-200 border-[1px] border-border-form rounded-lg w-11/12  lg:w-7/12 overflow-hidden">
            <div className="p-4">
                <div className="flex flex-row w-full justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">{title}</h2>
                        <p className="text-sm text-secondary-text">{meta}</p>
                    </div>
                    {addButton && handleFn ?
                        <div className="">
                            <input type="file" accept=".csv" id="csv-button" hidden
                                onChange={handleFn}
                            />
                            <label htmlFor="csv-button" className="mr-2 text-sm py-2 px-6 rounded-lg 
                                border-[1px] border-[#2C2C5A] cursor-pointer">Upload CSV</label>
                        </div>
                        
                        : ""
                    }
                </div>
                <hr className='border-[#2C2C5A] border-b-[1px] my-3'/>
                {children}
            </div>
        </div>
    )
}

export function FormInput({name, placeholder, type, addClass, value, onChange, readonly, errorMsg}: FormInputProps) {
    return (
        <div className="form-input-element w-full">
            <FormMinHeading title={name} />
            <input type={type} placeholder={placeholder} className={`border-[1px] bg-border-form rounded-md h-10
            text-sm p-4 text-white ${addClass} ${errorMsg ? 'border-[#cc3300]' : 'border-[#1E2043]'}`} 
            value={value && value} onChange={onChange} 
            readOnly={readonly}/>
            <p className="text-[#cc3300] text-sm mt-2 font-normal">{errorMsg}</p>
        </div>
    )
}

export function FormMinHeading({title}: {title: string}) {
    return <h5 className="mt-3 my-1 text-sm text-white font-medium">{title}</h5>

}

export function FormMinText({title}: {title: string | number}) {
    return <h5 className="mt-3 my-1 text-sm text-secondary-text font-normal">{title}</h5>
}

export function FormTopHeading({title}: {title: string}) {
    return (
        <div className="bg-back-200 border-[1px] border-border-form rounded-lg w-11/12 lg:w-7/12 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#F3BC51] to-[#936100]"></div>
            <div className="p-4">
            <h2 className="text-[22px] font-semibold text-white">{title}</h2>
            <p className="text-sm text-secondary-text">Style your organization and determine token&apos;s details</p>
            </div>
        </div>
    )
}

export function FormButton({title, onClick, disabled, addClass}: FormButtonProps) {
    return (
        <button className={`rounded-lg font-medium text-secondary-text
            hover:cursor-pointer hover:bg-[#3b3b62] text-sm
            ${addClass} disabled:bg-none disabled:border-[1px] disabled:border-[#2C2C5A] 
            disabled:text-secondary-text disabled:bg-[#1E2043]`} 
            onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}

export function DeleteButton({fn, index, title, addClass}: DeleteButtonProps) {
    return (
        <h5 className={`mr-2 text-sm py-2 px-4 rounded-lg border-[1px] border-[#2C2C5A] cursor-pointer ${addClass}`}
            onClick={() => fn(index)}
        >
            {title} <Image src="/delete.png" alt="delete" width={14} height={20} className="inline-block ml-2" />
        </h5>
    )
}

export function FormAllocationTabs(
    {tabName, tabIx, tabVal, changeTabVal, total}: 
    {tabName: string, tabIx: number, tabVal: number, total: bigint, changeTabVal: (i: number, n: number) => void}
) {

    let tokenValue: BigInt;
    let percentage = tabVal ? tabVal : 0;

    if (tabIx === 2) {
        tokenValue = total - (total * BigInt(100-percentage) / BigInt(100))
    } else {
        try {
            tokenValue = total * BigInt(percentage) / BigInt(100)
        } catch {
            tokenValue = BigInt(0);
        }
    }
    
    return (
        <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-end">
            <div className="flex flex-col">
                <h6 className="text-sm text-white font-medium mb-1">Name</h6>
                <input type="text" className="bg-border-form text-white font-light
                    rounded-md h-10 text-[13px] p-4" value={tabName} disabled/>
            </div>
            <div className="flex flex-col">
                <h6 className="text-sm text-white font-medium mb-1">Percentage</h6>
                <input type="number" className="bg-border-form text-white font-light
                    rounded-md h-10 text-[13px] p-4" value={tabVal} 
                    onChange={(e) => changeTabVal(tabIx, parseInt(e.target.value))}/> 
            </div>
            <div className="flex flex-col">
                <h6 className="text-sm text-white font-medium mb-1">Tokens</h6>
                <input type="number" className="bg-border-form text-white font-light
                    rounded-md h-10 text-[13px] p-4" value={tokenValue.toString(10)} disabled
                /> 
            </div>
        </div>
    )
}