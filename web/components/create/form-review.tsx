import Image from "next/image";
import { useContext } from "react";
import { FormContext } from "./create-feature";
import FormComponent, { FormButton, FormMinHeading, FormMinText, FormTopHeading } from "./form-component";



export function FormReview() {
    const {formData, img, setPage} = useContext(FormContext) as FormContextType;

    return (
        <div className="flex flex-col md:flex-row w-full mb-16">
            <div className="create-main w-full md:w-3/4 flex flex-col items-center gap-6 z-10 mt-8">
                <FormTopHeading title="Review" />

                <FormComponent title="Branding" meta="">
                    <div className="flex flex-row justify-center">
                        <div className="key w-1/2 md:w-2/6">
                            <FormMinHeading title="Token Symbol" />
                            <FormMinHeading title="Token Symbol" />
                            <FormMinHeading title="Token Supply" />
                            <FormMinHeading title="Token Logo" />
                        </div>
                        <div className="value w-1/2 md:w-4/6">
                            <FormMinText title={formData.name} />
                            <FormMinText title={formData.symbol} />
                            <FormMinText title={`${formData.supply.toString(10)} ${formData.symbol}`} />
                            <div className="mt-3">
                                <Image src={window.URL.createObjectURL(img as Blob)} alt="token logo" width={34} height={34}/>
                            </div>
                        </div>
                    </div>
                </FormComponent>
                
                <FormComponent title="DAO Details" meta="">
                    <div className="flex flex-row justify-center">
                        <div className="key w-1/2 md:w-2/6">
                            <FormMinHeading title="DAO Name" />
                            <FormMinHeading title="Quorum" />
                            <FormMinHeading title="Min tokens for proposal" />
                            <FormMinHeading title="Vote Base time" />
                        </div>
                        <div className="value w-1/2 md:w-4/6">
                            <FormMinText title={formData.daoName} />
                            <FormMinText title={formData.quorum+"%"} />
                            <FormMinText title={`${formData.minToVote} ${formData.symbol}`} />
                            <FormMinText title={formData.voteDuration/3600+" hours"} />                           
                        </div>
                    </div>
                </FormComponent>
                <div className="flex flex-row items-start gap-1 text-[#9393A9]">
                    <FormButton title="Save & Continue" onClick={() => setPage(2)} addClass="py-3 border-[1px] 
                        border-[#2C2C5A] bg-[#1E2043] px-8"/>
                    <FormButton title="Back" onClick={() => setPage(0)} addClass="py-3 px-8"/>
                </div>
            </div>
        </div>
    )
}