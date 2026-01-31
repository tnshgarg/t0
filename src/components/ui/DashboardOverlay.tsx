import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, AlertTriangle, Leaf, Wind, Globe } from 'lucide-react';

interface DashboardOverlayProps {
  year: number;
  onClose: () => void;
  city?: string | null;
}

// Mock Country Data
const COUNTRY_STATS = [
  { name: 'USA', co2: 4.8, co2Trend: -0.5, temp: +1.2, forest: 33 },
  { name: 'China', co2: 10.1, co2Trend: +1.2, temp: +1.4, forest: 22 },
  { name: 'India', co2: 2.6, co2Trend: +2.5, temp: +1.5, forest: 24 },
  { name: 'Brazil', co2: 1.2, co2Trend: +0.2, temp: +1.1, forest: 58 },
  { name: 'Russia', co2: 1.8, co2Trend: -0.1, temp: +1.8, forest: 49 },
  { name: 'Nigeria', co2: 0.8, co2Trend: +3.0, temp: +1.3, forest: 8 },
  { name: 'Germany', co2: 0.7, co2Trend: -1.2, temp: +1.5, forest: 32 },
  { name: 'Japan', co2: 1.1, co2Trend: -0.8, temp: +1.2, forest: 67 },
];

export const DashboardOverlay: React.FC<DashboardOverlayProps> = ({ year, onClose, city }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'countries'>('overview');
  
  // Mock Data Generators
  const co2Level = 415 + (year - 2024) * 2.5;
  const tempRise = 1.1 + (year - 2024) * 0.05 + (city ? 0.5 : 0); 
  const forestCover = 31 - (year - 2024) * 0.2;
  
  // Recommendation Logic
  const recommendations = useMemo(() => {
    if (city) return [
        `Implement localized heat-action plans for ${city}'s dense districts.`,
        `Expand green corridors in ${city} to combat Urban Heat Island effect.`,
        `Upgrade ${city}'s storm drainage for predicted 15% increase in rainfall.`
    ];
    if (year < 2028) return [
      "Implement aggressive carbon pricing to curb industrial emissions.",
      "Subsidize EV infrastructure to accelerate transition.",
      "Protect critical rainforest regions in Amazon and Congo."
    ];
    return [
      "Deploy large-scale Direct Air Capture (DAC) plants.",
      "Mandate green roofing coverage in all urban centers.",
      "Transition 80% of grid to renewables (Solar/Wind/Nuclear)."
    ];
  }, [year, city]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-black/40">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0A0A0A] border border-white/10 w-full h-full max-w-7xl rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5 relative z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
              <Globe className="text-blue-500" />
              {city ? `${city} Operations Center` : "Planetary Command"}
            </h1>
            
            {/* Tabs */}
            <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('countries')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'countries' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
              >
                Country Data
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
               <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Simulated Year</p>
               <p className="text-blue-400 font-mono text-xl font-bold">{year}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence mode='wait'>
            {activeTab === 'overview' ? (
              <OverviewTab 
                key="overview" 
                year={year} 
                co2={co2Level} 
                temp={tempRise} 
                forest={forestCover} 
                recommendations={recommendations}
              />
            ) : (
              <CountriesTab key="countries" year={year} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub Components ---

const OverviewTab = ({ year, co2, temp, forest, recommendations }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: 10 }}
    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
  >
    {/* Left Col: Stats */}
    <div className="lg:col-span-4 space-y-4">
       <div className="grid grid-cols-1 gap-4">
          <MetricCard 
              label="CO2 PPM" 
              value={co2.toFixed(1)} 
              unit="ppm"
              trend="+2.1%" 
              color="text-red-400"
              borderColor="border-red-500/20"
              icon={<Wind size={18} />}
          />
          <MetricCard 
              label="Global Temp" 
              value={`+${temp.toFixed(2)}`} 
              unit="°C"
              trend="+0.05°C/yr" 
              color="text-orange-400"
              borderColor="border-orange-500/20"
              icon={<TrendingUp size={18} />}
          />
          <MetricCard 
              label="Forest Cover" 
              value={forest.toFixed(1)} 
              unit="%"
              trend="-0.2%" 
              color="text-green-400"
              borderColor="border-green-500/20"
              icon={<Leaf size={18} />}
          />
       </div>

       {/* Recommendations */}
       <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mt-4">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-400" />
            AI Strategy Protocol
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec: string, i: number) => (
              <div key={i} className="flex gap-3 text-sm text-white/80 p-3 bg-black/40 rounded-lg border border-white/5">
                <span className="text-blue-500 font-mono font-bold flex-shrink-0">0{i+1}</span>
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
       </div>
    </div>

    {/* Right Col: Charts */}
    <div className="lg:col-span-8">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Projected Emissions Trajectory</h2>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Multi-Model Ensemble Mean</p>
        </div>
        <div className="flex-1 min-h-[300px] w-full relative">
           {/* Custom SVG Chart */}
           <LineChart year={year} />
        </div>
      </div>
    </div>
  </motion.div>
);

const CountriesTab = ({ year }: { year: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: 10 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -10 }}
    className="h-full flex flex-col"
  >
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex-1 flex flex-col">
      <div className="p-4 border-b border-white/10 bg-black/20 grid grid-cols-12 text-xs font-bold text-white/40 uppercase tracking-widest">
        <div className="col-span-3 pl-2">Country</div>
        <div className="col-span-3 text-right">CO2 Emissions (Gt)</div>
        <div className="col-span-3 text-right">Temp Rise (°C)</div>
        <div className="col-span-3 text-right">Forest Coverage</div>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {COUNTRY_STATS.map((country) => {
           // Dynamic values based on year
           const offset = year - 2024;
           const co2 = (country.co2 * (1 + offset * (country.co2Trend * 0.05))).toFixed(1);
           const temp = (country.temp + offset * 0.04).toFixed(2);
           const forest = Math.max(0, country.forest - offset * 0.2).toFixed(1);

           return (
            <div key={country.name} className="grid grid-cols-12 items-center p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="col-span-3 flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs ring-1 ring-blue-500/30">
                  {country.name.substring(0,2).toUpperCase()}
                </div>
                <span className="font-medium text-white group-hover:text-blue-300 transition-colors">{country.name}</span>
              </div>
              <div className="col-span-3 text-right font-mono text-white/80">{co2}</div>
              <div className="col-span-3 text-right font-mono text-orange-300">+{temp}°</div>
              <div className="col-span-3 text-right pr-2 font-mono text-green-400">{forest}%</div>
            </div>
           );
        })}
      </div>
    </div>
  </motion.div>
);

// --- Charts ---

const LineChart = ({ year }: { year: number }) => {
   // Generate fake curve data
   // X = year, Y = Value (normalized 0-100)
   const dataPoints = Array.from({ length: 20 }, (_, i) => {
      const y = 2012 + i * 2; // 2012 to 2050
      const isActive = y <= year;
      // Exponential curve
      const val = 30 + Math.pow(i, 1.5) * 2; 
      return { x: i * (100/19), y: 100 - Math.min(100, val), year: y, isActive };
   });

   const pointsString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

   return (
     <div className="w-full h-full relative">
       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" strokeDasharray="5,5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" strokeDasharray="5,5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="white" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" strokeDasharray="5,5" />

          {/* Warning Zone background */}
          <path d="M 0 50 L 100 50 L 100 0 L 0 0 Z" fill="url(#dangerGradient)" opacity="0.2" />

          {/* The Line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path 
            d={`M 0 100 L ${pointsString} L 100 100 Z`} 
            fill="url(#lineGradient)" 
            fillOpacity="0.1" 
          />
          <path 
             d={`M ${pointsString}`} 
             fill="none" 
             stroke="url(#lineGradient)" 
             strokeWidth="3" 
             vectorEffect="non-scaling-stroke"
             strokeLinecap="round"
          />
          
          {/* Current Year Marker */}
          {dataPoints.map((p, i) => (
             p.isActive && (year >= p.year || (year < p.year && year > (dataPoints[i-1]?.year || 0))) &&
             <circle 
               key={i} 
               cx={p.x} 
               cy={p.y} 
               r="1.5"
               fill="white"
               stroke="rgba(0,0,0,0.5)"
               strokeWidth="0.5"
               vectorEffect="non-scaling-stroke"
             />
          ))}
       </svg>
       
       {/* Labels */}
       <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between text-[10px] text-white/40 font-mono">
          <span>2012</span>
          <span>2030</span>
          <span>2050</span>
       </div>
       <div className="absolute left-[-30px] top-0 bottom-0 flex flex-col justify-between text-[10px] text-white/40 font-mono py-2">
          <span>HIGH</span>
          <span>MED</span>
          <span>LOW</span>
       </div>
     </div>
   )
}

const MetricCard = ({ label, value, unit, trend, color, borderColor, icon }: any) => (
  <div className={`bg-white/5 p-5 rounded-2xl border ${borderColor || 'border-white/10'} hover:bg-white/10 transition-colors group`}>
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 rounded-lg bg-black/30 text-white/80 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/30 ${color}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-white/40 text-[10px] uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <span className="text-white/40 text-sm font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

