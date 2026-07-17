function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var LS_MUTED = 'notif_muted';
var LS_VOLUME = 'notif_volume';
var LS_SOUND_TYPES_ADMIN = 'notif_sound_types_admin';
var LS_SOUND_TYPES_USER = 'notif_sound_types_user';
var DEFAULT_VOLUME = 0.42;
var CHAT_SOUND_SRC = '/audio/thongbao.mp3';
var ACTION_ALERT_SOUND_SRC = '/audio/tingting.mp3';
function getScopeFromPathname() {
  try {
    var _window$location;
    var path = String(((_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.pathname) || '').toLowerCase();
    return path.startsWith('/admin') ? 'admin' : 'user';
  } catch (_) {
    return 'user';
  }
}
function getSoundTypesStorageKey(scope) {
  return scope === 'admin' ? LS_SOUND_TYPES_ADMIN : LS_SOUND_TYPES_USER;
}
var singleton = null;
var NotificationSoundManager = /*#__PURE__*/function () {
  function NotificationSoundManager() {
    _classCallCheck(this, NotificationSoundManager);
    this.ctx = null;
    this.ready = false;
    this.lastPlayAt = 0;
    this.unlockBound = false;
    this.unlockHandler = this.onUnlock.bind(this);
    this.chatAudio = null;
    this.chatAudioReady = false;
    this.chatAudioWarmed = false;
    this.actionAudio = null;
    this.actionAudioReady = false;
    this.actionAudioWarmed = false;
  }
  return _createClass(NotificationSoundManager, [{
    key: "ensureChatAudio",
    value: function ensureChatAudio() {
      if (this.chatAudioReady && this.chatAudio) return this.chatAudio;
      try {
        this.chatAudio = new Audio(CHAT_SOUND_SRC);
        this.chatAudio.preload = 'auto';
        this.chatAudioReady = true;
      } catch (_) {
        this.chatAudio = null;
        this.chatAudioReady = false;
      }
      return this.chatAudio;
    }
  }, {
    key: "playChatNotificationMp3",
    value: function () {
      var _playChatNotificationMp = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var audio, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.muted) {
                _context.n = 1;
                break;
              }
              return _context.a(2, false);
            case 1:
              audio = this.ensureChatAudio();
              if (audio) {
                _context.n = 2;
                break;
              }
              return _context.a(2, false);
            case 2:
              _context.p = 2;
              audio.pause();
              audio.currentTime = 0;
              audio.playbackRate = 1;
              audio.preservesPitch = true;
              // Keep mp3 close to original loudness (avoid sounding too soft vs source file)
              audio.volume = Math.min(1, Math.max(0.75, this.volume));
              _context.n = 3;
              return audio.play();
            case 3:
              return _context.a(2, true);
            case 4:
              _context.p = 4;
              _t = _context.v;
              return _context.a(2, false);
          }
        }, _callee, this, [[2, 4]]);
      }));
      function playChatNotificationMp3() {
        return _playChatNotificationMp.apply(this, arguments);
      }
      return playChatNotificationMp3;
    }()
  }, {
    key: "ensureActionAudio",
    value: function ensureActionAudio() {
      if (this.actionAudioReady && this.actionAudio) return this.actionAudio;
      try {
        this.actionAudio = new Audio(ACTION_ALERT_SOUND_SRC);
        this.actionAudio.preload = 'auto';
        this.actionAudioReady = true;
      } catch (_) {
        this.actionAudio = null;
        this.actionAudioReady = false;
      }
      return this.actionAudio;
    }
  }, {
    key: "playActionNotificationMp3",
    value: function () {
      var _playActionNotificationMp = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var audio, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if (!this.muted) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, false);
            case 1:
              audio = this.ensureActionAudio();
              if (audio) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, false);
            case 2:
              _context2.p = 2;
              audio.pause();
              audio.currentTime = 0;
              audio.playbackRate = 1;
              audio.preservesPitch = true;
              audio.volume = Math.min(1, Math.max(0.75, this.volume));
              _context2.n = 3;
              return audio.play();
            case 3:
              return _context2.a(2, true);
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              return _context2.a(2, false);
          }
        }, _callee2, this, [[2, 4]]);
      }));
      function playActionNotificationMp3() {
        return _playActionNotificationMp.apply(this, arguments);
      }
      return playActionNotificationMp3;
    }()
  }, {
    key: "bindGestureUnlock",
    value: function bindGestureUnlock() {
      if (this.unlockBound) return;
      this.unlockBound = true;
      var events = ['pointerdown', 'touchstart', 'keydown', 'click'];
      for (var _i = 0, _events = events; _i < _events.length; _i++) {
        var evt = _events[_i];
        document.addEventListener(evt, this.unlockHandler, {
          passive: true,
          capture: true
        });
      }
    }
  }, {
    key: "onUnlock",
    value: function () {
      var _onUnlock = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var ok, events, _i2, _events2, evt;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.setAudioReady();
            case 1:
              ok = _context3.v;
              if (ok) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2);
            case 2:
              events = ['pointerdown', 'touchstart', 'keydown', 'click'];
              for (_i2 = 0, _events2 = events; _i2 < _events2.length; _i2++) {
                evt = _events2[_i2];
                document.removeEventListener(evt, this.unlockHandler, true);
              }
            case 3:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function onUnlock() {
        return _onUnlock.apply(this, arguments);
      }
      return onUnlock;
    }()
  }, {
    key: "setAudioReady",
    value: function () {
      var _setAudioReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var Ctx, _t3, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              if (!this.ready) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2, true);
            case 1:
              if (this.ctx) {
                _context4.n = 5;
                break;
              }
              _context4.p = 2;
              Ctx = window.AudioContext || window.webkitAudioContext;
              if (Ctx) {
                _context4.n = 3;
                break;
              }
              return _context4.a(2, false);
            case 3:
              this.ctx = new Ctx({
                latencyHint: 'interactive'
              });
              _context4.n = 5;
              break;
            case 4:
              _context4.p = 4;
              _t3 = _context4.v;
              return _context4.a(2, false);
            case 5:
              if (!(!this.ctx || this.ctx.state === 'closed')) {
                _context4.n = 6;
                break;
              }
              return _context4.a(2, false);
            case 6:
              if (!(this.ctx.state !== 'running')) {
                _context4.n = 10;
                break;
              }
              _context4.p = 7;
              _context4.n = 8;
              return this.ctx.resume();
            case 8:
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t4 = _context4.v;
              return _context4.a(2, false);
            case 10:
              this.ready = this.ctx.state === 'running';
              if (this.ready) {
                this.warmupChatAudio().catch(function () {});
                this.warmupActionAudio().catch(function () {});
              }
              return _context4.a(2, this.ready);
          }
        }, _callee4, this, [[7, 9], [2, 4]]);
      }));
      function setAudioReady() {
        return _setAudioReady.apply(this, arguments);
      }
      return setAudioReady;
    }()
  }, {
    key: "warmupChatAudio",
    value: function () {
      var _warmupChatAudio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var audio, prevMuted, prevVolume, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              if (!this.chatAudioWarmed) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, true);
            case 1:
              audio = this.ensureChatAudio();
              if (audio) {
                _context5.n = 2;
                break;
              }
              return _context5.a(2, false);
            case 2:
              _context5.p = 2;
              prevMuted = audio.muted;
              prevVolume = audio.volume;
              audio.muted = true;
              audio.volume = 0;
              _context5.n = 3;
              return audio.play();
            case 3:
              audio.pause();
              audio.currentTime = 0;
              audio.muted = prevMuted;
              audio.volume = prevVolume;
              this.chatAudioWarmed = true;
              return _context5.a(2, true);
            case 4:
              _context5.p = 4;
              _t5 = _context5.v;
              return _context5.a(2, false);
          }
        }, _callee5, this, [[2, 4]]);
      }));
      function warmupChatAudio() {
        return _warmupChatAudio.apply(this, arguments);
      }
      return warmupChatAudio;
    }()
  }, {
    key: "warmupActionAudio",
    value: function () {
      var _warmupActionAudio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var audio, prevMuted, prevVolume, _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              if (!this.actionAudioWarmed) {
                _context6.n = 1;
                break;
              }
              return _context6.a(2, true);
            case 1:
              audio = this.ensureActionAudio();
              if (audio) {
                _context6.n = 2;
                break;
              }
              return _context6.a(2, false);
            case 2:
              _context6.p = 2;
              prevMuted = audio.muted;
              prevVolume = audio.volume;
              audio.muted = true;
              audio.volume = 0;
              _context6.n = 3;
              return audio.play();
            case 3:
              audio.pause();
              audio.currentTime = 0;
              audio.muted = prevMuted;
              audio.volume = prevVolume;
              this.actionAudioWarmed = true;
              return _context6.a(2, true);
            case 4:
              _context6.p = 4;
              _t6 = _context6.v;
              return _context6.a(2, false);
          }
        }, _callee6, this, [[2, 4]]);
      }));
      function warmupActionAudio() {
        return _warmupActionAudio.apply(this, arguments);
      }
      return warmupActionAudio;
    }()
  }, {
    key: "muted",
    get: function get() {
      return localStorage.getItem(LS_MUTED) === '1';
    },
    set: function set(next) {
      localStorage.setItem(LS_MUTED, next ? '1' : '0');
    }
  }, {
    key: "volume",
    get: function get() {
      var raw = parseFloat(localStorage.getItem(LS_VOLUME));
      if (Number.isNaN(raw)) return DEFAULT_VOLUME;
      return Math.max(0.05, Math.min(1, raw));
    },
    set: function set(next) {
      var value = Math.max(0.05, Math.min(1, Number(next) || DEFAULT_VOLUME));
      localStorage.setItem(LS_VOLUME, String(value));
    }
  }, {
    key: "getScope",
    value: function getScope() {
      return getScopeFromPathname();
    }
  }, {
    key: "getTypeSettings",
    value: function getTypeSettings(scope) {
      var normalizedScope = scope === 'admin' ? 'admin' : 'user';
      var key = getSoundTypesStorageKey(normalizedScope);
      var parsed = {};
      try {
        parsed = JSON.parse(localStorage.getItem(key) || '{}') || {};
      } catch (_) {
        parsed = {};
      }
      return parsed && _typeof(parsed) === 'object' ? parsed : {};
    }
  }, {
    key: "isTypeEnabled",
    value: function isTypeEnabled(type, scope) {
      var settings = this.getTypeSettings(scope || this.getScope());
      if (!Object.prototype.hasOwnProperty.call(settings, type)) return true;
      return settings[type] !== false;
    }
  }, {
    key: "setTypeEnabled",
    value: function setTypeEnabled(type, enabled, scope) {
      var normalizedType = String(type || '').trim();
      if (!normalizedType) return;
      var normalizedScope = scope === 'admin' ? 'admin' : scope === 'user' ? 'user' : this.getScope();
      var key = getSoundTypesStorageKey(normalizedScope);
      var settings = this.getTypeSettings(normalizedScope);
      settings[normalizedType] = enabled !== false;
      localStorage.setItem(key, JSON.stringify(settings));
    }
  }, {
    key: "toggleType",
    value: function toggleType(type, scope) {
      var next = !this.isTypeEnabled(type, scope);
      this.setTypeEnabled(type, next, scope);
      return {
        type: type,
        enabled: next,
        scope: scope || this.getScope()
      };
    }
  }, {
    key: "playSound",
    value: function playSound() {
      var _this = this;
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'message';
      if (this.muted) return;
      if (!this.isTypeEnabled(type)) return;
      var isChatType = type === 'message' || type === 'admin_message' || type === 'admin_in_chat';
      var isActionAlertType = type === 'withdraw' || type === 'gift' || type === 'wallet_approved' || type === 'wallet_rejected' || type === 'gift_approved' || type === 'gift_rejected' || type === 'special_prize_approved' || type === 'special_prize_rejected' || type === 'conversion_approved' || type === 'conversion_rejected';
      if (isChatType) {
        this.playChatNotificationMp3().then(function (ok) {
          if (ok) return;
          // Retry once after forcing audio ready/warmup.
          _this.setAudioReady().then(function () {
            return _this.warmupChatAudio();
          }).then(function () {
            return _this.playChatNotificationMp3();
          }).catch(function () {});
        });
        return;
      }
      if (isActionAlertType) {
        this.playActionNotificationMp3().then(function (ok) {
          if (ok) return;
          _this.setAudioReady().then(function () {
            return _this.warmupActionAudio();
          }).then(function () {
            return _this.playActionNotificationMp3();
          }).catch(function () {});
        });
        return;
      }
      if (document.hidden || !this.ready || !this.ctx) return;
      var now = performance.now();
      if (now - this.lastPlayAt < 120) return;
      this.lastPlayAt = now;
      var vol = this.volume;
      if (type === 'gift') {
        this.tone(523, 523, 0.11, vol * 0.4, 0);
        this.tone(659, 659, 0.12, vol * 0.4, 0.11);
        this.tone(784, 784, 0.14, vol * 0.45, 0.24);
        return;
      }
      if (type === 'withdraw') {
        this.tone(1318, 1318, 0.08, vol * 0.5, 0);
        this.tone(1568, 1568, 0.11, vol * 0.5, 0.11);
        return;
      }
      if (type === 'system') {
        this.tone(587, 659, 0.08, vol * 0.25, 0);
        this.tone(784, 784, 0.08, vol * 0.22, 0.1);
        return;
      }
      this.tone(740, 740, 0.12, vol * 0.35, 0);
      this.tone(988, 988, 0.14, vol * 0.3, 0.12);
    }
  }, {
    key: "tone",
    value: function tone(freqA, freqB, duration, volume, offsetSec) {
      var ctx = this.ctx;
      if (!ctx || ctx.state !== 'running') return;
      var start = ctx.currentTime + (offsetSec || 0);
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqA, start);
      if (freqB !== freqA) {
        osc.frequency.exponentialRampToValueAtTime(freqB, start + duration);
      }
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    }
  }, {
    key: "toggleMute",
    value: function toggleMute() {
      this.muted = !this.muted;
      if (!this.muted) this.playSound('message');
      return {
        muted: this.muted,
        icon: this.muted ? '🔕' : '🔔'
      };
    }
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close().catch(function () {});
      }
      this.ctx = null;
      this.ready = false;
    }
  }]);
}();
function getNotificationSound() {
  if (singleton) return singleton;
  singleton = new NotificationSoundManager();
  singleton.bindGestureUnlock();

  // Keep backward compatibility for legacy callers.
  window.notificationSound = {
    playSound: function playSound(type) {
      return singleton.playSound(type);
    },
    setAudioReady: function setAudioReady() {
      return singleton.setAudioReady();
    },
    toggleMute: function toggleMute() {
      return singleton.toggleMute();
    },
    toggle: function toggle() {
      return singleton.toggleMute();
    },
    isMuted: function isMuted() {
      return singleton.muted;
    },
    setVolume: function setVolume(v) {
      singleton.volume = v;
    },
    getScope: function getScope() {
      return singleton.getScope();
    },
    getTypeSettings: function getTypeSettings(scope) {
      return singleton.getTypeSettings(scope);
    },
    isTypeEnabled: function isTypeEnabled(type, scope) {
      return singleton.isTypeEnabled(type, scope);
    },
    setTypeEnabled: function setTypeEnabled(type, enabled, scope) {
      return singleton.setTypeEnabled(type, enabled, scope);
    },
    toggleType: function toggleType(type, scope) {
      return singleton.toggleType(type, scope);
    }
  };
  return singleton;
}
window.NotificationSoundModule = window.NotificationSoundModule || {
  getNotificationSound: getNotificationSound
};