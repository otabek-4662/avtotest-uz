(function() {
  class AppController {
    constructor() {
      this.currentTab = 'home';
      this.mainContainer = document.getElementById('app-main-content');
      this.bindEvents();
      this.attachGlobalHandlers();
      this.renderTab('home');
    }

    bindEvents() {
      const btnMobileMenu = document.getElementById('btn-mobile-menu');
      const mobileMenu = document.getElementById('mobile-menu');
      if (btnMobileMenu && mobileMenu) {
        btnMobileMenu.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
        });
      }

      const header = document.getElementById('main-header');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    switchTab(tabName) {
      this.currentTab = tabName;

      document.querySelectorAll('.nav-btn').forEach(el => {
        if (el.dataset.tab === tabName) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.add('hidden');

      this.renderTab(tabName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderTab(tabName) {
      this.mainContainer.innerHTML = '';

      switch (tabName) {
        case 'home':
          this.renderHome();
          break;
        case 'test':
          window.TestEngine.init(this.mainContainer);
          break;
        case 'signs':
          window.SignsModule.init(this.mainContainer);
          break;
        case 'theory':
          window.TheoryModule.init(this.mainContainer);
          break;
        case 'fines':
          window.FinesModule.init(this.mainContainer);
          break;
        case 'stats':
          window.StatsModule.init(this.mainContainer);
          break;
        default:
          this.renderHome();
      }
    }

    renderHome() {
      const stats = window.StorageManager.getStatsSummary();

      const html = `
        <div class="fade-in space-y-20 py-4">
          <!-- HERO SECTION (No generic card, clean technical layout) -->
          <section class="relative py-12 text-left max-w-4xl">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#171C24] border border-[#242B36] text-xs font-mono font-medium text-[#F2C94C]">
                <span class="w-2 h-2 rounded-full bg-[#F2C94C]"></span>
                O'ZBEKISTON PDD 2026 STANDARTI
              </div>

              <h1 class="hero-h1 text-[#E8EAED]">
                Haydovchilik Imtihoniga <span class="text-[#F2C94C]">Professional</span> Tayyorgarlik Tizimi
              </h1>

              <p class="body-text text-[#9AA0A6] max-w-2xl">
                Rasmiy YPX PDD imtihon biletlari, yo'l belgilari katalogi, qoidalar nazariyasi hamda MJtK jarimalari bo'yicha yagona texnik platforma.
              </p>

              <div class="pt-4 flex flex-wrap items-center gap-4">
                <button onclick="window.switchTab('test')" class="btn-primary">
                  <span>Imtihon Testini Boshlash</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>

                <button onclick="window.switchTab('signs')" class="btn-secondary">
                  <span>Yo'l Belgilarini Ko'rish</span>
                  <svg class="w-4 h-4 text-[#9AA0A6]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </section>

          <!-- STATISTIKA BLOKLARI (Circular & Radial SVG Progress indicators instead of generic rectangle cards) -->
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Circular Indicator 1 -->
            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path class="text-[#171C24]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="text-[#F2C94C] progress-ring-circle" stroke-dasharray="85, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl text-[#E8EAED]">5000+</span>
              </div>
              <span class="text-sm font-semibold text-[#E8EAED]">Savollar Bazasi</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">Rasmiy YPX manbasi</span>
            </div>

            <!-- Circular Indicator 2 -->
            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path class="text-[#171C24]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="text-[#F2C94C] progress-ring-circle" stroke-dasharray="100, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-lg text-[#E8EAED]">20 Daq</span>
              </div>
              <span class="text-sm font-semibold text-[#E8EAED]">Taymer Standarti</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">Vaqt nazorati</span>
            </div>

            <!-- Circular Indicator 3 -->
            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path class="text-[#171C24]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="text-[#F2C94C] progress-ring-circle" stroke-dasharray="95, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl text-[#E8EAED]">95%</span>
              </div>
              <span class="text-sm font-semibold text-[#E8EAED]">Muvaffaqiyat</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">O'tish ko'rsatkich</span>
            </div>

            <!-- Circular Indicator 4 -->
            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path class="text-[#171C24]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="text-[#F2C94C] progress-ring-circle" stroke-dasharray="60, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl text-[#E8EAED]">${stats.totalTests}</span>
              </div>
              <span class="text-sm font-semibold text-[#E8EAED]">Ishlangan Testlar</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">Shaxsiy natijangiz</span>
            </div>

          </section>

          <!-- SECTIONS / CARDS -->
          <section class="space-y-6">
            <div class="space-y-1">
              <h2 class="section-title text-[#E8EAED]">Asosiy Bo'limlar</h2>
              <p class="muted-text">Platformaning barcha interaktiv imkoniyatlari</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- Card 1: Test Rejimi -->
              <div onclick="window.switchTab('test')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">Test Rejimi</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    20 ta savol, vaqt va xatolar tahlili bilan PDD rasmiy imtihon simulyatsiyasi.
                  </p>
                </div>
                <span class="text-xs font-bold text-[#F2C94C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Boshlash</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <!-- Card 2: Yo'l Belgilari -->
              <div onclick="window.switchTab('signs')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">Yo'l Belgilari</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    6 ta kategoriya bo'yicha belgilarni izlash, nomi va qoidalari bilan katalog.
                  </p>
                </div>
                <span class="text-xs font-bold text-[#F2C94C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Katalogga o'tish</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <!-- Card 3: PDD Nazariya -->
              <div onclick="window.switchTab('theory')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">PDD Nazariya</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    Chorrahalar, svetofor, harakatlanish va xavfsizlik qoidalarining to'liq nazariyasi.
                  </p>
                </div>
                <span class="text-xs font-bold text-[#F2C94C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Qoidalarni o'qish</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <!-- Card 4: Jarimalar Jadvali -->
              <div onclick="window.switchTab('fines')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#EB5757] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">Jarimalar Jadvali</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    O'zbekiston MJtK moddalari bo'yicha amaldagi jarima miqdorlari va qidiruv.
                  </p>
                </div>
                <span class="text-xs font-bold text-[#EB5757] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Jadvalni ko'rish</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

            </div>
          </section>

          <!-- MEN HAQIMDA (ABOUT THE DEVELOPER) CARD -->
          <section class="space-y-6 pt-4">
            <div class="space-y-1">
              <h2 class="section-title text-[#E8EAED]">Loyiha va Dasturchi Haqida</h2>
              <p class="muted-text">Platformaning yaratilishi hamda ishlatilgan texnologiyalar</p>
            </div>

            <div class="tech-card p-6 sm:p-8 relative overflow-hidden">
              <div class="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                
                <!-- Avatar & Details -->
                <div class="flex items-center gap-5">
                  <div class="w-16 h-16 rounded-xl bg-[#171C24] border-2 border-[#F2C94C] flex items-center justify-center shrink-0 shadow-lg shadow-[#F2C94C]/10">
                    <svg class="w-9 h-9 text-[#F2C94C]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 class="text-xl font-bold text-[#E8EAED] font-heading">Otabek</h3>
                      <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#171C24] text-[#F2C94C] border border-[#242B36]">
                        Full-Stack / Java Backend Developer
                      </span>
                      <span class="text-xs font-mono text-[#9AA0A6]">
                        (21.09.2006)
                      </span>
                    </div>
                    <p class="text-sm text-[#9AA0A6] leading-relaxed max-w-xl">
                      Ushbu AvtoTest UZ platformasi O'zbekiston PDD imtihoniga tayyorlanish hamda yo'l harakati qoidalarini interaktiv tarzda o'rganish maqsadida yaratildi.
                    </p>
                  </div>
                </div>

                <!-- Tech Stack Badges -->
                <div class="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#242B36] flex flex-col gap-2 shrink-0">
                  <span class="text-xs font-mono uppercase font-bold text-[#9AA0A6] tracking-wider">Texnologiyalar Steki:</span>
                  <div class="flex flex-wrap gap-2 max-w-xs">
                    <span class="px-2.5 py-1 rounded bg-[#171C24] border border-[#242B36] text-xs font-mono text-[#E8EAED]">Java</span>
                    <span class="px-2.5 py-1 rounded bg-[#171C24] border border-[#242B36] text-xs font-mono text-[#E8EAED]">Spring Boot</span>
                    <span class="px-2.5 py-1 rounded bg-[#171C24] border border-[#242B36] text-xs font-mono text-[#E8EAED]">PostgreSQL</span>
                    <span class="px-2.5 py-1 rounded bg-[#171C24] border border-[#242B36] text-xs font-mono text-[#E8EAED]">JavaScript (ES6+)</span>
                    <span class="px-2.5 py-1 rounded bg-[#171C24] border border-[#242B36] text-xs font-mono text-[#E8EAED]">HTML5 / CSS3</span>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      `;

      this.mainContainer.innerHTML = html;
    }

    attachGlobalHandlers() {
      window.switchTab = (tab) => this.switchTab(tab);
      window.startTest = (ticketId) => window.TestEngine.startTicket(ticketId);
      window.startRandomTest = () => window.TestEngine.startRandom();
      window.renderTicketSelection = () => window.TestEngine.renderTicketSelection();
      window.selectOption = (idx) => window.TestEngine.selectOption(idx);
      window.goToQuestion = (idx) => window.TestEngine.goToQuestion(idx);
      window.finishTest = () => window.TestEngine.finishTest();
      window.confirmExitTest = () => {
        if (confirm("Testni to'xtatib chiqmoqchimisiz? Natija saqlanmaydi.")) {
          window.TestEngine.clearIntervals();
          this.switchTab('test');
        }
      };

      window.selectSignCategory = (cat) => window.SignsModule.setCategory(cat);
      window.filterSigns = (query) => window.SignsModule.setSearch(query);
      window.closeSignModal = () => window.SignsModule.closeModal();

      window.toggleTheoryTopic = (id) => window.TheoryModule.toggleTopic(id);

      window.selectFineCategory = (cat) => window.FinesModule.setCategory(cat);
      window.filterFines = (query) => window.FinesModule.setSearch(query);

      window.clearUserStatsHistory = () => window.StatsModule.clearHistory();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
  });
})();
