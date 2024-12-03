import { useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

type KeybindHandler = (e: KeyboardEvent) => void;

type Keybind = {
  id: string;
  combo: KeyCombo;
  handler: KeybindHandler;
  description: string;
  scope?: string;
  priority?: number; // Higher priority bindings take precedence
};

interface KeybindStore {
  bindings: Keybind[];
  activeScopes: Set<string>;
  addBinding: (binding: Omit<Keybind, 'id'>) => string;
  removeBinding: (id: string) => void;
  addScope: (scope: string) => void;
  removeScope: (scope: string) => void;
}

const useKeybindStore = create<KeybindStore>((set) => ({
  bindings: [],
  activeScopes: new Set(['global']), // Global scope is always active

  addBinding: (binding) => {
    const id = Math.random().toString(36).substring(2);
    set((state) => ({
      bindings: [...state.bindings, { ...binding, id }],
    }));
    return id;
  },

  removeBinding: (id) => {
    set((state) => ({
      bindings: state.bindings.filter((b) => b.id !== id),
    }));
  },

  addScope: (scope) => {
    set((state) => ({
      activeScopes: new Set(Array.from(state.activeScopes).concat(scope)),
    }));
  },

  removeScope: (scope) => {
    if (scope === 'global') return; // Can't remove global scope
    set((state) => {
      const newScopes = new Set(state.activeScopes);
      newScopes.delete(scope);
      return { activeScopes: newScopes };
    });
  },
}));

function matchesCombo(e: KeyboardEvent, combo: KeyCombo): boolean {
  return (
    e.key.toLowerCase() === combo.key.toLowerCase() &&
    !!e.ctrlKey === !!combo.ctrl &&
    !!e.altKey === !!combo.alt &&
    !!e.shiftKey === !!combo.shift &&
    !!e.metaKey === !!combo.meta
  );
}

export function useKeybind(
  combo: KeyCombo | KeyCombo[],
  handler: KeybindHandler,
  options: {
    scope?: string;
    description: string;
    priority?: number;
    disabled?: boolean;
  }
) {
  const {
    scope = 'global',
    description,
    priority = 0,
    disabled = false,
  } = options;

  const combos = Array.isArray(combo) ? combo : [combo];
  const bindingIds = useRef<string[]>([]);

  useEffect(() => {
    if (disabled) return;

    // Add bindings for each combo
    bindingIds.current = combos.map((c) =>
      useKeybindStore.getState().addBinding({
        combo: c,
        handler,
        description,
        scope,
        priority,
      })
    );

    return () => {
      // Cleanup bindings
      bindingIds.current.forEach((id) => {
        useKeybindStore.getState().removeBinding(id);
      });
    };
  }, [combos, handler, scope, description, priority, disabled]);
}

export function useKeybindScope(scope: string) {
  useEffect(() => {
    useKeybindStore.getState().addScope(scope);
    return () => {
      useKeybindStore.getState().removeScope(scope);
    };
  }, [scope]);
}

// Global keyboard event handler
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const state = useKeybindStore.getState();
    const activeScopes = state.activeScopes;

    // Get all bindings that match the current key combo and are in active scopes
    const matchingBindings = state.bindings
      .filter(
        (binding) =>
          matchesCombo(e, binding.combo) &&
          (!binding.scope || activeScopes.has(binding.scope))
      )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    if (matchingBindings.length > 0) {
      // Execute the highest priority binding
      e.preventDefault();
      matchingBindings[0].handler(e);
    }
  });
}

// Helper function to format key combo for display
export function formatKeyCombo(combo: KeyCombo): string {
  const parts: string[] = [];
  if (combo.meta) parts.push('⌘');
  if (combo.ctrl) parts.push('Ctrl');
  if (combo.alt) parts.push('Alt');
  if (combo.shift) parts.push('⇧');
  parts.push(combo.key.toUpperCase());
  return parts.join('+');
}

// Component to display available keybinds
export function useAvailableKeybinds() {
  return useKeybindStore((state) => {
    const activeScopes = state.activeScopes;
    return state.bindings
      .filter((binding) => !binding.scope || activeScopes.has(binding.scope))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  });
} 