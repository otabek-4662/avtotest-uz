import React from 'react';

/**
 * SceneLighting.jsx — Performance-conscious lighting for 3D Hero Scene
 * Uses 1 HemisphereLight fill + 1 DirectionalLight + 1 Headlight SpotLight.
 */
export const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <hemisphereLight skyColor="#1E7FFF" groundColor="#0B0E16" intensity={0.6} />
      <directionalLight position={[10, 20, 15]} intensity={1.2} color="#F5F7FA" />
      {/* Car Headlights Spotlight */}
      <spotLight
        position={[0, 3, 5]}
        target-position={[0, 0, -20]}
        angle={0.5}
        penumbra={0.8}
        intensity={2.5}
        color="#5BA8FF"
      />
    </>
  );
};

export default SceneLighting;
