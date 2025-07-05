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
        columns: 'auto 320px',
        columnGap: '32px',
        columnFill: 'balance',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
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
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        display: 'inline-block',
        width: '100%',
        marginBottom: '32px'
      }}
    >
      {children}
    </div>
  );
}