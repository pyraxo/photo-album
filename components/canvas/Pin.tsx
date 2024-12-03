'use client';

import { useSmoothDrag } from '@/lib/hooks/use-smooth-drag';
import { cn } from '@/lib/utils';
import { animated } from '@react-spring/web';
import { useState } from 'react';
import { HoverTooltip } from '../HoverTooltip';

interface PinProps {
  x: number;
  y: number;
  rotation?: number;
  isPreview?: boolean;
  color?: string;
  onDragEnd?: (x: number, y: number) => void;
}

export function Pin({ x, y, rotation = 0, isPreview, color = '#ef4444', onDragEnd }: PinProps) {
  const { isDragging, handleDragStart, style } = useSmoothDrag(x, y, onDragEnd);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <animated.div
        className={cn(
          "absolute cursor-move z-[60]",
          isPreview && "pointer-events-none",
          isDragging && "z-[61]"
        )}
        style={{
          ...style,
          transform: `rotate(${rotation}deg)`,
          touchAction: 'none',
        }}
        onMouseDown={!isPreview ? handleDragStart : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Pin head */}
        <div
          className={cn(
            "w-5 h-5 rounded-full shadow-lg ring-1 ring-black/10 relative z-10"
          )}
          style={{
            background: `linear-gradient(to bottom right, ${color}, ${color}dd)`
          }}
        />
        {/* Pin point */}
        <div className="absolute -bottom-2 left-1/2 w-0.5 h-3 bg-gradient-to-b from-zinc-300 to-zinc-400 transform -translate-x-1/2 shadow-md" />
        {/* Pin shadow */}
        <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-black/20 blur-sm rounded-full transform -translate-x-1/2 translate-y-1/2 -z-10" />
      </animated.div>

      {isHovered && !isDragging && (
        <HoverTooltip
          type="pin"
          x={x}
          y={y}
          color={color}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      )}
    </>
  );
} 