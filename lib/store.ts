import { create } from 'zustand';
import { Photo, Album } from '@/types';

interface PhotoStore {
  photos: Photo[];
  albums: Album[];
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  addAlbum: (album: Album) => void;
  addPhotoToAlbum: (photoId: string, albumId: string) => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  albums: [],
  addPhoto: (photo) =>
    set((state) => ({ photos: [...state.photos, photo] })),
  updatePhoto: (id, updates) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, ...updates } : photo
      ),
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
    })),
}));