'use client';

import { useRef } from 'react';
import { animated } from '@react-spring/three';
import { Photo } from '@/types';
import { useTexture } from '@react-three/drei';

interface Page3DProps {
  pageNumber: number;
  photos: Photo[];
  isOpen: boolean;
  rotation: any;
}

export function Page3D({ pageNumber, photos, isOpen, rotation }: Page3DProps) {
  const meshRef = useRef(null);
  
  const textures = photos.map(photo => 
    useTexture(photo.url)
  );

  return (
    <animated.group
      position={[0, 0, 0.1 + pageNumber * 0.01]}
      rotation-y={rotation}
    >
      {textures.map((texture, index) => (
        <mesh
          key={index}
          position={[index === 0 ? -0.9 : 0.9, 0, 0]}
          scale={[0.8, 1.2, 0.01]}
        >
          <planeGeometry />
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={isOpen ? 1 : 0}
          />
        </mesh>
      ))}
    </animated.group>
  );
}