import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface TimeEngineState {
  currentYear: number;
  isPlaying: boolean;
  minYear: number;
  maxYear: number;
  setYear: (year: number) => void;
  togglePlayback: () => void;
}

const TimeContext = createContext<TimeEngineState | undefined>(undefined);

interface TimeEngineProviderProps {
  children: ReactNode;
  minYear?: number;
  maxYear?: number;
}

export const TimeEngineProvider: React.FC<TimeEngineProviderProps> = ({ 
  children, 
  minYear = 2012, 
  maxYear = 2024 
}) => {
  const [currentYear, setCurrentYear] = useState(minYear);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= maxYear) return minYear;
          return prev + 1;
        });
      }, 1000); // 1 second per year for now
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxYear, minYear]);

  const setYear = (year: number) => {
    const clamped = Math.max(minYear, Math.min(maxYear, year));
    setCurrentYear(clamped);
  };

  const togglePlayback = () => setIsPlaying(!isPlaying);

  return (
    <TimeContext.Provider value={{ currentYear, isPlaying, minYear, maxYear, setYear, togglePlayback }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTimeEngine = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTimeEngine must be used within a TimeEngineProvider');
  }
  return context;
};
