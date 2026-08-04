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

    // 3. Stage-specific speed profile calculation:
    // Stage 0 (0.00–0.15): Ignition -> 0 km/h
    // Stage 1 (0.15–0.45): Acceleration -> 0 to 120 km/h
    // Stage 2 (0.45–0.65): Sign Flyby -> Steady 120 km/h
    // Stage 3 (0.65–0.85): Redline Cue -> 120 to 190 km/h
    // Stage 4 (0.85–1.00): Finish -> Decelerates 190 to 0 km/h
    let calculatedSpeed = 0;
    if (progress < 0.15) {
      calculatedSpeed = Math.round((progress / 0.15) * 15);
    } else if (progress < 0.45) {
      calculatedSpeed = Math.round(15 + ((progress - 0.15) / 0.30) * 105);
    } else if (progress < 0.65) {
      calculatedSpeed = 120;
    } else if (progress < 0.85) {
      calculatedSpeed = Math.round(120 + ((progress - 0.65) / 0.20) * 70);
    } else {
      calculatedSpeed = Math.round(190 * (1 - (progress - 0.85) / 0.15));
    }

    if (onSpeedUpdate) onSpeedUpdate(calculatedSpeed);
  });

  return (
    <>
      <SceneLighting />
      <RoadPath />
      <SignFlyby />
      <group ref={carRef}>
        <CarRig />
      </group>
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
