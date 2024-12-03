import { create } from 'zustand';
import { isPointInRotatedRect } from '@/lib/utils';
import { Photo } from '@/types';

interface Pin {
  id: string;
  albumId: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

interface CanvasStore {
  pins: Pin[];
  pinnedPhotoIds: Set<string>;
  addPin: (pin: Omit<Pin, 'id' | 'albumId'>, albumId: string) => void;
  removePin: (id: string) => void;
  movePin: (id: string, x: number, y: number, photos: Photo[]) => void;
  updatePinnedPhotos: (photos: Photo[], albumId: string) => void;
  isPhotoPinned: (photoId: string) => boolean;
  getPinsForAlbum: (albumId: string) => Pin[];
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  pins: [],
  pinnedPhotoIds: new Set<string>(),

  addPin: (pin, albumId) =>
    set((state) => {
      const newPins = [
        ...state.pins,
        { ...pin, id: Math.random().toString(36).substr(2, 9), albumId }
      ];
      return { pins: newPins };
    }),

  removePin: (id) =>
    set((state) => {
      const newPins = state.pins.filter((pin) => pin.id !== id);
      return { pins: newPins };
    }),

  movePin: (id, x, y, photos) =>
    set((state) => {
      const newPins = state.pins.map((pin) =>
        pin.id === id ? { ...pin, x, y } : pin
      );

      // Find photos that this pin overlaps with
      const pin = newPins.find(p => p.id === id);
      if (!pin) return { pins: newPins };

      const newPinnedPhotoIds = new Set(state.pinnedPhotoIds);

      // Remove any photos that were pinned by this pin
      photos.forEach(photo => {
        // Calculate scaled dimensions
        const scaledWidth = Math.min(photo.width || 300, 300);
        const scaledHeight = (photo.height || 200) * (scaledWidth / (photo.width || 300));

        // Check if any other pins are still pinning this photo
        const isStillPinned = state.pins.some(otherPin =>
          otherPin.id !== id && // Not the current pin
          otherPin.albumId === photo.albumId && // Same album
          isPointInRotatedRect(
            { x: otherPin.x, y: otherPin.y },
            {
              x: photo.position.x + scaledWidth / 2,  // Center X
              y: photo.position.y + scaledHeight / 2, // Center Y
              width: scaledWidth,
              height: scaledHeight,
              rotation: photo.rotation,
            }
          )
        );

        if (!isStillPinned) {
          newPinnedPhotoIds.delete(photo.id);
        }
      });

      // Add newly pinned photos
      photos.forEach(photo => {
        if (photo.albumId === pin.albumId) {
          // Calculate scaled dimensions
          const scaledWidth = Math.min(photo.width || 300, 300);
          const scaledHeight = (photo.height || 200) * (scaledWidth / (photo.width || 300));

          const photoRect = {
            x: photo.position.x + scaledWidth / 2,  // Center X
            y: photo.position.y + scaledHeight / 2, // Center Y
            width: scaledWidth,
            height: scaledHeight,
            rotation: photo.rotation,
          };

          if (isPointInRotatedRect({ x: pin.x, y: pin.y }, photoRect)) {
            newPinnedPhotoIds.add(photo.id);
          }
        }
      });

      return {
        pins: newPins,
        pinnedPhotoIds: newPinnedPhotoIds
      };
    }),

  getPinsForAlbum: (albumId) => {
    return get().pins.filter(pin => pin.albumId === albumId);
  },

  updatePinnedPhotos: (photos, albumId) =>
    set((state) => {
      const newPinnedPhotoIds = new Set<string>();
      const albumPins = state.pins.filter(pin => pin.albumId === albumId);

      // Check each photo against each pin in the same album
      photos.forEach((photo) => {
        // Calculate scaled dimensions
        const scaledWidth = Math.min(photo.width || 300, 300);
        const scaledHeight = (photo.height || 200) * (scaledWidth / (photo.width || 300));

        const photoRect = {
          x: photo.position.x + scaledWidth / 2,  // Center X
          y: photo.position.y + scaledHeight / 2, // Center Y
          width: scaledWidth,
          height: scaledHeight,
          rotation: photo.rotation,
        };

        // If any pin is within this photo's bounds, mark it as pinned
        albumPins.forEach((pin) => {
          if (isPointInRotatedRect({ x: pin.x, y: pin.y }, photoRect)) {
            newPinnedPhotoIds.add(photo.id);
          }
        });
      });

      // Only update if there's an actual change
      const currentIds = Array.from(state.pinnedPhotoIds).sort().join(',');
      const newIds = Array.from(newPinnedPhotoIds).sort().join(',');

      if (currentIds !== newIds) {
        return { pinnedPhotoIds: newPinnedPhotoIds };
      }

      return {};
    }),

  isPhotoPinned: (photoId) => get().pinnedPhotoIds.has(photoId),
})); 