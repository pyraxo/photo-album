'use client';

import { Plane } from '@react-three/drei';

export function TableSurface() {
  return (
    <Plane
      args={[20, 20]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#4a5568"
        roughness={0.7}
        metalness={0.1}
      />
    </Plane>
  );
}