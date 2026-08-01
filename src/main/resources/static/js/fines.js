(function() {
  window.FinesModule = {
    finesData: [],
    searchQuery: '',
    activeCategory: 'all',

    init(containerEl) {
      this.container = containerEl;
      this.finesData = window.FINES_DATA || [];
      this.renderInitialLayout();
    },

    isRu() {
      return (localStorage.getItem('avtotest_lang') || 'UZ') === 'RU';
    },

    setSearch(query) {
      this.searchQuery = query.toLowerCase().trim();
      this.renderFinesGrid();
    },

    setCategory(cat) {
      this.activeCategory = cat;
      const buttons = this.container.querySelectorAll('.fine-cat-btn');
      buttons.forEach(btn => {
        if (btn.dataset.category === cat) {
          btn.className = 'fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#EB5757] text-[#0B0F14]';
        } else {
          btn.className = 'fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36] hover:text-[#E8EAED]';
        }
      });
      this.renderFinesGrid();
    },

    renderInitialLayout() {
      const ru = this.isRu();
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#EB5757] border border-[#242B36] mb-3">
              ${ru ? 'ТАБЛИЦА КоАП' : 'MJtK JADVALI'}
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">${ru ? 'Штрафы за Нарушения ПДД' : "Yo'l Qoidabuzarlik Jarimalari"}</h2>
            <p class="muted-text max-w-xl">
              ${ru ? 'Действующие статьи и суммы штрафов Кодексы об административной ответственности Республики Узбекистан.' : "O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi kodeksi bo'yicha amaldagi jarima miqdorlari va moddalari."}
            </p>
          </div>

          <div class="tech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-80">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                id="fine-search-input"
                type="text" 
                placeholder="${ru ? 'Поиск по статье или нарушению...' : "Modda yoki qoidabuzarlik turi bo'yicha..."}" 
                value="${this.searchQuery}"
                oninput="window.filterFines(this.value)"
                class="w-full pl-10 pr-4 py-2 rounded-md bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-sm focus:outline-none focus:border-[#EB5757] transition-colors"
              />
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button data-category="all" onclick="window.selectFineCategory('all')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#EB5757] text-[#0B0F14]">
                ${ru ? 'Все' : 'Barchasi'}
              </button>
              <button data-category="tezlik" onclick="window.selectFineCategory('tezlik')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? 'Скорость' : 'Tezlik'}
              </button>
              <button data-category="svetofor" onclick="window.selectFineCategory('svetofor')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? 'Светофор' : 'Svetofor'}
              </button>
              <button data-category="piyoda" onclick="window.selectFineCategory('piyoda')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? 'Пешеходы' : 'Piyodalar'}
              </button>
              <button data-category="parkovka" onclick="window.selectFineCategory('parkovka')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? 'Парковка' : 'Parkovka'}
              </button>
              <button data-category="ogir" onclick="window.selectFineCategory('ogir')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                ${ru ? 'Тяжкие нарушения' : "Og'ir qoidabuzarliklar"}
              </button>
            </div>
          </div>

          <div id="fines-grid-container" class="space-y-4">
          </div>
        </div>
      `;

      this.container.innerHTML = html;
      this.renderFinesGrid();
    },

    renderFinesGrid() {
      const gridEl = document.getElementById('fines-grid-container');
      if (!gridEl) return;
      const ru = this.isRu();

      const filtered = this.finesData.filter(item => {
        const titleText = (ru && item.titleRu ? item.titleRu : item.title).toLowerCase();
        const descText = (ru && item.descRu ? item.descRu : item.desc).toLowerCase();
        const matchesCat = this.activeCategory === 'all' || item.category === this.activeCategory;
        const matchesQuery = !this.searchQuery || 
          titleText.includes(this.searchQuery) ||
          item.article.toLowerCase().includes(this.searchQuery) ||
          descText.includes(this.searchQuery);
        return matchesCat && matchesQuery;
      });

      let html = '';

      if (filtered.length === 0) {
        html = `
          <div class="tech-card p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto rounded-full bg-[#171C24] text-[#9AA0A6] flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-base font-bold text-[#E8EAED] mb-1 font-heading">${ru ? 'Результаты не найдены' : 'Natija topilmadi'}</h3>
            <p class="text-xs text-[#9AA0A6]">${ru ? 'По вашему запросу штрафов не найдено.' : "Siz kiritgan so'rov bo'yicha mos jarimalar mavjud emas."}</p>
          </div>
        `;
      } else {
        filtered.forEach(fine => {
          const title = ru && fine.titleRu ? fine.titleRu : fine.title;
          const desc = ru && fine.descRu ? fine.descRu : fine.desc;
          const bhm = ru && fine.bhmRu ? fine.bhmRu : fine.bhm;
          const amount = ru && fine.amountRu ? fine.amountRu : fine.amount;

          html += `
            <div class="tech-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#171C24] text-[#EB5757] border border-[#242B36]">
                    ${ru ? 'Статья' : 'MJtK'} ${fine.article}
                  </span>
                  <span class="text-xs text-[#9AA0A6]">• ${bhm}</span>
                </div>
                <h3 class="text-base font-bold text-[#E8EAED] font-heading">${title}</h3>
                <p class="text-xs text-[#9AA0A6] max-w-2xl leading-relaxed">${desc}</p>
              </div>

              <div class="shrink-0 bg-[#0B0F14] px-4 py-3 rounded-md border border-[#242B36] text-right min-w-[160px]">
                <span class="text-xs text-[#9AA0A6] block">${ru ? 'Сумма штрафа' : 'Jarima summasi'}</span>
                <span class="text-base font-mono font-extrabold text-[#EB5757]">${amount}</span>
              </div>
            </div>
          `;
        });
      }

      gridEl.innerHTML = html;
    }
  };
})();
