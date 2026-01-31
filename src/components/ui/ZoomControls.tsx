import React from 'react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-20">
      <button 
        onClick={onZoomIn}
        className="w-10 h-10 bg-black/80 text-white border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-xl text-xl font-bold"
        aria-label="Zoom In"
      >
        +
      </button>
      <button 
        onClick={onZoomOut}
        className="w-10 h-10 bg-black/80 text-white border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-xl text-xl font-bold"
        aria-label="Zoom Out"
      >
        −
      </button>
    </div>
  );
};
