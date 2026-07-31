(function() {
  window.AdminModule = {
    usersList: [],
    searchQuery: '',
    editingUserId: null,

    init(containerEl) {
      this.container = containerEl;
      this.fetchAdminData();
    },

    async fetchAdminData() {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          this.usersList = await res.json();
        } else {
          throw new Error("API server offline");
        }
      } catch (e) {
        this.usersList = [
          { id: 1, username: 'otabek', email: 'otabeksotimov9@gmail.com', password: '••••••••', role: 'SUPER_ADMIN', permissions: 'ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS' },
          { id: 2, username: 'bekmurod', email: 'bekmurod@gmail.com', password: '••••••••', role: 'ADMIN', permissions: 'MANAGE_USERS,MANAGE_TESTS' },
          { id: 3, username: 'haydovchi_2026', email: 'driver@mail.ru', password: '••••••••', role: 'USER', permissions: 'BASIC' },
          { id: 4, username: 'student_pdd', email: 'student@edu.uz', password: '••••••••', role: 'USER', permissions: 'BASIC' }
        ];
      }
      this.render();
    },

    setSearch(query) {
      this.searchQuery = query.toLowerCase().trim();
      this.renderUsersGrid();
    },

    // OPEN EDIT MODAL
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

      // Update local array
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

    render() {
      const totalUsers = this.usersList.length;
      const totalAdmins = this.usersList.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length;

      let html = `
        <div class="fade-in max-w-6xl mx-auto py-4 space-y-8">
          <!-- HEADER -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="text-left">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border);margin-bottom:0.75rem;">
                👑 SUPER ADMIN & PLATFORMA PANELI
              </span>
              <h2 class="section-title mb-1" style="color:var(--text)">Boshqaruv va Ruxsatnomalar Markazi</h2>
              <p class="muted-text max-w-xl">
                Barcha admin va foydalanuvchilarning Email, Parol va Amallar ruxsatnomalarini (Permissions) boshqarish paneli.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold" style="background:rgba(242,201,76,0.15);color:var(--primary);border:1px solid var(--primary)">
                👑 SUPER ADMIN: otabeksotimov9@gmail.com
              </span>
            </div>
          </div>

          <!-- ANALYTICS CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md font-bold text-sm mb-3 flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <span class="text-xs block mb-1" style="color:var(--text-muted)">Jami Foydalanuvchilar</span>
              <span class="text-2xl font-mono font-extrabold" style="color:var(--text)">${totalUsers} ta</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md font-bold text-sm mb-3 flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <span class="text-xs block mb-1" style="color:var(--text-muted)">Adminlar Soni</span>
              <span class="text-2xl font-mono font-extrabold" style="color:var(--primary)">${totalAdmins} ta</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md font-bold text-sm mb-3 flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <span class="text-xs block mb-1" style="color:var(--text-muted)">Imtihon Seanslari</span>
              <span class="text-2xl font-mono font-extrabold" style="color:var(--text)">1,250+</span>
            </div>

            <div class="tech-card p-6">
              <div class="w-10 h-10 rounded-md font-bold text-sm mb-3 flex items-center justify-center" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <span class="text-xs block mb-1" style="color:var(--text-muted)">Super Admin</span>
              <span class="text-xs font-mono font-bold block truncate" style="color:var(--primary)">otabek</span>
            </div>
          </div>

          <!-- USER MANAGEMENT SECTION -->
          <div class="tech-card space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold font-heading" style="color:var(--text)">Foydalanuvchilar va Adminlarni Tahrirlash</h3>
                <p class="text-xs" style="color:var(--text-muted)">Email, Parol, Rol va Xususiy Ruxsatnomalar (Permissions) sozlamalari</p>
              </div>

              <!-- USER SEARCH -->
              <div class="relative w-full sm:w-64 search-container">
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 search-icon" style="color:var(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                  type="text" 
                  placeholder="Ism, Email yoki Rol qidiruvi..." 
                  oninput="window.AdminModule.setSearch(this.value)"
                  class="search-input w-full pl-9 pr-3 py-1.5 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>

            <!-- USERS TABLE CONTAINER -->
            <div id="admin-users-table-container">
            </div>
          </div>
        </div>

        <!-- EDIT USER MODAL -->
        <div id="admin-edit-user-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md hidden fade-in" style="background:rgba(0,0,0,0.7)">
          <div class="tech-card p-6 max-w-lg w-full relative space-y-4" style="border:1px solid var(--border)">
            <button onclick="window.AdminModule.closeEditModal()" class="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">
              ✕
            </button>

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
                <div class="relative">
                  <input id="edit-password" type="password" placeholder="Yangi parol kiriting..." class="search-input w-full px-3 py-2 pr-9 rounded-md text-xs focus:outline-none" />
                  <button type="button" onclick="window.togglePasswordVisibility('edit-password', this)" class="absolute right-2.5 top-1/2 -translate-y-1/2 focus:outline-none p-1" style="color:var(--text-muted)" title="Parolni ko'rsatish">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
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
                <span class="block text-xs font-mono font-bold" style="color:var(--primary)">Admin Ruxsatnomalari (Permissions):</span>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)">
                  <input id="perm-users" type="checkbox" />
                  <span>Foydalanuvchilarni tahrirlash va o'chirish (MANAGE_USERS)</span>
                </label>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)">
                  <input id="perm-tests" type="checkbox" />
                  <span>Test savollarini o'zgartirish (MANAGE_TESTS)</span>
                </label>
                <label class="flex items-center gap-2 text-xs" style="color:var(--text)">
                  <input id="perm-announce" type="checkbox" />
                  <span>E'lonlar efriga uzatish (ANNOUNCEMENTS)</span>
                </label>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" onclick="window.AdminModule.closeEditModal()" class="btn-secondary text-xs py-2 px-4">Bekor qilish</button>
                <button type="submit" class="btn-primary text-xs py-2 px-5">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      `;

      this.container.innerHTML = html;
      this.renderUsersGrid();
    },

    renderUsersGrid() {
      const container = document.getElementById('admin-users-table-container');
      if (!container) return;

      const filtered = this.usersList.filter(u => {
        if (!this.searchQuery) return true;
        return u.username.toLowerCase().includes(this.searchQuery) ||
               u.email.toLowerCase().includes(this.searchQuery) ||
               u.role.toLowerCase().includes(this.searchQuery);
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center" style="background:var(--bg);border:1px solid var(--border);border-radius:0.5rem">
            <p class="text-xs font-semibold" style="color:var(--text-muted)">Siz qidirgan foydalanuvchi topilmadi</p>
          </div>
        `;
        return;
      }

      let html = `
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr style="border-bottom:1px solid var(--border);color:var(--text-muted)">
                <th class="py-3 px-4 font-mono font-semibold">ID</th>
                <th class="py-3 px-4 font-mono font-semibold">Foydalanuvchi Nomi</th>
                <th class="py-3 px-4 font-mono font-semibold">Email Manzil</th>
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
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style="background:${isSuper ? 'var(--primary)' : 'var(--surface-2)'};color:${isSuper ? 'var(--bg)' : 'var(--primary)'};border:1px solid var(--border)">
                ${isSuper ? '👑' : u.username.substring(0, 1).toUpperCase()}
              </div>
              <span>${u.username}</span>
            </td>
            <td class="py-3 px-4 font-mono" style="color:var(--text-muted)">${u.email}</td>
            <td class="py-3 px-4">
              <span class="px-2.5 py-0.5 rounded font-mono font-bold text-[11px]" style="background:${roleBg};color:${roleColor};border:1px solid var(--border)">
                ${isSuper ? '👑 SUPER_ADMIN' : u.role}
              </span>
            </td>
            <td class="py-3 px-4 font-mono text-[10px]" style="color:var(--text-muted)">
              ${u.permissions || 'BASIC'}
            </td>
            <td class="py-3 px-4 text-right">
              <div class="flex items-center justify-end gap-2">
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

      container.innerHTML = html;
    }
  };
})();
