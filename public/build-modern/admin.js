
const CONFIG = {
    AUTO_REFRESH_INTERVAL: 30000, 
    TOAST_DURATION: 4000,
    ANIMATION_DURATION: 300,
};

const usersData = [
    {
        id: 1,
        username: 'admin999',
        role: 'admin',
        status: 'active',
        createdAt: '20/1/2026',
        password: 'password123'
    },
    {
        id: 2,
        username: 'admin',
        role: 'admin',
        status: 'active',
        createdAt: '4/6/2025',
        password: 'password123'
    }
];

const filesData = [
   
];

let state = {
    currentTab: 'sessions',
    sidebarCollapsed: false,
    autoRefresh: false,
    autoRefreshTimer: null,
    notificationPanelOpen: false,
    notificationTimer: null,
    customizationTab: 'logo',
};

const utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    formatNumber: (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
};

const toast = {
    ensureStyles: () => {
        if (document.getElementById('admin-toast-modern-style')) return;
        const style = document.createElement('style');
        style.id = 'admin-toast-modern-style';
        style.textContent = `
            .admin-toast-stack {
                position: fixed;
                top: 14px;
                right: 14px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: min(390px, calc(100vw - 20px));
                z-index: 9999;
                pointer-events: none;
            }
            .admin-toast-modern {
                pointer-events: all;
                position: relative;
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 10px 12px 12px;
                border-radius: 14px;
                border: 1px solid rgba(148,163,184,.32);
                background: linear-gradient(145deg, rgba(15,23,42,.95), rgba(30,41,59,.96));
                box-shadow: 0 16px 36px rgba(2,6,23,.45);
                transform: translate3d(24px,0,0);
                opacity: 0;
                transition: transform .2s ease, opacity .2s ease;
            }
            .admin-toast-modern.show { transform: translate3d(0,0,0); opacity: 1; }
            .admin-toast-modern.hide { transform: translate3d(24px,0,0); opacity: 0; }
            .admin-toast-modern .icon {
                width: 30px;
                height: 30px;
                border-radius: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
                border: 1px solid rgba(148,163,184,.25);
                background: rgba(30,41,59,.85);
            }
            .admin-toast-modern.success .icon { background: rgba(34,197,94,.16); border-color: rgba(34,197,94,.45); }
            .admin-toast-modern.error .icon { background: rgba(239,68,68,.16); border-color: rgba(239,68,68,.45); }
            .admin-toast-modern.warning .icon { background: rgba(245,158,11,.16); border-color: rgba(245,158,11,.45); }
            .admin-toast-modern .body { min-width: 0; flex: 1; }
            .admin-toast-modern .title { font-size: 12px; font-weight: 800; color: #f8fafc; }
            .admin-toast-modern .msg { margin-top: 2px; font-size: 12px; color: #cbd5e1; line-height: 1.35; word-break: break-word; }
            .admin-toast-modern .close {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
                padding: 0;
                margin-top: 1px;
            }
            .admin-toast-modern .bar {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 3px;
                transform-origin: left center;
                transform: scaleX(1);
                background: rgba(59,130,246,.95);
            }
            .admin-toast-modern.success .bar { background: rgba(34,197,94,.95); }
            .admin-toast-modern.error .bar { background: rgba(239,68,68,.95); }
            .admin-toast-modern.warning .bar { background: rgba(245,158,11,.95); }
            @media (max-width: 980px) {
                .admin-toast-stack {
                    top: auto;
                    right: 10px;
                    left: 10px;
                    bottom: calc(12px + env(safe-area-inset-bottom));
                    width: auto;
                }
                .admin-toast-modern { transform: translate3d(0,16px,0); }
                .admin-toast-modern.hide { transform: translate3d(0,16px,0); }
            }
        `;
        document.head.appendChild(style);
    },

    show: (message, type = 'info', title = '') => {
        toast.ensureStyles();
        const container = document.getElementById('toastContainer') || (() => {
            const el = document.createElement('div');
            el.id = 'toastContainer';
            el.className = 'admin-toast-stack';
            document.body.appendChild(el);
            return el;
        })();

        const icons = {
            success: '✅',
            error: '⛔',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const titles = {
            success: title || 'Thành công',
            error: title || 'Lỗi',
            warning: title || 'Cảnh báo',
            info: title || 'Thông báo'
        };

        const toastEl = document.createElement('div');
        toastEl.className = `admin-toast-modern ${type}`;
        toastEl.innerHTML = `
            <span class="icon">${icons[type] || 'ℹ️'}</span>
            <div class="body">
                <div class="title">${titles[type]}</div>
                <div class="msg">${message}</div>
            </div>
            <button class="close" aria-label="Đóng">×</button>
            <span class="bar"></span>
        `;

        container.appendChild(toastEl);
        requestAnimationFrame(() => {
            toastEl.classList.add('show');
            const bar = toastEl.querySelector('.bar');
            if (bar) {
                bar.style.transition = `transform linear ${Math.max(900, CONFIG.TOAST_DURATION)}ms`;
                bar.style.transform = 'scaleX(0)';
            }
        });

        toastEl.querySelector('.close')?.addEventListener('click', () => {
            toast.remove(toastEl);
        });

        setTimeout(() => {
            toast.remove(toastEl);
        }, CONFIG.TOAST_DURATION);
    },

    remove: (toastEl) => {
        if (!toastEl || !toastEl.isConnected) return;
        toastEl.classList.add('hide');
        setTimeout(() => {
            toastEl.remove();
        }, CONFIG.ANIMATION_DURATION);
    },

    success: (message, title) => toast.show(message, 'success', title),
    error: (message, title) => toast.show(message, 'error', title),
    warning: (message, title) => toast.show(message, 'warning', title),
    info: (message, title) => toast.show(message, 'info', title),
};

const sidebar = {
    init: () => {
        const toggle = document.getElementById('sidebarToggle');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebarEl = document.getElementById('sidebar');

        toggle?.addEventListener('click', () => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            sidebarEl.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
        });

        mobileToggle?.addEventListener('click', () => {
            sidebarEl.classList.toggle('active');
        });

        
        const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
        if (savedState) {
            sidebarEl.classList.add('collapsed');
            state.sidebarCollapsed = true;
        }
    },
};

const navigation = {
    init: () => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                if (tab) {
                    navigation.switchTab(tab);
                }
            });
        });
    },

    switchTab: (tabName) => {
        
        state.currentTab = tabName;

        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabName) {
                item.classList.add('active');
            }
        });

        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        
        const targetPanel = document.getElementById(`${tabName}-panel`);
        const targetTab = document.getElementById(`${tabName}-tab`);
        
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        
        if (targetTab) {
            targetTab.style.display = 'block';
        }

        
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        if (targetTab) {
            targetTab.style.display = 'block';
        }

        
        const breadcrumb = document.querySelector('.breadcrumb-current');
        if (breadcrumb) {
            const labels = {
                sessions: 'Phiên chơi',
                withdrawals: 'Rút tiền',
                gifts: 'Phê duyệt',
                users: 'Người dùng',
                files: 'Quản lý File',
                analytics: 'Thống kê',
                customization: 'Tùy chỉnh',
                tools: 'Công cụ',
                settings: 'Cấu hình'
            };
            breadcrumb.textContent = labels[tabName] || tabName;
        }

        
        document.getElementById('sidebar')?.classList.remove('active');
    },
};

const sessions = {
    isFetching: false,
    
    init: () => {
        sessions.fetch();
        
        filters.initSessionFilters();
    },

    fetch: () => {
        if (sessions.isFetching) return; 
        sessions.isFetching = true;
        sessions.currentPage = 1; 
        
        fetch('/api/sessions')
            .then(res => {
                if (!res.ok) {
                    console.error(`⚠️ [Sessions API] HTTP ${res.status}: ${res.statusText}`);
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                // Check content type before parsing as JSON
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return res.json();
                } else {
                    return res.text().then(text => {
                        console.warn(`⚠️ [Sessions] Non-JSON response: ${text.substring(0, 100)}`);
                        return { success: false, data: [] };
                    });
                }
            })
            .then(data => {
                if (data && data.success && Array.isArray(data.data)) {
                    sessions.data = data.data;
                    console.log(`✅ [Sessions] Loaded ${data.data.length} sessions`);
                } else {
                    console.warn('⚠️ [Sessions] Invalid response format:', data);
                    sessions.data = [];
                }
                sessions.render();
                sessions.initActions();
            })
            .catch(err => {
                console.error('❌ [Sessions] Error fetching sessions:', err.message);
                sessions.data = [];
                sessions.render();
                sessions.initActions();
            })
            .finally(() => {
                sessions.isFetching = false;
            });
    },

    data: [],
    currentPage: 1,
    itemsPerPage: 10,

    render: () => {
        const grid = document.getElementById('sessionsGrid');
        if (!grid) return;

        
        const totalItems = sessions.data.length;
        const totalPages = Math.ceil(totalItems / sessions.itemsPerPage);
        const startIndex = (sessions.currentPage - 1) * sessions.itemsPerPage;
        const endIndex = Math.min(startIndex + sessions.itemsPerPage, totalItems);
        
        
        const pageItems = sessions.data.slice(startIndex, endIndex);

        grid.innerHTML = pageItems.map(session => {
            const code = session.session_code || session.code || 'N/A';
            const createdAt = session.createdAt || new Date().toLocaleString('vi-VN');
            const status = session.is_active ? 'active' : 'inactive';
            const statusText = session.is_active ? 'Hoạt động' : 'Không hoạt động';
            
            
            const prize1 = session.prize_1 || 'Phần thưởng 1';
            const prize1Desc = session.prize_1_description || '';
            const prize1Price = session.prize_1 || '0đ';
            const prize1Icon = session.prize_1_icon || '🎁';
            const prize1Status = session.prize_1_status || 'NORMAL';
            
            const prize2 = session.prize_2 || 'Phần thưởng 2';
            const prize2Desc = session.prize_2_description || '';
            const prize2Price = session.prize_2 || '0đ';
            const prize2Icon = session.prize_2_icon || '🎁';
            const prize2Status = session.prize_2_status || 'NORMAL';
            
            const prize3 = session.prize_3 || 'Phần thưởng 3';
            const prize3Desc = session.prize_3_description || '';
            const prize3Price = session.prize_3 || '0đ';
            const prize3Icon = session.prize_3_icon || '🎁';
            const prize3Status = session.prize_3_status || 'NORMAL';
            
            const getPrizeIcon = (status) => {
                if (status === 'VIP') return '<i class="fas fa-crown"></i>';
                return '';
            };
            
            return `
            <div class="session-card" data-code="${code}" data-session-code="${code}" data-session-owner="admin" data-session-account="${code}" data-session-date="${createdAt}">
                <div class="session-card-header">
                    <div class="session-code-section">
                        <div class="session-code-title">
                            <h3>${code}</h3>
                            <button class="btn-copy-session" data-code="${code}" title="Sao chép mã">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    <div class="session-info-right">
                        <div class="session-time">
                            <i class="fas fa-calendar"></i>
                            <span>${createdAt}</span>
                        </div>
                        <div class="session-stat">
                            <div class="stat-badge">100/100</div>
                            <button class="btn-edit-stat" title="Chỉnh sửa">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        <div class="session-user">
                            <i class="fas fa-user"></i>
                            <span>admin</span>
                        </div>
                    </div>
                </div>

                <div class="session-card-status">
                    <span class="status-tag ${status} session-status">${statusText}</span>
                    <button class="action-btn ${session.require_withdrawal === false ? 'success' : 'warning'}" data-action="toggle-withdrawal" data-code="${code}" title="${session.require_withdrawal === false ? 'Không yêu cầu rút tiền' : 'Yêu cầu rút tiền'}" style="width:auto;padding:0 8px;gap:4px;font-size:11px;">
                        <i class="fas fa-${session.require_withdrawal === false ? 'unlock' : 'lock'}"></i>
                        ${session.require_withdrawal === false ? 'Tự do mở hộp' : 'Bắt rút tiền'}
                    </button>
                    ${session.player_selected_box ? `
                        <span class="status-badge selected">
                            ✅ Hộp #${session.player_selected_box}
                        </span>
                        <span class="status-timestamp">${new Date(session.player_selected_at).toLocaleTimeString('vi-VN')}</span>
                    ` : ''}
                    ${session.player_name ? `
                        <span class="player-name">👤 ${session.player_name}</span>
                    ` : ''}
                </div>

                <div class="session-card-body">
                    <div class="progress-section">
                        <div class="progress-header">
                            <span class="progress-label">Tiến độ mở hộp</span>
                            <span class="progress-value">3/3</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: 100%"></div>
                            </div>
                        </div>
                        <div class="progress-stats">
                            <span>📊 1 người chơi</span>
                            <span>🎁 0 hoàn thành</span>
                        </div>
                    </div>

                    <div class="prizes-grid">
                        <div class="prize-item">
                            <div class="prize-number">1</div>
                            <div class="prize-icon">${prize1Icon}</div>
                            ${prize1Status === 'VIP' ? '<div class="prize-crown"><i class="fas fa-crown"></i></div>' : ''}
                            <div class="prize-name">${prize1}</div>
                            <div class="prize-price">
                                <span class="price-value">${prize1Price}</span>
                                <button class="btn-mini-edit" title="Sửa">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </div>
                            ${session.player_selected_box === 1 ? '<div class="prize-status">✅ Đã mở</div>' : ''}
                        </div>

                        <div class="prize-item">
                            <div class="prize-number">2</div>
                            <div class="prize-icon">${prize2Icon}</div>
                            ${prize2Status === 'VIP' ? '<div class="prize-crown"><i class="fas fa-crown"></i></div>' : ''}
                            <div class="prize-name">${prize2}</div>
                            <div class="prize-price">
                                <button class="btn-mini-edit" title="Sửa">
                                    <i class="fas fa-dollar-sign"></i>
                                </button>
                            </div>
                            ${session.player_selected_box === 2 ? '<div class="prize-status">✅ Đã mở</div>' : ''}
                        </div>

                        <div class="prize-item">
                            <div class="prize-number">3</div>
                            <div class="prize-icon">${prize3Icon}</div>
                            ${prize3Status === 'VIP' ? '<div class="prize-crown"><i class="fas fa-crown"></i></div>' : ''}
                            <div class="prize-name">${prize3}</div>
                            <div class="prize-price">
                                <span class="price-value">${prize3Price}</span>
                                <button class="btn-mini-edit" title="Sửa">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </div>
                            ${session.player_selected_box === 3 ? '<div class="prize-status">✅ Đã mở</div>' : ''}
                        </div>
                    </div>
                </div>

                <div class="session-card-footer">
                    <button class="action-btn primary" data-action="link" data-code="${code}">
                        <i class="fas fa-link"></i>
                        Copy Link
                    </button>
                    <button class="action-btn" data-action="view" data-code="${code}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" data-action="clone" data-code="${code}" title="Clone phiên" style="width:auto;padding:0 10px;gap:6px;">
                        <i class="fas fa-copy"></i>
                        Clone
                    </button>
                    <button class="action-btn" data-action="edit" data-code="${code}">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="action-btn warning" data-action="pause" data-code="${code}">
                        <i class="fas fa-pause"></i>
                    </button>
                    <button class="action-btn danger" data-action="delete" data-code="${code}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `}).join('');

        
        grid.querySelectorAll('.btn-copy-session').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const code = btn.dataset.code;
                const success = await utils.copyToClipboard(code);
                if (success) {
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.style.color = 'var(--success)';
                    toast.success(`Đã sao chép mã: ${code}`);
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-copy"></i>';
                        btn.style.color = '';
                    }, 2000);
                } else {
                    toast.error('Không thể sao chép');
                }
            });
        });
        
        
        sessions.renderPagination();
        
        
        setTimeout(() => {
            filters.applySessionFilters();
        }, 0);
    },

    renderPagination: () => {
        const totalItems = sessions.data.length;
        const totalPages = Math.ceil(totalItems / sessions.itemsPerPage);
        const startIndex = (sessions.currentPage - 1) * sessions.itemsPerPage;
        const endIndex = Math.min(startIndex + sessions.itemsPerPage, totalItems);
        
        
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.innerHTML = `Hiển thị <strong>${startIndex + 1}-${endIndex}</strong> trong tổng số <strong>${totalItems}</strong> phiên`;
        }
        
        
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.disabled = sessions.currentPage === 1;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            if (sessions.currentPage > 1) {
                sessions.currentPage--;
                sessions.render();
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === sessions.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                sessions.currentPage = i;
                sessions.render();
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.disabled = sessions.currentPage === totalPages || totalPages === 0;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            if (sessions.currentPage < totalPages) {
                sessions.currentPage++;
                sessions.render();
            }
        });
        paginationContainer.appendChild(nextBtn);
    },

    buildSessionPlayLink: (code) => {
        const rawCode = String(code || '').trim();
        if (!rawCode) return '';
        const pathname = String(window.location.pathname || '/');
        const adminIndex = pathname.indexOf('/admin');
        const basePrefix = adminIndex >= 0 ? pathname.slice(0, adminIndex) : '';
        const basePath = `${basePrefix || ''}/`.replace(/\/+/g, '/');
        return `${window.location.origin}${basePath}?code=${encodeURIComponent(rawCode)}`;
    },

    initActions: () => {
        const grid = document.getElementById('sessionsGrid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const action = actionBtn.dataset.action;
            const code = actionBtn.dataset.code;

            if (!code) return;

            switch (action) {
                case 'link':
                    
                    const link = sessions.buildSessionPlayLink(code);
                    utils.copyToClipboard(link).then(success => {
                        if (success) {
                            toast.success(`Đã sao chép link: ${link}`);
                        } else {
                            toast.error('Không thể sao chép link');
                        }
                    });
                    break;
                case 'view':
                    
                    modal.openPreview(code);
                    break;
                case 'clone':
                    modal.cloneSession(code);
                    break;
                case 'edit':
                    
                    modal.openEdit(code);
                    break;
                case 'pause':
                    
                    sessions.toggleStatus(code);
                    break;
                case 'toggle-withdrawal':
                    sessions.toggleWithdrawal(code);
                    break;
                case 'delete':
                    
                    modal.deleteSession(code);
                    break;
            }
        });
    },

    toggleWithdrawal: async (code) => {
        const session = sessions.data.find(s => s.session_code === code || s.code === code);
        if (!session) { toast.error('Không tìm thấy phiên'); return; }
        const newVal = !(session.require_withdrawal !== false);
        try {
            const response = await fetch(`/api/sessions/${code}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ require_withdrawal: newVal })
            });
            if (response.ok) {
                const updated = await response.json();
                const index = sessions.data.findIndex(s => s.session_code === code || s.code === code);
                if (index !== -1) {
                    sessions.data[index] = updated.data || updated;
                    sessions.render();
                    sessions.initActions();
                    toast.success(newVal ? 'Đã bật: Yêu cầu rút tiền trước khi mở hộp tiếp theo' : 'Đã tắt: Không cần rút tiền để mở hộp tiếp theo');
                }
            } else {
                toast.error('Không thể cập nhật phiên');
            }
        } catch (error) {
            console.error('Toggle withdrawal error:', error);
            toast.error('Lỗi: ' + error.message);
        }
    },

    toggleStatus: async (code) => {
        const session = sessions.data.find(s => s.session_code === code || s.code === code);
        if (!session) {
            toast.error('Không tìm thấy phiên');
            return;
        }

        try {
            const response = await fetch(`/api/sessions/${code}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_active: !session.is_active
                })
            });

            if (response.ok) {
                const updated = await response.json();
                const index = sessions.data.findIndex(s => s.session_code === code || s.code === code);
                if (index !== -1) {
                    sessions.data[index] = updated.data || updated;
                    sessions.render();
                    sessions.initActions();
                    toast.success(updated.data?.is_active ? 'Đã kích hoạt phiên' : 'Đã tạm dừng phiên');
                }
            } else {
                toast.error('Không thể cập nhật phiên');
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            toast.error('Lỗi: ' + error.message);
        }
    },

    delete: (id) => {
        const session = sessions.data.find(s => s.id === id);
        if (session) {
            const card = document.querySelector(`[data-id="${id}"]`);
            
            if (card) {
                card.style.animation = 'fadeOut 0.5s ease';
                setTimeout(async () => {
                    try {
                        const response = await fetch(`/api/sessions/${session.session_code}`, {
                            method: 'DELETE'
                        });
                        const result = await response.json();
                        
                        if (result.success) {
                            
                            sessions.data = sessions.data.filter(s => s.id !== id);
                            sessions.render();
                            toast.success(`Đã xóa phiên: ${session.session_code}`);
                        } else {
                            toast.error('Lỗi: ' + (result.message || 'Không thể xóa phiên'));
                        }
                    } catch (error) {
                        console.error('Delete error:', error);
                        toast.error('Lỗi: ' + error.message);
                    }
                }, 500);
            }
        }
    },
};

const users = {
    init: () => {
        users.render();
        users.initActions();
    },

    render: () => {
        const grid = document.getElementById('usersGrid');
        if (!grid) return;

        grid.innerHTML = usersData.map(user => `
            <div class="user-card" data-id="${user.id}">
                <div class="user-header">
                    <div class="user-info-header">
                        <span class="username">${user.username}</span>
                        <span class="user-role-badge">
                            <i class="fas fa-crown"></i>
                            ${user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                    </div>
                    <span class="user-status">${user.status === 'active' ? 'Hoạt động' : 'Khóa'}</span>
                </div>
                <div class="user-date">Tạo: ${user.createdAt}</div>
                <div class="password-field">
                    <label>Mật khẩu:</label>
                    <div class="password-input-wrapper">
                        <input type="password" class="password-input" value="${user.password}" readonly>
                        <button class="password-toggle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                ${user.id !== 1 ? `
                <div class="user-actions">
                    <button class="user-action-btn change-password" data-action="password" data-id="${user.id}">
                        <i class="fas fa-key"></i>
                        Đổi mật khẩu
                    </button>
                    <button class="user-action-btn lock" data-action="lock" data-id="${user.id}">
                        <i class="fas fa-lock"></i>
                        Khóa
                    </button>
                    <button class="user-action-btn delete" data-action="delete" data-id="${user.id}">
                        <i class="fas fa-trash"></i>
                        Xóa
                    </button>
                </div>
                ` : ''}
            </div>
        `).join('');

        
        grid.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                const icon = btn.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    },

    initActions: () => {
        const grid = document.getElementById('usersGrid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.user-action-btn');
            if (!actionBtn) return;

            const action = actionBtn.dataset.action;
            const id = parseInt(actionBtn.dataset.id);
            const user = usersData.find(u => u.id === id);

            if (!user) return;

            switch (action) {
                case 'password':
                    toast.info(`Đổi mật khẩu cho: ${user.username}`);
                    break;
                case 'lock':
                    toast.warning(`Khóa tài khoản: ${user.username}`);
                    break;
                case 'delete':
                    NotificationModal.confirm(
                        'Xác nhận',
                        `Bạn có chắc muốn xóa người dùng ${user.username}?`,
                        () => {
                            toast.success(`Đã xóa người dùng: ${user.username}`);
                        }
                    );
                    break;
            }
        });
    },
};

const files = {
    data: [],
    isFetching: false,

    init: () => {
        console.log('🔵 files.init() called');
        
        files.fetch().then(() => {
            console.log('🔵 files.fetch() completed');
        });
        files.setupListeners();
    },

    fetch: async () => {
        if (files.isFetching) return;
        files.isFetching = true;
        
        console.log('🔵 files.fetch() called');

        try {
            const response = await fetch('/api/files');
            const result = await response.json();
            
            console.log('🔵 files.fetch() response:', result);
            
            if (result.success) {
                files.data = result.data || [];
                files.stats = result.stats || {};
                console.log(`🔵 files.data set to ${files.data.length} items`);
                files.render();
                files.updateStats();
            } else {
                console.error('❌ files.fetch() failed:', result.message);
            }
        } catch (err) {
            console.error('Error fetching files:', err);
            files.data = [];
            files.render();
        } finally {
            files.isFetching = false;
        }
    },

    render: () => {
        const grid = document.getElementById('filesGrid');
        if (!grid) {
            console.log('❌ filesGrid element NOT found');
            return;
        }

        console.log(`🔵 files.render() - rendering ${files.data.length} files`);

        if (files.data.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>Chưa có tệp tin</h3>
                    <p>Tải lên tệp tin đầu tiên bằng nút "Tải lên tệp"</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = files.data.map(file => `
            <div class="file-card" data-id="${file.id}" data-name="${file.name}">
                ${file.isImage ? `
                    <div class="file-preview-img">
                        <img src="${file.url}" alt="${file.name}" onerror="this.src='/images/file-placeholder.png'">
                    </div>
                ` : `
                    <div class="file-preview-icon">
                        <i class="fas fa-file"></i>
                    </div>
                `}
                <div class="file-info">
                    <div class="file-name" title="${file.name}">${file.name}</div>
                    <div class="file-meta">
                        <span><i class="fas fa-weight"></i> ${file.size}</span>
                        <span><i class="fas fa-tag"></i> ${file.type}</span>
                        <span><i class="fas fa-calendar"></i> ${file.uploadedAt}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="action-btn" data-action="view" title="Xem">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" data-action="download" title="Tải về">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn danger" data-action="delete" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    updateStats: () => {
        const stats = files.stats;
        document.querySelectorAll('#files-panel .stat-value').forEach((el, idx) => {
            if (idx === 0) el.textContent = stats.totalFiles || 0;
            if (idx === 1) el.textContent = stats.totalImages || 0;
            if (idx === 2) el.textContent = stats.totalSizeFormatted || '0 B';
        });
    },

    setupListeners: () => {
        // Upload button
        const uploadBtn = document.getElementById('uploadFileBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', files.openUploadDialog);
        }

        // File actions (delegation)
        const grid = document.getElementById('filesGrid');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const btn = e.target.closest('.action-btn');
                if (!btn) return;

                const card = btn.closest('.file-card');
                const action = btn.dataset.action;
                const fileName = card.dataset.name;

                console.log('File action:', action, fileName);

                if (action === 'view') files.viewFile(fileName);
                if (action === 'download') files.downloadFile(fileName);
                if (action === 'delete') files.deleteFile(fileName, card);
            });
        }
    },

    openUploadDialog: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
            const selectedFiles = e.target.files;
            files.uploadFiles(selectedFiles);
        };
        input.click();
    },

    uploadFiles: async (fileList) => {
        for (let file of fileList) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/files', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    toast.success(`Tệp ${file.name} đã tải lên`);
                } else {
                    toast.error(`Lỗi tải ${file.name}: ${result.message}`);
                }
            } catch (err) {
                console.error('Upload error:', err);
                toast.error(`Lỗi tải ${file.name}`);
            }
        }

        // Refresh list
        setTimeout(() => files.fetch(), 1000);
    },

    viewFile: (fileName) => {
        const file = files.data.find(f => f.name === fileName);
        if (!file) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    ${file.isImage ? `
                        <img src="${file.url}" alt="${file.name}" style="max-width: 100%; max-height: 80vh; border-radius: 8px;">
                    ` : `
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-file" style="font-size: 60px; margin-bottom: 20px; color: var(--text-secondary);"></i>
                            <p style="margin: 10px 0; color: var(--text-primary);">Loại: ${file.type}</p>
                            <p style="margin: 10px 0; color: var(--text-secondary);">Dung lượng: ${file.size}</p>
                            <a href="${file.url}" class="btn btn-primary" download style="margin-top: 20px;">
                                <i class="fas fa-download"></i> Tải về
                            </a>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        // Append to content-area instead of body
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.appendChild(modal);
        } else {
            document.body.appendChild(modal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    downloadFile: (fileName) => {
        const file = files.data.find(f => f.name === fileName);
        if (!file) return;

        const link = document.createElement('a');
        link.href = file.url;
        link.download = fileName;
        link.click();
    },

    deleteFile: async (fileName, card) => {
        NotificationModal.confirm(
            'Xác nhận xóa',
            `Xác nhận xóa tệp: ${fileName}?`,
            async () => {
                try {
                    const response = await fetch(`/api/files/${encodeURIComponent(fileName)}`, {
                        method: 'DELETE'
                    });

                    const result = await response.json();
                    if (result.success) {
                        toast.success('Tệp đã xóa');
                        card.remove();
                        files.fetch(); // Refresh stats
                    } else {
                        toast.error('Xóa tệp thất bại');
                    }
                } catch (err) {
                    console.error('Delete error:', err);
                    toast.error('Lỗi xóa tệp');
                }
            }
        );
    }
};

// ==================== CUSTOMIZATION ====================
const customization = {
    data: {
        content: {
            mainTitle: 'Manh Lam Store',
            mainDescription: 'Tham gia chơi game nhận quà tặng hấp dẫn',
            bannerText: '',
            bannerVisible: false,
            footerText: '© 2024 - Manh Lam Store. All rights reserved.'
        },
        features: {
            history: true,
            chat: true,
            twoFA: false,
            withdraw: true,
            gifts: true
        },
        scripts: {
            css: '',
            js: ''
        }
    },

    init: () => {
        const tabs = document.querySelectorAll('.custom-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.custom;
                customization.switchTab(targetTab);
            });
        });

        // Logo height slider
        const slider = document.getElementById('logoHeightSlider');
        const valueDisplay = document.getElementById('logoHeightValue');
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value + 'px';
            });
        }

        // Content tab listeners
        document.getElementById('saveContentBtn')?.addEventListener('click', () => customization.saveContent());
        document.getElementById('resetContentBtn')?.addEventListener('click', () => customization.resetContent());

        // Features tab listeners
        document.getElementById('saveFeaturesBtn')?.addEventListener('click', () => customization.saveFeatures());

        // Scripts tab listeners
        document.getElementById('saveScriptsBtn')?.addEventListener('click', () => customization.saveScripts());
        document.getElementById('testScriptsBtn')?.addEventListener('click', () => customization.testScripts());
        document.getElementById('clearScriptsBtn')?.addEventListener('click', () => customization.clearScripts());

        // Load saved settings
        customization.loadSettings();
    },

    switchTab: (tabName) => {
        state.customizationTab = tabName;

        // Update tabs
        document.querySelectorAll('.custom-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.custom === tabName) {
                tab.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('.custom-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`${tabName}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    },

    loadSettings: async () => {
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) return;

            const result = await response.json();
            if (!result.success || !result.data) return;

            const settings = result.data;

            // Load content
            if (settings.content) {
                document.getElementById('mainTitle').value = settings.content.mainTitle || '';
                document.getElementById('mainDescription').value = settings.content.mainDescription || '';
                document.getElementById('bannerText').value = settings.content.bannerText || '';
                document.getElementById('bannerVisible').checked = settings.content.bannerVisible || false;
                document.getElementById('footerText').value = settings.content.footerText || '';
            }

            // Load features
            if (settings.features) {
                document.getElementById('featureHistory').checked = settings.features.history !== false;
                document.getElementById('featureChat').checked = settings.features.chat !== false;
                document.getElementById('feature2FA').checked = settings.features.twoFA === true;
                document.getElementById('featureWithdraw').checked = settings.features.withdraw !== false;
                document.getElementById('featureGifts').checked = settings.features.gifts !== false;
            }

            // Load scripts
            if (settings.scripts) {
                document.getElementById('customCSS').value = settings.scripts.css || '';
                document.getElementById('customJS').value = settings.scripts.js || '';
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    },

    saveContent: () => {
        const content = {
            mainTitle: document.getElementById('mainTitle').value,
            mainDescription: document.getElementById('mainDescription').value,
            bannerText: document.getElementById('bannerText').value,
            bannerVisible: document.getElementById('bannerVisible').checked,
            footerText: document.getElementById('footerText').value
        };

        customization.data.content = content;
        customization.saveToServer({ content });
    },

    resetContent: () => {
        NotificationModal.confirm(
            'Xác nhận',
            'Bạn có chắc muốn khôi phục nội dung mặc định?',
            () => {
                customization.data.content = {
                    mainTitle: 'Manh Lam Store',
                    mainDescription: 'Tham gia chơi game nhận quà tặng hấp dẫn',
                    bannerText: '',
                    bannerVisible: false,
                    footerText: '© 2024 - Manh Lam Store. All rights reserved.'
                };

                document.getElementById('mainTitle').value = customization.data.content.mainTitle;
                document.getElementById('mainDescription').value = customization.data.content.mainDescription;
                document.getElementById('bannerText').value = customization.data.content.bannerText;
                document.getElementById('bannerVisible').checked = customization.data.content.bannerVisible;
                document.getElementById('footerText').value = customization.data.content.footerText;

                customization.saveToServer({ content: customization.data.content });
                toast.success('Đã khôi phục nội dung mặc định');
            }
        );
    },

    saveFeatures: () => {
        const features = {
            history: document.getElementById('featureHistory').checked,
            chat: document.getElementById('featureChat').checked,
            twoFA: document.getElementById('feature2FA').checked,
            withdraw: document.getElementById('featureWithdraw').checked,
            gifts: document.getElementById('featureGifts').checked
        };

        customization.data.features = features;
        customization.saveToServer({ features });
    },

    saveScripts: () => {
        const scripts = {
            css: document.getElementById('customCSS').value,
            js: document.getElementById('customJS').value
        };

        customization.data.scripts = scripts;
        customization.saveToServer({ scripts });
    },

    testScripts: () => {
        try {
            const css = document.getElementById('customCSS').value;
            const js = document.getElementById('customJS').value;

            // Test CSS
            if (css.trim()) {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
                toast.success('CSS test thành công');
                setTimeout(() => style.remove(), 2000);
            }

            // Test JS
            if (js.trim()) {
                // Use Function instead of eval for safety
                new Function(js)();
                toast.success('JavaScript test thành công');
            }

            if (!css.trim() && !js.trim()) {
                toast.info('Vui lòng nhập CSS hoặc JavaScript');
            }
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
        }
    },

    clearScripts: () => {
        NotificationModal.confirm(
            'Xác nhận',
            'Bạn có chắc muốn xóa tất cả custom scripts?',
            () => {
                document.getElementById('customCSS').value = '';
                document.getElementById('customJS').value = '';
                customization.data.scripts = { css: '', js: '' };
                customization.saveToServer({ scripts: { css: '', js: '' } });
                toast.success('Đã xóa tất cả custom scripts');
            }
        );
    },

    saveToServer: async (settings) => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Đã lưu cài đặt thành công');
            } else {
                toast.error(result.message || 'Lỗi khi lưu cài đặt');
            }
        } catch (error) {
            toast.error('Không thể kết nối đến server');
            console.error('Save settings error:', error);
        }
    }
};

// ==================== TOOLS ====================
const tools = {
    init: () => {
        const runCleanupBtn = document.getElementById('runCleanupBtn');
        const autoCleanupToggle = document.getElementById('autoCleanupToggle');

        runCleanupBtn?.addEventListener('click', () => {
            NotificationModal.confirm(
                'Xác nhận',
                'Bạn có chắc muốn chạy cleanup ngay bây giờ?',
                () => {
                    tools.runCleanup();
                }
            );
        });

        autoCleanupToggle?.addEventListener('change', (e) => {
            if (e.target.checked) {
                toast.success('Đã bật tự động cleanup');
            } else {
                toast.info('Đã tắt tự động cleanup');
            }
        });
    },

    runCleanup: () => {
        toast.info('Đang chạy cleanup...');
        
        // Simulate cleanup process
        setTimeout(() => {
            toast.success('Cleanup hoàn tất! Đã xóa 0 phiên cũ.');
        }, 2000);
    },
};

// Session updates are refreshed by explicit triggers instead of interval polling.
const sessionPoller = {
    isRunning: false,
    refreshTimer: null,
    isBoundRefreshTriggers: false,
    lastUpdateTime: {},

    init: () => {
        sessionPoller.bindRefreshTriggers();
        sessionPoller.requestRefresh('init');
    },

    startPolling: () => {
        sessionPoller.bindRefreshTriggers();
        sessionPoller.requestRefresh('manual-start');
    },

    stopPolling: () => {
        if (sessionPoller.refreshTimer) {
            clearTimeout(sessionPoller.refreshTimer);
            sessionPoller.refreshTimer = null;
        }
        sessionPoller.isRunning = false;
    },

    bindRefreshTriggers: () => {
        if (sessionPoller.isBoundRefreshTriggers) return;
        sessionPoller.isBoundRefreshTriggers = true;
        sessionPoller.isRunning = true;

        window.addEventListener('focus', () => {
            sessionPoller.requestRefresh('window-focus');
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) sessionPoller.requestRefresh('tab-visible');
        });

        window.addEventListener('admin:sessions:changed', () => {
            sessionPoller.requestRefresh('sessions-changed-event');
        });
    },

    requestRefresh: (_reason = 'event') => {
        if (!sessionPoller.isRunning) return;
        if (sessionPoller.refreshTimer) return;
        sessionPoller.refreshTimer = setTimeout(() => {
            sessionPoller.refreshTimer = null;
            sessionPoller.pollSessions();
        }, 120);
    },

    pollSessions: () => {
        fetch('/api/sessions')
            .then(res => {
                if (!res.ok) {
                    console.warn(`⚠️ [Poll] HTTP ${res.status}: ${res.statusText}`);
                    throw new Error(`HTTP ${res.status}`);
                }
                // Handle both JSON and text responses
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return res.json();
                } else {
                    return res.text().then(text => {
                        console.warn(`⚠️ [Poll] Non-JSON response: ${text}`);
                        throw new Error('Non-JSON response from server');
                    });
                }
            })
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    // Check for updates in sessions
                    data.data.forEach(newSession => {
                        const oldSession = sessions.data.find(s => 
                            (s.session_code || s.code) === (newSession.session_code || newSession.code)
                        );

                        if (oldSession) {
                            // Check if box selection was updated
                            if (newSession.player_selected_box && !oldSession.player_selected_box) {
                                sessionPoller.handleNewBoxSelection(newSession);
                            }

                            // Check if form was submitted
                            if (newSession.is_form_submitted && !oldSession.is_form_submitted) {
                                sessionPoller.handleFormSubmitted(newSession);
                            }
                        }
                    });

                    // Update sessions data
                    sessions.data = data.data;
                    sessions.render();
                }
            })
            .catch(err => console.warn('⚠️ [Poll] Session polling error:', err.message));
    },

    handleNewBoxSelection: (session) => {
        // Show real-time indicator
        const sessionCode = session.session_code || session.code;
        const sessionCard = document.querySelector(`[data-session-code="${sessionCode}"]`);
        
        if (sessionCard) {
            const statusEl = sessionCard.querySelector('.session-status');
            if (statusEl) {
                statusEl.innerHTML = `
                    <span class="status-badge selected" style="animation: pulse 0.6s ease-in-out;">
                        ✅ Đã chọn Hộp #${session.player_selected_box}
                    </span>
                    <span class="status-timestamp">${new Date(session.player_selected_at).toLocaleTimeString('vi-VN')}</span>
                    ${session.player_name ? `<span class="player-name">Người chơi: ${session.player_name}</span>` : ''}
                `;
                sessionCard.classList.add('has-selection');
            }
        }

        // Show toast notification
        toast.info(`✅ Hộp #${session.player_selected_box} được chọn bởi ${session.player_name || 'người chơi'}`);
    },

    handleFormSubmitted: (session) => {
        // Update UI to show form submitted
        const sessionCode = session.session_code || session.code;
        const sessionCard = document.querySelector(`[data-session-code="${sessionCode}"]`);
        
        if (sessionCard) {
            sessionCard.classList.add('form-submitted');
        }

        toast.success(`📋 Mẫu được gửi cho ${session.player_name || 'người chơi'}`);
    }
};

// ==================== NOTIFICATIONS MANAGER ====================
const notifications = {
    data: [],
    currentPage: 1,
    itemsPerPage: 10,
    isLoading: false,
    
    getTotalPages() {
        return Math.ceil(this.data.length / this.itemsPerPage);
    },
    
    getPaginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.data.slice(start, start + this.itemsPerPage);
    },

    async fetch() {
        try {
            const response = await fetch('/api/notifications');
            
            if (!response.ok) {
                console.warn(`⚠️ Notifications HTTP ${response.status}: ${response.statusText}`);
                return;
            }
            
            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.warn(`⚠️ Notifications: Non-JSON response (${text.substring(0, 50)})`);
                return;
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.data = result.data || [];
                this.currentPage = 1; // Reset to first page when fetching new data
                this.updateBadge(result.unreadCount);
                this.render();
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.warn('⚠️ Notifications: JSON parse error (likely non-JSON response):', error.message);
            } else {
                console.error('❌ Error fetching notifications:', error.message);
            }
        }
    },

    updateBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    getTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Vừa xong';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    },

    getIconClass(type) {
        const icons = {
            session: 'fa-gamepad',
            withdrawal: 'fa-money-bill-wave',
            gift: 'fa-gift',
            user: 'fa-user-plus',
            system: 'fa-info-circle'
        };
        return icons[type] || 'fa-bell';
    },

    getColorClass(color) {
        const colors = {
            blue: 'notification-icon blue',
            warning: 'notification-icon warning',
            success: 'notification-icon green',
            danger: 'notification-icon red',
            info: 'notification-icon blue'
        };
        return colors[color] || 'notification-icon blue';
    },

    render() {
        const container = document.getElementById('notificationList');
        if (!container) return;

        if (this.data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                    <i class="fas fa-inbox" style="font-size: 2em; margin-bottom: 10px;"></i>
                    <p>Không có thông báo mới</p>
                </div>
            `;
            return;
        }

        const paginatedData = this.getPaginatedData();
        container.innerHTML = paginatedData.map(notification => {
            const colorMap = {
                blue: 'blue',
                warning: 'warning',
                success: 'green',
                danger: 'red'
            };

            return `
                <div class="notification-item ${notification.read ? '' : 'unread'}" style="opacity: ${notification.read ? '0.6' : '1'}; cursor: pointer;" onclick="notifications.markAsRead('${notification.id}')">
                    <div class="${this.getColorClass(colorMap[notification.color])}">
                        <i class="fas ${this.getIconClass(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-text">${notification.message}</div>
                        <div class="notification-time">${this.getTimeAgo(notification.timestamp)} ${notification.read ? '• Đã đọc' : ''}</div>
                    </div>
                    ${!notification.read ? '<div class="notification-dot"></div>' : ''}
                </div>
            `;
        }).join('');
        
        this.renderPagination();
    },
    
    renderPagination() {
        const totalPages = this.getTotalPages();
        const paginationContainer = document.getElementById('notificationPagination');
        
        if (!paginationContainer || totalPages <= 1) return;
        
        let paginationHTML = '<div style="display: flex; gap: 8px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); justify-content: center; flex-wrap: wrap;\">';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="notifications.goToPage(${this.currentPage - 1})" style="padding: 6px 10px; background: rgba(99, 102, 241, 0.3); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">← Trước</button>`;
        }
        
        // Calculate page numbers to show
        const maxVisible = 7;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        // Show first page if not visible
        if (startPage > 1) {
            paginationHTML += `<button onclick="notifications.goToPage(1)" style="padding: 6px 10px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span style="color: rgba(255,255,255,0.5); padding: 6px 8px;\">...</span>`;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            paginationHTML += `<button onclick="notifications.goToPage(${i})" style="padding: 6px 10px; background: ${isActive ? '#6366f1' : 'rgba(99, 102, 241, 0.2)'}; border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px; font-weight: ${isActive ? 'bold' : 'normal'};\">${i}</button>`;
        }
        
        // Show last page if not visible
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span style="color: rgba(255,255,255,0.5); padding: 6px 8px;\">...</span>`;
            }
            paginationHTML += `<button onclick="notifications.goToPage(${totalPages})" style="padding: 6px 10px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">${totalPages}</button>`;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="notifications.goToPage(${this.currentPage + 1})" style="padding: 6px 10px; background: rgba(99, 102, 241, 0.3); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">Sau →</button>`;
        }
        
        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    },
    
    goToPage(pageNum) {
        const totalPages = this.getTotalPages();
        if (pageNum >= 1 && pageNum <= totalPages) {
            this.currentPage = pageNum;
            this.render();
            // Scroll to top of notification list
            const container = document.getElementById('notificationList');
            if (container) {
                container.scrollTop = 0;
            }
        }
    },

    markAsRead(id) {
        const notification = this.data.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            // Update badge
            const unreadCount = this.data.filter(n => !n.read).length;
            this.updateBadge(unreadCount);
            // Re-render current page
            this.render();
        }
    },

    startPolling() {
        this.bindRefreshTriggers();
        this.requestRefresh('manual-start');
    },

    stopPolling() {
        if (state.notificationTimer) {
            clearTimeout(state.notificationTimer);
            state.notificationTimer = null;
        }
    },

    bindRefreshTriggers() {
        if (this._hasRefreshBindings) return;
        this._hasRefreshBindings = true;

        window.addEventListener('focus', () => this.requestRefresh('window-focus'));
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) this.requestRefresh('tab-visible');
        });
        window.addEventListener('admin:notifications:changed', () => this.requestRefresh('notifications-changed-event'));
    },

    requestRefresh(_reason = 'event') {
        if (state.notificationTimer) return;
        state.notificationTimer = setTimeout(() => {
            state.notificationTimer = null;
            this.fetch();
        }, 120);
    },

    init() {
        this.startPolling();
    }
};

// ==================== TOPBAR ACTIONS ====================
const topbar = {
    init: () => {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn?.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            
            setTimeout(() => {
                icon.style.animation = '';
                toast.show('Dữ liệu đã được làm mới', 'success');
                
                // Re-render current tab
                switch (state.currentTab) {
                    case 'sessions':
                        sessions.render();
                        break;
                    case 'withdrawals':
                        withdrawals.fetch();
                        break;
                    case 'gifts':
                        giftExchanges.fetch();
                        break;
                    case 'users':
                        users.render();
                        break;
                }
            }, 1000);
        });

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        const closeNotificationPanel = document.getElementById('closeNotificationPanel');
        const markAllAsRead = document.getElementById('markAllAsRead');

        notificationBtn?.addEventListener('click', () => {
            state.notificationPanelOpen = !state.notificationPanelOpen;
            notificationPanel?.classList.toggle('active');
            if (state.notificationPanelOpen) {
                notifications.fetch();
            }
        });

        closeNotificationPanel?.addEventListener('click', () => {
            state.notificationPanelOpen = false;
            notificationPanel?.classList.remove('active');
        });

        markAllAsRead?.addEventListener('click', () => {
            notifications.data.forEach(n => n.read = true);
            notifications.render();
            notifications.updateBadge(0);
            toast.show('Đã đánh dấu tất cả là đã đọc', 'success');
        });

        // Theme toggle
        const themeBtn = document.getElementById('themeBtn');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeBtn?.addEventListener('click', () => {
            const htmlElement = document.documentElement;
            const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update icon
            const icon = themeBtn.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            
            toast.show(`Đã chuyển sang chế độ ${theme === 'dark' ? 'tối' : 'sáng'}`, 'info');
        });

        // Initialize theme icon
        if (currentTheme === 'light') {
            const icon = themeBtn?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }

        // Auto refresh toggle
        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        autoRefreshToggle?.addEventListener('change', (e) => {
            state.autoRefresh = e.target.checked;
            
            if (state.autoRefresh) {
                topbar.startAutoRefresh();
                toast.show('Đã bật tự động làm mới', 'success');
            } else {
                topbar.stopAutoRefresh();
                toast.show('Đã tắt tự động làm mới', 'info');
            }
        });

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = globalSearch.value.trim();
                    if (query) {
                        toast.show(`Tìm kiếm: ${query}`, 'info');
                        // Clear search after showing message
                        setTimeout(() => {
                            globalSearch.value = '';
                        }, 500);
                    }
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                globalSearch?.focus();
                toast.show('Tìm kiếm toàn cầu', 'info');
            }

            // Ctrl/Cmd + R for refresh
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                refreshBtn?.click();
            }

            // Escape to close notification panel
            if (e.key === 'Escape' && state.notificationPanelOpen) {
                closeNotificationPanel?.click();
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', async () => {
            NotificationModal.confirm(
                'Xác nhận',
                'Bạn có chắc chắn muốn đăng xuất?',
                async () => {
                    try {
                        const response = await fetch('/api/admin/logout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        
                        if (response.ok) {
                            toast.show('Đăng xuất thành công!', 'success');
                            setTimeout(() => {
                                window.location.href = '/admin/login';
                            }, 1500);
                        } else {
                            toast.show('Lỗi đăng xuất', 'error');
                        }
                    } catch (error) {
                        console.error('Logout error:', error);
                        toast.show('Lỗi kết nối máy chủ', 'error');
                    }
                }
            );
        });

        // Click outside to close notification
        document.addEventListener('click', (e) => {
            if (!notificationPanel?.contains(e.target) && !notificationBtn?.contains(e.target)) {
                if (state.notificationPanelOpen) {
                    closeNotificationPanel?.click();
                }
            }
        });
    },

    startAutoRefresh: () => {
        topbar.bindAutoRefreshTriggers();
        topbar.requestAutoRefresh('toggle-on');
    },

    stopAutoRefresh: () => {
        if (state.autoRefreshTimer) {
            clearTimeout(state.autoRefreshTimer);
            state.autoRefreshTimer = null;
        }
    },

    bindAutoRefreshTriggers: () => {
        if (state.autoRefreshBindingsReady) return;
        state.autoRefreshBindingsReady = true;

        window.addEventListener('focus', () => {
            if (state.autoRefresh) topbar.requestAutoRefresh('window-focus');
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && state.autoRefresh) topbar.requestAutoRefresh('tab-visible');
        });

        window.addEventListener('admin:data:refresh', () => {
            if (state.autoRefresh) topbar.requestAutoRefresh('external-event');
        });
    },

    requestAutoRefresh: (_reason = 'event') => {
        if (!state.autoRefresh) return;
        if (state.autoRefreshTimer) return;

        state.autoRefreshTimer = setTimeout(() => {
            state.autoRefreshTimer = null;
            switch (state.currentTab) {
                case 'sessions':
                    sessions.render();
                    break;
                case 'withdrawals':
                    withdrawals.fetch();
                    break;
                case 'gifts':
                    giftExchanges.fetch();
                    break;
                case 'users':
                    users.render();
                    break;
            }
        }, 150);
    },
};

// ==================== BUTTON ACTIONS ====================
const buttonActions = {
    init: () => {
        // Export sessions
        const exportSessionsBtn = document.getElementById('exportSessionsBtn');
        exportSessionsBtn?.addEventListener('click', () => {
            toast.show('Đang xuất dữ liệu phiên chơi...', 'info');
            // TODO: Implement export functionality
            setTimeout(() => {
                toast.show('Xuất dữ liệu thành công', 'success');
            }, 1500);
        });

        // Delete all sessions
        const deleteAllBtn = document.getElementById('deleteAllSessionsBtn');
        deleteAllBtn?.addEventListener('click', () => {
            NotificationModal.confirm(
                'Xác nhận xóa',
                'Bạn có chắc muốn xóa TẤT CẢ phiên? Hành động này không thể hoàn tác!',
                () => {
                    toast.show('Đang xóa tất cả phiên...', 'warning');
                    setTimeout(() => {
                        toast.show('Đã xóa tất cả phiên thành công', 'success');
                    }, 1500);
                }
            );
        });

        // Upload file
        const uploadFileBtn = document.getElementById('uploadFileBtn');
        uploadFileBtn?.addEventListener('click', () => {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.onchange = (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    toast.show(`Đang upload ${files.length} file...`, 'info');
                    setTimeout(() => {
                        toast.show(`Upload ${files.length} file thành công`, 'success');
                    }, 1500);
                }
            };
            fileInput.click();
        });
    },
};

// ==================== ANIMATIONS ====================
const animations = {
    init: () => {
        // Add fade-in animation to cards
        if (typeof IntersectionObserver === 'undefined') {
            // Fallback for old WebViews: just show cards immediately
            document.querySelectorAll('.stat-card, .data-card, .user-card, .file-card').forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
            return;
        }
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.stat-card, .data-card, .user-card, .file-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(card);
        });
    },
};

// ==================== INITIALIZATION ====================
const app = {
    init: () => {
        // Show loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        
        // Initialize all modules
        sidebar.init();
        navigation.init();
        topbar.init();
        buttonActions.init();
        modal.init();
        sessions.init();
        users.init();
        console.log('🔵 About to call files.init()...');
        console.log('🔵 files module:', typeof files, files ? 'exists' : 'undefined');
        if (typeof files !== 'undefined' && typeof files.init === 'function') {
            files.init();
            console.log('🔵 files.init() called successfully');
        } else {
            console.error('❌ files.init() NOT available!');
        }
        customization.init();
        tools.init();

        // Hide loading screen
        setTimeout(() => {
            loadingScreen?.classList.add('hidden');
            
            // Show welcome toast
            setTimeout(() => {
                toast.success('Chào mừng trở lại, admin999!', 'Đăng nhập thành công');
            }, 300);

            // Initialize notifications
            notifications.init();

            // 🔥 NEW: Initialize session polling for real-time updates
            sessionPoller.init();

            // Initialize animations
            animations.init();
        }, 1000);
    },
};

// ==================== START APPLICATION ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', app.init);
} else {
    app.init();
}

// ==================== MODAL MANAGEMENT ====================
const modal = {
    currentEditingSession: null,
    selectedIcons: { 1: '🎁', 2: '🎁', 3: '🎁' },
    boxPositions: [1, 2, 3],

    init: () => {
        modal.setupEventListeners();
        modal.setupDisplayTypeToggle();
        modal.setupIconSelection();
        modal.setupTemplates();
        modal.setupBoxOrder();
    },

    setupEventListeners: () => {
        // Open modal button
        const createSessionBtn = document.getElementById('createSessionBtn');
        createSessionBtn?.addEventListener('click', () => modal.openCreate());

        // Close modal buttons
        document.getElementById('closeSessionModal')?.addEventListener('click', () => modal.close());
        document.getElementById('cancelSessionBtn')?.addEventListener('click', () => modal.close());
        
        // Submit button
        document.getElementById('submitSessionBtn')?.addEventListener('click', () => modal.submitSession());

        // Generate code button
        document.getElementById('generateCodeBtn')?.addEventListener('click', () => modal.generateCode());

        // Delete confirmation modal
        document.getElementById('closeConfirmModal')?.addEventListener('click', () => modal.closeConfirm());
        document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => modal.closeConfirm());

        // Preview modal
        document.getElementById('closePreviewModal')?.addEventListener('click', () => modal.closePreviewModal());
        document.getElementById('closePreviewBtn')?.addEventListener('click', () => modal.closePreviewModal());
        document.getElementById('openGamePreviewBtn')?.addEventListener('click', () => {
            if (modal.previewSessionCode) {
                window.open(`/play/${modal.previewSessionCode}`, '_blank');
            }
        });

        // Close modals with overlay click
        document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
            if (document.getElementById('sessionModal')?.classList.contains('show')) {
                modal.close();
            } else if (document.getElementById('confirmDeleteModal')?.classList.contains('show')) {
                modal.closeConfirm();
            } else if (document.getElementById('previewModal')?.classList.contains('show')) {
                modal.closePreviewModal();
            }
        });
    },

    setupTemplates: () => {
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const template = btn.getAttribute('data-template');
                
                // Remove active state from all buttons
                document.querySelectorAll('.template-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Add active state to clicked button
                btn.classList.add('active');
                
                // Apply template data
                modal.applyTemplate(template);
            });
        });
    },

    applyTemplate: (template) => {
        const templates = {
            'all-vip': {
                prize_1: 'iPhone 15 Pro Max',
                prize_1_status: 'VIP',
                prize_1_description: 'Điện thoại cao cấp',
                prize_2: 'MacBook Pro M3',
                prize_2_status: 'VIP',
                prize_2_description: 'Laptop hiệu năng cao',
                prize_3: 'AirPods Pro Max',
                prize_3_status: 'VIP',
                prize_3_description: 'Tai nghe premium'
            },
            'two-vip-one-normal': {
                prize_1: 'iPhone 15',
                prize_1_status: 'VIP',
                prize_1_description: 'Điện thoại cao cấp',
                prize_2: 'iPad Pro',
                prize_2_status: 'VIP',
                prize_2_description: 'Máy tính bảng',
                prize_3: 'Samsung Galaxy Watch',
                prize_3_status: 'NORMAL',
                prize_3_description: 'Đồng hồ thông minh'
            },
            'mixed': {
                prize_1: 'Sony WH-1000XM5',
                prize_1_status: 'VIP',
                prize_1_description: 'Tai nghe chống ồn',
                prize_2: 'JBL Speaker',
                prize_2_status: 'NORMAL',
                prize_2_description: 'Loa Bluetooth',
                prize_3: 'Voucher 100K',
                prize_3_status: 'UNLUCKY',
                prize_3_description: 'Coupon giảm giá'
            }
        };

        const data = templates[template] || {};
        Object.keys(data).forEach(key => {
            const el = document.querySelector(`[name="${key}"]`);
            if (el) {
                el.value = data[key];
                // Trigger change event for status fields to update badges
                if (key.endsWith('_status')) {
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
    },

    setupDisplayTypeToggle: () => {
        // Status change handler - update badge
        document.querySelectorAll('[name^="prize_"][name$="_status"]').forEach(select => {
            select.addEventListener('change', (e) => {
                const prizeNum = select.name.match(/prize_(\d+)/)[1];
                const parent = select.closest('.prize-box');
                const badge = parent?.querySelector('.prize-badge span');
                const icon = parent?.querySelector('.prize-badge i');
                
                if (badge) {
                    const status = e.target.value;
                    badge.textContent = status;
                    
                    // Update icon
                    if (icon) {
                        if (status === 'VIP') {
                            icon.className = 'fas fa-crown';
                        } else if (status === 'UNLUCKY') {
                            icon.className = 'fas fa-bomb';
                        } else {
                            icon.className = 'fas fa-check';
                        }
                    }
                    
                    // Update badge style
                    const badgeEl = parent?.querySelector('.prize-badge');
                    if (badgeEl) {
                        badgeEl.className = 'prize-badge';
                        if (status === 'VIP') {
                            badgeEl.classList.add('vip');
                        } else if (status === 'UNLUCKY') {
                            badgeEl.classList.add('unlucky');
                        } else {
                            badgeEl.classList.add('normal');
                        }
                    }
                }
            });
        });

        // Display type toggle
        document.querySelectorAll('.radio-group').forEach(group => {
            group.addEventListener('change', (e) => {
                if (e.target.type === 'radio') {
                    const prizeNum = group.getAttribute('data-prize');
                    const parent = group.closest('.prize-content');
                    
                    if (parent) {
                        const iconGroup = parent.querySelector(`.icon-group[data-prize="${prizeNum}"]`);
                        const imageGroup = parent.querySelector(`.image-group[data-prize="${prizeNum}"]`);

                        if (e.target.value === 'icon') {
                            if (iconGroup) {
                                iconGroup.classList.remove('hidden');
                                iconGroup.style.display = 'block';
                            }
                            if (imageGroup) {
                                imageGroup.classList.add('hidden');
                                imageGroup.style.display = 'none';
                            }
                        } else if (e.target.value === 'image') {
                            if (imageGroup) {
                                imageGroup.classList.remove('hidden');
                                imageGroup.style.display = 'block';
                            }
                            if (iconGroup) {
                                iconGroup.classList.add('hidden');
                                iconGroup.style.display = 'none';
                            }
                        }
                    }
                }
            });
        });

        // Cash toggle handlers - display input
        document.querySelectorAll('.cash-toggle').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const prizeNum = checkbox.getAttribute('data-prize');
                const parent = checkbox.closest('.prize-content');
                const cashInputGroup = parent?.querySelector(`.cash-input-group[data-prize="${prizeNum}"]`);
                
                if (cashInputGroup) {
                    if (e.target.checked) {
                        cashInputGroup.classList.remove('hidden');
                        cashInputGroup.style.display = 'block';
                    } else {
                        cashInputGroup.classList.add('hidden');
                        cashInputGroup.style.display = 'none';
                    }
                }
            });
        });

        // Upload button handlers
        document.querySelectorAll('.btn-upload-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prizeNum = btn.getAttribute('data-prize');
                const fileInput = document.querySelector(`input[name="prize_${prizeNum}_image_file"]`);
                fileInput?.click();
            });
        });

        // File input change handlers
        document.querySelectorAll('.image-file-input').forEach(fileInput => {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = (event) => {
                        const prizeNum = fileInput.name.match(/prize_(\d+)/)[1];
                        const urlInput = document.querySelector(`input[name="prize_${prizeNum}_image_url"]`);
                        if (urlInput) {
                            urlInput.value = event.target.result;
                            toast.success('Ảnh được tải lên thành công!');
                        }
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        });
    },

    setupIconSelection: () => {
        document.querySelectorAll('.icon-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = btn.getAttribute('data-icon');
                const grid = btn.closest('.icon-grid-small');
                const iconGroup = btn.closest('.icon-group');
                const prizeNum = iconGroup?.getAttribute('data-prize');

                if (prizeNum) {
                    grid.querySelectorAll('.icon-btn-small').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    modal.selectedIcons[prizeNum] = icon;
                    
                    // Update preview immediately
                    const previewSpan = document.getElementById(`previewPrize${prizeNum}Icon`);
                    if (previewSpan) {
                        previewSpan.textContent = icon;
                        previewSpan.style.backgroundImage = 'none';
                    }
                }
            });
        });
    },

    setupBoxOrder: () => {
        // Remove old listeners
        document.querySelectorAll('.box-order-display').forEach(display => {
            const upBtn = display.querySelector('.btn-sm-icon:first-child');
            const downBtn = display.querySelector('.btn-sm-icon:last-child');
            
            // Clone to remove all listeners
            if (upBtn) {
                const newUpBtn = upBtn.cloneNode(true);
                upBtn.parentNode.replaceChild(newUpBtn, upBtn);
            }
            if (downBtn) {
                const newDownBtn = downBtn.cloneNode(true);
                downBtn.parentNode.replaceChild(newDownBtn, downBtn);
            }
        });

        // Add new listeners
        document.querySelectorAll('.box-order-display').forEach((display, index) => {
            const upBtn = display.querySelector('.btn-sm-icon:first-child');
            const downBtn = display.querySelector('.btn-sm-icon:last-child');

            if (upBtn) {
                upBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (index > 0) {
                        // Swap with previous position
                        [modal.boxPositions[index], modal.boxPositions[index - 1]] = 
                        [modal.boxPositions[index - 1], modal.boxPositions[index]];
                        modal.updateBoxOrderDisplay();
                    }
                });
            }

            if (downBtn) {
                downBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (index < 2) {
                        // Swap with next position
                        [modal.boxPositions[index], modal.boxPositions[index + 1]] = 
                        [modal.boxPositions[index + 1], modal.boxPositions[index]];
                        modal.updateBoxOrderDisplay();
                    }
                });
            }
        });
    },

    updateBoxOrderDisplay: () => {
        document.querySelectorAll('.box-order-display').forEach((display, index) => {
            const value = modal.boxPositions[index];
            display.querySelector('.box-order-value').textContent = `Hộp ${value}`;

            // Update button states
            const upBtn = display.querySelector('.btn-sm-icon:first-child');
            const downBtn = display.querySelector('.btn-sm-icon:last-child');

            upBtn.disabled = index === 0;
            downBtn.disabled = index === 2;
        });

        document.getElementById('boxPositions').value = JSON.stringify(modal.boxPositions);
        
        // Re-setup button listeners with new index values
        modal.setupBoxOrder();
    },

    openCreate: () => {
        modal.currentEditingSession = null;
        modal.selectedIcons = { 1: '🎁', 2: '🎁', 3: '🎁' };
        document.getElementById('modalTitle').textContent = 'Tạo phiên chơi mới';
        document.getElementById('sessionForm').reset();
        modal.generateCode();
        modal.boxPositions = [1, 2, 3];
        modal.updateBoxOrderDisplay();
        
        // Reset icon selection
        document.querySelectorAll('.icon-btn-small').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.getAttribute('data-icon') === '🎁') {
                btn.classList.add('selected');
            }
        });
        
        // Reset preview icons
        document.querySelectorAll('[id^="previewPrize"][id$="Icon"]').forEach(span => {
            span.textContent = '🎁';
            span.style.backgroundImage = 'none';
        });
        
        modal.open();
    },

    openEdit: (sessionCode) => {
        // Fetch session data
        fetch(`/api/sessions/${sessionCode}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    modal.currentEditingSession = data.data;
                    document.getElementById('modalTitle').textContent = 'Chỉnh sửa phiên chơi';
                    modal.populateForm(data.data);
                    modal.open();
                } else {
                    toast.error('Không thể tải dữ liệu phiên');
                }
            })
            .catch(err => {
                console.error(err);
                toast.error('Lỗi kết nối');
            });
    },

    cloneSession: (sessionCode) => {
        fetch(`/api/sessions/${sessionCode}`)
            .then(res => res.json())
            .then(data => {
                if (!data.success || !data.data) {
                    toast.error('Không thể tải dữ liệu phiên để clone');
                    return;
                }

                modal.currentEditingSession = null;
                modal.selectedIcons = { 1: '🎁', 2: '🎁', 3: '🎁' };
                document.getElementById('sessionForm').reset();
                document.getElementById('modalTitle').textContent = `Clone phiên ${sessionCode}`;

                modal.populateForm(data.data);
                modal.generateCode();
                modal.open();

                toast.success('Đã nạp dữ liệu phiên. Hãy lưu để tạo phiên mới với mã mới.');
            })
            .catch((err) => {
                console.error(err);
                toast.error('Lỗi kết nối khi clone phiên');
            });
    },

    populateForm: (session) => {
        for (let i = 1; i <= 3; i++) {
            document.querySelector(`[name="prize_${i}"]`).value = session[`prize_${i}`] || '';
            document.querySelector(`[name="prize_${i}_description"]`).value = session[`prize_${i}_description`] || '';
            document.querySelector(`[name="prize_${i}_status"]`).value = session[`prize_${i}_status`] || 'NORMAL';
            document.querySelector(`[name="prize_${i}_is_special"]`).checked = session[`prize_${i}_is_special`] || false;
            document.querySelector(`[name="prize_${i}_cash"]`).checked = session[`prize_${i}_cash`] || false;
            
            // Set cash amount
            const cashAmountInput = document.querySelector(`[name="prize_${i}_cash_amount"]`);
            if (cashAmountInput && session[`prize_${i}_cash_amount`]) {
                cashAmountInput.value = session[`prize_${i}_cash_amount`];
            }
            
            // Set image URL
            const imageUrlInput = document.querySelector(`[name="prize_${i}_image_url"]`);
            if (imageUrlInput && session[`prize_${i}_image_url`]) {
                imageUrlInput.value = session[`prize_${i}_image_url`];
            }
            
            // Set icon and select the corresponding button
            const icon = session[`prize_${i}_icon`] || '🎁';
            modal.selectedIcons[i] = icon;
            
            // Mark the corresponding icon button as selected
            const iconGroup = document.querySelector(`.icon-group[data-prize="${i}"]`);
            if (iconGroup) {
                const grid = iconGroup.querySelector('.icon-grid-small');
                if (grid) {
                    const buttons = grid.querySelectorAll('.icon-btn-small');
                    buttons.forEach(btn => {
                        if (btn.getAttribute('data-icon') === icon) {
                            btn.classList.add('selected');
                        } else {
                            btn.classList.remove('selected');
                        }
                    });
                }
            }
        }

        document.getElementById('sessionCode').value = session.session_code || '';
        document.getElementById('isActive').checked = session.is_active !== false;

        // Set box positions
        if (session.box_positions) {
            modal.boxPositions = session.box_positions;
            modal.updateBoxOrderDisplay();
        }
    },

    generateCode: () => {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        document.getElementById('sessionCode').value = code;
    },

    submitSession: async () => {
        const sessionForm = document.getElementById('sessionForm');
        const formData = new FormData(sessionForm);

        // Validation
        const sessionCode = formData.get('session_code');
        const prize1 = formData.get('prize_1');
        const prize2 = formData.get('prize_2');
        const prize3 = formData.get('prize_3');

        if (!sessionCode || sessionCode.trim() === '') {
            toast.error('Vui lòng nhập mã phiên');
            return;
        }

        if (!prize1 || prize1.trim() === '') {
            toast.error('Vui lòng nhập tên phần thưởng cho hộp 1');
            return;
        }

        if (!prize2 || prize2.trim() === '') {
            toast.error('Vui lòng nhập tên phần thưởng cho hộp 2');
            return;
        }

        if (!prize3 || prize3.trim() === '') {
            toast.error('Vui lòng nhập tên phần thưởng cho hộp 3');
            return;
        }

        const sessionData = {
            session_code: sessionCode,
            prize_1: prize1,
            prize_2: prize2,
            prize_3: prize3,
            prize_1_description: formData.get('prize_1_description') || '',
            prize_2_description: formData.get('prize_2_description') || '',
            prize_3_description: formData.get('prize_3_description') || '',
            prize_1_icon: modal.selectedIcons[1] || '🎁',
            prize_2_icon: modal.selectedIcons[2] || '🎁',
            prize_3_icon: modal.selectedIcons[3] || '🎁',
            prize_1_status: formData.get('prize_1_status') || 'NORMAL',
            prize_2_status: formData.get('prize_2_status') || 'NORMAL',
            prize_3_status: formData.get('prize_3_status') || 'NORMAL',
            prize_1_is_special: formData.get('prize_1_is_special') ? true : false,
            prize_2_is_special: formData.get('prize_2_is_special') ? true : false,
            prize_3_is_special: formData.get('prize_3_is_special') ? true : false,
            prize_1_cash: formData.get('prize_1_cash') ? true : false,
            prize_2_cash: formData.get('prize_2_cash') ? true : false,
            prize_3_cash: formData.get('prize_3_cash') ? true : false,
            prize_1_cash_amount: formData.get('prize_1_cash_amount') ? parseInt(formData.get('prize_1_cash_amount')) : null,
            prize_2_cash_amount: formData.get('prize_2_cash_amount') ? parseInt(formData.get('prize_2_cash_amount')) : null,
            prize_3_cash_amount: formData.get('prize_3_cash_amount') ? parseInt(formData.get('prize_3_cash_amount')) : null,
            prize_1_image_url: formData.get('prize_1_image_url') || null,
            prize_2_image_url: formData.get('prize_2_image_url') || null,
            prize_3_image_url: formData.get('prize_3_image_url') || null,
            is_active: formData.get('is_active') ? true : false,
            box_positions: modal.boxPositions
        };

        console.log('Submitting session data:', sessionData);

        try {
            const url = modal.currentEditingSession 
                ? `/api/sessions/${modal.currentEditingSession.session_code}`
                : '/api/sessions';
            
            const method = modal.currentEditingSession ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });

            const result = await response.json();

            if (result.success) {
                toast.success(modal.currentEditingSession ? 'Cập nhật phiên thành công' : 'Tạo phiên thành công');
                modal.close();
                sessions.init(); // Reload sessions
            } else {
                toast.error(result.message || 'Có lỗi xảy ra');
                console.error('API Error:', result);
            }
        } catch (err) {
            console.error('Submit Error:', err);
            toast.error('Lỗi kết nối: ' + err.message);
        }
    },

    deleteSession: (sessionCode) => {
        modal.deleteSessionCode = sessionCode;
        document.getElementById('confirmMessage').textContent = `Bạn có chắc chắn muốn xóa phiên chơi ${sessionCode}?`;
        modal.openConfirm();
    },

    confirmDelete: async () => {
        const sessionCode = modal.deleteSessionCode;

        try {
            const response = await fetch(`/api/sessions/${sessionCode}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Xóa phiên thành công');
                modal.closeConfirm();
                sessions.init(); // Reload sessions
            } else {
                toast.error(result.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi kết nối');
        }
    },

    open: () => {
        const modal = document.getElementById('sessionModal');
        const overlay = document.getElementById('modalOverlay');
        
        console.log('Opening modal...', { 
            modalElement: modal,
            overlayElement: overlay,
            modalClasses: modal?.className,
            overlayClasses: overlay?.className
        });

        modal?.classList.add('show');
        overlay?.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Verify
        setTimeout(() => {
            console.log('After open:', {
                modalHasShow: modal?.classList.contains('show'),
                overlayHasShow: overlay?.classList.contains('show'),
                modalDisplay: window.getComputedStyle(modal).display,
                overlayDisplay: window.getComputedStyle(overlay).display
            });
        }, 100);
    },

    close: () => {
        const modal = document.getElementById('sessionModal');
        const overlay = document.getElementById('modalOverlay');

        modal?.classList.remove('show');
        overlay?.classList.remove('show');
        document.body.style.overflow = '';
        modal.currentEditingSession = null;

        console.log('Modal closed');
    },

    openConfirm: () => {
        document.getElementById('confirmDeleteModal')?.classList.add('show');
        document.getElementById('modalOverlay')?.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    closeConfirm: () => {
        document.getElementById('confirmDeleteModal')?.classList.remove('show');
        document.getElementById('modalOverlay')?.classList.remove('show');
        document.body.style.overflow = '';
    },

    openPreview: (sessionCode) => {
        // Fetch session data
        fetch(`/api/sessions/${sessionCode}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    modal.populatePreview(data.data);
                    modal.openPreviewModal();
                } else {
                    toast.error('Không thể tải dữ liệu phiên');
                }
            })
            .catch(err => {
                console.error(err);
                toast.error('Lỗi kết nối');
            });
    },

    populatePreview: (session) => {
        // Session Info
        document.getElementById('previewSessionCode').textContent = session.session_code || 'N/A';
        document.getElementById('previewSessionStatus').innerHTML = `
            <span class="status-tag ${session.is_active ? 'active' : 'inactive'}">
                ${session.is_active ? 'Hoạt động' : 'Không hoạt động'}
            </span>
        `;
        
        // Box Order
        let boxOrder = session.box_positions || [1, 2, 3];
        // Parse if it's a string
        if (typeof boxOrder === 'string') {
            try {
                boxOrder = JSON.parse(boxOrder);
            } catch (e) {
                boxOrder = [1, 2, 3];
            }
        }
        document.getElementById('previewBoxOrder').innerHTML = boxOrder.map(box => 
            `<span style="background: var(--primary); padding: 4px 8px; border-radius: 4px; font-weight: 600;">Hộp ${box}</span>`
        ).join('');
        
        document.getElementById('previewCreatedAt').textContent = session.createdAt || new Date().toLocaleString('vi-VN');
        
        
        for (let i = 1; i <= 3; i++) {
            const prizeElement = document.getElementById(`previewPrize${i}`);
            const statusColor = session[`prize_${i}_status`] === 'VIP' ? '#fbbf24' : 
                               session[`prize_${i}_status`] === 'UNLUCKY' ? '#ef4444' : '#3b82f6';
            
            prizeElement.style.borderLeftColor = statusColor;
            
            const prizeHTML = prizeElement.querySelector('[style*="display: flex"]');
            const nameDiv = prizeElement.querySelector('div:nth-child(2)');
            const descDiv = prizeElement.querySelector('div:nth-child(3)');
            const iconSpan = document.getElementById(`previewPrize${i}Icon`);
            const statusDiv = document.getElementById(`previewPrize${i}Status`);
            
            nameDiv.textContent = session[`prize_${i}`] || 'Phần thưởng ' + i;
            descDiv.textContent = session[`prize_${i}_description`] || '';
            
            
            if (session[`prize_${i}_image_url`]) {
                iconSpan.style.backgroundImage = `url(${session[`prize_${i}_image_url`]})`;
                iconSpan.style.backgroundSize = 'cover';
                iconSpan.style.backgroundPosition = 'center';
                iconSpan.style.display = 'inline-block';
                iconSpan.style.width = '50px';
                iconSpan.style.height = '50px';
                iconSpan.style.borderRadius = '4px';
                iconSpan.textContent = '';
            } else {
                iconSpan.textContent = session[`prize_${i}_icon`] || '🎁';
                iconSpan.style.backgroundImage = 'none';
            }
            
            statusDiv.textContent = session[`prize_${i}_status`] || 'NORMAL';
            statusDiv.style.backgroundColor = statusColor;
            
            
            if (session[`prize_${i}_cash`] && session[`prize_${i}_cash_amount`]) {
                descDiv.textContent += ` (Tiền mặt: ${session[`prize_${i}_cash_amount`].toLocaleString('vi-VN')} VNĐ)`;
            }
        }
        
        modal.previewSessionCode = sessionCode;
    },

    openPreviewModal: () => {
        document.getElementById('previewModal')?.classList.add('show');
        document.getElementById('modalOverlay')?.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    closePreviewModal: () => {
        document.getElementById('previewModal')?.classList.remove('show');
        document.getElementById('modalOverlay')?.classList.remove('show');
        document.body.style.overflow = '';
    }
};

document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => modal.confirmDelete());

const withdrawals = {
    data: [],
    currentFilter: {},

    async fetch(filters = {}) {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const url = `/api/withdrawals?${queryString}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                this.data = result.data;
                this.render();
                this.updateStats();
            } else {
                toast.show(result.message || 'Lỗi khi tải dữ liệu', 'error');
            }
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            toast.show('Lỗi khi kết nối server', 'error');
        }
    },

    render() {
        const container = document.getElementById('withdrawalsContainer');
        if (!container) return;

        if (this.data.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-inbox" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i>
                    <p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Chưa có yêu cầu rút tiền</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.data.map(item => {
            const statusBadges = {
                pending: { text: 'Chờ duyệt', color: '#fbbf24', bgColor: '#fef3c7' },
                approved: { text: 'Đã duyệt', color: '#10b981', bgColor: '#d1fae5' },
                rejected: { text: 'Từ chối', color: '#ef4444', bgColor: '#fee2e2' }
            };

            const statusInfo = statusBadges[item.status] || { text: item.status, color: '#6b7280', bgColor: '#f3f4f6' };
            const createdDate = new Date(item.created_at).toLocaleString('vi-VN');
            const approvedDate = item.approved_at ? new Date(item.approved_at).toLocaleString('vi-VN') : 'N/A';

            return `
                <div style="background: linear-gradient(135deg, #1a1f3a 0%, #0f172a 100%); border: 1px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1); color: #e0e0e0;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.3);">
                        <div>
                            <div style="font-size: 1.75rem; font-weight: bold; color: #6366f1; margin-bottom: 0.5rem;">${this.formatCurrency(item.amount)}</div>
                            <span style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; background: ${statusInfo.bgColor}; color: ${statusInfo.color};">
                                ${statusInfo.status === 'approved' ? '✓' : statusInfo.status === 'pending' ? '⏳' : '✕'} ${statusInfo.text}
                            </span>
                        </div>
                    </div>

                    <!-- User Info -->
                    <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                        <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">👤 Thông tin người dùng</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Họ tên</div>
                                <div style="color: #ffffff; font-weight: 500;">${item.user?.full_name || item.user?.username || 'N/A'}</div>
                            </div>
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Email</div>
                                <div style="color: #ffffff; font-weight: 500;">${item.user?.email || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Bank Info - Enhanced -->
                    <div style="background: rgba(99, 102, 241, 0.15); border-left: 4px solid #6366f1; margin-bottom: 1.5rem; padding: 1.2rem; border-radius: 0.5rem;">
                        <div style="font-size: 0.85rem; font-weight: 700; color: #6366f1; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;">🏦 Thông tin tài khoản ngân hàng</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.95rem;">
                            <!-- Bank Name -->
                            <div>
                                <div style="color: #a0aec0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Ngân hàng</div>
                                <div style="color: ${item.bank_name ? '#10b981' : '#ef4444'}; font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; gap: 6px;">
                                    ${item.bank_name ? `📊 ${item.bank_name}` : '❌ Chưa có thông tin'}
                                </div>
                            </div>
                            <!-- Account Number -->
                            <div>
                                <div style="color: #a0aec0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Số tài khoản</div>
                                <div style="color: ${item.account_number ? '#e0e0e0' : '#ef4444'}; font-weight: 700; font-size: 1.05rem; font-family: 'Courier New', 'Monaco', monospace; letter-spacing: 1px; word-break: break-all;">
                                    ${item.account_number || '❌ Chưa có thông tin'}
                                </div>
                            </div>
                        </div>
                        <!-- Account Holder Name -->
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(99, 102, 241, 0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                                <div style="flex: 1;">
                                    <div style="color: #a0aec0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Chủ tài khoản</div>
                                    <div style="color: ${item.account_holder_name ? '#e0e0e0' : '#ef4444'}; font-weight: 600; font-size: 1rem;">
                                        ${item.account_holder_name || '❌ Chưa có thông tin'}
                                    </div>
                                </div>
                                ${item.account_number ? `
                                <button onclick="copyBankInfo('${item.bank_name || ''}', '${item.account_number}', '${item.account_holder_name || ''}')" style="padding: 0.5rem 0.75rem; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none; color: #ffffff; font-weight: 600; border-radius: 0.375rem; cursor: pointer; font-size: 0.85rem; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(99, 102, 241, 0.3)';">
                                    <i class="fas fa-copy"></i> Sao chép
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Session Info -->
                    <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                        <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">🎮 Phiên chơi & Hộp quà</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Mã phiên</div>
                                <div style="color: #fbbf24; font-weight: 500; font-family: 'Courier New', monospace;">${item.session_code || item.game_session?.code || 'N/A'}</div>
                            </div>
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Hộp được chọn</div>
                                <div style="color: #10b981; font-weight: 500; font-size: 1.1rem;">
                                    ${item.selected_box_number ? `✅ Hộp #${item.selected_box_number}` : '❌ Chưa chọn'}
                                </div>
                            </div>
                            ${item.prize_name ? `
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Phần thưởng</div>
                                <div style="color: #ffffff; font-weight: 500;">${item.prize_name}</div>
                            </div>
                            ` : ''}
                            ${item.selected_at ? `
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Thời gian chọn</div>
                                <div style="color: #ffffff; font-weight: 500;">${new Date(item.selected_at).toLocaleString('vi-VN')}</div>
                            </div>
                            ` : ''}
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Đã mở</div>
                                <div style="color: #6366f1; font-weight: 500; font-size: 1.1rem;">2/3</div>
                            </div>
                        </div>
                    </div>

                    <!-- Timeline -->
                    <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                        <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">📅 Thời gian</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Yêu cầu lúc</div>
                                <div style="color: #ffffff; font-weight: 500;">${createdDate}</div>
                            </div>
                            <div>
                                <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Duyệt lúc</div>
                                <div style="color: #ffffff; font-weight: 500;">${approvedDate}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: grid; grid-template-columns: ${item.status === 'pending' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr'}; gap: 0.75rem;">
                        <button onclick="openWithdrawalModal(${item.id})" style="padding: 0.6rem; border: 1px solid #6366f1; background: rgba(99, 102, 241, 0.1); color: #6366f1; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(99, 102, 241, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(99, 102, 241, 0.1)'; this.style.transform='translateY(0)'">
                            <i class="fas fa-eye" style="margin-right: 0.35rem;"></i> Chi tiết
                        </button>
                        ${item.status === 'pending' ? `
                            <button onclick="approveWithdrawal(${item.id})" style="padding: 0.6rem; border: 1px solid #10b981; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(16, 185, 129, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(16, 185, 129, 0.1)'; this.style.transform='translateY(0)'">
                                <i class="fas fa-check-circle" style="margin-right: 0.35rem;"></i> Phê duyệt
                            </button>
                            <button onclick="rejectWithdrawal(${item.id})" style="padding: 0.6rem; border: 1px solid #ef4444; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(239, 68, 68, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(239, 68, 68, 0.1)'; this.style.transform='translateY(0)'">
                                <i class="fas fa-times-circle" style="margin-right: 0.35rem;"></i> Từ chối
                            </button>
                        ` : ''}
                        <button onclick="deleteWithdrawal(${item.id})" style="padding: 0.6rem; border: 1px solid #f87171; background: rgba(248, 113, 113, 0.1); color: #f87171; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(248, 113, 113, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(248, 113, 113, 0.1)'; this.style.transform='translateY(0)'">
                            <i class="fas fa-trash" style="margin-right: 0.35rem;"></i> Xóa
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    updateStats() {
        const pending = this.data.filter(w => w.status === 'pending').length;
        const approved = this.data.filter(w => w.status === 'approved').length;
        const rejected = this.data.filter(w => w.status === 'rejected').length;

        document.getElementById('withdrawalsPending').textContent = pending;
        document.getElementById('withdrawalsApproved').textContent = approved;
        document.getElementById('withdrawalsRejected').textContent = rejected;
        document.getElementById('withdrawalsTotal').textContent = this.data.length;
    },

    async approve(id) {
        NotificationModal.confirm(
            'Xác nhận duyệt',
            'Bạn chắc chắn muốn duyệt yêu cầu này?',
            async () => {
                try {
                    const response = await fetch(`/api/withdrawals/${id}/approve`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.show('Duyệt thành công', 'success');
                        this.fetch();
                    } else {
                        toast.show(result.message || 'Lỗi khi duyệt', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast.show('Lỗi khi kết nối server', 'error');
                }
            }
        );
    },

    async reject(id) {
        const reason = prompt('Nhập lý do từ chối:');
        if (reason !== null) {
            try {
                const response = await fetch(`/api/withdrawals/${id}/reject`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rejection_reason: reason })
                });
                const result = await response.json();
                
                if (result.success) {
                    toast.show('Từ chối thành công', 'success');
                    this.fetch();
                } else {
                    toast.show(result.message || 'Lỗi khi từ chối', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show('Lỗi khi kết nối server', 'error');
            }
        }
    },

    async delete(id) {
        NotificationModal.confirm(
            'Xác nhận xóa',
            'Bạn chắc chắn muốn xóa yêu cầu này?',
            async () => {
                try {
                    const response = await fetch(`/api/withdrawals/${id}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.show('Xóa thành công', 'success');
                        this.fetch();
                    } else {
                        toast.show(result.message || 'Lỗi khi xóa', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast.show('Lỗi khi kết nối server', 'error');
                }
            }
        );
    },

    view(id) {
        const item = this.data.find(w => w.id === id);
        if (item) {
            const details = `Người dùng: ${item.user?.full_name || item.user?.username}\nSố tiền: ${this.formatCurrency(item.amount)}\nNgân hàng: ${item.bank_name}\nSố tài khoản: ${item.account_number}\nTên chủ: ${item.account_holder}\nTrạng thái: ${item.status}\nGhi chú: ${item.notes || 'N/A'}`;
            NotificationModal.show('Chi tiết rút tiền', details, 'info');
        }
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
};

const giftExchanges = {
    data: [],
    currentFilter: {},

    async fetch(filters = {}) {
        try {
            const queryString = new URLSearchParams(filters).toString();
            const url = `/api/gift-exchanges?${queryString}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                this.data = result.data;
                this.render();
                this.updateStats();
            } else {
                toast.show(result.message || 'Lỗi khi tải dữ liệu', 'error');
            }
        } catch (error) {
            console.error('Error fetching gift exchanges:', error);
            toast.show('Lỗi khi kết nối server', 'error');
        }
    },

    render() {
        const container = document.getElementById('giftsContainer');
        const tbody = document.getElementById('giftsList');
        
        
        if (container) {
            if (this.data.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <i class="fas fa-inbox" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i>
                        <p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Chưa có yêu cầu quà tặng</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = this.data.map(item => {
                const statusBadges = {
                    pending: { text: 'Chờ duyệt', color: '#fbbf24', bgColor: '#fef3c7' },
                    approved: { text: 'Đã duyệt', color: '#10b981', bgColor: '#d1fae5' },
                    rejected: { text: 'Từ chối', color: '#ef4444', bgColor: '#fee2e2' },
                    shipped: { text: 'Đã giao', color: '#6366f1', bgColor: '#e0e7ff' }
                };

                const statusInfo = statusBadges[item.status] || { text: item.status, color: '#6b7280', bgColor: '#f3f4f6' };
                const createdDate = new Date(item.created_at).toLocaleString('vi-VN');

                return `
                    <div style="background: linear-gradient(135deg, #1a1f3a 0%, #0f172a 100%); border: 1px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1); color: #e0e0e0;">
                        <!-- Header -->
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.3);">
                            <div>
                                <div style="font-size: 1.75rem; font-weight: bold; color: #6366f1; margin-bottom: 0.5rem;">🎁 ${item.recipient_name || 'N/A'}</div>
                                <span style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; background: ${statusInfo.bgColor}; color: ${statusInfo.color};">
                                    ${statusInfo.status === 'approved' ? '✓' : statusInfo.status === 'pending' ? '⏳' : statusInfo.status === 'shipped' ? '✈️' : '✕'} ${statusInfo.text}
                                </span>
                            </div>
                        </div>

                        <!-- Recipient Info -->
                        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                            <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">👤 Thông tin người nhận</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                                <div>
                                    <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Tên người nhận *</div>
                                    <div style="color: #ffffff; font-weight: 500;">${item.recipient_name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Số điện thoại</div>
                                    <div style="color: #ffffff; font-weight: 500; font-family: 'Courier New', monospace;">${item.phone || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Address & Delivery Info -->
                        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                            <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">📍 Địa chỉ giao hàng</div>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; font-size: 0.9rem;">
                                <div>
                                    <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Địa chỉ</div>
                                    <div style="color: #ffffff; font-weight: 500;">${item.address || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Session Info -->
                        ${item.session ? `
                            <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                                <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">🎮 Phiên chơi</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                                    <div>
                                        <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Mã phiên</div>
                                        <div style="color: #fbbf24; font-weight: 500; font-family: 'Courier New', monospace;">${item.session?.code || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Ngày tạo</div>
                                        <div style="color: #ffffff; font-weight: 500;">${item.session?.created_at ? new Date(item.session.created_at).toLocaleDateString('vi-VN') : 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Tổng hộp</div>
                                        <div style="color: #10b981; font-weight: 500;">3/3 🎁</div>
                                    </div>
                                    <div>
                                        <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Hộp mở</div>
                                        <div style="color: #6366f1; font-weight: 500;">2/3</div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}

                        <!-- Prize Info -->
                        ${item.prize_info ? `
                            <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                                <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">🏆 Phần quà</div>
                                <div style="color: #ffffff; font-weight: 500; font-size: 0.95rem;">${item.prize_info.name || 'N/A'}</div>
                                <div style="color: #a0a0a0; font-size: 0.85rem; margin-top: 0.25rem;">${item.prize_info.description || ''}</div>
                            </div>
                        ` : ''}

                        <!-- Box Selection Info -->
                        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                            <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase;">
                                🎮 Phiên chơi & Hộp quà
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div>
                                    <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Hộp được chọn</div>
                                    <div style="color: #10b981; font-weight: 500; font-size: 1.1rem;">
                                        ${item.selected_box_number ? `✅ Hộp #${item.selected_box_number}` : '❌ Chưa chọn'}
                                    </div>
                                </div>
                                ${item.prize_name ? `
                                    <div>
                                        <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Phần thưởng</div>
                                        <div style="color: #ffffff; font-weight: 500;">${item.prize_name}</div>
                                    </div>
                                ` : ''}
                            </div>
                            ${item.selected_at ? `
                                <div style="margin-top: 0.75rem; color: #a0a0a0; font-size: 0.8rem;">
                                    📍 Chọn lúc: ${new Date(item.selected_at).toLocaleString('vi-VN')}
                                </div>
                            ` : ''}
                        </div>

                        <!-- Notes -->
                        ${item.notes ? `
                            <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                                <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">📝 Ghi chú</div>
                                <div style="color: #e0e0e0; font-size: 0.9rem;">${item.notes}</div>
                            </div>
                        ` : ''}

                        <!-- Timeline -->
                        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);">
                            <div style="font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">📅 Thời gian</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;">
                                <div>
                                    <div style="color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;">Tạo yêu cầu lúc</div>
                                    <div style="color: #ffffff; font-weight: 500;">${createdDate}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: grid; grid-template-columns: ${item.status === 'pending' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr'}; gap: 0.75rem;">
                            <button onclick="openGiftModal(${item.id})" style="padding: 0.6rem; border: 1px solid #6366f1; background: rgba(99, 102, 241, 0.1); color: #6366f1; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(99, 102, 241, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(99, 102, 241, 0.1)'; this.style.transform='translateY(0)'">
                                <i class="fas fa-eye" style="margin-right: 0.35rem;"></i> Chi tiết
                            </button>
                            ${item.status === 'pending' ? `
                                <button onclick="approveGift(${item.id})" style="padding: 0.6rem; border: 1px solid #10b981; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(16, 185, 129, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(16, 185, 129, 0.1)'; this.style.transform='translateY(0)'">
                                    <i class="fas fa-check-circle" style="margin-right: 0.35rem;"></i> Phê duyệt
                                </button>
                                <button onclick="rejectGift(${item.id})" style="padding: 0.6rem; border: 1px solid #ef4444; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(239, 68, 68, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(239, 68, 68, 0.1)'; this.style.transform='translateY(0)'">
                                    <i class="fas fa-times-circle" style="margin-right: 0.35rem;"></i> Từ chối
                                </button>
                            ` : ''}
                            <button onclick="deleteGift(${item.id})" style="padding: 0.6rem; border: 1px solid #f87171; background: rgba(248, 113, 113, 0.1); color: #f87171; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='rgba(248, 113, 113, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.backgroundColor='rgba(248, 113, 113, 0.1)'; this.style.transform='translateY(0)'">
                                <i class="fas fa-trash" style="margin-right: 0.35rem;"></i> Xóa
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            return;
        }

        
        if (!tbody) return;

        if (this.data.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="7" style="text-align: center; padding: 40px;"><i class="fas fa-inbox" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i><p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Chưa có yêu cầu quà tặng</p></td></tr>`;
            return;
        }

        tbody.innerHTML = this.data.map(item => {
            const statusBadges = {
                pending: 'Chờ duyệt',
                approved: 'Đã duyệt',
                rejected: 'Từ chối'
            };

            return `
                <tr>
                    <td>${item.user?.full_name || item.user?.username || 'N/A'}</td>
                    <td>${item.recipient_name}</td>
                    <td>${item.address.substring(0, 30)}...</td>
                    <td>${item.phone}</td>
                    <td><span class="status-badge ${item.status}">${statusBadges[item.status] || item.status}</span></td>
                    <td>${new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-view" onclick="openGiftModal(${item.id})" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    updateStats() {
        const pending = this.data.filter(g => g.status === 'pending').length;
        const approved = this.data.filter(g => g.status === 'approved').length;
        const rejected = this.data.filter(g => g.status === 'rejected').length;

        document.getElementById('giftsPending').textContent = pending;
        document.getElementById('giftsApproved').textContent = approved;
        document.getElementById('giftsRejected').textContent = rejected;
        document.getElementById('giftsTotal').textContent = this.data.length;
    },

    async approve(id) {
        NotificationModal.confirm(
            'Xác nhận duyệt',
            'Bạn chắc chắn muốn duyệt yêu cầu này?',
            async () => {
                try {
                    const response = await fetch(`/api/gift-exchanges/${id}/approve`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.show('Duyệt thành công', 'success');
                        this.fetch();
                    } else {
                        toast.show(result.message || 'Lỗi khi duyệt', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast.show('Lỗi khi kết nối server', 'error');
                }
            }
        );
    },

    async reject(id) {
        const reason = prompt('Nhập lý do từ chối:');
        if (reason !== null) {
            try {
                const response = await fetch(`/api/gift-exchanges/${id}/reject`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rejection_reason: reason })
                });
                const result = await response.json();
                
                if (result.success) {
                    toast.show('Từ chối thành công', 'success');
                    this.fetch();
                } else {
                    toast.show(result.message || 'Lỗi khi từ chối', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.show('Lỗi khi kết nối server', 'error');
            }
        }
    },

    async delete(id) {
        NotificationModal.confirm(
            'Xác nhận xóa',
            'Bạn chắc chắn muốn xóa yêu cầu này?',
            async () => {
                try {
                    const response = await fetch(`/api/gift-exchanges/${id}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        toast.show('Xóa thành công', 'success');
                        this.fetch();
                    } else {
                        toast.show(result.message || 'Lỗi khi xóa', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast.show('Lỗi khi kết nối server', 'error');
                }
            }
        );
    },

    view(id) {
        const item = this.data.find(g => g.id === id);
        if (item) {
            const details = `Người dùng: ${item.user?.full_name || item.user?.username}\nTên nhận: ${item.recipient_name}\nĐịa chỉ: ${item.address}\nSĐT: ${item.phone}\nGhi chú: ${item.notes || 'N/A'}\nTrạng thái: ${item.status}`;
            NotificationModal.show('Chi tiết trao đổi quà', details, 'info');
        }
    }
};

const originalNavInit = navigation.init;
navigation.init = function() {
    originalNavInit.call(this);
    
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            setTimeout(() => {
                if (tab === 'sessions') {
                    filters.initSessionFilters();
                    sessions.fetch();
                } else if (tab === 'withdrawals') {
                    filters.initWithdrawalFilters();
                    withdrawals.fetch();
                } else if (tab === 'gifts') {
                    filters.initGiftFilters();
                    giftExchanges.fetch();
                } else if (tab === 'users') {
                    filters.initUserFilters();
                    users.fetch();
                }
            }, 100);
        });
    });
};

users.fetch = users.fetchFromAPI = async function() {
    try {
        const response = await fetch('/api/users');
        const result = await response.json();
        
        if (result.success) {
            this.data = result.data;
            this.renderTable();
            this.updateCount();
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

let currentEditingUserId = null;
let allPermissions = [];

function openUserModal() {
    document.getElementById('userModal').style.display = 'block';
    document.getElementById('modalOverlay').classList.add('show');
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('userForm').reset();
    currentEditingUserId = null;
}

async function initUserManagement() {
    console.log('Initializing user management...');
    await loadPermissions();
    
    const addUserBtn = document.getElementById('addUserBtn');
    const userForm = document.getElementById('userForm');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            console.log('Add user button clicked');
            currentEditingUserId = null;
            const title = document.getElementById('userModalTitle');
            if (title) title.innerHTML = '<i class="fas fa-user-plus"></i> Thêm người dùng';
            const submitText = document.getElementById('userSubmitText');
            if (submitText) submitText.textContent = 'Tạo';
            const pwdLabel = document.getElementById('userPasswordLabel');
            if (pwdLabel) pwdLabel.style.display = 'inline';
            const confirmLabel = document.getElementById('userConfirmPasswordLabel');
            if (confirmLabel) confirmLabel.style.display = 'inline';
            const hint = document.getElementById('userPasswordHint');
            if (hint) hint.style.display = 'none';
            const form = document.getElementById('userForm');
            if (form) form.reset();
            openUserModal();
        });
    } else {
        console.warn('Add user button not found');
    }

    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    } else {
        console.warn('User form not found');
    }
}

async function loadPermissions() {
    try {
        const response = await fetch('/api/permissions');
        const result = await response.json();
        if (result.success) {
            allPermissions = result.data;
        }
    } catch (err) {
        console.error('Error loading permissions:', err);
    }
}

async function handleUserSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('userUsername').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const fullName = document.getElementById('userFullName').value.trim();
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const passwordConfirm = document.getElementById('userPasswordConfirm').value;
    const isActive = document.getElementById('userIsActive').checked;

    
    if (!username || !email) {
        NotificationModal.show('Lỗi', 'Vui lòng điền tên người dùng và email', 'error');
        return;
    }

    if (!currentEditingUserId && !password) {
        NotificationModal.show('Lỗi', 'Vui lòng nhập mật khẩu', 'error');
        return;
    }

    if (password && password !== passwordConfirm) {
        NotificationModal.show('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
        return;
    }

    const userData = {
        username,
        email,
        full_name: fullName,
        role,
        is_active: isActive
    };

    if (password) {
        userData.password = password;
    }

    try {
        const url = currentEditingUserId ? `/api/users/${currentEditingUserId}` : '/api/users';
        const method = currentEditingUserId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            toast.success(currentEditingUserId ? 'Cập nhật thành công' : 'Tạo tài khoản thành công');
            closeUserModal();
            users.fetchFromAPI();
        } else {
            const error = await response.json();
            NotificationModal.show('Lỗi', error.message || 'Không thể lưu tài khoản', 'error');
        }
    } catch (err) {
        console.error('Error saving user:', err);
        NotificationModal.show('Lỗi', 'Lỗi kết nối: ' + err.message, 'error');
    }
}

function editUser(userId) {
    const user = users.data.find(u => u.id === userId);
    if (!user) return;

    currentEditingUserId = userId;
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userFullName').value = user.full_name || '';
    document.getElementById('userRole').value = user.role || 'user';
    document.getElementById('userPassword').value = '';
    document.getElementById('userPasswordConfirm').value = '';
    document.getElementById('userIsActive').checked = user.is_active !== false;

    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Chỉnh sửa người dùng';
    document.getElementById('userSubmitText').textContent = 'Lưu';
    document.getElementById('userPasswordLabel').style.display = 'none';
    document.getElementById('userConfirmPasswordLabel').style.display = 'none';
    document.getElementById('userPasswordHint').style.display = 'block';

    openUserModal();
}

async function deleteUser(userId) {
    const user = users.data.find(u => u.id === userId);
    if (!user) return;

    NotificationModal.confirm(
        'Xác nhận xóa',
        `Bạn có chắc muốn xóa người dùng "${user.username}"?`,
        async () => {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    toast.success('Xóa người dùng thành công');
                    users.fetchFromAPI();
                } else {
                    NotificationModal.show('Lỗi', 'Lỗi khi xóa người dùng', 'error');
                }
            } catch (err) {
                console.error('Error deleting user:', err);
                NotificationModal.show('Lỗi', 'Lỗi kết nối', 'error');
            }
        }
    );
}

async function openPermissionsModal(userId) {
    const user = users.data.find(u => u.id === userId);
    if (!user) return;

    try {
        const response = await fetch(`/api/users/${userId}/permissions`);
        const result = await response.json();

        const userPermissions = result.data || [];
        const userPermissionIds = userPermissions.map(p => p.id);

        const permissionsGrid = document.getElementById('permissionsGrid');
        permissionsGrid.innerHTML = allPermissions.map(perm => `
            <div class="permission-item">
                <label>
                    <input 
                        type="checkbox" 
                        value="${perm.id}"
                        ${userPermissionIds.includes(perm.id) ? 'checked' : ''}
                    >
                    ${perm.name}
                </label>
            </div>
        `).join('');

        document.getElementById('permUserName').textContent = user.username;
        currentEditingUserId = userId;
        document.getElementById('permissionsModal').style.display = 'block';
        document.getElementById('modalOverlay').classList.add('show');
    } catch (err) {
        console.error('Error loading permissions:', err);
        NotificationModal.show('Lỗi', 'Lỗi khi tải quyền hạn', 'error');
    }
}

function closePermissionsModal() {
    document.getElementById('permissionsModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
    currentEditingUserId = null;
}

async function savePermissions() {
    if (!currentEditingUserId) return;

    const selectedPermissions = Array.from(
        document.querySelectorAll('#permissionsGrid input[type="checkbox"]:checked')
    ).map(cb => parseInt(cb.value));

    try {
        const response = await fetch(`/api/users/${currentEditingUserId}/permissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissionIds: selectedPermissions })
        });

        if (response.ok) {
            toast.success('Cập nhật quyền hạn thành công');
            closePermissionsModal();
        } else {
            NotificationModal.show('Lỗi', 'Lỗi khi cập nhật quyền hạn', 'error');
        }
    } catch (err) {
        console.error('Error saving permissions:', err);
        NotificationModal.show('Lỗi', 'Lỗi kết nối', 'error');
    }
}

const originalRenderTable = users.renderTable;
users.renderTable = function() {
    const tbody = document.getElementById('usersList');
    if (!tbody) return;

    if (this.data.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7" style="text-align: center; padding: 40px;"><i class="fas fa-inbox" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i><p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Chưa có người dùng nào</p></td></tr>`;
        return;
    }

    tbody.innerHTML = this.data.map(user => `
        <tr>
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td>${user.full_name || 'N/A'}</td>
            <td><span style="background: rgba(99, 102, 241, 0.2); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">${user.role || 'user'}</span></td>
            <td><span class="status-badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Hoạt động' : 'Bị khóa'}</span></td>
            <td>${new Date(user.createdAt || user.created_at).toLocaleDateString('vi-VN')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-sm btn-warning" onclick="openPermissionsModal(${user.id})" title="Quyền hạn">
                        <i class="fas fa-shield-alt"></i>
                    </button>
                    <button class="btn-sm btn-reject" onclick="deleteUser(${user.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

users.updateCount = function() {
    const count = this.data.length || 0;
    const countEl = document.getElementById('usersCount');
    if (countEl) countEl.textContent = count;
    const totalEl = document.getElementById('userTotal');
    if (totalEl) totalEl.textContent = count;
};

let currentWithdrawalId = null;

function openWithdrawalModal(id) {
    const item = withdrawals.data.find(w => w.id === id);
    if (!item) return;

    currentWithdrawalId = id;
    
    
    document.getElementById('previewWithdrawalCustomerName').value = item.customer_name || item.user?.full_name || '';
    document.getElementById('previewWithdrawalPhone').value = item.customer_phone || '';
    document.getElementById('previewWithdrawalEmail').value = item.customer_email || '';
    document.getElementById('previewWithdrawalAmount').value = withdrawals.formatCurrency(item.amount || 0);
    document.getElementById('previewWithdrawalMethod').value = item.withdraw_method || item.bank_name || 'N/A';
    document.getElementById('previewWithdrawalAccount').value = item.account_number || item.customer_phone || '';
    document.getElementById('previewWithdrawalStatus').value = item.status || '';
    document.getElementById('previewWithdrawalPrize').value = item.prize_name || 'N/A';

    document.getElementById('withdrawalPreviewModal').style.display = 'block';
    document.getElementById('modalOverlay').classList.add('show');
}

function closeWithdrawalPreviewModal() {
    document.getElementById('withdrawalPreviewModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
}

function closeWithdrawalEditModal() {
    document.getElementById('withdrawalEditModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
}

function closeWithdrawalConfirmModal() {
    document.getElementById('withdrawalConfirmModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
}

function editWithdrawal() {
    if (!currentWithdrawalId) return;
    const item = withdrawals.data.find(w => w.id === currentWithdrawalId);
    if (!item) return;

    document.getElementById('editWithdrawalStatus').value = item.status || 'pending';
    document.getElementById('editWithdrawalNote').value = item.notes || '';

    document.getElementById('withdrawalPreviewModal').style.display = 'none';
    document.getElementById('withdrawalEditModal').style.display = 'block';
}

async function saveWithdrawalEdit() {
    const status = document.getElementById('editWithdrawalStatus').value;
    const note = document.getElementById('editWithdrawalNote').value;

    try {
        const response = await fetch(`/api/withdrawals/${currentWithdrawalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, notes: note })
        });

        const result = await response.json();
        if (result.success) {
            toast.success('Cập nhật thành công');
            closeWithdrawalEditModal();
            withdrawals.fetch();
        } else {
            toast.error(result.message || 'Lỗi cập nhật');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Lỗi kết nối');
    }
}

function deleteWithdrawal() {
    if (!currentWithdrawalId) return;
    const item = withdrawals.data.find(w => w.id === currentWithdrawalId);
    if (!item) return;

    document.getElementById('withdrawalPreviewModal').style.display = 'none';
    document.getElementById('withdrawalConfirmModal').style.display = 'block';
    document.getElementById('withdrawalConfirmAmount').textContent = (item.amount || 0).toLocaleString('vi-VN');
}

async function confirmDeleteWithdrawal() {
    if (!currentWithdrawalId) return;

    try {
        const response = await fetch(`/api/withdrawals/${currentWithdrawalId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (result.success) {
            toast.success('Xóa thành công');
            closeWithdrawalConfirmModal();
            withdrawals.fetch();
        } else {
            toast.error(result.message || 'Lỗi xóa');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Lỗi kết nối');
    }
}

// ==================== GIFTS MODAL MANAGEMENT ====================
let currentGiftId = null;

function openGiftModal(id) {
    const item = giftExchanges.data.find(g => g.id === id);
    if (!item) return;

    currentGiftId = id;
    document.getElementById('previewGiftUsername').value = item.user?.full_name || item.user?.username || '';
    document.getElementById('previewGiftEmail').value = item.user?.email || '';
    document.getElementById('previewGiftReceiverName').value = item.recipient_name || '';
    document.getElementById('previewGiftPhone').value = item.phone || '';
    document.getElementById('previewGiftAddress').value = item.address || '';
    document.getElementById('previewGiftStatus').value = item.status || '';

    document.getElementById('giftPreviewModal').style.display = 'block';
    document.getElementById('modalOverlay').classList.add('show');
}

function closeGiftPreviewModal() {
    document.getElementById('giftPreviewModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
}

function closeGiftEditModal() {
    document.getElementById('giftEditModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
}

function closeGiftConfirmModal() {
    document.getElementById('giftConfirmModal').style.display = 'none';
    document.getElementById('modalOverlay').classList.remove('show');
}

function editGift() {
    if (!currentGiftId) return;
    const item = giftExchanges.data.find(g => g.id === currentGiftId);
    if (!item) return;

    document.getElementById('editGiftReceiverName').value = item.recipient_name || '';
    document.getElementById('editGiftPhone').value = item.phone || '';
    document.getElementById('editGiftAddress').value = item.address || '';
    document.getElementById('editGiftStatus').value = item.status || 'pending';
    document.getElementById('editGiftNote').value = item.notes || '';

    document.getElementById('giftPreviewModal').style.display = 'none';
    document.getElementById('giftEditModal').style.display = 'block';
}

async function saveGiftEdit() {
    const recipientName = document.getElementById('editGiftReceiverName').value;
    const phone = document.getElementById('editGiftPhone').value;
    const address = document.getElementById('editGiftAddress').value;
    const status = document.getElementById('editGiftStatus').value;
    const note = document.getElementById('editGiftNote').value;

    try {
        const response = await fetch(`/api/gift-exchanges/${currentGiftId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                recipient_name: recipientName,
                phone,
                address,
                status,
                notes: note
            })
        });

        const result = await response.json();
        if (result.success) {
            toast.success('Cập nhật thành công');
            closeGiftEditModal();
            giftExchanges.fetch();
        } else {
            toast.error(result.message || 'Lỗi cập nhật');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Lỗi kết nối');
    }
}

function deleteGift() {
    if (!currentGiftId) return;
    const item = giftExchanges.data.find(g => g.id === currentGiftId);
    if (!item) return;

    document.getElementById('giftPreviewModal').style.display = 'none';
    document.getElementById('giftConfirmModal').style.display = 'block';
    document.getElementById('giftConfirmName').textContent = item.recipient_name || 'N/A';
}

async function confirmDeleteGift() {
    if (!currentGiftId) return;

    try {
        const response = await fetch(`/api/gift-exchanges/${currentGiftId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (result.success) {
            toast.success('Xóa thành công');
            closeGiftConfirmModal();
            giftExchanges.fetch();
        } else {
            toast.error(result.message || 'Lỗi xóa');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Lỗi kết nối');
    }
}

// ==================== INITIALIZATION FOR WITHDRAWALS & GIFTS ====================
async function initWithdrawals() {
    filters.initWithdrawalFilters();
    await withdrawals.fetch();
}

async function initGifts() {
    filters.initGiftFilters();
    await giftExchanges.fetch();
}

// Update user management initialization
const originalInitUserManagement = initUserManagement;
const newInitUserManagement = async function() {
    originalInitUserManagement();
    filters.initUserFilters();
};
initUserManagement = newInitUserManagement;

// ==================== FILTER MANAGEMENT ====================
const filters = {
    withdrawalFilters: {
        status: '',
        search: ''
    },
    giftFilters: {
        status: '',
        search: ''
    },
    userFilters: {
        search: '',
        role: ''
    },
    sessionFilters: {
        status: '',
        search: ''
    },

    initWithdrawalFilters() {
        const statusFilter = document.getElementById('withdrawalStatusFilter');
        const searchInput = document.getElementById('withdrawalSearch');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.withdrawalFilters.status = e.target.value;
                this.applyWithdrawalFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.withdrawalFilters.search = e.target.value.toLowerCase();
                this.applyWithdrawalFilters();
            });
        }
    },

    applyWithdrawalFilters() {
        const { status, search } = this.withdrawalFilters;
        const container = document.getElementById('withdrawalsContainer');
        if (!container) return;

        const cards = container.querySelectorAll('.withdrawal-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const statusText = card.textContent.toLowerCase();
            const userText = card.textContent.toLowerCase();
            const amountText = card.textContent.toLowerCase();
            const bankText = card.textContent.toLowerCase();
            const accountText = card.textContent.toLowerCase();

            const matchStatus = !status || statusText.includes(status.toLowerCase());
            const matchSearch = !search || 
                userText.includes(search) || 
                amountText.includes(search) || 
                bankText.includes(search) || 
                accountText.includes(search);

            if (matchStatus && matchSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 2em; color: rgba(0,0,0,0.2);"></i>
                    <p style="margin-top: 10px; color: rgba(0,0,0,0.5);">Không tìm thấy yêu cầu rút tiền phù hợp</p>
                </div>
            `;
        }
    },

    initGiftFilters() {
        const statusFilter = document.getElementById('giftStatusFilter');
        const searchInput = document.getElementById('giftSearch');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.giftFilters.status = e.target.value;
                this.applyGiftFilters();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.giftFilters.search = e.target.value.toLowerCase();
                this.applyGiftFilters();
            });
        }
    },

    applyGiftFilters() {
        const { status, search } = this.giftFilters;
        const container = document.getElementById('giftsContainer');
        if (!container) return;

        // Try to get cards (for grid layout)
        let cards = container.children;
        
        if (cards.length === 0) return;

        let visibleCount = 0;
        const cardArray = Array.from(cards);

        cardArray.forEach(card => {
            // For grid cards, search in the text content
            const textContent = card.textContent.toLowerCase();
            
            // Try to find status from the badge
            let cardStatus = '';
            const statusBadge = card.querySelector('[style*="background"]');
            if (statusBadge) {
                const badges = ['chờ duyệt', 'đã duyệt', 'từ chối', 'đã giao', 'pending', 'approved', 'rejected', 'shipped'];
                const badgeText = statusBadge.textContent.toLowerCase();
                for (const badge of badges) {
                    if (badgeText.includes(badge)) {
                        cardStatus = badge;
                        break;
                    }
                }
            }

            const matchStatus = !status || cardStatus.includes(status.toLowerCase()) || textContent.includes(status.toLowerCase());
            const matchSearch = !search || textContent.includes(search);

            if (matchStatus && matchSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i>
                    <p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Không tìm thấy kết quả phù hợp</p>
                </div>
            `;
        }
    },

    initUserFilters() {
        const searchInput = document.getElementById('userSearch');
        const roleFilter = document.getElementById('userRoleFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.userFilters.search = e.target.value.toLowerCase();
                this.applyUserFilters();
            });
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.userFilters.role = e.target.value;
                this.applyUserFilters();
            });
        }
    },

    applyUserFilters() {
        const { search, role } = this.userFilters;
        const tbody = document.getElementById('usersList');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr:not(.empty-row)');
        let visibleCount = 0;

        rows.forEach(row => {
            const usernameCell = row.cells[0]?.textContent.toLowerCase() || '';
            const emailCell = row.cells[1]?.textContent.toLowerCase() || '';
            const fullNameCell = row.cells[2]?.textContent.toLowerCase() || '';
            const roleCell = row.cells[3]?.textContent.toLowerCase() || '';

            const matchSearch = !search || 
                usernameCell.includes(search) || 
                emailCell.includes(search) || 
                fullNameCell.includes(search);
            const matchRole = !role || roleCell.includes(role.toLowerCase());

            if (matchSearch && matchRole) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="7" style="text-align: center; padding: 40px;"><i class="fas fa-search" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i><p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Không tìm thấy người dùng phù hợp</p></td></tr>`;
        } else if (tbody.querySelector('.empty-row')) {
            tbody.querySelector('.empty-row').remove();
        }
    },

    sessionFilters: {
        code: ''
    },

    initSessionFilters() {
        const codeInput = document.getElementById('sessionCodeFilter');
        const resetBtn = document.getElementById('resetSessionFilters');

        if (codeInput) {
            codeInput.addEventListener('input', (e) => {
                this.sessionFilters.code = e.target.value.toLowerCase();
                this.applySessionFilters();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSessionFilters();
            });
        }
    },

    applySessionFilters() {
        const { code } = this.sessionFilters;
        const container = document.getElementById('sessionsGrid');
        if (!container) return;

        const cards = container.querySelectorAll('.session-card:not(.empty-state)');
        let visibleCount = 0;

        cards.forEach(card => {
            const codeText = (card.getAttribute('data-session-code') || '').toLowerCase();
            const matchCode = !code || codeText.includes(code);

            if (matchCode) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            // Show empty state
            let emptyState = container.querySelector('.empty-state');
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `<i class="fas fa-search" style="font-size: 2em; color: rgba(255,255,255,0.3);"></i><p style="margin-top: 10px; color: rgba(255,255,255,0.7);">Không tìm thấy phiên phù hợp</p>`;
                container.innerHTML = '';
                container.appendChild(emptyState);
            } else {
                emptyState.style.display = '';
            }
        } else {
            const emptyState = container.querySelector('.empty-state');
            if (emptyState) emptyState.style.display = 'none';
        }
    },

    resetSessionFilters() {
        // Reset filter state
        this.sessionFilters = {
            code: ''
        };

        // Reset filter inputs
        const codeInput = document.getElementById('sessionCodeFilter');
        if (codeInput) codeInput.value = '';

        // Show all cards
        const container = document.getElementById('sessionsGrid');
        if (container) {
            const cards = container.querySelectorAll('.session-card');
            cards.forEach(card => card.style.display = '');
            const emptyState = container.querySelector('.empty-state');
            if (emptyState) emptyState.style.display = 'none';
        }
    }
};

// ==================== GLOBAL FUNCTIONS ====================
window.approveWithdrawal = async (id) => {
    try {
        const response = await fetch(`/api/withdrawals/${id}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const result = await response.json();
        
        if (result.success) {
            toast.show('Phê duyệt rút tiền thành công', 'success');
            withdrawals.fetch();
        } else {
            toast.show(result.message || 'Lỗi khi phê duyệt', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.show('Lỗi khi kết nối server', 'error');
    }
};

window.rejectWithdrawal = async (id) => {
    const reason = prompt('Nhập lý do từ chối rút tiền:');
    if (reason !== null && reason.trim() !== '') {
        try {
            const response = await fetch(`/api/withdrawals/${id}/reject`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rejection_reason: reason })
            });
            const result = await response.json();
            
            if (result.success) {
                toast.show('Từ chối rút tiền thành công', 'success');
                withdrawals.fetch();
            } else {
                toast.show(result.message || 'Lỗi khi từ chối', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.show('Lỗi khi kết nối server', 'error');
        }
    }
};

window.approveGift = async (id) => {
    try {
        const response = await fetch(`/api/gift-exchanges/${id}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const result = await response.json();
        
        if (result.success) {
            toast.show('Phê duyệt quà tặng thành công', 'success');
            giftExchanges.fetch();
        } else {
            toast.show(result.message || 'Lỗi khi phê duyệt', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.show('Lỗi khi kết nối server', 'error');
    }
};

window.rejectGift = async (id) => {
    const reason = prompt('Nhập lý do từ chối quà tặng:');
    if (reason !== null && reason.trim() !== '') {
        try {
            const response = await fetch(`/api/gift-exchanges/${id}/reject`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rejection_reason: reason })
            });
            const result = await response.json();
            
            if (result.success) {
                toast.show('Từ chối quà tặng thành công', 'success');
                giftExchanges.fetch();
            } else {
                toast.show(result.message || 'Lỗi khi từ chối', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.show('Lỗi khi kết nối server', 'error');
        }
    }
};

window.deleteGift = (id) => {
    if (!id) return;
    const item = giftExchanges.data.find(g => g.id === id);
    if (!item) return;

    NotificationModal.confirm(
        'Xác nhận xóa',
        `Bạn chắc chắn muốn xóa yêu cầu quà cho ${item.recipient_name}?`,
        () => {
            giftExchanges.delete(id);
        }
    );
};

window.deleteWithdrawal = (id) => {
    if (!id) return;
    const item = withdrawals.data.find(w => w.id === id);
    if (!item) return;

    NotificationModal.confirm(
        'Xác nhận xóa',
        `Bạn chắc chắn muốn xóa yêu cầu rút tiền ${withdrawals.formatCurrency(item.amount)}?`,
        () => {
            withdrawals.delete(id);
        }
    );
};

// Copy bank info to clipboard
window.copyBankInfo = (bankName, accountNumber, accountHolder) => {
    if (!accountNumber) {
        toast.show('❌ Không có số tài khoản để sao chép', 'error');
        return;
    }
    
    const textToCopy = `Ngân hàng: ${bankName || 'N/A'}
Số tài khoản: ${accountNumber}
Chủ tài khoản: ${accountHolder || 'N/A'}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        toast.show('✅ Đã sao chép: ' + accountNumber, 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast.show('✅ Đã sao chép thông tin ngân hàng', 'success');
    });
};

window.app = {
    state,
    toast,
    utils,
    sessions,
    users,
    files,
    navigation,
    modal,
    withdrawals,
    giftExchanges,
    notifications,
    filters
};
