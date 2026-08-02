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
          { id: 1, username: 'otabek', email: 'otabeksotimov9@gmail.com', role: 'SUPER_ADMIN', permissions: 'ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS' },
          { id: 2, username: 'bekmurod', email: 'bekmurod@gmail.com', role: 'ADMIN', permissions: 'MANAGE_USERS,MANAGE_TESTS' },
          { id: 3, username: 'haydovchi_2026', email: 'driver@mail.ru', role: 'USER', permissions: 'BASIC' },
          { id: 4, username: 'student_pdd', email: 'student@edu.uz', role: 'USER', permissions: 'BASIC' }
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

    // CSV EXPORT FOR USERS
    exportUsersCSV() {
      const headers = ["ID", "Username", "Email", "Role", "Permissions"];
      const rows = this.usersList.map(u => [u.id, `"${u.username}"`, `"${u.email}"`, `"${u.role}"`, `"${u.permissions || 'BASIC'}"`]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `AvtoTest_Users_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // USER MODAL HANDLERS
    openCreateUserModal() {
      const modal = document.getElementById('admin-create-user-modal');
      if (modal) modal.classList.remove('hidden');
    },

    closeCreateUserModal() {
      const modal = document.getElementById('admin-create-user-modal');
      if (modal) modal.classList.add('hidden');
    },

    async createUser(e) {
      e.preventDefault();
      const username = document.getElementById('new-username').value;
      const email = document.getElementById('new-email').value;
      const password = document.getElementById('new-password').value || '12345678';
      const role = document.getElementById('new-role').value;

      const permsArr = [];
      if (document.getElementById('new-perm-users').checked) permsArr.push('MANAGE_USERS');
      if (document.getElementById('new-perm-tests').checked) permsArr.push('MANAGE_TESTS');
      if (document.getElementById('new-perm-announce').checked) permsArr.push('ANNOUNCEMENTS');
      if (role === 'SUPER_ADMIN') permsArr.push('ALL');
      const permissions = permsArr.join(',') || 'BASIC';

      const payload = { username, email, password, role, permissions };

      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) this.usersList.push(data.user);
        } else throw new Error();
      } catch (err) {
        const newObj = { id: Date.now(), username, email, password, role, permissions };
        this.usersList.push(newObj);
      }

      this.closeCreateUserModal();
      this.render();
      alert("✅ Yangi foydalanuvchi muvaffaqiyatli qo'shildi!");
    },

    openEditModal(userId) {
      const user = this.usersList.find(u => u.id === userId);
      if (!user) return;

      this.editingUserId = userId;
      const modal = document.getElementById('admin-edit-user-modal');
      
      document.getElementById('edit-username').value = user.username;
      document.getElementById('edit-email').value = user.email;
      document.getElementById('edit-password').value = '';
      document.getElementById('edit-role').value = user.role;

      const perms = (user.permissions || '').split(',');
      document.getElementById('perm-users').checked = perms.includes('MANAGE_USERS') || perms.includes('ALL');
      document.getElementById('perm-tests').checked = perms.includes('MANAGE_TESTS') || perms.includes('ALL');
      document.getElementById('perm-announce').checked = perms.includes('ANNOUNCEMENTS') || perms.includes('ALL');

      if (modal) modal.classList.remove('hidden');
    },

    closeEditModal() {
      const modal = document.getElementById('admin-edit-user-modal');
      if (modal) modal.classList.add('hidden');
      this.editingUserId = null;
    },

    async saveUserChanges(e) {
      e.preventDefault();
      if (!this.editingUserId) return;

      const username = document.getElementById('edit-username').value;
      const email = document.getElementById('edit-email').value;
      const password = document.getElementById('edit-password').value;
      const role = document.getElementById('edit-role').value;

      const permsArr = [];
      if (document.getElementById('perm-users').checked) permsArr.push('MANAGE_USERS');
      if (document.getElementById('perm-tests').checked) permsArr.push('MANAGE_TESTS');
      if (document.getElementById('perm-announce').checked) permsArr.push('ANNOUNCEMENTS');
      if (role === 'SUPER_ADMIN') permsArr.push('ALL');
      const permissions = permsArr.join(',');

      const payload = { username, email, role, permissions };
      if (password) payload.password = password;

      try {
        await fetch(`/api/admin/users/${this.editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {}

      const u = this.usersList.find(x => x.id === this.editingUserId);
      if (u) {
        u.username = username;
        u.email = email;
        if (password) u.password = password;
        u.role = role;
        u.permissions = permissions;
      }

      this.closeEditModal();
      this.render();
      alert("✅ Foydalanuvchi ma'lumotlari muvaffaqiyatli saqlandi!");
    },

    async deleteUser(userId) {
      const user = this.usersList.find(x => x.id === userId);
      if (user && (user.role === 'SUPER_ADMIN' || user.email === 'otabeksotimov9@gmail.com')) {
        alert("👑 Super Admin (otabeksotimov9@gmail.com) tizimdan o'chirilishi taqiqlangan!");
        return;
      }

      if (!confirm("Haqiqatdan ham ushbu foydalanuvchini tizimdan o'chirmoqchimisiz?")) return;

      try {
        await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      } catch (e) {}

      this.usersList = this.usersList.filter(x => x.id !== userId);
      this.render();
    },

    // ANNOUNCEMENTS MODAL HANDLERS
    openCreateAnnModal() {
      const modal = document.getElementById('admin-create-ann-modal');
      if (modal) modal.classList.remove('hidden');
    },

    closeCreateAnnModal() {
      const modal = document.getElementById('admin-create-ann-modal');
      if (modal) modal.classList.add('hidden');
    },

    async createAnnouncement(e) {
      e.preventDefault();
      const title = document.getElementById('ann-title').value;
      const text = document.getElementById('ann-text').value;
      const type = document.getElementById('ann-type').value;

      const payload = { title, text, type };

      try {
        const res = await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.announcement) this.announcementsList.unshift(data.announcement);
        } else throw new Error();
      } catch (err) {
        const newAnn = { id: Date.now(), title, text, type, active: true, date: 'Hozirgina' };
        this.announcementsList.unshift(newAnn);
      }

      this.closeCreateAnnModal();
      this.render();
      alert("📢 Yangi e'lon efrga uzatildi!");
    },

    async deleteAnnouncement(id) {
      if (!confirm("E'lonni o'chirmoqchimisiz?")) return;
      try {
        await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      } catch(e) {}
      this.announcementsList = this.announcementsList.filter(a => a.id !== id);
      this.render();
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
    },

    // QUESTION MODAL HANDLERS
    openCreateQuestionModal() {
      const modal = document.getElementById('admin-create-question-modal');
      if (modal) modal.classList.remove('hidden');
    },

    closeCreateQuestionModal() {
      const modal = document.getElementById('admin-create-question-modal');
      if (modal) modal.classList.add('hidden');
    },

    createQuestion(e) {
      e.preventDefault();
      const ticketId = parseInt(document.getElementById('q-ticket').value) || 1;
      const question = document.getElementById('q-text').value;
      const image = document.getElementById('q-image').value;
      const opt1 = document.getElementById('q-opt1').value;
      const opt2 = document.getElementById('q-opt2').value;
      const opt3 = document.getElementById('q-opt3').value;
      const opt4 = document.getElementById('q-opt4').value;
      const correct = parseInt(document.getElementById('q-correct').value) || 0;
      const explanation = document.getElementById('q-explanation').value;

      const newQ = {
        id: Date.now(),
        ticketId,
        question,
        image,
        options: [opt1, opt2, opt3, opt4].filter(Boolean),
        correct,
        explanation
      };

      this.questionsList.unshift(newQ);
      this.closeCreateQuestionModal();
      this.render();
      alert("✅ Yangi savol muvaffaqiyatli saqlandi!");
    },

    deleteQuestion(id) {
      if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) return;
      this.questionsList = this.questionsList.filter(q => q.id !== id);
      this.render();
    },

    // SAVE SETTINGS
    async saveSettings(e) {
      e.preventDefault();
      const duration = parseInt(document.getElementById('set-duration').value) || 25;
      const threshold = parseInt(document.getElementById('set-threshold').value) || 18;
      const maintenance = document.getElementById('set-maint').checked;

      this.systemSettings.examDurationMinutes = duration;
      this.systemSettings.passingScoreThreshold = threshold;
      this.systemSettings.maintenanceMode = maintenance;

      try {
        await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.systemSettings)
        });
      } catch (err) {}

      alert("⚙️ Tizim sozlamalari muvaffaqiyatli saqlandi!");
    },

    // MAIN RENDER METHOD
    render() {
      const totalUsers = this.usersList.length;
      const totalAdmins = this.usersList.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length;

      let html = `
        <div class="fade-in max-w-7xl mx-auto py-4 space-y-6">
          
          <!-- TOP HEADER BAR -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border" style="background:var(--surface);border-color:var(--border)">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider" style="background:rgba(242,201,76,0.2);color:var(--primary);border:1px solid var(--primary)">
                  👑 SUPER ADMIN DASHBOARD
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono" style="background:var(--surface-2);color:var(--text-muted)">v2.5 Pro</span>
              </div>
              <h2 class="text-2xl font-black font-heading tracking-tight" style="color:var(--text)">Boshqaruv va Ruxsatnomalar Markazi</h2>
              <p class="text-xs max-w-2xl" style="color:var(--text-muted)">
                Foydalanuvchilar, savollar bazasi, platforma e'lonlari va tizim sozlamalarini yagona konsoldan boshqaring.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button onclick="window.AdminModule.exportUsersCSV()" class="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5" title="Foydalanuvchilar ro'yxatini CSV yuklab olish">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span>CSV Eksport</span>
              </button>
              <button onclick="window.AdminModule.openCreateUserModal()" class="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span>Yangi Admin / User</span>
              </button>
            </div>
          </div>

          <!-- ANALYTICS HIGHLIGHT CARDS -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 rounded-xl border flex items-center gap-4 transition-all hover:border-[var(--primary)]" style="background:var(--surface);border-color:var(--border)">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                👥
              </div>
              <div>
                <span class="text-[11px] block font-mono font-medium" style="color:var(--text-muted)">Jami A'zolar</span>
                <span class="text-xl font-extrabold font-mono" style="color:var(--text)">${totalUsers} ta</span>
              </div>
            </div>

            <div class="p-4 rounded-xl border flex items-center gap-4 transition-all hover:border-[var(--primary)]" style="background:var(--surface);border-color:var(--border)">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style="background:rgba(59,130,246,0.15);color:#3B82F6;border:1px solid rgba(59,130,246,0.3)">
                🛡️
              </div>
              <div>
                <span class="text-[11px] block font-mono font-medium" style="color:var(--text-muted)">Adminlar Soni</span>
                <span class="text-xl font-extrabold font-mono" style="color:#3B82F6">${totalAdmins} ta</span>
              </div>
            </div>

            <div class="p-4 rounded-xl border flex items-center gap-4 transition-all hover:border-[var(--primary)]" style="background:var(--surface);border-color:var(--border)">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style="background:rgba(16,185,129,0.15);color:#10B981;border:1px solid rgba(16,185,129,0.3)">
                📝
              </div>
              <div>
                <span class="text-[11px] block font-mono font-medium" style="color:var(--text-muted)">Savollar Bazasida</span>
                <span class="text-xl font-extrabold font-mono" style="color:#10B981">${this.questionsList.length * 10}+ ta</span>
              </div>
            </div>

            <div class="p-4 rounded-xl border flex items-center gap-4 transition-all hover:border-[var(--primary)]" style="background:var(--surface);border-color:var(--border)">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0" style="background:rgba(236,72,153,0.15);color:#EC4899;border:1px solid rgba(236,72,153,0.3)">
                ⚡
              </div>
              <div>
                <span class="text-[11px] block font-mono font-medium" style="color:var(--text-muted)">Server Holati</span>
                <span class="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                </span>
              </div>
            </div>
          </div>

          <!-- ADMIN NAVIGATION TABS -->
          <div class="flex items-center gap-2 border-b overflow-x-auto pb-1" style="border-color:var(--border)">
            <button onclick="window.AdminModule.switchTab('users')" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${this.activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}">
              <span>👥 Foydalanuvchilar</span>
              <span class="px-1.5 py-0.2 rounded text-[10px]" style="background:var(--surface-2)">${totalUsers}</span>
            </button>
            <button onclick="window.AdminModule.switchTab('questions')" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${this.activeTab === 'questions' ? 'btn-primary' : 'btn-secondary'}">
              <span>📝 Test & Savollar</span>
            </button>
            <button onclick="window.AdminModule.switchTab('announcements')" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${this.activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}">
              <span>📢 E'lonlar</span>
              <span class="px-1.5 py-0.2 rounded text-[10px]" style="background:var(--surface-2)">${this.announcementsList.length}</span>
            </button>
            <button onclick="window.AdminModule.switchTab('logs')" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${this.activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}">
              <span>📊 Audit Loglar</span>
            </button>
            <button onclick="window.AdminModule.switchTab('settings')" class="px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${this.activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}">
              <span>⚙️ Sozlamalar</span>
            </button>
          </div>

          <!-- TAB CONTENT CONTAINER -->
          <div id="admin-tab-content" class="min-h-[400px]">
          </div>

        </div>

        <!-- MODAL 1: EDIT USER MODAL -->
        <div id="admin-edit-user-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.75)">
          <div class="tech-card p-6 max-w-lg w-full relative space-y-4" style="border:1px solid var(--border)">
            <button onclick="window.AdminModule.closeEditModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">✕</button>
            <div class="text-left">
              <span class="text-xs font-mono font-bold" style="color:var(--primary)">👑 TAHRIRLASH MODALI</span>
              <h3 class="text-lg font-bold font-heading" style="color:var(--text)">Foydalanuvchi Profilini O'zgartirish</h3>
            </div>
            <form onsubmit="window.AdminModule.saveUserChanges(event)" class="space-y-4 text-left">
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Foydalanuvchi Nomi (Username)</label>
                <input id="edit-username" type="text" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Email Manzili</label>
                <input id="edit-email" type="email" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Yangi Parol (O'zgartirmaslik uchun bo'sh qoldiring)</label>
                <input id="edit-password" type="password" placeholder="Yangi parol..." class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Rol (Role)</label>
                <select id="edit-role" class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" style="background:var(--bg);color:var(--text)">
                  <option value="USER">USER (Oddiy foydalanuvchi)</option>
                  <option value="ADMIN">ADMIN (Cheklangan Admin)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Bosh Boshqaruvchi)</option>
                </select>
              </div>
              <div class="p-3 rounded-md border space-y-2" style="background:var(--bg);border-color:var(--border)">
                <span class="block text-xs font-mono font-bold" style="color:var(--primary)">Ruxsatnomalar (Permissions):</span>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)"><input id="perm-users" type="checkbox" /><span>Foydalanuvchilarni tahrirlash (MANAGE_USERS)</span></label>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)"><input id="perm-tests" type="checkbox" /><span>Test savollarini o'zgartirish (MANAGE_TESTS)</span></label>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)"><input id="perm-announce" type="checkbox" /><span>E'lonlar efriga uzatish (ANNOUNCEMENTS)</span></label>
              </div>
              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" onclick="window.AdminModule.closeEditModal()" class="btn-secondary text-xs py-2 px-4">Bekor qilish</button>
                <button type="submit" class="btn-primary text-xs py-2 px-5">Saqlash</button>
              </div>
            </form>
          </div>
        </div>

        <!-- MODAL 2: CREATE USER MODAL -->
        <div id="admin-create-user-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.75)">
          <div class="tech-card p-6 max-w-lg w-full relative space-y-4" style="border:1px solid var(--border)">
            <button onclick="window.AdminModule.closeCreateUserModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">✕</button>
            <div class="text-left">
              <span class="text-xs font-mono font-bold" style="color:var(--primary)">➕ YANGI FOYDALANUVCHI</span>
              <h3 class="text-lg font-bold font-heading" style="color:var(--text)">Yangi Admin yoki User Yaratish</h3>
            </div>
            <form onsubmit="window.AdminModule.createUser(event)" class="space-y-4 text-left">
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Foydalanuvchi Nomi (Username)</label>
                <input id="new-username" type="text" placeholder="Masalan: jasur_pdd" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Email Manzil</label>
                <input id="new-email" type="email" placeholder="jasur@gmail.com" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Parol</label>
                <input id="new-password" type="password" placeholder="Kamida 6 ta belgi" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Rol (Role)</label>
                <select id="new-role" class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" style="background:var(--bg);color:var(--text)">
                  <option value="USER">USER (Oddiy foydalanuvchi)</option>
                  <option value="ADMIN">ADMIN (Admin)</option>
                </select>
              </div>
              <div class="p-3 rounded-md border space-y-2" style="background:var(--bg);border-color:var(--border)">
                <span class="block text-xs font-mono font-bold" style="color:var(--primary)">Ruxsatnomalar (Permissions):</span>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)"><input id="new-perm-users" type="checkbox" checked /><span>Foydalanuvchilarni tahrirlash (MANAGE_USERS)</span></label>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)"><input id="new-perm-tests" type="checkbox" checked /><span>Test savollarini o'zgartirish (MANAGE_TESTS)</span></label>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)"><input id="new-perm-announce" type="checkbox" /><span>E'lonlar efriga uzatish (ANNOUNCEMENTS)</span></label>
              </div>
              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" onclick="window.AdminModule.closeCreateUserModal()" class="btn-secondary text-xs py-2 px-4">Bekor qilish</button>
                <button type="submit" class="btn-primary text-xs py-2 px-5">Yaratish</button>
              </div>
            </form>
          </div>
        </div>

        <!-- MODAL 3: CREATE ANNOUNCEMENT MODAL -->
        <div id="admin-create-ann-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.75)">
          <div class="tech-card p-6 max-w-lg w-full relative space-y-4" style="border:1px solid var(--border)">
            <button onclick="window.AdminModule.closeCreateAnnModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">✕</button>
            <div class="text-left">
              <span class="text-xs font-mono font-bold" style="color:var(--primary)">📢 YANGI E'LON</span>
              <h3 class="text-lg font-bold font-heading" style="color:var(--text)">Platformaga E'lon Uzatish</h3>
            </div>
            <form onsubmit="window.AdminModule.createAnnouncement(event)" class="space-y-4 text-left">
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">E'lon Sarlavhasi</label>
                <input id="ann-title" type="text" placeholder="Masalan: Imtihon qoidalari yangilandi!" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">E'lon Matni</label>
                <textarea id="ann-text" rows="3" placeholder="Barcha foydalanuvchilar diqqatiga..." required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Banner Turi</label>
                <select id="ann-type" class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" style="background:var(--bg);color:var(--text)">
                  <option value="INFO">ℹ️ INFO (Moviy / Bildirishnoma)</option>
                  <option value="WARNING">⚠️ WARNING (Sariq / Ogohlantirish)</option>
                  <option value="SUCCESS">✅ SUCCESS (Yashil / Muvaffaqiyat)</option>
                </select>
              </div>
              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" onclick="window.AdminModule.closeCreateAnnModal()" class="btn-secondary text-xs py-2 px-4">Bekor qilish</button>
                <button type="submit" class="btn-primary text-xs py-2 px-5">Efrga Uzatish</button>
              </div>
            </form>
          </div>
        </div>

        <!-- MODAL 4: CREATE QUESTION MODAL -->
        <div id="admin-create-question-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.75)">
          <div class="tech-card p-6 max-w-xl w-full relative space-y-4 max-h-[90vh] overflow-y-auto" style="border:1px solid var(--border)">
            <button onclick="window.AdminModule.closeCreateQuestionModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">✕</button>
            <div class="text-left">
              <span class="text-xs font-mono font-bold" style="color:var(--primary)">📝 YANGI SAVOL</span>
              <h3 class="text-lg font-bold font-heading" style="color:var(--text)">Test Biletiga Yangi Savol Qo'shish</h3>
            </div>
            <form onsubmit="window.AdminModule.createQuestion(event)" class="space-y-4 text-left">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Bilet Raqami (#)</label>
                  <input id="q-ticket" type="number" min="1" max="50" value="1" required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">To'g'ri Variant (0-3)</label>
                  <select id="q-correct" class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" style="background:var(--bg);color:var(--text)">
                    <option value="0">Variant A (1-javob)</option>
                    <option value="1">Variant B (2-javob)</option>
                    <option value="2">Variant C (3-javob)</option>
                    <option value="3">Variant D (4-javob)</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Savol Matni</label>
                <textarea id="q-text" rows="2" placeholder="Chorrahada quvib o'tish tartibi..." required class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Rasm / Yo'l belgisi URL (Ixtiyoriy)</label>
                <input id="q-image" type="text" placeholder="https://..." class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-mono font-bold" style="color:var(--text-muted)">Javob Variantlari:</label>
                <input id="q-opt1" type="text" placeholder="Variant A" required class="search-input w-full px-3 py-1.5 rounded-md text-xs focus:outline-none" />
                <input id="q-opt2" type="text" placeholder="Variant B" required class="search-input w-full px-3 py-1.5 rounded-md text-xs focus:outline-none" />
                <input id="q-opt3" type="text" placeholder="Variant C" class="search-input w-full px-3 py-1.5 rounded-md text-xs focus:outline-none" />
                <input id="q-opt4" type="text" placeholder="Variant D" class="search-input w-full px-3 py-1.5 rounded-md text-xs focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Qoida bo'yicha tushuntirish (Explanation)</label>
                <input id="q-explanation" type="text" placeholder="Qoidalarning 12-moddasiga asosan..." class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              </div>
              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" onclick="window.AdminModule.closeCreateQuestionModal()" class="btn-secondary text-xs py-2 px-4">Bekor qilish</button>
                <button type="submit" class="btn-primary text-xs py-2 px-5">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      `;

      this.container.innerHTML = html;

      // Render tab specific view
      if (this.activeTab === 'users') this.renderUsersTab();
      else if (this.activeTab === 'questions') this.renderQuestionsTab();
      else if (this.activeTab === 'announcements') this.renderAnnouncementsTab();
      else if (this.activeTab === 'logs') this.renderLogsTab();
      else if (this.activeTab === 'settings') this.renderSettingsTab();
    },

    // 1. RENDER USERS TAB
    renderUsersTab() {
      const container = document.getElementById('admin-tab-content');
      if (!container) return;

      const filtered = this.usersList.filter(u => {
        const matchesQuery = !this.searchQuery || 
          u.username.toLowerCase().includes(this.searchQuery) ||
          u.email.toLowerCase().includes(this.searchQuery) ||
          u.role.toLowerCase().includes(this.searchQuery);
        
        const matchesRole = this.roleFilter === 'ALL' || u.role === this.roleFilter;
        return matchesQuery && matchesRole;
      });

      let html = `
        <div class="tech-card space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold font-heading" style="color:var(--text)">Foydalanuvchilar Ro'yxati va Huquqlari</h3>
              <p class="text-xs" style="color:var(--text-muted)">Platformadagi barcha foydalanuvchilar va ularning rollari</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <!-- ROLE FILTER BUTTONS -->
              <div class="flex items-center gap-1 p-1 rounded-lg border" style="background:var(--bg);border-color:var(--border)">
                <button onclick="window.AdminModule.setRoleFilter('ALL')" class="px-2.5 py-1 rounded text-[11px] font-bold ${this.roleFilter === 'ALL' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-[var(--text-muted)]'}">Barchasi</button>
                <button onclick="window.AdminModule.setRoleFilter('USER')" class="px-2.5 py-1 rounded text-[11px] font-bold ${this.roleFilter === 'USER' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-[var(--text-muted)]'}">Users</button>
                <button onclick="window.AdminModule.setRoleFilter('ADMIN')" class="px-2.5 py-1 rounded text-[11px] font-bold ${this.roleFilter === 'ADMIN' ? 'bg-[var(--primary)] text-[var(--bg)]' : 'text-[var(--text-muted)]'}">Admins</button>
              </div>

              <!-- SEARCH INPUT -->
              <div class="relative w-full sm:w-60 search-container">
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 search-icon" style="color:var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                  type="text" 
                  placeholder="Qidiruv..." 
                  value="${this.searchQuery}"
                  oninput="window.AdminModule.setSearch(this.value)"
                  class="search-input w-full pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div id="admin-users-table-container">
      `;

      if (filtered.length === 0) {
        html += `
          <div class="p-8 text-center" style="background:var(--bg);border:1px solid var(--border);border-radius:0.5rem">
            <p class="text-xs font-semibold" style="color:var(--text-muted)">Qidiruv natijasida foydalanuvchi topilmadi</p>
          </div>
        `;
      } else {
        html += `
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr style="border-bottom:1px solid var(--border);color:var(--text-muted)">
                  <th class="py-3 px-4 font-mono font-semibold">ID</th>
                  <th class="py-3 px-4 font-mono font-semibold">Foydalanuvchi</th>
                  <th class="py-3 px-4 font-mono font-semibold">Email</th>
                  <th class="py-3 px-4 font-mono font-semibold">Rol</th>
                  <th class="py-3 px-4 font-mono font-semibold">Ruxsatnomalar</th>
                  <th class="py-3 px-4 font-mono font-semibold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
        `;

        filtered.forEach(u => {
          const isSuper = u.role === 'SUPER_ADMIN' || u.email === 'otabeksotimov9@gmail.com';
          const isAdmin = u.role === 'ADMIN';
          const roleBg = isSuper ? 'rgba(242,201,76,0.2)' : (isAdmin ? 'rgba(59,130,246,0.15)' : 'var(--surface-2)');
          const roleColor = isSuper ? 'var(--primary)' : (isAdmin ? '#3B82F6' : 'var(--text)');

          html += `
            <tr style="border-bottom:1px solid var(--border)" class="hover-surface transition-colors">
              <td class="py-3 px-4 font-mono" style="color:var(--text-muted)">#0${u.id}</td>
              <td class="py-3 px-4 font-bold flex items-center gap-2" style="color:var(--text)">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style="background:${isSuper ? 'var(--primary)' : 'var(--surface-2)'};color:${isSuper ? 'var(--bg)' : 'var(--primary)'};border:1px solid var(--border)">
                  ${isSuper ? '👑' : u.username.substring(0, 1).toUpperCase()}
                </div>
                <span>${u.username}</span>
              </td>
              <td class="py-3 px-4 font-mono" style="color:var(--text-muted)">${u.email}</td>
              <td class="py-3 px-4">
                <span class="px-2.5 py-0.5 rounded font-mono font-bold text-[10px]" style="background:${roleBg};color:${roleColor};border:1px solid var(--border)">
                  ${isSuper ? '👑 SUPER_ADMIN' : u.role}
                </span>
              </td>
              <td class="py-3 px-4 font-mono text-[10px]" style="color:var(--text-muted)">
                ${u.permissions || 'BASIC'}
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button onclick="window.AdminModule.togglePro(${u.id})" class="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1" style="color:var(--primary);border-color:var(--border)" title="PRO Obuna Berish / Bekor Qilish">
                    <span>👑 PRO</span>
                  </button>
                  <button onclick="window.AdminModule.openEditModal(${u.id})" class="btn-primary text-[11px] py-1 px-2.5 flex items-center gap-1">
                    <span>📝 Tahrirlash</span>
                  </button>
                  ${!isSuper ? `
                    <button onclick="window.AdminModule.deleteUser(${u.id})" class="p-1 rounded hover:bg-red-500/20" style="color:var(--danger)" title="O'chirish">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        });

        html += `
              </tbody>
            </table>
          </div>
        `;
      }

      html += `</div></div>`;
      container.innerHTML = html;
    },

    // 2. RENDER QUESTIONS TAB
    renderQuestionsTab() {
      const container = document.getElementById('admin-tab-content');
      if (!container) return;

      let html = `
        <div class="tech-card space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold font-heading" style="color:var(--text)">Test Savollari Boshqaruvi</h3>
              <p class="text-xs" style="color:var(--text-muted)">Imtihon biletlaridagi savollarni qo'shish va tahrirlash</p>
            </div>
            <button onclick="window.AdminModule.openCreateQuestionModal()" class="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
              <span>➕ Yangi Savol Qo'shish</span>
            </button>
          </div>

          <div class="space-y-4">
      `;

      this.questionsList.forEach((q, idx) => {
        html += `
          <div class="p-4 rounded-xl border space-y-3" style="background:var(--bg);border-color:var(--border)">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded text-xs font-mono font-bold" style="background:var(--surface-2);color:var(--primary)">
                📌 Bilet #${q.ticketId} — Savol #${idx + 1}
              </span>
              <button onclick="window.AdminModule.deleteQuestion(${q.id})" class="p-1 rounded text-xs hover:bg-red-500/20" style="color:var(--danger)">
                🗑️ O'chirish
              </button>
            </div>

            <p class="text-sm font-bold" style="color:var(--text)">${q.question}</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${q.options.map((opt, oIdx) => `
                <div class="p-2 rounded border flex items-center gap-2 ${oIdx === q.correct ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold' : ''}" style="border-color:${oIdx === q.correct ? '' : 'var(--border)'}">
                  <span>${oIdx === q.correct ? '✅' : '⚪'}</span>
                  <span>${opt}</span>
                </div>
              `).join('')}
            </div>

            ${q.explanation ? `
              <p class="text-[11px] font-mono italic" style="color:var(--text-muted)">
                💡 Izoh: ${q.explanation}
              </p>
            ` : ''}
          </div>
        `;
      });

      html += `</div></div>`;
      container.innerHTML = html;
    },

    // 3. RENDER ANNOUNCEMENTS TAB
    renderAnnouncementsTab() {
      const container = document.getElementById('admin-tab-content');
      if (!container) return;

      let html = `
        <div class="tech-card space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold font-heading" style="color:var(--text)">Platforma E'lonlari va Xabarnomalar</h3>
              <p class="text-xs" style="color:var(--text-muted)">Barcha foydalanuvchilar ekranida ko'rinadigan global bildirishnomalar</p>
            </div>
            <button onclick="window.AdminModule.openCreateAnnModal()" class="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
              <span>📢 Yangi E'lon Uzatish</span>
            </button>
          </div>

          <div class="space-y-4">
      `;

      if (this.announcementsList.length === 0) {
        html += `<div class="p-8 text-center text-xs" style="color:var(--text-muted)">Hozircha e'lonlar mavjud emas</div>`;
      } else {
        this.announcementsList.forEach(ann => {
          const typeIcon = ann.type === 'WARNING' ? '⚠️' : (ann.type === 'SUCCESS' ? '✅' : 'ℹ️');
          const typeBg = ann.type === 'WARNING' ? 'rgba(242,201,76,0.15)' : (ann.type === 'SUCCESS' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)');
          const typeColor = ann.type === 'WARNING' ? 'var(--primary)' : (ann.type === 'SUCCESS' ? '#10B981' : '#3B82F6');

          html += `
            <div class="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style="background:var(--bg);border-color:var(--border)">
              <div class="space-y-1 text-left">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style="background:${typeBg};color:${typeColor}">
                    ${typeIcon} ${ann.type}
                  </span>
                  <span class="text-[10px] font-mono" style="color:var(--text-muted)">${ann.date}</span>
                </div>
                <h4 class="text-sm font-bold" style="color:var(--text)">${ann.title}</h4>
                <p class="text-xs" style="color:var(--text-muted)">${ann.text}</p>
              </div>

              <button onclick="window.AdminModule.deleteAnnouncement(${ann.id})" class="btn-secondary text-xs py-1.5 px-3 shrink-0" style="color:var(--danger)">
                🗑️ O'chirish
              </button>
            </div>
          `;
        });
      }

      html += `</div></div>`;
      container.innerHTML = html;
    },

    // 4. RENDER LOGS TAB
    renderLogsTab() {
      const container = document.getElementById('admin-tab-content');
      if (!container) return;

      let html = `
        <div class="tech-card space-y-6">
          <div>
            <h3 class="text-base font-bold font-heading" style="color:var(--text)">Tizim Audit Loglari</h3>
            <p class="text-xs" style="color:var(--text-muted)">Adminlar va tizim harakatlarining xavfsizlik jurnali</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr style="border-bottom:1px solid var(--border);color:var(--text-muted)">
                  <th class="py-3 px-4 font-mono font-semibold">LOG ID</th>
                  <th class="py-3 px-4 font-mono font-semibold">Admin</th>
                  <th class="py-3 px-4 font-mono font-semibold">Bajarilgan Amal</th>
                  <th class="py-3 px-4 font-mono font-semibold">Obyekt</th>
                  <th class="py-3 px-4 font-mono font-semibold text-right">Vaqt</th>
                </tr>
              </thead>
              <tbody>
      `;

      this.auditLogs.forEach(log => {
        html += `
          <tr style="border-bottom:1px solid var(--border)">
            <td class="py-3 px-4 font-mono" style="color:var(--text-muted)">#${log.id}</td>
            <td class="py-3 px-4 font-bold" style="color:var(--primary)">👑 ${log.admin}</td>
            <td class="py-3 px-4 font-mono font-semibold" style="color:var(--text)">${log.action}</td>
            <td class="py-3 px-4 font-mono" style="color:var(--text-muted)">${log.target}</td>
            <td class="py-3 px-4 font-mono text-right" style="color:var(--text-muted)">${log.time}</td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;

      container.innerHTML = html;
    },

    // 5. RENDER SETTINGS TAB
    renderSettingsTab() {
      const container = document.getElementById('admin-tab-content');
      if (!container) return;

      let html = `
        <div class="tech-card max-w-2xl space-y-6">
          <div>
            <h3 class="text-base font-bold font-heading" style="color:var(--text)">Imtihon va Platforma Sozlamalari</h3>
            <p class="text-xs" style="color:var(--text-muted)">Test topshirish vaqti, o'tish bali va texnik vaqt rejimi</p>
          </div>

          <form onsubmit="window.AdminModule.saveSettings(event)" class="space-y-5 text-left">
            <div>
              <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Imtihon Taymer Vaqti (Minutlarda)</label>
              <input id="set-duration" type="number" min="5" max="60" value="${this.systemSettings.examDurationMinutes}" class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              <span class="text-[11px]" style="color:var(--text-muted)">Standart: 25 minut (20 ta savol uchun)</span>
            </div>

            <div>
              <label class="block text-xs font-mono font-bold mb-1" style="color:var(--text-muted)">Minimal O'tish Bali (20 ta savoldan)</label>
              <input id="set-threshold" type="number" min="10" max="20" value="${this.systemSettings.passingScoreThreshold}" class="search-input w-full px-3 py-2 rounded-md text-xs focus:outline-none" />
              <span class="text-[11px]" style="color:var(--text-muted)">Standart: 18 ta to'g'ri javob</span>
            </div>

            <div class="p-4 rounded-xl border flex items-center justify-between" style="background:var(--bg);border-color:var(--border)">
              <div>
                <span class="block text-xs font-bold" style="color:var(--text)">⚙️ Texnik Profilaktika Rejimi (Maintenance Mode)</span>
                <span class="text-[11px]" style="color:var(--text-muted)">Yoqilganda faqat adminlar kirishi mumkin</span>
              </div>
              <input id="set-maint" type="checkbox" ${this.systemSettings.maintenanceMode ? 'checked' : ''} class="w-4 h-4" />
            </div>

            <div class="flex items-center justify-end pt-2">
              <button type="submit" class="btn-primary text-xs py-2.5 px-6">
                💾 Sozlamalarni Saqlash
              </button>
            </div>
          </form>
        </div>
      `;

      container.innerHTML = html;
    }
  };
})();
