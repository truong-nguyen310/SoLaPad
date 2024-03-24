'use client';

import dynamic from 'next/dynamic';

import { WalletError } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { ReactNode, useCallback, useMemo } from 'react';
import {
  toWalletAdapterNetwork,
  useCluster,
} from '../cluster/cluster-data-access';
import { ellipsify } from '../ui/ui-layout';

require('@solana/wallet-adapter-react-ui/styles.css');

const WalletDynamicButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  const { publicKey } = useWallet();

  return (
    <WalletDynamicButton> 
      {publicKey ? 
        <span className='inline text-sm mt-1'>
          {ellipsify(publicKey.toBase58(), window.screen.width < 640 ? 1 : 4)}
        </span> 
      :
      <div className='relative top-[1px]'>
        <span className='sm:mr-2 relative top-[2px] md:top-0 ml-2 md:ml-0'>
         <svg className="inline align-[1px]" width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M9.57895 8.16667C10.1894 8.16667 10.6842 7.64433 10.6842 7C10.6842 6.35567 10.1894 5.83333 9.57895 5.83333C8.96853 5.83333 8.47368 6.35567 8.47368 7C8.47368 7.64433 8.96853 8.16667 9.57895 8.16667Z" fill="#9393A9"/>
           <path d="M13.2632 3.32889V1.55556C13.2632 0.7 12.6 0 11.7895 0H1.47368C0.655789 0 0 0.7 0 1.55556V12.4444C0 13.3 0.655789 14 1.47368 14H11.7895C12.6 14 13.2632 13.3 13.2632 12.4444V10.6711C13.6979 10.3989 14 9.90889 14 9.33333V4.66667C14 4.09111 13.6979 3.60111 13.2632 3.32889ZM12.5263 4.66667V9.33333H7.36842V4.66667H12.5263ZM1.47368 12.4444V1.55556H11.7895V3.11111H7.36842C6.55789 3.11111 5.89474 3.81111 5.89474 4.66667V9.33333C5.89474 10.1889 6.55789 10.8889 7.36842 10.8889H11.7895V12.4444H1.47368Z" fill="#9393A9"/>
         </svg>
         </span>
        <span className='hidden sm:inline-block relative md:top-[-2px] text-sm'>
         Connect Wallet
        </span>
      </div>
   }
   </WalletDynamicButton>
  )
}

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter({
        network: toWalletAdapterNetwork(cluster.network),
      }),
    ],
    [cluster]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
