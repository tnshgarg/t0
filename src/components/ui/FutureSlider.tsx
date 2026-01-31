import React from 'react';
import { motion } from 'framer-motion';

interface FutureSliderProps {
  projectionYear: number;
  onYearChange: (year: number) => void;
  enabled: boolean;
  minYear?: number;
  maxYear?: number;
}

export const FutureSlider: React.FC<FutureSliderProps> = ({ 
  projectionYear, 
  onYearChange, 
  enabled,
  minYear = 2025,
  maxYear = 2050 
}) => {
  if (!enabled) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      className="mt-4 backdrop-blur-md bg-purple-900/20 rounded-xl border border-purple-500/30 p-3 shadow-xl"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-purple-400/70 font-mono">Future Projection</span>
        </div>
        <span className="text-sm font-bold text-purple-300 font-mono">{projectionYear}</span>
      </div>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        value={projectionYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
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
      <div className="flex justify-between text-[10px] text-purple-400/50 mt-1 font-mono">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </motion.div>
  );
};
