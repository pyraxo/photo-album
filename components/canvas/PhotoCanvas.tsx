'use client';

import { usePhotoStore } from '@/lib/stores/use-photo-store';
import { useCanvasStore } from '@/lib/stores/use-canvas-store';
import { cn } from '@/lib/utils';
import { useCallback, useEffect } from 'react';
import { DraggablePhoto } from './DraggablePhoto';
import { Pin } from './Pin';
import { PinBox } from './PinBox';

export function PhotoCanvas() {
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const photos = usePhotoStore((state) =>
    state.photos.filter(photo => photo.albumId === currentAlbumId)
  );

  const { movePin, updatePinnedPhotos, getPinsForAlbum } = useCanvasStore();
  const pins = useCanvasStore(
    useCallback((state) =>
      currentAlbumId ? getPinsForAlbum(currentAlbumId) : [],
      [currentAlbumId, getPinsForAlbum]
    )
  );

  // Memoize the update function
  const handlePinMove = useCallback((id: string, x: number, y: number) => {
    movePin(id, x, y, photos);
  }, [movePin, photos]);

  // Update pinned photos when pins or photos change
  useEffect(() => {
    if (currentAlbumId) {
      updatePinnedPhotos(photos, currentAlbumId);
    }
  }, [pins.length, photos.length, currentAlbumId]); // Only run when pins or photos are added/removed

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!currentAlbumId) {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full relative z-0",
        !currentAlbumId && "cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
    >
      {photos.map((photo) => (
        <DraggablePhoto key={photo.id} photo={photo} />
      ))}

      {/* Placed Pins */}
      {pins.map((pin) => (
        <Pin
          key={pin.id}
          x={pin.x}
          y={pin.y}
          rotation={pin.rotation}
          color={pin.color}
          onDragEnd={(x, y) => handlePinMove(pin.id, x, y)}
        />
      ))}

      {/* Pin Box */}
      <PinBox />

      {/* No Album Selected Overlay */}
      {!currentAlbumId && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              Select or create an album first
            </p>
            <p className="text-sm text-muted-foreground/80">
              Photos and pins can only be added to an album
            </p>
          </div>
        </div>
      )}
    </div>
  );
}