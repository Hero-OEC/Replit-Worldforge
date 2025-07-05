import { ReactNode, useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layoutMasonry = () => {
      const container = containerRef.current;
      if (!container) return;

      const items = Array.from(container.children) as HTMLElement[];
      if (items.length === 0) return;

      const containerWidth = container.offsetWidth;
      const itemWidth = 350;
      const gap = 32;
      const columns = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
      
      // Calculate total width used by all columns
      const totalUsedWidth = columns * itemWidth + (columns - 1) * gap;
      const leftOffset = Math.max(0, (containerWidth - totalUsedWidth) / 2);
      
      // Initialize column heights
      const columnHeights = new Array(columns).fill(0);
      
      // Position each item
      items.forEach((item, index) => {
        // Find the shortest column
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Calculate position with centering offset
        const x = leftOffset + shortestColumnIndex * (itemWidth + gap);
        const y = columnHeights[shortestColumnIndex];
        
        // Apply positioning
        item.style.position = 'absolute';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.width = `${itemWidth}px`;
        
        // Update column height
        const itemHeight = item.offsetHeight;
        columnHeights[shortestColumnIndex] += itemHeight + gap;
      });
      
      // Set container height
      const maxHeight = Math.max(...columnHeights) - gap;
      container.style.height = `${maxHeight}px`;
    };

    // Layout on mount and resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(layoutMasonry, 0);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Initial layout
      setTimeout(layoutMasonry, 0);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <div 
      ref={containerRef}
      className={`masonry-grid ${className}`}
      style={{
        position: 'relative',
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
    <div className={`masonry-item ${className}`}>
      {children}
    </div>
  );
}