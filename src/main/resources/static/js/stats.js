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
      // ✅ Null-safety: StorageManager mavjud bo'lmasa fallback
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

      // ✅ Data yuklanmasa — "Ma'lumot topilmadi" xabari
      if (summary === null || history === null) {
        this.container.innerHTML = `
          <div class="fade-in" style="max-width:64rem;margin:2rem auto">
            <div class="tech-card" style="padding:3rem;text-align:center;max-width:28rem;margin:0 auto">
              <div style="width:56px;height:56px;border-radius:50%;background:var(--surface-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
                <svg style="width:28px;height:28px;color:var(--text-muted)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h4 style="font-size:1rem;font-weight:700;color:var(--text);margin-bottom:0.5rem">Ma'lumot topilmadi</h4>
              <p style="font-size:0.75rem;color:var(--text-muted)">Statistika ma'lumotlari yuklanmadi. Sahifani yangilang yoki keyinroq urinib ko'ring.</p>
            </div>
          </div>
        `;
        return;
      }

      // ✅ Safe defaults
      const safeSummary = {
        totalTests:   summary.totalTests   ?? 0,
        averageScore: summary.averageScore ?? 0,
        passRate:     summary.passRate     ?? 0,
        bestScore:    summary.bestScore    ?? 0,
      };
      const safeHistory = Array.isArray(history) ? history : [];

      // ---- Build HTML ----
      let html = `
        <div class="fade-in" style="max-width:64rem;margin:0 auto;padding:1rem 0">

          <!-- Page Header -->
          <div style="margin-bottom:2rem">
            <span style="display:inline-flex;align-items:center;gap:8px;padding:4px 12px;border-radius:6px;font-size:11px;font-family:monospace;font-weight:600;background:var(--surface-2);color:var(--primary);border:1px solid var(--border);margin-bottom:12px">
              STATISTIKA &amp; TAHLIL
            </span>
            <h2 class="section-title" style="color:var(--text);margin-bottom:8px">Sizning Imtihon Statistikangiz</h2>
            <p class="muted-text" style="max-width:36rem">
              Ishlangan barcha PDD testlar va erishilgan natijalaringiz dinamikasi (LocalStorage).
            </p>
          </div>

          <!-- Stats Cards -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:20px;margin-bottom:2rem">
            <div class="tech-card" style="padding:1.5rem">
              <div style="width:40px;height:40px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:var(--primary);display:flex;align-items:center;justify-content:center;margin-bottom:12px">
                <svg style="width:20px;height:20px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <span style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Jami Testlar</span>
              <span style="font-size:1.5rem;font-family:monospace;font-weight:800;color:var(--text)">${safeSummary.totalTests} ta</span>
            </div>

            <div class="tech-card" style="padding:1.5rem">
              <div style="width:40px;height:40px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:var(--primary);display:flex;align-items:center;justify-content:center;margin-bottom:12px">
                <svg style="width:20px;height:20px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">O'rtacha Ball</span>
              <span style="font-size:1.5rem;font-family:monospace;font-weight:800;color:var(--primary)">${safeSummary.averageScore} <span style="font-size:11px;font-weight:400;color:var(--text-muted)">/ 20</span></span>
            </div>

            <div class="tech-card" style="padding:1.5rem">
              <div style="width:40px;height:40px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:var(--primary);display:flex;align-items:center;justify-content:center;margin-bottom:12px">
                <svg style="width:20px;height:20px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <span style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Muvaffaqiyat</span>
              <span style="font-size:1.5rem;font-family:monospace;font-weight:800;color:var(--primary)">${safeSummary.passRate}%</span>
            </div>

            <div class="tech-card" style="padding:1.5rem">
              <div style="width:40px;height:40px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);color:var(--primary);display:flex;align-items:center;justify-content:center;margin-bottom:12px">
                <svg style="width:20px;height:20px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <span style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Eng Yuqori Ball</span>
              <span style="font-size:1.5rem;font-family:monospace;font-weight:800;color:var(--primary)">${safeSummary.bestScore} <span style="font-size:11px;font-weight:400;color:var(--text-muted)">/ 20</span></span>
            </div>
          </div>

          <!-- History Card -->
          <div class="tech-card" style="padding:1.5rem">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
              <div>
                <h3 style="font-size:1.1rem;font-weight:700;color:var(--text);font-family:'Space Grotesk',sans-serif;margin:0 0 4px">Oxirgi Imtihonlar Tarixi</h3>
                <p style="font-size:11px;color:var(--text-muted);margin:0">So'nggi ishlangan 50 ta test ro'yxati</p>
              </div>
              ${safeHistory.length > 0 ? `
                <button onclick="window.clearUserStatsHistory()" class="btn-secondary" style="font-size:11px;padding:6px 12px;color:var(--danger)">
                  Tarixni tozalash
                </button>
              ` : ''}
            </div>
      `;

      // PRO chart block
      let userObj = null;
      try {
        userObj = JSON.parse(localStorage.getItem('avtotest_user'));
      } catch(e) {}

      if (userObj && userObj.isPro && safeHistory.length > 0) {
        html += `
          <div class="tech-card" style="padding:1.5rem;margin-bottom:1.5rem">
            <h3 style="font-size:1.1rem;font-weight:700;color:var(--text);font-family:'Space Grotesk',sans-serif;margin:0 0 1rem">📈 O'sish Dinamikasi (PRO)</h3>
            <div style="width:100%;height:256px;position:relative">
              <canvas id="statsChart"></canvas>
            </div>
          </div>
        `;
      } else if (!userObj || !userObj.isPro) {
        html += `
          <div class="tech-card" style="padding:1.5rem;margin-bottom:1.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(242,201,76,0.05),transparent);border-color:rgba(242,201,76,0.2)">
            <h3 style="font-size:1.1rem;font-weight:700;color:var(--primary);font-family:'Space Grotesk',sans-serif;margin:0 0 8px">📈 O'sish Dinamikasi Grafiklari</h3>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px">Imtihon natijalaringizni chuqur tahlil qilish uchun PRO obunani faollashtiring.</p>
            <button onclick="window.openAuthModal('login')" class="btn-primary" style="font-size:11px;padding:8px 16px">PRO Obuna Olish</button>
          </div>
        `;
      }

      // History list
      if (safeHistory.length === 0) {
        html += `
          <div style="padding:3rem 0;text-align:center">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--surface-2);color:var(--text-muted);display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
              <svg style="width:24px;height:24px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
            </div>
            <h4 style="font-size:1rem;font-weight:700;color:var(--text);margin:0 0 8px;font-family:'Space Grotesk',sans-serif">Tarix hali bo'sh</h4>
            <p style="font-size:11px;color:var(--text-muted);margin:0 0 16px">Siz hali birorta ham test ishlamadingiz.</p>
            <button onclick="window.switchTab('test')" class="btn-primary" style="font-size:11px">
              Hozir Testni Boshlash →
            </button>
          </div>
        `;
      } else {
        html += `<div style="display:flex;flex-direction:column;gap:12px">`;

        safeHistory.forEach(item => {
          const dateStr = new Date(item.date).toLocaleDateString('uz-UZ', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });
          const mins = Math.floor((item.timeSpent || 0) / 60);
          const secs = (item.timeSpent || 0) % 60;
          const pct  = item.totalQuestions ? Math.round((item.score / item.totalQuestions) * 100) : 0;

          html += `
            <div style="padding:16px;border-radius:8px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:32px;height:32px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);color:${item.passed ? 'var(--primary)' : 'var(--danger)'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px">
                  ${item.passed ? '✓' : '✕'}
                </div>
                <div>
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                    <span style="font-size:14px;font-weight:700;color:var(--text);font-family:'Space Grotesk',sans-serif">${item.ticketId === 'Random' ? 'Tasodifiy Test' : 'Bilet #' + item.ticketId}</span>
                    <span style="font-size:10px;font-family:monospace;font-weight:700;padding:2px 8px;border-radius:4px;background:var(--surface-2);color:${item.passed ? 'var(--primary)' : 'var(--danger)'};border:1px solid ${item.passed ? 'var(--primary)' : 'var(--danger)'}">
                      ${item.passed ? "IMTIHONDAN O'TDI" : "O'TOLMADI"}
                    </span>
                  </div>
                  <span style="font-size:11px;color:var(--text-muted)">${dateStr} • ${mins} daqiqa ${secs} soniya</span>
                </div>
              </div>
              <div style="text-align:right">
                <span style="font-size:1.1rem;font-family:monospace;font-weight:800;color:${item.passed ? 'var(--primary)' : 'var(--danger)'}">${item.score} / ${item.totalQuestions}</span>
                <span style="font-size:11px;color:var(--text-muted);display:block">${pct}% ball</span>
              </div>
            </div>
          `;
        });

        html += `</div>`;
      }

      html += `
          </div>
        </div>
      `;

      this.container.innerHTML = html;

      // ✅ Render chart for PRO users (re-check userObj after DOM insert)
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

      const chartData = [...history].reverse().slice(0, 10);
      const labels = chartData.map(item => {
        const d = new Date(item.date);
        return `${d.getDate()}.${d.getMonth()+1} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
      });
      const data = chartData.map(item => item.score);

      new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Test Natijasi (20 dan)',
            data,
            borderColor: '#F2C94C',
            backgroundColor: 'rgba(242,201,76,0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'var(--bg)',
            pointBorderColor: '#F2C94C',
            pointBorderWidth: 2,
            pointRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 20, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9AA0A6' } },
            x: { grid: { display: false }, ticks: { color: '#9AA0A6' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  };
})();
