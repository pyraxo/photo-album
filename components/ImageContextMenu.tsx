'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { Pencil, Trash2, Type } from "lucide-react";
import { useState } from "react";
import { AddCaptionDialog } from "./AddCaptionDialog";
import { DeleteDialog } from "./ui/delete-dialog";
import { usePhotoStore } from "@/lib/store";

interface ImageContextMenuProps {
  children: React.ReactNode;
  onDelete: () => void;
  photoId: string;
  initialCaption?: string;
}

export function ImageContextMenu({ children, onDelete, photoId, initialCaption }: ImageContextMenuProps) {
  const [captionDialogOpen, setCaptionDialogOpen] = useState(false);
  const [deleteCaptionDialogOpen, setDeleteCaptionDialogOpen] = useState(false);
  const updatePhoto = usePhotoStore((state) => state.updatePhoto);

  const handleCaptionSave = (caption: string) => {
    updatePhoto(photoId, { caption });
  };

  const handleCaptionDelete = () => {
    updatePhoto(photoId, { caption: undefined });
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Type className="mr-2 h-4 w-4" />
              Caption
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => setCaptionDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {initialCaption ? 'Edit Caption' : 'Add Caption'}
              </ContextMenuItem>
              {initialCaption && (
                <ContextMenuItem
                  onClick={() => setDeleteCaptionDialogOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Caption
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Image
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AddCaptionDialog
        open={captionDialogOpen}
        onOpenChange={setCaptionDialogOpen}
        onConfirm={handleCaptionSave}
        initialCaption={initialCaption}
      />

      <DeleteDialog
        open={deleteCaptionDialogOpen}
        onOpenChange={setDeleteCaptionDialogOpen}
        onConfirm={handleCaptionDelete}
        title="Delete Caption"
        description="Are you sure you want to delete this caption? This action cannot be undone."
      />
    </>
  );
} 