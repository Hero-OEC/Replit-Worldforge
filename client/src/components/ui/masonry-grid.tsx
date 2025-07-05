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
}: MasonryGridProps) {
  return (
    <div 
      className={`masonry-grid ${className}`}
      style={{
        columnWidth: '350px',
        columnGap: '32px',
        width: '100%',
        maxWidth: '100%'
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
    <div 
      className={`masonry-item ${className}`} 
      style={{ 
        width: '100%',
        marginBottom: '32px',
        breakInside: 'avoid',
        display: 'inline-block'
      }}
    >
      {children}
    </div>
  );
}