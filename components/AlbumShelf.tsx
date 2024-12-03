'use client';

import { usePhotoStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function AlbumShelf() {
  const albums = usePhotoStore((state) => state.albums);
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const setCurrentAlbum = usePhotoStore((state) => state.setCurrentAlbum);
  const photos = usePhotoStore((state) => state.photos);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/10 backdrop-blur-sm border-t">
      <div className="flex gap-4 p-4 overflow-x-auto">
        {albums.map((album) => {
          const coverPhoto = album.coverPhotoId
            ? photos.find(p => p.id === album.coverPhotoId)
            : photos.find(p => p.albumId === album.id);

          return (
            <button
              key={album.id}
              onClick={() => setCurrentAlbum(album.id)}
              className={cn(
                'relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all',
                currentAlbumId === album.id
                  ? 'border-white scale-110'
                  : 'border-transparent hover:border-white/50'
              )}
            >
              {coverPhoto && (
                <img
                  src={coverPhoto.url}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                <p className="text-xs text-white font-medium truncate">
                  {album.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}