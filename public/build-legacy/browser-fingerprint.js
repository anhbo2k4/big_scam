function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Browser Fingerprinting - Client Side
 * Generates a unique fingerprint for the browser/device
 * Used to prevent session hijacking
 */

var fingerprintDataCache = null;
var fingerprintApiCache = null;
var fingerprintInitPromise = null;
var webglCanvasSingleton = null;
var webglContextSingleton = null;
var webglFingerprintCache = null;
var BrowserFingerprint = /*#__PURE__*/function () {
  function BrowserFingerprint() {
    _classCallCheck(this, BrowserFingerprint);
  }
  return _createClass(BrowserFingerprint, null, [{
    key: "getCanvasFingerprint",
    value:
    /**
     * Get canvas fingerprint (hardware acceleration)
     */
    function getCanvasFingerprint() {
      try {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) return 'no-canvas';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#000000';
        ctx.fillText('🎮 Browser Fingerprint', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('🎮 Browser Fingerprint', 4, 17);
        return canvas.toDataURL().substring(0, 50);
      } catch (e) {
        return 'canvas-error';
      }
    }

    /**
     * Get WebGL fingerprint
     */
  }, {
    key: "getWebGLContext",
    value: function getWebGLContext() {
      if (webglContextSingleton) return webglContextSingleton;
      webglCanvasSingleton = webglCanvasSingleton || document.createElement('canvas');
      webglContextSingleton = webglCanvasSingleton.getContext('webgl', {
        preserveDrawingBuffer: false
      }) || webglCanvasSingleton.getContext('experimental-webgl', {
        preserveDrawingBuffer: false
      });
      return webglContextSingleton;
    }
  }, {
    key: "getWebGLFingerprint",
    value: function getWebGLFingerprint() {
      try {
        if (webglFingerprintCache) return webglFingerprintCache;
        var gl = this.getWebGLContext();
        if (!gl) return 'no-webgl';
        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'no-debug-info';
        var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        webglFingerprintCache = "".concat(vendor, "-").concat(renderer).substring(0, 50);
        return webglFingerprintCache;
      } catch (e) {
        return 'webgl-error';
      }
    }

    /**
     * Get screen fingerprint
     */
  }, {
    key: "getScreenFingerprint",
    value: function getScreenFingerprint() {
      var screen = window.screen;
      return {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        devicePixelRatio: window.devicePixelRatio
      };
    }

    /**
     * Get browser fingerprint
     */
  }, {
    key: "getBrowserFingerprint",
    value: function getBrowserFingerprint() {
      return {
        userAgent: navigator.userAgent,
        language: navigator.language || navigator.userLanguage,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
        vendor: navigator.vendor,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        onLine: navigator.onLine
      };
    }

    /**
     * Get timezone fingerprint
     */
  }, {
    key: "getTimezoneFingerprint",
    value: function getTimezoneFingerprint() {
      var now = new Date();
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utcOffset: -now.getTimezoneOffset()
      };
    }

    /**
     * Get plugin fingerprint (if available)
     */
  }, {
    key: "getPluginFingerprint",
    value: function getPluginFingerprint() {
      try {
        if (!navigator.plugins) return 'no-plugins-api';
        var plugins = [];
        for (var i = 0; i < navigator.plugins.length; i++) {
          plugins.push(navigator.plugins[i].name);
        }
        return plugins.join(',');
      } catch (e) {
        return 'plugins-error';
      }
    }

    /**
     * Get font fingerprint
     */
  }, {
    key: "getFontFingerprint",
    value: function getFontFingerprint() {
      var testFonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var getTextWidth = function getTextWidth(text, font) {
        ctx.font = "16px ".concat(font);
        return ctx.measureText(text).width;
      };
      var baseFonts = ['monospace', 'sans-serif', 'serif'];
      var testString = 'mmmmmmmmmmlli';
      var baseWidths = {};
      baseFonts.forEach(function (font) {
        baseWidths[font] = getTextWidth(testString, font);
      });
      var presentFonts = [];
      testFonts.forEach(function (font) {
        baseFonts.forEach(function (baseFont) {
          var width = getTextWidth(testString, "'".concat(font, "', ").concat(baseFont));
          if (width !== baseWidths[baseFont]) {
            presentFonts.push(font);
          }
        });
      });
      return presentFonts.join(',');
    }

    /**
     * Generate complete fingerprint
     */
  }, {
    key: "generate",
    value: function generate() {
      if (fingerprintDataCache) return fingerprintDataCache;
      fingerprintDataCache = {
        screen: this.getScreenFingerprint(),
        browser: this.getBrowserFingerprint(),
        timezone: this.getTimezoneFingerprint(),
        fonts: this.getFontFingerprint(),
        canvas: this.getCanvasFingerprint(),
        webgl: this.getWebGLFingerprint(),
        plugins: this.getPluginFingerprint(),
        generatedAt: new Date().toISOString()
      };
      return fingerprintDataCache;
    }

    /**
     * Generate hash of fingerprint
     */
  }, {
    key: "generateHash",
    value: function generateHash() {
      try {
        var fingerprint = JSON.stringify(this.generate());
        // Convert to simple hash (not cryptographically secure but good for client-side)
        var hash = 0;
        for (var i = 0; i < fingerprint.length; i++) {
          var char = fingerprint.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(16, '0');
      } catch (e) {
        console.error('Error generating fingerprint hash:', e);
        return 'error-' + Date.now();
      }
    }

    /**
     * Get fingerprint and add to form/request
     */
  }, {
    key: "addToForm",
    value: function addToForm(formSelector) {
      try {
        var form = document.querySelector(formSelector);
        if (!form) {
          console.warn("Form not found: ".concat(formSelector));
          return;
        }
        var fingerprint = this.generate();
        var hash = this.generateHash();

        // Create hidden inputs
        var fpInput = form.querySelector('input[name="browserFingerprint"]');
        if (!fpInput) {
          fpInput = document.createElement('input');
          fpInput.type = 'hidden';
          fpInput.name = 'browserFingerprint';
          form.appendChild(fpInput);
        }
        fpInput.value = JSON.stringify(fingerprint);
        var hashInput = form.querySelector('input[name="fingerprintHash"]');
        if (!hashInput) {
          hashInput = document.createElement('input');
          hashInput.type = 'hidden';
          hashInput.name = 'fingerprintHash';
          form.appendChild(hashInput);
        }
        hashInput.value = hash;
        console.log('✅ Browser fingerprint added to form');
      } catch (e) {
        console.error('Error adding fingerprint to form:', e);
      }
    }

    /**
     * Get fingerprint for API request
     */
  }, {
    key: "getForAPI",
    value: function getForAPI() {
      try {
        if (fingerprintApiCache) return fingerprintApiCache;
        var fingerprint = this.generate();
        var hash = this.generateHash();
        fingerprintApiCache = {
          browserFingerprint: JSON.stringify(fingerprint),
          fingerprintHash: hash
        };
        return fingerprintApiCache;
      } catch (e) {
        console.error('Error getting fingerprint for API:', e);
        return {
          browserFingerprint: 'error',
          fingerprintHash: 'error'
        };
      }
    }

    /**
     * Add fingerprint to API request headers
     */
  }, {
    key: "addToHeaders",
    value: function addToHeaders() {
      var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var fp = this.getForAPI();
      return _objectSpread(_objectSpread({}, headers), {}, {
        'X-Browser-Fingerprint': fp.fingerprintHash,
        'X-Fingerprint-Data': fp.browserFingerprint
      });
    }
  }, {
    key: "getForAPIAsync",
    value: function () {
      var _getForAPIAsync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              return _context.a(2, this.getForAPI());
          }
        }, _callee, this);
      }));
      function getForAPIAsync() {
        return _getForAPIAsync.apply(this, arguments);
      }
      return getForAPIAsync;
    }()
  }, {
    key: "initializeCache",
    value: function () {
      var _initializeCache = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _this = this;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (!fingerprintApiCache) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, fingerprintApiCache);
            case 1:
              if (!fingerprintInitPromise) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, fingerprintInitPromise);
            case 2:
              fingerprintInitPromise = Promise.resolve().then(function () {
                return _this.getForAPI();
              });
              return _context2.a(2, fingerprintInitPromise);
          }
        }, _callee2);
      }));
      function initializeCache() {
        return _initializeCache.apply(this, arguments);
      }
      return initializeCache;
    }()
  }]);
}(); // Auto-generate on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(function () {
        BrowserFingerprint.initializeCache().catch(function () {});
      }, {
        timeout: 1000
      });
    } else {
      setTimeout(function () {
        BrowserFingerprint.initializeCache().catch(function () {});
      }, 0);
    }
    console.log('🔐 Browser Fingerprint initialized');
  });
} else {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(function () {
      BrowserFingerprint.initializeCache().catch(function () {});
    }, {
      timeout: 1000
    });
  } else {
    setTimeout(function () {
      BrowserFingerprint.initializeCache().catch(function () {});
    }, 0);
  }
  console.log('🔐 Browser Fingerprint available');
}