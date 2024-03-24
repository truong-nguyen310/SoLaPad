import { FormDataError } from '@/app/utils/validation';
import {
  IconArrowBadgeDownFilled,
  IconArrowBadgeUpFilled,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useContext, useState } from 'react';
import FormComponent, {
  FormButton,
  FormInput,
  FormMinHeading,
  FormTopHeading,
} from './form-component';
import { FormContext } from './create-feature';
import { UseMutationResult } from '@tanstack/react-query';

type FormDisplayProps = {
  preset: Preset;
  formError: FormDataError;
  handleChange: (
    property: string,
    e: string | number | bigint | boolean
  ) => void;
  handleImg: (img: File | undefined) => void;
  handleForm: () => void;
  daoMutation: UseMutationResult<boolean, Error, void, unknown>;
};

export function FormDisplay({
  preset,
  handleChange,
  handleForm,
  handleImg,
  formError,
  daoMutation,
}: FormDisplayProps) {
  const [displayTokenAdvSettings, setDisplayTokenAdvSettings] = useState(false);
  const [displayAdvSettings, setDisplayAdvSettings] = useState(false);
  const { formData, type } = useContext(FormContext) as FormContextType;

  return (
    <div className="flex flex-col md:flex-row w-full mb-16">
      <div className="create-main w-full md:w-3/4 flex flex-col items-center gap-6 z-10 mt-8">
        <FormTopHeading title="Token Details" />

        <FormComponent title="Preset Details" meta="">
          <h5 className="mt-4 mb-1 text-sm">
            Read more about this preset here:
            <Link
              href={
                'https://github.com/Tatami-Maker/documentation/blob/main/' +
                preset.link
              }
              target="_blank"
              rel="noopener noreferrer"
              passHref
              className="text-[#F3BC51]
                        hover:text-white ml-2"
            >
              {preset.title}
            </Link>
          </h5>
        </FormComponent>

        <FormComponent title="Branding" meta="Name the token and add your logo">
          <FormInput
            name="Token Name"
            placeholder="e.g. SoLaPad Coin"
            type="text"
            addClass="w-11/12"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            errorMsg={formError.name}
          />

          <FormInput
            name="Token Symbol"
            placeholder="e.g. TCC"
            type="text"
            addClass="w-1/2"
            value={formData.symbol}
            onChange={(e) => handleChange('symbol', e.target.value)}
            errorMsg={formError.symbol}
          />

          <FormInput
            name="Token Supply"
            placeholder="e.g. 100000"
            type="number"
            addClass="w-1/2"
            value={formData.supply ? formData.supply.toString(10) : ''}
            onChange={(e) => handleChange('supply', BigInt(e.target.value))}
            readonly={type == 5 ? true : false}
            errorMsg={formError.supply}
          />

          <FormMinHeading title="Token Symbol" />
          <p className="text-sm text-[#9393A9] mb-2">
            .png or .jpg upto 1 MB in size
          </p>

          <input
            id="file-upload"
            type="file"
            accept=".png, .jpg"
            onChange={(e) =>
              handleImg(e.target.files ? e.target.files[0] : undefined)
            }
          />
          <p className="text-[#cc3300] text-sm mt-2 font-normal">
            {formError.img}
          </p>

          <h5
            className="mt-4 mb-1 font-medium cursor-pointer text-white"
            onClick={() => {
              setDisplayTokenAdvSettings(!displayTokenAdvSettings);
            }}
          >
            Advanced Settings
            {displayTokenAdvSettings ? (
              <IconArrowBadgeDownFilled className="inline" />
            ) : (
              <IconArrowBadgeUpFilled className="inline" />
            )}
          </h5>
          {displayTokenAdvSettings && (
            <FormInput
              name="Decimals"
              placeholder="e.g. 4"
              type="number"
              addClass="w-1/2"
              value={formData.decimals}
              onChange={(e) =>
                handleChange('decimals', parseInt(e.target.value))
              }
              errorMsg={formError.decimals}
              readonly={type == 5 ? true : false}
            />
          )}
        </FormComponent>

        <FormComponent
          title="DAO Details"
          meta="Name the DAO and edit the config"
        >
          <FormInput
            name="DAO Name"
            placeholder="e.g. SoLaPad Coin DAO"
            type="text"
            addClass="w-11/12"
            value={formData.daoName}
            onChange={(e) => handleChange('daoName', e.target.value)}
            errorMsg={formError.daoName}
          />
          <h5
            className="mt-4 mb-1 font-medium cursor-pointer text-white"
            onClick={() => {
              setDisplayAdvSettings(!displayAdvSettings);
            }}
          >
            Advanced Settings
            {displayAdvSettings ? (
              <IconArrowBadgeDownFilled className="inline" />
            ) : (
              <IconArrowBadgeUpFilled className="inline" />
            )}
          </h5>

          {displayAdvSettings && (
            <div className="adv-panel">
              <h6 className="text-[#cc3300] text-sm font-medium">
                Note: Change the following values only if you know what you are
                doing.
              </h6>

              <FormInput
                name="Quorum (%)"
                placeholder="e.g. 20"
                type="number"
                addClass="w-1/2"
                value={formData.quorum}
                onChange={(e) =>
                  handleChange('quorum', parseInt(e.target.value))
                }
                errorMsg={formError.quorum}
              />

              <FormInput
                name="Minimum tokens to create proposal"
                placeholder="e.g. 1"
                type="number"
                addClass="w-1/2"
                value={formData.minToVote}
                onChange={(e) =>
                  handleChange('minToVote', parseInt(e.target.value))
                }
                errorMsg={formError.minToVote}
              />

              <FormInput
                name="Vote Duration (in seconds)"
                placeholder="e.g. 21600"
                type="number"
                addClass="w-1/2"
                value={formData.voteDuration}
                onChange={(e) =>
                  handleChange('voteDuration', parseInt(e.target.value))
                }
                errorMsg={formError.voteDuration}
              />

              <FormMinHeading title="Council" />
              <select
                name="presets"
                className="bg-[#040216] text-sm py-2 px-2
                            border-2 border-[#2C2C5A] rounded-lg my-2"
                onChange={(e) =>
                  handleChange(
                    'council',
                    e.target.value === 'true' ? true : false
                  )
                }
                defaultValue={formData.council ? 'true' : 'false'}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          )}
        </FormComponent>

        <FormButton
          title={daoMutation.isPending ? 'Validating..' : 'Save & Continue'}
          onClick={handleForm}
          addClass="border-[1px] border-[#2C2C5A] bg-[#1E2043] py-3 px-8"
          disabled={daoMutation.isPending}
        />
      </div>
    </div>
  );
}
