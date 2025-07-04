import { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
  columnWidth?: number;
  gutter?: number;
  fitWidth?: boolean;
}

export function MasonryGrid({ 
  children, 
  className = ''
}: MasonryGridProps) {
  return (
    <div 
      className={`columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

// Wrapper component for individual masonry items
export function MasonryItem({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`break-inside-avoid mb-6 ${className}`}>
      {children}
    </div>
  );
}