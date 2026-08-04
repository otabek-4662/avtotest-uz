/**
 * AvtoTest UZ — Futuristic Anime.js SVG Car & Speedometer Animation Module
 * Styled inspired by animejs.com (Cyberpunk Neon Cyan, Emerald, Orange & Dark Theme)
 */
(function() {
  window.FuturisticCar = {
    init(containerId = 'futuristic-car-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = this.getSVGMarkup();
      this.initAnimeJS();
      this.initMouseTilt(container);
    },

    getSVGMarkup() {
      return `
        <div id="futuristic-card-wrapper" class="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center p-4 select-none perspective-1000">
          
          <!-- Background Glow Effect -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00F0FF]/10 via-[#00FF85]/10 to-[#FF9900]/10 blur-3xl opacity-60 animate-pulse pointer-events-none"></div>

          <svg id="futuristic-svg" viewBox="0 0 500 500" class="w-full h-full drop-shadow-[0_0_25px_rgba(0,240,255,0.35)] relative z-10 transition-transform duration-200 ease-out" style="transform-style: preserve-3d;">
            
            <defs>
              <!-- Neon Cyan Glow -->
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Neon Emerald Glow -->
              <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Neon Orange Glow -->
              <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Linear Gradients -->
              <linearGradient id="cyan-to-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00F0FF" />
                <stop offset="100%" stop-color="#00FF85" />
              </linearGradient>

              <linearGradient id="needle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FF9900" />
                <stop offset="100%" stop-color="#FF0055" />
              </linearGradient>
            </defs>

            <!-- OUTER FRAME & ROTATING DIALS -->
            <g id="outer-dials" transform="translate(250, 250)">
              <!-- Outer Dashed Ring (Clockwise) -->
              <circle class="ring-cw" r="230" fill="none" stroke="#00F0FF" stroke-width="1.5" stroke-dasharray="8 12 2 12" stroke-opacity="0.4" filter="url(#glow-cyan)"/>
              
              <!-- Outer Tech Ring (Counter-Clockwise) -->
              <circle class="ring-ccw" r="215" fill="none" stroke="#00FF85" stroke-width="2" stroke-dasharray="40 10 90 10 20 10" stroke-opacity="0.6" filter="url(#glow-emerald)"/>

              <!-- Outer Hexagon Frame -->
              <polygon points="0,-205 177,-102 177,102 0,205 -177,102 -177,-102" fill="none" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.25" stroke-dasharray="15 5"/>

              <!-- Outer Orbiting Particle Dots -->
              <circle class="ring-cw" cx="0" cy="-230" r="4" fill="#00F0FF" filter="url(#glow-cyan)"/>
              <circle class="ring-ccw" cx="215" cy="0" r="4.5" fill="#00FF85" filter="url(#glow-emerald)"/>
            </g>

            <!-- SPEEDOMETER SCALE ARC & TICKS -->
            <g id="speedometer-arc" transform="translate(250, 250)">
              <!-- Background Arc -->
              <path class="draw-line" d="M -160,90 A 180,180 0 1,1 160,90" fill="none" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>
              
              <!-- Active Neon Arc -->
              <path class="draw-line-neon" d="M -160,90 A 180,180 0 1,1 160,90" fill="none" stroke="url(#cyan-to-emerald)" stroke-width="4" stroke-linecap="round" stroke-dasharray="750" filter="url(#glow-cyan)"/>

              <!-- Ticks & Numbers -->
              <g stroke="#00F0FF" stroke-width="2" stroke-opacity="0.7">
                <line x1="-150" y1="84" x2="-135" y2="75" />
                <line x1="-165" y1="20" x2="-148" y2="18" />
                <line x1="-140" y1="-50" x2="-125" y2="-45" />
                <line x1="-85" y1="-125" x2="-76" y2="-112" />
                <line x1="0" y1="-155" x2="0" y2="-138" stroke="#FF9900" stroke-width="3"/>
                <line x1="85" y1="-125" x2="76" y2="-112" stroke="#FF9900"/>
                <line x1="140" y1="-50" x2="125" y2="-45" stroke="#FF0055" stroke-width="3"/>
                <line x1="165" y1="20" x2="148" y2="18" stroke="#FF0055"/>
                <line x1="150" y1="84" x2="135" y2="75" stroke="#FF0055"/>
              </g>

              <!-- Speed Text Marks -->
              <text x="-120" y="70" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#00F0FF" text-anchor="middle">0</text>
              <text x="-125" y="-30" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#00F0FF" text-anchor="middle">60</text>
              <text x="0" y="-120" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="14" fill="#FF9900" text-anchor="middle">120</text>
              <text x="125" y="-30" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#FF0055" text-anchor="middle">180</text>
              <text x="120" y="70" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#FF0055" text-anchor="middle">240</text>
            </g>

            <!-- FUTURISTIC CAR SILHOUETTE (CENTER TOP-DOWN VIEW) -->
            <g id="futuristic-car-body" transform="translate(250, 240) scale(0.95)">
              
              <!-- Car Outer Glow Chassis -->
              <path class="car-contour" d="
                M 0,-110 
                C 15,-110 25,-95 32,-70 
                C 38,-45 42,-20 42,10 
                C 42,40 38,70 32,95 
                C 25,110 15,115 0,115 
                C -15,115 -25,110 -32,95 
                C -38,70 -42,40 -42,10 
                C -42,-20 -38,-45 -32,-70 
                C -25,-95 -15,-110 0,-110 Z" 
                fill="#0F172A" stroke="#00F0FF" stroke-width="2.5" stroke-dasharray="600" filter="url(#glow-cyan)"/>

              <!-- Roof & Windshield Contour -->
              <path class="car-contour-inner" d="
                M 0,-50 
                C 15,-50 22,-35 24,-15 
                C 25,5 24,25 22,40 
                C 18,50 10,55 0,55 
                C -10,55 -18,50 -22,40 
                C -24,25 -25,5 -24,-15 
                C -22,-35 -15,-50 0,-50 Z" 
                fill="#1E293B" stroke="#00FF85" stroke-width="1.8" stroke-dasharray="300" filter="url(#glow-emerald)"/>

              <!-- Front Headlights (Neon Cyan Beams) -->
              <polygon points="-28,-95 -18,-102 -15,-90 -25,-85" fill="#00F0FF" filter="url(#glow-cyan)"/>
              <polygon points="28,-95 18,-102 15,-90 25,-85" fill="#00F0FF" filter="url(#glow-cyan)"/>

              <!-- Light Rays (Front) -->
              <polygon points="-25,-98 -45,-150 0,-160 -15,-92" fill="url(#cyan-to-emerald)" opacity="0.25"/>
              <polygon points="25,-98 45,-150 0,-160 15,-92" fill="url(#cyan-to-emerald)" opacity="0.25"/>

              <!-- Rear Taillights (Neon Red/Orange) -->
              <rect x="-30" y="98" width="15" height="4" rx="2" fill="#FF9900" filter="url(#glow-orange)"/>
              <rect x="15" y="98" width="15" height="4" rx="2" fill="#FF9900" filter="url(#glow-orange)"/>

              <!-- Wheels / Side Air Intake Ticks -->
              <rect x="-46" y="-70" width="6" height="30" rx="3" fill="#00F0FF" opacity="0.7"/>
              <rect x="40" y="-70" width="6" height="30" rx="3" fill="#00F0FF" opacity="0.7"/>
              <rect x="-46" y="45" width="6" height="30" rx="3" fill="#00FF85" opacity="0.7"/>
              <rect x="40" y="45" width="6" height="30" rx="3" fill="#00FF85" opacity="0.7"/>

              <!-- Central Cyber Core Circle -->
              <circle cx="0" cy="0" r="14" fill="#090D16" stroke="#FF9900" stroke-width="2" filter="url(#glow-orange)"/>
              <circle cx="0" cy="0" r="6" fill="#FF9900" class="animate-ping" opacity="0.8"/>
            </g>

            <!-- SPEEDOMETER NEEDLE (DYNAMIC ACCELERATION STROKE) -->
            <g id="speedometer-needle-group" transform="translate(250, 250)">
              <!-- Needle Base Cap -->
              <circle cx="0" cy="0" r="18" fill="#0F172A" stroke="#00F0FF" stroke-width="2"/>
              <circle cx="0" cy="0" r="8" fill="#FF9900" filter="url(#glow-orange)"/>

              <!-- Rotating Needle Pivot -->
              <g id="speedometer-needle" style="transform-origin: 0px 0px;">
                <!-- Needle Arrow Line -->
                <polygon points="-3,0 0,-165 3,0" fill="url(#needle-grad)" filter="url(#glow-orange)"/>
                <circle cx="0" cy="-165" r="3" fill="#FFF" />
              </g>
            </g>

            <!-- DIGITAL SPEED DISPLAY READOUT -->
            <g transform="translate(250, 375)">
              <rect x="-70" y="-22" width="140" height="44" rx="12" fill="#0B0F14" stroke="#00F0FF" stroke-width="1.5" stroke-opacity="0.5" filter="url(#glow-cyan)"/>
              <text id="digital-speed-val" x="-10" y="8" font-family="'Space Grotesk', monospace" font-weight="800" font-size="28" fill="#00F0FF" text-anchor="end">0</text>
              <text x="10" y="4" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#00FF85" text-anchor="start">KM/H</text>
            </g>

          </svg>
        </div>
      `;
    },

    initAnimeJS() {
      if (typeof anime === 'undefined') {
        console.warn('Anime.js library is not loaded');
        return;
      }

      // 1. Path Drawing (Chiziqlar uzluksiz chizilib yonib turishi)
      anime({
        targets: '#futuristic-svg .car-contour, #futuristic-svg .car-contour-inner',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 3500,
        delay: anime.stagger(400),
        loop: true,
        direction: 'alternate'
      });

      anime({
        targets: '#futuristic-svg .draw-line-neon',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutCubic',
        duration: 4000,
        loop: true,
        direction: 'alternate'
      });

      // 2. Rotating Dials (Aylanuvchi Soat va Qarama-qarshi Soat Halqalari)
      anime({
        targets: '#futuristic-svg .ring-cw',
        rotate: '360deg',
        easing: 'linear',
        duration: 16000,
        loop: true
      });

      anime({
        targets: '#futuristic-svg .ring-ccw',
        rotate: '-360deg',
        easing: 'linear',
        duration: 22000,
        loop: true
      });

      // 3. Speedometer Needle Sweep (0 km/h -> 220 km/h Dynamic revving effect)
      const speedValEl = document.getElementById('digital-speed-val');

      const needleTimeline = anime.timeline({
        loop: true,
        direction: 'alternate'
      });

      needleTimeline
        .add({
          targets: '#speedometer-needle',
          rotate: [-125, 95],
          duration: 3200,
          easing: 'easeInOutQuart',
          update: (anim) => {
            if (speedValEl) {
              const progress = Math.round((anim.progress / 100) * 220);
              speedValEl.textContent = progress;
            }
          }
        })
        .add({
          targets: '#speedometer-needle',
          rotate: [95, 40],
          duration: 1200,
          easing: 'easeOutElastic(1, .6)',
          update: (anim) => {
            if (speedValEl) {
              const currentRotate = 95 - ((anim.progress / 100) * 55);
              const progress = Math.round(((currentRotate + 125) / 220) * 220);
              speedValEl.textContent = Math.max(0, progress);
            }
          }
        })
        .add({
          targets: '#speedometer-needle',
          rotate: [40, 115],
          duration: 2000,
          easing: 'easeInOutExpo',
          update: (anim) => {
            if (speedValEl) {
              const currentRotate = 40 + ((anim.progress / 100) * 75);
              const progress = Math.round(((currentRotate + 125) / 220) * 220);
              speedValEl.textContent = Math.min(240, progress);
            }
          }
        });

      // 4. Car Chassis Pulsating Core
      anime({
        targets: '#futuristic-car-body',
        scale: [0.95, 1.02],
        translateY: [0, -4],
        easing: 'easeInOutSine',
        duration: 2000,
        loop: true,
        direction: 'alternate'
      });
    },

    initMouseTilt(container) {
      const svg = document.getElementById('futuristic-svg');
      if (!svg || !container) return;

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - (rect.width / 2);
        const y = e.clientY - rect.top - (rect.height / 2);

        const rotateX = (-y / rect.height) * 30; // Max 30deg tilt
        const rotateY = (x / rect.width) * 30;

        svg.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
      });

      container.addEventListener('mouseleave', () => {
        svg.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    }
  };
})();
