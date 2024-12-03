'use client';

import { useEffect, useState } from 'react';
import { useAvailableKeybinds, formatKeyCombo } from '@/lib/hooks/use-keybinds';
import { cn } from '@/lib/utils';

export function KeybindOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const bindings = useAvailableKeybinds();

  // Show overlay when holding Command/Ctrl
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        // Clear any existing timeout
        if (timeout) clearTimeout(timeout);
        setIsVisible(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        // Add a small delay before hiding to prevent flicker
        timeout = setTimeout(() => setIsVisible(false), 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  // Group bindings by scope
  const groupedBindings = bindings.reduce((acc, binding) => {
    const scope = binding.scope || 'global';
    if (!acc[scope]) acc[scope] = [];
    acc[scope].push(binding);
    return acc;
  }, {} as Record<string, typeof bindings>);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-card w-[600px] rounded-lg shadow-lg border overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="text-lg font-semibold">Available Keyboard Shortcuts</h2>
          <p className="text-sm text-muted-foreground">
            Release Command/Ctrl to close
          </p>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedBindings).map(([scope, bindings]) => (
            <div key={scope} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                {scope}
              </h3>
              <div className="space-y-2">
                {bindings.map((binding) => (
                  <div
                    key={binding.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{binding.description}</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                      {Array.isArray(binding.combo)
                        ? binding.combo.map(formatKeyCombo).join(' or ')
                        : formatKeyCombo(binding.combo)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 