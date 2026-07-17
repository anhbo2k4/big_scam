/**
 * MODAL MANAGER - Simple & Reliable
 * Handles all modal show/hide operations
 */

class ModalManager {
  constructor() {
    this.activeModals = new Set();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // ESC key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideAll();
      }
    });

    // Click overlay to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.nextElementSibling;
        if (modal && modal.id) {
          this.hide(modal.id);
        }
      }
    }, true);
  }

  show(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById(modalId + 'Overlay');
    
    if (!modal) {
      return false;
    }

    if (modal) modal.classList.add('show');
    if (overlay) overlay.classList.add('show');
    
    this.activeModals.add(modalId);
    document.body.style.overflow = 'hidden';
    
    return true;
  }

  hide(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById(modalId + 'Overlay');
    
    if (!modal) {
      return false;
    }

    if (modal) modal.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
    
    this.activeModals.delete(modalId);
    
    if (this.activeModals.size === 0) {
      document.body.style.overflow = '';
    }
    
    return true;
  }

  toggle(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return false;
    
    const isOpen = modal.classList.contains('show');
    return isOpen ? this.hide(modalId) : this.show(modalId);
  }

  hideAll() {
    this.activeModals.forEach(modalId => this.hide(modalId));
  }

  isOpen(modalId) {
    return this.activeModals.has(modalId);
  }

  getActiveModals() {
    return Array.from(this.activeModals);
  }
}

// Create and expose global instance
window.ModalManager = new ModalManager();
