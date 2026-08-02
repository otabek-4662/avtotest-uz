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
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border);margin-bottom:0.75rem;">
              IMTIHON SIMULYATSIYASI
            </span>
            <h2 class="section-title mb-2" style="color:var(--text)">PDD Test Biletini Tanlang</h2>
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
              <div class="w-10 h-10 rounded-md font-mono font-bold text-sm mb-4 flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                #0${t.ticketId}
              </div>
              <h3 class="text-lg font-bold mb-1 font-heading" style="color:var(--text)">Bilet ${t.ticketId}</h3>
              <p class="text-xs mb-4" style="color:var(--text-muted)">${t.questions.length} ta savol • Standard format</p>
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
            <div class="w-10 h-10 rounded-md font-mono font-bold text-sm mb-4 flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
              <svg class="w-5 h-5" style="color:var(--primary)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-1 font-heading" style="color:var(--text)">Tasodifiy Test</h3>
            <p class="text-xs mb-4" style="color:var(--text-muted)">20 ta tasodifiy savollar to'plami</p>
          </div>
          <button class="btn-secondary w-full text-xs py-2">
            <span>Aralash Boshlash</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      `;

      let userObj = null;
      try {
          userObj = JSON.parse(localStorage.getItem('avtotest_user'));
      } catch(e) {}

      if (userObj && userObj.isPro) {
          html += `
          <div class="tech-card flex flex-col justify-between cursor-pointer group mt-6 border-[#EB5757]/50 bg-gradient-to-r from-[rgba(235,87,87,0.05)] to-transparent" onclick="window.startMistakesTest()">
            <div>
              <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#EB5757] flex items-center justify-center font-mono font-bold text-sm mb-4">
                <svg class="w-5 h-5 text-[#EB5757]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 class="text-lg font-bold text-[#E8EAED] mb-1 font-heading flex items-center gap-2">
                Xatolar ustida ishlash
                <span class="text-[10px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-1.5 py-0.5 rounded font-bold">PRO</span>
              </h3>
              <p class="text-xs text-[#9AA0A6] mb-4">Oldingi testlarda xato qilingan savollarni qayta ishlash</p>
            </div>
            <button class="btn-secondary w-full text-xs py-2 text-[#EB5757] border-[#EB5757]/30 hover:bg-[#EB5757] hover:text-white">
              <span>Xatolarni to'g'irlash</span>
            </button>
          </div>
          `;
      }

      html += `
      </div>
      `;

      const stats = window.StorageManager.getStatsSummary();
      html += `
        <div class="tech-card max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-md flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold" style="color:var(--text)">Sizning Imtihon Tarixingiz</h4>
              <p class="text-xs" style="color:var(--text-muted)">Jami: ${stats.totalTests} ta • O'rtacha ball: ${stats.averageScore}/20</p>
            </div>
          </div>
          <button onclick="window.switchTab('stats')" class="text-xs font-semibold hover:underline" style="color:var(--primary)">Batafsil statistika →</button>
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

    startMistakesTest() {
        const history = window.StorageManager.getHistory();
        let mistakes = [];
        
        history.forEach(item => {
            if(item.ticketId === 'Random' || item.ticketId === 'Mistakes') return;
            const ticket = this.questionsData.find(t => t.ticketId === item.ticketId);
            if(!ticket) return;
            
            Object.keys(item.answers || {}).forEach(idxStr => {
                const idx = parseInt(idxStr);
                const userAns = item.answers[idx];
                const q = ticket.questions[idx];
                if(q && userAns !== q.correctIndex) {
                    if(!mistakes.find(mq => mq.text === q.text)) {
                        mistakes.push(q);
                    }
                }
            });
        });
        
        if (mistakes.length === 0) {
            alert("Sizda xatolar tarixi topilmadi. Juda zo'r natija!");
            return;
        }
        
        mistakes = mistakes.sort(() => 0.5 - Math.random()).slice(0, 20);
        
        this.currentTicket = 'Mistakes';
        this.currentQuestions = mistakes;
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
        el.style.color = 'var(--danger)';
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
              <span class="text-xs font-mono font-bold px-3 py-1 rounded" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                ${this.currentTicket === 'Random' ? 'Tasodifiy Bilet' : 'Bilet #' + this.currentTicket}
              </span>
            </div>

            <!-- Question Numbers -->
            <div class="flex items-center gap-1.5 flex-wrap">
      `;

      this.currentQuestions.forEach((_, idx) => {
        let statusStyle = 'background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border);';
        if (this.userAnswers[idx] !== undefined) {
          statusStyle = 'background: var(--primary); color: var(--bg); border: 1px solid var(--primary); font-weight: bold;';
        }
        if (idx === this.currentIndex) {
          statusStyle += ' outline: 2px solid var(--primary); outline-offset: 1px;';
        }
        html += `
          <button onclick="window.goToQuestion(${idx})" style="${statusStyle}" class="w-8 h-8 rounded text-xs flex items-center justify-center transition-all">
            ${idx + 1}
          </button>
        `;
      });

      html += `
            </div>

            <div class="flex items-center gap-2 px-4 py-2 rounded-md" style="background:var(--surface-2);border:1px solid var(--border)">
              <svg class="w-4 h-4" style="color:var(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span id="test-timer-display" class="font-mono font-bold text-sm" style="color:var(--primary)">${mins}:${secs}</span>
            </div>
          </div>

          <!-- Question Card -->
          <div class="tech-card p-6 sm:p-8">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono font-semibold" style="color:var(--text-muted)">Savol ${this.currentIndex + 1} / ${this.currentQuestions.length}</span>
              <span class="text-xs font-medium" style="color:var(--primary)">Bitta javobni tanlang</span>
            </div>

            ${q.imageContent ? `
              <div class="mb-6 flex justify-center p-4 rounded-lg" style="background:var(--bg);border:1px solid var(--border)">
                ${q.imageContent}
              </div>
            ` : ''}

            <h3 class="text-lg sm:text-xl font-bold mb-6 leading-relaxed font-heading" style="color:var(--text)">
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
              <div class="w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold" style="${selected ? 'background:var(--primary);color:var(--bg)' : 'background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)'}">
                ${optionLetter}
              </div>
              <span class="text-sm font-medium" style="color:var(--text)">${opt}</span>
            </div>
          </div>
        `;
      });

      html += `
            </div>

            <div class="flex items-center justify-between pt-6" style="border-top:1px solid var(--border)">
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

      // Save wrong question IDs for PRO Error Bank
      const wrongIds = details.filter(d => !d.isCorrect && d.question && d.question.id).map(d => d.question.id);
      if (wrongIds.length > 0) {
        try {
          const existing = JSON.parse(localStorage.getItem('avtotest_wrong_questions') || '[]');
          const combined = Array.from(new Set([...existing, ...wrongIds]));
          localStorage.setItem('avtotest_wrong_questions', JSON.stringify(combined));
        } catch(e) {}
      }

      window.bookmarkQuestion = (id) => {
        try {
          const existing = JSON.parse(localStorage.getItem('avtotest_bookmarks') || '[]');
          if (!existing.includes(id)) {
            existing.push(id);
            localStorage.setItem('avtotest_bookmarks', JSON.stringify(existing));
            alert("⭐ Savol Saqlanganlar (Bookmarks) ro'yxatiga qo'shildi!");
          } else {
            alert("⭐ Ushbu savol allaqachon saqlangan!");
          }
        } catch(e) {}
      };

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
            <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4" style="background:var(--surface-2);border:1px solid var(--border);color:var(--primary)">
              ${passed ? 'PASSED' : 'FAILED'}
            </div>

            <h2 class="text-3xl font-extrabold mb-2 font-heading" style="color:${passed ? 'var(--primary)' : 'var(--danger)'}">
              ${passed ? "IMTIHONDAN O'TDINGIZ!" : "IMTIHONDAN O'TA OLMADINGIZ"}
            </h2>
            <p class="muted-text max-w-md mx-auto mb-6">
              ${passed ? "Tabriklaymiz! Siz O'zbekiston PDD imtihoni me'yoriy talabini (kamida 18 ball) bajardingiz." : "Xatolaringizni ko'rib chiqing va qaytadan harakat qiling."}
            </p>

            <div class="inline-flex items-center justify-center gap-8 px-6 py-4 rounded-lg mb-6 flex-wrap" style="background:var(--bg);border:1px solid var(--border)">
              <div>
                <span class="text-xs block" style="color:var(--text-muted)">Natija</span>
                <span class="text-xl font-mono font-extrabold" style="color:var(--text)">${score} / ${this.currentQuestions.length}</span>
              </div>
              <div class="w-px h-8" style="background:var(--border)"></div>
              <div>
                <span class="text-xs block" style="color:var(--text-muted)">Ketgan vaqt</span>
                <span class="text-xl font-mono font-extrabold" style="color:var(--primary)">${mins}m ${secs}s</span>
              </div>
              <div class="w-px h-8" style="background:var(--border)"></div>
              <div>
                <span class="text-xs block" style="color:var(--text-muted)">Ko'rsatkich</span>
                <span class="text-xl font-mono font-extrabold" style="color:${passed ? 'var(--primary)' : 'var(--danger)'}">${Math.round((score/20)*100)}%</span>
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

          <h3 class="text-xl font-bold font-heading flex items-center gap-2" style="color:var(--text)">
            <span>Javoblar Tahlili</span>
          </h3>

          <div class="space-y-4">
      `;

      details.forEach((item, idx) => {
        const q = item.question;
        const isCorrect = item.isCorrect;

        html += `
          <div class="tech-card p-6 border-l-4" style="border-left-color:${isCorrect ? 'var(--primary)' : 'var(--danger)'}">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded" style="background:var(--surface-2);color:${isCorrect ? 'var(--primary)' : 'var(--danger)'};border:1px solid var(--border)">
                ${idx + 1}-savol • ${isCorrect ? "TO'G'RI" : "XATO"}
              </span>
            </div>

            <h4 class="text-base font-semibold mb-4 font-heading" style="color:var(--text)">${q.text}</h4>

            <div class="space-y-2 mb-4">
        `;

        q.options.forEach((opt, oIdx) => {
          let optStyle = 'background: var(--bg); border: 1px solid var(--border); color: var(--text-muted);';
          let badge = '';

          if (oIdx === q.correctIndex) {
            optStyle = 'background: rgba(242, 201, 78, 0.12); border: 1px solid var(--primary); color: var(--primary); font-weight: 600;';
            badge = `<span class="text-xs px-2 py-0.5 rounded font-bold" style="background:var(--primary);color:var(--bg)">To'g'ri javob</span>`;
          } else if (oIdx === item.userAns && !isCorrect) {
            optStyle = 'background: rgba(235, 87, 87, 0.12); border: 1px solid var(--danger); color: var(--danger); font-weight: 600;';
            badge = `<span class="text-xs px-2 py-0.5 rounded font-bold" style="background:var(--danger);color:var(--bg)">Sizning javobingiz</span>`;
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

            <div class="p-4 rounded-md text-xs" style="background:var(--bg);border:1px solid var(--border);color:var(--text-muted)">
              <span class="font-bold block mb-1" style="color:var(--primary)">Qoida tushuntirishi:</span>
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
