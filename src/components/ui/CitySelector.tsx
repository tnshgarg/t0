import React from 'react';
import { motion } from 'framer-motion';

// Major cities for flyTo destinations
export const CITIES = [
  { name: 'New York', lat: 40.7, lng: -74.0, zoom: 4 },
  { name: 'London', lat: 51.5, lng: -0.1, zoom: 4 },
  { name: 'Tokyo', lat: 35.7, lng: 139.7, zoom: 4 },
  { name: 'Mumbai', lat: 19.1, lng: 72.9, zoom: 4 },
  { name: 'Shanghai', lat: 31.2, lng: 121.5, zoom: 4 },
  { name: 'São Paulo', lat: -23.5, lng: -46.6, zoom: 4 },
  { name: 'Lagos', lat: 6.5, lng: 3.4, zoom: 4 },
  { name: 'Cairo', lat: 30.0, lng: 31.2, zoom: 4 },
  { name: 'Sydney', lat: -33.9, lng: 151.2, zoom: 4 },
  { name: 'Moscow', lat: 55.8, lng: 37.6, zoom: 4 },
];

interface CitySelectorProps {
  onCitySelect: (city: typeof CITIES[0]) => void;
  selectedCity: string | null;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelect, selectedCity }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-6 top-32 z-20"
    >
      <div className="backdrop-blur-md bg-black/50 rounded-xl border border-white/10 p-3 shadow-2xl">
        <h3 className="text-xs uppercase tracking-widest text-white/50 mb-3 font-mono">Fly To City</h3>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => onCitySelect(city)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                selectedCity === city.name
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
