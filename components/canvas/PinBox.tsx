'use client';

import { usePhotoStore } from '@/lib/stores/use-photo-store';
import { useCanvasStore } from '@/lib/stores/use-canvas-store';
import { cn } from '@/lib/utils';

interface PinColor {
  gradient: string;
  baseColor: string;
}

const PIN_COLORS: PinColor[] = [
  { gradient: 'from-red-400 to-red-500', baseColor: '#ef4444' },
  { gradient: 'from-blue-400 to-blue-500', baseColor: '#3b82f6' },
  { gradient: 'from-yellow-400 to-yellow-500', baseColor: '#eab308' },
  { gradient: 'from-green-400 to-green-500', baseColor: '#22c55e' },
  { gradient: 'from-zinc-800 to-zinc-900', baseColor: '#18181b' },
];

export function PinBox() {
  const addPin = useCanvasStore((state) => state.addPin);
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);

  if (!currentAlbumId) return null;

  const handlePinClick = (color: PinColor, e: React.MouseEvent) => {
    e.stopPropagation();
    const boxRect = document.querySelector('.pin-box')?.getBoundingClientRect();
    if (!boxRect) return;

    const randomOffset = {
      x: Math.random() * boxRect.width - boxRect.width / 2,
      y: Math.random() * 40 - 160, // -160 to -120px above box
    };

    addPin({
      x: boxRect.left + boxRect.width / 2 + randomOffset.x,
      y: boxRect.top + randomOffset.y,
      rotation: Math.random() * 90 - 45,
      color: color.baseColor,
    }, currentAlbumId);
  };

  return (
    <div className="fixed bottom-8 left-4 z-50 pointer-events-auto">
      <div className="pin-box relative w-36 h-12 transition-all rounded-md bg-zinc-900/90 backdrop-blur-sm shadow-lg">
        {/* Box border glow */}
        <div className="absolute inset-0 rounded-md ring-1 ring-white/10" />

        {/* Pins in box */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-3">
            {PIN_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={(e) => handlePinClick(color, e)}
                className="relative group/pin hover:-translate-y-0.5 transition-transform"
              >
                {/* Pin head */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full",
                    "bg-gradient-to-br shadow-sm",
                    "ring-1 ring-white/20",
                    color.gradient
                  )}
                />
                {/* Pin point */}
                <div className="absolute -bottom-2 left-1/2 w-0.5 h-2.5 bg-gradient-to-b from-zinc-300 to-zinc-400 transform -translate-x-1/2" />
              </button>
            ))}
          </div>
        </div>

        {/* Label */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs font-medium text-muted-foreground">
            Click a pin to place
          </span>
        </div>
      </div>
    </div>
  );
} 