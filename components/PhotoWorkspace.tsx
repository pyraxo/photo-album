'use client';

import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePhotoStore } from '@/lib/store';
import { PhotoCanvas } from './PhotoCanvas';
import { AlbumShelf } from './AlbumShelf';
import { Button } from './ui/button';
import { Plus, Book } from 'lucide-react';
import { CreateAlbumDialog } from './CreateAlbumDialog';
import { Scene3D } from './3d/Scene3D';

export default function PhotoWorkspace() {
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [view, setView] = useState<'2d' | '3d'>('2d');

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          usePhotoStore.getState().addPhoto({
            id: Math.random().toString(36).substr(2, 9),
            url,
            caption: '',
            position: { x: Math.random() * 500, y: Math.random() * 500 },
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
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setView(view === '2d' ? '3d' : '2d')}
          >
            <Book className="w-4 h-4 mr-2" />
            {view === '2d' ? '3D' : '2D'} View
          </Button>
          <Button onClick={() => setIsCreatingAlbum(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </Button>
        </div>

        {view === '2d' ? (
          <PhotoCanvas />
        ) : (
          <div className="w-full h-full">
            <Scene3D />
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