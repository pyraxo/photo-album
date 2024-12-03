'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface AddCaptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (caption: string) => void;
  initialCaption?: string;
}

export function AddCaptionDialog({ open, onOpenChange, onConfirm, initialCaption = '' }: AddCaptionDialogProps) {
  const [caption, setCaption] = useState(initialCaption);

  useEffect(() => {
    setCaption(initialCaption);
  }, [initialCaption]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(caption);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onConfirm(caption);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Caption</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Caption
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 