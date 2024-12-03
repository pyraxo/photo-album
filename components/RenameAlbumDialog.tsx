import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface RenameAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  onRename: (newName: string) => void;
}

export function RenameAlbumDialog({
  open,
  onOpenChange,
  initialName,
  onRename,
}: RenameAlbumDialogProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleRename = () => {
    if (!name.trim()) return;
    onRename(name.trim());
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Album name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleRename}>Rename</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 