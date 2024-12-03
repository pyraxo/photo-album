'use client';

import { usePhotoStore } from '@/lib/stores/use-photo-store';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Pencil, Palette, Trash2, Plus } from 'lucide-react';
import { RenameAlbumDialog } from './RenameAlbumDialog';
import { CreateAlbumDialog } from './CreateAlbumDialog';
import { DeleteAlbumDialog } from './DeleteAlbumDialog';

const ALBUM_COLORS = [
  ['#1e4d40', '#0f3830'], // Deep teal
  ['#7c1d2c', '#5a1520'], // Burgundy
  ['#2c1810', '#241309'], // Classic brown
  ['#1a365d', '#102a4c'], // Navy
  ['#3c1361', '#2a0d45'], // Royal purple
  ['#1f2937', '#111827'], // Charcoal
  ['#764e31', '#5c3d26'], // Saddle brown
  ['#374151', '#1f2937'], // Cool gray
] as const;

interface AlbumWithStyle {
  color: {
    base: string;
    binding: string;
  };
  rotation: number;
}

export function AlbumShelf() {
  const albums = usePhotoStore((state) => state.albums);
  const currentAlbumId = usePhotoStore((state) => state.currentAlbumId);
  const setCurrentAlbum = usePhotoStore((state) => state.setCurrentAlbum);
  const updateAlbum = usePhotoStore((state) => state.updateAlbum);
  const deleteAlbum = usePhotoStore((state) => state.deleteAlbum);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [albumToRename, setAlbumToRename] = useState<string | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);

  // For albums without assigned colors, assign them based on index
  const albumColors = useMemo(() => {
    return albums.map((album, index) => {
      if (album.color) {
        return {
          color: album.color,
          rotation: (Math.random() - 0.5) * 6
        } as AlbumWithStyle;
      }
      const colorIndex = index % ALBUM_COLORS.length;
      return {
        color: {
          base: ALBUM_COLORS[colorIndex][0],
          binding: ALBUM_COLORS[colorIndex][1],
        },
        rotation: (Math.random() - 0.5) * 6
      } as AlbumWithStyle;
    });
  }, [albums]);

  const handleRenameClick = (albumId: string) => {
    setAlbumToRename(albumId);
    setRenameDialogOpen(true);
  };

  const handleRename = (newName: string) => {
    if (albumToRename) {
      updateAlbum(albumToRename, { name: newName });
    }
  };

  const handleColorChange = (albumId: string, colorIndex: number) => {
    updateAlbum(albumId, {
      color: {
        base: ALBUM_COLORS[colorIndex][0],
        binding: ALBUM_COLORS[colorIndex][1],
      }
    });
  };

  const handleDeleteClick = (albumId: string) => {
    setAlbumToDelete(albumId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (albumToDelete) {
      deleteAlbum(albumToDelete);
      setDeleteDialogOpen(false);
    }
  };

  const albumToRenameData = albumToRename ? albums.find(a => a.id === albumToRename) : null;
  const albumToDeleteData = albumToDelete ? albums.find(a => a.id === albumToDelete) : null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-50">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8 p-4">
          {albums.map((album, index) => (
            <ContextMenu key={album.id}>
              <ContextMenuTrigger>
                <button
                  onClick={() => setCurrentAlbum(album.id)}
                  className={cn(
                    'relative w-40 h-56 pointer-events-auto transform-gpu transition-all duration-500 ease-out',
                    'translate-y-[calc(100%-5rem)]',
                    'hover:translate-y-[calc(100%-7rem)]',
                    currentAlbumId === album.id
                      ? [
                        'translate-y-[calc(100%-8rem)]',
                        'z-10',
                        'scale-105',
                        `rotate-0`
                      ].join(' ')
                      : [
                        'hover:z-[1]',
                        `rotate-[${albumColors[index].rotation}deg]`,
                        'hover:rotate-0'
                      ].join(' ')
                  )}
                >
                  {/* Album cover with unique leather texture */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-t-lg transform-gpu transition-all duration-500 ease-out",
                      "shadow-[0_0_20px_rgba(0,0,0,0.4)]",
                      "hover:shadow-[0_0_30px_rgba(0,0,0,0.6)]",
                      // Leather texture pattern
                      "before:absolute before:inset-0 before:opacity-30",
                      "before:bg-[radial-gradient(#ffffff33_0.5px,transparent_1px)]",
                      "before:bg-[size:4px_4px]",
                      // Inner shadow for depth
                      "after:absolute after:inset-0 after:rounded-t-lg",
                      "after:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                    )}
                    style={{
                      backgroundColor: albumColors[index].color.base,
                    }}
                  >
                    {/* Modern title with monospace font */}
                    <div className="absolute inset-x-4 top-6">
                      <p className={cn(
                        "text-center font-mono text-sm tracking-[0.1em] leading-tight",
                        "bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.4)_100%)]",
                        "bg-clip-text text-transparent",
                        "drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]",
                        "transition-all duration-500",
                        "after:content-[attr(data-text)]",
                        "after:absolute after:left-0 after:top-[1px] after:w-full",
                        "after:text-center after:font-mono after:text-sm after:tracking-[0.1em]",
                        "after:text-white/10",
                        "after:z-[-1]"
                      )}
                        data-text={album.name}
                      >
                        {album.name}
                      </p>
                    </div>

                    {/* Binding details */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-[16px] rounded-l-lg",
                        "transition-all duration-500"
                      )}
                      style={{
                        backgroundColor: albumColors[index].color.binding,
                      }}
                    >
                      {/* Binding ridges */}
                      <div className="absolute inset-y-6 left-3 w-[2px] space-y-6">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-[2px] w-full transition-all duration-500"
                            style={{
                              background: "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.3)"
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Edge lighting effects */}
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-l from-white/20 to-transparent transition-all duration-500" />
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-b from-white/20 to-transparent transition-all duration-500" />
                  </div>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleRenameClick(album.id)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Palette className="w-4 h-4 mr-2" />
                    Change Color
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="grid grid-cols-4 gap-1 p-1">
                    {ALBUM_COLORS.map((color, i) => (
                      <button
                        key={i}
                        className={cn(
                          "w-8 h-8 rounded-full transition-transform",
                          "hover:scale-110 focus:scale-110 focus:outline-none",
                          album.color?.base === color[0] && "ring-2 ring-white ring-offset-2 ring-offset-background"
                        )}
                        style={{ backgroundColor: color[0] }}
                        onClick={() => handleColorChange(album.id, i)}
                      />
                    ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => handleDeleteClick(album.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}

          {/* Add Album Button */}
          <button
            onClick={() => setCreateDialogOpen(true)}
            className={cn(
              'relative w-40 h-56 pointer-events-auto transform-gpu transition-all duration-500 ease-out',
              'translate-y-[calc(100%-5rem)]',
              'hover:translate-y-[calc(100%-7rem)]',
              'group'
            )}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-t-lg transform-gpu transition-all duration-500 ease-out",
                "shadow-[0_0_20px_rgba(0,0,0,0.4)]",
                "hover:shadow-[0_0_30px_rgba(0,0,0,0.6)]",
                "bg-muted/50 backdrop-blur-sm",
                "flex items-center justify-center",
                "border-2 border-dashed border-muted-foreground/50"
              )}
            >
              <Plus className="w-8 h-8 text-muted-foreground transition-transform group-hover:scale-125" />
            </div>
          </button>
        </div>
      </div>

      <RenameAlbumDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        initialName={albumToRenameData?.name || ''}
        onRename={handleRename}
      />

      <CreateAlbumDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <DeleteAlbumDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        albumName={albumToDeleteData?.name || ''}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}