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
  className = '', 
  columnWidth = 300, 
  gutter = 24 
}: MasonryGridProps) {
  return (
    <div 
      className={`columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-${gutter/4} space-y-${gutter/4} ${className}`}
      style={{ 
        columnGap: `${gutter}px`,
        margin: '0 auto'
      }}
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