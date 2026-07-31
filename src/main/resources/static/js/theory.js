(function() {
  window.TheoryModule = {
    theoryData: [],
    expandedTopics: {},

    init(containerEl) {
      this.container = containerEl;
      this.theoryData = window.THEORY_DATA || [];
      if (this.theoryData.length > 0) {
        this.expandedTopics[this.theoryData[0].id] = true;
      }
      this.render();
    },

    toggleTopic(id) {
      this.expandedTopics[id] = !this.expandedTopics[id];
      this.render();
    },

    render() {
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium" style="background:var(--surface-2);color:var(--primary);border:1px solid var(--border);margin-bottom:0.75rem;">
              YO'L HARAKATI QOIDALARI QO'LLANMASI
            </span>
            <h2 class="section-title mb-2" style="color:var(--text)">PDD Nazariya Bo'limlari</h2>
            <p class="muted-text max-w-xl">
              O'zbekiston Respublikasi yo'l harakati qoidalarini bo'limlar bo'yicha oson va tushunarli tarzda o'rganing.
            </p>
          </div>

          <div class="space-y-4">
      `;

      this.theoryData.forEach(topic => {
        const isExpanded = !!this.expandedTopics[topic.id];

        html += `
          <div class="tech-card overflow-hidden p-0">
            <button onclick="window.toggleTheoryTopic('${topic.id}')" class="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors hover-surface">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-md flex items-center justify-center shrink-0" style="background:var(--surface-2);border:1px solid var(--border);color:var(--primary)">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold font-heading" style="color:var(--text)">${topic.title}</h3>
                  <p class="text-xs mt-0.5" style="color:var(--text-muted)">${topic.summary}</p>
                </div>
              </div>
              <div class="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transform transition-transform" style="background:var(--surface-2);border:1px solid var(--border);color:${isExpanded ? 'var(--primary)' : 'var(--text-muted)'}; ${isExpanded ? 'transform:rotate(180deg)' : ''}">
                ↓
              </div>
            </button>

            ${isExpanded ? `
              <div class="px-6 pb-6 pt-2 space-y-3 fade-in" style="border-top:1px solid var(--border);background:var(--bg)">
                ${topic.content.map(c => `
                  <div class="p-4 rounded-md" style="background:var(--surface);border:1px solid var(--border)">
                    <h4 class="text-xs font-mono font-bold mb-2 flex items-center gap-2" style="color:var(--primary)">
                      <span class="w-1.5 h-1.5 rounded-full" style="background:var(--primary)"></span>
                      <span>${c.subTitle}</span>
                    </h4>
                    <p class="text-xs sm:text-sm leading-relaxed" style="color:var(--text)">${c.text}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      this.container.innerHTML = html;
    }
  };
})();
