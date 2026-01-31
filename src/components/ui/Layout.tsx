import React from 'react';
import { YearSlider } from './YearSlider';
import { SplitToggle } from './SplitToggle';
import { DualYearSlider } from './DualYearSlider';
import { useSplitView } from '../../context/SplitViewContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSplitView } = useSplitView();

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
        <header className="pointer-events-auto flex items-start justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tighter opacity-80">SATELLITE'S DIARY</h1>
            <p className="text-white/50 text-xs tracking-widest uppercase">Antigravity Engine v1.0</p>
          </div>
          <SplitToggle />
        </header>
        
        <main className="flex-1 pointer-events-none">
            {/* Center controls or info can go here */}
        </main>

        <footer className="pointer-events-auto w-full flex justify-center pb-8">
          {isSplitView ? <DualYearSlider /> : <YearSlider />}
        </footer>
      </div>
    </div>
  );
};
