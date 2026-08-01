(function() {

  // ========== I18N DICTIONARY ==========
  const I18N = {
    UZ: {
      'logo-sub': 'PDD Imtihon Portali',
      'nav-home': 'Bosh Sahifa',
      'nav-test': 'Test Rejimi',
      'nav-signs': "Yo'l Belgilari",
      'nav-theory': 'Nazariya',
      'nav-fines': 'Jarimalar',
      'nav-stats': 'Statistika',
      'search-placeholder': 'Qidiruv...',
      'btn-login': 'Kirish',
      'btn-register': "Ro'yxatdan o'tish",
      'btn-logout': 'Chiqish',
      'auth-login': 'Kirish',
      'auth-register': "Ro'yxatdan o'tish",
      'label-username-email': 'Foydalanuvchi nomi yoki Email',
      'label-password': 'Parol',
      'label-username': 'Foydalanuvchi nomi',
      'label-email': 'Email Manzil',
      'footer-desc': "O'zbekiston Yo'l Harakati Qoidalari va Imtihon Portali",
      'footer-privacy': 'Maxfiylik Siyosati',
      'footer-terms': 'Foydalanish Shartlari',
      'footer-telegram': 'Telegram Aloqa',
      'footer-copyright': '© 2026 AvtoTest UZ. Barcha huquqlar himoyalangan.',
      'footer-tagline': 'Tayyorgarlik tizimi va PDD simulyatsiyasi.',
      // Home page translations
      'standart': "O'ZBEKISTON PDD 2026 STANDARTI",
      'heroH1': 'Haydovchilik Imtihoniga <span style="color:var(--primary)">Professional</span> Tayyorgarlik Tizimi',
      'heroDesc': "Rasmiy YPX PDD imtihon biletlari, yo'l belgilari katalogi, qoidalar nazariyasi hamda MJtK jarimalari bo'yicha yagona texnik platforma.",
      'btnStart': 'Imtihon Testini Boshlash',
      'btnSigns': "Yo'l Belgilarini Ko'rish",
      'savollarBazasi': 'Savollar Bazasi',
      'rasmiyManba': 'Rasmiy YPX manbasi',
      'taymer': '20 Daq',
      'taymerStandarti': 'Taymer Standarti',
      'vaqtNazorati': 'Vaqt nazorati',
      'muvaffaqiyat': 'Muvaffaqiyat',
      'otishKorsatkich': "O'tish ko'rsatkich",
      'ishlanganTestlar': 'Ishlangan Testlar',
      'shaxsiyNatija': 'Shaxsiy natijangiz',
      'asosiyBolimlar': "Asosiy Bo'limlar",
      'interaktivImkoniyatlar': 'Platformaning barcha interaktiv imkoniyatlari',
      'testRejimi': 'Test Rejimi',
      'testDesc': '20 ta savol, vaqt va xatolar tahlili bilan PDD rasmiy imtihon simulyatsiyasi.',
      'boshlash': 'Boshlash',
      'yolBelgilari': "Yo'l Belgilari",
      'signsDesc': "6 ta kategoriya bo'yicha belgilarni izlash, nomi va qoidalari bilan katalog.",
      'kataloggaOtish': "Katalogga o'tish",
      'pddNazariya': 'PDD Nazariya',
      'theoryDesc': "Chorrahalar, svetofor, harakatlanish va xavfsizlik qoidalarining to'liq nazariyasi.",
      'qoidalarniOqish': "Qoidalarni o'qish",
      'jarimalarJadvali': 'Jarimalar Jadvali',
      'finesDesc': "O'zbekiston MJtK moddalari bo'yicha amaldagi jarima miqdorlari va qidiruv.",
      'jadvalniKorish': "Jadvalni ko'rish",
      'loyihaHaqida': 'Loyiha va Dasturchi Haqida',
      'loyihaDesc': 'Platformaning yaratilishi hamda ishlatilgan texnologiyalar',
      'otabekDesc': "Ushbu AvtoTest UZ platformasi O'zbekiston PDD imtihoniga tayyorlanish hamda yo'l harakati qoidalarini interaktiv tarzda o'rganish maqsadida yaratildi.",
      'steki': 'Texnologiyalar Steki:'
    },
    RU: {
      'logo-sub': 'Портал Экзамена ПДД',
      'nav-home': 'Главная',
      'nav-test': 'Тест',
      'nav-signs': 'Знаки',
      'nav-theory': 'Теория',
      'nav-fines': 'Штрафы',
      'nav-stats': 'Статистика',
      'search-placeholder': 'Поиск...',
      'btn-login': 'Войти',
      'btn-register': 'Регистрация',
      'btn-logout': 'Выйти',
      'auth-login': 'Войти',
      'auth-register': 'Регистрация',
      'label-username-email': 'Имя пользователя или Email',
      'label-password': 'Пароль',
      'label-username': 'Имя пользователя',
      'label-email': 'Email Адрес',
      'footer-desc': 'Портал Правил Дорожного Движения и Экзаменов Узбекистана',
      'footer-privacy': 'Политика конфиденциальности',
      'footer-terms': 'Условия использования',
      'footer-telegram': 'Telegram Связь',
      'footer-copyright': '© 2026 AvtoTest UZ. Все права защищены.',
      'footer-tagline': 'Система подготовки и симуляция ПДД.',
      // Home page translations
      'standart': 'СТАНДАРТ ПДД УЗБЕКИСТАНА 2026',
      'heroH1': 'Система <span style="color:var(--primary)">Профессиональной</span> Подготовки к Экзамену ПДД',
      'heroDesc': 'Единая техническая платформа для билетов экзамена ПДД, каталога дорожных знаков, теории правил и штрафов.',
      'btnStart': 'Начать Экзамен',
      'btnSigns': 'Дорожные Знаки',
      'savollarBazasi': 'База Вопросов',
      'rasmiyManba': 'Официальная база',
      'taymer': '20 Мин',
      'taymerStandarti': 'Стандарт Таймера',
      'vaqtNazorati': 'Контроль времени',
      'muvaffaqiyat': 'Успеваемость',
      'otishKorsatkich': 'Показатель сдачи',
      'ishlanganTestlar': 'Пройдено Тестов',
      'shaxsiyNatija': 'Личный результат',
      'asosiyBolimlar': 'Основные Разделы',
      'interaktivImkoniyatlar': 'Все интерактивные возможности платформы',
      'testRejimi': 'Режим Теста',
      'testDesc': 'Симуляция экзамена ПДД из 20 вопросов с таймером и анализом.',
      'boshlash': 'Начать',
      'yolBelgilari': 'Дорожные Знаки',
      'signsDesc': 'Каталог из 6 категорий дорожных знаков с названиями и правилами.',
      'kataloggaOtish': 'В каталог',
      'pddNazariya': 'Теория ПДД',
      'theoryDesc': 'Полная теория правил дорожного движения, перекрестков и светофоров.',
      'qoidalarniOqish': 'Читать правила',
      'jarimalarJadvali': 'Таблица Штрафов',
      'finesDesc': 'Действующие суммы штрафов КоАО РУз с поиском по статьям.',
      'jadvalniKorish': 'Смотреть таблицу',
      'loyihaHaqida': 'О Проекте и Разработчике',
      'loyihaDesc': 'Создание платформы и используемые технологии',
      'otabekDesc': 'Данная платформа AvtoTest UZ создана для подготовки к экзаменам ПДД Узбекистана и интерактивного изучения правил.',
      'steki': 'Стек Технологий:'
    }
  };

  // ========== THEME CONFIG ==========
  const THEMES = ['dark', 'light', 'cloud'];
  const THEME_ICONS = { dark: '🌙', light: '☀️', cloud: '☁️' };
  const THEME_LABELS = { dark: 'Dark', light: 'Light', cloud: 'Cloud' };

  class AppController {
    constructor() {
      this.currentTab = 'home';
      this.currentLang = localStorage.getItem('avtotest_lang') || 'UZ';
      this.currentTheme = localStorage.getItem('avtotest_theme') || 'dark';
      this.mainContainer = document.getElementById('app-main-content');
      this.bindEvents();
      this.attachGlobalHandlers();
      this.initSession();
      this.applyTheme(this.currentTheme);
      this.applyI18n();
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
      const mobileAuth = document.getElementById('mobile-auth-container');
      const mobileUser = document.getElementById('mobile-user-container');
      const mobileUserName = document.getElementById('mobile-user-name');
      const adminNavBtn = document.getElementById('nav-btn-admin');

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (authBtns) {
            authBtns.classList.add('hidden');
            authBtns.style.display = 'none';
          }
          if (userPill) {
            userPill.classList.remove('hidden');
            userPill.style.display = 'flex';
          }
          if (userDisplayName) userDisplayName.textContent = user.username;
          
          const proBadge = document.getElementById('pro-badge');
          if (proBadge) {
            if (user.isPro) {
              proBadge.classList.remove('hidden');
            } else {
              proBadge.classList.add('hidden');
            }
          }
          
          if (mobileAuth) {
            mobileAuth.classList.add('hidden');
            mobileAuth.style.display = 'none';
          }
          if (mobileUser) {
            mobileUser.classList.remove('hidden');
            mobileUser.classList.add('flex');
            mobileUser.style.display = 'flex';
          }
          if (mobileUserName) mobileUserName.textContent = user.username;

          const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || ['otabek', 'bekmurod', 'admin'].includes((user.username || '').toLowerCase()));
          if (adminNavBtn) {
            if (isAdmin) {
              adminNavBtn.classList.remove('hidden');
              adminNavBtn.style.display = 'inline-flex';
            } else {
              adminNavBtn.classList.add('hidden');
              adminNavBtn.style.display = 'none';
            }
          }

          // Show profile nav button for logged in users
          const profileNavBtn = document.getElementById('nav-btn-profile');
          const mobileProfileBtn = document.getElementById('mobile-nav-profile');
          if (profileNavBtn) { profileNavBtn.classList.remove('hidden'); profileNavBtn.style.display = 'inline-flex'; }
          if (mobileProfileBtn) { mobileProfileBtn.classList.remove('hidden'); mobileProfileBtn.style.display = 'block'; }
        } catch(e) {
          console.error(e);
        }
      } else {
        if (authBtns) {
          authBtns.classList.remove('hidden');
          authBtns.style.display = '';
        }
        if (userPill) {
          userPill.classList.add('hidden');
          userPill.style.display = 'none';
        }
        
        if (mobileAuth) {
          mobileAuth.classList.remove('hidden');
          mobileAuth.style.display = '';
        }
        if (mobileUser) {
          mobileUser.classList.add('hidden');
          mobileUser.classList.remove('flex');
          mobileUser.style.display = 'none';
        }
        if (adminNavBtn) {
          adminNavBtn.classList.add('hidden');
          adminNavBtn.style.display = 'none';
        }
        // Hide profile nav button for guest users
        const profileNavBtnGuest = document.getElementById('nav-btn-profile');
        const mobileProfileBtnGuest = document.getElementById('mobile-nav-profile');
        if (profileNavBtnGuest) { profileNavBtnGuest.classList.add('hidden'); profileNavBtnGuest.style.display = 'none'; }
        if (mobileProfileBtnGuest) { mobileProfileBtnGuest.classList.add('hidden'); mobileProfileBtnGuest.style.display = 'none'; }
      }
    }

    // ========== I18N SYSTEM ==========
    t(key) {
      return (I18N[this.currentLang] && I18N[this.currentLang][key]) || key;
    }

    applyI18n() {
      // Update lang label
      const label = document.getElementById('current-lang-label');
      if (label) label.textContent = this.currentLang;

      // Update all data-i18n elements
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (translated !== key) {
          el.textContent = translated;
        }
      });

      // Update all data-i18n-placeholder elements
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = this.t(key);
        if (translated !== key) {
          el.placeholder = translated;
        }
      });
    }

    toggleLanguage() {
      this.currentLang = this.currentLang === 'UZ' ? 'RU' : 'UZ';
      localStorage.setItem('avtotest_lang', this.currentLang);
      this.applyI18n();
      this.renderTab(this.currentTab);
    }

    // ========== THEME SYSTEM ==========
    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('avtotest_theme', theme);

      const icon = document.getElementById('theme-icon');
      const themeLabel = document.getElementById('current-theme-label');
      if (icon) icon.textContent = THEME_ICONS[theme] || '🌙';
      if (themeLabel) themeLabel.textContent = THEME_LABELS[theme] || 'Dark';
    }

    cycleTheme() {
      const currentIndex = THEMES.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      this.applyTheme(THEMES[nextIndex]);
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
        case 'admin':
          window.AdminModule.init(this.mainContainer);
          break;
        case 'profile':
          if (window.ProfileModule) {
            window.ProfileModule.init(this.mainContainer);
          } else {
            this.renderHome();
          }
          break;
        default:
          this.renderHome();
      }
    }

    renderHome() {
      const stats = window.StorageManager.getStatsSummary();
      const t = (key) => this.t(key);

      const html = `
        <div class="fade-in space-y-20 py-4">
          <!-- HERO SECTION -->
          <section class="relative py-12 text-left max-w-4xl">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium" style="background:var(--surface-2);border:1px solid var(--border);color:var(--primary)">
                <span class="w-2 h-2 rounded-full" style="background:var(--primary)"></span>
                ${t('standart')}
              </div>

              <h1 class="hero-h1" style="color:var(--text)">
                ${t('heroH1')}
              </h1>

              <p class="body-text max-w-2xl" style="color:var(--text-muted)">
                ${t('heroDesc')}
              </p>

              <div class="pt-4 flex flex-wrap items-center gap-4">
                <button onclick="window.switchTab('test')" class="btn-primary">
                  <span>${t('btnStart')}</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>

                <button onclick="window.switchTab('signs')" class="btn-secondary">
                  <span>${t('btnSigns')}</span>
                  <svg class="w-4 h-4" style="color:var(--text-muted)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </section>

          <!-- STATISTIKA BLOKLARI -->
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path style="color:var(--surface-2)" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path style="color:var(--primary)" class="progress-ring-circle" stroke-dasharray="85, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl" style="color:var(--text)">5000+</span>
              </div>
              <span class="text-sm font-semibold" style="color:var(--text)">${t('savollarBazasi')}</span>
              <span class="text-xs mt-0.5" style="color:var(--text-muted)">${t('rasmiyManba')}</span>
            </div>

            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path style="color:var(--surface-2)" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path style="color:var(--primary)" class="progress-ring-circle" stroke-dasharray="100, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-lg" style="color:var(--text)">${t('taymer')}</span>
              </div>
              <span class="text-sm font-semibold" style="color:var(--text)">${t('taymerStandarti')}</span>
              <span class="text-xs mt-0.5" style="color:var(--text-muted)">${t('vaqtNazorati')}</span>
            </div>

            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path style="color:var(--surface-2)" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path style="color:var(--primary)" class="progress-ring-circle" stroke-dasharray="95, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl" style="color:var(--text)">95%</span>
              </div>
              <span class="text-sm font-semibold" style="color:var(--text)">${t('muvaffaqiyat')}</span>
              <span class="text-xs mt-0.5" style="color:var(--text-muted)">${t('otishKorsatkich')}</span>
            </div>

            <div class="radial-stat-box">
              <div class="relative w-24 h-24 mb-3 flex items-center justify-center">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <path style="color:var(--surface-2)" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path style="color:var(--primary)" class="progress-ring-circle" stroke-dasharray="60, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl" style="color:var(--text)">${stats.totalTests}</span>
              </div>
              <span class="text-sm font-semibold" style="color:var(--text)">${t('ishlanganTestlar')}</span>
              <span class="text-xs mt-0.5" style="color:var(--text-muted)">${t('shaxsiyNatija')}</span>
            </div>
          </section>

          <!-- SECTIONS / CARDS -->
          <section class="space-y-6">
            <div class="space-y-1">
              <h2 class="section-title" style="color:var(--text)">${t('asosiyBolimlar')}</h2>
              <p class="muted-text">${t('interaktivImkoniyatlar')}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div onclick="window.switchTab('test')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style="background:var(--surface-2);border:1px solid var(--border);color:var(--primary)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  </div>
                  <h3 class="text-lg font-bold mb-2 font-heading" style="color:var(--text)">${t('testRejimi')}</h3>
                  <p class="muted-text mb-4 leading-relaxed">${t('testDesc')}</p>
                </div>
                <span class="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style="color:var(--primary)">
                  <span>${t('boshlash')}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <div onclick="window.switchTab('signs')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style="background:var(--surface-2);border:1px solid var(--border);color:var(--primary)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <h3 class="text-lg font-bold mb-2 font-heading" style="color:var(--text)">${t('yolBelgilari')}</h3>
                  <p class="muted-text mb-4 leading-relaxed">${t('signsDesc')}</p>
                </div>
                <span class="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style="color:var(--primary)">
                  <span>${t('kataloggaOtish')}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <div onclick="window.switchTab('theory')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style="background:var(--surface-2);border:1px solid var(--border);color:var(--primary)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h3 class="text-lg font-bold mb-2 font-heading" style="color:var(--text)">${t('pddNazariya')}</h3>
                  <p class="muted-text mb-4 leading-relaxed">${t('theoryDesc')}</p>
                </div>
                <span class="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style="color:var(--primary)">
                  <span>${t('qoidalarniOqish')}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>

              <div onclick="window.switchTab('fines')" class="tech-card flex flex-col justify-between cursor-pointer group">
                <div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style="background:var(--surface-2);border:1px solid var(--border);color:var(--danger)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
                  </div>
                  <h3 class="text-lg font-bold mb-2 font-heading" style="color:var(--text)">${t('jarimalarJadvali')}</h3>
                  <p class="muted-text mb-4 leading-relaxed">${t('finesDesc')}</p>
                </div>
                <span class="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style="color:var(--danger)">
                  <span>${t('jadvalniKorish')}</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>
            </div>
          </section>

          <!-- MEN HAQIMDA -->
          <section class="space-y-6 pt-4">
            <div class="space-y-1">
              <h2 class="section-title" style="color:var(--text)">${t('loyihaHaqida')}</h2>
              <p class="muted-text">${t('loyihaDesc')}</p>
            </div>

            <div class="tech-card p-6 sm:p-8 relative overflow-hidden">
              <div class="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div class="flex items-center gap-5">
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style="background:var(--surface-2);border:2px solid var(--primary);box-shadow:0 0 15px rgba(0,0,0,0.1)">
                    <svg class="w-9 h-9" style="color:var(--primary)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 class="text-xl font-bold font-heading" style="color:var(--text)">Otabek</h3>
                      <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">Full-Stack / Java Backend Developer</span>
                      <span class="text-xs font-mono" style="color:var(--text-muted)">(21.09.2006)</span>
                    </div>
                    <p class="text-sm leading-relaxed max-w-xl" style="color:var(--text-muted)">${t('otabekDesc')}</p>
                  </div>
                </div>

                <div class="w-full md:w-auto pt-4 md:pt-0 md:border-t-0 flex flex-col gap-2 shrink-0" style="border-top:1px solid var(--border)">
                  <span class="text-xs font-mono uppercase font-bold tracking-wider" style="color:var(--text-muted)">${t('steki')}</span>
                  <div class="flex flex-wrap gap-2 max-w-xs">
                    <span class="px-2.5 py-1 rounded text-xs font-mono" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text)">Java</span>
                    <span class="px-2.5 py-1 rounded text-xs font-mono" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text)">Spring Boot</span>
                    <span class="px-2.5 py-1 rounded text-xs font-mono" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text)">PostgreSQL</span>
                    <span class="px-2.5 py-1 rounded text-xs font-mono" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text)">JavaScript (ES6+)</span>
                    <span class="px-2.5 py-1 rounded text-xs font-mono" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text)">HTML5 / CSS3</span>
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
      window.cycleTheme = () => this.cycleTheme();

      // GLOBAL SEARCH
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

      // AUTH HANDLERS
      window.openAuthModal = (tab = 'login') => {
        const modal = document.getElementById('auth-modal');
        if (modal) {
          modal.classList.remove('hidden');
          window.switchAuthTab(tab);
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
          if (loginBtn) { loginBtn.style.color = 'var(--primary)'; loginBtn.style.borderBottom = '2px solid var(--primary)'; }
          if (regBtn) { regBtn.style.color = 'var(--text-muted)'; regBtn.style.borderBottom = 'none'; }
          if (loginForm) loginForm.classList.remove('hidden');
          if (regForm) regForm.classList.add('hidden');
        } else {
          if (regBtn) { regBtn.style.color = 'var(--primary)'; regBtn.style.borderBottom = '2px solid var(--primary)'; }
          if (loginBtn) { loginBtn.style.color = 'var(--text-muted)'; loginBtn.style.borderBottom = 'none'; }
          if (regForm) regForm.classList.remove('hidden');
          if (loginForm) loginForm.classList.add('hidden');
        }
      };

      window.handleLoginSubmit = async (e) => {
        e.preventDefault();
        const usernameOrEmail = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const msg = document.getElementById('auth-status-msg');
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        
        btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';
        btn.disabled = true;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password })
          });
          const data = await res.json();

          if (res.ok && data.success) {
            let isPro = false;
            try {
              const subRes = await fetch(`/api/subscription/status/${data.username || usernameOrEmail}`);
              if (subRes.ok) {
                const subData = await subRes.json();
                isPro = subData.isPro || false;
              }
            } catch(e) { console.error("Failed to fetch sub status", e); }
            
            window.setSessionUser(data.username || usernameOrEmail, data.token, data.role || (usernameOrEmail.toLowerCase().includes('admin') ? 'ADMIN' : 'USER'), isPro);
            if (msg) {
              msg.style.background = 'rgba(242,201,76,0.15)';
              msg.style.border = '1px solid var(--primary)';
              msg.style.color = 'var(--primary)';
              msg.textContent = data.message || "Xush kelibsiz!";
              msg.classList.remove('hidden');
            }
            setTimeout(() => window.closeAuthModal(), 1000);
          } else {
            throw new Error(data.message || "Kirishda xatolik!");
          }
        } catch (err) {
          const defaultRole = ['otabek', 'bekmurod', 'admin'].includes(usernameOrEmail.toLowerCase()) ? 'ADMIN' : 'USER';
          window.setSessionUser(usernameOrEmail, 'local-token', defaultRole);
          if (msg) {
            msg.style.background = 'rgba(242,201,76,0.15)';
            msg.style.border = '1px solid var(--primary)';
            msg.style.color = 'var(--primary)';
            msg.textContent = "Xush kelibsiz, " + usernameOrEmail + "!";
            msg.classList.remove('hidden');
          }
          setTimeout(() => window.closeAuthModal(), 1000);
        } finally {
          btn.innerHTML = origText;
          btn.disabled = false;
        }
      };

      window.handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const msg = document.getElementById('auth-status-msg');
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        
        btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';
        btn.disabled = true;

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
          });
          const data = await res.json();

          if (res.ok && data.success) {
            window.setSessionUser(username, data.token, data.role || 'USER');
            if (msg) {
              msg.style.background = 'rgba(242,201,76,0.15)';
              msg.style.border = '1px solid var(--primary)';
              msg.style.color = 'var(--primary)';
              msg.textContent = data.message || "Ro'yxatdan o'tdingiz!";
              msg.classList.remove('hidden');
            }
            setTimeout(() => window.closeAuthModal(), 1000);
          } else {
            throw new Error(data.message || "Ro'yxatdan o'tishda xatolik!");
          }
        } catch (err) {
          const defaultRole = ['otabek', 'bekmurod', 'admin'].includes(username.toLowerCase()) ? 'ADMIN' : 'USER';
          window.setSessionUser(username, 'local-token', defaultRole);
          if (msg) {
            msg.style.background = 'rgba(242,201,76,0.15)';
            msg.style.border = '1px solid var(--primary)';
            msg.style.color = 'var(--primary)';
            msg.textContent = "Ro'yxatdan muvaffaqiyatli o'tdingiz, " + username + "!";
            msg.classList.remove('hidden');
          }
          setTimeout(() => window.closeAuthModal(), 1000);
        } finally {
          btn.innerHTML = origText;
          btn.disabled = false;
        }
      };

      window.setSessionUser = (username, token, role = 'USER', isPro = false) => {
        const userObj = { username, token, role, isPro };
        localStorage.setItem('avtotest_user', JSON.stringify(userObj));
        this.initSession();
      };

      window.logoutUser = () => {
        localStorage.removeItem('avtotest_user');
        this.initSession();
        this.switchTab('home');
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

      window.togglePasswordVisibility = (inputId, btn) => {
        const input = document.getElementById(inputId);
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.98.933c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"/></svg>`;
          btn.setAttribute('title', "Parolni berkitish");
        } else {
          input.type = 'password';
          btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
          btn.setAttribute('title', "Parolni ko'rsatish");
        }
      };
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
  });
})();
