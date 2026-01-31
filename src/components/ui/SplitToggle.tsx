import React from 'react';
import { motion } from 'framer-motion';
import { useSplitView } from '../../context/SplitViewContext';

export const SplitToggle: React.FC = () => {
  const { isSplitView, toggleSplitView } = useSplitView();

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={toggleSplitView}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
        backdrop-blur-md border shadow-xl
        ${isSplitView 
          ? 'bg-blue-500/30 border-blue-500/50 text-blue-300' 
          : 'bg-black/50 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {/* Split View Icon */}
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="3" x2="12" y2="21" />
      </svg>
      <span className="text-xs uppercase tracking-widest font-mono">
        {isSplitView ? 'Single View' : 'Split View'}
      </span>
    </motion.button>
  );
};
