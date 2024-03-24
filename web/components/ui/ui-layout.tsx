'use client';

import { WalletButton } from '../solana/solana-provider';
import { SocialLinks } from '../socials/social-link';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

import Link from 'next/link';

import { ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export function UiLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const pages = [
    { label: 'Create Token', path: '/create/7' },

    { label: 'Learn', path: '/documentation' },

    { label: 'About', path: '/about' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="navbar bg-back-100 border-b border-border-main text-secondary-text flex-col md:flex-row space-y-2 md:space-y-0">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl md:ml-8" href="/">
            <Image alt="Solana Logo" src="/logo.png" width={28} height={28} />
            <h1 className="text-2xl font-bold text-white">SoLaPad</h1>
          </Link>
          <ul className="hidden md:menu md:menu-horizontal px-1 space-x-2">
            {pages.map(({ label, path }) => (
              <li key={path}>
                <Link className={`text-base`} href={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <label
          htmlFor="my-drawer"
          className="btn-gh items-center justify-between md:hidden"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <div className="HAMBURGER-ICON space-y-2.5 ml-5">
            <div
              className={`h-0.5 w-8 bg-white ${isNavOpen ? 'hidden' : ''}`}
            />
            <div
              className={`h-0.5 w-8 bg-white ${isNavOpen ? 'hidden' : ''}`}
            />
            <div
              className={`h-0.5 w-8 bg-white ${isNavOpen ? 'hidden' : ''}`}
            />
          </div>
          <div
            className={`absolute block h-0.5 w-8 animate-pulse bg-white ${
              isNavOpen ? '' : 'hidden'
            }`}
            style={{ transform: 'rotate(45deg)' }}
          ></div>
          <div
            className={`absolute block h-0.5 w-8 animate-pulse bg-white ${
              isNavOpen ? '' : 'hidden'
            }`}
            style={{ transform: 'rotate(135deg)' }}
          ></div>
        </label>
        {isNavOpen && (
          <ul className="absolute flex flex-col z-20 gap-4 top-14 p-2 shadow bg-back-300 rounded-box w-5/6">
            {pages.map(({ label, path }) => (
              <li key={path}>
                <Link className={`text-[16px] `} href={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="flex-none space-x-4 mr-2">
          <SocialLinks show={false} />
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>
      <div
        className="
        bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#712E4B] via-transparent to-transparent 
        bg-[length:960px_520px] bg-no-repeat"
      >
        <div className="bg-[url('/background.png')] bg-no-repeat ">
          <Suspense
            fallback={
              <div className="text-center my-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster position="bottom-right" />
        </div>
      </div>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>,
      { duration: 5000 }
    );
  };
}
