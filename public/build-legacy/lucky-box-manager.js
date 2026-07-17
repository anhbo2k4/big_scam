function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Lucky Box Manager
 * Handles session persistence (24hr), box opening state, and confirmation steps
 */
var LuckyBoxManager = /*#__PURE__*/function () {
  function LuckyBoxManager() {
    _classCallCheck(this, LuckyBoxManager);
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
  return _createClass(LuckyBoxManager, [{
    key: "init",
    value: function init() {
      this.restoreSession();
    }

    /**
     * Save session code with 24-hour expiration
     */
  }, {
    key: "saveSession",
    value: function saveSession(sessionCode) {
      var now = Date.now();
      var expiresAt = now + this.SESSION_DURATION;
      localStorage.setItem(this.SESSION_KEY, sessionCode);
      localStorage.setItem(this.SESSION_TIME_KEY, now.toString());
      localStorage.setItem(this.SESSION_EXPIRES_KEY, expiresAt.toString());

      // Initialize boxes state for this session
      this.initBoxesState();
    }

    /**
     * Restore session from localStorage if still valid
     */
  }, {
    key: "restoreSession",
    value: function restoreSession() {
      var sessionCode = localStorage.getItem(this.SESSION_KEY);
      var expiresAt = localStorage.getItem(this.SESSION_EXPIRES_KEY);
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
  }, {
    key: "isSessionValid",
    value: function isSessionValid(sessionCode) {
      var saved = this.restoreSession();
      return saved === sessionCode;
    }

    /**
     * Clear all session data
     */
  }, {
    key: "clearSession",
    value: function clearSession() {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_TIME_KEY);
      localStorage.removeItem(this.SESSION_EXPIRES_KEY);
      localStorage.removeItem(this.BOXES_STATE_KEY);
    }

    /**
     * Get session expiration time in milliseconds
     */
  }, {
    key: "getSessionExpiresIn",
    value: function getSessionExpiresIn() {
      var expiresAt = localStorage.getItem(this.SESSION_EXPIRES_KEY);
      if (!expiresAt) return 0;
      var remaining = parseInt(expiresAt) - Date.now();
      return Math.max(0, remaining);
    }

    /**
     * Initialize boxes state for new session
     */
  }, {
    key: "initBoxesState",
    value: function initBoxesState() {
      var boxesState = {
        sessionCode: localStorage.getItem(this.SESSION_KEY),
        createdAt: Date.now(),
        openOrder: [1, 2, 3],
        openedBoxes: [],
        // Array of box numbers opened: [1, 2, ...]
        confirmationPending: false,
        // Is user pendding to confirm current box?
        currentBoxNumber: null,
        // Which box is currently being processed?
        boxStates: {
          1: {
            opened: false,
            confirmed: false,
            prize: null
          },
          2: {
            opened: false,
            confirmed: false,
            prize: null
          },
          3: {
            opened: false,
            confirmed: false,
            prize: null
          }
        }
      };
      localStorage.setItem(this.BOXES_STATE_KEY, JSON.stringify(boxesState));
      return boxesState;
    }

    /**
     * Get current boxes state
     */
  }, {
    key: "getBoxesState",
    value: function getBoxesState() {
      var state = localStorage.getItem(this.BOXES_STATE_KEY);
      if (!state) {
        return this.initBoxesState();
      }
      try {
        var parsed = JSON.parse(state);
        if (!Array.isArray(parsed.openOrder) || parsed.openOrder.length !== this.MAX_BOXES) {
          parsed.openOrder = [1, 2, 3];
        }
        return parsed;
      } catch (e) {
        return this.initBoxesState();
      }
    }
  }, {
    key: "setOpenOrder",
    value: function setOpenOrder() {
      var _this = this;
      var order = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1, 2, 3];
      var normalized = Array.isArray(order) ? _toConsumableArray(new Set(order.map(function (v) {
        return parseInt(v, 10);
      }).filter(function (v) {
        return v >= 1 && v <= _this.MAX_BOXES;
      }))) : [];
      var finalOrder = normalized.length === this.MAX_BOXES ? normalized : [1, 2, 3];
      var boxesState = this.getBoxesState();
      boxesState.openOrder = finalOrder;
      this.saveBoxesState(boxesState);
    }
  }, {
    key: "getOpenOrder",
    value: function getOpenOrder() {
      var boxesState = this.getBoxesState();
      return Array.isArray(boxesState.openOrder) && boxesState.openOrder.length === this.MAX_BOXES ? boxesState.openOrder : [1, 2, 3];
    }

    /**
     * Save boxes state
     */
  }, {
    key: "saveBoxesState",
    value: function saveBoxesState(boxesState) {
      localStorage.setItem(this.BOXES_STATE_KEY, JSON.stringify(boxesState));
    }

    /**
     * Mark a box as opened
     */
  }, {
    key: "markBoxOpened",
    value: function markBoxOpened(boxNumber) {
      var prize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var boxesState = this.getBoxesState();
      if (boxNumber < 1 || boxNumber > this.MAX_BOXES) {
        throw new Error('Invalid box number');
      }
      boxesState.boxStates[boxNumber].opened = true;
      boxesState.boxStates[boxNumber].prize = prize;
      boxesState.currentBoxNumber = boxNumber;
      boxesState.confirmationPending = true;
      boxesState.openedBoxes.push(boxNumber);

      // Remove duplicates
      boxesState.openedBoxes = _toConsumableArray(new Set(boxesState.openedBoxes));
      this.saveBoxesState(boxesState);
    }

    /**
     * Confirm current box (user accepted or exchanged)
     */
  }, {
    key: "confirmCurrentBox",
    value: function confirmCurrentBox() {
      var boxesState = this.getBoxesState();
      if (!boxesState.currentBoxNumber) {
        return false;
      }
      var boxNum = boxesState.currentBoxNumber;
      boxesState.boxStates[boxNum].confirmed = true;
      boxesState.confirmationPending = false;
      boxesState.currentBoxNumber = null;
      this.saveBoxesState(boxesState);
      return true;
    }

    /**
     * Check if user can open a new box
     */
  }, {
    key: "canOpenBox",
    value: function canOpenBox() {
      var boxesState = this.getBoxesState();

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
  }, {
    key: "canOpenSpecificBox",
    value: function canOpenSpecificBox(boxNumber) {
      var boxesState = this.getBoxesState();

      // Check basic constraint
      var basicCheck = this.canOpenBox();
      if (!basicCheck.allowed) {
        return basicCheck;
      }

      // Check if box already opened
      if (boxesState.boxStates[boxNumber].opened) {
        return {
          allowed: false,
          reason: "H\u1ED9p #".concat(boxNumber, " \u0111\xE3 \u0111\u01B0\u1EE3c m\u1EDF r\u1ED3i")
        };
      }
      var nextBox = this.getNextBoxToOpen();
      if (nextBox && boxNumber !== nextBox) {
        return {
          allowed: false,
          reason: "B\u1EA1n ph\u1EA3i m\u1EDF h\u1ED9p #".concat(nextBox, " tr\u01B0\u1EDBc")
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
  }, {
    key: "syncOpenedBoxes",
    value: function syncOpenedBoxes() {
      var _this2 = this;
      var inventoryItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var boxesState = this.getBoxesState();
      var openedFromServer = Array.isArray(inventoryItems) ? inventoryItems.map(function (item) {
        return Number(item.box_number || item.boxNumber);
      }).filter(function (n) {
        return n >= 1 && n <= _this2.MAX_BOXES;
      }) : [];
      var unique = _toConsumableArray(new Set(openedFromServer));
      var pendingItems = Array.isArray(inventoryItems) ? inventoryItems.filter(function (item) {
        var status = String(item.status || '').toLowerCase();
        var level = String(item.level || item.prize_level || item.prize_status || '').toUpperCase();
        return status === 'obtained' && level !== 'UNLUCKY';
      }) : [];
      var pendingBox = pendingItems.length > 0 ? Number(pendingItems[0].box_number || pendingItems[0].boxNumber || null) : null;
      boxesState.openedBoxes = unique;
      boxesState.currentBoxNumber = pendingBox && pendingBox >= 1 && pendingBox <= this.MAX_BOXES ? pendingBox : null;
      boxesState.confirmationPending = !!boxesState.currentBoxNumber;
      var _loop = function _loop(i) {
        var opened = unique.includes(i);
        boxesState.boxStates[i].opened = opened;
        if (!opened) {
          boxesState.boxStates[i].confirmed = false;
        } else {
          var row = Array.isArray(inventoryItems) ? inventoryItems.find(function (item) {
            return Number(item.box_number || item.boxNumber) === i;
          }) : null;
          var rowStatus = String((row === null || row === void 0 ? void 0 : row.status) || '').toLowerCase();
          var rowLevel = String((row === null || row === void 0 ? void 0 : row.level) || (row === null || row === void 0 ? void 0 : row.prize_level) || (row === null || row === void 0 ? void 0 : row.prize_status) || '').toUpperCase();
          boxesState.boxStates[i].confirmed = rowStatus !== 'obtained' || rowLevel === 'UNLUCKY';
        }
      };
      for (var i = 1; i <= this.MAX_BOXES; i++) {
        _loop(i);
      }
      this.saveBoxesState(boxesState);
    }
  }, {
    key: "getNextBoxToOpen",
    value: function getNextBoxToOpen() {
      var boxesState = this.getBoxesState();
      var order = Array.isArray(boxesState.openOrder) && boxesState.openOrder.length === this.MAX_BOXES ? boxesState.openOrder : [1, 2, 3];
      for (var i = 0; i < order.length; i++) {
        if (!boxesState.openedBoxes.includes(order[i])) {
          return order[i];
        }
      }
      return null;
    }

    /**
     * Get count of opened boxes
     */
  }, {
    key: "getOpenedCount",
    value: function getOpenedCount() {
      var boxesState = this.getBoxesState();
      return boxesState.openedBoxes.length;
    }

    /**
     * Get remaining boxes count
     */
  }, {
    key: "getRemainingCount",
    value: function getRemainingCount() {
      return this.MAX_BOXES - this.getOpenedCount();
    }

    /**
     * Get which boxes are opened
     */
  }, {
    key: "getOpenedBoxes",
    value: function getOpenedBoxes() {
      var boxesState = this.getBoxesState();
      return boxesState.openedBoxes;
    }

    /**
     * Format time remaining (e.g., "2 soát 30 phút")
     */
  }, {
    key: "formatTimeRemaining",
    value: function formatTimeRemaining(ms) {
      var totalSeconds = Math.floor(ms / 1000);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor(totalSeconds % 3600 / 60);
      if (hours > 0) {
        return "".concat(hours, " gi\u1EDD ").concat(minutes, " ph\xFAt");
      } else if (minutes > 0) {
        return "".concat(minutes, " ph\xFAt");
      } else {
        return "".concat(totalSeconds, " gi\xE2y");
      }
    }

    /**
     * Get session info for display
     */
  }, {
    key: "getSessionInfo",
    value: function getSessionInfo() {
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
  }, {
    key: "isPendingConfirmation",
    value: function isPendingConfirmation() {
      var boxesState = this.getBoxesState();
      return boxesState.confirmationPending;
    }

    /**
     * Get current pending box number
     */
  }, {
    key: "getCurrentBoxNumber",
    value: function getCurrentBoxNumber() {
      var boxesState = this.getBoxesState();
      return boxesState.currentBoxNumber;
    }

    /**
     * Update UI to disable boxes based on opened_count and confirmation status
     */
  }, {
    key: "updateBoxUI",
    value: function updateBoxUI() {
      var boxesState = this.getBoxesState();
      var openedBoxes = boxesState.openedBoxes,
        confirmationPending = boxesState.confirmationPending;
      for (var i = 1; i <= this.MAX_BOXES; i++) {
        var boxElement = document.querySelector("#box-".concat(i));
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
  }]);
}(); // Create global instance
var lmbManager = new LuckyBoxManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LuckyBoxManager: LuckyBoxManager,
    lmbManager: lmbManager
  };
}