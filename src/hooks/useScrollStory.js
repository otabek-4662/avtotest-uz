import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useScrollStory.js — Custom Hook for 3D Hero Scroll-Driven Storytelling
 * Pins the hero container for 400vh and derives:
 * - progressRef (0..1) read inside R3F useFrame() without React re-renders.
 * - stageIndex (0..4) state for cheap React HUD DOM updates.
 */
export const useScrollStory = (triggerRef) => {
  const progressRef = useRef(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const element = triggerRef.current;
    if (!element) return;

    const st = ScrollTrigger.create({
      trigger: element,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: '+=400%',
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        // Stage mapping: 0: Ignition, 1: Acceleration, 2: Sign Flyby, 3: Redline, 4: Finish
        let currentStage = 0;
        if (p >= 0.85) currentStage = 4;
        else if (p >= 0.65) currentStage = 3;
        else if (p >= 0.45) currentStage = 2;
        else if (p >= 0.15) currentStage = 1;
        else currentStage = 0;

        setStageIndex((prev) => (prev !== currentStage ? currentStage : prev));
      }
    });

    return () => {
      st.kill();
    };
  }, [triggerRef]);

  return { progressRef, stageIndex };
};

export default useScrollStory;
