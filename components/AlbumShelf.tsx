'use client';

import { usePhotoStore } from '@/lib/store';
import { Album } from '@/types';
import { useDrop } from 'react-dnd';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Book } from 'lucide-react';

export function AlbumShelf() {
  const { albums, addPhotoToAlbum } = usePhotoStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
      <ScrollArea className="h-32">
        <div className="flex gap-4 p-4">
          {albums.map((album) => (
            <AlbumDropZone key={album.id} album={album} onAddPhoto={addPhotoToAlbum} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface AlbumDropZoneProps {
  album: Album;
  onAddPhoto: (photoId: string, albumId: string) => void;
}

function AlbumDropZone({ album, onAddPhoto }: AlbumDropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'photo',
    drop: (item: { id: string }) => {
      onAddPhoto(item.id, album.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 transition-colors ${
        isOver ? 'border-primary bg-primary/10' : 'border-border'
      }`}
    >
      <Book className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium text-center">{album.name}</span>
    </div>
  );
}