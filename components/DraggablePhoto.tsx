'use client';

import { animated } from '@react-spring/web';
import { usePhotoStore } from '@/lib/store';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';
import { useSmoothDrag } from '@/lib/hooks/use-smooth-drag';
import Image from 'next/image';

interface DraggablePhotoProps {
  photo: Photo;
}

export function DraggablePhoto({ photo }: DraggablePhotoProps) {
  const updatePhoto = usePhotoStore((state) => state.updatePhoto);
  const bringToFront = usePhotoStore((state) => state.bringToFront);
  const { isDragging, handleDragStart, style } = useSmoothDrag(
    photo.position.x,
    photo.position.y,
    (x, y) => updatePhoto(photo.id, { position: { x, y } })
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    bringToFront(photo.id);
    handleDragStart(e);
  };

  return (
    <animated.div
      className={cn(
        'absolute cursor-grab touch-none select-none',
        isDragging && 'cursor-grabbing'
      )}
      style={{
        x: style.x,
        y: style.y,
        scale: style.scale,
        rotate: style.rotate.to((r) => `${r}deg`),
        touchAction: 'none',
        zIndex: photo.zIndex || 0,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        <Image
          src={photo.url}
          alt={photo.caption}
          width={300}
          height={200}
          className="max-w-[300px] rounded-lg shadow-lg"
          draggable={false}
          unoptimized
        />
        {photo.caption && (
          <p className="mt-2 text-sm text-center font-medium bg-white/80 px-2 py-1 rounded">
            {photo.caption}
          </p>
        )}
      </div>
    </animated.div>
  );
}