import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  kdsSoundEnabled: boolean;
  setKdsSoundEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kdsSoundEnabled, setKdsSoundEnabled] = useState<boolean>(true);

  return (
    <ThemeContext.Provider value={{ kdsSoundEnabled, setKdsSoundEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
