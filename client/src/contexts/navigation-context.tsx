import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface NavigationContextType {
  previousPath: string | null;
  setPreviousPath: (path: string) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const goBack = () => {
    if (previousPath) {
      navigate(previousPath);
    } else {
      // Fallback to a sensible default if no previous path
      navigate('/');
    }
  };

  return (
    <NavigationContext.Provider value={{ previousPath, setPreviousPath, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Hook to track navigation history
export function useNavigationTracker() {
  const [location] = useLocation();
  const { setPreviousPath } = useNavigation();
  
  useEffect(() => {
    // Store the current path as the previous path when it changes
    const timer = setTimeout(() => {
      setPreviousPath(location);
    }, 100); // Small delay to avoid setting current page as previous

    return () => clearTimeout(timer);
  }, [location, setPreviousPath]);
}