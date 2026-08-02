import React from 'react';
import SpeedGauge from './SpeedGauge';

/**
 * HUDOverlay.jsx — DOM Layer for Precision Driving Dashboard Overlay
 * Renders glassmorphism panels, stage messages, and the SpeedGauge.
 */
export const HUDOverlay = ({ stageIndex = 0, speed = 0 }) => {
  const STAGE_TITLES = [
    { code: '01', title: 'IGNITION & INSTRUMENT CHECK', desc: 'AvtoTest UZ PDD Imtihon Portali — Barcha tizimlar ishga tushirildi' },
    { code: '02', title: 'ACCELERATION & TELEMETRY', desc: 'Tayyorgarlik moduli va 5000+ rasmiy YPX testlar bazasi' },
    { code: '03', title: 'ROAD-SIGN CATALOG MATCHING', desc: 'Yo’l belgilari va harakatlanish qoidalarining to’liq katalogi' },
    { code: '04', title: 'REDLINE & TIMER SIMULATION', desc: '20 daqiqalik nazorat taymeri va real imtihon simulyatsiyasi' },
    { code: '05', title: 'EXAM FINISH — READY FOR TEST', desc: 'Imtihonni topshirishga tayyorsiz. Testni boshlang!' }
  ];

  const currentStage = STAGE_TITLES[stageIndex] || STAGE_TITLES[0];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
      {/* Top HUD Header */}
      <div className="flex items-center justify-between w-full">
        {/* Brand & System Status */}
        <div className="hud-panel p-4 flex items-center gap-3 pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-[var(--signal-blue)] animate-ping" />
          <div>
            <span className="tabular-mono text-xs font-bold block text-[var(--ink-bright)]">AVTOTEST UZ // HUD-3D</span>
            <span className="text-[10px] text-[var(--ink-fog)] uppercase tracking-wider">Precision Exam Deck</span>
          </div>
        </div>

        {/* Dynamic Stage Message Panel */}
        <div className="hidden sm:flex hud-panel p-4 flex-col text-right pointer-events-auto transition-all duration-500 max-w-sm">
          <span className="tabular-mono text-xs font-bold text-[var(--signal-blue-glow)]">
            STAGE {currentStage.code} // {currentStage.title}
          </span>
          <span className="text-[11px] text-[var(--ink-fog)] mt-0.5">
            {currentStage.desc}
          </span>
        </div>
      </div>

      {/* Center / Bottom HUD Overlay Elements */}
      <div className="flex flex-col sm:flex-row items-end justify-between w-full gap-6">
        {/* Speedometer Gauge Widget */}
        <div className="pointer-events-auto">
          <SpeedGauge speed={speed} stageIndex={stageIndex} />
        </div>

        {/* Action Button & Stage Hint */}
        <div className="hud-panel p-6 flex flex-col items-start sm:items-end gap-3 pointer-events-auto max-w-md w-full sm:w-auto">
          <span className="tabular-mono text-xs text-[var(--caution-amber)] font-bold">
            {stageIndex === 4 ? '🏁 MARRAGA ETILDINGIZ' : '👇 SCROLL QILING (TELEMETRIYA)'}
          </span>
          <p className="text-xs text-[var(--ink-fog)] sm:text-right">
            Haydovchilik guvohnomasi imtihoniga professional tayyorgarlik platformasi.
          </p>
          <button
            onClick={() => window.switchTab && window.switchTab('test')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg pointer-events-auto"
            style={{
              background: 'var(--signal-blue)',
              color: '#FFF',
              boxShadow: '0 0 15px var(--signal-blue-glow)'
            }}
          >
            Imtihon Testini Boshlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default HUDOverlay;
