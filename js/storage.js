// LocalStorage Manager for AvtoTest UZ
(function() {
  const STORAGE_KEYS = {
    THEME: 'avtotest_theme',
    STATS: 'avtotest_stats_history'
  };

  window.StorageManager = {
    getTheme() {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    },

    setTheme(theme) {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    },

    getHistory() {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : [];
    },

    saveResult(result) {
      const history = this.getHistory();
      history.unshift(result);
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(history.slice(0, 50)));
    },

    getStatsSummary() {
      const history = this.getHistory();
      if (history.length === 0) {
        return {
          totalTests: 0,
          averageScore: 0,
          passRate: 0,
          passedCount: 0,
          bestScore: 0,
          lastTestDate: 'Hali test ishlanmagan'
        };
      }

      const totalTests = history.length;
      const passedCount = history.filter(h => h.passed).length;
      const totalScoreSum = history.reduce((acc, curr) => acc + curr.score, 0);
      const averageScore = (totalScoreSum / totalTests).toFixed(1);
      const passRate = Math.round((passedCount / totalTests) * 100);
      const bestScore = Math.max(...history.map(h => h.score));
      const lastTestDate = new Date(history[0].date).toLocaleDateString('uz-UZ', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return {
        totalTests,
        averageScore,
        passRate,
        passedCount,
        bestScore,
        lastTestDate
      };
    },

    clearHistory() {
      localStorage.removeItem(STORAGE_KEYS.STATS);
    }
  };
})();
