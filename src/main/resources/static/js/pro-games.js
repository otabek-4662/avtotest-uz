(function() {
  window.ProGamesModule = {
    startMarathon() {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      let score = 0;
      let qIndex = 0;
      const allQuestions = (window.QUESTIONS && window.QUESTIONS.length > 0) ? window.QUESTIONS : [
        { id: 1, question: "Chorrahaga yaqinlashganda svetoforning sariq ishorasi yonganda nima qilish kerak?", options: ["To'liq to'xtash shart", "Taqiqlovchi ishora, tayyorlanish kerak", "Harakatni davom ettirish mumkin"], correct: 1 },
        { id: 2, question: "Maksimal tezlik cheklovi belgisi nimani anglatadi?", options: ["Tavsiya etilgan tezlik", "Ko'rsatilgan tezlikdan oshirmaslik kerak", "Eng kam tezlik"], correct: 1 },
        { id: 3, question: "Quvib o'tish qayerda taqiqlanadi?", options: ["To'g'ri yo'lda", "Piyodalar o'tish joyida va chorrahalarda", "Keng ko'chada"], correct: 1 }
      ];

      const renderQuestion = () => {
        const q = allQuestions[qIndex % allQuestions.length];
        container.innerHTML = `
          <div class="fade-in max-w-3xl mx-auto py-8 space-y-6">
            <div class="tech-card p-6 border border-[#F2C94C]/40 flex items-center justify-between">
              <div>
                <span class="text-xs font-mono text-[#F2C94C] font-bold uppercase block">🔥 MARATHON REJIMI (YIQILGUNCHAI)</span>
                <h3 class="text-lg font-bold text-[#E8EAED]">Birinchi xatogacha davom etadi!</h3>
              </div>
              <div class="text-right">
                <span class="text-xs text-[#9AA0A6] block">Hozirgi Rekord</span>
                <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${score} ta</span>
              </div>
            </div>

            <div class="tech-card p-8 space-y-6">
              <span class="text-xs font-mono text-[#9AA0A6]">Savol #${qIndex + 1}</span>
              <h2 class="text-xl font-bold font-heading text-[#E8EAED]">${q.question}</h2>

              <div class="space-y-3">
                ${q.options.map((opt, i) => `
                  <button onclick="window.ProGamesModule.answerMarathon(${i}, ${q.correct})" class="w-full p-4 text-left rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#F2C94C] hover:bg-[#171C24]/80 transition-colors text-sm text-[#E8EAED] font-medium flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-[#0B0F14] border border-[#242B36] text-[#9AA0A6] flex items-center justify-center font-mono text-xs font-bold">${String.fromCharCode(65 + i)}</span>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      };

      this.answerMarathon = (chosen, correct) => {
        if (chosen === correct) {
          score++;
          qIndex++;
          renderQuestion();
        } else {
          container.innerHTML = `
            <div class="fade-in max-w-md mx-auto py-12 text-center space-y-6">
              <div class="tech-card p-8 border border-[#EB5757]/40 space-y-4">
                <div class="w-16 h-16 rounded-full bg-[#EB5757]/20 text-[#EB5757] flex items-center justify-center mx-auto text-3xl font-bold">💥</div>
                <h2 class="text-2xl font-bold font-heading text-[#E8EAED]">O'yin Tugadi!</h2>
                <p class="text-sm text-[#9AA0A6]">Siz ketma-ket <strong class="text-[#F2C94C] font-mono text-lg">${score} ta</strong> savolga to'g'ri javob berdingiz!</p>
                <div class="pt-4 flex gap-3">
                  <button onclick="window.ProGamesModule.startMarathon()" class="btn-primary w-full py-3 text-xs">Qayta O'ynash</button>
                  <button onclick="window.switchTab('home')" class="btn-secondary w-full py-3 text-xs">Bosh Sahifa</button>
                </div>
              </div>
            </div>
          `;
        }
      };

      renderQuestion();
    },

    startTimeAttack() {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      let score = 0;
      let timeLeft = 60;
      let qIndex = 0;
      let timer = null;

      const allQuestions = (window.QUESTIONS && window.QUESTIONS.length > 0) ? window.QUESTIONS : [
        { question: "Qizil svetofor ishorasi nimani anglatadi?", options: ["Taqiqlaydi", "Ruxsat beradi", "Ogohlantiradi"], correct: 0 },
        { question: "Piyodalar o'tish joyi belgisi shakli qanday?", options: ["Uchburchak", "Kvadrat / To'rtburchak", "Doira"], correct: 1 },
        { question: "Avariya chirog'i qachon yoqiladi?", options: ["To'xtab turganda va avariya holatida", "Tez yurganda", "Faqat tunda"], correct: 0 }
      ];

      const renderQuestion = () => {
        const q = allQuestions[qIndex % allQuestions.length];
        container.innerHTML = `
          <div class="fade-in max-w-3xl mx-auto py-8 space-y-6">
            <div class="tech-card p-6 border border-[#2D9CDB]/40 flex items-center justify-between">
              <div>
                <span class="text-xs font-mono text-[#2D9CDB] font-bold uppercase block">⏱️ TIME ATTACK (60 SONIYA)</span>
                <h3 class="text-lg font-bold text-[#E8EAED]">Imkon qadar tez va aniq javob bering!</h3>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-center">
                  <span class="text-xs text-[#9AA0A6] block">Vaqt</span>
                  <span id="ta-timer-val" class="text-2xl font-mono font-extrabold text-[#EB5757]">${timeLeft}s</span>
                </div>
                <div class="text-center border-l border-[#242B36] pl-6">
                  <span class="text-xs text-[#9AA0A6] block">Ball</span>
                  <span class="text-2xl font-mono font-extrabold text-[#F2C94C]">${score}</span>
                </div>
              </div>
            </div>

            <div class="tech-card p-8 space-y-6">
              <h2 class="text-xl font-bold font-heading text-[#E8EAED]">${q.question}</h2>
              <div class="space-y-3">
                ${q.options.map((opt, i) => `
                  <button onclick="window.ProGamesModule.answerTimeAttack(${i}, ${q.correct})" class="w-full p-4 text-left rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#2D9CDB] transition-colors text-sm text-[#E8EAED] font-medium">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      };

      timer = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('ta-timer-val');
        if (timerEl) timerEl.textContent = timeLeft + 's';
        if (timeLeft <= 0) {
          clearInterval(timer);
          container.innerHTML = `
            <div class="fade-in max-w-md mx-auto py-12 text-center space-y-6">
              <div class="tech-card p-8 border border-[#2D9CDB]/40 space-y-4">
                <div class="w-16 h-16 rounded-full bg-[#2D9CDB]/20 text-[#2D9CDB] flex items-center justify-center mx-auto text-3xl font-bold">🏁</div>
                <h2 class="text-2xl font-bold font-heading text-[#E8EAED]">Vaqt Tugadi!</h2>
                <p class="text-sm text-[#9AA0A6]">Siz 60 soniya ichida <strong class="text-[#F2C94C] font-mono text-lg">${score} ta</strong> to'g'ri javob topdingiz!</p>
                <div class="pt-4 flex gap-3">
                  <button onclick="window.ProGamesModule.startTimeAttack()" class="btn-primary w-full py-3 text-xs">Qayta O'ynash</button>
                  <button onclick="window.switchTab('home')" class="btn-secondary w-full py-3 text-xs">Bosh Sahifa</button>
                </div>
              </div>
            </div>
          `;
        }
      }, 1000);

      this.answerTimeAttack = (chosen, correct) => {
        if (chosen === correct) score++;
        qIndex++;
        renderQuestion();
      };

      renderQuestion();
    },

    startCrossroads() {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      container.innerHTML = `
        <div class="fade-in max-w-3xl mx-auto py-8 space-y-6">
          <div class="tech-card p-6 border border-[#27AE60]/40 flex items-center justify-between">
            <div>
              <span class="text-xs font-mono text-[#27AE60] font-bold uppercase block">🚦 CHORRAHA NAVBATI MINI-O'YINI</span>
              <h3 class="text-lg font-bold text-[#E8EAED]">Mashinalar o'tish tartibini to'g'ri belgilang</h3>
            </div>
          </div>

          <div class="tech-card p-8 text-center space-y-6">
            <div class="p-8 rounded-xl bg-[#0B0F14] border border-[#242B36] flex flex-col items-center justify-center gap-4">
              <div class="flex items-center gap-6">
                <span class="px-4 py-2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold font-mono">🚗 Ko'k Mashina (To'g'ri)</span>
                <span class="px-4 py-2 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold font-mono">🚙 Qizil Mashina (Chapga)</span>
                <span class="px-4 py-2 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold font-mono">🚚 Sariq Yuk mashinasi (Asosiy yo'l)</span>
              </div>
              <p class="text-xs text-[#9AA0A6]">Asosiy yo'lda harakatlanayotgan va o'ng tarafdan kelayotgan transport vositasiga kim birinchi yo'l berishi kerak?</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onclick="alert('✅ To\'g'ri! Asosiy yo'ldagi Sariq yuk mashinasi birinchi o'tadi.')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#27AE60] text-sm text-[#E8EAED] font-bold">1. Sariq Yuk Mashinasi</button>
              <button onclick="alert('❌ Noto\'g'ri! Qizil mashina chorrahada burilishda yo'l berishi kerak.')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#27AE60] text-sm text-[#E8EAED] font-bold">2. Qizil Mashina</button>
              <button onclick="alert('❌ Noto\'g'ri! Ko\'k mashina asosiy yo'ldagi transport o'tishini kutishi kerak.')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#27AE60] text-sm text-[#E8EAED] font-bold">3. Ko'k Mashina</button>
            </div>
          </div>
        </div>
      `;
    },

    checkPro() {
      const userStr = localStorage.getItem('avtotest_user');
      if (!userStr) {
        if (window.openAuthModal) window.openAuthModal('login');
        return false;
      }

      const user = JSON.parse(userStr);
      const isPro = !!user.isPro || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || (user.username || '').toLowerCase() === 'otabek';

      if (!isPro) {
        if (window.showProLockModal) window.showProLockModal('PRO Eksklyuziv O\'yinlar');
        return false;
      }
      return true;
    }
  };
})();
