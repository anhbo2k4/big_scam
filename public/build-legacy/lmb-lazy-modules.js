function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
(function initLmbLazyModules(global) {
  if (global.lmbLazyModules) return;
  var loaded = new Set();
  var loading = new Map();
  var loadedScripts = new Set();
  var moduleMap = {
    wallet: {
      endpoint: '/ui/fragments/wallet',
      rootId: 'lazyWalletModule',
      script: '/js/modules/lazy-wallet.js'
    },
    chat: {
      endpoint: '/ui/fragments/chat',
      rootId: 'lazyChatModule',
      script: '/js/modules/lazy-chat.js'
    },
    history: {
      endpoint: '/ui/fragments/history',
      rootId: 'lazyHistoryModule',
      script: '/js/modules/lazy-history.js'
    },
    'admin-status': {
      endpoint: '/ui/fragments/admin-status',
      rootId: 'lazyAdminStatusModule',
      script: '/js/modules/lazy-admin-status.js'
    }
  };
  function loadScriptOnce(url) {
    var key = String(url || '').trim();
    if (!key) return Promise.resolve(true);
    if (loadedScripts.has(key)) return Promise.resolve(true);
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector("script[data-lmb-lazy-module=\"".concat(key, "\"]"));
      if (existing) {
        loadedScripts.add(key);
        resolve(true);
        return;
      }
      var script = document.createElement('script');
      script.src = key;
      script.async = true;
      script.dataset.lmbLazyModule = key;
      script.onload = function () {
        loadedScripts.add(key);
        resolve(true);
      };
      script.onerror = function () {
        return reject(new Error('Failed to load module script'));
      };
      document.head.appendChild(script);
    });
  }
  function hasModule(name) {
    return loaded.has(String(name || '').toLowerCase());
  }
  function ensure(_x) {
    return _ensure.apply(this, arguments);
  }
  function _ensure() {
    _ensure = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(name) {
      var key, cfg, promise;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            key = String(name || '').toLowerCase();
            cfg = moduleMap[key];
            if (cfg) {
              _context2.n = 1;
              break;
            }
            throw new Error('Unknown lazy module');
          case 1:
            if (!loaded.has(key)) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, true);
          case 2:
            if (!loading.has(key)) {
              _context2.n = 3;
              break;
            }
            return _context2.a(2, loading.get(key));
          case 3:
            promise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
              var root, html;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.n) {
                  case 0:
                    root = document.getElementById(cfg.rootId);
                    if (root) {
                      _context.n = 1;
                      break;
                    }
                    return _context.a(2, false);
                  case 1:
                    _context.n = 2;
                    return fetch(cfg.endpoint, {
                      method: 'GET',
                      cache: 'no-store',
                      headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                      }
                    }).then(function (res) {
                      if (!res.ok) throw new Error('Fragment request failed');
                      return res.text();
                    });
                  case 2:
                    html = _context.v;
                    root.innerHTML = html;
                    root.dataset.loaded = '1';
                    if (!cfg.script) {
                      _context.n = 3;
                      break;
                    }
                    _context.n = 3;
                    return loadScriptOnce(cfg.script);
                  case 3:
                    loaded.add(key);
                    loading.delete(key);
                    global.dispatchEvent(new CustomEvent('lmb:module-loaded', {
                      detail: {
                        name: key
                      }
                    }));
                    return _context.a(2, true);
                }
              }, _callee);
            }))().catch(function (err) {
              loading.delete(key);
              throw err;
            });
            loading.set(key, promise);
            return _context2.a(2, promise);
        }
      }, _callee2);
    }));
    return _ensure.apply(this, arguments);
  }
  function preloadDefault() {
    var isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    var preloadKeys = isMobile ? ['wallet', 'chat'] : ['wallet', 'chat'];
    var kick = function kick() {
      preloadKeys.forEach(function (key) {
        ensure(key).catch(function () {});
      });
    };
    if (typeof global.requestIdleCallback === 'function') {
      global.requestIdleCallback(kick, {
        timeout: 1200
      });
    } else {
      setTimeout(kick, 700);
    }
  }
  global.lmbLazyModules = {
    ensure: ensure,
    hasModule: hasModule,
    preloadDefault: preloadDefault
  };
})(window);