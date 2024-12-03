'use client';

import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePhotoStore } from '@/lib/store';
import { PhotoCanvas } from './PhotoCanvas';
import { AlbumShelf } from './AlbumShelf';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { CreateAlbumDialog } from './CreateAlbumDialog';

export default function PhotoWorkspace() {
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const dropX = e.clientX;
    const dropY = e.clientY;

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          usePhotoStore.getState().addPhoto({
            id: Math.random().toString(36).substr(2, 9),
            url,
            caption: '',
            position: { x: dropX, y: dropY },
            rotation: (Math.random() - 0.5) * 0.2,
            scale: 1,
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="w-full h-screen relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={() => setIsCreatingAlbum(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        </div>

        {currentAlbumId ? (
          <PhotoCanvas />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Select an album to view or create a new one
          </div>
        )}

        <AlbumShelf />
        <CreateAlbumDialog
          open={isCreatingAlbum}
          onOpenChange={setIsCreatingAlbum}
        />
      </div>
    </DndProvider>
  );
}