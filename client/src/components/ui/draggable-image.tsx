import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCcw } from 'lucide-react';
import { Button } from './button';

interface DraggableImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onPositionChange?: (x: number, y: number) => void;
  initialX?: number;
  initialY?: number;
  aspectRatio?: string;
  containerWidth?: string;
}

export function DraggableImage({
  src,
  alt,
  width = 280,
  height,
  className = '',
  onPositionChange,
  initialX = 0,
  initialY = 0,
  aspectRatio = '7/9',
  containerWidth = '280px'
}: DraggableImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  const handleMouseDown = (e: React.MouseEvent) => {

    e.preventDefault();
    e.stopPropagation();
    
    if (!imageLoaded) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging || !imageRef.current || !containerRef.current) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Get the natural size of the image and container
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const image = imageRef.current;
    
    // Calculate image dimensions when it covers the container
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;
    const containerAspectRatio = containerRect.width / containerRect.height;
    
    let imageWidth, imageHeight;
    
    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider than container - fit by height
      imageHeight = containerRect.height;
      imageWidth = imageHeight * imageAspectRatio;
    } else {
      // Image is taller than container - fit by width  
      imageWidth = containerRect.width;
      imageHeight = imageWidth / imageAspectRatio;
    }
    
    // Calculate bounds to prevent empty space
    const maxX = 0;
    const maxY = 0;
    const minX = containerRect.width - imageWidth;
    const minY = containerRect.height - imageHeight;
    
    // Constrain position to prevent empty space
    const constrainedX = Math.max(minX, Math.min(maxX, newX));
    const constrainedY = Math.max(minY, Math.min(maxY, newY));

    setPosition({ x: constrainedX, y: constrainedY });
    onPositionChange?.(constrainedX, constrainedY);
  }, [isDragging, dragStart.x, dragStart.y, onPositionChange]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    onPositionChange?.(0, 0);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'auto';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef}
        className="bg-[var(--color-200)] rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden relative cursor-grab"
        style={{ 
          width: containerWidth,
          aspectRatio: aspectRatio.replace('/', ' / ')
        }}
        onMouseDown={handleMouseDown}
      >
        <img 
          ref={imageRef}
          src={src}
          alt={alt}
          className="absolute inset-0 w-auto h-auto max-w-none max-h-none pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            userSelect: 'none',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover'
          }}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />
        
        {/* Drag overlay and controls */}
        {imageLoaded && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ zIndex: 2 }}>
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white border-gray-600"
                onClick={handleReset}
                title="Reset position"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white bg-black/50 px-2 py-1 rounded text-xs">
              <Move className="h-3 w-3" />
              <span>Drag to reposition</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}