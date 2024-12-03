import { create } from 'zustand';
import { Photo, Album } from '@/types';

interface PhotoStore {
  photos: Photo[];
  albums: Album[];
  currentAlbumId: string | null;
  highestZ: number;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  addAlbum: (album: Album) => void;
  addPhotoToAlbum: (photoId: string, albumId: string) => void;
  bringToFront: (id: string) => void;
  setCurrentAlbum: (albumId: string | null) => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  albums: [],
  currentAlbumId: null,
  highestZ: 0,
  addPhoto: (photo) =>
    set((state) => ({
      photos: [...state.photos, { ...photo, albumId: state.currentAlbumId }],
      highestZ: state.highestZ + 1
    })),
  updatePhoto: (id, updates) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, ...updates } : photo
      ),
    })),
  bringToFront: (id) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, zIndex: state.highestZ + 1 } : photo
      ),
      highestZ: state.highestZ + 1
    })),
  addAlbum: (album) =>
    set((state) => ({ albums: [...state.albums, album] })),
  addPhotoToAlbum: (photoId, albumId) =>
    set((state) => ({
      albums: state.albums.map((album) =>
        album.id === albumId
          ? { ...album, photoIds: [...album.photoIds, photoId] }
          : album
      ),
      photos: state.photos.map((photo) =>
        photo.id === photoId ? { ...photo, albumId } : photo
      ),
    })),
  setCurrentAlbum: (albumId) =>
    set({ currentAlbumId: albumId }),
}));