export interface Photo {
  id: string;
  url: string;
  caption: string;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
}

export interface Album {
  id: string;
  name: string;
  photoIds: string[];
  coverPhotoId?: string;
}