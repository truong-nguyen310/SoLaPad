import { IconUsersGroup, IconCoin, IconHome, IconMoodSmile, IconHeartHandshake, IconAffiliate } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
  
export const PresetBox = ({
    title,
    desc,
    price,
    type
  }: PresetBoxProps) => {
    const router = useRouter();

    const handleClick = () => {
      router.push(`/create/${type}`)
    }
  
      return (
          <div className="md:w-80 w-11/12 hover:cursor-pointer bg-gradient-to-b from-[#05051C] to-[#150A40] 
          border-2 border-[#2C2C5A] rounded-xl mt-2 relative m-auto" onClick={handleClick}>
            <div className="max-w-md mx-auto p-4 px-6 flex flex-col mb-6">
              <div className="absolute left-1/2 translate-x-[-50%] border border-secondary-text bg-[#D9D9D959] p-3 rounded-lg my-3 text-white origin-center rotate-45">{
                type === 1 ?
                <IconUsersGroup className="icon-fg" />
                : type === 2 ?
                <IconCoin className="icon-fg" />
                : type === 3 ?
                <IconHome className="icon-fg" />
                : type === 4 ?
                <IconMoodSmile className="icon-fg" />
                : type === 5 ?
                <IconHeartHandshake className="icon-fg" />
                :
                <IconAffiliate className="icon-fg" />
              }</div>
              <h4 className='text-lg font-semibold mb-3 mt-20 text-white'>{title}</h4>
              <div className="w-full">
              <hr className='border-[#2C2C5A] border-b-2'/>
              </div>
              <div className='specs my-3'>
                <ul className='list-disc list-outside text-secondary-text text-left ml-4 relative'>
                  {desc.map((item,index) => (
                      <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            
            </div>
            <div className="w-full bg-[#05051C] p-1 absolute bottom-0 rounded-b-xl">
                <div className='flex flex-row h-6 gap-2 items-center p-3 my-1'>
                  <div className='border-2 border-[#2C2C5A] rounded-full w-7 h-7'>
                    <Image src="/solanaSmall.png" alt="solana icon"  width={16} height={16} className="m-1 my-1.5"/>
                  </div>
                  <p>{price} SOL</p>
                </div>
              </div>
          </div>
      )
  }