function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * MODAL MANAGER - Simple & Reliable
 * Handles all modal show/hide operations
 */
var ModalManager = /*#__PURE__*/function () {
  function ModalManager() {
    _classCallCheck(this, ModalManager);
    this.activeModals = new Set();
    this.setupEventListeners();
  }
  return _createClass(ModalManager, [{
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // ESC key closes modals
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          _this.hideAll();
        }
      });

      // Click overlay to close
      document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-overlay')) {
          var modal = e.target.nextElementSibling;
          if (modal && modal.id) {
            _this.hide(modal.id);
          }
        }
      }, true);
    }
  }, {
    key: "show",
    value: function show(modalId) {
      var modal = document.getElementById(modalId);
      var overlay = document.getElementById(modalId + 'Overlay');
      if (!modal) {
        return false;
      }
      if (modal) modal.classList.add('show');
      if (overlay) overlay.classList.add('show');
      this.activeModals.add(modalId);
      document.body.style.overflow = 'hidden';
      return true;
    }
  }, {
    key: "hide",
    value: function hide(modalId) {
      var modal = document.getElementById(modalId);
      var overlay = document.getElementById(modalId + 'Overlay');
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
  }, {
    key: "toggle",
    value: function toggle(modalId) {
      var modal = document.getElementById(modalId);
      if (!modal) return false;
      var isOpen = modal.classList.contains('show');
      return isOpen ? this.hide(modalId) : this.show(modalId);
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      var _this2 = this;
      this.activeModals.forEach(function (modalId) {
        return _this2.hide(modalId);
      });
    }
  }, {
    key: "isOpen",
    value: function isOpen(modalId) {
      return this.activeModals.has(modalId);
    }
  }, {
    key: "getActiveModals",
    value: function getActiveModals() {
      return Array.from(this.activeModals);
    }
  }]);
}(); // Create and expose global instance
window.ModalManager = new ModalManager();