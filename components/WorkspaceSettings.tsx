'use client';

import { Button } from './ui/button';
import { Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState } from 'react';

export type BackgroundStyle = 'plain' | 'grid' | 'dots';

interface WorkspaceSettingsProps {
  onBackgroundChange: (style: BackgroundStyle) => void;
}

export function WorkspaceSettings({ onBackgroundChange }: WorkspaceSettingsProps) {
  const [background, setBackground] = useState<BackgroundStyle>('plain');

  const handleBackgroundChange = (value: string) => {
    const style = value as BackgroundStyle;
    setBackground(style);
    onBackgroundChange(style);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Background Style</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={background} onValueChange={handleBackgroundChange}>
          <DropdownMenuRadioItem value="plain">Plain</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="grid">Grid</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dots">Dots</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 