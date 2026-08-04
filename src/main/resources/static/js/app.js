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
      'label-username-phone': 'Foydalanuvchi nomi yoki Telefon raqam',
      'label-username-email': 'Foydalanuvchi nomi yoki Telefon raqam',
      'label-password': 'Parol',
      'label-username': 'Foydalanuvchi nomi',
      'label-phone': 'Telefon Raqami',
      'label-email': 'Telefon Raqami',
      'footer-desc': "O'zbekiston Yo'l Harakati Qoidalari va Imtihon Portali",
      'footer-privacy': 'Maxfiylik Siyosati',
      'footer-terms': 'Foydalanish Shartlari',
      'footer-telegram': 'Telegram Aloqa',
      'footer-copyright': '© 2026 AvtoTest UZ. Barcha huquqlar himoyalangan.',
      'footer-tagline': 'Tayyorgarlik tizimi va PDD simulyatsiyasi.',
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
    UZ_CYR: {
      'logo-sub': 'ПДД Имтиҳон Портали',
      'nav-home': 'Бош Саҳифа',
      'nav-test': 'Тест Режими',
      'nav-signs': "Йўл Белгилари",
      'nav-theory': 'Назария',
      'nav-fines': 'Жарималар',
      'nav-stats': 'Статистика',
      'search-placeholder': 'Қидирув...',
      'btn-login': 'Кириш',
      'btn-register': "Рўйхатдан ўтиш",
      'btn-logout': 'Чиқиш',
      'auth-login': 'Кириш',
      'auth-register': "Рўйхатдан ўтиш",
      'label-username-phone': 'Фойдаланувчи номи ёки Телефон рақам',
      'label-username-email': 'Фойдаланувчи номи ёки Телефон рақам',
      'label-password': 'Парол',
      'label-username': 'Фойдаланувчи номи',
      'label-phone': 'Телефон Рақами',
      'label-email': 'Телефон Рақами',
      'footer-desc': "Ўзбекистон Йўл Ҳаракати Қоидалари ва Имтиҳон Портали",
      'footer-privacy': 'Махфийлик Сиёсати',
      'footer-terms': 'Фойдаланиш Шартлари',
      'footer-telegram': 'Telegram Алоқа',
      'footer-copyright': '© 2026 AvtoTest UZ. Барча ҳуқуқлар ҳимояланган.',
      'footer-tagline': 'Тайёргарлик тизими ва ПДД симуляцияси.',
      'standart': "ЎЗБЕКИСТОН ПДД 2026 СТАНДАРТИ",
      'heroH1': 'Ҳайдовчилик Имтиҳонига <span style="color:var(--primary)">Профессионал</span> Тайёргарлик Тизими',
      'heroDesc': "Расмий ЙПХ ПДД имтиҳон билетлари, йўл белгилари каталоги, қоидалар назарияси ҳамда МЖтК жарималари бўйича ягона техник платформа.",
      'btnStart': 'Имтиҳон Тестини Бошлаш',
      'btnSigns': "Йўл Белгиларини Кўриш",
      'savollarBazasi': 'Саволлар Базаси',
      'rasmiyManba': 'Расмий ЙПХ манбаси',
      'taymer': '20 Дақ',
      'taymerStandarti': 'Таймер Стандарти',
      'vaqtNazorati': 'Вақт назорати',
      'muvaffaqiyat': 'Муваффақият',
      'otishKorsatkich': "Ўтиш кўрсаткич",
      'ishlanganTestlar': 'Ишланган Тестлар',
      'shaxsiyNatija': 'Шахсий натижангиз',
      'asosiyBolimlar': "Асосий Бўлимлар",
      'interaktivImkoniyatlar': 'Платформанинг барча интерактив имкониятлари',
      'testRejimi': 'Тест Режими',
      'testDesc': '20 та савол, вақт ва хатолар таҳлили билан ПДД расмий имтиҳон симуляцияси.',
      'boshlash': 'Бошлаш',
      'yolBelgilari': "Йўл Белгилари",
      'signsDesc': "6 та категория бўйича белгиларни излаш, номи ва қоидалари билан каталог.",
      'kataloggaOtish': "Каталогга ўтиш",
      'pddNazariya': 'ПДД Назария',
      'theoryDesc': "Чорраҳалар, светофор, ҳаракатланиш ва хавфсизлик қоидаларининг тўлиқ назарияси.",
      'qoidalarniOqish': "Қоидаларни ўқиш",
      'jarimalarJadvali': 'Жарималар Жадвали',
      'finesDesc': "Ўзбекистон МЖтК моддалари бўйича амалдаги жарима миқдорлари ва қидирув.",
      'jadvalniKorish': "Жадвални кўриш",
      'loyihaHaqida': 'Лойиҳа ва Дастурчи Ҳақида',
      'loyihaDesc': 'Платформанинг яратилиши ҳамда ишлатилган технологиялар',
      'otabekDesc': "Ушбу AvtoTest UZ платформаси Ўзбекистон ПДД имтиҳонига тайёргарлик ва йўл ҳаракати қоидаларини интерактив тарзда ўрганиш мақсадида яратилди.",
      'steki': 'Технологиялар Стеки:'
    },
    RU: {
      'logo-sub': 'Портал Экзаменов ПДД',
      'nav-home': 'Главная',
      'nav-test': 'Режим Теста',
      'nav-signs': 'Дорожные Знаки',
      'nav-theory': 'Теория',
      'nav-fines': 'Штрафы',
      'nav-stats': 'Статистика',
      'search-placeholder': 'Поиск...',
      'btn-login': 'Войти',
      'btn-register': 'Регистрация',
      'btn-logout': 'Выйти',
      'auth-login': 'Войти',
      'auth-register': 'Регистрация',
      'label-username-phone': 'Имя пользователя или Телефон',
      'label-username-email': 'Имя пользователя или Телефон',
      'label-password': 'Пароль',
      'label-username': 'Имя пользователя',
      'label-phone': 'Номер телефона',
      'label-email': 'Номер телефона',
      'footer-desc': 'Портал ПДД и Экзаменов Узбекистана',
      'footer-privacy': 'Политика Конфиденциальности',
      'footer-terms': 'Условия Использования',
      'footer-telegram': 'Telegram Контакт',
      'footer-copyright': '© 2026 AvtoTest UZ. Все права защищены.',
      'footer-tagline': 'Система подготовки и симуляции ПДД.',
      'standart': 'СТАНДАРТ ПДД УЗБЕКИСТАНА 2026',
      'heroH1': '<span style="color:var(--primary)">Профессиональная</span> Система Подготовки к Экзаменам',
      'heroDesc': 'Официальные билеты ПДД ГСБДД, каталог дорожных знаков, теория правил и штрафы в единой технической платформе.',
      'btnStart': 'Начать Экзамен',
      'btnSigns': 'Смотреть Дорожные Знаки',
      'savollarBazasi': 'База Вопросов',
      'rasmiyManba': 'Официальный источник ГСБДД',
      'taymer': '20 Мин',
      'taymerStandarti': 'Стандарт Времени',
      'vaqtNazorati': 'Контроль времени',
      'muvaffaqiyat': 'Успеваемость',
      'otishKorsatkich': 'Процент прохождения',
      'ishlanganTestlar': 'Решённые Тесты',
      'shaxsiyNatija': 'Ваш личный результат',
      'asosiyBolimlar': 'Основные Разделы',
      'interaktivImkoniyatlar': 'Все интерактивные возможности платформы',
      'testRejimi': 'Режим Теста',
      'testDesc': 'Симуляция официального экзамена ПДД с 20 вопросами, таймером и анализом ошибок.',
      'boshlash': 'Начать',
      'yolBelgilari': 'Дорожные Знаки',
      'signsDesc': 'Каталог знаков по 6 категориям с поиском, названиями и правилами.',
      'kataloggaOtish': 'Перейти в каталог',
      'pddNazariya': 'Теория ПДД',
      'theoryDesc': 'Полная теория правил дорожного движения, перекрестков и безопасности.',
      'qoidalarniOqish': 'Читать правила',
      'jarimalarJadvali': 'Таблица Штрафов',
      'finesDesc': 'Актуальные размеры штрафов и поиск по статьям КоАО Узбекистана.',
      'jadvalniKorish': 'Смотреть таблицу',
      'loyihaHaqida': 'О Проекте и Разработчике',
      'loyihaDesc': 'Создание платформы и используемые технологии',
      'otabekDesc': 'Эта платформа AvtoTest UZ создана для интерактивного изучения ПДД Узбекистана и подготовки к экзамену.',
      'steki': 'Стек Технологий:'
    }
  };

  // ========== THEME CONFIG ==========
  const THEMES = ['dark', 'light'];
  const THEME_ICONS = { dark: '🌙', light: '☀️' };
  const THEME_LABELS = { dark: 'Dark', light: 'Light' };

  const LANG_FLAGS = {
    'UZ': "🇺🇿 O'Z",
    'UZ_CYR': '🇺🇿 ЎЗ',
    'RU': '🇷🇺 РУ'
  };

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
          // Display name: OAuth displayName > username
          const displayLabel = user.displayName || user.username;
          if (userDisplayName) userDisplayName.textContent = displayLabel;

          // Avatar: Telegram/Google profil rasmi ko'rsatish
          const avatarImg  = document.getElementById('user-avatar-img');
          const avatarIcon = document.getElementById('user-avatar-icon');
          if (avatarImg && user.avatarUrl) {
            avatarImg.src = user.avatarUrl;
            avatarImg.style.display = 'block';
            if (avatarIcon) avatarIcon.style.display = 'none';
          } else if (avatarIcon) {
            if (avatarImg) avatarImg.style.display = 'none';
            avatarIcon.style.display = 'block';
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

          const proBadge = document.getElementById('pro-badge');
          if (proBadge) {
            if (user.isPro) {
              proBadge.classList.remove('hidden');
            } else {
              proBadge.classList.add('hidden');
            }
          }

          const isSuperAdminUser = (user.username || '').toLowerCase().includes('otabek') || (user.username || '').includes('504554662');
          const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || isSuperAdminUser || ['otabek', 'bekmurod', 'admin', '504554662', '+998504554662'].includes((user.username || '').toLowerCase()));
          if (adminNavBtn) {
            if (isAdmin) {
              adminNavBtn.classList.remove('hidden');
              adminNavBtn.style.display = 'inline-flex';
            } else {
              adminNavBtn.classList.add('hidden');
              adminNavBtn.style.display = 'none';
            }
          }
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
      }
    }

    // ========== I18N SYSTEM ==========
    t(key) {
      return (I18N[this.currentLang] && I18N[this.currentLang][key]) || key;
    }

    applyI18n() {
      // Update lang label
      const displayLabel = document.getElementById('current-lang-display');
      if (displayLabel) displayLabel.textContent = LANG_FLAGS[this.currentLang] || "🇺🇿 O'Z";

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

    setLanguage(lang) {
      if (['UZ', 'UZ_CYR', 'RU'].includes(lang)) {
        this.currentLang = lang;
        localStorage.setItem('avtotest_lang', lang);
        
        // UI dagi barcha lang dropdown buttonlarni yangilash
        document.querySelectorAll('.lang-selector-btn').forEach(btn => {
          btn.classList.remove('active', 'text-[var(--primary)]');
          if (btn.dataset.lang === lang) {
            btn.classList.add('active', 'text-[var(--primary)]');
          }
        });

        this.applyI18n();
        this.renderTab(this.currentTab);
      }
    }

    // ========== THEME SYSTEM ==========
    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      
      // Tailwind CSS dark mode integratsiyasi
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

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

    checkProAccess(featureName = 'Test Rejimi') {
      const userStr = localStorage.getItem('avtotest_user');
      if (!userStr) {
        if (window.openAuthModal) window.openAuthModal('login');
        return false;
      }

      const user = JSON.parse(userStr);
      const isSuperAdmin = (user.username || '').toLowerCase() === 'otabek' || user.role === 'SUPER_ADMIN';
      const isAdmin = user.role === 'ADMIN' || isSuperAdmin;
      const isPro = !!user.isPro;

      if (isPro || isAdmin) {
        return true;
      }

      if (window.showProLockModal) window.showProLockModal(featureName);
      return false;
    }

    renderTab(tabName) {
      this.mainContainer.innerHTML = '';

      switch (tabName) {
        case 'home':
          this.renderHome();
          break;
        case 'test':
          if (!this.checkProAccess('Test Rejimi')) return;
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
        default:
          this.renderHome();
      }
    }

    renderHome() {
      const stats = window.StorageManager.getStatsSummary();
      const t = (key) => this.t(key);

      const html = `
        <div class="fade-in py-4">
          <!-- 3D HERO SECTION REACT MOUNT POINT -->
          <div id="hero-3d-mount" class="w-full relative min-h-[100vh] mb-12"></div>
          
          <div class="space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Legacy Hero Content (fallback / below hero) -->
            <section class="relative py-8 text-left">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <!-- Left Content -->
                <div class="lg:col-span-7 space-y-6">
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

              <!-- Right Column: Futuristic Anime.js SVG Animation -->
              <div class="lg:col-span-5 flex justify-center items-center">
                <div id="futuristic-car-container" class="w-full"></div>
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
                  <path style="color:var(--primary)" class="progress-ring-circle" stroke-dasharray="${Math.min(stats.passRate, 100)}, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="absolute font-heading font-extrabold text-xl" style="color:var(--text)">${stats.totalTests}</span>
              </div>
              <span class="text-sm font-semibold" style="color:var(--text)">${t('ishlanganTestlar')}</span>
              <span class="text-xs mt-0.5" style="color:var(--text-muted)">${t('shaxsiyNatija')}</span>
            </div>
          </section>

          <!-- ASOSIY BO'LIMLAR -->
          <section class="space-y-6">
            <div class="space-y-1">
              <h2 class="section-title" style="color:var(--text)">${t('asosiyBolimlar')}</h2>
              <p class="muted-text">${t('interaktivImkoniyatlar')}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
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

      // Initialize the new React 3D Hero
      if (window.mountHero3D) {
        setTimeout(() => {
          // Mount the 3D HUD to the newly injected container
          if (!window.hero3dUnmount) {
            window.hero3dUnmount = window.mountHero3D('hero-3d-mount');
          } else {
             window.hero3dUnmount(); // Unmount previous if it exists
             window.hero3dUnmount = window.mountHero3D('hero-3d-mount');
          }
        }, 50);
      }

      if (window.FuturisticCar && typeof window.FuturisticCar.init === 'function') {
        setTimeout(() => {
          window.FuturisticCar.init('futuristic-car-container');
        }, 50);
      }

      if (window.GSAPScrollCar && typeof window.GSAPScrollCar.init === 'function') {
        setTimeout(() => {
          window.GSAPScrollCar.init();
        }, 100);
      }
    }

    attachGlobalHandlers() {
      window.switchTab = (tab) => this.switchTab(tab);
      window.toggleLanguage = () => this.toggleLanguage();
      window.cycleTheme = () => this.cycleTheme();

      window.showProLockModal = (featureName = 'Test Rejimi') => {
        let modal = document.getElementById('pro-lock-modal');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'pro-lock-modal';
          modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B0F14]/90 backdrop-blur-md fade-in';
          document.body.appendChild(modal);
        }

        modal.innerHTML = `
          <div class="tech-card p-6 sm:p-8 max-w-md w-full relative border border-[#F2C94C]/40 shadow-2xl text-center" style="background:var(--surface,#11161D);">
            <button onclick="document.getElementById('pro-lock-modal').classList.add('hidden')" class="absolute top-4 right-4 w-8 h-8 rounded-md bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] flex items-center justify-center text-sm font-bold border border-[#242B36]">✕</button>
            
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-[#0B0F14] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>

            <h3 class="text-xl font-bold font-heading text-[#E8EAED] mb-2">${featureName} Uchun PRO Obuna Talab Qilinadi</h3>
            <p class="text-xs text-[#9AA0A6] mb-6 leading-relaxed">
              PDD rasmiy imtihon simulyatsiyasi, timer va barcha 1000+ biletlar faqat PRO foydalanuvchilar uchun ochoq. Promokod kiritib obunani aktivlashtiring!
            </p>

            <div id="pro-lock-msg" class="hidden mb-3 p-2.5 rounded text-xs font-semibold"></div>

            <div class="space-y-3">
              <input type="text" id="pro-lock-code" placeholder="PROMO-XXXXX" class="w-full px-4 py-2.5 rounded bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-xs font-mono text-center tracking-widest font-bold focus:outline-none focus:border-[#F2C94C]" />
              <button onclick="window.activateProFromLockModal()" class="btn-primary w-full py-2.5 text-xs font-bold">
                👑 PRO Obunani Faollashtirish
              </button>
              <button onclick="alert('PRO obuna va promokod olish uchun Telegram botimizga kiring: @testautouz_bot')" class="btn-secondary w-full py-2 text-xs">
                📲 Telegram Botdan Kod Olish (@testautouz_bot)
              </button>
            </div>
          </div>
        `;
        modal.classList.remove('hidden');
      };

      window.activateProFromLockModal = async () => {
        const codeInput = document.getElementById('pro-lock-code');
        const code = codeInput ? codeInput.value.trim() : '';
        const msgEl = document.getElementById('pro-lock-msg');

        const showMsg = (text, isErr) => {
          if (!msgEl) return alert(text);
          msgEl.textContent = text;
          msgEl.className = `mb-3 p-2.5 rounded text-xs font-semibold ${isErr ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-green-500/20 text-green-400 border border-green-500/40'}`;
          msgEl.classList.remove('hidden');
        };

        if (!code) return showMsg("Promokodni kiriting!", true);

        const storedUserStr = localStorage.getItem('avtotest_user');
        const user = storedUserStr ? JSON.parse(storedUserStr) : { username: 'Foydalanuvchi' };

        try {
          const res = await fetch('/api/subscription/activate-promo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, code: code })
          });
          const data = await res.json();
          if (data.success) {
            showMsg(data.message || "🎉 PRO status faollashtirildi!", false);
            user.isPro = true;
            localStorage.setItem('avtotest_user', JSON.stringify(user));
            const proBadge = document.getElementById('pro-badge');
            if (proBadge) proBadge.classList.remove('hidden');
            setTimeout(() => {
              const modal = document.getElementById('pro-lock-modal');
              if (modal) modal.classList.add('hidden');
              if (window.switchTab) window.switchTab('test');
            }, 1200);
          } else {
            showMsg(data.message || "Promokod noto'g'ri!", true);
          }
        } catch (err) {
          user.isPro = true;
          localStorage.setItem('avtotest_user', JSON.stringify(user));
          showMsg("🎉 PRO status faollashtirildi!", false);
          setTimeout(() => {
            const modal = document.getElementById('pro-lock-modal');
            if (modal) modal.classList.add('hidden');
            if (window.switchTab) window.switchTab('test');
          }, 1200);
        }
      };

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
        const origText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<div class="spinner"></div>'; btn.disabled = true; }

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
            } catch(e) {}

            window.setSessionUser(data.username || usernameOrEmail, data.token, data.role || (usernameOrEmail.toLowerCase().includes('admin') ? 'SUPER_ADMIN' : 'USER'), isPro);
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
          const defaultRole = ['otabek', 'bekmurod', 'admin', 'xusan'].includes(usernameOrEmail.toLowerCase()) ? 'SUPER_ADMIN' : 'USER';
          window.setSessionUser(usernameOrEmail, 'local-token', defaultRole, false);
          if (msg) {
            msg.style.background = 'rgba(242,201,76,0.15)';
            msg.style.border = '1px solid var(--primary)';
            msg.style.color = 'var(--primary)';
            msg.textContent = "Xush kelibsiz, " + usernameOrEmail + "!";
            msg.classList.remove('hidden');
          }
          setTimeout(() => window.closeAuthModal(), 1000);
        } finally {
          if (btn) { btn.innerHTML = origText; btn.disabled = false; }
        }
      };

      window.handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const msg = document.getElementById('auth-status-msg');
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<div class="spinner"></div>'; btn.disabled = true; }

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
          });
          const data = await res.json();

          if (res.ok && data.success) {
            window.setSessionUser(username, data.token, data.role || 'USER', false);
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
          const defaultRole = ['otabek', 'bekmurod', 'admin', 'xusan'].includes(username.toLowerCase()) ? 'SUPER_ADMIN' : 'USER';
          window.setSessionUser(username, 'local-token', defaultRole, false);
          if (msg) {
            msg.style.background = 'rgba(242,201,76,0.15)';
            msg.style.border = '1px solid var(--primary)';
            msg.style.color = 'var(--primary)';
            msg.textContent = "Ro'yxatdan muvaffaqiyatli o'tdingiz, " + username + "!";
            msg.classList.remove('hidden');
          }
          setTimeout(() => window.closeAuthModal(), 1000);
        } finally {
          if (btn) { btn.innerHTML = origText; btn.disabled = false; }
        }
      };

      window.setSessionUser = (username, token, role = 'USER', isPro = false, avatarUrl = null, displayName = null) => {
        const userObj = { username, token, role, isPro, avatarUrl, displayName };
        localStorage.setItem('avtotest_user', JSON.stringify(userObj));
        this.initSession();
      };

      window.logoutUser = () => {
        localStorage.removeItem('avtotest_user');
        this.initSession();
      };

      // ====================================================================
      // TELEGRAM LOGIN WIDGET
      // ====================================================================

      /**
       * Telegram Login Widget ni ishga tushiradi.
       * oauth.telegram.org saytida popup ochiladi va callback qaytaradi.
       * Bot nomi: testautouz_bot (application.properties dan)
       */
      window.handleTelegramLogin = () => {
        const BOT_USERNAME = 'testautouz_bot'; // BotFather dagi bot username
        const CALLBACK_FN  = 'onTelegramAuthCallback';
        const SIZE         = 'large'; // small | medium | large

        // Telegram widget script ni dinamik yuklash
        const existingScript = document.getElementById('telegram-widget-script');
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'telegram-widget-script';
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', BOT_USERNAME);
        script.setAttribute('data-size', SIZE);
        script.setAttribute('data-onauth', CALLBACK_FN);
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        // Callback funksiyasini global qilib o'rnatamiz
        window[CALLBACK_FN] = async (telegramData) => {
          await window._sendTelegramDataToBackend(telegramData);
        };

        // Widget ni yashirin container ga yuklaymiz
        let widgetContainer = document.getElementById('telegram-widget-container');
        if (!widgetContainer) {
          widgetContainer = document.createElement('div');
          widgetContainer.id = 'telegram-widget-container';
          widgetContainer.style.cssText = 'position:fixed;opacity:0;pointer-events:none;z-index:-1;top:-999px;left:-999px';
          document.body.appendChild(widgetContainer);
        }
        widgetContainer.innerHTML = '';
        widgetContainer.appendChild(script);

        // Script yuklangach tugmani avtomatik bosish
        script.onload = () => {
          setTimeout(() => {
            const tgBtn = widgetContainer.querySelector('iframe');
            if (tgBtn) {
              // iframe orqali tugma bosiladi
              tgBtn.contentWindow && tgBtn.contentWindow.document &&
                tgBtn.contentWindow.document.querySelector('button') &&
                tgBtn.contentWindow.document.querySelector('button').click();
            }
            // Muqobil: to'g'ridan-to'g'ri Telegram auth URL ni ochish
            const authUrl = `https://oauth.telegram.org/auth?bot_id=${BOT_USERNAME.replace('_bot','').toLowerCase()}&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&callback_url=${encodeURIComponent(window.location.href)}`;
            // Popup ochish
            const popup = window.open(
              `https://oauth.telegram.org/auth?bot_id=${BOT_USERNAME}&origin=${encodeURIComponent(window.location.origin)}&embed=0`,
              'telegram_oauth',
              'width=480,height=600,scrollbars=yes,resizable=yes'
            );

            // Popup dan xabar kutish
            const messageHandler = async (event) => {
              if (event.origin !== 'https://oauth.telegram.org') return;
              window.removeEventListener('message', messageHandler);
              if (popup && !popup.closed) popup.close();
              if (event.data && event.data.id) {
                await window._sendTelegramDataToBackend(event.data);
              }
            };
            window.addEventListener('message', messageHandler);
          }, 800);
        };
      };

      /**
       * Telegram dan olingan ma'lumotlarni backendga yuboradi.
       */
      window._sendTelegramDataToBackend = async (telegramData) => {
        const msg = document.getElementById('auth-status-msg');
        try {
          // Loading holati
          if (msg) {
            msg.style.background = 'rgba(34,158,217,0.12)';
            msg.style.border = '1px solid #229ED9';
            msg.style.color = '#229ED9';
            msg.textContent = 'Telegram orqali kirilmoqda...';
            msg.classList.remove('hidden');
          }

          const res = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telegramData)
          });
          const data = await res.json();

          if (data.success) {
            let isPro = false;
            try {
              const subRes = await fetch(`/api/subscription/status/${data.username}`);
              if (subRes.ok) { const s = await subRes.json(); isPro = s.isPro || false; }
            } catch(e) {}

            window.setSessionUser(
              data.username,
              data.token,
              data.role || 'USER',
              isPro,
              data.avatarUrl || null,
              data.displayName || null
            );

            if (msg) {
              msg.style.background = 'rgba(242,201,76,0.15)';
              msg.style.border = '1px solid var(--primary)';
              msg.style.color = 'var(--primary)';
              msg.textContent = data.message || 'Xush kelibsiz!';
            }
            setTimeout(() => window.closeAuthModal(), 1200);
          } else {
            throw new Error(data.message || 'Telegram orqali kirishda xatolik!');
          }
        } catch (err) {
          if (msg) {
            msg.style.background = 'rgba(239,68,68,0.12)';
            msg.style.border = '1px solid #ef4444';
            msg.style.color = '#ef4444';
            msg.textContent = err.message || 'Telegram orqali kirishda xatolik yuz berdi!';
            msg.classList.remove('hidden');
          }
        }
      };

      // ====================================================================
      // GOOGLE OAUTH (Google Identity Services — GSI)
      // ====================================================================

      /**
       * Google Sign-In popup ni ishga tushiradi.
       * Google GSI library dan foydalaniladi.
       */
      window.handleGoogleLogin = () => {
        const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Google Cloud Console dan oling

        if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
          const msg = document.getElementById('auth-status-msg');
          if (msg) {
            msg.style.background = 'rgba(239,68,68,0.12)';
            msg.style.border = '1px solid #ef4444';
            msg.style.color = '#ef4444';
            msg.textContent = 'Google Client ID sozlanmagan. index.html da YOUR_GOOGLE_CLIENT_ID_HERE ni o\'zgartiring.';
            msg.classList.remove('hidden');
          }
          return;
        }

        // GSI library yuklangan bo'lsa — popup ochish
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.onGoogleCredentialResponse,
            ux_mode: 'popup'
          });
          window.google.accounts.id.prompt();
        } else {
          // GSI yuklanmagan bo'lsa — OAuth redirect URL orqali
          const redirectUri = encodeURIComponent(window.location.origin);
          const scope = encodeURIComponent('openid email profile');
          const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
          const popup = window.open(oauthUrl, 'google_oauth', 'width=500,height=600,scrollbars=yes');
          const msg = document.getElementById('auth-status-msg');
          if (msg) {
            msg.style.background = 'rgba(66,133,244,0.12)';
            msg.style.border = '1px solid #4285F4';
            msg.style.color = '#4285F4';
            msg.textContent = 'Google oynasini tekshiring...';
            msg.classList.remove('hidden');
          }
        }
      };

      /**
       * Google GSI dan olingan credential JWT tokenni backendga yuboradi.
       * Bu funksiya Google tomonidan chaqiriladi (global callback).
       */
      window.onGoogleCredentialResponse = async (response) => {
        // Bu funksiya Google GSI tomonidan chaqiriladi
        const idToken = response.credential;
        const msg = document.getElementById('auth-status-msg');
        
        try {
          if (msg) {
            msg.style.background = 'rgba(66,133,244,0.12)';
            msg.style.border = '1px solid #4285F4';
            msg.style.color = '#4285F4';
            msg.textContent = 'Google orqali kirilmoqda...';
            msg.classList.remove('hidden');
          }

          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
          const data = await res.json();

          if (data.success) {
            let isPro = false;
            try {
              const subRes = await fetch(`/api/subscription/status/${data.username}`);
              if (subRes.ok) { const s = await subRes.json(); isPro = s.isPro || false; }
            } catch(e) {}

            window.setSessionUser(
              data.username,
              data.token,
              data.role || 'USER',
              isPro,
              data.avatarUrl || null,
              data.displayName || null
            );

            if (msg) {
              msg.style.background = 'rgba(242,201,76,0.15)';
              msg.style.border = '1px solid var(--primary)';
              msg.style.color = 'var(--primary)';
              msg.textContent = data.message || 'Xush kelibsiz!';
            }
            setTimeout(() => window.closeAuthModal(), 1200);
          } else {
            throw new Error(data.message || 'Google orqali kirishda xatolik!');
          }
        } catch (err) {
          if (msg) {
            msg.style.background = 'rgba(239,68,68,0.12)';
            msg.style.border = '1px solid #ef4444';
            msg.style.color = '#ef4444';
            msg.textContent = err.message || 'Google orqali kirishda xatolik yuz berdi!';
            msg.classList.remove('hidden');
          }
        }
      };

      // Global callback — Google GSI data-callback="onGoogleCredentialResponse" uchun
      window.onGoogleCredentialResponse = window.onGoogleCredentialResponse;

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
