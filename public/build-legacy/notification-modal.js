var NotificationModal = {
  show: function show(title, message) {
    var _this = this;
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'info';
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var position = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'center';
    var modalId = 'notification-modal-' + Date.now();
    var typeClass = "notification-".concat(type);
    var icons = {
      info: 'ℹ️',
      success: '✓',
      warning: '⚠️',
      error: '✕'
    };
    var colors = {
      info: {
        main: '#3b82f6',
        glow: '#3b82f666'
      },
      success: {
        main: '#10b981',
        glow: '#10b98166'
      },
      warning: {
        main: '#f59e0b',
        glow: '#f59e0b66'
      },
      error: {
        main: '#ef4444',
        glow: '#ef444466'
      }
    };
    var icon = icons[type] || icons.info;
    var colorSet = colors[type] || colors.info;
    var color = colorSet.main;
    var glow = colorSet.glow;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Position styles - all modals now use overlay container for centering
    var isCenter = position === 'center';
    var overlayStyle = isCenter ? 'display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5);' : 'background: transparent;';
    var modalStyle = isCenter ? 'position: relative;' : 'position: absolute;' + (position === 'top-right' ? ' top: 20px; right: 20px;' : position === 'top-center' ? ' top: 20px; left: 50%; transform: translateX(-50%);' : ' bottom: 20px; right: 20px;');
    var animationName = isCenter ? 'fadeInScale' : position === 'top-right' ? 'slideInRight' : position === 'top-center' ? 'slideInDown' : 'slideInUp';
    var html = "\n            <div class=\"notification-overlay\" id=\"".concat(modalId, "-overlay\" style=\"\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100vw;\n                height: 100vh;\n                z-index: 9998;\n                ").concat(overlayStyle, "\n                backdrop-filter: blur(8px);\n                -webkit-backdrop-filter: blur(8px);\n                pointer-events: auto;\n            \" data-modal-id=\"").concat(modalId, "\">\n                <div class=\"notification-modal ").concat(typeClass, "\" id=\"").concat(modalId, "\" style=\"\n                    ").concat(modalStyle, "\n                    width: ").concat(isCenter ? '480px' : '380px', ";\n                    max-width: 90vw;\n                    background: rgba(15, 10, 26, 0.95);\n                    border: 2px solid ").concat(color, ";\n                    border-radius: 16px;\n                    padding: 28px;\n                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ").concat(glow, ";\n                    animation: ").concat(animationName, " 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);\n                    color: #ffffff;\n                    z-index: 9999;\n                \">\n                    <div style=\"display: flex; align-items: flex-start; gap: 16px;\">\n                        <div style=\"\n                            font-size: 36px;\n                            flex-shrink: 0;\n                            filter: drop-shadow(0 0 12px ").concat(color, ");\n                        \">").concat(icon, "</div>\n                        <div style=\"flex: 1;\">\n                            <h3 style=\"\n                                margin: 0 0 12px 0;\n                                font-size: 1.25em;\n                                font-weight: 700;\n                                color: ").concat(color, ";\n                                text-transform: uppercase;\n                                letter-spacing: 0.8px;\n                            \">").concat(this.escapeHtml(title), "</h3>\n                            <p style=\"\n                                margin: 0 0 20px 0;\n                                color: #d0d0e0;\n                                line-height: 1.6;\n                                font-size: 0.95em;\n                            \">").concat(this.escapeHtml(message), "</p>\n                            <button onclick=\"NotificationModal.close('").concat(modalId, "')\" style=\"\n                                background: linear-gradient(135deg, ").concat(color, " 0%, ").concat(color, "dd 100%);\n                                color: ").concat(type === 'warning' ? '#000' : '#fff', ";\n                                border: none;\n                                padding: 11px 24px;\n                                border-radius: 8px;\n                                font-weight: 600;\n                                cursor: pointer;\n                                transition: all 0.2s ease;\n                                font-size: 0.88em;\n                                text-transform: uppercase;\n                                letter-spacing: 0.6px;\n                                box-shadow: 0 0 16px ").concat(glow, ";\n                            \" onmouseover=\"this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 24px ").concat(glow, "';\" onmouseout=\"this.style.transform='translateY(0)'; this.style.boxShadow='0 0 16px ").concat(glow, "';\">\n                                \u0110\xF3ng\n                            </button>\n                        </div>\n                        <button onclick=\"NotificationModal.close('").concat(modalId, "')\" style=\"\n                            background: none;\n                            border: none;\n                            color: #a0a0b0;\n                            font-size: 1.6em;\n                            cursor: pointer;\n                            padding: 0;\n                            width: 28px;\n                            height: 28px;\n                            display: flex;\n                            align-items: center;\n                            justify-content: center;\n                            line-height: 1;\n                            transition: all 0.2s ease;\n                            flex-shrink: 0;\n                        \" onmouseover=\"this.style.color='").concat(color, "'; this.style.transform='rotate(90deg)';\" onmouseout=\"this.style.color='#a0a0b0'; this.style.transform='rotate(0deg)';\">\n                            \u2715\n                        </button>\n                    </div>\n                </div>\n            </div>\n        ");
    if (!document.getElementById('notification-modal-styles')) {
      var style = document.createElement('style');
      style.id = 'notification-modal-styles';
      style.innerHTML = "\n                @keyframes fadeInScale {\n                    from {\n                        opacity: 0;\n                        transform: scale(0.9);\n                    }\n                    to {\n                        opacity: 1;\n                        transform: scale(1);\n                    }\n                }\n                @keyframes fadeOutScale {\n                    from {\n                        opacity: 1;\n                        transform: scale(1);\n                    }\n                    to {\n                        opacity: 0;\n                        transform: scale(0.9);\n                    }\n                }\n                @keyframes fadeOut {\n                    from { opacity: 1; }\n                    to { opacity: 0; }\n                }\n                @keyframes slideInRight {\n                    from {\n                        opacity: 0;\n                        transform: translateX(400px);\n                    }\n                    to {\n                        opacity: 1;\n                        transform: translateX(0);\n                    }\n                }\n                @keyframes slideInDown {\n                    from {\n                        opacity: 0;\n                        transform: translateY(-30px);\n                    }\n                    to {\n                        opacity: 1;\n                        transform: translateY(0);\n                    }\n                }\n                @keyframes slideInUp {\n                    from {\n                        opacity: 0;\n                        transform: translateY(30px);\n                    }\n                    to {\n                        opacity: 1;\n                        transform: translateY(0);\n                    }\n                }\n            ";
      document.head.appendChild(style);
    }
    var container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9990;';
      document.body.appendChild(container);
    }
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    var overlay = tempDiv.firstElementChild;
    overlay.style.pointerEvents = 'auto';
    container.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.getAttribute('data-modal-id') === modalId) {
        _this.close(modalId, callback);
      }
    });
    var _closeOnEsc = function closeOnEsc(e) {
      if (e.key === 'Escape') {
        _this.close(modalId, callback);
        document.removeEventListener('keydown', _closeOnEsc);
      }
    };
    document.addEventListener('keydown', _closeOnEsc);
    return modalId;
  },
  close: function close(modalId) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var overlay = document.getElementById("".concat(modalId, "-overlay"));
    var modal = document.getElementById(modalId);
    if (modal && overlay) {
      // Determine animation based on modal type
      var isCentered = overlay.style.display === 'flex';
      var animationName = isCentered ? 'fadeOutScale' : 'slideInRight';
      modal.style.animation = "".concat(animationName, " 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)");
      overlay.style.animation = isCentered ? 'fadeOut 0.3s ease-out' : 'none';
      setTimeout(function () {
        overlay.remove();

        // Restore body scroll if no other modals are open
        if (!document.getElementById('notification-container').querySelector('.notification-overlay')) {
          document.body.style.overflow = '';
        }
        if (callback) callback();
      }, 300);
    }
  },
  confirm: function confirm(title, message) {
    var _this2 = this;
    var onConfirm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var onCancel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var modalId = 'notification-confirm-' + Date.now();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    var html = "\n            <div class=\"notification-overlay\" id=\"".concat(modalId, "-overlay\" style=\"\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100vw;\n                height: 100vh;\n                background: rgba(0, 0, 0, 0.5);\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                backdrop-filter: blur(8px);\n                -webkit-backdrop-filter: blur(8px);\n                z-index: 9998;\n                animation: fadeInScale 0.3s ease;\n                pointer-events: auto;\n            \" data-modal-id=\"").concat(modalId, "\">\n                <div class=\"notification-modal\" id=\"").concat(modalId, "\" style=\"\n                    position: relative;\n                    background: rgba(15, 10, 26, 0.95);\n                    border: 2px solid #fbbf24;\n                    border-radius: 16px;\n                    padding: 32px;\n                    max-width: 500px;\n                    width: 90%;\n                    max-height: 80vh;\n                    overflow-y: auto;\n                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px #fbbf2466;\n                    animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);\n                    color: #ffffff;\n                    z-index: 9999;\n                \">\n                    <div style=\"display: flex; align-items: flex-start; gap: 16px;\">\n                        <div style=\"\n                            font-size: 40px;\n                            flex-shrink: 0;\n                            filter: drop-shadow(0 0 12px #fbbf24);\n                        \">\u2753</div>\n                        <div style=\"flex: 1;\">\n                            <h3 style=\"\n                                margin: 0 0 12px 0;\n                                font-size: 1.3em;\n                                font-weight: 700;\n                                color: #fbbf24;\n                                text-transform: uppercase;\n                                letter-spacing: 0.8px;\n                            \">").concat(this.escapeHtml(title), "</h3>\n                            <p style=\"\n                                margin: 0 0 28px 0;\n                                color: #d0d0e0;\n                                line-height: 1.6;\n                                font-size: 0.95em;\n                            \">").concat(this.escapeHtml(message), "</p>\n                            <div style=\"display: flex; gap: 14px; justify-content: flex-end;\">\n                                <button onclick=\"NotificationModal.closeConfirm('").concat(modalId, "', false)\" style=\"\n                                    background: rgba(107, 114, 128, 0.3);\n                                    border: 2px solid rgba(107, 114, 128, 0.5);\n                                    color: #e0e0f0;\n                                    padding: 11px 24px;\n                                    border-radius: 8px;\n                                    font-weight: 600;\n                                    cursor: pointer;\n                                    transition: all 0.2s ease;\n                                    font-size: 0.88em;\n                                    text-transform: uppercase;\n                                    letter-spacing: 0.6px;\n                                \" onmouseover=\"this.style.background='rgba(107, 114, 128, 0.5)'; this.style.borderColor='#9ca3af';\" onmouseout=\"this.style.background='rgba(107, 114, 128, 0.3)'; this.style.borderColor='rgba(107, 114, 128, 0.5)';\">\n                                    H\u1EE7y\n                                </button>\n                                <button onclick=\"NotificationModal.closeConfirm('").concat(modalId, "', true)\" style=\"\n                                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);\n                                    border: none;\n                                    color: #1a1a1a;\n                                    padding: 11px 24px;\n                                    border-radius: 8px;\n                                    font-weight: 700;\n                                    cursor: pointer;\n                                    transition: all 0.2s ease;\n                                    font-size: 0.88em;\n                                    text-transform: uppercase;\n                                    letter-spacing: 0.6px;\n                                    box-shadow: 0 0 16px #fbbf2466;\n                                \" onmouseover=\"this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 24px #fbbf2466';\" onmouseout=\"this.style.transform='translateY(0)'; this.style.boxShadow='0 0 16px #fbbf2466';\">\n                                    X\xE1c nh\u1EADn\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ");
    var container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9990;';
      document.body.appendChild(container);
    }
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    var overlay = tempDiv.firstElementChild;
    overlay.style.pointerEvents = 'auto';
    container.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.getAttribute('data-modal-id') === modalId) {
        _this2.closeConfirm(modalId, false);
      }
    });
    var _closeOnEsc2 = function closeOnEsc(e) {
      if (e.key === 'Escape') {
        _this2.closeConfirm(modalId, false);
        document.removeEventListener('keydown', _closeOnEsc2);
      }
    };
    document.addEventListener('keydown', _closeOnEsc2);
    window["NotificationModal_".concat(modalId, "_onConfirm")] = onConfirm;
    window["NotificationModal_".concat(modalId, "_onCancel")] = onCancel;
    return modalId;
  },
  closeConfirm: function closeConfirm(modalId, confirmed) {
    var overlay = document.getElementById("".concat(modalId, "-overlay"));
    var modal = document.getElementById(modalId);
    if (modal && overlay) {
      modal.style.animation = 'fadeOutScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(function () {
        overlay.remove();
        var onConfirm = window["NotificationModal_".concat(modalId, "_onConfirm")];
        var onCancel = window["NotificationModal_".concat(modalId, "_onCancel")];
        if (confirmed && onConfirm) {
          onConfirm();
        } else if (!confirmed && onCancel) {
          onCancel();
        }
        delete window["NotificationModal_".concat(modalId, "_onConfirm")];
        delete window["NotificationModal_".concat(modalId, "_onCancel")];
        if (!document.getElementById('notification-container').querySelector('.notification-overlay')) {
          document.body.style.overflow = '';
        }
      }, 300);
    }
  },
  escapeHtml: function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }
};
window.alert = function (message) {
  NotificationModal.show('Thông báo', message, 'info');
};
window.confirm = function (message) {
  // Use NotificationModal.confirm() for proper async handling
  NotificationModal.show('Xác nhận', message, 'warning');
  return true;
};