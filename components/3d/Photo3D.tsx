'use client';

import { usePhotoDrag } from '@/lib/hooks/use-photo-drag';
import { Photo } from '@/types';
import { useTexture, Html } from '@react-three/drei';
import { animated } from '@react-spring/three';
import * as THREE from 'three';

interface Photo3DProps {
  photo: Photo;
  position: [number, number, number];
}

export function Photo3D({ photo, position }: Photo3DProps) {
  const { meshRef, bind, scale, rotation } = usePhotoDrag();
  const texture = useTexture(photo.url);

  return (
    <animated.mesh
      {...bind()}
      ref={meshRef}
      position={position}
      scale={scale}
      rotation-y={rotation}
      rotation-x={-Math.PI / 2}
      castShadow
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
      />
      {photo.caption && (
        <Html position={[0, -0.6, 0]} center transform>
          <div className="text-sm bg-white/80 px-2 py-1 rounded shadow-sm">
            {photo.caption}
          </div>
        </Html>
      )}
    </animated.mesh>
  );
}