(function() {
  window.AdminModule = {
    activeTab: 'users',
    usersList: [],
    questionsList: [],
    announcementsList: [],
    auditLogs: [],
    systemSettings: {
      examDurationMinutes: 25,
      passingScoreThreshold: 18,
      maintenanceMode: false,
      siteTitle: "AvtoTest UZ — PDD Imtihon Portali"
    },
    searchQuery: '',
    roleFilter: 'ALL',
    editingUserId: null,
    editingQuestionId: null,

    async init(containerEl) {
      this.container = containerEl;
      await this.fetchAllData();
      this.render();
    },

    async fetchAllData() {
      // 1. Fetch Users
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) this.usersList = await res.json();
        else throw new Error();
      } catch (e) {
        this.usersList = [
          { id: 1, username: 'otabek', email: 'otabeksotimov9@gmail.com', role: 'SUPER_ADMIN', permissions: 'ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS', isPro: true },
          { id: 2, username: 'bekmurod', email: 'bekmurod@gmail.com', role: 'ADMIN', permissions: 'MANAGE_USERS,MANAGE_TESTS', isPro: true },
          { id: 3, username: 'haydovchi_2026', email: 'driver@mail.ru', role: 'USER', permissions: 'BASIC', isPro: false },
          { id: 4, username: 'student_pdd', email: 'student@edu.uz', role: 'USER', permissions: 'BASIC', isPro: false }
        ];
      }

      // 2. Fetch Announcements
      try {
        const res = await fetch('/api/admin/announcements');
        if (res.ok) this.announcementsList = await res.json();
        else throw new Error();
      } catch (e) {
        this.announcementsList = [
          { id: 1, title: 'PDD Imtihon Portaliga xush kelibsiz!', text: 'Yangi savollar to\'plami va 2026-yilgi qoidalar yangilandi.', type: 'INFO', active: true, date: '2026-08-01 10:00' },
          { id: 2, title: 'Texnik profilaktika', text: 'Har yakshanba soat 03:00 da profilaktika o\'tkaziladi.', type: 'WARNING', active: true, date: '2026-07-28 15:30' }
        ];
      }

      // 3. Fetch Settings
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) this.systemSettings = await res.json();
      } catch (e) {}

      // 4. Fetch Logs
      try {
        const res = await fetch('/api/admin/logs');
        if (res.ok) this.auditLogs = await res.json();
        else throw new Error();
      } catch (e) {
        this.auditLogs = [
          { id: 101, admin: 'otabek', action: 'UPDATE_USER_PERMISSIONS', target: 'bekmurod', time: '10 daqiqa oldin' },
          { id: 102, admin: 'otabek', action: 'CREATE_ANNOUNCEMENT', target: 'E\'lon #2', time: '25 daqiqa oldin' },
          { id: 103, admin: 'system', action: 'DATABASE_BACKUP_COMPLETED', target: 'PostgreSQL', time: '1 soat oldin' },
          { id: 104, admin: 'bekmurod', action: 'EDIT_QUESTION', target: 'Bilet 3, Savol 5', time: '3 soat oldin' }
        ];
      }

      // 5. Default Questions List
      this.questionsList = [
        { id: 1, ticketId: 1, question: "Chorrahada quvib o'tishga ruxsat beriladimi?", image: "", options: ["Faqat asosiy yo'lda harakatlanayotganda", "Har qanday holatda ruxsat beriladi", "Taqiqlanadi", "Faqat sutkaning yorug' vaqtida"], correct: 0, explanation: "Chorrahada asosiy yo'ldan ketayotgan transport vositasiga quvib o'tishga ruxsat beriladi." },
        { id: 2, ticketId: 1, question: "Qizil svetofor ishorasida o'ngga burilish qachon mumkin?", image: "", options: ["Qo'shimcha yashil strelka yonib turganda", "Har doim", "Faqat piyodalar bo'lmaganda", "Aslo mumkin emas"], correct: 0, explanation: "Faqat qo'shimcha yashil strelka yonib turganda burilishga ruxsat beriladi." },
        { id: 3, ticketId: 2, question: "Toshkent shahrida maksimal ruxsat etilgan tezlik qancha?", image: "", options: ["60 km/soat", "70 km/soat", "80 km/soat", "50 km/soat"], correct: 0, explanation: "Aholi punktlarida yengil avtomobillar uchun maksimal tezlik 60 km/soat qilib belgilangan." }
      ];
    },

    switchTab(tabName) {
      this.activeTab = tabName;
      this.render();
    },

    setSearch(query) {
      this.searchQuery = query.toLowerCase().trim();
      if (this.activeTab === 'users') this.renderUsersGrid();
      else if (this.activeTab === 'questions') this.renderQuestionsGrid();
    },

    setRoleFilter(role) {
      this.roleFilter = role;
      this.renderUsersGrid();
    },

    async togglePro(userId) {
      try {
        const res = await fetch(`/api/admin/users/${userId}/toggle-pro`, { method: 'POST' });
        const data = await res.json();
        alert(data.message || "PRO status yangilandi!");
        await this.fetchAllData();
        this.render();
      } catch(e) {
        const u = this.usersList.find(x => x.id === userId);
        if (u) {
          u.isPro = !u.isPro;
          alert("PRO status yangilandi: " + (u.isPro ? "👑 PRO Obuna Berildi" : "ODDIY"));
          this.render();
        }
      }
    }
  };
})();
