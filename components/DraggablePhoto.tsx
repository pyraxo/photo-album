'use client';

import { animated } from '@react-spring/web';
import { usePhotoStore } from '@/lib/store';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';
import { useSmoothDrag } from '@/lib/hooks/use-smooth-drag';
import Image from 'next/image';
import { ImageContextMenu } from './ImageContextMenu';
import { useState, useCallback } from 'react';
import { DeleteImageDialog } from './DeleteImageDialog';
import { useToast } from '@/hooks/use-toast';
import { useCanvasStore } from '@/lib/stores/use-canvas-store';
import { HoverTooltip } from './HoverTooltip';

interface DraggablePhotoProps {
  photo: Photo;
}

export function DraggablePhoto({ photo }: DraggablePhotoProps) {
  const updatePhoto = usePhotoStore((state) => state.updatePhoto);
  const bringToFront = usePhotoStore((state) => state.bringToFront);
  const deletePhoto = usePhotoStore((state) => state.deletePhoto);
  const isPhotoPinned = useCanvasStore((state) => state.isPhotoPinned(photo.id));
  const updatePinnedPhotos = useCanvasStore((state) => state.updatePinnedPhotos);
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const photos = usePhotoStore((state) => state.photos);
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleDragEnd = useCallback((x: number, y: number) => {
    updatePhoto(photo.id, { position: { x, y } });
    if (currentAlbumId) {
      // Update pinned status after drag ends
      updatePinnedPhotos(photos, currentAlbumId);
    }
  }, [photo.id, updatePhoto, currentAlbumId, updatePinnedPhotos, photos]);

  const { isDragging, handleDragStart, style } = useSmoothDrag(
    photo.position.x,
    photo.position.y,
    handleDragEnd
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPhotoPinned) return; // Prevent dragging if pinned
    bringToFront(photo.id);
    handleDragStart(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    deletePhoto(photo.id);
    toast({
      title: "Image Deleted",
      description: "The image has been removed from the album.",
    });
  };

  return (
    <>
      <ImageContextMenu
        onDelete={() => setDeleteDialogOpen(true)}
        photoId={photo.id}
        initialCaption={photo.caption}
      >
        <animated.div
          className={cn(
            "absolute select-none group/photo",
            "touch-none",
            !isPhotoPinned && "cursor-move",
            isPhotoPinned && "cursor-not-allowed",
            isDragging && "z-[51]"
          )}
          style={{
            ...style,
            transform: `rotate(${photo.rotation}deg) scale(${photo.scale})`,
            zIndex: photo.zIndex || 50,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={cn(
            "relative",
            photo.caption && "bg-white p-3 pb-8 shadow-xl"
          )}>
            <Image
              src={photo.url}
              alt={photo.caption || ""}
              width={photo.width || 300}
              height={photo.height || 200}
              className={cn(
                "max-w-[300px] shadow-lg",
                isPhotoPinned && "opacity-90"
              )}
              draggable={false}
              unoptimized
            />
            {photo.caption && (
              <p className="absolute bottom-2 left-0 right-0 text-sm text-center font-medium text-black">
                {photo.caption}
              </p>
            )}
          </div>
        </animated.div>
      </ImageContextMenu>

      {isHovered && !isDragging && (
        <HoverTooltip
          type="image"
          x={photo.position.x}
          y={photo.position.y}
          width={photo.width || 300}
          height={photo.height || 200}
          rotation={photo.rotation}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      )}

      <DeleteImageDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}