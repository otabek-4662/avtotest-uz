(function() {
  window.TestEngine = {
    questionsData: [],
    currentTicket: null,
    currentQuestions: [],
    currentIndex: 0,
    userAnswers: {},
    timerInterval: null,
    timeLeft: 1200,
    isExamFinished: false,

    init(containerEl) {
      this.container = containerEl;
      this.questionsData = window.QUESTIONS_DATA || [];
      this.renderTicketSelection();
    },

    renderTicketSelection() {
      this.clearIntervals();
      this.isExamFinished = false;
      this.userAnswers = {};

      let html = `
        <div class="fade-in max-w-4xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-3">
              IMTIHON SIMULYATSIYASI
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">PDD Test Biletini Tanlang</h2>
            <p class="muted-text max-w-xl">
              Rasmiy YPX imtihon formati: 20 ta savol, 20 daqiqa vaqt. Kamida 18 ta to'g'ri javob topsangiz imtihondan o'tasiz.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      `;

      this.questionsData.forEach(t => {
        html += `
          <div class="tech-card flex flex-col justify-between cursor-pointer group" onclick="window.startTest(${t.ticketId})">
            <div>
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-mono font-bold text-sm mb-4">
                #0${t.ticketId}
              </div>
              <h3 class="text-lg font-bold text-[#E8EAED] mb-1 font-heading">Bilet ${t.ticketId}</h3>
              <p class="text-xs text-[#9AA0A6] mb-4">${t.questions.length} ta savol • Standard format</p>
            </div>
            <button class="btn-primary w-full text-xs py-2">
              <span>Boshlash</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        `;
      });

      html += `
        <div class="tech-card flex flex-col justify-between cursor-pointer group" onclick="window.startRandomTest()">
          <div>
            <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center font-mono font-bold text-sm mb-4">
              <svg class="w-5 h-5 text-[#F2C94C]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <h3 class="text-lg font-bold text-[#E8EAED] mb-1 font-heading">Tasodifiy Test</h3>
            <p class="text-xs text-[#9AA0A6] mb-4">20 ta tasodifiy savollar to'plami</p>
          </div>
          <button class="btn-secondary w-full text-xs py-2">
            <span>Aralash Boshlash</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
      `;

      const stats = window.StorageManager.getStatsSummary();
      html += `
        <div class="tech-card max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#E8EAED]">Sizning Imtihon Tarixingiz</h4>
              <p class="text-xs text-[#9AA0A6]">Jami: ${stats.totalTests} ta • O'rtacha ball: ${stats.averageScore}/20</p>
            </div>
          </div>
          <button onclick="window.switchTab('stats')" class="text-xs text-[#F2C94C] hover:underline font-semibold">Batafsil statistika →</button>
        </div>
      </div>
      `;

      this.container.innerHTML = html;
    },

    startTicket(ticketId) {
      const ticket = this.questionsData.find(t => t.ticketId === ticketId);
      if (!ticket) return;
      this.currentTicket = ticketId;
      this.currentQuestions = [...ticket.questions];
      this.currentIndex = 0;
      this.userAnswers = {};
      this.timeLeft = 1200;
      this.isExamFinished = false;

      this.startTimer();
      this.renderQuestionView();
    },

    startRandom() {
      let allQs = [];
      this.questionsData.forEach(t => {
        allQs = allQs.concat(t.questions);
      });
      allQs = allQs.sort(() => 0.5 - Math.random()).slice(0, 20);

      this.currentTicket = 'Random';
      this.currentQuestions = allQs;
      this.currentIndex = 0;
      this.userAnswers = {};
      this.timeLeft = 1200;
      this.isExamFinished = false;

      this.startTimer();
      this.renderQuestionView();
    },

    startTimer() {
      this.clearIntervals();
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.updateTimerDisplay();
        if (this.timeLeft <= 0) {
          this.clearIntervals();
          this.finishTest();
        }
      }, 1000);
    },

    clearIntervals() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    updateTimerDisplay() {
      const el = document.getElementById('test-timer-display');
      if (!el) return;
      const mins = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
      const secs = (this.timeLeft % 60).toString().padStart(2, '0');
      el.textContent = `${mins}:${secs}`;
      if (this.timeLeft < 180) {
        el.classList.add('text-[#EB5757]');
      }
    },

    renderQuestionView() {
      const q = this.currentQuestions[this.currentIndex];
      const mins = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
      const secs = (this.timeLeft % 60).toString().padStart(2, '0');

      let html = `
        <div class="fade-in max-w-4xl mx-auto py-4 space-y-6">
          <!-- Top Toolbar -->
          <div class="tech-card p-4 flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <button onclick="window.confirmExitTest()" class="btn-secondary text-xs py-1.5 px-3">
                ← Chiqish
              </button>
              <span class="text-xs font-mono font-bold px-3 py-1 rounded bg-[#171C24] text-[#F2C94C] border border-[#242B36]">
                ${this.currentTicket === 'Random' ? 'Tasodifiy Bilet' : 'Bilet #' + this.currentTicket}
              </span>
            </div>

            <!-- Question Numbers -->
            <div class="flex items-center gap-1.5 flex-wrap">
      `;

      this.currentQuestions.forEach((_, idx) => {
        let statusStyle = 'background: #171C24; color: #9AA0A6; border: 1px solid #242B36;';
        if (this.userAnswers[idx] !== undefined) {
          statusStyle = 'background: #F2C94C; color: #0B0F14; border: 1px solid #F2C94C; font-weight: bold;';
        }
        if (idx === this.currentIndex) {
          statusStyle += ' outline: 2px solid #F2C94C; outline-offset: 1px;';
        }
        html += `
          <button onclick="window.goToQuestion(${idx})" style="${statusStyle}" class="w-8 h-8 rounded text-xs flex items-center justify-center transition-all">
            ${idx + 1}
          </button>
        `;
      });

      html += `
            </div>

            <div class="flex items-center gap-2 bg-[#171C24] px-4 py-2 rounded-md border border-[#242B36]">
              <svg class="w-4 h-4 text-[#F2C94C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span id="test-timer-display" class="font-mono font-bold text-sm text-[#F2C94C]">${mins}:${secs}</span>
            </div>
          </div>

          <!-- Question Card -->
          <div class="tech-card p-6 sm:p-8">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono font-semibold text-[#9AA0A6]">Savol ${this.currentIndex + 1} / ${this.currentQuestions.length}</span>
              <span class="text-xs text-[#F2C94C] font-medium">Bitta javobni tanlang</span>
            </div>

            ${q.imageContent ? `
              <div class="mb-6 flex justify-center p-4 bg-[#0B0F14] rounded-lg border border-[#242B36]">
                ${q.imageContent}
              </div>
            ` : ''}

            <h3 class="text-lg sm:text-xl font-bold text-[#E8EAED] mb-6 leading-relaxed font-heading">
              ${q.text}
            </h3>

            <div class="space-y-3 mb-8">
      `;

      q.options.forEach((opt, oIdx) => {
        const selected = this.userAnswers[this.currentIndex] === oIdx;
        const optionLetter = String.fromCharCode(65 + oIdx);

        html += `
          <div onclick="window.selectOption(${oIdx})" class="test-option-btn ${selected ? 'selected' : ''}">
            <div class="flex items-center gap-4">
              <div class="w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold ${selected ? 'bg-[#F2C94C] text-[#0B0F14]' : 'bg-[#171C24] text-[#9AA0A6] border border-[#242B36]'}">
                ${optionLetter}
              </div>
              <span class="text-sm font-medium text-[#E8EAED]">${opt}</span>
            </div>
          </div>
        `;
      });

      html += `
            </div>

            <div class="flex items-center justify-between border-t border-[#242B36] pt-6">
              <button onclick="window.goToQuestion(${this.currentIndex - 1})" ${this.currentIndex === 0 ? 'disabled class="opacity-40 cursor-not-allowed btn-secondary text-xs py-2 px-4"' : 'class="btn-secondary text-xs py-2 px-4"'}>
                ← Oldingisi
              </button>

              ${this.currentIndex === this.currentQuestions.length - 1 ? `
                <button onclick="window.finishTest()" class="btn-primary text-xs py-2 px-5">
                  <span>Testni Yakunlash</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </button>
              ` : `
                <button onclick="window.goToQuestion(${this.currentIndex + 1})" class="btn-primary text-xs py-2 px-5">
                  <span>Keyingisi →</span>
                </button>
              `}
            </div>
          </div>
        </div>
      `;

      this.container.innerHTML = html;
    },

    selectOption(optIndex) {
      if (this.isExamFinished) return;
      this.userAnswers[this.currentIndex] = optIndex;
      this.renderQuestionView();
    },

    goToQuestion(idx) {
      if (idx >= 0 && idx < this.currentQuestions.length) {
        this.currentIndex = idx;
        this.renderQuestionView();
      }
    },

    finishTest() {
      this.clearIntervals();
      this.isExamFinished = true;

      let score = 0;
      const details = [];

      this.currentQuestions.forEach((q, idx) => {
        const userAns = this.userAnswers[idx];
        const isCorrect = userAns === q.correctIndex;
        if (isCorrect) score++;

        details.push({
          question: q,
          userAns,
          isCorrect
        });
      });

      const timeSpentSeconds = 1200 - this.timeLeft;
      const passed = score >= 18;

      window.StorageManager.saveResult({
        date: new Date().toISOString(),
        ticketId: this.currentTicket,
        score,
        totalQuestions: this.currentQuestions.length,
        timeSpent: timeSpentSeconds,
        passed,
        answers: this.userAnswers
      });

      this.renderResultsScreen(score, passed, timeSpentSeconds, details);
    },

    renderResultsScreen(score, passed, timeSpentSeconds, details) {
      const mins = Math.floor(timeSpentSeconds / 60);
      const secs = timeSpentSeconds % 60;

      let html = `
        <div class="fade-in max-w-4xl mx-auto py-4 space-y-8">
          <div class="tech-card p-8 text-center relative overflow-hidden">
            <div class="w-16 h-16 mx-auto rounded-full bg-[#171C24] border border-[#242B36] flex items-center justify-center text-2xl mb-4 text-[#F2C94C]">
              ${passed ? 'PASSED' : 'FAILED'}
            </div>

            <h2 class="text-3xl font-extrabold ${passed ? 'text-[#F2C94C]' : 'text-[#EB5757]'} mb-2 font-heading">
              ${passed ? "IMTIHONDAN O'TDINGIZ!" : "IMTIHONDAN O'TA OLMADINGIZ"}
            </h2>
            <p class="muted-text max-w-md mx-auto mb-6">
              ${passed ? "Tabriklaymiz! Siz O'zbekiston PDD imtihoni me'yoriy talabini (kamida 18 ball) bajardingiz." : "Xatolaringizni ko'rib chiqing va qaytadan harakat qiling."}
            </p>

            <div class="inline-flex items-center justify-center gap-8 bg-[#0B0F14] px-6 py-4 rounded-lg border border-[#242B36] mb-6 flex-wrap">
              <div>
                <span class="text-xs text-[#9AA0A6] block">Natija</span>
                <span class="text-xl font-mono font-extrabold text-[#E8EAED]">${score} / ${this.currentQuestions.length}</span>
              </div>
              <div class="w-px h-8 bg-[#242B36]"></div>
              <div>
                <span class="text-xs text-[#9AA0A6] block">Ketgan vaqt</span>
                <span class="text-xl font-mono font-extrabold text-[#F2C94C]">${mins}m ${secs}s</span>
              </div>
              <div class="w-px h-8 bg-[#242B36]"></div>
              <div>
                <span class="text-xs text-[#9AA0A6] block">Ko'rsatkich</span>
                <span class="text-xl font-mono font-extrabold ${passed ? 'text-[#F2C94C]' : 'text-[#EB5757]'}">${Math.round((score/20)*100)}%</span>
              </div>
            </div>

            <div class="flex items-center justify-center gap-4 flex-wrap">
              <button onclick="window.startTest(${typeof this.currentTicket === 'number' ? this.currentTicket : 1})" class="btn-primary text-xs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span>Qaytadan ishlash</span>
              </button>
              <button onclick="window.renderTicketSelection()" class="btn-secondary text-xs">
                Boshqa bilet tanlash
              </button>
            </div>
          </div>

          <h3 class="text-xl font-bold text-[#E8EAED] font-heading flex items-center gap-2">
            <span>Javoblar Tahlili</span>
          </h3>

          <div class="space-y-4">
      `;

      details.forEach((item, idx) => {
        const q = item.question;
        const isCorrect = item.isCorrect;

        html += `
          <div class="tech-card p-6 border-l-4 ${isCorrect ? 'border-l-[#F2C94C]' : 'border-l-[#EB5757]'}">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded ${isCorrect ? 'bg-[#171C24] text-[#F2C94C] border border-[#242B36]' : 'bg-[#171C24] text-[#EB5757] border border-[#242B36]'}">
                ${idx + 1}-savol • ${isCorrect ? "TO'G'RI" : "XATO"}
              </span>
            </div>

            <h4 class="text-base font-semibold text-[#E8EAED] mb-4 font-heading">${q.text}</h4>

            <div class="space-y-2 mb-4">
        `;

        q.options.forEach((opt, oIdx) => {
          let optStyle = 'background: #0B0F14; border: 1px solid #242B36; color: #9AA0A6;';
          let badge = '';

          if (oIdx === q.correctIndex) {
            optStyle = 'background: rgba(242, 201, 78, 0.08); border: 1px solid #F2C94C; color: #F2C94C; font-weight: 600;';
            badge = `<span class="text-xs bg-[#F2C94C] text-[#0B0F14] px-2 py-0.5 rounded font-bold">To'g'ri javob</span>`;
          } else if (oIdx === item.userAns && !isCorrect) {
            optStyle = 'background: rgba(235, 87, 87, 0.08); border: 1px solid #EB5757; color: #EB5757; font-weight: 600;';
            badge = `<span class="text-xs bg-[#EB5757] text-[#0B0F14] px-2 py-0.5 rounded font-bold">Sizning javobingiz</span>`;
          }

          html += `
            <div style="${optStyle}" class="p-3.5 rounded-md text-sm flex items-center justify-between gap-3">
              <span>${String.fromCharCode(65 + oIdx)}) ${opt}</span>
              ${badge}
            </div>
          `;
        });

        html += `
            </div>

            <div class="p-4 rounded-md bg-[#0B0F14] border border-[#242B36] text-xs text-[#9AA0A6]">
              <span class="font-bold text-[#F2C94C] block mb-1">Qoida tushuntirishi:</span>
              <p>${q.explanation}</p>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      this.container.innerHTML = html;
    }
  };
})();
