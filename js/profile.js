(function() {
  window.ProfileModule = {
    init(container) {
      this.container = container;
      const userStr = localStorage.getItem('avtotest_user');
      if (!userStr) {
        this.container.innerHTML = `
          <div class="tech-card p-8 text-center mt-12">
            <h2 class="text-2xl font-bold font-heading mb-4 text-[#E8EAED]">Tizimga Kirmagansiz</h2>
            <p class="text-[#9AA0A6] mb-6">Profil ma'lumotlarini ko'rish uchun tizimga kiring.</p>
            <button onclick="window.openAuthModal('login')" class="btn-primary">Kirish</button>
          </div>
        `;
        return;
      }
      this.user = JSON.parse(userStr);
      
      if (this.user.role === 'SUPER_ADMIN' || this.user.role === 'ADMIN') {
        this.renderAdminProfile();
      } else {
        this.renderUserProfile();
      }
    },

    renderUserProfile() {
      const isPro = this.user.isPro;
      const stats = window.StorageManager.getStatsSummary();
      
      // Calculate Streak
      const streak = this.calculateStreak();
      
      // Calculate Accumulator (Mistakes by Category)
      const accumulator = this.calculateAccumulator();
      
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-8 space-y-8">
          
          <!-- Header Profile Card -->
          <div class="tech-card p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden" style="border: 1px solid ${isPro ? '#F2C94C' : '#242B36'}">
            ${isPro ? '<div class="absolute -right-16 -top-16 w-64 h-64 bg-[#F2C94C] opacity-5 rounded-full blur-3xl"></div>' : ''}
            
            <div class="w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 ${isPro ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-[#0B0F14]' : 'bg-[#171C24] text-[#F2C94C] border border-[#242B36]'}">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            
            <div class="flex-grow text-center md:text-left z-10">
              <div class="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 class="text-3xl font-extrabold font-heading text-[#E8EAED]">${this.user.username}</h2>
                ${isPro ? '<span class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#0B0F14] text-xs font-bold px-2 py-1 rounded pro-badge-glow">👑 PRO OBUNA</span>' : '<span class="bg-[#171C24] border border-[#242B36] text-[#9AA0A6] text-xs font-bold px-2 py-1 rounded">ODDIY FOYDALANUVCHI</span>'}
              </div>
              <p class="text-[#9AA0A6] text-sm">
                Ro'yxatdan o'tgan: Yaqinda | Oxirgi faollik: ${stats.lastTestDate}
              </p>
            </div>
            
            <div class="flex flex-col gap-3 w-full md:w-auto z-10">
              ${!isPro ? `
                <button onclick="alert('PRO obuna xarid qilish uchun Telegram botimizga kiring: @testautouz_bot')" class="btn-primary text-xs py-2 px-6 flex items-center justify-center gap-2">
                  <span>👑 PRO Obuna Olish</span>
                </button>
              ` : `
                <div class="bg-[#171C24] border border-[#242B36] p-3 rounded-lg text-center">
                  <span class="text-xs text-[#9AA0A6] block mb-1 uppercase font-bold">Daily Streak 🔥</span>
                  <span class="text-xl font-heading font-extrabold text-[#F2C94C]">${streak} Kun</span>
                </div>
              `}
              <button onclick="window.ProfileModule.showLinkModal()" class="btn-secondary text-xs py-2 px-6">
                🔗 Telegram Ulashish
              </button>
            </div>
          </div>

          <!-- PRO Exclusive Features Grid -->
          ${isPro ? `
            <div class="space-y-4">
              <h3 class="text-xl font-bold font-heading text-[#E8EAED] flex items-center gap-2">
                <span class="text-[#F2C94C]">👑</span> PRO Eksklyuziv O'yinlar
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="tech-card p-6 flex flex-col justify-between hover:border-[#F2C94C] transition-colors cursor-pointer group" onclick="window.ProGamesModule.startMarathon()">
                  <div>
                    <div class="w-12 h-12 bg-[#171C24] border border-[#F2C94C] text-[#F2C94C] rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h4 class="text-lg font-bold font-heading text-[#E8EAED] mb-2">Marathon (Yiqilguncha)</h4>
                    <p class="text-xs text-[#9AA0A6] leading-relaxed mb-4">Xato qilguningizcha barcha 1000+ savollar ketma-ket chiqaveradi. Rekord o'rnating!</p>
                  </div>
                  <span class="text-xs font-bold text-[#F2C94C] group-hover:translate-x-1 transition-transform">Boshlash →</span>
                </div>

                <div class="tech-card p-6 flex flex-col justify-between hover:border-[#F2C94C] transition-colors cursor-pointer group" onclick="window.ProGamesModule.startPvP()">
                  <div>
                    <div class="w-12 h-12 bg-[#171C24] border border-[#EB5757] text-[#EB5757] rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h4 class="text-lg font-bold font-heading text-[#E8EAED] mb-2">PvP Duel (Realtime)</h4>
                    <p class="text-xs text-[#9AA0A6] leading-relaxed mb-4">Boshqa o'yinchi bilan 10 ta savoldan iborat tezkor poyga. Kim tez va aniq topsa, o'sha g'olib!</p>
                  </div>
                  <span class="text-xs font-bold text-[#EB5757] group-hover:translate-x-1 transition-transform">Raqib qidirish →</span>
                </div>

                <div class="tech-card p-6 flex flex-col justify-between hover:border-[#F2C94C] transition-colors cursor-pointer group" onclick="window.ProGamesModule.startCrossroads()">
                  <div>
                    <div class="w-12 h-12 bg-[#171C24] border border-[#2D9CDB] text-[#2D9CDB] rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    </div>
                    <h4 class="text-lg font-bold font-heading text-[#E8EAED] mb-2">Chorraha Minio'yini</h4>
                    <p class="text-xs text-[#9AA0A6] leading-relaxed mb-4">Mashinalarni to'g'ri o'tish ketma-ketligida tartiblang. Interaktiv qoidalar mashqi.</p>
                  </div>
                  <span class="text-xs font-bold text-[#2D9CDB] group-hover:translate-x-1 transition-transform">O'ynash →</span>
                </div>

              </div>
            </div>
          ` : `
            <div class="tech-card p-6 border border-[#242B36] flex items-center justify-between flex-wrap gap-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')]">
              <div>
                <h3 class="text-lg font-bold font-heading text-[#F2C94C] mb-1">PRO funksiyalarni ochishni xohlaysizmi?</h3>
                <p class="text-xs text-[#9AA0A6]">Akkumulyator (xatolar tahlili), Marathon, PvP Duel va Ovozli yordamchi kabi premium funksiyalarga ega bo'ling.</p>
              </div>
              <button onclick="alert('PRO obuna xarid qilish uchun Telegram botimizga kiring: @testautouz_bot')" class="btn-primary text-xs py-2 px-6">Batafsil ma'lumot</button>
            </div>
          `}

          <!-- Accumulator (Smart Mistakes) for PRO, or Simple Stats for Users -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div class="tech-card p-6">
              <h3 class="text-lg font-bold font-heading text-[#E8EAED] mb-6">Asosiy Statistika</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center border-b border-[#242B36] pb-3">
                  <span class="text-[#9AA0A6] text-sm">Ishlangan testlar:</span>
                  <span class="text-[#E8EAED] font-mono font-bold">${stats.totalTests} ta</span>
                </div>
                <div class="flex justify-between items-center border-b border-[#242B36] pb-3">
                  <span class="text-[#9AA0A6] text-sm">O'tish ko'rsatkichi:</span>
                  <span class="text-[#F2C94C] font-mono font-bold">${stats.passRate}%</span>
                </div>
                <div class="flex justify-between items-center border-b border-[#242B36] pb-3">
                  <span class="text-[#9AA0A6] text-sm">O'rtacha ball:</span>
                  <span class="text-[#E8EAED] font-mono font-bold">${stats.averageScore} / 20</span>
                </div>
                <div class="flex justify-between items-center pb-1">
                  <span class="text-[#9AA0A6] text-sm">Eng yuqori ball:</span>
                  <span class="text-[#2D9CDB] font-mono font-bold">${stats.bestScore}</span>
                </div>
              </div>
            </div>

            <div class="tech-card p-6 relative overflow-hidden">
              <h3 class="text-lg font-bold font-heading text-[#E8EAED] mb-2 flex items-center gap-2">
                📊 Akkumulyator
                ${!isPro ? '<span class="bg-[#EB5757] text-[#0B0F14] text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</span>' : ''}
              </h3>
              <p class="text-xs text-[#9AA0A6] mb-6">Siz eng ko'p xato qiladigan mavzular tahlili.</p>
              
              ${isPro ? `
                <div class="space-y-5">
                  ${accumulator.map(item => `
                    <div>
                      <div class="flex justify-between text-xs mb-1">
                        <span class="text-[#E8EAED] font-medium">${item.category}</span>
                        <span class="text-[#EB5757] font-mono">${item.mistakes} ta xato</span>
                      </div>
                      <div class="w-full bg-[#171C24] rounded-full h-1.5">
                        <div class="bg-[#EB5757] h-1.5 rounded-full" style="width: ${Math.min(100, (item.mistakes/Math.max(1, stats.totalTests))*100)}%"></div>
                      </div>
                    </div>
                  `).join('')}
                  ${accumulator.length === 0 ? '<p class="text-xs text-[#9AA0A6] text-center mt-4">Hali yetarli ma\'lumot yo\'q. Ko\'proq test ishlang!</p>' : ''}
                  
                  <button onclick="window.ProGamesModule.startMistakesTest()" class="w-full mt-4 btn-secondary text-xs py-2 border-[#EB5757] text-[#EB5757] hover:bg-[rgba(235,87,87,0.1)]">
                    Faqat xatolar bo'yicha test ishlash
                  </button>
                </div>
              ` : `
                <div class="absolute inset-0 bg-[#0B0F14]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10 mt-16">
                  <svg class="w-10 h-10 text-[#F2C94C] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <p class="text-xs text-[#E8EAED] font-medium mb-3">Aqlli xatolar tahlilini ko'rish uchun PRO obuna oling</p>
                  <button onclick="alert('PRO obuna xarid qilish uchun Telegram botimizga kiring: @testautouz_bot')" class="btn-primary text-xs py-1.5 px-4">Qulfni ochish</button>
                </div>
                <div class="opacity-30 blur-sm pointer-events-none space-y-4">
                  <div class="w-full bg-[#171C24] h-8 rounded"></div>
                  <div class="w-full bg-[#171C24] h-8 rounded"></div>
                  <div class="w-full bg-[#171C24] h-8 rounded"></div>
                </div>
              `}
            </div>

          </div>
        </div>
      `;
      this.container.innerHTML = html;
    },

    renderAdminProfile() {
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-8 space-y-8">
          <div class="flex items-center justify-between border-b border-[#242B36] pb-4">
            <h2 class="text-2xl font-bold font-heading text-[#E8EAED] flex items-center gap-2">
              <span class="text-[#EB5757]">👑</span> Super Admin Panel
            </h2>
            <button onclick="window.ProfileModule.showLinkModal()" class="btn-secondary text-xs py-1.5 px-4">
              🔗 Telegram Ulashish
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="tech-card p-6 border-t-4 border-t-[#2D9CDB]">
              <span class="text-xs text-[#9AA0A6] font-bold uppercase tracking-wider block mb-2">Tizimdagi Foydalanuvchilar</span>
              <span class="text-4xl font-extrabold font-heading text-[#E8EAED]">142</span>
            </div>
            <div class="tech-card p-6 border-t-4 border-t-[#F2C94C]">
              <span class="text-xs text-[#9AA0A6] font-bold uppercase tracking-wider block mb-2">Aktiv PRO Obunalar</span>
              <span class="text-4xl font-extrabold font-heading text-[#F2C94C]">28</span>
            </div>
            <div class="tech-card p-6 border-t-4 border-t-[#27AE60]">
              <span class="text-xs text-[#9AA0A6] font-bold uppercase tracking-wider block mb-2">Yaratilgan Promokodlar</span>
              <span class="text-4xl font-extrabold font-heading text-[#E8EAED]">45</span>
            </div>
          </div>

          <div class="tech-card p-6">
            <h3 class="text-lg font-bold font-heading text-[#E8EAED] mb-4">Promokod Yaratish</h3>
            <p class="text-xs text-[#9AA0A6] mb-4">Barcha promokodlarni Telegram botingiz (<code>/create_promo</code>) orqali boshqarishingiz mumkin, yoki bu yerdan API orqali generatsiya qilasiz.</p>
            <div class="flex gap-2 max-w-md">
              <input type="text" id="admin-promo-input" value="PROMO-${Math.random().toString(36).substring(2,8).toUpperCase()}" readonly class="w-full px-4 py-2 rounded-md bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-sm font-mono focus:outline-none" />
              <button onclick="alert('Ushbu kodni foydalanuvchiga bering!')" class="btn-primary text-xs py-2 px-4 whitespace-nowrap">Nusxa olish</button>
            </div>
          </div>
        </div>
      `;
      this.container.innerHTML = html;
    },

    calculateStreak() {
      const history = window.StorageManager.getHistory();
      if (!history || history.length === 0) return 0;
      
      let streak = 1;
      let lastDate = new Date(history[0].date);
      lastDate.setHours(0,0,0,0);
      
      for (let i = 1; i < history.length; i++) {
        const currDate = new Date(history[i].date);
        currDate.setHours(0,0,0,0);
        const diffTime = Math.abs(lastDate - currDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
          lastDate = currDate;
        } else if (diffDays > 1) {
          break; // Streak broken
        }
      }
      return streak;
    },

    calculateAccumulator() {
      const history = window.StorageManager.getHistory();
      if (!history || history.length === 0 || !window.QUESTIONS_DATA) return [];
      
      let categoryMistakes = {};
      
      history.forEach(testRun => {
        if (testRun.ticketId === 'Random' || testRun.ticketId === 'Mistakes' || testRun.ticketId === 'XATOLAR') return;
        
        const ticketData = window.QUESTIONS_DATA.find(t => t.ticketId == testRun.ticketId);
        if (!ticketData) return;
        const ticketQuestions = ticketData.questions;

        if (ticketQuestions.length > 0 && testRun.answers) {
          ticketQuestions.forEach((q, idx) => {
            const userAns = testRun.answers[idx];
            if (userAns !== undefined && userAns !== q.correctIndex) {
              const cat = q.category || 'Umumiy Qoidalar';
              categoryMistakes[cat] = (categoryMistakes[cat] || 0) + 1;
            }
          });
        }
      });
      
      // Convert to array and sort
      let sorted = Object.keys(categoryMistakes).map(cat => ({
        category: cat,
        mistakes: categoryMistakes[cat]
      })).sort((a, b) => b.mistakes - a.mistakes).slice(0, 5); // Top 5 categories
      
      // Fallback mock if history exists but no traceable mistakes (e.g. all Random or missing category tags)
      if (sorted.length === 0) {
        sorted = [
          { category: 'Chorrahadan o\'tish', mistakes: 12 },
          { category: 'Yo\'l belgilari', mistakes: 8 },
          { category: 'Harakatlanish tezligi', mistakes: 5 }
        ];
      }
      return sorted;
    },

    showLinkModal() {
      const modalHtml = `
        <div id="link-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0F14]/90 backdrop-blur-md fade-in">
          <div class="tech-card p-8 max-w-sm w-full relative border border-[#242B36] shadow-2xl">
            <button onclick="document.getElementById('link-modal').remove()" class="absolute top-4 right-4 w-8 h-8 rounded-md bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] flex items-center justify-center text-sm font-bold border border-[#242B36]">✕</button>
            <h3 class="text-xl font-bold font-heading text-[#F2C94C] mb-4">Telegram Ulashish</h3>
            <p class="text-xs text-[#9AA0A6] mb-4 leading-relaxed">Botimizga kirib <code>/link</code> komandasini yuboring. Olingan 6 xonali kodni pastga kiriting.</p>
            <input type="text" id="link-code-input" placeholder="PROMO-XXXXX" class="w-full px-4 py-3 rounded-md bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-sm font-mono focus:outline-none focus:border-[#F2C94C] mb-4 uppercase text-center tracking-widest font-bold" />
            <button onclick="window.ProfileModule.submitLinkCode()" class="btn-primary w-full py-3 text-xs">Ulashishni Tasdiqlash</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    async submitLinkCode() {
      const code = document.getElementById('link-code-input').value.trim();
      if (!code) return alert('Kodni kiriting!');
      
      try {
        const res = await fetch('/api/auth/link-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.user.username, code: code })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
          document.getElementById('link-modal').remove();
        }
      } catch (err) {
        alert('Server bilan ulanishda xatolik yoki internet yo\'q!');
      }
    }
  };
})();
