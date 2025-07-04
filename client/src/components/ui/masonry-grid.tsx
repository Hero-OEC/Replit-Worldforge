import { ReactNode, useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!gridRef.current) return;

    // Initialize masonry
    masonryRef.current = new Masonry(gridRef.current, {
      itemSelector: '.masonry-item',
      columnWidth: columnWidth,
      gutter: gutter,
      fitWidth: true,
      percentPosition: true
    });

    // Layout after images load
    const imgLoad = imagesLoaded(gridRef.current);
    imgLoad.on('progress', () => {
      // @ts-ignore
      masonryRef.current?.layout();
    });

    return () => {
      // @ts-ignore
      masonryRef.current?.destroy();
    };
  }, [columnWidth, gutter]);

  useEffect(() => {
    // Re-layout when children change
    if (masonryRef.current) {
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
      className={`masonry-grid ${className}`}
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
    <div className={`masonry-item ${className}`} style={{ width: `320px` }}>
      {children}
    </div>
  );
}