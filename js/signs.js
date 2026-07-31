(function() {
  window.SignsModule = {
    signsData: [],
    activeCategory: 'all',
    searchQuery: '',

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
          btn.className = 'cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#F2C94C] text-[#0B0F14]';
        } else {
          btn.className = 'cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36] hover:text-[#E8EAED]';
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
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-3">
              KATALOG & SPRAVOCHNIK
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">O'zbekiston Yo'l Belgilari</h2>
            <p class="muted-text max-w-xl">
              Barcha 6 ta toifa bo'yicha belgilarni o'rganing, nomlari va qoidalari bilan tanishing.
            </p>
          </div>

          <div class="tech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-80">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                id="sign-search-input"
                type="text" 
                placeholder="Belgi nomi yoki raqami bo'yicha..." 
                value="${this.searchQuery}"
                oninput="window.filterSigns(this.value)"
                class="w-full pl-10 pr-4 py-2 rounded-md bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-sm focus:outline-none focus:border-[#F2C94C] transition-colors"
              />
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button data-category="all" onclick="window.selectSignCategory('all')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#F2C94C] text-[#0B0F14]">
                Barchasi
              </button>
              <button data-category="ogohlantiruvchi" onclick="window.selectSignCategory('ogohlantiruvchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                1. Ogohlantiruvchi
              </button>
              <button data-category="ustunlik" onclick="window.selectSignCategory('ustunlik')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                2. Imtiyoz
              </button>
              <button data-category="taqiqlovchi" onclick="window.selectSignCategory('taqiqlovchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                3. Taqiqlovchi
              </button>
              <button data-category="buyuruvchi" onclick="window.selectSignCategory('buyuruvchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                4. Buyuruvchi
              </button>
              <button data-category="axborot" onclick="window.selectSignCategory('axborot')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                5. Axborot
              </button>
              <button data-category="servis" onclick="window.selectSignCategory('servis')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                6. Servis
              </button>
            </div>
          </div>

          <div id="signs-grid-container" class="space-y-10">
          </div>
        </div>

        <div id="sign-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F14]/90 backdrop-blur-md hidden fade-in">
          <div class="tech-card p-8 max-w-lg w-full relative border border-[#242B36]">
            <button onclick="window.closeSignModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] flex items-center justify-center text-sm font-bold border border-[#242B36]">
              ✕
            </button>
            <div id="sign-modal-icon" class="flex justify-center mb-6"></div>
            <div class="text-center">
              <span id="sign-modal-id" class="inline-block text-xs font-mono font-bold px-3 py-1 rounded bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-2"></span>
              <h3 id="sign-modal-title" class="text-xl font-bold text-[#E8EAED] mb-4 font-heading"></h3>
              <p id="sign-modal-desc" class="text-sm text-[#9AA0A6] leading-relaxed bg-[#0B0F14] p-4 rounded-md border border-[#242B36] text-left"></p>
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
              <h3 class="text-lg font-bold text-[#E8EAED] font-heading flex items-center gap-2">
                <span>${catGroup.categoryTitle}</span>
                <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">${filteredItems.length} ta belgi</span>
              </h3>
              <p class="text-xs text-[#9AA0A6]">${catGroup.description}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        `;

        filteredItems.forEach(sign => {
          html += `
            <div class="tech-card p-5 flex flex-col items-center text-center group cursor-pointer sign-card-item" 
                 data-sign-id="${sign.id}">
              <div class="mb-4 transform group-hover:scale-105 transition-transform duration-200">
                ${sign.icon}
              </div>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-2">${sign.id}</span>
              <h4 class="text-sm font-bold text-[#E8EAED] mb-2 line-clamp-2 font-heading">${sign.name}</h4>
              <p class="text-xs text-[#9AA0A6] line-clamp-3 leading-relaxed">${sign.desc}</p>
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
            <div class="w-12 h-12 mx-auto rounded-full bg-[#171C24] text-[#9AA0A6] flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-base font-bold text-[#E8EAED] mb-1 font-heading">Hech narsa topilmadi</h3>
            <p class="text-xs text-[#9AA0A6]">"${this.searchQuery}" bo'yicha hech qanday yo'l belgisi mavjud emas.</p>
          </div>
        `;
      }

      gridEl.innerHTML = html;

      gridEl.querySelectorAll('.sign-card-item').forEach(card => {
        card.addEventListener('click', () => {
          const signId = card.dataset.signId;
          this.openModalById(signId);
        });
      });
    },

    openModalById(signId) {
      let foundSign = null;
      for (const group of this.signsData) {
        const item = group.items.find(s => s.id === signId);
        if (item) {
          foundSign = item;
          break;
        }
      }

      if (!foundSign) return;

      const modal = document.getElementById('sign-detail-modal');
      const modalIcon = document.getElementById('sign-modal-icon');
      const modalId = document.getElementById('sign-modal-id');
      const modalTitle = document.getElementById('sign-modal-title');
      const modalDesc = document.getElementById('sign-modal-desc');

      if (modal && modalIcon && modalId && modalTitle && modalDesc) {
        modalIcon.innerHTML = foundSign.icon;
        modalId.textContent = foundSign.id;
        modalTitle.textContent = foundSign.name;
        modalDesc.textContent = foundSign.desc;

        modal.classList.remove('hidden');
      }
    },

    closeModal() {
      const modal = document.getElementById('sign-detail-modal');
      if (modal) modal.classList.add('hidden');
    }
  };
})();
