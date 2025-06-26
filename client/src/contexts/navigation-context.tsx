import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

interface NavigationContextType {
  previousPath: string | null;
  navigateWithHistory: (path: string) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const currentLocationRef = useRef<string>(location);

  // Track location changes and build history
  useEffect(() => {
    if (location !== currentLocationRef.current) {
      setNavigationHistory(prev => {
        // Don't add duplicate consecutive entries
        if (prev.length === 0 || prev[prev.length - 1] !== currentLocationRef.current) {
          return [...prev, currentLocationRef.current].slice(-10); // Keep last 10 entries
        }
        return prev;
      });
      currentLocationRef.current = location;
    }
  }, [location]);

  const navigateWithHistory = (path: string) => {
    navigate(path);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previousPath = navigationHistory[navigationHistory.length - 1];
      // Remove the last entry from history to avoid circular navigation
      setNavigationHistory(prev => prev.slice(0, -1));
      navigate(previousPath);
    } else {
      // Fallback to dashboard if no history
      navigate('/');
    }
  };

  const previousPath = navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1] : null;

  return (
    <NavigationContext.Provider value={{ previousPath, navigateWithHistory, goBack }}>
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

// Hook to automatically track navigation (no longer needed but kept for compatibility)
export function useNavigationTracker() {
  // This hook is now empty as navigation tracking is handled automatically in the provider
}