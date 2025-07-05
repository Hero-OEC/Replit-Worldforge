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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 350px))',
        gap: '32px',
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'center'
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
        minHeight: 'fit-content'
      }}
    >
      {children}
    </div>
  );
}