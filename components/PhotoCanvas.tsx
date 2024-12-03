'use client';

import { usePhotoStore } from '@/lib/store';
import { DraggablePhoto } from './DraggablePhoto';
import { PinBox } from './PinBox';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMousePosition } from '@/lib/hooks/use-mouse-position';

interface PlacedPin {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

function Pin() {
  return (
    <>
      {/* Pin head */}
      <div className={cn(
        "w-5 h-5 rounded-full",
        "bg-gradient-to-br from-red-400 to-red-600",
        "shadow-lg",
        "ring-1 ring-red-900/20",
        "relative z-10"
      )} />
      {/* Pin point */}
      <div className={cn(
        "absolute -bottom-2 left-1/2 w-0.5 h-3",
        "bg-gradient-to-b from-zinc-300 to-zinc-400",
        "transform -translate-x-1/2",
        "shadow-md"
      )} />
      {/* Pin shadow */}
      <div className={cn(
        "absolute -bottom-2 left-1/2 w-4 h-4",
        "bg-black/20 blur-sm rounded-full",
        "transform -translate-x-1/2 translate-y-1/2",
        "-z-10"
      )} />
    </>
  );
}

export function PhotoCanvas() {
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const photos = usePhotoStore((state) =>
    state.photos.filter(photo => photo.albumId === currentAlbumId)
  );
  const [isPinMode, setIsPinMode] = useState(false);
  const [pins, setPins] = useState<PlacedPin[]>([]);
  const mousePosition = useMousePosition();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isPinMode) return;

    // Get click coordinates relative to the canvas
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new pin with random rotation
    setPins(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      rotation: Math.random() * 90 - 45, // Random rotation between -45 and 45 degrees
    }]);

    // Exit pin mode after placing
    setIsPinMode(false);
  };

  return (
    <div
      className="w-full h-full relative z-0"
      onClick={handleCanvasClick}
    >
      {photos.map((photo) => (
        <DraggablePhoto key={photo.id} photo={photo} />
      ))}

      {/* Placed Pins */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="absolute"
          style={{
            left: pin.x - 10,
            top: pin.y - 10,
            transform: `rotate(${pin.rotation}deg)`,
          }}
        >
          <Pin />
        </div>
      ))}

      {/* Pin Box */}
      <PinBox onPinSelected={setIsPinMode} />

      {/* Cursor indicator when in pin mode */}
      {isPinMode && (
        <div
          className={cn(
            "fixed w-5 h-5 pointer-events-none z-50",
            "transition-transform duration-200"
          )}
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
          }}
        >
          <Pin />
        </div>
      )}
    </div>
  );
}