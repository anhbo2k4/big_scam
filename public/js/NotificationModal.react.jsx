import React, { useEffect, useState } from 'react';

/**
 * NotificationModal React Component
 * 
 * Features:
 * - Fixed position overlay covering entire viewport (100vw x 100vh)
 * - Flexbox centered modal
 * - Backdrop blur effect
 * - Smooth fade-in/scale animations
 * - ESC key to close
 * - Click outside to close (for center modals)
 * - Prevents body scroll when open
 * - Supports multiple positions (center, top-right, top-center, bottom-right)
 * 
 * Usage:
 * const [notification, setNotification] = useState(null);
 * 
 * <NotificationModal
 *   notification={notification}
 *   onClose={() => setNotification(null)}
 * />
 * 
 * setNotification({
 *   title: 'Success',
 *   message: 'Operation completed!',
 *   type: 'success',
 *   position: 'center'
 * });
 */

const NotificationModal = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [notification]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!notification) return null;

  const { title, message, type = 'info', position = 'center' } = notification;

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
    confirm: '❓',
  };

  const colors = {
    info: { main: '#3b82f6', glow: '#3b82f666' },
    success: { main: '#10b981', glow: '#10b98166' },
    warning: { main: '#f59e0b', glow: '#f59e0b66' },
    error: { main: '#ef4444', glow: '#ef444466' },
    confirm: { main: '#fbbf24', glow: '#fbbf2466' },
  };

  const icon = icons[type] || icons.info;
  const colorSet = colors[type] || colors.info;
  const { main: color, glow } = colorSet;

  const isCenter = position === 'center';
  const isCentered = position === 'top-center' || position === 'center';

  // Animation styles
  const animationStyles = `
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
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          ...( isCenter && {
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
          ...(!isCenter && {
            background: 'transparent',
            pointerEvents: 'none',
          }),
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: isVisible
            ? `${isCenter ? 'fadeInScale' : 'slideInDown'} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
            : `${isCenter ? 'fadeOutScale' : 'fadeOut'} 0.3s ease-out`,
          pointerEvents: isCenter ? 'auto' : 'none',
        }}
        onClick={isCenter ? handleBackdropClick : undefined}
      >
        <div
          style={{
            ...( isCenter ? { position: 'relative' } : getPositionStyles(position)),
            width: isCenter ? '480px' : '380px',
            maxWidth: '90vw',
            background: 'rgba(15, 10, 26, 0.95)',
            border: `2px solid ${color}`,
            borderRadius: '16px',
            padding: '28px',
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${glow}`,
            color: '#ffffff',
            zIndex: 9999,
            pointerEvents: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                fontSize: '36px',
                flexShrink: 0,
                filter: `drop-shadow(0 0 12px ${color})`,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '1.25em',
                  fontWeight: 700,
                  color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  margin: '0 0 20px 0',
                  color: '#d0d0e0',
                  lineHeight: 1.6,
                  fontSize: '0.95em',
                }}
              >
                {message}
              </p>
              <button
                onClick={handleClose}
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                  color: type === 'warning' ? '#000' : '#fff',
                  border: 'none',
                  padding: '11px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.88em',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  boxShadow: `0 0 16px ${glow}`,
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 0 24px ${glow}`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 0 16px ${glow}`;
                }}
              >
                Đóng
              </button>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#a0a0b0',
                fontSize: '1.6em',
                cursor: 'pointer',
                padding: 0,
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseOver={(e) => {
                e.target.style.color = color;
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#a0a0b0';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * ConfirmModal React Component
 * 
 * Usage:
 * const [confirm, setConfirm] = useState(null);
 * 
 * <ConfirmModal
 *   confirm={confirm}
 *   onClose={() => setConfirm(null)}
 * />
 * 
 * setConfirm({
 *   title: 'Confirm',
 *   message: 'Continue with this action?',
 *   onConfirm: () => { console.log('Confirmed!'); },
 *   onCancel: () => { console.log('Cancelled!'); }
 * });
 */

const ConfirmModal = ({ confirm, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (confirm) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [confirm]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isVisible) {
        handleCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isVisible]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      confirm?.onConfirm?.();
      onClose?.();
    }, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      confirm?.onCancel?.();
      onClose?.();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!confirm) return null;

  const { title, message } = confirm;
  const color = '#fbbf24';
  const glow = '#fbbf2466';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9998,
        animation: isVisible ? 'fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'fadeOutScale 0.3s ease-out',
        pointerEvents: 'auto',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          position: 'relative',
          background: 'rgba(15, 10, 26, 0.95)',
          border: `2px solid ${color}`,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${glow}`,
          animation: isVisible ? 'fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'fadeOutScale 0.3s ease-out',
          color: '#ffffff',
          zIndex: 9999,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              fontSize: '40px',
              flexShrink: 0,
              filter: `drop-shadow(0 0 12px ${color})`,
            }}
          >
            ❓
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '1.3em',
                fontWeight: 700,
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: '0 0 28px 0',
                color: '#d0d0e0',
                lineHeight: 1.6,
                fontSize: '0.95em',
              }}
            >
              {message}
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  background: 'rgba(107, 114, 128, 0.3)',
                  border: '2px solid rgba(107, 114, 128, 0.5)',
                  color: '#e0e0f0',
                  padding: '11px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.88em',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(107, 114, 128, 0.5)';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(107, 114, 128, 0.3)';
                  e.target.style.borderColor = 'rgba(107, 114, 128, 0.5)';
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, #f59e0b 100%)`,
                  border: 'none',
                  color: '#1a1a1a',
                  padding: '11px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.88em',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  boxShadow: `0 0 16px ${glow}`,
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 0 24px ${glow}`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 0 16px ${glow}`;
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getPositionStyles(position) {
  const baseStyles = {
    position: 'fixed',
    animation: 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    zIndex: 9999,
    pointerEvents: 'auto',
  };

  switch (position) {
    case 'top-right':
      return { ...baseStyles, top: '20px', right: '20px' };
    case 'top-center':
      return { ...baseStyles, top: '20px', left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':
      return { ...baseStyles, bottom: '20px', right: '20px' };
    default:
      return baseStyles;
  }
}

export { NotificationModal, ConfirmModal };
