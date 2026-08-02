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
      // ✅ Null-safety: StorageManager mavjud bo'lmasa yoki xatolik bo'lsa fallback ishlatiladi
      let summary, history;
      try {
        summary = (window.StorageManager && typeof window.StorageManager.getStatsSummary === 'function')
          ? window.StorageManager.getStatsSummary()
          : null;
        history = (window.StorageManager && typeof window.StorageManager.getHistory === 'function')
          ? window.StorageManager.getHistory()
          : null;
      } catch (e) {
        console.error('[StatsModule] StorageManager xatoligi:', e);
        summary = null;
        history = null;
      }

      // ✅ Data yo'q yoki null bo'lsa — "Ma'lumot topilmadi" xabari
      if (summary === null || history === null) {
        this.container.innerHTML = `
          <div class="fade-in max-w-5xl mx-auto py-4">
            <div class="tech-card p-12 text-center max-w-md mx-auto">
              <div class="w-14 h-14 mx-auto rounded-full bg-[#171C24] border border-[#242B36] flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-[#9AA0A6]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h4 class="text-base font-bold text-[#E8EAED] mb-2 font-heading">Ma'lumot topilmadi</h4>
              <p class="text-xs text-[#9AA0A6]">Statistika ma'lumotlari yuklanmadi. Sahifani yangilang yoki keyinroq urinib ko'ring.</p>
            </div>
          </div>
        `;
        return;
      }

      // ✅ Safe defaults: agar summary yoki history empty bo'lsa
      const safeSummary = {
        totalTests: summary.totalTests ?? 0,
        averageScore: summary.averageScore ?? 0,
        passRate: summary.passRate ?? 0,
        bestScore: summary.bestScore ?? 0,
      };
      const safeHistory = Array.isArray(history) ? history : [];

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
              <span class="text-2xl font-mono font-extrabold text-[#E8EAED]">${safeSummary.totalTests} ta</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">O'rtacha Ball</span>
              <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${safeSummary.averageScore} <span class="text-xs font-normal text-[#9AA0A6]">/ 20</span></span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">Muvaffaqiyat</span>
              <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${safeSummary.passRate}%</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-bold text-sm mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <span class="text-xs text-[#9AA0A6] block mb-1">Eng Yuqori Ball</span>
              <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${safeSummary.bestScore} <span class="text-xs font-normal text-[#9AA0A6]">/ 20</span></span>
            </div>
          </div>

          <div class="tech-card p-6">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 class="text-lg font-bold text-[#E8EAED] font-heading mb-0.5">Oxirgi Imtihonlar Tarixi</h3>
                <p class="text-xs text-[#9AA0A6]">So'nggi ishlangan 50 ta test ro'yxati</p>
              </div>
              ${safeHistory.length > 0 ? `
                <button onclick="window.clearUserStatsHistory()" class="btn-secondary text-xs py-1.5 px-3 text-[#EB5757]">
                  Tarixni tozalash
                </button>
              ` : ''}
            </div>
      `;

      let userObj = null;
      try {
          userObj = JSON.parse(localStorage.getItem('avtotest_user'));
      } catch(e) {}
      
      if (userObj && userObj.isPro && safeHistory.length > 0) {
          html += `
          <div class="tech-card p-6 mb-6">
            <h3 class="text-lg font-bold text-[#E8EAED] font-heading mb-4">📈 O'sish Dinamikasi (PRO)</h3>
            <div class="w-full h-64 relative">
                <canvas id="statsChart"></canvas>
            </div>
          </div>
          `;
      } else if (!userObj || !userObj.isPro) {
          html += `
          <div class="tech-card p-6 mb-6 flex flex-col items-center justify-center text-center bg-gradient-to-r from-[rgba(242,201,76,0.05)] to-transparent border-[#F2C94C]/20">
            <h3 class="text-lg font-bold text-[#F2C94C] font-heading mb-2">📈 O'sish Dinamikasi Grafiklari</h3>
            <p class="text-sm text-[#9AA0A6] mb-3">Imtihon natijalaringizni chuqur tahlil qilish uchun PRO obunani faollashtiring.</p>
            <button onclick="window.openAuthModal('login')" class="btn-primary text-xs py-2 px-4 shadow-[0_0_10px_rgba(242,201,76,0.2)]">PRO Obuna Olish</button>
          </div>
          `;
      }

      if (safeHistory.length === 0) {
        html += `
          <div class="py-12 text-center">
            <div class="w-12 h-12 mx-auto rounded-full bg-[#171C24] text-[#9AA0A6] flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
            </div>
            <h4 class="text-base font-bold text-[#E8EAED] mb-1 font-heading">Tarix hali bo'sh</h4>
            <p class="text-xs text-[#9AA0A6] mb-4">Siz hali birorta ham test ishlamadingiz.</p>
            <button onclick="window.switchTab('test')" class="btn-primary text-xs">
              <span>Hozir Testni Boshlash →</span>
            </button>
          </div>
        `;
      } else {
        html += `
          <div class="space-y-3">
        `;

        safeHistory.forEach(item => {
          const dateStr = new Date(item.date).toLocaleDateString('uz-UZ', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });
          const mins = Math.floor(item.timeSpent / 60);
          const secs = item.timeSpent % 60;

          html += `
            <div class="p-4 rounded-md bg-[#0B0F14] border border-[#242B36] flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-[#171C24] border border-[#242B36] ${item.passed ? 'text-[#F2C94C]' : 'text-[#EB5757]'} flex items-center justify-center font-bold text-xs">
                  ${item.passed ? '✓' : '✕'}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-[#E8EAED] font-heading">${item.ticketId === 'Random' ? 'Tasodifiy Test' : 'Bilet #' + item.ticketId}</span>
                    <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded ${item.passed ? 'bg-[#171C24] text-[#F2C94C] border border-[#242B36]' : 'bg-[#171C24] text-[#EB5757] border border-[#242B36]'}">
                      ${item.passed ? "IMTIHONDAN O'TDI" : "O'TOLMADI"}
                    </span>
                  </div>
                  <span class="text-xs text-[#9AA0A6]">${dateStr} • ${mins} daqiqa ${secs} soniya</span>
                </div>
              </div>

              <div class="text-right">
                <span class="text-base font-mono font-extrabold ${item.passed ? 'text-[#F2C94C]' : 'text-[#EB5757]'}">${item.score} / ${item.totalQuestions}</span>
                <span class="text-xs text-[#9AA0A6] block">${Math.round((item.score/item.totalQuestions)*100)}% ball</span>
              </div>
            </div>
          `;
        });

        html += `
          </div>
        `;
      }

      html += `
          </div>
        </div>
      `;

      this.container.innerHTML = html;
      
      // Render Chart for PRO users
      // ✅ userObj yuqorida e'lon qilingan, qayta e'lon qilmasdan ishlatiladi
      userObj = null;
      try {
          userObj = JSON.parse(localStorage.getItem('avtotest_user'));
      } catch(e) {}
      
      if (userObj && userObj.isPro && safeHistory.length > 0) {
          this.renderChart(safeHistory);
      }
    },
    
    renderChart(history) {
        const chartCanvas = document.getElementById('statsChart');
        if (!chartCanvas || typeof Chart === 'undefined') return;
        
        // Reverse history to show oldest to newest on X axis
        const chartData = [...history].reverse().slice(0, 10); // Last 10 attempts
        
        const labels = chartData.map(item => {
            const date = new Date(item.date);
            return `${date.getDate()}.${date.getMonth()+1} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        });
        const data = chartData.map(item => item.score);
        
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Test Natijasi (20 dan)',
                    data: data,
                    borderColor: '#F2C94C',
                    backgroundColor: 'rgba(242, 201, 76, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#0B0F14',
                    pointBorderColor: '#F2C94C',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#9AA0A6' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9AA0A6' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
  };
})();
