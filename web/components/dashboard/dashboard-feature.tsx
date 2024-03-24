'use client';

import Image from 'next/image';
import { PresetBox } from './preset-ui';
import { presets } from './presets';

export default function DashboardFeature() {
  return (
    <div className="">
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <div className="md:hero-content flex flex-col presets-div">
            <div className="mt-4 flex flex-row gap-4 items-center justify-center">
              <p className="flex flex-col items-center">
                <Image src="/logo.png" alt="icon" width={48} height={48} />
              </p>
              <h1 className="text-center text-4xl text-white font-bold">
                SoLaPad
              </h1>
            </div>
            <p className="text-center text-seconday-text mt-2 md:mt-0 mb-8 md:mb-4 text-white">
              The Launchpad Suite for Solana
            </p>
            <p className="text-center font-semibold mb-2 md:mb-0 text-white">
              Select a preset to continue
            </p>
            <div className="grid grid-rows-6 md:grid-rows-3 lg:grid-rows-2 grid-flow-col md:gap-8 gap-4 mb-16">
              {presets.slice(0, 6).map((preset, index) => (
                <PresetBox
                  key={index}
                  title={preset.title}
                  desc={preset.details}
                  price={preset.price}
                  type={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
