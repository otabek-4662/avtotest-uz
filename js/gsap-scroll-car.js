/**
 * AvtoTest UZ — GSAP ScrollTrigger & MotionPath Interactive Car & Speedometer Module
 * Creates a fixed background winding road, top-down animated car, and links scroll velocity to speedometer.
 */
(function() {
  window.GSAPScrollCar = {
    carTween: null,
    scrollTriggerInstance: null,
    decayTween: null,
    currentSpeed: 0,

    init() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof MotionPathPlugin === 'undefined') {
        console.warn('GSAP or required plugins (ScrollTrigger, MotionPathPlugin) are not loaded.');
        return;
      }

      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

      this.createContainer();
      this.initAnimation();
    },

    createContainer() {
      let container = document.getElementById('scroll-road-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'scroll-road-container';
        container.className = 'fixed inset-0 pointer-events-none z-[1] overflow-hidden transition-opacity duration-500';
        document.body.prepend(container);
      }

      container.innerHTML = `
        <svg id="scroll-road-svg" viewBox="0 0 1000 3000" preserveAspectRatio="xMidYMin slice" class="w-full h-full opacity-60">
          <defs>
            <linearGradient id="road-glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.8"/>
              <stop offset="50%" stop-color="#00FF85" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#FF9900" stop-opacity="0.8"/>
            </linearGradient>

            <filter id="road-glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Background Winding Road Path -->
          <path id="scroll-road-path" class="hidden md:block" d="
            M 850, 50 
            C 800, 400 200, 600 200, 950 
            C 200, 1300 850, 1500 850, 1850 
            C 850, 2200 250, 2400 250, 2700 
            C 250, 2850 500, 2950 500, 3000
          " fill="none" stroke="url(#road-glow-grad)" stroke-width="4" stroke-dasharray="12 8" stroke-linecap="round" filter="url(#road-glow)"/>

          <!-- 2D TOP-DOWN CAR SVG OBJECT -->
          <g id="scroll-car" style="transform-origin: center center;">
            <!-- Car Body Shadow -->
            <ellipse cx="0" cy="2" rx="18" ry="32" fill="#000" opacity="0.4" filter="url(#road-glow)"/>

            <!-- Car Chassis -->
            <rect x="-14" y="-28" width="28" height="56" rx="8" fill="#0F172A" stroke="#00F0FF" stroke-width="2" filter="url(#road-glow)"/>
            
            <!-- Windshield & Roof -->
            <path d="M-10,-12 C-8,-22 8,-22 10,-12 L8,10 C6,16 -6,16 -8,10 Z" fill="#1E293B" stroke="#00FF85" stroke-width="1.2"/>

            <!-- Front Headlights (Neon Cyan Beams) -->
            <circle cx="-9" cy="-26" r="2.5" fill="#00F0FF"/>
            <circle cx="9" cy="-26" r="2.5" fill="#00F0FF"/>
            
            <!-- Headlight Rays -->
            <polygon points="-12,-28 -25,-60 0,-65 -6,-28" fill="#00F0FF" opacity="0.25"/>
            <polygon points="12,-28 25,-60 0,-65 6,-28" fill="#00F0FF" opacity="0.25"/>

            <!-- Rear Taillights / Garage Brake Lights -->
            <g id="car-brake-lights">
              <rect class="brake-light-left" x="-11" y="25" width="6" height="2" rx="1" fill="#FF9900"/>
              <rect class="brake-light-right" x="5" y="25" width="6" height="2" rx="1" fill="#FF9900"/>
            </g>
          </g>
        </svg>
      `;
    },

    initAnimation() {
      const self = this;
      const roadPath = document.getElementById('scroll-road-path');
      const car = document.getElementById('scroll-car');

      if (!roadPath || !car) return;

      // Kill previous animation instance if exists
      if (this.carTween) this.carTween.kill();
      if (this.scrollTriggerInstance) this.scrollTriggerInstance.kill();

      // MotionPath + ScrollTrigger
      this.carTween = gsap.to(car, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (st) => {
            self.handleSpeedometerProgress(st.progress);

            // Garage stop & brake lights logic at footer (st.progress > 0.96)
            const brakeLights = document.querySelectorAll('#car-brake-lights rect');
            if (brakeLights.length > 0) {
              if (st.progress > 0.96) {
                brakeLights.forEach(el => {
                  el.style.fill = '#FF0055';
                  el.style.filter = 'drop-shadow(0 0 10px #FF0055)';
                });
              } else {
                brakeLights.forEach(el => {
                  el.style.fill = '#FF9900';
                  el.style.filter = 'none';
                });
              }
            }
          }
        },
        motionPath: {
          path: roadPath,
          align: roadPath,
          autoRotate: 90, // Align top of car (-90deg offset)
          alignOrigin: [0.5, 0.5]
        },
        ease: "none"
      });

      // Card Revelations (.tech-card fade-in & scale-up as car passes)
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
    },

    handleSpeedometerProgress(progress) {
      // Direct mapping based on original spec stages:
      // Stage 0 (0.00–0.15): Ignition -> 0 km/h
      // Stage 1 (0.15–0.45): Acceleration -> 0 to 120 km/h
      // Stage 2 (0.45–0.65): Steady Cruise -> 120 km/h
      // Stage 3 (0.65–0.85): Redline Cue -> 120 to 190 km/h
      // Stage 4 (0.85–1.00): Finish -> Decelerates 190 to 0 km/h
      
      let targetSpeed = 0;
      if (progress < 0.15) {
        targetSpeed = 0;
      } else if (progress < 0.45) {
        targetSpeed = Math.round(((progress - 0.15) / 0.30) * 120);
      } else if (progress < 0.65) {
        targetSpeed = 120;
      } else if (progress < 0.85) {
        targetSpeed = Math.round(120 + ((progress - 0.65) / 0.20) * 70);
      } else {
        targetSpeed = Math.round(190 * (1 - (progress - 0.85) / 0.15));
      }

      const needleEl = document.getElementById('speedometer-needle');
      const digitalSpeedEl = document.getElementById('digital-speed-val');

      // Update DOM directly without tweens for perfect deterministic behavior
      const spd = targetSpeed;
      // Map 0 - 240 km/h to angle -125deg to 95deg
      const angle = -125 + ((spd / 240) * 220);

      if (needleEl) {
        needleEl.style.transform = `rotate(${angle}deg)`;
      }
      if (digitalSpeedEl) {
        digitalSpeedEl.textContent = spd;
      }
    }
  };
})();
