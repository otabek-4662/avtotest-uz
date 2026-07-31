(function() {
  window.SignsModule = {
    signsData: [],
    activeCategory: 'all',
    searchQuery: '',
    flashcardList: [],
    flashcardIndex: 0,
    flashcardFlipped: false,

    init(containerEl) {
      this.container = containerEl;
      this.signsData = window.SIGNS_DATA || [];
      this.renderInitialLayout();
    },

    setCategory(cat) {
      this.activeCategory = cat;
      const buttons = this.container.querySelectorAll('.cat-btn');
      buttons.forEach(btn => {
        if (btn.dataset.category === cat) {
          btn.className = 'cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all';
          btn.style.cssText = 'background:var(--primary);color:var(--bg)';
        } else {
          btn.className = 'cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all hover-surface';
          btn.style.cssText = 'background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)';
        }
      });
      this.renderCardsGrid();
    },

    setSearch(query) {
      this.searchQuery = query.toLowerCase().trim();
      const input = document.getElementById('sign-search-input');
      const start = input ? input.selectionStart : null;
      const end = input ? input.selectionEnd : null;

      this.renderCardsGrid();

      if (input) {
        input.focus();
        if (start !== null && end !== null) {
          try { input.setSelectionRange(start, end); } catch (e) {}
        }
      }
    },

    renderInitialLayout() {
      let html = `
        <div class="fade-in max-w-6xl mx-auto py-4 space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="text-left">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border);margin-bottom:0.75rem;">
                KATALOG & SPRAVOCHNIK
              </span>
              <h2 class="section-title mb-1" style="color:var(--text)">O'zbekiston Yo'l Belgilari va Chiziqlari</h2>
              <p class="muted-text max-w-xl">
                Barcha toifadagi belgilar, qoidalar va imtihon savollaridagi qo'llanilish chastotasi.
              </p>
            </div>

            <!-- FLASHCARD PRACTICE BUTTON -->
            <button onclick="window.SignsModule.openFlashcardModal()" class="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              <span>🎴 Flesh-karta Yodlash Mashqi</span>
            </button>
          </div>

          <!-- SEARCH & CATEGORY FILTERS -->
          <div class="tech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-80 search-container">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 search-icon" style="color:var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                id="sign-search-input"
                type="text" 
                placeholder="Belgi nomi yoki raqamini izlang..." 
                value="${this.searchQuery}"
                oninput="window.filterSigns(this.value)"
                class="search-input w-full pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none"
              />
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button data-category="all" onclick="window.selectSignCategory('all')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--primary);color:var(--bg)">
                Barchasi
              </button>
              <button data-category="ogohlantiruvchi" onclick="window.selectSignCategory('ogohlantiruvchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Ogohlantiruvchi
              </button>
              <button data-category="ustunlik" onclick="window.selectSignCategory('ustunlik')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Imtiyoz
              </button>
              <button data-category="taqiqlovchi" onclick="window.selectSignCategory('taqiqlovchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Taqiqlovchi
              </button>
              <button data-category="buyuruvchi" onclick="window.selectSignCategory('buyuruvchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Buyuruvchi
              </button>
              <button data-category="axborot" onclick="window.selectSignCategory('axborot')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Axborot
              </button>
              <button data-category="servis" onclick="window.selectSignCategory('servis')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Servis
              </button>
              <button data-category="qoshimcha" onclick="window.selectSignCategory('qoshimcha')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Qo'shimcha
              </button>
              <button data-category="chiziqlar" onclick="window.selectSignCategory('chiziqlar')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Yo'l chiziqlari
              </button>
            </div>
          </div>

          <div id="signs-grid-container" class="space-y-10">
          </div>
        </div>

        <!-- DETAIL MODAL -->
        <div id="sign-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.6)">
          <div class="tech-card p-8 max-w-lg w-full relative" style="border:1px solid var(--border)">
            <button onclick="window.closeSignModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold transition-colors" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
              ✕
            </button>
            <div id="sign-modal-icon" class="flex justify-center mb-6"></div>
            <div class="text-center">
              <span id="sign-modal-id" class="inline-block text-xs font-mono font-bold px-3 py-1 rounded mb-2" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)"></span>
              <h3 id="sign-modal-title" class="text-xl font-bold mb-4 font-heading" style="color:var(--text)"></h3>
              <p id="sign-modal-desc" class="text-sm leading-relaxed p-4 rounded-md text-left" style="color:var(--text-muted);background:var(--bg);border:1px solid var(--border)"></p>
            </div>
          </div>
        </div>

        <!-- FLASHCARD PRACTICE MODAL -->
        <div id="sign-flashcard-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.7)">
          <div class="tech-card p-6 max-w-md w-full relative text-center" style="border:1px solid var(--border)">
            <button onclick="window.SignsModule.closeFlashcardModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
              ✕
            </button>

            <div class="mb-4 text-left">
              <span class="text-xs font-mono font-bold" style="color:var(--primary)">🎴 Flesh-karta Mashqi</span>
              <span id="fc-progress" class="text-xs float-right font-mono" style="color:var(--text-muted)">1 / 10</span>
            </div>

            <!-- FLIP CARD -->
            <div id="fc-card" onclick="window.SignsModule.flipFlashcard()" class="p-8 rounded-xl cursor-pointer transition-all duration-300 min-h-[240px] flex flex-col items-center justify-center border group" style="background:var(--surface-2);border-color:var(--border)">
              <div id="fc-card-content">
                <!-- Injected via JS -->
              </div>
              <span class="text-[10px] uppercase tracking-wider font-bold mt-4 opacity-60" style="color:var(--primary)">👇 Kartani aylantirish uchun bosing</span>
            </div>

            <!-- CONTROLS -->
            <div class="flex items-center justify-between gap-3 mt-6">
              <button onclick="window.SignsModule.prevFlashcard()" class="btn-secondary w-1/2 text-xs py-2">
                ← Oldingisi
              </button>
              <button onclick="window.SignsModule.nextFlashcard()" class="btn-primary w-1/2 text-xs py-2">
                Keyingisi →
              </button>
            </div>
          </div>
        </div>
      `;

      this.container.innerHTML = html;
      this.renderCardsGrid();
    },

    renderCardsGrid() {
      const gridEl = document.getElementById('signs-grid-container');
      if (!gridEl) return;

      let html = '';
      let totalMatchCount = 0;

      this.signsData.forEach(catGroup => {
        if (this.activeCategory !== 'all' && catGroup.category !== this.activeCategory) return;

        const filteredItems = catGroup.items.filter(item => {
          if (!this.searchQuery) return true;
          return item.name.toLowerCase().includes(this.searchQuery) ||
                 item.id.toLowerCase().includes(this.searchQuery) ||
                 item.desc.toLowerCase().includes(this.searchQuery);
        });

        if (filteredItems.length === 0) return;
        totalMatchCount += filteredItems.length;

        html += `
          <div>
            <div class="mb-4">
              <h3 class="text-lg font-bold font-heading flex items-center gap-2" style="color:var(--text)">
                <span>${catGroup.categoryTitle}</span>
                <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">${filteredItems.length} ta belgi</span>
              </h3>
              <p class="text-xs" style="color:var(--text-muted)">${catGroup.description}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        `;

        filteredItems.forEach(sign => {
          const usedCount = sign.usedInQuestions || 1;
          html += `
            <div class="tech-card p-5 flex flex-col justify-between items-center text-center group cursor-pointer sign-card-item hover:-translate-y-1 transition-all" 
                 onclick="window.SignsModule.openModal('${sign.id}')">
              <div class="flex flex-col items-center w-full">
                <div class="mb-4 transform group-hover:scale-105 transition-transform duration-200">
                  ${sign.icon}
                </div>
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded mb-2" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">${sign.id}</span>
                <h4 class="text-sm font-bold mb-2 line-clamp-2 font-heading" style="color:var(--text)">${sign.name}</h4>
                <p class="text-xs line-clamp-2 leading-relaxed mb-3" style="color:var(--text-muted)">${sign.desc}</p>
              </div>

              <!-- USAGE BADGE (matches avto-test.uz style) -->
              <div class="w-full pt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium rounded-md" style="border-top:1px solid var(--border);color:var(--text-muted)">
                <svg class="w-3.5 h-3.5" style="color:var(--primary)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span>${usedCount} ta savolda ishlatilgan</span>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      if (totalMatchCount === 0) {
        html = `
          <div class="tech-card p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3" style="background:var(--surface-2);color:var(--text-muted)">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-base font-bold mb-1 font-heading" style="color:var(--text)">Hech narsa topilmadi</h3>
            <p class="text-xs" style="color:var(--text-muted)">"${this.searchQuery}" bo'yicha hech qanday yo'l belgisi mavjud emas.</p>
          </div>
        `;
      }

      gridEl.innerHTML = html;
    },

    openModal(id) {
      let foundItem = null;
      for (const group of this.signsData) {
        const item = group.items.find(i => i.id === id);
        if (item) { foundItem = item; break; }
      }

      if (!foundItem) return;

      const modal = document.getElementById('sign-detail-modal');
      const iconEl = document.getElementById('sign-modal-icon');
      const idEl = document.getElementById('sign-modal-id');
      const titleEl = document.getElementById('sign-modal-title');
      const descEl = document.getElementById('sign-modal-desc');

      if (iconEl) iconEl.innerHTML = foundItem.icon;
      if (idEl) idEl.textContent = foundItem.id;
      if (titleEl) titleEl.textContent = foundItem.name;
      if (descEl) descEl.textContent = foundItem.desc;

      if (modal) modal.classList.remove('hidden');
    },

    closeModal() {
      const modal = document.getElementById('sign-detail-modal');
      if (modal) modal.classList.add('hidden');
    },

    // ========== FLASHCARD LOGIC ==========
    openFlashcardModal() {
      this.flashcardList = [];
      this.signsData.forEach(g => {
        this.flashcardList = this.flashcardList.concat(g.items);
      });
      // Shuffle
      this.flashcardList.sort(() => 0.5 - Math.random());
      this.flashcardIndex = 0;
      this.flashcardFlipped = false;

      const modal = document.getElementById('sign-flashcard-modal');
      if (modal) {
        modal.classList.remove('hidden');
        this.renderFlashcardContent();
      }
    },

    closeFlashcardModal() {
      const modal = document.getElementById('sign-flashcard-modal');
      if (modal) modal.classList.add('hidden');
    },

    flipFlashcard() {
      this.flashcardFlipped = !this.flashcardFlipped;
      this.renderFlashcardContent();
    },

    nextFlashcard() {
      if (this.flashcardIndex < this.flashcardList.length - 1) {
        this.flashcardIndex++;
        this.flashcardFlipped = false;
        this.renderFlashcardContent();
      }
    },

    prevFlashcard() {
      if (this.flashcardIndex > 0) {
        this.flashcardIndex--;
        this.flashcardFlipped = false;
        this.renderFlashcardContent();
      }
    },

    renderFlashcardContent() {
      const item = this.flashcardList[this.flashcardIndex];
      const progressEl = document.getElementById('fc-progress');
      const cardContentEl = document.getElementById('fc-card-content');
      if (!item || !cardContentEl) return;

      if (progressEl) {
        progressEl.textContent = `${this.flashcardIndex + 1} / ${this.flashcardList.length}`;
      }

      if (!this.flashcardFlipped) {
        // FRONT SIDE (Icon & ID only)
        cardContentEl.innerHTML = `
          <div class="mb-4 transform scale-125">${item.icon}</div>
          <span class="text-xs font-mono font-bold px-3 py-1 rounded" style="background:var(--surface);color:var(--primary);border:1px solid var(--border)">Belgi #${item.id}</span>
          <p class="text-xs mt-3 italic" style="color:var(--text-muted)">Ushbu belgi nomini eslay olasizmi?</p>
        `;
      } else {
        // BACK SIDE (Title & Description revealed)
        cardContentEl.innerHTML = `
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded mb-2" style="background:var(--surface);color:var(--primary);border:1px solid var(--border)">${item.id}</span>
          <h4 class="text-lg font-bold mb-2 font-heading" style="color:var(--text)">${item.name}</h4>
          <p class="text-xs leading-relaxed max-w-xs" style="color:var(--text-muted)">${item.desc}</p>
        `;
      }
    }
  };
})();
