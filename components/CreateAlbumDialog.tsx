'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePhotoStore } from '@/lib/stores/use-photo-store';
import { useToast } from '@/hooks/use-toast';

interface CreateAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAlbumDialog({ open, onOpenChange }: CreateAlbumDialogProps) {
  const [name, setName] = useState('');
  const addAlbum = usePhotoStore((state) => state.addAlbum);
  const { toast } = useToast();

  const handleCreate = () => {
    if (!name.trim()) return;

    const albumId = Math.random().toString(36).substr(2, 9);
    addAlbum({
      id: albumId,
      name: name.trim(),
      photoIds: [],
    });

    toast({
      title: "Album Created",
      description: `Successfully created album "${name.trim()}"`,
    });

    setName('');
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Album name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleCreate}>Create Album</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}