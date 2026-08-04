import React from 'react';
import { createRoot } from 'react-dom/client';
import HeroScene from './components/hero3d/HeroScene';

// This function will be called by the Vanilla JS app to mount the 3D Hero
window.mountHero3D = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const root = createRoot(container);
  root.render(<HeroScene />);
  
  // Optional: return unmount function if the Vanilla JS router needs to cleanup
  return () => {
    root.unmount();
  };
};
