import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

/**
 * ScrollCarBackground.jsx — GSAP ScrollTrigger + MotionPath Interactive Car & Road Component
 * Features: Fixed background SVG road, Top-down 2D car auto-rotation along path,
 * scroll velocity mapping to Speedometer, card reveal on pass, garage stop & brake lights at footer.
 */
export const ScrollCarBackground = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const carRef = useRef(null);
  const brakeLightsRef = useRef(null);
  const currentSpeedRef = useRef(0);
  const decayTweenRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    if (!pathRef.current || !carRef.current) return;

    // Handle speedometer velocity reaction
    const handleVelocitySpeedometer = (velocity) => {
      let targetSpeed = Math.min(220, Math.round((velocity / 3000) * 220));
      if (targetSpeed < 10 && velocity > 50) targetSpeed = 25;

      const needleEl = document.getElementById('speedometer-needle');
      const digitalSpeedEl = document.getElementById('digital-speed-val');

      if (decayTweenRef.current) decayTweenRef.current.kill();

      decayTweenRef.current = gsap.to(currentSpeedRef, {
        current: targetSpeed,
        duration: targetSpeed > currentSpeedRef.current ? 0.3 : 1.2,
        ease: targetSpeed > currentSpeedRef.current ? 'power1.out' : 'power2.out',
        onUpdate: () => {
          const spd = Math.round(currentSpeedRef.current);
          const angle = -125 + ((spd / 240) * 220);

          if (needleEl) needleEl.style.transform = `rotate(${angle}deg)`;
          if (digitalSpeedEl) digitalSpeedEl.textContent = spd;
        }
      });
    };

    // 1. Car MotionPath along Fixed Road
    const carTween = gsap.to(carRef.current, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (st) => {
          const velocity = Math.abs(st.getVelocity());
          handleVelocitySpeedometer(velocity);

          // Garage stop & brake lights logic at footer (st.progress > 0.96)
          if (brakeLightsRef.current) {
            if (st.progress > 0.96) {
              brakeLightsRef.current.style.fill = '#FF0055';
              brakeLightsRef.current.style.filter = 'drop-shadow(0 0 10px #FF0055)';
            } else {
              brakeLightsRef.current.style.fill = '#FF9900';
              brakeLightsRef.current.style.filter = 'none';
            }
          }
        }
      },
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        autoRotate: 90,
        alignOrigin: [0.5, 0.5]
      },
      ease: 'none'
    });

    // 2. Card Revelations (.tech-card fade-in & scale-up as car passes)
    const cards = document.querySelectorAll('.tech-card, .radial-stat-box');
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0.7, scale: 0.97, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      carTween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="scroll-road-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500"
      style={{ willChange: 'transform' }}
    >
      <svg
        id="scroll-road-svg"
        viewBox="0 0 1000 3000"
        preserveAspectRatio="xMidYMin slice"
        className="w-full h-full opacity-60"
      >
        <defs>
          <linearGradient id="road-glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00FF85" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF9900" stopOpacity="0.8" />
          </linearGradient>

          <filter id="road-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Winding Road Path */}
        <path
          ref={pathRef}
          id="scroll-road-path"
          d="M 850, 50 C 800, 400 200, 600 200, 950 C 200, 1300 850, 1500 850, 1850 C 850, 2200 250, 2400 250, 2700 C 250, 2850 500, 2950 500, 3000"
          fill="none"
          stroke="url(#road-glow-grad)"
          strokeWidth="4"
          strokeDasharray="12 8"
          strokeLinecap="round"
          filter="url(#road-glow)"
        />

        {/* 2D Top-Down Car Object */}
        <g ref={carRef} id="scroll-car" style={{ transformOrigin: 'center center', willChange: 'transform' }}>
          <ellipse cx="0" cy="2" rx="18" ry="32" fill="#000" opacity="0.4" filter="url(#road-glow)" />
          <rect x="-14" y="-28" width="28" height="56" rx="8" fill="#0F172A" stroke="#00F0FF" strokeWidth="2" filter="url(#road-glow)" />
          <path d="M-10,-12 C-8,-22 8,-22 10,-12 L8,10 C6,16 -6,16 -8,10 Z" fill="#1E293B" stroke="#00FF85" strokeWidth="1.2" />

          {/* Front Headlights */}
          <circle cx="-9" cy="-26" r="2.5" fill="#00F0FF" />
          <circle cx="9" cy="-26" r="2.5" fill="#00F0FF" />
          <polygon points="-12,-28 -25,-60 0,-65 -6,-28" fill="#00F0FF" opacity="0.25" />
          <polygon points="12,-28 25,-60 0,-65 6,-28" fill="#00F0FF" opacity="0.25" />

          {/* Rear Taillights / Garage Brake Lights */}
          <g ref={brakeLightsRef}>
            <rect x="-11" y="25" width="6" height="2" rx="1" fill="#FF9900" />
            <rect x="5" y="25" width="6" height="2" rx="1" fill="#FF9900" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ScrollCarBackground;
