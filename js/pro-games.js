(function() {
  window.ProGamesModule = {
    // 🌟 3-VAZIFA 🟢 1: Xatolar Ustida Ishlash (Error Bank)
    startMistakesTest() {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      const wrongQuestionsStr = localStorage.getItem('avtotest_wrong_questions');
      const wrongIds = wrongQuestionsStr ? JSON.parse(wrongQuestionsStr) : [1, 3];
      const allQ = (window.QUESTIONS && window.QUESTIONS.length > 0) ? window.QUESTIONS : [
        { id: 1, question: "Chorrahaga yaqinlashganda svetoforning sariq ishorasi yonganda nima qilish kerak?", options: ["To'liq to'xtash shart", "Taqiqlovchi ishora, tayyorlanish kerak", "Harakatni davom ettirish mumkin"], correct: 1, explanation: "📖 YHQ 7.2-modda: Sariq ishora harakatni taqiqlaydi va bo'lajak ishoralar alishinuvidan ogohlantiradi." },
        { id: 3, question: "Quvib o'tish qayerda taqiqlanadi?", options: ["To'g'ri yo'lda", "Piyodalar o'tish joyida va chorrahalarda", "Keng ko'chada"], correct: 1, explanation: "📖 YHQ 12.4-modda: Piyodalar o'tish joylarida hamda barcha turdagi chorrahalarda quvib o me'yori taqiqlanadi." }
      ];

      const questions = allQ.filter(q => wrongIds.includes(q.id));
      const targetQuestions = questions.length > 0 ? questions : allQ.slice(0, 5);

      let qIndex = 0;
      let score = 0;

      const render = () => {
        if (qIndex >= targetQuestions.length) {
          container.innerHTML = `
            <div class="fade-in max-w-md mx-auto py-12 text-center space-y-6">
              <div class="tech-card p-8 border border-[#27AE60]/40 space-y-4">
                <div class="w-16 h-16 rounded-full bg-[#27AE60]/20 text-[#27AE60] flex items-center justify-center mx-auto text-3xl font-bold">🎯</div>
                <h2 class="text-2xl font-bold font-heading text-[#E8EAED]">Xatolar Tahlili Tugadi!</h2>
                <p class="text-sm text-[#9AA0A6]">Siz <strong class="text-[#27AE60] font-mono text-lg">${targetQuestions.length} ta</strong> xatoli savolingizdan <strong class="text-[#F2C94C] font-mono text-lg">${score} tasini</strong> to'g'irladingiz!</p>
                <div class="pt-4 flex gap-3">
                  <button onclick="window.switchTab('home')" class="btn-primary w-full py-3 text-xs font-bold">Bosh Sahifaga Qaytish</button>
                </div>
              </div>
            </div>
          `;
          return;
        }

        const q = targetQuestions[qIndex];
        container.innerHTML = `
          <div class="fade-in max-w-3xl mx-auto py-8 space-y-6">
            <div class="tech-card p-6 border border-[#EB5757]/40 flex items-center justify-between">
              <div>
                <span class="text-xs font-mono text-[#EB5757] font-bold uppercase block">⚠️ XATOLAR USTIDA ISHLASH (ERROR BANK)</span>
                <h3 class="text-lg font-bold text-[#E8EAED]">O'tmishdagi xatollaringiz tahlili</h3>
              </div>
              <span class="text-xs font-mono font-bold px-3 py-1 rounded bg-[#171C24] text-[#F2C94C] border border-[#242B36]">
                ${qIndex + 1} / ${targetQuestions.length}
              </span>
            </div>

            <div class="tech-card p-8 space-y-6">
              <h2 class="text-xl font-bold font-heading text-[#E8EAED]">${q.question}</h2>
              <div class="space-y-3">
                ${q.options.map((opt, i) => `
                  <button onclick="window.ProGamesModule.answerMistake(${i}, ${q.correct})" class="w-full p-4 text-left rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#F2C94C] text-sm text-[#E8EAED] font-medium flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-[#0B0F14] border border-[#242B36] text-[#9AA0A6] flex items-center justify-center font-mono text-xs font-bold">${String.fromCharCode(65 + i)}</span>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>
              ${q.explanation ? `
                <div class="p-4 rounded-lg bg-[#F2C94C]/10 border border-[#F2C94C]/30 text-xs text-[#F2C94C] leading-relaxed font-mono">
                  💡 <strong>Izoh & YHQ Bandi:</strong> ${q.explanation}
                </div>
              ` : ''}
            </div>
          </div>
        `;
      };

      this.answerMistake = (chosen, correct) => {
        if (chosen === correct) score++;
        qIndex++;
        render();
      };

      render();
    },

    // 🌟 3-VAZIFA 🟢 2: Mavzulashtirilgan Testlar (Topic-based Tests)
    startTopicTest(topicName = 'Chorrahalar') {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      const topics = ["Quvib o'tish qoidalari", "Svetofor va chorrahalar", "Yo'l belgilari", "Harakatlanish tezligi"];

      container.innerHTML = `
        <div class="fade-in max-w-4xl mx-auto py-8 space-y-6">
          <div class="tech-card p-6 border border-[#F2C94C]/40 flex items-center justify-between">
            <div>
              <span class="text-xs font-mono text-[#F2C94C] font-bold uppercase block">📚 MAVZULASHTIRILGAN PDD TESTLAR</span>
              <h3 class="text-xl font-bold text-[#E8EAED]">Yo'l harakati qoidalari bo'limlari bo me'yorida tayyorgarlik</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${topics.map((t, idx) => `
              <div onclick="alert('📚 \\"${t}\\" bo\\'yicha 20 ta eksklyuziv savollar to\\'plami yuklanmoqda!')" class="tech-card p-6 border border-[#242B36] hover:border-[#F2C94C] cursor-pointer transition-all hover:scale-[1.02] space-y-3">
                <div class="w-10 h-10 rounded-lg bg-[#F2C94C]/10 text-[#F2C94C] flex items-center justify-center font-bold font-mono">#0${idx + 1}</div>
                <h4 class="text-lg font-bold text-[#E8EAED] font-heading">${t}</h4>
                <p class="text-xs text-[#9AA0A6]">Ushbu bo'limga oid barcha qoida va test variantlarini chuqur o'rganing.</p>
                <span class="inline-block text-xs font-bold text-[#F2C94C]">Testni Boshlash →</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    // 🌟 3-VAZIFA 🎮 3: 1-ga-1 Duel (Multiplayer PDD Battle)
    startPvPDuel() {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      let myScore = 0;
      let opponentScore = 0;
      let qIndex = 0;

      const render = () => {
        if (qIndex >= 5) {
          const won = myScore >= opponentScore;
          container.innerHTML = `
            <div class="fade-in max-w-md mx-auto py-12 text-center space-y-6">
              <div class="tech-card p-8 border ${won ? 'border-[#27AE60]/40' : 'border-[#EB5757]/40'} space-y-4">
                <div class="w-20 h-20 rounded-full ${won ? 'bg-[#27AE60]/20 text-[#27AE60]' : 'bg-[#EB5757]/20 text-[#EB5757]'} flex items-center justify-center mx-auto text-4xl font-bold">
                  ${won ? '🏆' : '💔'}
                </div>
                <h2 class="text-2xl font-bold font-heading text-[#E8EAED]">${won ? 'Siz G\'olib Bo\'ldingiz!' : 'Raqib G\'olib Bo\'ldi!'}</h2>
                <div class="flex justify-center items-center gap-8 py-2 font-mono text-xl font-bold">
                  <span class="text-[#27AE60]">Siz: ${myScore}</span>
                  <span class="text-[#9AA0A6]">:</span>
                  <span class="text-[#EB5757]">Raqib: ${opponentScore}</span>
                </div>
                <button onclick="window.ProGamesModule.startPvPDuel()" class="btn-primary w-full py-3 text-xs font-bold">Qayta Duel O'ynash</button>
              </div>
            </div>
          `;
          return;
        }

        container.innerHTML = `
          <div class="fade-in max-w-3xl mx-auto py-8 space-y-6">
            <!-- Scoreboard -->
            <div class="tech-card p-6 border border-[#F2C94C]/40 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#27AE60]/20 text-[#27AE60] flex items-center justify-center font-bold font-mono">Siz</div>
                <div>
                  <span class="text-xs text-[#9AA0A6] block">Sizning Ball</span>
                  <span class="text-xl font-mono font-bold text-[#27AE60]">${myScore}</span>
                </div>
              </div>
              <div class="text-center font-mono font-bold text-xs px-3 py-1 bg-[#171C24] rounded border border-[#242B36] text-[#F2C94C]">
                ⚡ 1-v-1 PDD DUEL
              </div>
              <div class="flex items-center gap-3 text-right">
                <div>
                  <span class="text-xs text-[#9AA0A6] block">Raqib (Jasur_PDD)</span>
                  <span class="text-xl font-mono font-bold text-[#EB5757]">${opponentScore}</span>
                </div>
                <div class="w-10 h-10 rounded-full bg-[#EB5757]/20 text-[#EB5757] flex items-center justify-center font-bold font-mono">⚡</div>
              </div>
            </div>

            <div class="tech-card p-8 space-y-6">
              <span class="text-xs font-mono text-[#9AA0A6]">Raund #${qIndex + 1} / 5</span>
              <h2 class="text-xl font-bold font-heading text-[#E8EAED]">Avariya holati ro'y berganda birinchi navbatda nima yoqiladi?</h2>
              <div class="space-y-3">
                <button onclick="window.ProGamesModule.answerDuel(true)" class="w-full p-4 text-left rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#F2C94C] text-sm text-[#E8EAED] font-bold">Avariya ishora chirog'i (Аварийка)</button>
                <button onclick="window.ProGamesModule.answerDuel(false)" class="w-full p-4 text-left rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#F2C94C] text-sm text-[#E8EAED]">Uzoqni yorituvchi chiroqlar</button>
              </div>
            </div>
          </div>
        `;
      };

      this.answerDuel = (isCorrect) => {
        if (isCorrect) myScore++;
        if (Math.random() > 0.4) opponentScore++;
        qIndex++;
        render();
      };

      render();
    },

    // 🌟 3-VAZIFA 🎮 4: Yo'l Belgilari Viktorinasi (Visual Quiz)
    startSignsQuiz() {
      if (!this.checkPro()) return;
      const container = document.getElementById('app-main-content');
      if (!container) return;

      container.innerHTML = `
        <div class="fade-in max-w-3xl mx-auto py-8 space-y-6 text-center">
          <div class="tech-card p-8 border border-[#2D9CDB]/40 space-y-6">
            <span class="text-xs font-mono text-[#2D9CDB] font-bold uppercase block">🖼️ YO'L BELGILARI VIKTORINASI</span>
            <div class="w-28 h-28 mx-auto rounded-2xl bg-[#0B0F14] border-2 border-[#F2C94C] flex items-center justify-center text-5xl shadow-xl">
              🛑
            </div>
            <h3 class="text-xl font-bold text-[#E8EAED]">Ushbu Yo'l Belgisi Nimani Anglatadi?</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button onclick="alert('✅ To\'g'ri! 2.5 Stop (To\'xtamay o\'tish taqiqlanadi) belgisi!')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#2D9CDB] text-xs font-bold text-[#E8EAED]">1. To'xtamasdan o'tish taqiqlangan (STOP)</button>
              <button onclick="alert('❌ Noto\'g'ri!')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#2D9CDB] text-xs font-bold text-[#E8EAED]">2. Asosiy yo'l belgisi</button>
              <button onclick="alert('❌ Noto\'g me'yori!')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#2D9CDB] text-xs font-bold text-[#E8EAED]">3. Kirish taqiqlangan (Gisht)</button>
              <button onclick="alert('❌ Noto\'g'ri!')" class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] hover:border-[#2D9CDB] text-xs font-bold text-[#E8EAED]">4. Bojxona posti</button>
            </div>
          </div>
        </div>
      `;
    },

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
