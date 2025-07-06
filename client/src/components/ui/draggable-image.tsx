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
    console.log('Mouse down event fired!', { imageLoaded, e });
    e.preventDefault();
    e.stopPropagation();
    
    if (!imageLoaded) {
      console.log('Image not loaded yet');
      return;
    }
    
    console.log('Starting drag', { position });
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    console.log('Mouse moving', { isDragging, clientX: e.clientX, clientY: e.clientY });

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    console.log('Setting new position', { newX, newY });
    setPosition({ x: newX, y: newY });
    onPositionChange?.(newX, newY);
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

  console.log('DraggableImage rendering', { src, imageLoaded, position });
  
  return (
    <div className={`relative ${className}`}>
      <div className="text-red-500 text-xs mb-2">DRAGGABLE IMAGE COMPONENT</div>
      <div 
        ref={containerRef}
        className="bg-[var(--color-200)] rounded-lg border-2 border-red-500 flex items-center justify-center overflow-hidden relative cursor-grab"
        style={{ 
          width: containerWidth,
          aspectRatio: aspectRatio.replace('/', ' / ')
        }}
        onMouseDown={(e) => {
          console.log('Container mouse down!');
          handleMouseDown(e);
        }}
        onClick={() => console.log('Container clicked!')}
      >
        <img 
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            userSelect: 'none'
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
            setImageLoaded(true);
          }}
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