import { DeleteDialog } from "@/components/ui/delete-dialog";

interface DeleteAlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumName: string;
  onConfirm: () => void;
}

export function DeleteAlbumDialog({
  open,
  onOpenChange,
  albumName,
  onConfirm,
}: DeleteAlbumDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Delete Album"
      description={`Are you sure you want to delete "${albumName}"? This will also delete all photos in this album. This action cannot be undone.`}
    />
  );
} 