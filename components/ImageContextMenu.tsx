'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash2 } from 'lucide-react';

interface ImageContextMenuProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export function ImageContextMenu({ children, onDelete }: ImageContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Image
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
} 