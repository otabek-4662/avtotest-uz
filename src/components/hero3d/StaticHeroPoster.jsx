import React from 'react';

/**
 * StaticHeroPoster.jsx — Fallback Hero Component
 * Used for Suspense loading, prefers-reduced-motion, and mobile screens (< 768px).
 * Provides clean SVG/CSS speedometer without 3D WebGL overhead.
 */
export const StaticHeroPoster = () => {
  return (
    <div className="relative w-full min-h-[600px] flex items-center justify-center p-6 bg-[var(--asphalt-night)] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--signal-blue)]/10 via-[var(--caution-amber)]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Text */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium hud-panel border border-[var(--panel-border)] text-[var(--signal-blue-glow)]">
            <span className="w-2 h-2 rounded-full bg-[var(--signal-blue)] animate-pulse" />
            O'ZBEKISTON PDD 2026 STANDARTI
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-[var(--ink-bright)] leading-tight">
            Haydovchilik Imtihoniga <span className="text-[var(--signal-blue-glow)]">Professional</span> Tayyorgarlik
          </h1>

          <p className="text-sm text-[var(--ink-fog)] leading-relaxed">
            Rasmiy YPX PDD imtihon biletlari, yo'l belgilari katalogi, qoidalar nazariyasi hamda MJtK jarimalari bo'yicha yagona platforma.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => window.switchTab && window.switchTab('test')}
              className="px-6 py-3.5 rounded-xl text-xs font-bold text-white tracking-wider uppercase shadow-lg transition-all"
              style={{ background: 'var(--signal-blue)', boxShadow: '0 0 20px var(--signal-blue-glow)' }}
            >
              Imtihon Testini Boshlash
            </button>
          </div>
        </div>

        {/* Right Lightweight Speedometer SVG */}
        <div className="flex justify-center items-center">
          <div className="hud-panel p-8 glow-signal rounded-3xl relative w-full max-w-sm flex flex-col items-center justify-center text-center">
            <svg viewBox="0 0 200 200" className="w-48 h-48">
              <path d="M 30,140 A 70,70 0 1,1 170,140" fill="none" stroke="var(--panel-border)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 30,140 A 70,70 0 1,1 170,140" fill="none" stroke="var(--signal-blue-glow)" strokeWidth="6" strokeDasharray="440" strokeDashoffset="120" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tabular-mono text-5xl font-extrabold text-[var(--signal-blue-glow)]">120</span>
              <span className="tabular-mono text-xs text-[var(--ink-fog)] font-bold mt-1">KM / H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticHeroPoster;
