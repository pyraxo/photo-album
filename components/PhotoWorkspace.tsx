'use client';

import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePhotoStore } from '@/lib/store';
import { PhotoCanvas } from './PhotoCanvas';
import { AlbumShelf } from './AlbumShelf';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
} from '@/components/ui/context-menu';
import { Grid, Circle, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type BackgroundStyle = 'plain' | 'grid' | 'dots';

export default function PhotoWorkspace() {
  const [background, setBackground] = useState<BackgroundStyle>('plain');
  const [isDragging, setIsDragging] = useState(false);
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!currentAlbumId) return;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!currentAlbumId) {
      toast({
        variant: "destructive",
        title: "No Album Selected",
        description: "Please select or create an album first.",
      });
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const dropX = e.clientX;
    const dropY = e.clientY;

    if (imageFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please drop image files only.",
      });
      return;
    }

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const img = new Image();
        img.src = url;
        img.onload = () => {
          usePhotoStore.getState().addPhoto({
            id: Math.random().toString(36).substring(2, 11),
            url,
            caption: '',
            position: { x: dropX, y: dropY },
            rotation: (Math.random() - 0.5) * 0.2,
            scale: 1,
            width: img.width,
            height: img.height,
          });

          toast({
            title: "Image Added",
            description: `Successfully added ${file.name}`,
          });
        };
      };
      reader.readAsDataURL(file);
    });
  }, [currentAlbumId, toast]);

  return (
    <DndProvider backend={HTML5Backend}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              'w-full h-screen relative',
              background === 'grid' && 'bg-grid',
              background === 'dots' && 'bg-dots',
              isDragging && currentAlbumId && [
                'outline-none ring-2 ring-primary/50',
                'after:absolute after:inset-4',
                'after:border-2 after:border-dashed after:border-primary/50',
                'after:rounded-lg after:transition-all',
                'after:animate-pulse',
              ]
            )}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
          >
            <PhotoCanvas />
            <AlbumShelf />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Background Style</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setBackground('plain')}
            className={cn(background === 'plain' && 'bg-accent')}
          >
            <Square className="w-4 h-4 mr-2" />
            Plain
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setBackground('grid')}
            className={cn(background === 'grid' && 'bg-accent')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setBackground('dots')}
            className={cn(background === 'dots' && 'bg-accent')}
          >
            <Circle className="w-4 h-4 mr-2" />
            Dots
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DndProvider>
  );
}