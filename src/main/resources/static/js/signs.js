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

    isRu() {
      return (localStorage.getItem('avtotest_lang') || 'UZ') === 'RU';
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
      const ru = this.isRu();
      let html = `
        <div class="fade-in max-w-6xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-3">
              ${ru ? 'КАТАЛОГ И СПРАВОЧНИК' : 'KATALOG & SPRAVOCHNIK'}
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">${ru ? 'Дорожные Знаки Узбекистана' : "O'zbekiston Yo'l Belgilari"}</h2>
            <p class="muted-text max-w-xl">
              ${ru ? 'Изучайте дорожные знаки по всем 6 категориям с описанием и правилами.' : "Barcha 6 ta toifa bo'yicha belgilarni o'rganing, nomlari va qoidalari bilan tanishing."}
            </p>
          </div>

          <div class="tech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-80">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                id="sign-search-input"
                type="text" 
                placeholder="${ru ? 'Поиск по названию или коду...' : "Belgi nomi yoki raqami bo'yicha..."}" 
                value="${this.searchQuery}"
                oninput="window.filterSigns(this.value)"
                class="w-full pl-10 pr-4 py-2 rounded-md bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-sm focus:outline-none focus:border-[#F2C94C] transition-colors"
              />
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button data-category="all" onclick="window.selectSignCategory('all')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#F2C94C] text-[#0B0F14]">
                ${ru ? 'Все' : 'Barchasi'}
              </button>
              <button data-category="ogohlantiruvchi" onclick="window.selectSignCategory('ogohlantiruvchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? '1. Предупреждающие' : '1. Ogohlantiruvchi'}
              </button>
              <button data-category="ustunlik" onclick="window.selectSignCategory('ustunlik')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? '2. Приоритет' : '2. Imtiyoz'}
              </button>
              <button data-category="taqiqlovchi" onclick="window.selectSignCategory('taqiqlovchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? '3. Запрещающие' : '3. Taqiqlovchi'}
              </button>
              <button data-category="buyuruvchi" onclick="window.selectSignCategory('buyuruvchi')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? '4. Предписывающие' : '4. Buyuruvchi'}
              </button>
              <button data-category="axborot" onclick="window.selectSignCategory('axborot')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? '5. Информационные' : '5. Axborot'}
              </button>
              <button data-category="servis" onclick="window.selectSignCategory('servis')" class="cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? '6. Сервис' : '6. Servis'}
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
      const ru = this.isRu();

      let html = '';
      let totalMatchCount = 0;

      const categoryTitlesRu = {
        'ogohlantiruvchi': '1. Предупреждающие знаки',
        'ustunlik': '2. Знаки приоритета',
        'taqiqlovchi': '3. Запрещающие знаки',
        'buyuruvchi': '4. Предписывающие знаки',
        'axborot': '5. Информационно-указательные знаки',
        'servis': '6. Знаки сервиса'
      };

      this.signsData.forEach(catGroup => {
        if (this.activeCategory !== 'all' && catGroup.category !== this.activeCategory) return;

        const filteredItems = catGroup.items.filter(item => {
          const nameStr = (ru && item.nameRu ? item.nameRu : item.name).toLowerCase();
          const descStr = (ru && item.descRu ? item.descRu : item.desc).toLowerCase();
          if (!this.searchQuery) return true;
          return nameStr.includes(this.searchQuery) ||
                 item.id.toLowerCase().includes(this.searchQuery) ||
                 descStr.includes(this.searchQuery);
        });

        if (filteredItems.length === 0) return;
        totalMatchCount += filteredItems.length;

        const titleText = ru ? (categoryTitlesRu[catGroup.category] || catGroup.categoryTitle) : catGroup.categoryTitle;

        html += `
          <div>
            <div class="mb-4">
              <h3 class="text-lg font-bold text-[#E8EAED] font-heading flex items-center gap-2">
                <span>${titleText}</span>
                <span class="text-xs font-mono font-normal text-[#9AA0A6]">(${filteredItems.length})</span>
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        `;

        filteredItems.forEach(sign => {
          const signName = ru && sign.nameRu ? sign.nameRu : sign.name;
          const signDesc = ru && sign.descRu ? sign.descRu : sign.desc;

          html += `
            <div class="tech-card p-4 flex flex-col justify-between cursor-pointer group hover:border-[#F2C94C]/40" onclick="window.SignsModule.openModal('${sign.id}')">
              <div>
                <div class="h-28 flex items-center justify-center p-2 mb-3 bg-[#0B0F14] rounded-md border border-[#242B36]/60 group-hover:scale-105 transition-transform">
                  ${sign.svgIcon}
                </div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#171C24] text-[#F2C94C] border border-[#242B36]">
                    ${sign.id}
                  </span>
                </div>
                <h4 class="text-sm font-bold text-[#E8EAED] line-clamp-1 font-heading mb-1">${signName}</h4>
                <p class="text-xs text-[#9AA0A6] line-clamp-2 leading-relaxed">${signDesc}</p>
              </div>
              <div class="pt-3 border-t border-[#242B36]/50 mt-3 text-right">
                <span class="text-[11px] font-semibold text-[#F2C94C] group-hover:underline">${ru ? 'Подробнее →' : 'Batafsil →'}</span>
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
            <div class="w-12 h-12 mx-auto rounded-full bg-[#171C24] text-[#9AA0A6] flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-base font-bold text-[#E8EAED] mb-1 font-heading">${ru ? 'Знаки не найдены' : 'Belgilar topilmadi'}</h3>
            <p class="text-xs text-[#9AA0A6]">${ru ? 'По вашему запросу знаков не найдено.' : "Siz kiritgan so'rov bo'yicha mos belgilar mavjud emas."}</p>
          </div>
        `;
      }

      gridEl.innerHTML = html;
    },

    openModal(signId) {
      const ru = this.isRu();
      let foundSign = null;
      for (const cat of this.signsData) {
        const item = cat.items.find(s => s.id === signId);
        if (item) {
          foundSign = item;
          break;
        }
      }

      if (!foundSign) return;

      const modal = document.getElementById('sign-detail-modal');
      const iconEl = document.getElementById('sign-modal-icon');
      const idEl = document.getElementById('sign-modal-id');
      const titleEl = document.getElementById('sign-modal-title');
      const descEl = document.getElementById('sign-modal-desc');

      if (iconEl) iconEl.innerHTML = foundSign.svgIcon;
      if (idEl) idEl.textContent = (ru ? 'Знак ' : 'Belgi ') + foundSign.id;
      if (titleEl) titleEl.textContent = ru && foundSign.nameRu ? foundSign.nameRu : foundSign.name;
      if (descEl) descEl.textContent = ru && foundSign.descRu ? foundSign.descRu : foundSign.desc;

      if (modal) modal.classList.remove('hidden');
    },

    closeModal() {
      const modal = document.getElementById('sign-detail-modal');
      if (modal) modal.classList.add('hidden');
    }
  };
})();
