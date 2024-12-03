import { create } from 'zustand';
import { Photo, Album } from '@/types';

interface PhotoStore {
  photos: Photo[];
  albums: Album[];
  currentAlbumId: string | null;
  highestZ: number;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  addAlbum: (album: Album) => void;
  updateAlbum: (id: string, updates: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
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
  deletePhoto: (id) =>
    set((state) => ({
      photos: state.photos.filter((photo) => photo.id !== id),
      albums: state.albums.map((album) => ({
        ...album,
        photoIds: album.photoIds.filter((photoId) => photoId !== id),
        coverPhotoId: album.coverPhotoId === id ? undefined : album.coverPhotoId,
      })),
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
  updateAlbum: (id, updates) =>
    set((state) => ({
      albums: state.albums.map((album) =>
        album.id === id ? { ...album, ...updates } : album
      ),
    })),
  deleteAlbum: (id) =>
    set((state) => ({
      albums: state.albums.filter((album) => album.id !== id),
      photos: state.photos.filter((photo) => photo.albumId !== id),
      currentAlbumId: state.currentAlbumId === id ? null : state.currentAlbumId,
    })),
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
}))