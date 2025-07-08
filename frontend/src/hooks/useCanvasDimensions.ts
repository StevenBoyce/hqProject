import { useState, useEffect, useRef } from 'react';

interface CanvasDimensions {
  width: number;
  height: number;
}

export const useCanvasDimensions = (canvasRef: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState<CanvasDimensions>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial dimensions
    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    };

    // Initial measurement
    updateDimensions();

    // Set up ResizeObserver to track dimension changes
    observerRef.current = new ResizeObserver(updateDimensions);
    observerRef.current.observe(canvas);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [canvasRef]);

  return dimensions;
}; 