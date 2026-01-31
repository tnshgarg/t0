import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SplitViewState {
  isSplitView: boolean;
  toggleSplitView: () => void;
  leftYear: number;
  rightYear: number;
  setLeftYear: (year: number) => void;
  setRightYear: (year: number) => void;
  minYear: number;
  maxYear: number;
}

const SplitViewContext = createContext<SplitViewState | undefined>(undefined);

interface SplitViewProviderProps {
  children: ReactNode;
  minYear?: number;
  maxYear?: number;
}

export const SplitViewProvider: React.FC<SplitViewProviderProps> = ({ 
  children, 
  minYear = 2012, 
  maxYear = 2024 
}) => {
  const [isSplitView, setIsSplitView] = useState(false);
  const [leftYear, setLeftYearState] = useState(minYear);
  const [rightYear, setRightYearState] = useState(maxYear);

  const toggleSplitView = () => setIsSplitView(prev => !prev);

  const setLeftYear = (year: number) => {
    const clamped = Math.max(minYear, Math.min(maxYear, year));
    setLeftYearState(clamped);
  };

  const setRightYear = (year: number) => {
    const clamped = Math.max(minYear, Math.min(maxYear, year));
    setRightYearState(clamped);
  };

  return (
    <SplitViewContext.Provider value={{ 
      isSplitView, 
      toggleSplitView, 
      leftYear, 
      rightYear, 
      setLeftYear, 
      setRightYear,
      minYear,
      maxYear
    }}>
      {children}
    </SplitViewContext.Provider>
  );
};

export const useSplitView = () => {
  const context = useContext(SplitViewContext);
  if (!context) {
    throw new Error('useSplitView must be used within a SplitViewProvider');
  }
  return context;
};
