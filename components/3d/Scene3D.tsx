'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { usePhotoStore } from '@/lib/store';
import { TableSurface } from './TableSurface';
import { Photo3D } from './Photo3D';
import { Album3D } from './Album3D';
import { Suspense } from 'react';

export function Scene3D() {
  const { photos, albums } = usePhotoStore();

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 5, 5]} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 4}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      <Environment preset="sunset" />
      <TableSurface />

      <Suspense fallback={null}>
        {photos.map((photo, index) => (
          <Photo3D
            key={photo.id}
            photo={photo}
            position={[
              (index - photos.length / 2) * 1.2,
              0,
              0
            ]}
          />
        ))}

        {albums.map((album, index) => (
          <Album3D
            key={album.id}
            album={album}
            position={[
              (index - albums.length / 2) * 2.5,
              0,
              -3
            ]}
          />
        ))}
      </Suspense>
    </Canvas>
  );
}