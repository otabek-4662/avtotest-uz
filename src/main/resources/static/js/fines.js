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
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#EB5757] border border-[#242B36] mb-3">
              MJtK JADVALI
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">Yo'l Qoidabuzarlik Jarimalari</h2>
            <p class="muted-text max-w-xl">
              O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi kodeksi bo'yicha amaldagi jarima miqdorlari va moddalari.
            </p>
          </div>

          <div class="tech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-80">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                id="fine-search-input"
                type="text" 
                placeholder="Modda yoki qoidabuzarlik turi bo'yicha..." 
                value="${this.searchQuery}"
                oninput="window.filterFines(this.value)"
                class="w-full pl-10 pr-4 py-2 rounded-md bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-sm focus:outline-none focus:border-[#EB5757] transition-colors"
              />
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button data-category="all" onclick="window.selectFineCategory('all')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#EB5757] text-[#0B0F14]">
                Barchasi
              </button>
              <button data-category="tezlik" onclick="window.selectFineCategory('tezlik')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                Tezlik
              </button>
              <button data-category="svetofor" onclick="window.selectFineCategory('svetofor')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                Svetofor
              </button>
              <button data-category="piyoda" onclick="window.selectFineCategory('piyoda')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                Piyodalar
              </button>
              <button data-category="parkovka" onclick="window.selectFineCategory('parkovka')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                Parkovka
              </button>
              <button data-category="ogir" onclick="window.selectFineCategory('ogir')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all bg-[#171C24] text-[#9AA0A6] border border-[#242B36]">
                Og'ir qoidabuzarliklar
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

      const filtered = this.finesData.filter(item => {
        const matchesCat = this.activeCategory === 'all' || item.category === this.activeCategory;
        const matchesQuery = !this.searchQuery || 
          item.title.toLowerCase().includes(this.searchQuery) ||
          item.article.toLowerCase().includes(this.searchQuery) ||
          item.desc.toLowerCase().includes(this.searchQuery);
        return matchesCat && matchesQuery;
      });

      let html = '';

      if (filtered.length === 0) {
        html = `
          <div class="tech-card p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto rounded-full bg-[#171C24] text-[#9AA0A6] flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-base font-bold text-[#E8EAED] mb-1 font-heading">Natija topilmadi</h3>
            <p class="text-xs text-[#9AA0A6]">Siz kiritgan so'rov bo'yicha mos jarimalar mavjud emas.</p>
          </div>
        `;
      } else {
        filtered.forEach(fine => {
          html += `
            <div class="tech-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#171C24] text-[#EB5757] border border-[#242B36]">
                    MJtK ${fine.article}
                  </span>
                  <span class="text-xs text-[#9AA0A6]">• ${fine.bhm}</span>
                </div>
                <h3 class="text-base font-bold text-[#E8EAED] font-heading">${fine.title}</h3>
                <p class="text-xs text-[#9AA0A6] max-w-2xl leading-relaxed">${fine.desc}</p>
              </div>

              <div class="shrink-0 bg-[#0B0F14] px-4 py-3 rounded-md border border-[#242B36] text-right min-w-[160px]">
                <span class="text-xs text-[#9AA0A6] block">Jarima summasi</span>
                <span class="text-base font-mono font-extrabold text-[#EB5757]">${fine.amount}</span>
              </div>
            </div>
          `;
        });
      }

      gridEl.innerHTML = html;
    }
  };
})();
