import { useLocation } from 'wouter';

// Simple navigation utilities without complex context
export function useNavigation() {
  const [, setLocation] = useLocation();
  
  const navigateWithHistory = (path: string) => {
    setLocation(path);
  };

  const navigateReplaceHistory = (path: string) => {
    // Replace current history entry instead of adding to it
    window.history.replaceState(null, '', path);
    setLocation(path);
  };

  const goBack = () => {
    // Use browser's history API for reliable back navigation
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/');
    }
  };

  const goBackToMain = (mainPath: string) => {
    // Navigate directly to main page, bypassing history
    setLocation(mainPath);
  };

  return {
    navigateWithHistory,
    navigateReplaceHistory,
    goBack,
    goBackToMain,
    previousPath: null // Simplified - no longer tracking complex history
  };
}

// Empty provider for compatibility
export function NavigationProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Empty hook for compatibility
export function useNavigationTracker() {
  // No longer needed
}