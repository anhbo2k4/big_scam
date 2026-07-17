/**
 * Game History & Activity Tracking Module
 * Tracks all user actions and game events for analytics and audit purposes
 */

const historyModule = {
  container: null,
  data: [],
  currentFilter: 'all',
  currentPage: 1,
  itemsPerPage: 15,

  init: () => {
    historyModule.container = document.getElementById('historyContainer');
    if (!historyModule.container) return;

    historyModule.setupEventListeners();
    historyModule.loadHistory();
  },

  setupEventListeners: () => {
    // Filter buttons
    document.querySelectorAll('[data-history-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-history-filter]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        historyModule.currentFilter = e.target.dataset.historyFilter;
        historyModule.currentPage = 1;
        historyModule.render();
      });
    });

    // Search input
    const searchInput = document.getElementById('historySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        historyModule.currentPage = 1;
        historyModule.render();
      }, 300));
    }

    // Export button
    const exportBtn = document.getElementById('historyExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => historyModule.exportAsCSV());
    }
  },

  loadHistory: async () => {
    try {
      const response = await fetch(`/api/history?filter=${historyModule.currentFilter}&page=${historyModule.currentPage}`);
      
      if (!response.ok) {
        console.warn(`⚠️ History HTTP ${response.status}`);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ History: Non-JSON response');
        return;
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        historyModule.data = result.data;
        historyModule.render();
      }
    } catch (err) {
      console.error('❌ Error loading history:', err.message);
    }
  },

  render: () => {
    if (!historyModule.container) return;

    const searchTerm = document.getElementById('historySearchInput')?.value.toLowerCase() || '';
    let filtered = historyModule.data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.user_name || '').toLowerCase().includes(searchTerm) ||
        (item.action || '').toLowerCase().includes(searchTerm) ||
        (item.description || '').toLowerCase().includes(searchTerm)
      );
    }

    const totalPages = Math.ceil(filtered.length / historyModule.itemsPerPage);
    const start = (historyModule.currentPage - 1) * historyModule.itemsPerPage;
    const paginatedData = filtered.slice(start, start + historyModule.itemsPerPage);

    if (paginatedData.length === 0) {
      historyModule.container.innerHTML = `
        <div class="history-empty">
          <i class="fas fa-inbox"></i>
          <p>Không có dữ liệu lịch sử</p>
        </div>
      `;
      return;
    }

    historyModule.container.innerHTML = `
      <div class="history-list">
        ${paginatedData.map(item => `
          <div class="history-item ${item.status || 'info'}">
            <div class="history-icon">
              <i class="fas ${historyModule.getIcon(item.action)}"></i>
            </div>
            <div class="history-content">
              <h4 class="history-action">${historyModule.formatAction(item.action)}</h4>
              <p class="history-description">${item.description || ''}</p>
              <div class="history-meta">
                <span class="meta-user">👤 ${item.user_name || 'Hệ thống'}</span>
                <span class="meta-time">🕐 ${new Date(item.created_at).toLocaleString('vi-VN')}</span>
                ${item.details ? `<span class="meta-details">📝 ${JSON.stringify(item.details).substring(0, 50)}...</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${totalPages > 1 ? `
        <div class="history-pagination">
          ${historyModule.currentPage > 1 ? `
            <button onclick="historyModule.previousPage()" class="history-page-btn">
              <i class="fas fa-chevron-left"></i> Trước
            </button>
          ` : ''}
          <span class="history-page-info">Trang ${historyModule.currentPage}/${totalPages}</span>
          ${historyModule.currentPage < totalPages ? `
            <button onclick="historyModule.nextPage()" class="history-page-btn">
              Tiếp <i class="fas fa-chevron-right"></i>
            </button>
          ` : ''}
        </div>
      ` : ''}
    `;
  },

  getIcon: (action) => {
    const icons = {
      'box_opened': 'fa-gift',
      'prize_claimed': 'fa-star',
      'form_submitted': 'fa-check-circle',
      'withdrawal_created': 'fa-money-bill-wave',
      'login': 'fa-sign-in-alt',
      'logout': 'fa-sign-out-alt',
      'user_created': 'fa-user-plus',
      'user_deleted': 'fa-user-minus',
      'settings_changed': 'fa-cogs',
      'export': 'fa-download'
    };
    return icons[action] || 'fa-history';
  },

  formatAction: (action) => {
    const labels = {
      'box_opened': 'Mở Hộp Quà',
      'prize_claimed': 'Nhận Quà',
      'form_submitted': 'Nộp Biểu Mẫu',
      'withdrawal_created': 'Tạo Yêu Cầu Rút Quà',
      'login': 'Đăng Nhập',
      'logout': 'Đăng Xuất',
      'user_created': 'Tạo Người Dùng',
      'user_deleted': 'Xóa Người Dùng',
      'settings_changed': 'Thay Đổi Cài Đặt',
      'export': 'Xuất Dữ Liệu'
    };
    return labels[action] || action;
  },

  previousPage: () => {
    if (historyModule.currentPage > 1) {
      historyModule.currentPage--;
      historyModule.render();
    }
  },

  nextPage: () => {
    historyModule.currentPage++;
    historyModule.render();
  },

  exportAsCSV: () => {
    const headers = ['Thời gian', 'Người dùng', 'Hành động', 'Mô tả', 'Chi tiết'];
    const rows = historyModule.data.map(item => [
      new Date(item.created_at).toLocaleString('vi-VN'),
      item.user_name || 'Hệ thống',
      historyModule.formatAction(item.action),
      item.description || '',
      item.details ? JSON.stringify(item.details) : ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
};

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Auto-initialize if DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => historyModule.init());
} else {
  historyModule.init();
}
