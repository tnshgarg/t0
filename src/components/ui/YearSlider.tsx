import React from 'react';
import { useTimeEngine } from '../../context/TimeEngine';

export const YearSlider: React.FC = () => {
  const { currentYear, minYear, maxYear, setYear, isPlaying, togglePlayback } = useTimeEngine();

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto backdrop-blur-md bg-black/40 p-4 rounded-xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between w-full text-white/90">
        <button 
          onClick={togglePlayback}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-mono text-sm border border-white/5"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <span className="text-4xl font-bold tracking-tighter tabular-nums">{currentYear}</span>
        <div className="w-16"></div> {/* Spacer for symmetry */}
      </div>

      <input
        type="range"
        min={minYear}
        max={maxYear}
        step={1}
        value={currentYear}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)] outline-none"
      />
      
      <div className="flexjustify-between w-full text-xs text-white/40 font-mono tracking-widest uppercase">
          <span>{minYear}</span>
          <span>Timeline</span>
          <span>{maxYear}</span>
      </div>
    </div>
  );
};
