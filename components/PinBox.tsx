'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PinBoxProps {
  onPinSelected: (selected: boolean) => void;
}

export function PinBox({ onPinSelected }: PinBoxProps) {
  const [isPinSelected, setIsPinSelected] = useState(false);

  const handlePinClick = () => {
    const newState = !isPinSelected;
    setIsPinSelected(newState);
    onPinSelected(newState);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
      <button
        onClick={handlePinClick}
        className={cn(
          "w-24 h-16 relative",
          "transition-all duration-200 hover:scale-105",
          isPinSelected && "ring-2 ring-primary ring-offset-2"
        )}
      >
        {/* Box */}
        <div className="absolute inset-0 bg-zinc-800 rounded-lg shadow-lg">
          {/* Box lid (top edge) */}
          <div className="absolute inset-x-0 -top-1.5 h-2 bg-zinc-700 rounded-t-lg transform origin-bottom scale-x-[1.02]" />
        </div>

        {/* Pins in box */}
        <div className="absolute inset-2 grid grid-cols-3 gap-1.5">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "relative group transition-transform duration-200",
                !isPinSelected && "hover:translate-y-[-2px]",
                isPinSelected && i === 4 && "opacity-0"
              )}
            >
              {/* Pin head */}
              <div className={cn(
                "w-4 h-4 rounded-full",
                "bg-gradient-to-br from-red-400 to-red-600",
                "shadow-sm transform -rotate-45",
                "ring-1 ring-red-900/20"
              )} />
              {/* Pin point */}
              <div className="absolute -bottom-1 left-1/2 w-0.5 h-2 bg-gradient-to-b from-zinc-300 to-zinc-400 transform -translate-x-1/2" />
            </div>
          ))}
        </div>

        {/* Label */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs font-medium text-muted-foreground">
            {isPinSelected ? "Place Pin" : "Pick Up Pin"}
          </span>
        </div>
      </button>
    </div>
  );
} 