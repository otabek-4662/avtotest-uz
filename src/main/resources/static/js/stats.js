(function() {
  window.StatsModule = {
    init(containerEl) {
      this.container = containerEl;
      this.render();
    },

    clearHistory() {
      if (confirm("Haqiqatdan ham barcha imtihon natijalaringiz tarixini o'chirmoqchimisiz?")) {
        if (window.StorageManager && typeof window.StorageManager.clearHistory === 'function') {
          window.StorageManager.clearHistory();
        }
        this.render();
      }
    },

    render() {
      let stats = [];
      let safeSummary = {
        totalTests: 0,
        averageScore: 0,
        passRate: 0,
        bestScore: 0
      };

      try {
        if (window.StorageManager) {
          const historyData = window.StorageManager.getHistory();
          if (Array.isArray(historyData)) {
            stats = historyData;
          }
          const summaryData = window.StorageManager.getStatsSummary();
          if (summaryData) {
            safeSummary = {
              totalTests: summaryData.totalTests || 0,
              averageScore: summaryData.averageScore || 0,
              passRate: summaryData.passRate || 0,
              bestScore: summaryData.bestScore || 0
            };
          }
        }
      } catch (e) {
        console.error('[StatsModule] StorageManager error:', e);
      }

      // ✅ 1-VAZIFA: Empty State (If no tests completed)
      if (stats.length === 0) {
        this.container.innerHTML = `
          <div class="fade-in max-w-4xl mx-auto py-12 px-4 text-center">
            <div class="tech-card p-8 sm:p-12 max-w-lg mx-auto space-y-6 border border-[#242B36] shadow-2xl relative overflow-hidden" style="background:var(--surface,#11161D);">
              <div class="w-20 h-20 rounded-2xl bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mx-auto shadow-inner">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-bold font-heading text-[#E8EAED]">Statistika hali mavjud emas</h3>
                <p class="text-xs sm:text-sm text-[#9AA0A6] leading-relaxed max-w-md mx-auto">
                  Siz hali biror marta test ishlamagansiz. Natijalar va tahlillar ko'rinishi uchun test yechishni boshlang!
                </p>
              </div>

              <div class="pt-2">
                <button onclick="window.switchTab('test')" class="btn-primary py-3 px-8 text-xs font-bold inline-flex items-center gap-2">
                  <span>Testni boshlash</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>
          </div>
        `;
        return;
      }

      // Build Stats View when history exists
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-6 space-y-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-mono font-bold text-[#F2C94C] uppercase tracking-wider block mb-1">STATISTIKA & TAHLIL</span>
              <h2 class="text-2xl font-extrabold font-heading text-[#E8EAED]">Sizning Imtihon Statistikangiz</h2>
            </div>
            <button onclick="window.StatsModule.clearHistory()" class="btn-secondary text-xs py-2 px-4 text-[#EB5757] border-[#EB5757]/40 hover:bg-[#EB5757]/10">
              Tarixni Tozalash
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="tech-card p-5 border border-[#242B36]">
              <span class="text-xs text-[#9AA0A6] block mb-1">Jami Testlar</span>
              <span class="text-2xl font-mono font-bold text-[#E8EAED]">${safeSummary.totalTests} ta</span>
            </div>
            <div class="tech-card p-5 border border-[#242B36]">
              <span class="text-xs text-[#9AA0A6] block mb-1">O'rtacha Ball</span>
              <span class="text-2xl font-mono font-bold text-[#F2C94C]">${safeSummary.averageScore} / 20</span>
            </div>
            <div class="tech-card p-5 border border-[#242B36]">
              <span class="text-xs text-[#9AA0A6] block mb-1">O'tish Ko'rsatkichi</span>
              <span class="text-2xl font-mono font-bold text-[#27AE60]">${safeSummary.passRate}%</span>
            </div>
            <div class="tech-card p-5 border border-[#242B36]">
              <span class="text-xs text-[#9AA0A6] block mb-1">Eng Yuqori Ball</span>
              <span class="text-2xl font-mono font-bold text-[#2D9CDB]">${safeSummary.bestScore} / 20</span>
            </div>
          </div>

          <div class="tech-card p-6 border border-[#242B36] space-y-4">
            <h3 class="text-lg font-bold font-heading text-[#E8EAED]">Oxirgi Imtihonlar Tarixi</h3>
            <div class="space-y-3">
              ${stats.map(item => `
                <div class="p-4 rounded-lg bg-[#0B0F14] border border-[#242B36] flex items-center justify-between flex-wrap gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${item.passed ? 'bg-[#27AE60]/20 text-[#27AE60] border border-[#27AE60]/40' : 'bg-[#EB5757]/20 text-[#EB5757] border border-[#EB5757]/40'}">
                      ${item.passed ? '✓' : '✕'}
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-[#E8EAED]">${item.ticketId === 'Random' ? 'Tasodifiy Test' : 'Bilet #' + item.ticketId}</h4>
                      <span class="text-xs text-[#9AA0A6]">${new Date(item.date).toLocaleDateString('uz-UZ')}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-mono font-bold ${item.passed ? 'text-[#27AE60]' : 'text-[#EB5757]'}">${item.score} / ${item.totalQuestions || 20}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      this.container.innerHTML = html;
    }
  };

  window.clearUserStatsHistory = () => window.StatsModule.clearHistory();
})();
