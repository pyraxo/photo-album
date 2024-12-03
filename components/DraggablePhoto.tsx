'use client';

import { animated } from '@react-spring/web';
import { usePhotoStore } from '@/lib/store';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';
import { useSmoothDrag } from '@/lib/hooks/use-smooth-drag';

interface DraggablePhotoProps {
  photo: Photo;
}

export function DraggablePhoto({ photo }: DraggablePhotoProps) {
  const updatePhoto = usePhotoStore((state) => state.updatePhoto);
  const { isDragging, handleDragStart, style } = useSmoothDrag();

  return (
    <animated.div
      className={cn(
        'absolute cursor-grab touch-none select-none',
        isDragging && 'cursor-grabbing z-50'
      )}
      style={{
        x: style.x,
        y: style.y,
        scale: style.scale,
        rotate: style.rotate.to((r) => `${r}deg`),
        touchAction: 'none',
      }}
      onMouseDown={handleDragStart}
    >
      <div className="relative">
        <img
          src={photo.url}
          alt={photo.caption}
          className="max-w-[300px] rounded-lg shadow-lg"
          draggable={false}
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