'use client';

import { usePhotoStore } from '@/lib/store';
import { DraggablePhoto } from './DraggablePhoto';

export function PhotoCanvas() {
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const photos = usePhotoStore((state) =>
    state.photos.filter(photo => photo.albumId === currentAlbumId)
  );

  return (
    <div className="w-full h-full relative">
      {photos.map((photo) => (
        <DraggablePhoto key={photo.id} photo={photo} />
      ))}
    </div>
  );
}