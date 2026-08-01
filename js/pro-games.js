(function() {
  // Helper: Build flat array of all questions from QUESTIONS_DATA (array of tickets)
  function getAllQuestions() {
    if (!window.QUESTIONS_DATA || !Array.isArray(window.QUESTIONS_DATA)) return [];
    let all = [];
    window.QUESTIONS_DATA.forEach(function(ticket) {
      if (Array.isArray(ticket.questions)) all = all.concat(ticket.questions);
    });
    return all;
  }

  window.ProGamesModule = {
    // ========================================
    // MARATHON MODE
    // ========================================
    startMarathon() {
      const allQs = getAllQuestions();
      if (!allQs.length) return alert("Savollar bazasi yuklanmadi!");
      const container = document.getElementById('app-main-content');
      this.marathonScore = 0;
      this.marathonQuestions = [...allQs].sort(() => Math.random() - 0.5); // shuffle
      this.marathonCurrentIdx = 0;
      this.renderMarathonQuestion(container);
    },

    renderMarathonQuestion(container) {
      const q = this.marathonQuestions[this.marathonCurrentIdx];
      
      let html = `
        <div class="fade-in max-w-3xl mx-auto py-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold font-heading text-[#F2C94C]">Marathon (Yiqilguncha)</h2>
            <div class="bg-[#171C24] border border-[#F2C94C] text-[#F2C94C] px-3 py-1 rounded font-mono font-bold">
              🔥 SCORE: ${this.marathonScore}
            </div>
          </div>
          <div class="tech-card p-8 text-center relative overflow-hidden">
            ${q.imageContent ? `<div class="mb-6 flex justify-center p-4 bg-[#0B0F14] rounded-lg border border-[#242B36]">${q.imageContent}</div>` : ''}
            <h3 class="text-xl font-bold text-[#E8EAED] mb-8 leading-relaxed font-heading text-left">${q.text}</h3>
            <div class="space-y-3 text-left">
      `;

      q.options.forEach((opt, idx) => {
        html += `
          <div onclick="window.ProGamesModule.selectMarathonOption(${idx})" class="p-4 rounded-lg bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] hover:border-[#F2C94C] cursor-pointer transition-colors flex items-center gap-4 group">
            <div class="w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold bg-[#171C24] text-[#9AA0A6] border border-[#242B36] group-hover:bg-[#F2C94C] group-hover:text-[#0B0F14]">${String.fromCharCode(65 + idx)}</div>
            <span class="text-sm font-medium">${opt}</span>
          </div>
        `;
      });

      html += `
            </div>
            <button onclick="window.switchTab('profile')" class="mt-8 text-xs text-[#EB5757] hover:underline font-bold">Tugatish va chiqish</button>
          </div>
        </div>
      `;
      container.innerHTML = html;
    },

    selectMarathonOption(idx) {
      const q = this.marathonQuestions[this.marathonCurrentIdx];
      if (idx === q.correctIndex) {
        this.marathonScore++;
        this.marathonCurrentIdx++;
        if (this.marathonCurrentIdx >= this.marathonQuestions.length) {
          alert("Siz barcha savollarni to'g'ri topdingiz! Daho!");
          window.switchTab('profile');
        } else {
          // Add small green flash effect on body
          document.body.style.boxShadow = "inset 0 0 50px rgba(39, 174, 96, 0.2)";
          setTimeout(() => document.body.style.boxShadow = "none", 300);
          this.renderMarathonQuestion(document.getElementById('app-main-content'));
        }
      } else {
        // FAIL
        document.body.style.boxShadow = "inset 0 0 50px rgba(235, 87, 87, 0.3)";
        setTimeout(() => document.body.style.boxShadow = "none", 500);
        
        document.getElementById('app-main-content').innerHTML = `
          <div class="fade-in max-w-xl mx-auto py-16 text-center">
            <div class="tech-card p-10">
              <div class="w-20 h-20 mx-auto rounded-full bg-[#171C24] border border-[#EB5757] flex items-center justify-center text-3xl mb-6 text-[#EB5757]">💥</div>
              <h2 class="text-3xl font-extrabold text-[#EB5757] mb-2 font-heading">YIQILDINGIZ!</h2>
              <p class="text-[#9AA0A6] mb-8">Siz noto'g'ri javob berdingiz.</p>
              
              <div class="bg-[#0B0F14] border border-[#242B36] p-6 rounded-lg mb-8">
                <span class="text-xs text-[#9AA0A6] block mb-2 uppercase font-bold">Sizning Rekordingiz</span>
                <span class="text-5xl font-heading font-extrabold text-[#F2C94C]">${this.marathonScore}</span>
                <span class="text-sm text-[#9AA0A6] ml-2">ta savol</span>
              </div>
              
              <div class="flex items-center justify-center gap-4">
                <button onclick="window.ProGamesModule.startMarathon()" class="btn-primary text-xs py-2 px-6">Qaytadan boshlash</button>
                <button onclick="window.switchTab('profile')" class="btn-secondary text-xs py-2 px-6">Profilga qaytish</button>
              </div>
            </div>
          </div>
        `;
      }
    },

    // ========================================
    // PvP DUEL MODE (Simulated Bot)
    // ========================================
    startPvP() {
      const allQs = getAllQuestions();
      if (!allQs.length) return alert("Savollar bazasi yuklanmadi!");
      this.pvpQuestions = [...allQs].sort(() => Math.random() - 0.5).slice(0, 10);
      this.pvpCurrentIdx = 0;
      this.playerScore = 0;
      this.botScore = 0;
      
      const botNames = ['🏎️ F1_Racer', '🚗 Shohruh_99', '🚙 AvtoExpert', '🚓 YPX_Nazorat', '🚕 Taxi_Tashkent'];
      this.botName = botNames[Math.floor(Math.random() * botNames.length)];
      
      this.renderPvPLobby(document.getElementById('app-main-content'));
    },

    renderPvPLobby(container) {
      container.innerHTML = `
        <div class="fade-in max-w-2xl mx-auto py-16 text-center">
          <div class="tech-card p-10 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 z-0"></div>
            <div class="relative z-10">
              <h2 class="text-3xl font-extrabold font-heading text-[#E8EAED] mb-8">PvP Duel Qidirilmoqda...</h2>
              <div class="flex items-center justify-center gap-12 mb-8">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-[#171C24] border-2 border-[#F2C94C] flex items-center justify-center text-xl text-[#F2C94C]">Siz</div>
                  <span class="text-sm font-bold text-[#F2C94C]">Siz</span>
                </div>
                <span class="text-3xl font-black italic text-[#EB5757]">VS</span>
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-[#171C24] border-2 border-[#242B36] flex items-center justify-center text-xl text-[#9AA0A6] animate-pulse">?</div>
                  <span class="text-sm font-bold text-[#9AA0A6]">Qidirilmoqda</span>
                </div>
              </div>
              <div class="spinner w-8 h-8 border-2 mx-auto"></div>
            </div>
          </div>
        </div>
      `;

      setTimeout(() => {
        container.innerHTML = `
          <div class="fade-in max-w-2xl mx-auto py-16 text-center">
            <div class="tech-card p-10 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-[#F2C94C]/10 to-[#EB5757]/10 z-0"></div>
              <div class="relative z-10">
                <h2 class="text-3xl font-extrabold font-heading text-[#E8EAED] mb-8">Raqib Topildi!</h2>
                <div class="flex items-center justify-center gap-12 mb-8">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-[#171C24] border-2 border-[#F2C94C] flex items-center justify-center text-xl text-[#F2C94C]">Siz</div>
                    <span class="text-sm font-bold text-[#F2C94C]">Siz</span>
                  </div>
                  <span class="text-3xl font-black italic text-[#EB5757]">VS</span>
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-[#171C24] border-2 border-[#EB5757] flex items-center justify-center text-xl">🤖</div>
                    <span class="text-sm font-bold text-[#EB5757]">${this.botName}</span>
                  </div>
                </div>
                <button onclick="window.ProGamesModule.startPvPMatch()" class="btn-primary text-sm py-3 px-8">JANGNI BOSHLASH</button>
              </div>
            </div>
          </div>
        `;
      }, 2000);
    },

    startPvPMatch() {
      // Start Bot simulation loop
      this.pvpBotInterval = setInterval(() => {
        // Bot has 75% chance to get it right, every 3-6 seconds
        if (this.pvpCurrentIdx < this.pvpQuestions.length) {
          if (Math.random() > 0.25) {
            this.botScore++;
            this.updatePvPProgress();
          }
        }
      }, 4000);

      this.renderPvPQuestion();
    },

    renderPvPQuestion() {
      if (this.pvpCurrentIdx >= this.pvpQuestions.length) {
        return this.finishPvP();
      }

      const q = this.pvpQuestions[this.pvpCurrentIdx];
      const container = document.getElementById('app-main-content');
      
      let html = `
        <div class="fade-in max-w-4xl mx-auto py-6">
          
          <!-- PvP Progress Bar Top -->
          <div class="tech-card p-4 mb-6 flex items-center gap-6 sticky top-24 z-10">
            <div class="flex-1">
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-[#F2C94C]">SIZ: ${this.playerScore}</span>
              </div>
              <div class="w-full bg-[#171C24] h-2 rounded-full overflow-hidden">
                <div class="bg-[#F2C94C] h-2 rounded-full transition-all duration-300" style="width: ${(this.playerScore / 10) * 100}%" id="pvp-player-bar"></div>
              </div>
            </div>
            <span class="font-heading font-black italic text-lg text-[#242B36]">VS</span>
            <div class="flex-1 text-right">
              <div class="flex justify-between text-xs font-bold mb-1 flex-row-reverse">
                <span class="text-[#EB5757]">${this.botName}: <span id="pvp-bot-score">${this.botScore}</span></span>
              </div>
              <div class="w-full bg-[#171C24] h-2 rounded-full overflow-hidden flex justify-end">
                <div class="bg-[#EB5757] h-2 rounded-full transition-all duration-300" style="width: ${(this.botScore / 10) * 100}%" id="pvp-bot-bar"></div>
              </div>
            </div>
          </div>

          <div class="tech-card p-8 text-center relative">
            <span class="absolute top-4 right-4 text-xs font-mono font-bold text-[#9AA0A6]">${this.pvpCurrentIdx + 1} / 10</span>
            ${q.imageContent ? `<div class="mb-6 flex justify-center p-4 bg-[#0B0F14] rounded-lg border border-[#242B36]">${q.imageContent}</div>` : ''}
            <h3 class="text-xl font-bold text-[#E8EAED] mb-8 leading-relaxed font-heading text-left">${q.text}</h3>
            <div class="space-y-3 text-left">
      `;

      q.options.forEach((opt, idx) => {
        html += `
          <div onclick="window.ProGamesModule.selectPvPOption(${idx})" class="p-4 rounded-lg bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] hover:border-[#F2C94C] cursor-pointer transition-colors flex items-center gap-4 group">
            <div class="w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold bg-[#171C24] text-[#9AA0A6] border border-[#242B36] group-hover:bg-[#F2C94C] group-hover:text-[#0B0F14]">${String.fromCharCode(65 + idx)}</div>
            <span class="text-sm font-medium">${opt}</span>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
      container.innerHTML = html;
    },

    selectPvPOption(idx) {
      const q = this.pvpQuestions[this.pvpCurrentIdx];
      if (idx === q.correctIndex) {
        this.playerScore++;
      }
      this.pvpCurrentIdx++;
      this.renderPvPQuestion();
    },

    updatePvPProgress() {
      const botBar = document.getElementById('pvp-bot-bar');
      const botScoreText = document.getElementById('pvp-bot-score');
      if (botBar && botScoreText) {
        botBar.style.width = `${(this.botScore / 10) * 100}%`;
        botScoreText.textContent = this.botScore;
      }
    },

    finishPvP() {
      clearInterval(this.pvpBotInterval);
      const isWin = this.playerScore > this.botScore;
      const isDraw = this.playerScore === this.botScore;
      
      let title = isWin ? "G'ALABA! 🏆" : (isDraw ? "DURANG! 🤝" : "MAG'LUBIYAT 💥");
      let color = isWin ? "text-[#F2C94C]" : (isDraw ? "text-[#2D9CDB]" : "text-[#EB5757]");

      document.getElementById('app-main-content').innerHTML = `
        <div class="fade-in max-w-xl mx-auto py-16 text-center">
          <div class="tech-card p-10">
            <h2 class="text-4xl font-extrabold ${color} mb-8 font-heading">${title}</h2>
            
            <div class="flex justify-center items-center gap-8 mb-10">
              <div class="text-center">
                <span class="block text-xs font-bold text-[#9AA0A6] mb-2 uppercase">Siz</span>
                <span class="text-5xl font-black text-[#F2C94C]">${this.playerScore}</span>
              </div>
              <span class="text-2xl font-bold text-[#242B36]">-</span>
              <div class="text-center">
                <span class="block text-xs font-bold text-[#9AA0A6] mb-2 uppercase">${this.botName}</span>
                <span class="text-5xl font-black text-[#EB5757]">${this.botScore}</span>
              </div>
            </div>

            <div class="flex items-center justify-center gap-4">
              <button onclick="window.ProGamesModule.startPvP()" class="btn-primary text-xs py-2 px-6">Qaytadan O'ynash</button>
              <button onclick="window.switchTab('profile')" class="btn-secondary text-xs py-2 px-6">Profilga Qaytish</button>
            </div>
          </div>
        </div>
      `;
    },

    // ========================================
    // CROSSROADS MINIGAME
    // ========================================
    startCrossroads() {
      this.crLevels = [
        {
          title: "Oddiy Chorraha (Tartibga solinmagan)",
          desc: "Barcha mashinalar o'tish tartibini belgilang.",
          cars: ["Qizil", "Ko'k", "Yashil"],
          correctOrder: ["Yashil", "Qizil", "Ko'k"],
          hint: "O'ng qo'l qoidasi: O'ng tomondan kelayotgan mashinaga yo'l beriladi."
        },
        {
          title: "Asosiy Yo'l belgisi",
          desc: "Qaysi mashinalar birinchi o'tadi?",
          cars: ["Tez yordam", "Qizil (Asosiy)", "Ko'k (Ikkinchi darajali)"],
          correctOrder: ["Qizil (Asosiy)", "Ko'k (Ikkinchi darajali)", "Tez yordam"],
          hint: "Asosiy yo'ldagi avtomobil birinchi o'tadi. Tez yordam chirog'isiz imtiyozga ega emas."
        }
      ];
      this.crCurrentLvl = 0;
      this.renderCrossroads();
    },

    renderCrossroads() {
      if (this.crCurrentLvl >= this.crLevels.length) {
        return document.getElementById('app-main-content').innerHTML = `
          <div class="fade-in max-w-xl mx-auto py-16 text-center">
            <div class="tech-card p-10">
              <h2 class="text-3xl font-extrabold text-[#F2C94C] mb-4 font-heading">Chorraha Ustasi! 🏆</h2>
              <p class="text-[#9AA0A6] mb-8">Barcha xarita va vaziyatlarni to'g'ri yechdingiz.</p>
              <button onclick="window.switchTab('profile')" class="btn-primary text-xs py-2 px-6">Profilga qaytish</button>
            </div>
          </div>
        `;
      }

      const lvl = this.crLevels[this.crCurrentLvl];
      this.crSelectedOrder = [];

      window.ProGamesModule._updateCRView = () => {
        const container = document.getElementById('app-main-content');
        
        let html = `
          <div class="fade-in max-w-2xl mx-auto py-8 text-center">
            <h2 class="text-2xl font-bold font-heading text-[#E8EAED] mb-2">${lvl.title}</h2>
            <p class="text-[#9AA0A6] text-sm mb-6">${lvl.desc}</p>
            
            <div class="w-full h-64 bg-[#171C24] border border-[#242B36] rounded-xl mb-8 relative flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden">
              <div class="absolute w-full h-12 bg-[#242B36] transform rotate-90"></div>
              <div class="absolute w-full h-12 bg-[#242B36]"></div>
              <div class="absolute w-12 h-12 bg-[#0B0F14] flex items-center justify-center">
                <span class="text-[10px] text-[#9AA0A6]">Chorraha</span>
              </div>
            </div>

            <div class="bg-[#0B0F14] border border-[#242B36] p-6 rounded-lg text-left mb-6">
              <h3 class="text-sm font-bold text-[#F2C94C] mb-4 uppercase">Tartibni tanlang (Ustiga bosing):</h3>
              <div class="flex flex-wrap gap-3 mb-6" id="cr-available">
                ${lvl.cars.filter(c => !this.crSelectedOrder.includes(c)).map(c => `
                  <button onclick="window.ProGamesModule.selectCar('${c}')" class="px-4 py-2 bg-[#171C24] border border-[#242B36] rounded font-semibold text-sm hover:border-[#F2C94C] transition-colors text-[#E8EAED]">${c}</button>
                `).join('')}
              </div>

              <h3 class="text-sm font-bold text-[#2D9CDB] mb-2 uppercase">Sizning javobingiz:</h3>
              <div class="flex flex-wrap gap-2 min-h-[40px] p-2 bg-[#171C24] border border-[#242B36] rounded items-center">
                ${this.crSelectedOrder.length === 0 ? '<span class="text-xs text-[#9AA0A6] italic ml-2">Hali hech narsa tanlanmadi</span>' : ''}
                ${this.crSelectedOrder.map((c, i) => `
                  <div class="flex items-center gap-1 bg-[#2D9CDB]/20 border border-[#2D9CDB] text-[#2D9CDB] px-3 py-1 rounded text-sm font-bold">
                    <span>${i+1}. ${c}</span>
                    <button onclick="window.ProGamesModule.removeCar('${c}')" class="ml-2 hover:text-[#E8EAED]">✕</button>
                  </div>
                `).join(`
                  <svg class="w-4 h-4 text-[#9AA0A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                `)}
              </div>
            </div>

            <div class="flex items-center justify-between">
              <button onclick="alert('${lvl.hint}')" class="text-xs text-[#9AA0A6] hover:text-[#E8EAED] underline">💡 Yordam so'rash</button>
              <button onclick="window.ProGamesModule.checkCrossroads()" class="btn-primary text-xs py-2 px-6" ${this.crSelectedOrder.length !== lvl.cars.length ? 'disabled style="opacity:0.5"' : ''}>Tekshirish</button>
            </div>
          </div>
        `;
        if (container) container.innerHTML = html;
      };

      this._updateCRView();
    },

    selectCar(carName) {
      this.crSelectedOrder.push(carName);
      this._updateCRView();
    },
    
    removeCar(carName) {
      this.crSelectedOrder = this.crSelectedOrder.filter(c => c !== carName);
      this._updateCRView();
    },

    checkCrossroads() {
      const lvl = this.crLevels[this.crCurrentLvl];
      let isCorrect = true;
      for (let i = 0; i < lvl.correctOrder.length; i++) {
        if (this.crSelectedOrder[i] !== lvl.correctOrder[i]) isCorrect = false;
      }

      if (isCorrect) {
        alert("To'g'ri! Keyingi vaziyatga o'tamiz.");
        this.crCurrentLvl++;
        this.renderCrossroads();
      } else {
        alert("Xato ketma-ketlik! Qoidani eslang:\n" + lvl.hint);
        this.crSelectedOrder = [];
        this._updateCRView();
      }
    },

    // ========================================
    // SMART MISTAKES TEST (Accumulator)
    // ========================================
    startMistakesTest() {
      const history = window.StorageManager.getHistory();
      const allQs = getAllQuestions();
      if (!history || history.length === 0 || !allQs.length) return alert("Xatolar bazasi bo'sh!");
      
      let mistakenQuestions = [];
      
      history.forEach(testRun => {
        if (testRun.ticketId !== 'Random' && testRun.ticketId !== 'Mistakes') {
          const ticketData = window.QUESTIONS_DATA.find(t => t.ticketId == testRun.ticketId);
          if (!ticketData) return;
          const ticketQuestions = ticketData.questions;
          
          if (testRun.answers) {
            ticketQuestions.forEach((q, idx) => {
              const userAns = testRun.answers[idx];
              if (userAns !== undefined && userAns !== q.correctIndex) {
                if (!mistakenQuestions.find(mq => mq.text === q.text)) {
                  mistakenQuestions.push(q);
                }
              }
            });
          }
        }
      });

      if (mistakenQuestions.length === 0) {
        // Use random questions as fallback (no history yet)
        mistakenQuestions = [...allQs].sort(() => Math.random() - 0.5).slice(0, 10);
      }

      window.TestEngine.currentTicket = 'XATOLAR';
      window.TestEngine.currentQuestions = mistakenQuestions.sort(() => Math.random() - 0.5).slice(0, 20);
      window.TestEngine.userAnswers = {};
      window.TestEngine.currentIndex = 0;
      window.TestEngine.timeLeft = 1200;
      window.switchTab('test');
      window.TestEngine.startTimer();
      window.TestEngine.renderQuestionView();
    }
  };
})();
