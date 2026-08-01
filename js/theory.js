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

    isRu() {
      return (localStorage.getItem('avtotest_lang') || 'UZ') === 'RU';
    },

    toggleTopic(id) {
      this.expandedTopics[id] = !this.expandedTopics[id];
      this.render();
    },

    render() {
      const ru = this.isRu();
      let html = `
        <div class="fade-in max-w-5xl mx-auto py-4 space-y-8">
          <div class="text-left">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium bg-[#171C24] text-[#F2C94C] border border-[#242B36] mb-3">
              ${ru ? 'СПРАВОЧНИК ПРАВИЛ ДОРОЖНОГО ДВИЖЕНИЯ' : "YO'L HARAKATI QOIDALARI QO'LLANMASI"}
            </span>
            <h2 class="section-title text-[#E8EAED] mb-2">${ru ? 'Разделы Теории ПДД' : 'PDD Nazariya Bo\'limlari'}</h2>
            <p class="muted-text max-w-xl">
              ${ru ? 'Изучайте правила дорожного движения Республики Узбекистан по разделам легко и понятно.' : "O'zbekiston Respublikasi yo'l harakati qoidalarini bo'limlar bo'yicha oson va tushunarli tarzda o'rganing."}
            </p>
          </div>

          <div class="space-y-4">
      `;

      this.theoryData.forEach(topic => {
        const isExpanded = !!this.expandedTopics[topic.id];
        const topicTitle = ru && topic.titleRu ? topic.titleRu : topic.title;
        const topicSummary = ru && topic.summaryRu ? topic.summaryRu : topic.summary;

        html += `
          <div class="tech-card overflow-hidden p-0">
            <button onclick="window.toggleTheoryTopic('${topic.id}')" class="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#171C24] transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-md bg-[#171C24] border border-[#242B36] text-[#F2C94C] flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-bold text-[#E8EAED] font-heading">${topicTitle}</h3>
                  <p class="text-xs text-[#9AA0A6] mt-0.5">${topicSummary}</p>
                </div>
              </div>
              <div class="w-7 h-7 rounded-md bg-[#171C24] border border-[#242B36] flex items-center justify-center text-[#9AA0A6] shrink-0 transform transition-transform ${isExpanded ? 'rotate-180 text-[#F2C94C]' : ''}">
                ↓
              </div>
            </button>

            ${isExpanded ? `
              <div class="px-6 pb-6 pt-2 border-t border-[#242B36] space-y-3 fade-in bg-[#0B0F14]/50">
                ${topic.content.map(c => {
                  const ruleTitle = ru && c.ruleRu ? c.ruleRu : c.rule;
                  const ruleText = ru && c.textRu ? c.textRu : c.text;
                  return `
                    <div class="p-4 rounded-md bg-[#0B0F14] border border-[#242B36]">
                      <h4 class="text-xs font-mono font-bold text-[#F2C94C] mb-2 flex items-center gap-2">
                        <span>📌 ${ruleTitle}</span>
                      </h4>
                      <p class="text-xs sm:text-sm text-[#E8EAED] leading-relaxed">${ruleText}</p>
                    </div>
                  `;
                }).join('')}
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
