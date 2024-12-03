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
  width: number;
  height: number;
  zIndex?: number;
  albumId?: string | null;
}

export interface Album {
  id: string;
  name: string;
  photoIds: string[];
  coverPhotoId?: string;
  color?: {
    base: string;
    binding: string;
  };
}

export interface PhotoStore {
  currentAlbumId: string | null;
  photos: Photo[];
  albums: Album[];
}