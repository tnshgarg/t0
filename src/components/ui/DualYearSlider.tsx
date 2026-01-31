import React from 'react';
import { motion } from 'framer-motion';
import { useSplitView } from '../../context/SplitViewContext';

export const DualYearSlider: React.FC = () => {
  const { leftYear, rightYear, setLeftYear, setRightYear, minYear, maxYear } = useSplitView();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
      <div className="flex gap-8 items-center justify-center">
        {/* Left Globe Year Control */}
        <div className="flex-1 backdrop-blur-md bg-black/50 rounded-xl border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-blue-400/70 font-mono">Left View</span>
            <span className="text-lg font-bold text-white font-mono">{leftYear}</span>
          </div>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={leftYear}
            onChange={(e) => setLeftYear(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-blue-400
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-blue-500/50
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-125"
          />
        </div>

        {/* Divider */}
        <div className="text-white/30 text-xl font-light">vs</div>

        {/* Right Globe Year Control */}
        <div className="flex-1 backdrop-blur-md bg-black/50 rounded-xl border border-white/10 p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-purple-400/70 font-mono">Right View</span>
            <span className="text-lg font-bold text-white font-mono">{rightYear}</span>
          </div>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={rightYear}
            onChange={(e) => setRightYear(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-purple-400
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-purple-500/50
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:transition-transform
                       [&::-webkit-slider-thumb]:hover:scale-125"
          />
        </div>
      </div>
    </motion.div>
  );
};
