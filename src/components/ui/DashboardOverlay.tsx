import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, AlertTriangle, Leaf, Wind } from 'lucide-react';

interface DashboardOverlayProps {
  year: number;
  onClose: () => void;
}

export const DashboardOverlay: React.FC<DashboardOverlayProps> = ({ year, onClose }) => {
  // Mock Data Generators based on Year
  const co2Level = 415 + (year - 2024) * 2.5;
  const tempRise = 1.1 + (year - 2024) * 0.05;
  const forestCover = 31 - (year - 2024) * 0.2;
  
  // AI Recommendations
  const getRecommendations = (y: number) => {
    if (y < 2028) return [
      "Implement aggressive carbon pricing to curb industrial emissions.",
      "Subsidize EV infrastructure to accelerate transition.",
      "Protect critical rainforest regions in Amazon and Congo."
    ];
    if (y < 2035) return [
      "Deploy large-scale Direct Air Capture (DAC) plants.",
      "Mandate green roofing coverage in all urban centers >5M pop.",
      "Transition 80% of grid to renewables (Solar/Wind/Nuclear)."
    ];
    return [
      "Initiate stratospheric aerosol injection (Solar Geoengineering).",
      "Construct sea-walls for coastal cities (Mumbai, NYC, Tokyo).",
      "Emergency reforestation of arid zones using GMO drought-resistant saplings."
    ];
  };

  const recommendations = getRecommendations(year);

  // Mock Graph Data (History + Projection)
  const graphHistory = Array.from({ length: 12 }, (_, i) => {
    const y = year - 10 + i;
    return 40 + (y - 2012) * 2 + Math.random() * 5; // Fake trend
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 backdrop-blur-md bg-black/60">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-black/90 border border-white/20 w-full h-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/10 bg-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-blue-500" />
              Planetary Insights Dashboard
            </h1>
            <p className="text-white/50 mt-1 font-mono">SIMULATION YEAR: {year}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Key Metrics */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white/80 uppercase tracking-widest text-sm mb-4">Vital Statistics</h2>
            
            <MetricCard 
              label="Global CO2 Levels" 
              value={`${co2Level.toFixed(1)} ppm`} 
              trend="+2.1%" 
              color="text-red-400"
              icon={<Wind size={20} />}
            />
            <MetricCard 
              label="Avg Temp Anomaly" 
              value={`+${tempRise.toFixed(2)}°C`} 
              trend="+0.05°C/yr" 
              color="text-orange-400"
              icon={<TrendingUp size={20} />}
            />
            <MetricCard 
              label="Global Forest Cover" 
              value={`${forestCover.toFixed(1)}%`} 
              trend="-0.2%" 
              color="text-green-400"
              icon={<Leaf size={20} />}
            />

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-8">
              <h3 className="text-white font-bold mb-4">Emissions Trend</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {graphHistory.map((val, i) => (
                  <div key={i} className="w-full bg-blue-500/20 rounded-t overflow-hidden relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="bg-blue-500 w-full absolute bottom-0 left-0 right-0 group-hover:bg-blue-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-white/30 mt-2 font-mono">
                <span>{year - 10}</span>
                <span>{year}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Regional Analysis (Mock Map/Graph) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" size={24} />
                AI Generated Recommendations
              </h2>
              
              <div className="space-y-4 flex-1">
                {recommendations.map((rec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 font-bold font-mono">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-lg leading-snug">
                        {rec}
                      </h3>
                      <p className="text-white/40 text-sm mt-1">
                        Projected Impact: <span className="text-green-400">High Reduction</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-white/60 text-sm uppercase tracking-widest mb-4">Projected Temperature Heatmap</h3>
                <div className="h-4 rounded-full w-full bg-gradient-to-r from-yellow-200 via-orange-500 to-red-600 relative">
                   <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]" 
                    style={{ left: `${Math.min(100, (tempRise / 3) * 100)}%` }}
                   />
                </div>
                <div className="flex justify-between text-xs text-white/30 mt-2 font-mono">
                  <span>Safe (+0.5°C)</span>
                  <span>Critical (+1.5°C)</span>
                  <span>Catastrophic (+3.0°C)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ label, value, trend, color, icon }: any) => (
  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
    <div>
      <p className="text-white/50 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
    <div className="text-right">
      <div className={`p-3 rounded-xl bg-white/5 ${color} mb-1 inline-flex`}>
        {icon}
      </div>
      <p className={`text-xs font-bold ${trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
        {trend}
      </p>
    </div>
  </div>
);
