

const NotificationModal = {
    
    show: function(title, message, type = 'info', callback = null, position = 'center') {
        
        const modalId = 'notification-modal-' + Date.now();
        const typeClass = `notification-${type}`;
        
        const icons = {
            info: 'ℹ️',
            success: '✓',
            warning: '⚠️',
            error: '✕'
        };

        const colors = {
            info: { main: '#3b82f6', glow: '#3b82f666' },
            success: { main: '#10b981', glow: '#10b98166' },
            warning: { main: '#f59e0b', glow: '#f59e0b66' },
            error: { main: '#ef4444', glow: '#ef444466' }
        };

        const icon = icons[type] || icons.info;
        const colorSet = colors[type] || colors.info;
        const color = colorSet.main;
        const glow = colorSet.glow;

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Position styles - all modals now use overlay container for centering
        const isCenter = position === 'center';
        const overlayStyle = isCenter 
            ? 'display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5);'
            : 'background: transparent;';

        const modalStyle = isCenter
            ? 'position: relative;'
            : 'position: absolute;' + (position === 'top-right' ? ' top: 20px; right: 20px;' : position === 'top-center' ? ' top: 20px; left: 50%; transform: translateX(-50%);' : ' bottom: 20px; right: 20px;');

        const animationName = isCenter ? 'fadeInScale' : (position === 'top-right' ? 'slideInRight' : position === 'top-center' ? 'slideInDown' : 'slideInUp');

        const html = `
            <div class="notification-overlay" id="${modalId}-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9998;
                ${overlayStyle}
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                pointer-events: auto;
            " data-modal-id="${modalId}">
                <div class="notification-modal ${typeClass}" id="${modalId}" style="
                    ${modalStyle}
                    width: ${isCenter ? '480px' : '380px'};
                    max-width: 90vw;
                    background: rgba(15, 10, 26, 0.95);
                    border: 2px solid ${color};
                    border-radius: 16px;
                    padding: 28px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${glow};
                    animation: ${animationName} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    color: #ffffff;
                    z-index: 9999;
                ">
                    <div style="display: flex; align-items: flex-start; gap: 16px;">
                        <div style="
                            font-size: 36px;
                            flex-shrink: 0;
                            filter: drop-shadow(0 0 12px ${color});
                        ">${icon}</div>
                        <div style="flex: 1;">
                            <h3 style="
                                margin: 0 0 12px 0;
                                font-size: 1.25em;
                                font-weight: 700;
                                color: ${color};
                                text-transform: uppercase;
                                letter-spacing: 0.8px;
                            ">${this.escapeHtml(title)}</h3>
                            <p style="
                                margin: 0 0 20px 0;
                                color: #d0d0e0;
                                line-height: 1.6;
                                font-size: 0.95em;
                            ">${this.escapeHtml(message)}</p>
                            <button onclick="NotificationModal.close('${modalId}')" style="
                                background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
                                color: ${type === 'warning' ? '#000' : '#fff'};
                                border: none;
                                padding: 11px 24px;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                font-size: 0.88em;
                                text-transform: uppercase;
                                letter-spacing: 0.6px;
                                box-shadow: 0 0 16px ${glow};
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 24px ${glow}';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 16px ${glow}';">
                                Đóng
                            </button>
                        </div>
                        <button onclick="NotificationModal.close('${modalId}')" style="
                            background: none;
                            border: none;
                            color: #a0a0b0;
                            font-size: 1.6em;
                            cursor: pointer;
                            padding: 0;
                            width: 28px;
                            height: 28px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            line-height: 1;
                            transition: all 0.2s ease;
                            flex-shrink: 0;
                        " onmouseover="this.style.color='${color}'; this.style.transform='rotate(90deg)';" onmouseout="this.style.color='#a0a0b0'; this.style.transform='rotate(0deg)';">
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        `;

        
        if (!document.getElementById('notification-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-modal-styles';
            style.innerHTML = `
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes fadeOutScale {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(400px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9990;';
            document.body.appendChild(container);
        }

        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const overlay = tempDiv.firstElementChild;
        overlay.style.pointerEvents = 'auto';
        container.appendChild(overlay);

        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.getAttribute('data-modal-id') === modalId) {
                this.close(modalId, callback);
            }
        });

        
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                this.close(modalId, callback);
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);

        return modalId;
    },

    
    close: function(modalId, callback = null) {
        const overlay = document.getElementById(`${modalId}-overlay`);
        const modal = document.getElementById(modalId);
        
        if (modal && overlay) {
            // Determine animation based on modal type
            const isCentered = overlay.style.display === 'flex';
            const animationName = isCentered ? 'fadeOutScale' : 'slideInRight';
            
            modal.style.animation = `${animationName} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`;
            overlay.style.animation = isCentered ? 'fadeOut 0.3s ease-out' : 'none';
            
            setTimeout(() => {
                overlay.remove();
                
                // Restore body scroll if no other modals are open
                if (!document.getElementById('notification-container').querySelector('.notification-overlay')) {
                    document.body.style.overflow = '';
                }
                
                if (callback) callback();
            }, 300);
        }
    },

    
    confirm: function(title, message, onConfirm = null, onCancel = null) {
        const modalId = 'notification-confirm-' + Date.now();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        const html = `
            <div class="notification-overlay" id="${modalId}-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9998;
                animation: fadeInScale 0.3s ease;
                pointer-events: auto;
            " data-modal-id="${modalId}">
                <div class="notification-modal" id="${modalId}" style="
                    position: relative;
                    background: rgba(15, 10, 26, 0.95);
                    border: 2px solid #fbbf24;
                    border-radius: 16px;
                    padding: 32px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px #fbbf2466;
                    animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    color: #ffffff;
                    z-index: 9999;
                ">
                    <div style="display: flex; align-items: flex-start; gap: 16px;">
                        <div style="
                            font-size: 40px;
                            flex-shrink: 0;
                            filter: drop-shadow(0 0 12px #fbbf24);
                        ">❓</div>
                        <div style="flex: 1;">
                            <h3 style="
                                margin: 0 0 12px 0;
                                font-size: 1.3em;
                                font-weight: 700;
                                color: #fbbf24;
                                text-transform: uppercase;
                                letter-spacing: 0.8px;
                            ">${this.escapeHtml(title)}</h3>
                            <p style="
                                margin: 0 0 28px 0;
                                color: #d0d0e0;
                                line-height: 1.6;
                                font-size: 0.95em;
                            ">${this.escapeHtml(message)}</p>
                            <div style="display: flex; gap: 14px; justify-content: flex-end;">
                                <button onclick="NotificationModal.closeConfirm('${modalId}', false)" style="
                                    background: rgba(107, 114, 128, 0.3);
                                    border: 2px solid rgba(107, 114, 128, 0.5);
                                    color: #e0e0f0;
                                    padding: 11px 24px;
                                    border-radius: 8px;
                                    font-weight: 600;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                    font-size: 0.88em;
                                    text-transform: uppercase;
                                    letter-spacing: 0.6px;
                                " onmouseover="this.style.background='rgba(107, 114, 128, 0.5)'; this.style.borderColor='#9ca3af';" onmouseout="this.style.background='rgba(107, 114, 128, 0.3)'; this.style.borderColor='rgba(107, 114, 128, 0.5)';">
                                    Hủy
                                </button>
                                <button onclick="NotificationModal.closeConfirm('${modalId}', true)" style="
                                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                                    border: none;
                                    color: #1a1a1a;
                                    padding: 11px 24px;
                                    border-radius: 8px;
                                    font-weight: 700;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                    font-size: 0.88em;
                                    text-transform: uppercase;
                                    letter-spacing: 0.6px;
                                    box-shadow: 0 0 16px #fbbf2466;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 24px #fbbf2466';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 16px #fbbf2466';">
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9990;';
            document.body.appendChild(container);
        }

        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const overlay = tempDiv.firstElementChild;
        overlay.style.pointerEvents = 'auto';
        container.appendChild(overlay);

        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.getAttribute('data-modal-id') === modalId) {
                this.closeConfirm(modalId, false);
            }
        });

        
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                this.closeConfirm(modalId, false);
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);

        
        window[`NotificationModal_${modalId}_onConfirm`] = onConfirm;
        window[`NotificationModal_${modalId}_onCancel`] = onCancel;

        return modalId;
    },

    
    closeConfirm: function(modalId, confirmed) {
        const overlay = document.getElementById(`${modalId}-overlay`);
        const modal = document.getElementById(modalId);
        
        if (modal && overlay) {
            modal.style.animation = 'fadeOutScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            
            setTimeout(() => {
                overlay.remove();
                
                
                const onConfirm = window[`NotificationModal_${modalId}_onConfirm`];
                const onCancel = window[`NotificationModal_${modalId}_onCancel`];

                if (confirmed && onConfirm) {
                    onConfirm();
                } else if (!confirmed && onCancel) {
                    onCancel();
                }

                
                delete window[`NotificationModal_${modalId}_onConfirm`];
                delete window[`NotificationModal_${modalId}_onCancel`];
                
                
                if (!document.getElementById('notification-container').querySelector('.notification-overlay')) {
                    document.body.style.overflow = '';
                }
            }, 300);
        }
    },

    
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};

window.alert = function(message) {
    NotificationModal.show('Thông báo', message, 'info');
};

window.confirm = function(message) {
    
    // Use NotificationModal.confirm() for proper async handling
    NotificationModal.show('Xác nhận', message, 'warning');
    return true;
};
