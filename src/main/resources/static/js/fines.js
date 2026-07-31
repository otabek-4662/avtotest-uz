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
          btn.className = 'fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all';
          btn.style.cssText = 'background:var(--danger);color:var(--bg)';
        } else {
          btn.className = 'fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all hover-surface';
          btn.style.cssText = 'background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)';
        }
      });
      this.renderFinesGrid();
    },

    renderInitialLayout() {
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium" style="background:var(--surface-2);color:var(--danger);border:1px solid var(--border);margin-bottom:0.75rem;">
              MJtK JADVALI
            </span>
            <h2 class="section-title mb-2" style="color:var(--text)">Yo'l Qoidabuzarlik Jarimalari</h2>
            <p class="muted-text max-w-xl">
              O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi kodeksi bo'yicha amaldagi jarima miqdorlari va moddalari.
            </p>
          </div>

          <div class="tech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-80 search-container">
              <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 search-icon" style="color:var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                id="fine-search-input"
                type="text" 
                placeholder="Modda yoki qoidabuzarlik turini izlang..." 
                value="${this.searchQuery}"
                oninput="window.filterFines(this.value)"
                class="search-input w-full pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none"
              />
            </div>

            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button data-category="all" onclick="window.selectFineCategory('all')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--danger);color:var(--bg)">
                Barchasi
              </button>
              <button data-category="tezlik" onclick="window.selectFineCategory('tezlik')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Tezlik
              </button>
              <button data-category="svetofor" onclick="window.selectFineCategory('svetofor')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Svetofor
              </button>
              <button data-category="hujjat" onclick="window.selectFineCategory('hujjat')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Hujjatlar
              </button>
              <button data-category="piyoda" onclick="window.selectFineCategory('piyoda')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Piyodalar
              </button>
              <button data-category="parkovka" onclick="window.selectFineCategory('parkovka')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
                Parkovka
              </button>
              <button data-category="ogir" onclick="window.selectFineCategory('ogir')" class="fine-cat-btn px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
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
            <div class="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3" style="background:var(--surface-2);color:var(--text-muted)">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-base font-bold mb-1 font-heading" style="color:var(--text)">Natija topilmadi</h3>
            <p class="text-xs" style="color:var(--text-muted)">Siz kiritgan so'rov bo'yicha mos jarimalar mavjud emas.</p>
          </div>
        `;
      } else {
        filtered.forEach(fine => {
          html += `
            <div class="tech-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded" style="background:var(--surface-2);color:var(--danger);border:1px solid var(--border)">
                    MJtK ${fine.article}
                  </span>
                  <span class="text-xs" style="color:var(--text-muted)">• ${fine.bhm}</span>
                </div>
                <h3 class="text-base font-bold font-heading" style="color:var(--text)">${fine.title}</h3>
                <p class="text-xs max-w-2xl leading-relaxed" style="color:var(--text-muted)">${fine.desc}</p>
              </div>

              <div class="shrink-0 px-4 py-3 rounded-md text-right min-w-[160px]" style="background:var(--surface-2);border:1px solid var(--border)">
                <span class="text-xs block" style="color:var(--text-muted)">Jarima summasi</span>
                <span class="text-base font-mono font-extrabold" style="color:var(--danger)">${fine.amount}</span>
              </div>
            </div>
          `;
        });
      }

      gridEl.innerHTML = html;
    }
  };
})();
