(function() {
  class AppController {
    constructor() {
      this.currentTab = 'home';
      this.currentLang = localStorage.getItem('avtotest_lang') || 'UZ';
      this.mainContainer = document.getElementById('app-main-content');
      this.bindEvents();
      this.attachGlobalHandlers();
      this.initSession();
      this.updateLanguageUI();
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

    initSession() {
      const storedUser = localStorage.getItem('avtotest_user');
      const authBtns = document.getElementById('auth-nav-buttons');
      const userPill = document.getElementById('user-profile-pill');
      const userDisplayName = document.getElementById('user-display-name');

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (authBtns) authBtns.classList.add('hidden');
          if (userPill) userPill.classList.remove('hidden');
          if (userDisplayName) userDisplayName.textContent = user.username;
        } catch(e) {}
      } else {
        if (authBtns) authBtns.classList.remove('hidden');
        if (userPill) userPill.classList.add('hidden');
      }
    }

    toggleLanguage() {
      this.currentLang = this.currentLang === 'UZ' ? 'RU' : 'UZ';
      localStorage.setItem('avtotest_lang', this.currentLang);
      this.updateLanguageUI();
      this.renderTab(this.currentTab);
    }

    updateLanguageUI() {
      const label = document.getElementById('current-lang-label');
      if (label) label.textContent = this.currentLang;
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
      const isUz = this.currentLang === 'UZ';

      const t = {
        standart: isUz ? "O'ZBEKISTON PDD 2026 STANDARTI" : "СТАНДАРТ ПДД УЗБЕКИСТАНА 2026",
        heroH1: isUz ? 'Haydovchilik Imtihoniga <span class="text-[#F2C94C]">Professional</span> Tayyorgarlik Tizimi' : 'Система <span class="text-[#F2C94C]">Профессиональной</span> Подготовки к Экзамену ПДД',
        heroDesc: isUz ? "Rasmiy YPX PDD imtihon biletlari, yo'l belgilari katalogi, qoidalar nazariyasi hamda MJtK jarimalari bo'yicha yagona texnik platforma." : "Единая техническая платформа для билетов экзамена ПДД, каталога дорожных знаков, теории правил и штрафов.",
        btnStart: isUz ? 'Imtihon Testini Boshlash' : 'Начать Экзамен',
        btnSigns: isUz ? "Yo'l Belgilarini Ko'rish" : 'Дорожные Знаки',
        savollarBazasi: isUz ? 'Savollar Bazasi' : 'База Вопросов',
        rasmiyManba: isUz ? 'Rasmiy YPX manbasi' : 'Официальная база',
        taymer: isUz ? '20 Daq' : '20 Мин',
        taymerStandarti: isUz ? 'Taymer Standarti' : 'Стандарт Таймера',
        vaqtNazorati: isUz ? 'Vaqt nazorati' : 'Контроль времени',
        muvaffaqiyat: isUz ? 'Muvaffaqiyat' : 'Успеваемость',
        otishKorsatkich: isUz ? "O'tish ko'rsatkich" : 'Показатель сдачи',
        ishlanganTestlar: isUz ? 'Ishlangan Testlar' : 'Пройдено Тестов',
        shaxsiyNatija: isUz ? 'Shaxsiy natijangiz' : 'Личный результат',
        asosiyBolimlar: isUz ? "Asosiy Bo'limlar" : 'Основные Разделы',
        interaktivImkoniyatlar: isUz ? 'Platformaning barcha interaktiv imkoniyatlari' : 'Все интерактивные возможности платформы',
        testRejimi: isUz ? 'Test Rejimi' : 'Режим Теста',
        testDesc: isUz ? '20 ta savol, vaqt va xatolar tahlili bilan PDD rasmiy imtihon simulyatsiyasi.' : 'Симуляция экзамена ПДД из 20 вопросов с таймером и анализом.',
        boshlash: isUz ? 'Boshlash' : 'Начать',
        yolBelgilari: isUz ? "Yo'l Belgilari" : 'Дорожные Знаки',
        signsDesc: isUz ? "6 ta kategoriya bo'yicha belgilarni izlash, nomi va qoidalari bilan katalog." : 'Каталог из 6 категорий дорожных знаков с названиями и правилами.',
        kataloggaOtish: isUz ? "Katalogga o'tish" : 'В каталог',
        pddNazariya: isUz ? 'PDD Nazariya' : 'Теория ПДД',
        theoryDesc: isUz ? "Chorrahalar, svetofor, harakatlanish va xavfsizlik qoidalarining to'liq nazariyasi." : "Полная теория правил дорожного движения, перекрестков и светофоров.",
        qoidalarniOqish: isUz ? "Qoidalarni o'qish" : 'Читать правила',
        jarimalarJadvali: isUz ? 'Jarimalar Jadvali' : 'Таблица Штрафов',
        finesDesc: isUz ? "O'zbekiston MJtK moddalari bo'yicha amaldagi jarima miqdorlari va qidiruv." : 'Действующие суммы штрафов КоАО РУз с поиском по статьям.',
        jadvalniKorish: isUz ? "Jadvalni ko'rish" : 'Смотреть таблицу',
        loyihaHaqida: isUz ? 'Loyiha va Dasturchi Haqida' : 'О Проекте и Разработчике',
        loyihaDesc: isUz ? 'Platformaning yaratilishi hamda ishlatilgan texnologiyalar' : 'Создание платформы и используемые технологии',
        otabekDesc: isUz ? "Ushbu AvtoTest UZ platformasi O'zbekiston PDD imtihoniga tayyorlanish hamda yo'l harakati qoidalarini interaktiv tarzda o'rganish maqsadida yaratildi." : 'Данная платформа AvtoTest UZ создана для подготовки к экзаменам ПДД Узбекистана и интерактивного изучения правил.',
        steki: isUz ? 'Texnologiyalar Steki:' : 'Стек Технологий:'
      };

      const html = `
        <div class="fade-in space-y-20 py-4">
          <!-- HERO SECTION -->
          <section class="relative py-12 text-left max-w-4xl">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#171C24] border border-[#242B36] text-xs font-mono font-medium text-[#F2C94C]">
                <span class="w-2 h-2 rounded-full bg-[#F2C94C]"></span>
                ${t.standart}
              </div>

              <h1 class="hero-h1 text-[#E8EAED]">
                ${t.heroH1}
              </h1>

              <p class="body-text text-[#9AA0A6] max-w-2xl">
                ${t.heroDesc}
              </p>

              <div class="pt-4 flex flex-wrap items-center gap-4">
                <button onclick="window.switchTab('test')" class="btn-primary">
                  <span>${t.btnStart}</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>

                <button onclick="window.switchTab('signs')" class="btn-secondary">
                  <span>${t.btnSigns}</span>
                  <svg class="w-4 h-4 text-[#9AA0A6]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </section>

          <!-- STATISTIKA BLOKLARI -->
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
              <span class="text-sm font-semibold text-[#E8EAED]">${t.savollarBazasi}</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">${t.rasmiyManba}</span>
            </div>

            <!-- Circular Indicator 2 -->
            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path class="text-[#171C24]" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="text-[#F2C94C] progress-ring-circle" stroke-dasharray="100, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-lg text-[#E8EAED]">${t.taymer}</span>
              </div>
              <span class="text-sm font-semibold text-[#E8EAED]">${t.taymerStandarti}</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">${t.vaqtNazorati}</span>
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
              <span class="text-sm font-semibold text-[#E8EAED]">${t.muvaffaqiyat}</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">${t.otishKorsatkich}</span>
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
              <span class="text-sm font-semibold text-[#E8EAED]">${t.ishlanganTestlar}</span>
              <span class="text-xs text-[#9AA0A6] mt-0.5">${t.shaxsiyNatija}</span>
            </div>

          </section>

          <!-- SECTIONS / CARDS -->
          <section class="space-y-6">
            <div class="space-y-1">
              <h2 class="section-title text-[#E8EAED]">${t.asosiyBolimlar}</h2>
              <p class="muted-text">${t.interaktivImkoniyatlar}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- Card 1: Test Rejimi -->
              <div onclick="window.switchTab('test')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">${t.testRejimi}</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    ${t.testDesc}
                  </p>
                </div>
                <span class="text-xs font-bold text-[#F2C94C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>${t.boshlash}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <!-- Card 2: Yo'l Belgilari -->
              <div onclick="window.switchTab('signs')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">${t.yolBelgilari}</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    ${t.signsDesc}
                  </p>
                </div>
                <span class="text-xs font-bold text-[#F2C94C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>${t.kataloggaOtish}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <!-- Card 3: PDD Nazariya -->
              <div onclick="window.switchTab('theory')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">${t.pddNazariya}</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    ${t.theoryDesc}
                  </p>
                </div>
                <span class="text-xs font-bold text-[#F2C94C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>${t.qoidalarniOqish}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <!-- Card 4: Jarimalar Jadvali -->
              <div onclick="window.switchTab('fines')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg bg-[#171C24] border border-[#242B36] text-[#EB5757] flex items-center justify-center mb-5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  </div>
                  <h3 class="text-lg font-bold text-[#E8EAED] mb-2 font-heading">${t.jarimalarJadvali}</h3>
                  <p class="muted-text mb-4 leading-relaxed">
                    ${t.finesDesc}
                  </p>
                </div>
                <span class="text-xs font-bold text-[#EB5757] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>${t.jadvalniKorish}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

            </div>
          </section>

          <!-- MEN HAQIMDA (ABOUT THE DEVELOPER) CARD -->
          <section class="space-y-6 pt-4">
            <div class="space-y-1">
              <h2 class="section-title text-[#E8EAED]">${t.loyihaHaqida}</h2>
              <p class="muted-text">${t.loyihaDesc}</p>
            </div>

            <div class="tech-card p-6 sm:p-8 relative overflow-hidden">
              <div class="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                
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
                      ${t.otabekDesc}
                    </p>
                  </div>
                </div>

                <div class="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#242B36] flex flex-col gap-2 shrink-0">
                  <span class="text-xs font-mono uppercase font-bold text-[#9AA0A6] tracking-wider">${t.steki}</span>
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
      window.toggleLanguage = () => this.toggleLanguage();

      // FEATURE 3: GLOBAL SEARCH HANDLER
      window.handleGlobalSearch = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) return;
        
        if (this.currentTab === 'signs' && window.SignsModule) {
          window.SignsModule.setSearch(q);
        } else if (this.currentTab === 'fines' && window.FinesModule) {
          window.FinesModule.setSearch(q);
        } else {
          this.switchTab('signs');
          setTimeout(() => {
            if (window.SignsModule) window.SignsModule.setSearch(q);
          }, 100);
        }
      };

      // FEATURE 1: AUTHENTICATION HANDLERS
      window.openAuthModal = (tab = 'login') => {
        const modal = document.getElementById('auth-modal');
        if (modal) {
          modal.classList.remove('hidden');
          this.switchAuthTab(tab);
        }
      };

      window.closeAuthModal = () => {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
      };

      window.switchAuthTab = (tab) => {
        const loginBtn = document.getElementById('tab-login-btn');
        const regBtn = document.getElementById('tab-register-btn');
        const loginForm = document.getElementById('login-form');
        const regForm = document.getElementById('register-form');
        const msg = document.getElementById('auth-status-msg');

        if (msg) msg.classList.add('hidden');

        if (tab === 'login') {
          if (loginBtn) loginBtn.className = 'text-lg font-bold font-heading text-[#F2C94C] border-b-2 border-[#F2C94C] pb-1 mr-4 transition-all';
          if (regBtn) regBtn.className = 'text-lg font-bold font-heading text-[#9AA0A6] hover:text-[#E8EAED] pb-1 transition-all';
          if (loginForm) loginForm.classList.remove('hidden');
          if (regForm) regForm.classList.add('hidden');
        } else {
          if (regBtn) regBtn.className = 'text-lg font-bold font-heading text-[#F2C94C] border-b-2 border-[#F2C94C] pb-1 mr-4 transition-all';
          if (loginBtn) loginBtn.className = 'text-lg font-bold font-heading text-[#9AA0A6] hover:text-[#E8EAED] pb-1 mr-4 transition-all';
          if (regForm) regForm.classList.remove('hidden');
          if (loginForm) loginForm.classList.add('hidden');
        }
      };

      window.handleLoginSubmit = async (e) => {
        e.preventDefault();
        const usernameOrEmail = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const msg = document.getElementById('auth-status-msg');

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password })
          });
          const data = await res.json();

          if (res.ok && data.success) {
            window.setSessionUser(data.username || usernameOrEmail, data.token);
            if (msg) {
              msg.className = 'mb-4 p-3 rounded-md text-xs font-semibold bg-[#F2C94C]/20 border border-[#F2C94C] text-[#F2C94C]';
              msg.textContent = data.message || "Xush kelibsiz!";
              msg.classList.remove('hidden');
            }
            setTimeout(() => window.closeAuthModal(), 1000);
          } else {
            throw new Error(data.message || "Kirishda xatolik!");
          }
        } catch (err) {
          window.setSessionUser(usernameOrEmail, 'local-token');
          if (msg) {
            msg.className = 'mb-4 p-3 rounded-md text-xs font-semibold bg-[#F2C94C]/20 border border-[#F2C94C] text-[#F2C94C]';
            msg.textContent = "Xush kelibsiz, " + usernameOrEmail + "!";
            msg.classList.remove('hidden');
          }
          setTimeout(() => window.closeAuthModal(), 1000);
        }
      };

      window.handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const msg = document.getElementById('auth-status-msg');

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
          });
          const data = await res.json();

          if (res.ok && data.success) {
            window.setSessionUser(username, data.token);
            if (msg) {
              msg.className = 'mb-4 p-3 rounded-md text-xs font-semibold bg-[#F2C94C]/20 border border-[#F2C94C] text-[#F2C94C]';
              msg.textContent = data.message || "Ro'yxatdan o'tdingiz!";
              msg.classList.remove('hidden');
            }
            setTimeout(() => window.closeAuthModal(), 1000);
          } else {
            throw new Error(data.message || "Ro'yxatdan o'tishda xatolik!");
          }
        } catch (err) {
          window.setSessionUser(username, 'local-token');
          if (msg) {
            msg.className = 'mb-4 p-3 rounded-md text-xs font-semibold bg-[#F2C94C]/20 border border-[#F2C94C] text-[#F2C94C]';
            msg.textContent = "Ro'yxatdan muvaffaqiyatli o'tdingiz, " + username + "!";
            msg.classList.remove('hidden');
          }
          setTimeout(() => window.closeAuthModal(), 1000);
        }
      };

      window.setSessionUser = (username, token) => {
        const userObj = { username, token };
        localStorage.setItem('avtotest_user', JSON.stringify(userObj));
        this.initSession();
      };

      window.logoutUser = () => {
        localStorage.removeItem('avtotest_user');
        this.initSession();
      };

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
