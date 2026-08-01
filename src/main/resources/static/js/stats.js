(function() {
  window.StatsModule = {
    init(containerEl) {
      this.container = containerEl;
      this.render();
    },

    clearHistory() {
      if (confirm("Haqiqatdan ham barcha imtihon natijalaringiz tarixini o'chirmoqchimisiz?")) {
        window.StorageManager.clearHistory();
        this.render();
      }
    },

    render() {
      const summary = window.StorageManager.getStatsSummary();
      const history = window.StorageManager.getHistory();

      let html = `
        <div class="fade-in max-w-5xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-3">
              STATISTIKA & TAHLIL
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">Sizning Imtihon Statistikangiz</h2>
            <p class="muted-text max-w-xl">
              Ishlangan barcha PDD testlar va erishilgan natijalaringiz dinamikasi (LocalStorage).
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">Jami Testlar</span>
              <span class="text-2xl font-mono font-extrabold text-[#E8EAED]">${summary.totalTests} ta</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">O'rtacha Ball</span>
              <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${summary.averageScore} <span class="text-xs font-normal text-[#9AA0A6]">/ 20</span></span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">Muvaffaqiyat</span>
              <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${summary.passRate}%</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">Eng Yuqori Ball</span>
              <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${summary.bestScore} <span class="text-xs font-normal text-[#9AA0A6]">/ 20</span></span>
            </div>
          </div>

          <div class="tech-card p-6">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 class="text-lg font-bold text-[#E8EAED] font-heading mb-0.5">Oxirgi Imtihonlar Tarixi</h3>
                <p class="text-xs text-[#9AA0A6]">So'nggi ishlangan 50 ta test ro'yxati</p>
              </div>
              ${history.length > 0 ? `
                <button onclick="window.clearUserStatsHistory()" class="btn-secondary text-xs py-1.5 px-3 text-[#EB5757]">
                  Tarixni tozalash
                </button>
              ` : ''}
            </div>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border);color:var(--text-muted)">
                      <th class="py-3 px-4 font-mono font-semibold">Sana</th>
                      <th class="py-3 px-4 font-mono font-semibold">Bilet</th>
                      <th class="py-3 px-4 font-mono font-semibold">Natija</th>
                      <th class="py-3 px-4 font-mono font-semibold">Vaqt</th>
                      <th class="py-3 px-4 font-mono font-semibold">Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${history.slice(0, 10).map(item => {
                      const dateStr = new Date(item.date).toLocaleDateString('uz-UZ') + ' ' + new Date(item.date).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'});
                      const mins = Math.floor(item.timeSpent / 60);
                      const secs = item.timeSpent % 60;
                      return `
                        <tr style="border-bottom:1px solid var(--border)">
                          <td class="py-3 px-4 font-mono" style="color:var(--text)">${dateStr}</td>
                          <td class="py-3 px-4 font-mono font-bold" style="color:var(--primary)">${item.ticketId === 'Random' ? 'Tasodifiy' : 'Bilet #' + item.ticketId}</td>
                          <td class="py-3 px-4 font-mono font-bold" style="color:var(--text)">${item.score} / ${item.totalQuestions}</td>
                          <td class="py-3 px-4 font-mono" style="color:var(--text-muted)">${mins}m ${secs}s</td>
                          <td class="py-3 px-4">
                            <span class="px-2 py-0.5 rounded font-mono font-bold" style="background:${item.passed ? 'rgba(242,201,76,0.15)' : 'rgba(235,87,87,0.15)'};color:${item.passed ? 'var(--primary)' : 'var(--danger)'};border:1px solid ${item.passed ? 'var(--primary)' : 'var(--danger)'}">
                              ${item.passed ? 'O\'TDI' : 'YIQILDI'}
                            </span>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      `;

      this.container.innerHTML = html;
    }
  };
})();
