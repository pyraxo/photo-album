export interface Photo {
  id: string;
  url: string;
  caption: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  scale: number;
  zIndex?: number;
  albumId?: string | null;
}

export interface Album {
  id: string;
  name: string;
  photoIds: string[];
  coverPhotoId?: string;
}

export interface PhotoStore {
  currentAlbumId: string | null;
  photos: Photo[];
  albums: Album[];
}