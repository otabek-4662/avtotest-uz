import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CarRig.jsx — Stylized 3D Car Constructed from Three.js Primitives
 * Built from BoxGeometry chassis/roof & CylinderGeometry wheels.
 * Emissive edges in --signal-blue-glow & --alert-red for brake lights.
 */
export const CarRig = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const carGroupRef = useRef();

  useFrame((state, delta) => {
    if (carGroupRef.current) {
      // Subtle float suspension micro-animation
      carGroupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 4) * 0.03;
    }
  });

  return (
    <group ref={carGroupRef} position={position} rotation={rotation}>
      {/* Main Body Chassis (Lower Box) */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.6, 3.6]} />
        <meshStandardMaterial color="#0B0E16" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wireframe Emissive Outline for Chassis */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.82, 0.62, 3.62]} />
        <meshBasicMaterial color="#1E7FFF" wireframe opacity={0.6} transparent />
      </mesh>

      {/* Car Roof & Cockpit (Upper Box) */}
      <mesh position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.4, 0.5, 1.8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front Headlights (Emissive Cyan Spot Beams) */}
      <mesh position={[-0.6, 0.4, -1.81]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#5BA8FF" />
      </mesh>
      <mesh position={[0.6, 0.4, -1.81]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#5BA8FF" />
      </mesh>

      {/* Rear Taillights (Emissive Red Brake Lights) */}
      <mesh position={[-0.6, 0.4, 1.81]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshBasicMaterial color="#FF3B30" />
      </mesh>
      <mesh position={[0.6, 0.4, 1.81]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshBasicMaterial color="#FF3B30" />
      </mesh>

      {/* 4 Wheels (Cylinders) */}
      {[
        [-0.95, 0.25, -1.1],
        [0.95, 0.25, -1.1],
        [-0.95, 0.25, 1.1],
        [0.95, 0.25, 1.1]
      ].map((wheelPos, idx) => (
        <mesh key={idx} position={wheelPos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
          <meshStandardMaterial color="#171C24" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export default CarRig;
