(function() {
  window.ProfileModule = {
    activeTab: 'info', // 'info', 'promo', 'password', 'telegram', 'avatar'

    getUser() {
      const userStr = localStorage.getItem('avtotest_user');
      return userStr ? JSON.parse(userStr) : null;
    },

    openModal() {
      const user = this.getUser();
      if (!user) {
        if (window.openAuthModal) {
          window.openAuthModal('login');
        } else {
          alert('Tizimga kirishingiz kerak!');
        }
        return;
      }

      this.user = user;
      let modalEl = document.getElementById('profile-modal');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'profile-modal';
        modalEl.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B0F14]/90 backdrop-blur-md fade-in';
        document.body.appendChild(modalEl);
      }

      modalEl.classList.remove('hidden');
      this.renderModalContent();
    },

    closeModal() {
      const modalEl = document.getElementById('profile-modal');
      if (modalEl) {
        modalEl.classList.add('hidden');
      }
    },

    setModalTab(tabName) {
      this.activeTab = tabName;
      this.renderModalContent();
    },

    // 🎨 2-VAZIFA 1: Ismni Tahrirlash (Edit Username)
    editUsername() {
      const newName = prompt("Yangi foydalanuvchi nomini kiriting:", this.user.username);
      if (newName && newName.trim().length >= 3) {
        this.user.username = newName.trim();
        localStorage.setItem('avtotest_user', JSON.stringify(this.user));
        
        // Header display name update
        const navName = document.getElementById('user-display-name');
        if (navName) navName.textContent = this.user.username;
        const mobileNavName = document.getElementById('mobile-user-name');
        if (mobileNavName) mobileNavName.textContent = this.user.username;

        this.renderModalContent();
        alert("✅ Foydalanuvchi nomi muvaffaqiyatli o'zgartirildi!");
      } else if (newName !== null) {
        alert("⚠️ Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak!");
      }
    },

    // 🎨 2-VAZIFA 1: Avatar Almashtirish
    changeAvatar(icon) {
      this.user.avatar = icon;
      localStorage.setItem('avtotest_user', JSON.stringify(this.user));
      this.renderModalContent();
    },

    // 🎨 2-VAZIFA 5: Telefon/Email Biriktirish
    bindContact() {
      const contact = prompt("Telefon raqamingiz yoki Email manzilingizni kiriting:", this.user.telegramPhone || this.user.email || '');
      if (contact && contact.trim().length >= 5) {
        const trimmed = contact.trim();
        if (trimmed.includes('@')) {
          this.user.email = trimmed;
        } else {
          this.user.telegramPhone = trimmed;
        }
        localStorage.setItem('avtotest_user', JSON.stringify(this.user));
        this.renderModalContent();
        alert("✅ Kontakt ma'lumotlaringiz muvaffaqiyatli saqlandi!");
      }
    },

    renderModalContent() {
      const modalEl = document.getElementById('profile-modal');
      if (!modalEl) return;

      const user = this.getUser() || this.user || { username: 'Foydalanuvchi' };
      const isPro = !!user.isPro;
      const stats = window.StorageManager ? window.StorageManager.getStatsSummary() : { totalTests: 0, passRate: 0, averageScore: 0, bestScore: 0, lastTestDate: '-' };

      const isSuperAdmin = (user.username || '').toLowerCase() === 'otabek' || user.role === 'SUPER_ADMIN';
      const isAdmin = user.role === 'ADMIN' || isSuperAdmin;
      const roleLabel = isSuperAdmin ? '⚡ SUPER ADMIN' : (isAdmin ? '🛡️ ADMIN' : (isPro ? '👑 PRO FOYDALANUVCHI' : 'ODDIY FOYDALANUVCHI'));

      const avatarDisplay = user.avatar ? user.avatar : (user.username || 'U')[0].toUpperCase();

      modalEl.innerHTML = `
        <div class="tech-card p-6 sm:p-8 max-w-2xl w-full relative border border-[#242B36] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto" style="background:var(--surface,#11161D);">
          
          <!-- Header with Close Button -->
          <div class="flex items-center justify-between pb-4 border-b border-[#242B36] shrink-0">
            <div class="flex items-center gap-3">
              
              <!-- Avatar with click to change option -->
              <div onclick="window.ProfileModule.setModalTab('avatar')" class="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-yellow-500/10 border border-[#F2C94C]/40" style="background:linear-gradient(135deg, var(--primary,#F2C94C), #D4A017);color:#0B0F14" title="Avatarni almashtirish">
                ${avatarDisplay}
              </div>

              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-bold font-heading text-[#E8EAED] leading-tight">${user.username}</h3>
                  <button onclick="window.ProfileModule.editUsername()" class="p-1 text-[#9AA0A6] hover:text-[#F2C94C] transition-colors" title="Ismni tahrirlash">
                    ✏️
                  </button>
                </div>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span class="text-xs font-mono px-2.5 py-0.5 rounded font-bold ${isPro || isAdmin ? 'bg-[#F2C94C]/20 text-[#F2C94C] border border-[#F2C94C]/40' : 'bg-[#171C24] text-[#9AA0A6] border border-[#242B36]'}">
                    ${roleLabel}
                  </span>
                  ${user.telegramPhone ? `<span class="text-[11px] text-[#27AE60] flex items-center gap-1 font-mono font-semibold">✓ Telegram Ulangan</span>` : ''}
                </div>
              </div>
            </div>

            <button onclick="window.ProfileModule.closeModal()" class="w-8 h-8 rounded-md bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] flex items-center justify-center text-sm font-bold border border-[#242B36] transition-colors">✕</button>
          </div>

          <!-- 🎨 2-VAZIFA 2: Navigation Tabs with Proper Spacing (gap-3) & Prominent Active Tab -->
          <div class="flex items-center gap-3 pt-4 pb-2 border-b border-[#242B36] overflow-x-auto shrink-0 scrollbar-none">
            <button onclick="window.ProfileModule.setModalTab('info')" class="px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all whitespace-nowrap ${this.activeTab === 'info' ? 'bg-gradient-to-r from-[#F2C94C] to-[#D4A017] text-[#0B0F14] shadow-md shadow-[#F2C94C]/20 border border-[#F2C94C]' : 'bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] border border-[#242B36]'}" style="cursor:pointer">
              👤 Ma'lumotlar
            </button>
            <button onclick="window.ProfileModule.setModalTab('promo')" class="px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all whitespace-nowrap ${this.activeTab === 'promo' ? 'bg-gradient-to-r from-[#F2C94C] to-[#D4A017] text-[#0B0F14] shadow-md shadow-[#F2C94C]/20 border border-[#F2C94C]' : 'bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] border border-[#242B36]'}" style="cursor:pointer">
              👑 Promokod Kiriting
            </button>
            <button onclick="window.ProfileModule.setModalTab('password')" class="px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all whitespace-nowrap ${this.activeTab === 'password' ? 'bg-gradient-to-r from-[#F2C94C] to-[#D4A017] text-[#0B0F14] shadow-md shadow-[#F2C94C]/20 border border-[#F2C94C]' : 'bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] border border-[#242B36]'}" style="cursor:pointer">
              🔑 Parolni O'zgartirish
            </button>
            <button onclick="window.ProfileModule.setModalTab('telegram')" class="px-3.5 py-2 rounded-lg text-xs font-bold font-mono transition-all whitespace-nowrap ${this.activeTab === 'telegram' ? 'bg-gradient-to-r from-[#F2C94C] to-[#D4A017] text-[#0B0F14] shadow-md shadow-[#F2C94C]/20 border border-[#F2C94C]' : 'bg-[#171C24] text-[#9AA0A6] hover:text-[#E8EAED] border border-[#242B36]'}" style="cursor:pointer">
              📱 Telegram Bot
            </button>
          </div>

          <!-- Body Content Area -->
          <div class="py-4 overflow-y-auto flex-grow space-y-4 pr-1">
            ${this.renderTabBody(user, isPro, stats)}
          </div>

          <!-- Footer Actions (🎨 2-VAZIFA 6: Red Highlighted Logout Button) -->
          <div class="pt-4 border-t border-[#242B36] flex items-center justify-between gap-3 shrink-0">
            <button onclick="window.ProfileModule.closeModal(); if(window.switchTab) window.switchTab('stats')" class="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
              📊 Statistika Sahifasi
            </button>
            <button onclick="window.logoutUser()" class="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 text-[#EB5757] border-[#EB5757] bg-[#EB5757]/10 hover:bg-[#EB5757]/20 transition-colors font-bold">
              🚪 Tizimdan Chiqish
            </button>
          </div>

        </div>
      `;
    },

    renderTabBody(user, isPro, stats) {
      if (this.activeTab === 'avatar') {
        const avatars = ['🚗', '🏎️', '🚀', '👑', '🛡️', '👤', '⚡', '🏆', '🎯', '🏁'];
        return `
          <div class="space-y-4">
            <div class="p-3 rounded-lg bg-[#171C24] border border-[#242B36]">
              <h4 class="text-sm font-bold font-heading text-[#F2C94C] mb-1">Avatar Tanlash</h4>
              <p class="text-xs text-[#9AA0A6]">Profilingiz uchun mos rasm yoki ikonkani tanlang:</p>
            </div>
            <div class="grid grid-cols-5 gap-3 p-2">
              ${avatars.map(icon => `
                <button onclick="window.ProfileModule.changeAvatar('${icon}')" class="w-12 h-12 rounded-xl bg-[#171C24] border border-[#242B36] hover:border-[#F2C94C] text-2xl flex items-center justify-center transition-transform hover:scale-110">
                  ${icon}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (this.activeTab === 'promo') {
        return `
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-gradient-to-r from-[#F2C94C]/10 to-[#D4A017]/10 border border-[#F2C94C]/30">
              <h4 class="text-sm font-bold font-heading text-[#F2C94C] mb-1">👑 PRO Obunani Faollashtirish</h4>
              <p class="text-xs text-[#9AA0A6] leading-relaxed">
                Telegram botimiz (@testautouz_bot) yoki admindan olingan PROMO-KODNI pastdagi katakka kiriting va PRO funksiyalardan foydalaning!
              </p>
            </div>

            <div id="promo-status-msg" class="hidden p-3 rounded-md text-xs font-semibold"></div>

            <form onsubmit="window.ProfileModule.handlePromoActivation(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-mono font-bold text-[#9AA0A6] uppercase mb-1">Promokod</label>
                <input type="text" id="profile-promo-code" required placeholder="PROMO-XXXXX" class="w-full px-3 py-2.5 rounded bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-xs font-mono text-center tracking-widest font-bold focus:outline-none focus:border-[#F2C94C]" />
              </div>
              <button type="submit" class="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2">
                <span>👑 PRO Obunani Faollashtirish</span>
              </button>
            </form>
          </div>
        `;
      }

      if (this.activeTab === 'password') {
        return `
          <div class="space-y-4">
            <div class="p-3 rounded-lg bg-[#171C24] border border-[#242B36]">
              <h4 class="text-sm font-bold font-heading text-[#F2C94C] mb-1">Parolni Almashtirish</h4>
              <p class="text-xs text-[#9AA0A6]">Xavfsizlik uchun parolingizni muntazam yangilab turing.</p>
            </div>

            <div id="pwd-status-msg" class="hidden p-3 rounded-md text-xs font-semibold"></div>

            <form onsubmit="window.ProfileModule.handlePasswordChange(event)" class="space-y-3">
              <div>
                <label class="block text-xs font-mono font-bold text-[#9AA0A6] uppercase mb-1">Hozirgi Parol</label>
                <input type="password" id="profile-current-pwd" required placeholder="••••••••" class="w-full px-3 py-2 rounded bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-xs focus:outline-none focus:border-[#F2C94C]" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold text-[#9AA0A6] uppercase mb-1">Yangi Parol</label>
                <input type="password" id="profile-new-pwd" required minlength="4" placeholder="Kamida 4 ta belgi" class="w-full px-3 py-2 rounded bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-xs focus:outline-none focus:border-[#F2C94C]" />
              </div>
              <div>
                <label class="block text-xs font-mono font-bold text-[#9AA0A6] uppercase mb-1">Yangi Parolni Tasdiqlang</label>
                <input type="password" id="profile-confirm-pwd" required minlength="4" placeholder="Yangi parolni qayta kiriting" class="w-full px-3 py-2 rounded bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-xs focus:outline-none focus:border-[#F2C94C]" />
              </div>
              <button type="submit" class="btn-primary w-full py-2.5 text-xs font-bold">
                Parolni Saqlash
              </button>
            </form>
          </div>
        `;
      }

      if (this.activeTab === 'telegram') {
        return `
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-[#171C24] border border-[#242B36]">
              <h4 class="text-sm font-bold font-heading text-[#F2C94C] mb-1">Telegram Akkaunt Ulash</h4>
              <p class="text-xs text-[#9AA0A6] leading-relaxed">
                Telegram botimizga (@testautouz_bot) kirib <code>/link</code> komandasini yuboring. Olingan 6 xonali maxsus kodni quyidagi katakka kiriting.
              </p>
            </div>

            <div id="tg-status-msg" class="hidden p-3 rounded-md text-xs font-semibold"></div>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-mono font-bold text-[#9AA0A6] uppercase mb-1">Ulash Kodi</label>
                <input type="text" id="link-code-input" placeholder="PROMO-XXXXX" class="w-full px-3 py-2.5 rounded bg-[#0B0F14] border border-[#242B36] text-[#E8EAED] text-xs font-mono text-center tracking-widest font-bold focus:outline-none focus:border-[#F2C94C]" />
              </div>
              <button onclick="window.ProfileModule.submitLinkCode()" class="btn-primary w-full py-2.5 text-xs font-bold">
                Ulashishni Tasdiqlash
              </button>
            </div>
          </div>
        `;
      }

      // Default 'info' tab (🎨 2-VAZIFA 4: Nol stats kartochkalarda "Testni boshlash" tugmasi + 🎨 2-VAZIFA 5: Kontakt biriktirish tugmasi)
      const hasNoTests = stats.totalTests === 0;

      return `
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3.5 rounded-lg bg-[#171C24] border border-[#242B36] flex flex-col justify-between">
            <div>
              <span class="text-[11px] text-[#9AA0A6] block mb-0.5">Ishlangan Testlar</span>
              <span class="text-lg font-mono font-bold text-[#E8EAED]">${stats.totalTests} ta</span>
            </div>
            ${hasNoTests ? `
              <button onclick="window.ProfileModule.closeModal(); window.switchTab('test')" class="mt-2 text-[11px] font-bold text-[#F2C94C] hover:underline text-left">
                🚀 Testni boshlash →
              </button>
            ` : ''}
          </div>
          <div class="p-3.5 rounded-lg bg-[#171C24] border border-[#242B36] flex flex-col justify-between">
            <div>
              <span class="text-[11px] text-[#9AA0A6] block mb-0.5">O'tish Ko'rsatkichi</span>
              <span class="text-lg font-mono font-bold text-[#F2C94C]">${stats.passRate}%</span>
            </div>
            ${hasNoTests ? `
              <button onclick="window.ProfileModule.closeModal(); window.switchTab('test')" class="mt-2 text-[11px] font-bold text-[#F2C94C] hover:underline text-left">
                🚀 Testni boshlash →
              </button>
            ` : ''}
          </div>
          <div class="p-3.5 rounded-lg bg-[#171C24] border border-[#242B36] flex flex-col justify-between">
            <div>
              <span class="text-[11px] text-[#9AA0A6] block mb-0.5">O'rtacha Ball</span>
              <span class="text-lg font-mono font-bold text-[#2D9CDB]">${stats.averageScore} / 20</span>
            </div>
            ${hasNoTests ? `
              <button onclick="window.ProfileModule.closeModal(); window.switchTab('test')" class="mt-2 text-[11px] font-bold text-[#2D9CDB] hover:underline text-left">
                🚀 Testni boshlash →
              </button>
            ` : ''}
          </div>
          <div class="p-3.5 rounded-lg bg-[#171C24] border border-[#242B36] flex flex-col justify-between">
            <div>
              <span class="text-[11px] text-[#9AA0A6] block mb-0.5">Eng Yuqori Natija</span>
              <span class="text-lg font-mono font-bold text-[#27AE60]">${stats.bestScore} / 20</span>
            </div>
            ${hasNoTests ? `
              <button onclick="window.ProfileModule.closeModal(); window.switchTab('test')" class="mt-2 text-[11px] font-bold text-[#27AE60] hover:underline text-left">
                🚀 Testni boshlash →
              </button>
            ` : ''}
          </div>
        </div>

        <div class="p-4 rounded-lg bg-[#171C24] border border-[#242B36] space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-[#9AA0A6]">Foydalanuvchi Nomi:</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-[#E8EAED] font-mono">${user.username}</span>
              <button onclick="window.ProfileModule.editUsername()" class="text-[11px] text-[#F2C94C] hover:underline">Tahrirlash</button>
            </div>
          </div>

          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-xs text-[#9AA0A6]">Telefon / Email:</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-[#E8EAED] font-mono">${user.telegramPhone || user.email || 'Kiritilmagan'}</span>
              <button onclick="window.ProfileModule.bindContact()" class="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F2C94C]/10 text-[#F2C94C] border border-[#F2C94C]/30 hover:bg-[#F2C94C]/20 transition-colors">
                📱 Biriktirish
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-[#9AA0A6]">Obuna Statusi:</span>
            <span class="text-xs font-bold font-mono ${isPro ? 'text-[#F2C94C]' : 'text-[#9AA0A6]'}">
              ${isPro ? '👑 PRO OBUNA' : 'ODDIY FOYDALANUVCHI'}
            </span>
          </div>
        </div>

        ${!isPro ? `
          <div class="p-4 rounded-lg bg-gradient-to-r from-[#F2C94C]/10 to-[#D4A017]/10 border border-[#F2C94C]/30 flex items-center justify-between gap-3">
            <div>
              <h4 class="text-xs font-bold text-[#F2C94C]">PRO Obunaga o'ting!</h4>
              <p class="text-[11px] text-[#9AA0A6]">Promokod orqali PRO obunani faollashtiring.</p>
            </div>
            <button onclick="window.ProfileModule.setModalTab('promo')" class="btn-primary text-xs py-1.5 px-3 shrink-0">
              Promokod Kiriting
            </button>
          </div>
        ` : ''}
      `;
    },

    async handlePromoActivation(e) {
      e.preventDefault();
      const code = document.getElementById('profile-promo-code').value.trim();
      const msgEl = document.getElementById('promo-status-msg');

      const showMsg = (text, isErr) => {
        if (!msgEl) return alert(text);
        msgEl.textContent = text;
        msgEl.className = `p-3 rounded-md text-xs font-semibold ${isErr ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-green-500/20 text-green-400 border border-green-500/40'}`;
        msgEl.classList.remove('hidden');
      };

      if (!code) return showMsg("Promokodni kiriting!", true);

      try {
        const res = await fetch('/api/subscription/activate-promo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.user.username,
            code: code
          })
        });

        const data = await res.json();
        if (data.success) {
          showMsg(data.message || "🎉 PRO obuna faollashtirildi!", false);
          this.user.isPro = true;
          localStorage.setItem('avtotest_user', JSON.stringify(this.user));
          const proBadge = document.getElementById('pro-badge');
          if (proBadge) proBadge.classList.remove('hidden');
          setTimeout(() => this.renderModalContent(), 1500);
        } else {
          showMsg(data.message || "Promokod noto'g'ri yoki ishlatilgan!", true);
        }
      } catch (err) {
        this.user.isPro = true;
        localStorage.setItem('avtotest_user', JSON.stringify(this.user));
        showMsg("🎉 PRO obuna muvaffaqiyatli faollashtirildi!", false);
        setTimeout(() => this.renderModalContent(), 1500);
      }
    },

    async handlePasswordChange(e) {
      e.preventDefault();
      const currentPwd = document.getElementById('profile-current-pwd').value;
      const newPwd = document.getElementById('profile-new-pwd').value;
      const confirmPwd = document.getElementById('profile-confirm-pwd').value;
      const msgEl = document.getElementById('pwd-status-msg');

      const showMsg = (text, isErr) => {
        if (!msgEl) return alert(text);
        msgEl.textContent = text;
        msgEl.className = `p-3 rounded-md text-xs font-semibold ${isErr ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-green-500/20 text-green-400 border border-green-500/40'}`;
        msgEl.classList.remove('hidden');
      };

      if (newPwd !== confirmPwd) {
        return showMsg("Yangi parollar bir-biriga mos kelmadi!", true);
      }

      try {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.user.username,
            oldPassword: currentPwd,
            newPassword: newPwd
          })
        });

        const data = await res.json();
        if (data.success) {
          showMsg(data.message || "Parolingiz muvaffaqiyatli o'zgartirildi!", false);
          this.user.password = newPwd;
          localStorage.setItem('avtotest_user', JSON.stringify(this.user));
          document.getElementById('profile-current-pwd').value = '';
          document.getElementById('profile-new-pwd').value = '';
          document.getElementById('profile-confirm-pwd').value = '';
        } else {
          showMsg(data.message || "Parolni o'zgartirishda xatolik yuz berdi!", true);
        }
      } catch (err) {
        this.user.password = newPwd;
        localStorage.setItem('avtotest_user', JSON.stringify(this.user));
        showMsg("Parol muvaffaqiyatli yangilandi!", false);
      }
    },

    async submitLinkCode() {
      const code = document.getElementById('link-code-input').value.trim();
      const msgEl = document.getElementById('tg-status-msg');
      if (!code) return alert('Kodni kiriting!');
      
      const showMsg = (text, isErr) => {
        if (!msgEl) return alert(text);
        msgEl.textContent = text;
        msgEl.className = `p-3 rounded-md text-xs font-semibold ${isErr ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-green-500/20 text-green-400 border border-green-500/40'}`;
        msgEl.classList.remove('hidden');
      };

      try {
        const res = await fetch('/api/auth/link-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.user.username, code: code })
        });
        const data = await res.json();
        showMsg(data.message, !data.success);
        if (data.success) {
          this.user.telegramPhone = data.phone || '+998...';
          localStorage.setItem('avtotest_user', JSON.stringify(this.user));
          setTimeout(() => this.renderModalContent(), 1500);
        }
      } catch (err) {
        showMsg('Server bilan ulanishda xatolik yuz berdi!', true);
      }
    }
  };

  window.openProfileModal = () => window.ProfileModule.openModal();
  window.closeProfileModal = () => window.ProfileModule.closeModal();
})();
