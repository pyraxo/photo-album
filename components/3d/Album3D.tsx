'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Group } from 'three';
import { Album } from '@/types';
import { Page3D } from './Page3D';
import { usePhotoStore } from '@/lib/store';

interface Album3DProps {
  album: Album;
  position: [number, number, number];
}

export function Album3D({ album, position }: Album3DProps) {
  const groupRef = useRef<Group>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const photos = usePhotoStore((state) => state.photos);

  const { rotation } = useSpring({
    rotation: isOpen ? Math.PI : 0,
    config: { mass: 1, tension: 180, friction: 12 },
  });

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const albumPhotos = photos.filter((photo) => 
    album.photoIds.includes(photo.id)
  );

  const pagesCount = Math.ceil(albumPhotos.length / 2);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      onClick={() => setIsOpen(!isOpen)}
    >
      <mesh position={[0, 0, 0.1]} scale={[2, 3, 0.2]}>
        <boxGeometry />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {Array.from({ length: pagesCount }).map((_, index) => (
        <Page3D
          key={index}
          pageNumber={index}
          photos={albumPhotos.slice(index * 2, index * 2 + 2)}
          isOpen={isOpen && currentPage === index}
          rotation={rotation}
        />
      ))}
    </animated.group>
  );
}