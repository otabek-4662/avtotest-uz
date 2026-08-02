import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStory } from '../../hooks/useScrollStory';
import HUDOverlay from '../hud/HUDOverlay';
import StaticHeroPoster from './StaticHeroPoster';

import CarRig from './CarRig';
import RoadPath, { roadCurve } from './RoadPath';
import SignFlyby from './SignFlyby';
import SceneLighting from './SceneLighting';

/**
 * AnimatedSceneContent — Inner R3F component reading progressRef on every frame
 */
const AnimatedSceneContent = ({ progressRef, onSpeedUpdate }) => {
  const carRef = useRef();

  useFrame((state) => {
    const progress = progressRef.current || 0;

    // 1. Calculate point on curve for car position
    const point = roadCurve.getPointAt(progress);
    const tangent = roadCurve.getTangentAt(progress);

    if (carRef.current) {
      carRef.current.position.copy(point);

      // Orient car along curve tangent
      const lookAtPos = point.clone().add(tangent);
      carRef.current.lookAt(lookAtPos);
    }

    // 2. Camera follows car with smooth offset
    const camOffset = new THREE.Vector3(0, 3, 7);
    const targetCamPos = point.clone().add(camOffset);
    state.camera.position.lerp(targetCamPos, 0.1);
    state.camera.lookAt(point.x, point.y + 0.5, point.z - 5);

    // 3. Emit calculated speed for Speedometer HUD (0 to 220 km/h)
    const currentSpeed = Math.round(progress * 220);
    if (onSpeedUpdate) onSpeedUpdate(currentSpeed);
  });

  return (
    <>
      <SceneLighting />
      <RoadPath />
      <SignFlyby />
      <g ref={carRef}>
        <CarRig />
      </g>
    </>
  );
};

/**
 * HeroScene.jsx — Master 3D Hero Animation Component
 * Lazy-loads 3D layer with fallback to StaticHeroPoster for mobile & reduced motion.
 */
export const HeroScene = () => {
  const heroRef = useRef(null);
  const { progressRef, stageIndex } = useScrollStory(heroRef);
  const [speed, setSpeed] = useState(0);
  const [isLiteMode, setIsLiteMode] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion and screen width < 768px
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) {
      setIsLiteMode(true);
    }
  }, []);

  if (isLiteMode) {
    return <StaticHeroPoster />;
  }

  return (
    <div ref={heroRef} className="relative w-full h-screen bg-[var(--asphalt-night)] overflow-hidden">
      {/* 2D HUD Glass Overlay Layer */}
      <HUDOverlay stageIndex={stageIndex} speed={speed} />

      {/* 3D WebGL Canvas Layer */}
      <Suspense fallback={<StaticHeroPoster />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 3, 7], fov: 60 }}
          className="w-full h-full"
          style={{ pointerEvents: 'none' }}
        >
          <AnimatedSceneContent progressRef={progressRef} onSpeedUpdate={setSpeed} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroScene;
