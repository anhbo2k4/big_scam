/**
 * Lucky Box Manager
 * Handles session persistence (24hr), box opening state, and confirmation steps
 */

class LuckyBoxManager {
  constructor() {
    this.SESSION_KEY = 'lmb_session_code';
    this.SESSION_TIME_KEY = 'lmb_session_time';
    this.SESSION_EXPIRES_KEY = 'lmb_session_expires';
    this.BOXES_STATE_KEY = 'lmb_boxes_state';
    this.SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    this.GAME_DURATION = 48 * 60 * 60 * 1000; // 48 hours (for countdown display)
    this.MAX_BOXES = 3;
    
    this.init();
  }

  /**
   * Initialize - restore session from localStorage
   */
  init() {
    this.restoreSession();
  }

  /**
   * Save session code with 24-hour expiration
   */
  saveSession(sessionCode) {
    const now = Date.now();
    const expiresAt = now + this.SESSION_DURATION;

    localStorage.setItem(this.SESSION_KEY, sessionCode);
    localStorage.setItem(this.SESSION_TIME_KEY, now.toString());
    localStorage.setItem(this.SESSION_EXPIRES_KEY, expiresAt.toString());

    // Initialize boxes state for this session
    this.initBoxesState();
  }

  /**
   * Restore session from localStorage if still valid
   */
  restoreSession() {
    const sessionCode = localStorage.getItem(this.SESSION_KEY);
    const expiresAt = localStorage.getItem(this.SESSION_EXPIRES_KEY);

    if (!sessionCode || !expiresAt) {
      return null;
    }

    // Check if session expired
    if (Date.now() > parseInt(expiresAt)) {
      this.clearSession();
      return null;
    }

    return sessionCode;
  }

  /**
   * Check if saved session is still valid
   */
  isSessionValid(sessionCode) {
    const saved = this.restoreSession();
    return saved === sessionCode;
  }

  /**
   * Clear all session data
   */
  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_TIME_KEY);
    localStorage.removeItem(this.SESSION_EXPIRES_KEY);
    localStorage.removeItem(this.BOXES_STATE_KEY);
  }

  /**
   * Get session expiration time in milliseconds
   */
  getSessionExpiresIn() {
    const expiresAt = localStorage.getItem(this.SESSION_EXPIRES_KEY);
    if (!expiresAt) return 0;

    const remaining = parseInt(expiresAt) - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Initialize boxes state for new session
   */
  initBoxesState() {
    const boxesState = {
      sessionCode: localStorage.getItem(this.SESSION_KEY),
      createdAt: Date.now(),
      openOrder: [1, 2, 3],
      openedBoxes: [],  // Array of box numbers opened: [1, 2, ...]
      confirmationPending: false,  // Is user pendding to confirm current box?
      currentBoxNumber: null,  // Which box is currently being processed?
      boxStates: {
        1: { opened: false, confirmed: false, prize: null },
        2: { opened: false, confirmed: false, prize: null },
        3: { opened: false, confirmed: false, prize: null }
      }
    };

    localStorage.setItem(this.BOXES_STATE_KEY, JSON.stringify(boxesState));
    return boxesState;
  }

  /**
   * Get current boxes state
   */
  getBoxesState() {
    const state = localStorage.getItem(this.BOXES_STATE_KEY);
    if (!state) {
      return this.initBoxesState();
    }
    try {
      const parsed = JSON.parse(state);
      if (!Array.isArray(parsed.openOrder) || parsed.openOrder.length !== this.MAX_BOXES) {
        parsed.openOrder = [1, 2, 3];
      }
      return parsed;
    } catch (e) {
      return this.initBoxesState();
    }
  }

  setOpenOrder(order = [1, 2, 3]) {
    const normalized = Array.isArray(order)
      ? [...new Set(order.map(v => parseInt(v, 10)).filter(v => v >= 1 && v <= this.MAX_BOXES))]
      : [];
    const finalOrder = normalized.length === this.MAX_BOXES ? normalized : [1, 2, 3];

    const boxesState = this.getBoxesState();
    boxesState.openOrder = finalOrder;
    this.saveBoxesState(boxesState);
  }

  getOpenOrder() {
    const boxesState = this.getBoxesState();
    return Array.isArray(boxesState.openOrder) && boxesState.openOrder.length === this.MAX_BOXES
      ? boxesState.openOrder
      : [1, 2, 3];
  }

  /**
   * Save boxes state
   */
  saveBoxesState(boxesState) {
    localStorage.setItem(this.BOXES_STATE_KEY, JSON.stringify(boxesState));
  }

  /**
   * Mark a box as opened
   */
  markBoxOpened(boxNumber, prize = null) {
    const boxesState = this.getBoxesState();

    if (boxNumber < 1 || boxNumber > this.MAX_BOXES) {
      throw new Error('Invalid box number');
    }

    boxesState.boxStates[boxNumber].opened = true;
    boxesState.boxStates[boxNumber].prize = prize;
    boxesState.currentBoxNumber = boxNumber;
    boxesState.confirmationPending = true;
    boxesState.openedBoxes.push(boxNumber);

    // Remove duplicates
    boxesState.openedBoxes = [...new Set(boxesState.openedBoxes)];

    this.saveBoxesState(boxesState);
  }

  /**
   * Confirm current box (user accepted or exchanged)
   */
  confirmCurrentBox() {
    const boxesState = this.getBoxesState();

    if (!boxesState.currentBoxNumber) {
      return false;
    }

    const boxNum = boxesState.currentBoxNumber;
    boxesState.boxStates[boxNum].confirmed = true;
    boxesState.confirmationPending = false;
    boxesState.currentBoxNumber = null;

    this.saveBoxesState(boxesState);
    return true;
  }

  /**
   * Check if user can open a new box
   */
  canOpenBox() {
    const boxesState = this.getBoxesState();

    // Cannot open if confirmation is pending
    if (boxesState.confirmationPending) {
      return {
        allowed: false,
        reason: 'Bạn phải xác nhận hộp hiện tại trước'
      };
    }

    // Cannot open more than 3 boxes
    if (boxesState.openedBoxes.length >= this.MAX_BOXES) {
      return {
        allowed: false,
        reason: 'Bạn đã mở hết số hộp cho phép (tối đa 3)'
      };
    }

    return {
      allowed: true,
      reason: 'OK'
    };
  }

  /**
   * Check if a specific box can be opened
   */
  canOpenSpecificBox(boxNumber) {
    const boxesState = this.getBoxesState();

    // Check basic constraint
    const basicCheck = this.canOpenBox();
    if (!basicCheck.allowed) {
      return basicCheck;
    }

    // Check if box already opened
    if (boxesState.boxStates[boxNumber].opened) {
      return {
        allowed: false,
        reason: `Hộp #${boxNumber} đã được mở rồi`
      };
    }

    const nextBox = this.getNextBoxToOpen();
    if (nextBox && boxNumber !== nextBox) {
      return {
        allowed: false,
        reason: `Bạn phải mở hộp #${nextBox} trước`
      };
    }

    return {
      allowed: true,
      reason: 'OK'
    };
  }

  /**
   * Sync opened boxes from server data
   */
  syncOpenedBoxes(inventoryItems = []) {
    const boxesState = this.getBoxesState();
    const openedFromServer = Array.isArray(inventoryItems)
      ? inventoryItems.map(item => Number(item.box_number || item.boxNumber)).filter(n => n >= 1 && n <= this.MAX_BOXES)
      : [];
    const unique = [...new Set(openedFromServer)];

    const pendingItems = Array.isArray(inventoryItems)
      ? inventoryItems.filter(item => {
          const status = String(item.status || '').toLowerCase();
          const level = String(item.level || item.prize_level || item.prize_status || '').toUpperCase();
          return status === 'obtained' && level !== 'UNLUCKY';
        })
      : [];
    const pendingBox = pendingItems.length > 0
      ? Number(pendingItems[0].box_number || pendingItems[0].boxNumber || null)
      : null;

    boxesState.openedBoxes = unique;
    boxesState.currentBoxNumber = pendingBox && pendingBox >= 1 && pendingBox <= this.MAX_BOXES ? pendingBox : null;
    boxesState.confirmationPending = !!boxesState.currentBoxNumber;

    for (let i = 1; i <= this.MAX_BOXES; i++) {
      const opened = unique.includes(i);
      boxesState.boxStates[i].opened = opened;
      if (!opened) {
        boxesState.boxStates[i].confirmed = false;
      } else {
        const row = Array.isArray(inventoryItems)
          ? inventoryItems.find(item => Number(item.box_number || item.boxNumber) === i)
          : null;
        const rowStatus = String(row?.status || '').toLowerCase();
        const rowLevel = String(row?.level || row?.prize_level || row?.prize_status || '').toUpperCase();
        boxesState.boxStates[i].confirmed = rowStatus !== 'obtained' || rowLevel === 'UNLUCKY';
      }
    }

    this.saveBoxesState(boxesState);
  }

  getNextBoxToOpen() {
    const boxesState = this.getBoxesState();
    const order = Array.isArray(boxesState.openOrder) && boxesState.openOrder.length === this.MAX_BOXES
      ? boxesState.openOrder
      : [1, 2, 3];
    for (let i = 0; i < order.length; i++) {
      if (!boxesState.openedBoxes.includes(order[i])) {
        return order[i];
      }
    }
    return null;
  }

  /**
   * Get count of opened boxes
   */
  getOpenedCount() {
    const boxesState = this.getBoxesState();
    return boxesState.openedBoxes.length;
  }

  /**
   * Get remaining boxes count
   */
  getRemainingCount() {
    return this.MAX_BOXES - this.getOpenedCount();
  }

  /**
   * Get which boxes are opened
   */
  getOpenedBoxes() {
    const boxesState = this.getBoxesState();
    return boxesState.openedBoxes;
  }

  /**
   * Format time remaining (e.g., "2 soát 30 phút")
   */
  formatTimeRemaining(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else if (minutes > 0) {
      return `${minutes} phút`;
    } else {
      return `${totalSeconds} giây`;
    }
  }

  /**
   * Get session info for display
   */
  getSessionInfo() {
    return {
      sessionCode: localStorage.getItem(this.SESSION_KEY),
      expiresIn: this.getSessionExpiresIn(),
      expiresInFormatted: this.formatTimeRemaining(this.getSessionExpiresIn()),
      openedCount: this.getOpenedCount(),
      remainingCount: this.getRemainingCount(),
      openedBoxes: this.getOpenedBoxes(),
      openOrder: this.getOpenOrder(),
      nextBox: this.getNextBoxToOpen(),
      isValid: this.getSessionExpiresIn() > 0
    };
  }

  /**
   * Is confirmation currently pending?
   */
  isPendingConfirmation() {
    const boxesState = this.getBoxesState();
    return boxesState.confirmationPending;
  }

  /**
   * Get current pending box number
   */
  getCurrentBoxNumber() {
    const boxesState = this.getBoxesState();
    return boxesState.currentBoxNumber;
  }

  /**
   * Update UI to disable boxes based on opened_count and confirmation status
   */
  updateBoxUI() {
    const boxesState = this.getBoxesState();
    const { openedBoxes, confirmationPending } = boxesState;

    for (let i = 1; i <= this.MAX_BOXES; i++) {
      const boxElement = document.querySelector(`#box-${i}`);
      if (!boxElement) continue;

      if (openedBoxes.includes(i)) {
        boxElement.disabled = true;
      } else if (confirmationPending) {
        boxElement.disabled = true;
      } else {
        boxElement.disabled = false;
      }
    }
  }
}

// Create global instance
const lmbManager = new LuckyBoxManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LuckyBoxManager, lmbManager };
}
