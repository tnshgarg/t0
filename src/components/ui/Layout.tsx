import React from 'react';
import { YearSlider } from './YearSlider';
import { SplitToggle } from './SplitToggle';
import { DualYearSlider } from './DualYearSlider';
import { useSplitView } from '../../context/SplitViewContext';
import { useUI } from '../../context/UIContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSplitView } = useSplitView();
  const { isDashboardOpen, setDashboardOpen } = useUI();

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
        <header className="pointer-events-auto flex items-start justify-between w-full">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tighter opacity-80">SATELLITE'S DIARY</h1>
            <p className="text-white/50 text-xs tracking-widest uppercase">Explore the Earth from 2012-2024</p>
          </div>
          <div className="flex gap-4 pointer-events-auto">
            <button
              onClick={() => setDashboardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full font-bold border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              DASHBOARD
            </button>
            <SplitToggle />
          </div>
        </header>
        
        <main className="flex-1 pointer-events-none">
            {/* Center controls or info can go here */}
        </main>

        <footer className={`w-full flex justify-center pb-8 transition-opacity duration-500 ${isDashboardOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} pointer-events-none`}>
           <div className="pointer-events-auto">
              {isSplitView ? <DualYearSlider /> : <YearSlider />}
           </div>
        </footer>
      </div>
    </div>
  );
};
