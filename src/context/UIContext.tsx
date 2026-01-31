import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isDashboardOpen: boolean;
  setDashboardOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDashboardOpen, setDashboardOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isDashboardOpen, setDashboardOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
