import React from 'react';
import { motion } from 'framer-motion';

interface LayerConfig {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

interface LayerPanelProps {
  layers: LayerConfig[];
  onToggle: (layerId: string) => void;
  maxLayers?: number;
  children?: React.ReactNode;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ layers, onToggle, maxLayers = 3, children }) => {
  const activeCount = layers.filter(l => l.enabled).length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute right-6 top-24 z-20"
    >
      <div className="backdrop-blur-md bg-black/50 rounded-xl border border-white/10 p-3 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-widest text-white/50 font-mono">Layers</h3>
          <span className="text-xs text-white/30">{activeCount}/{maxLayers}</span>
        </div>
        <div className="flex flex-col gap-2">
          {layers.map((layer) => {
            const isDisabled = !layer.enabled && activeCount >= maxLayers;
            return (
              <button
                key={layer.id}
                onClick={() => !isDisabled && onToggle(layer.id)}
                disabled={isDisabled}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isDisabled 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'hover:bg-white/10'
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full transition-all ${
                    layer.enabled ? 'scale-100' : 'scale-75 opacity-50'
                  }`}
                  style={{ backgroundColor: layer.color }}
                />
                <span className={`${layer.enabled ? 'text-white' : 'text-white/50'}`}>
                  {layer.name}
                </span>
                <div className={`ml-auto w-8 h-4 rounded-full transition-colors ${
                  layer.enabled ? 'bg-blue-500' : 'bg-white/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform mt-0.5 ${
                    layer.enabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
        {/* Additional controls (e.g., FutureSlider) */}
        {children}
      </div>
    </motion.div>
  );
};

