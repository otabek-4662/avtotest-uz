import React from 'react';

/**
 * SpeedGauge.jsx — Precision Instrument Speedometer Gauge
 * Features 240° SVG arc and tabular monospace digit readout.
 */
export const SpeedGauge = ({ speed = 0, stageIndex = 0 }) => {
  // Arc math: 240 deg arc from -210deg to 30deg
  const maxSpeed = 220;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speed));
  const fillRatio = clampedSpeed / maxSpeed;
  const dashoffset = 750 * (1 - fillRatio);

  // Dynamic alert color based on Stage 3 Redline Cue
  const isRedline = stageIndex === 3 || speed > 180;
  const isCaution = stageIndex === 2 || (speed > 120 && speed <= 180);

  const strokeColor = isRedline ? 'var(--alert-red)' : isCaution ? 'var(--caution-amber)' : 'var(--signal-blue-glow)';

  return (
    <div className="relative flex flex-col items-center justify-center p-6 hud-panel glow-signal min-w-[280px]">
      {/* SVG Arc Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
          {/* Background Track Arc */}
          <path
            d="M 50,150 A 100,100 0 1,1 250,150"
            fill="none"
            stroke="var(--panel-border)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Active Glowing Progress Arc */}
          <path
            d="M 50,150 A 100,100 0 1,1 250,150"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="750"
            strokeDashoffset={dashoffset}
            className="transition-all duration-300 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
          />
        </svg>

        {/* Center Digital Speed Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="tabular-mono text-5xl font-extrabold tracking-tight transition-colors duration-200"
            style={{ color: strokeColor }}
          >
            {Math.round(clampedSpeed)}
          </span>
          <span className="tabular-mono text-xs font-semibold uppercase tracking-widest text-[var(--ink-fog)] mt-1">
            KM / H
          </span>
        </div>
      </div>

      {/* Stage Badge & Precision Ticks */}
      <div className="flex items-center justify-between w-full mt-2 pt-3 border-t border-[var(--panel-border)] text-[10px] font-mono text-[var(--ink-fog)]">
        <span>MODE: HUD_PRECISION</span>
        <span className="font-bold uppercase" style={{ color: strokeColor }}>
          STAGE 0{stageIndex + 1}
        </span>
      </div>
    </div>
  );
};

export default SpeedGauge;
