import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { FormContext } from './create-feature';
import FormComponent, {
  FormAllocationTabs,
  FormButton,
  FormInput,
  FormMinHeading,
  FormTopHeading,
  DeleteButton,
} from './form-component';
import { useCreateMetadata } from './create-data-access';
import { useWallet } from '@solana/wallet-adapter-react';
// import toast from "react-hot-toast";
import { PublicKey } from '@solana/web3.js';
import { Chart } from 'chart.js/auto';
import { CSVToArray } from '../../app/utils/csv';
import { ellipsify } from '../ui/ui-layout';
import {
  addDecimals,
  removeDecimals,
  removeDecimalsNum,
  validateTokenString,
} from '@/app/utils/validation';
import allstarList from '@/app/utils/allstar/list';

export function FormLaunch({
  imgLink,
  tx,
  jsonLink,
  buttonText,
  setImgLink,
  setJsonLink,
  setTx,
  setButtonText,
  dbId,
  setDbId,
}: FormLaunchProps) {
  const { formData, setPage, imgFile } = useContext(
    FormContext
  ) as FormContextType;
  const { publicKey } = useWallet();

  const { symbol, supply, decimals } = formData;

  const [selectList, setSelectList] = useState(false);
  const [allocation, setAllocation] = useState(formData.allocation);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [teamWallet, setTeamWallet] = useState('');

  //Errors
  const [allocError, setAllocError] = useState('');
  const [csvError, setCsvError] = useState('');
  const [teamWalletError, setTeamWalletError] = useState('');

  const allocationTabs = useMemo(
    () => ['Team', 'Airdrop', 'DAO Allocation', 'All Stars List'],
    []
  );

  // update allocation fn
  const updateAllocation = (index: number, val: number) => {
    setAllocError('');
    const newAlloc = [...allocation];
    newAlloc[index] = val;
    setAllocation(newAlloc);
  };

  // Donut Chart Setup
  useEffect(() => {
    const chartDiv = document.querySelector('.canvas-div');
    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas-chart');

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: allocationTabs.map(
          (t, i) => [t, allocation[i]].join(' ') + '%'
        ),
        datasets: [
          {
            label: 'Token Distribution',
            data: allocation.slice(0, selectList ? 4 : 3),
            backgroundColor: ['#FF4906', '#19B400', '#F3BC51', '#00DDC2'],
            borderColor: '#040216',
            hoverOffset: 4,
            borderRadius: 6,
            spacing: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    const canvasParent = document.querySelector('.canvas-parent') as Element;
    const canvasChart = document.querySelector('.canvas-chart') as Element;

    if (document.contains(document.querySelector('.canvas-chart'))) {
      canvasChart.remove();
    }

    canvasParent.insertBefore(canvas, chartDiv);
  }, [allocation, allocationTabs]);

  // Mutation
  const mutation = useCreateMetadata({
    img: imgFile as File,
    address: publicKey as PublicKey,
    setButtonText,
    setImgLink,
    setJsonLink,
    setTx,
    setDbId,
    formData,
    isImg: imgLink,
    isJson: jsonLink,
    isTx: tx,
    isDbId: dbId,
  });

  // Create Token
  const handleCreateButton = () => {
    const adjustedSupply = addDecimals(supply, decimals);
    const checkedAllocation = allocation
      .slice(0, selectList ? 4 : 3)
      .map((n) => (isNaN(n) ? 0 : n));
    const allocationInTokens = checkedAllocation.map(
      (a) => (adjustedSupply * BigInt(a)) / BigInt(100)
    );
    allocationInTokens[2] =
      adjustedSupply -
      (adjustedSupply * BigInt(100 - allocation[2])) / BigInt(100);
    const sum = checkedAllocation.reduce((a, b) => a + b, 0);

    // Percentage check
    if (sum !== 100) {
      setAllocError('The sum of allocation must be equal to 100');
      return;
    }

    // Team Wallet address check
    if (allocationInTokens[0]) {
      if (!teamWallet) {
        setTeamWalletError(
          'The team allocation is not zero, provide the address'
        );
        return;
      } else {
        try {
          const teamAddress = new PublicKey(teamWallet);
        } catch {
          setTeamWalletError('Invalid Team Wallet, please check and re-submit');
          return;
        }
      }
    }

    // The total airdrop check
    const totalAirdrop: bigint = recipients.reduce(
      (a, b) => a + b.amount,
      BigInt(0)
    );
    const totalAirdropWhole = removeDecimalsNum(totalAirdrop, decimals);
    const airdropRatio = removeDecimalsNum(allocationInTokens[1], decimals);
    const lowerRange = airdropRatio - BigInt(50);
    const upperRange = airdropRatio + BigInt(50);

    if (totalAirdropWhole >= lowerRange && totalAirdropWhole <= upperRange) {
      allocationInTokens[1] = totalAirdrop;
    } else {
      console.log(
        removeDecimalsNum(totalAirdrop, decimals),
        removeDecimalsNum(allocationInTokens[1], decimals)
      );
      setCsvError(`The total tokens must match the airdrop allocation.
      The total airdrop tokens must be between ${lowerRange} and ${upperRange} tokens.
      `);
      return;
    }

    mutation.mutate({
      teamWallet: teamWallet ? new PublicKey(teamWallet) : null,
      allocation: allocationInTokens,
      recipients,
    });
  };

  //Add address button
  const handleAddAddress = () => {
    setCsvError('');

    try {
      const newAddress = new PublicKey(currentAddress);
      const newAmount = BigInt(validateTokenString(currentAmount, decimals));

      const currentRecipients = [...recipients];

      currentRecipients.push({
        pubkey: newAddress.toBase58(),
        amount: newAmount,
      });

      setRecipients(currentRecipients);
    } catch {}

    setCurrentAddress('');
    setCurrentAmount('');
  };

  // Delete Button function
  const deleteAddress = (index: number) => {
    const currentRecipients = [...recipients];
    currentRecipients.splice(index, 1);
    setRecipients(currentRecipients);
  };

  // Clear all function
  const clearAll = (index: number) => {
    setRecipients([]);
  };

  // Set Team Wallet function
  const handleTeamWallet = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamWalletError('');
    setTeamWallet(e.target.value);
  };

  // CSV Function
  const handleCsv = (e: ChangeEvent<HTMLInputElement>) => {
    setCsvError('');
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (event.target) {
          const fileContent = event.target.result as string;
          e.target.value = '';

          const participants = CSVToArray(fileContent);

          if (!participants[participants.length - 1][0]) {
            participants.pop();
          }

          const participantAddresses: Recipient[] = [];

          for (let i = 0; i < participants.length; i++) {
            try {
              const address = new PublicKey(participants[i][0]);
              const token = BigInt(
                validateTokenString(participants[i][1], decimals)
              );

              participantAddresses.push({
                pubkey: address.toBase58(),
                amount: token,
              });
            } catch (e) {
              setCsvError(
                'Failed to read the CSV file. Please check the format.'
              );
              return;
            }
          }

          const currentRecipients = [...recipients];
          const newRecipients = currentRecipients.concat(participantAddresses);
          setRecipients(newRecipients);
        }
      };
      reader.readAsText(file);
    } else {
      setCsvError('Failed to upload the CSV file. Try again.');
    }
  };
  const data = [
    {
      name: 'MadLads',
      img: 'https://prod-image-cdn.tensor.trade/images/90x90/freeze=false/https%3A%2F%2Fprod-tensor-creators-s3.s3.us-east-1.amazonaws.com%2Fimage-59c7bcf2-bcb3-4cd3-9301-68ee6a474926',
    },
    {
      name: 'SMB',
      img: 'https://prod-image-cdn.tensor.trade/images/90x90/freeze=false/https%3A%2F%2Fi.imgur.com%2FbMH6qNc.png',
    },
  ];
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="flex flex-col md:flex-row w-full mb-16">
      <div className="create-main w-full md:w-3/4 flex flex-col items-center gap-6 z-10 mt-8">
        <FormTopHeading title="Launch" />

        <FormComponent
          title="Airdrop Participants"
          addButton={true}
          meta=""
          handleFn={handleCsv}
        >
          <div className="grid grid-cols-5 gap-4 mb-2">
            <div className="col-span-2 row-span-2 row-end-2">
              <FormInput
                name="Wallet Address"
                placeholder="eg. krux...gvCH"
                type="string"
                addClass="w-full"
                onChange={(e) => setCurrentAddress(e.target.value)}
                value={currentAddress}
              />
            </div>
            <div className="col-span-2 row-span-2 row-end-2">
              <FormInput
                name="Token Amount"
                placeholder="eg. 450000"
                type="number"
                addClass="w-full"
                onChange={(e) => setCurrentAmount(e.target.value)}
                value={currentAmount}
              />
            </div>
            <FormButton
              title="Add Address"
              addClass="text-xs md:text-sm lg:px-auto text-sm py-[9px] border-[1px] 
                            border-[#2C2C5A] bg-[#1E2043] hover:bg-gradient-to-b from-golden-200 to-golden-100 text-secondary-text 
                            row-end-2 mb-2 col-span-1 whitespace-nowrap hover:text-white"
              onClick={handleAddAddress}
            />
          </div>
          {recipients.slice(0, 10).map((receiver, index) => (
            <div
              className="flex flex-col lg:flex-row justify-between items-center mb-2"
              key={index}
            >
              <div className="ml-2 text-sm">
                {index + 1}. {ellipsify(receiver.pubkey, 14)} -&nbsp;
                {removeDecimals(receiver.amount, decimals)} {symbol}
              </div>
              <DeleteButton fn={deleteAddress} title="Delete" index={index} />
            </div>
          ))}

          <div>
            {data.map((d) => (
              <tr
                key={d.name}
                role="row"
                className="css-5omoak"
                style={{
                  display: 'flex',
                  flex: '1 0 auto',
                  minWidth: '0px',
                  justifyContent: 'center',
                }}
              >
                <td
                  role="cell"
                  className="css-166cnml"
                  style={{
                    boxSizing: 'border-box',
                    flex: '14 0 auto',
                    minWidth: '0px',
                    width: '14px',
                  }}
                >
                  <div className="css-0">
                    <div
                      className="chakra-stack css-rmxdag"
                      onClick={() => {
                        console.log(d.name);
                        setSelected([...selected, d.name]);
                      }}
                    >
                      <svg
                        stroke={
                          selected?.includes(d.name) ? '#FF4906' : '#2C2C5A'
                        }
                        fill={
                          selected?.includes(d.name) ? '#FF4906' : '#2C2C5A'
                        }
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        focusable="false"
                        className="chakra-icon css-1qrl9ac"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                      </svg>
                    </div>
                  </div>
                </td>
                <td
                  role="cell"
                  className="css-166cnml"
                  style={{
                    boxSizing: 'border-box',
                    flex: '12 0 auto',
                    minWidth: '0px',
                    width: '12px',
                  }}
                >
                  <p
                    className="chakra-text css-12p10ll text-white"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {d.name}
                  </p>
                </td>
                <td
                  role="cell"
                  className="css-110sj1t"
                  style={{
                    boxSizing: 'border-box',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    alt="Frogana"
                    src={d.img}
                    className="chakra-image css-b40uhl"
                  />
                </td>
                {/* Additional cells and content go here */}
              </tr>
            ))}
          </div>
          {recipients.length > 10 ? (
            <div className="text-sm flex flex-row justify-between items-center">
              <div className="">
                {' '}
                + more {recipients.length - 10} participants
              </div>
              <DeleteButton
                fn={clearAll}
                title="Clear All"
                index={0}
                addClass="border-golden-100"
              />
            </div>
          ) : (
            ''
          )}
          <p className="text-[#cc3300] text-sm mt-2 font-normal ml-4">
            {csvError}
          </p>
        </FormComponent>

        <FormComponent
          title="Team Allocation"
          meta="Enter the address where you want to receive the team allocation"
        >
          <FormInput
            name=""
            placeholder="Enter the team wallet here.."
            type="string"
            addClass="w-full mt-2"
            onChange={handleTeamWallet}
            value={teamWallet}
          />
          <p className="text-[#cc3300] text-sm mt-2 font-normal ml-4">
            {teamWalletError}
          </p>
        </FormComponent>

        <FormComponent
          title="Curated List"
          meta="Choose premium lists of Solana users to participate in your coin"
        >
          <div
            className={`w-full md:w-1/2 border-[1px] ${
              selectList ? 'border-golden-100' : 'border-border-form'
            } rounded-md py-2 
                        px-4 cursor-pointer bg-gradient-to-b from-[#05051C] to-[#150A40] mt-4`}
            onClick={() => setSelectList(!selectList)}
          >
            <div className="flex flex-row justify-between items-center">
              <FormMinHeading title="All Stars List" />
              <button
                className={`${
                  selectList
                    ? 'bg-gradient-to-b from-golden-100 to-golden-200'
                    : 'bg-[#cccccc]'
                }
                            rounded-sm w-6 h-6 mr-2 mt-1 `}
              ></button>
            </div>
            <hr className="border-[#2C2C5A] border-b-[1px] my-3" />
            <ul className="list-disc list-outside text-secondary-text text-left ml-4 mb-4 relative text-sm">
              <li key={1}>Wallets that are subscribed to SoLaPad</li>
              <li key={2}>Recent transactions in the last month</li>
            </ul>
          </div>
          <p className="text-sm mt-4 font-normal ml-2">
            {selectList
              ? `${allstarList.length} allstars added to the airdrop list. Allocate tokens to the Allstar list using the form below.`
              : ''}
          </p>
        </FormComponent>

        <FormComponent
          title="Distribution Amounts"
          meta="Select who and how much people recieve"
        >
          <div className="canvas-parent w-full md:w-1/2 m-auto">
            <div className="canvas-div"></div>
          </div>
          <hr className="border-[#2C2C5A] border-b-[1px] my-3" />
          <div className="flex flex-col items-center my-5 gap-4">
            {allocationTabs.slice(0, selectList ? 4 : 3).map((tab, tabIx) => (
              <FormAllocationTabs
                total={supply}
                tabName={tab}
                tabIx={tabIx}
                tabVal={allocation[tabIx]}
                changeTabVal={updateAllocation}
                key={tabIx}
              />
            ))}
          </div>
          <p className="text-[#cc3300] text-sm mt-2 font-normal ml-4">
            {allocError}
          </p>
        </FormComponent>

        <div className="mb-16 flex flex-row items-start gap-1 text-[#9393A9]">
          <FormButton
            title={buttonText}
            onClick={handleCreateButton}
            disabled={mutation.isPending}
            addClass="bg-gradient-to-b from-golden-200 to-golden-100 text-white px-8 py-3"
          />
          <FormButton
            title="Back"
            onClick={() => setPage(1)}
            addClass="px-8 py-3"
          />
        </div>
      </div>
    </div>
  );
}
