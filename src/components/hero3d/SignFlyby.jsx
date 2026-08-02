import React from 'react';

/**
 * SignFlyby.jsx — Stage 2 Road Sign Silhouette Props Drifting Past Camera
 * Represents Mandatory, Warning, and Prohibition sign silhouettes along the road curve.
 */
export const SignFlyby = () => {
  return (
    <group>
      {/* Sign 1: Mandatory Blue Circle Sign */}
      <group position={[6, 1.5, -45]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#1E7FFF" />
        </mesh>
      </group>

      {/* Sign 2: Warning Amber Triangle Sign */}
      <group position={[-7, 1.5, -85]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.1, 3]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#FFB020" />
        </mesh>
      </group>

      {/* Sign 3: Prohibition Red Circle Sign */}
      <group position={[6, 1.5, -125]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#FF3B30" />
        </mesh>
      </group>
    </group>
  );
};

export default SignFlyby;
