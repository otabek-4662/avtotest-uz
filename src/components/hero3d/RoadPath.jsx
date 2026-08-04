import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * RoadPath.jsx — 3D Extruded Tube / Ribbon Road along CatmullRomCurve3
 */
export const roadCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(12, -2, -40),
  new THREE.Vector3(-15, -4, -80),
  new THREE.Vector3(10, -6, -120),
  new THREE.Vector3(0, -8, -160)
]);

export const RoadPath = () => {
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(roadCurve, 120, 2.5, 8, false);
  }, []);

  return (
    <group>
      {/* Asphalt Tube Surface (Flattened into a road) */}
      <mesh geometry={tubeGeometry} scale={[1, 0.05, 1]}>
        <meshStandardMaterial color="#0B0E16" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Emissive Center Lane Marking Strip (Flattened and slightly raised) */}
      <mesh scale={[1, 0.05, 1]} position={[0, 0.1, 0]}>
        <tubeGeometry args={[roadCurve, 120, 0.15, 4, false]} />
        <meshBasicMaterial color="#00F0FF" opacity={0.8} transparent />
      </mesh>

      {/* Stage 4 Minimal Finish Line Strip */}
      <group position={[0, -7.5, -144]} rotation={[0.05, 0, 0]}>
        <mesh>
          <planeGeometry args={[5, 0.6]} />
          <meshBasicMaterial color="#F5F7FA" opacity={0.8} transparent />
        </mesh>
      </group>
    </group>
  );
};

export default RoadPath;
