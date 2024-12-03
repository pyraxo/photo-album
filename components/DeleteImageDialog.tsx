import { DeleteDialog } from "@/components/ui/delete-dialog";

interface DeleteImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteImageDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteImageDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Delete Image"
      description="Are you sure you want to delete this image? This action cannot be undone."
    />
  );
} 