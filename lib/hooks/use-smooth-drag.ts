'use client';

import { useState, useCallback } from 'react';
import { useSpring } from '@react-spring/web';

export function useSmoothDrag(initialX = 0, initialY = 0, onPositionChange?: (x: number, y: number) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const [{ x, y, scale, rotate }, api] = useSpring(() => ({
    x: initialX,
    y: initialY,
    scale: 1,
    rotate: 0,
    config: {
      tension: 300,
      friction: 30,
    },
  }));

  const handleDragStart = useCallback((event: React.MouseEvent) => {
    setIsDragging(true);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const moveHandler = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;
      api.start({
        x: newX,
        y: newY,
        immediate: true,
      });
      onPositionChange?.(newX, newY);
    };

    const upHandler = () => {
      setIsDragging(false);
      api.start({
        scale: 1,
        rotate: (Math.random() - 0.5) * 10,
      });
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);

    api.start({
      scale: 1.05,
      rotate: 0,
    });
  }, [api, onPositionChange]);

  return {
    isDragging,
    handleDragStart,
    style: {
      x,
      y,
      scale,
      rotate,
    },
  };
}