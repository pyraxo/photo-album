'use client';

import { useGesture } from '@use-gesture/react';
import { useSpring } from '@react-spring/three';
import { useRef } from 'react';
import * as THREE from 'three';

export function usePhotoDrag() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const [{ scale, rotation }, api] = useSpring(() => ({
    scale: 1,
    rotation: 0,
    config: { mass: 1, tension: 180, friction: 12 }
  }));

  const bind = useGesture({
    onDrag: ({ offset: [x, z], velocity }) => {
      if (meshRef.current) {
        meshRef.current.position.x = x;
        meshRef.current.position.z = z;
        api.start({
          rotation: velocity ? Math.sign(velocity[0]) * 0.5 : 0
        });
      }
    },
    onHover: ({ hovering }) => {
      api.start({
        scale: hovering ? 1.1 : 1
      });
    }
  });

  return { meshRef, bind, scale, rotation };
}