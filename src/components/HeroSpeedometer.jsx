import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

/**
 * HeroSpeedometer.jsx — Anime.js Futuristic SVG Speedometer Component
 * Neon Colors: #00F0FF (Cyan), #00FF85 (Emerald), #FF9900 (Orange), #FF0055 (Red Accent)
 * Features: Continuous strokeDashoffset, rotating dials, particle dots, 3D mouse tilt & glow pulse.
 */
export const HeroSpeedometer = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const needleRef = useRef(null);
  const speedValRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 1. Path Drawing (Continuous strokeDashoffset)
    anime({
      targets: svgRef.current.querySelectorAll('.car-contour, .car-contour-inner'),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 3500,
      delay: anime.stagger(400),
      loop: true,
      direction: 'alternate'
    });

    anime({
      targets: svgRef.current.querySelectorAll('.draw-line-neon'),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutCubic',
      duration: 4000,
      loop: true,
      direction: 'alternate'
    });

    // 2. Rotating Dials & Particle Dots
    anime({
      targets: svgRef.current.querySelectorAll('.ring-cw'),
      rotate: '360deg',
      easing: 'linear',
      duration: 16000,
      loop: true
    });

    anime({
      targets: svgRef.current.querySelectorAll('.ring-ccw'),
      rotate: '-360deg',
      easing: 'linear',
      duration: 22000,
      loop: true
    });

    // 3. Dynamic Revving Speedometer Needle & Counter
    const needleTimeline = anime.timeline({
      loop: true,
      direction: 'alternate'
    });

    needleTimeline
      .add({
        targets: needleRef.current,
        rotate: [-125, 95],
        duration: 3200,
        easing: 'easeInOutQuart',
        update: (anim) => {
          if (speedValRef.current) {
            const progress = Math.round((anim.progress / 100) * 220);
            speedValRef.current.textContent = progress;
          }
        }
      })
      .add({
        targets: needleRef.current,
        rotate: [95, 40],
        duration: 1200,
        easing: 'easeOutElastic(1, .6)',
        update: (anim) => {
          if (speedValRef.current) {
            const currentRotate = 95 - ((anim.progress / 100) * 55);
            const progress = Math.round(((currentRotate + 125) / 220) * 220);
            speedValRef.current.textContent = Math.max(0, progress);
          }
        }
      })
      .add({
        targets: needleRef.current,
        rotate: [40, 115],
        duration: 2000,
        easing: 'easeInOutExpo',
        update: (anim) => {
          if (speedValRef.current) {
            const currentRotate = 40 + ((anim.progress / 100) * 75);
            const progress = Math.round(((currentRotate + 125) / 220) * 220);
            speedValRef.current.textContent = Math.min(240, progress);
          }
        }
      });

    // 4. Car Core Pulsating Animation
    anime({
      targets: svgRef.current.querySelector('#futuristic-car-body'),
      scale: [0.95, 1.02],
      translateY: [0, -4],
      easing: 'easeInOutSine',
      duration: 2000,
      loop: true,
      direction: 'alternate'
    });

    // 5. 3D Mouse Parallax Listener
    const handleMouseMove = (e) => {
      if (!containerRef.current || !svgRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / rect.height) * 25;
      const rotateY = (x / rect.width) * 25;

      svgRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0,0,0) scale3d(1.04, 1.04, 1.04)`;
    };

    const handleMouseLeave = () => {
      if (svgRef.current) {
        svgRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0) scale3d(1, 1, 1)`;
      }
    };

    const containerEl = containerRef.current;
    containerEl?.addEventListener('mousemove', handleMouseMove);
    containerEl?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      containerEl?.removeEventListener('mousemove', handleMouseMove);
      containerEl?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center p-4 select-none perspective-1000"
      style={{ willChange: 'transform' }}
    >
      {/* Background Neon Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00F0FF]/15 via-[#00FF85]/15 to-[#FF9900]/15 blur-3xl opacity-60 animate-pulse pointer-events-none" />

      <svg
        ref={svgRef}
        id="futuristic-svg"
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(0,240,255,0.35)] relative z-10 transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <defs>
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="cyan-to-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#00FF85" />
          </linearGradient>

          <linearGradient id="needle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9900" />
            <stop offset="100%" stopColor="#FF0055" />
          </linearGradient>
        </defs>

        {/* Outer Frame Dials */}
        <g transform="translate(250, 250)">
          <circle className="ring-cw" r="230" fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="8 12 2 12" strokeOpacity="0.4" filter="url(#glow-cyan)" />
          <circle className="ring-ccw" r="215" fill="none" stroke="#00FF85" strokeWidth="2" strokeDasharray="40 10 90 10 20 10" strokeOpacity="0.6" filter="url(#glow-emerald)" />
          <polygon points="0,-205 177,-102 177,102 0,205 -177,102 -177,-102" fill="none" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="15 5" />
          <circle className="ring-cw" cx="0" cy="-230" r="4" fill="#00F0FF" filter="url(#glow-cyan)" />
          <circle className="ring-ccw" cx="215" cy="0" r="4.5" fill="#00FF85" filter="url(#glow-emerald)" />
        </g>

        {/* Speedometer Arc & Ticks */}
        <g transform="translate(250, 250)">
          <path className="draw-line" d="M -160,90 A 180,180 0 1,1 160,90" fill="none" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
          <path className="draw-line-neon" d="M -160,90 A 180,180 0 1,1 160,90" fill="none" stroke="url(#cyan-to-emerald)" strokeWidth="4" strokeLinecap="round" strokeDasharray="750" filter="url(#glow-cyan)" />

          <g stroke="#00F0FF" strokeWidth="2" strokeOpacity="0.7">
            <line x1="-150" y1="84" x2="-135" y2="75" />
            <line x1="-165" y1="20" x2="-148" y2="18" />
            <line x1="-140" y1="-50" x2="-125" y2="-45" />
            <line x1="-85" y1="-125" x2="-76" y2="-112" />
            <line x1="0" y1="-155" x2="0" y2="-138" stroke="#FF9900" strokeWidth="3" />
            <line x1="85" y1="-125" x2="76" y2="-112" stroke="#FF9900" />
            <line x1="140" y1="-50" x2="125" y2="-45" stroke="#FF0055" strokeWidth="3" />
            <line x1="165" y1="20" x2="148" y2="18" stroke="#FF0055" />
            <line x1="150" y1="84" x2="135" y2="75" stroke="#FF0055" />
          </g>

          <text x="-120" y="70" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="12" fill="#00F0FF" textAnchor="middle">0</text>
          <text x="-125" y="-30" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="12" fill="#00F0FF" textAnchor="middle">60</text>
          <text x="0" y="-120" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="14" fill="#FF9900" textAnchor="middle">120</text>
          <text x="125" y="-30" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="12" fill="#FF0055" textAnchor="middle">180</text>
          <text x="120" y="70" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="12" fill="#FF0055" textAnchor="middle">240</text>
        </g>

        {/* Futuristic Top-Down Car Silhouette */}
        <g id="futuristic-car-body" transform="translate(250, 240) scale(0.95)">
          <path
            className="car-contour"
            d="M 0,-110 C 15,-110 25,-95 32,-70 C 38,-45 42,-20 42,10 C 42,40 38,70 32,95 C 25,110 15,115 0,115 C -15,115 -25,110 -32,95 C -38,70 -42,40 -42,10 C -42,-20 -38,-45 -32,-70 C -25,-95 -15,-110 0,-110 Z"
            fill="#0F172A"
            stroke="#00F0FF"
            strokeWidth="2.5"
            strokeDasharray="600"
            filter="url(#glow-cyan)"
          />
          <path
            className="car-contour-inner"
            d="M 0,-50 C 15,-50 22,-35 24,-15 C 25,5 24,25 22,40 C 18,50 10,55 0,55 C -10,55 -18,50 -22,40 C -24,25 -25,5 -24,-15 C -22,-35 -15,-50 0,-50 Z"
            fill="#1E293B"
            stroke="#00FF85"
            strokeWidth="1.8"
            strokeDasharray="300"
            filter="url(#glow-emerald)"
          />

          <polygon points="-28,-95 -18,-102 -15,-90 -25,-85" fill="#00F0FF" filter="url(#glow-cyan)" />
          <polygon points="28,-95 18,-102 15,-90 25,-85" fill="#00F0FF" filter="url(#glow-cyan)" />

          <polygon points="-25,-98 -45,-150 0,-160 -15,-92" fill="url(#cyan-to-emerald)" opacity="0.25" />
          <polygon points="25,-98 45,-150 0,-160 15,-92" fill="url(#cyan-to-emerald)" opacity="0.25" />

          <rect x="-30" y="98" width="15" height="4" rx="2" fill="#FF9900" filter="url(#glow-orange)" />
          <rect x="15" y="98" width="15" height="4" rx="2" fill="#FF9900" filter="url(#glow-orange)" />

          <circle cx="0" cy="0" r="14" fill="#090D16" stroke="#FF9900" strokeWidth="2" filter="url(#glow-orange)" />
          <circle cx="0" cy="0" r="6" fill="#FF9900" className="animate-ping" opacity="0.8" />
        </g>

        {/* Speedometer Needle */}
        <g transform="translate(250, 250)">
          <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#00F0FF" strokeWidth="2" />
          <circle cx="0" cy="0" r="8" fill="#FF9900" filter="url(#glow-orange)" />
          <g ref={needleRef} id="speedometer-needle" style={{ transformOrigin: '0px 0px' }}>
            <polygon points="-3,0 0,-165 3,0" fill="url(#needle-grad)" filter="url(#glow-orange)" />
            <circle cx="0" cy="-165" r="3" fill="#FFF" />
          </g>
        </g>

        {/* Digital Readout */}
        <g transform="translate(250, 375)">
          <rect x="-70" y="-22" width="140" height="44" rx="12" fill="#0B0F14" stroke="#00F0FF" strokeWidth="1.5" strokeOpacity="0.5" filter="url(#glow-cyan)" />
          <text ref={speedValRef} id="digital-speed-val" x="-10" y="8" fontFamily="'Space Grotesk', monospace" fontWeight="800" fontSize="28" fill="#00F0FF" textAnchor="end">0</text>
          <text x="10" y="4" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="12" fill="#00FF85" textAnchor="start">KM/H</text>
        </g>
      </svg>
    </div>
  );
};

export default HeroSpeedometer;
