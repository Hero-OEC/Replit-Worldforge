import { ReactNode, useEffect, useRef, useState } from 'react';
import Masonry from 'masonry-layout';
// @ts-ignore
import imagesLoaded from 'imagesloaded';

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
  columnWidth = 320,
  gutter = 32
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<Masonry | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!gridRef.current) return;

    // Hide grid initially to prevent jitter
    setIsReady(false);

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      if (!gridRef.current) return;

      // Initialize masonry
      masonryRef.current = new Masonry(gridRef.current, {
        itemSelector: '.masonry-item',
        columnWidth: columnWidth,
        gutter: gutter,
        fitWidth: true,
        percentPosition: true,
        transitionDuration: '0.3s'
      });

      // Layout after images load
      const imgLoad = imagesLoaded(gridRef.current);
      imgLoad.on('always', () => {
        // @ts-ignore
        masonryRef.current?.layout();
        // Show grid after layout is complete
        setTimeout(() => setIsReady(true), 100);
      });

      // If no images, show immediately after layout
      if (imgLoad.images.length === 0) {
        // @ts-ignore
        masonryRef.current?.layout();
        setTimeout(() => setIsReady(true), 100);
      }
    }, 50);

    return () => {
      clearTimeout(timeout);
      // @ts-ignore
      masonryRef.current?.destroy();
    };
  }, [columnWidth, gutter]);

  useEffect(() => {
    // Re-layout when children change
    if (masonryRef.current && isReady) {
      setTimeout(() => {
        // @ts-ignore
        masonryRef.current?.reloadItems();
        // @ts-ignore
        masonryRef.current?.layout();
      }, 100);
    }
  }, [children]);

  return (
    <div 
      ref={gridRef}
      className={`masonry-grid ${className} transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      style={{ margin: '0 auto' }}
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
      className={`masonry-item transform transition-all duration-300 ease-out ${className}`} 
      style={{ width: `320px` }}
    >
      {children}
    </div>
  );
}