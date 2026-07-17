function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * banner-slider.js
 *
 * Lightweight auto-sliding banner system.
 * Used on both the game screen and homepage.
 *
 * Usage:
 *   <div id="bannerSlider" class="banner-slider" data-location="game"></div>
 *   BannerSlider.init('#bannerSlider');
 */
(function (global) {
  'use strict';

  var SLIDE_INTERVAL_MS = 4500;
  var POPUP_DEFAULT_DELAY_MS = 800;
  var _instances = [];
  var _popupShownThisPage = false;
  function BannerSlider(containerEl) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.el = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
    if (!this.el) return;
    this.location = this.el.dataset.location || options.location || 'both';
    this.banners = [];
    this.currentIdx = 0;
    this._timer = null;
    this._track = null;
    this._initialized = false;
  }
  BannerSlider.prototype.init = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var url, res, json, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          url = "/api/banners?location=".concat(encodeURIComponent(this.location));
          _context.n = 1;
          return fetch(url);
        case 1:
          res = _context.v;
          _context.n = 2;
          return res.json();
        case 2:
          json = _context.v;
          this.banners = Array.isArray(json.data) ? json.data : [];
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          this.banners = [];
        case 4:
          if (this.banners.length) {
            _context.n = 5;
            break;
          }
          this.el.style.display = 'none';
          return _context.a(2);
        case 5:
          this._showPopupBannerIfNeeded();

          // Slider area only renders bar/both banners (not popup-only banners).
          this.banners = this.banners.filter(function (b) {
            var type = String(b.display_type || 'bar');
            return type === 'bar' || type === 'both';
          });
          if (this.banners.length) {
            _context.n = 6;
            break;
          }
          this.el.style.display = 'none';
          return _context.a(2);
        case 6:
          this._render();
          this._initialized = true;
          if (this.banners.length > 1) this._startAuto();
        case 7:
          return _context.a(2);
      }
    }, _callee, this, [[0, 3]]);
  }));
  BannerSlider.prototype._showPopupBannerIfNeeded = function () {
    if (_popupShownThisPage) return;
    var candidates = this.banners.filter(function (b) {
      var type = String(b.display_type || 'bar');
      return type === 'popup' || type === 'both';
    });
    if (!candidates.length) return;
    var banner = candidates[0];
    if (!_shouldShowPopup(banner)) return;
    _popupShownThisPage = true;
    var delay = Number(banner.popup_delay_ms || POPUP_DEFAULT_DELAY_MS);
    setTimeout(function () {
      return _renderPopupBanner(banner);
    }, Math.max(0, delay));
  };
  BannerSlider.prototype._render = function () {
    var _this = this;
    this.el.innerHTML = '';
    this.el.classList.add('bs-container');
    var track = document.createElement('div');
    track.className = 'bs-track';
    this._track = track;
    this.banners.forEach(function (b, i) {
      var slide = document.createElement('div');
      slide.className = 'bs-slide' + (i === 0 ? ' bs-active' : '');
      if (b.bg_color) slide.style.background = b.bg_color;
      var inner = '';
      if (b.image_url) {
        inner += "<img class=\"bs-img\" src=\"".concat(_esc(b.image_url), "\" alt=\"").concat(_esc(b.text || ''), "\" loading=\"lazy\">");
      }
      if (b.text) {
        inner += "<span class=\"bs-text\" ".concat(b.text_color ? 'style="color:' + _esc(b.text_color) + '"' : '', ">").concat(_esc(b.text), "</span>");
      }
      if (b.link_url) {
        var anchor = document.createElement('a');
        anchor.className = 'bs-link';
        anchor.href = _esc(b.link_url);
        anchor.target = b.link_target || '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.innerHTML = inner;
        slide.appendChild(anchor);
      } else {
        slide.innerHTML = inner;
      }
      track.appendChild(slide);
    });

    // Dots
    if (this.banners.length > 1) {
      var dots = document.createElement('div');
      dots.className = 'bs-dots';
      this.banners.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'bs-dot' + (i === 0 ? ' bs-dot-active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Banner ' + (i + 1));
        dot.addEventListener('click', function () {
          return _this.goTo(i);
        });
        dots.appendChild(dot);
      });
      this._dots = dots;
      this.el.appendChild(dots);
    }
    this.el.appendChild(track);
  };
  BannerSlider.prototype.goTo = function (idx) {
    if (!this._track) return;
    var slides = this._track.querySelectorAll('.bs-slide');
    var dots = this.el.querySelectorAll('.bs-dot');
    if (slides[this.currentIdx]) slides[this.currentIdx].classList.remove('bs-active');
    if (dots[this.currentIdx]) dots[this.currentIdx].classList.remove('bs-dot-active');
    this.currentIdx = (idx % this.banners.length + this.banners.length) % this.banners.length;
    if (slides[this.currentIdx]) slides[this.currentIdx].classList.add('bs-active');
    if (dots[this.currentIdx]) dots[this.currentIdx].classList.add('bs-dot-active');
  };
  BannerSlider.prototype._startAuto = function () {
    var _this2 = this;
    this._timer = setInterval(function () {
      _this2.goTo(_this2.currentIdx + 1);
    }, SLIDE_INTERVAL_MS);
  };
  BannerSlider.prototype.destroy = function () {
    clearInterval(this._timer);
    this.el.innerHTML = '';
  };
  function _esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function _popupStorageKey(banner) {
    return 'banner_popup_seen_' + String(banner.id || '0');
  }
  function _todayStamp() {
    var d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }
  function _shouldShowPopup(banner) {
    var freq = String(banner.popup_frequency || 'session');
    var key = _popupStorageKey(banner);
    try {
      if (freq === 'always') return true;
      if (freq === 'session') {
        if (sessionStorage.getItem(key) === '1') return false;
        sessionStorage.setItem(key, '1');
        return true;
      }
      if (freq === 'daily') {
        var today = _todayStamp();
        if (localStorage.getItem(key) === today) return false;
        localStorage.setItem(key, today);
        return true;
      }
      return true;
    } catch (_) {
      return true;
    }
  }
  function _renderPopupBanner(banner) {
    var existing = document.getElementById('bsPopupOverlay');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = 'bsPopupOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:12000;background:rgba(2,6,23,0.74);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px;';
    var ratio = _ratioForBanner(banner.aspect_ratio);
    var popupWidth = _safeCssSize(banner.popup_width);
    var popupHeight = _safeCssSize(banner.popup_height);
    var sizeCss = popupWidth ? 'width:' + popupWidth + ';max-width:96vw;' : 'width:min(900px,96vw);';
    var heightCss = popupHeight ? 'height:' + popupHeight + ';max-height:92vh;' : 'aspect-ratio:' + ratio + ';max-height:92vh;';
    var card = document.createElement('div');
    card.className = 'bs-popup-card';
    card.style.cssText = 'position:relative;' + sizeCss + heightCss + 'overflow:hidden;border-radius:16px;background:' + _esc(banner.bg_color || '#0f172a') + ';color:' + _esc(banner.text_color || '#f8fafc') + ';border:1px solid rgba(255,255,255,0.14);box-shadow:0 18px 70px rgba(0,0,0,0.55);';
    _applyPopupShowAnimation(card, String(banner.show_animation || 'zoom'));
    var dismissible = banner.popup_dismissible !== false;
    if (dismissible) {
      var close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'x';
      close.setAttribute('aria-label', 'Dong banner');
      close.style.cssText = 'position:absolute;top:10px;right:10px;width:34px;height:34px;border:none;border-radius:999px;background:rgba(15,23,42,0.72);color:#fff;font-size:16px;cursor:pointer;';
      close.addEventListener('click', function () {
        return ov.remove();
      });
      card.appendChild(close);
    }
    var mediaHtml = '';
    if (banner.image_url) {
      mediaHtml = '<img src="' + _esc(banner.image_url) + '" alt="' + _esc(banner.text || 'banner') + '" style="width:100%;height:100%;object-fit:cover;display:block;">';
    }
    var ctaHtml = '';
    if (banner.link_url) {
      ctaHtml = '<a href="' + _esc(banner.link_url) + '" target="' + _esc(banner.link_target || '_blank') + '" rel="noopener noreferrer" style="display:inline-block;margin-top:14px;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:700;background:' + _esc(banner.cta_bg_color || '#2563eb') + ';color:' + _esc(banner.cta_text_color || '#ffffff') + ';">' + _esc(banner.cta_text || 'Xem ngay') + '</a>';
    }
    var text = banner.text ? '<div style="margin-top:12px;font-size:16px;line-height:1.55;font-weight:600;">' + _esc(banner.text) + '</div>' : '';
    var customHtml = banner.design_html ? '<div class="bs-popup-custom" style="position:absolute;inset:0;overflow:auto;padding:14px;">' + banner.design_html + '</div>' : '';
    var customCss = banner.design_css ? '<style>' + banner.design_css + '</style>' : '';
    if (customHtml) {
      card.innerHTML += customCss + customHtml;
    } else {
      card.innerHTML += '<div style="position:absolute;inset:0;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(180deg, rgba(2,6,23,0.05) 0%, rgba(2,6,23,0.65) 100%);">' + mediaHtml + text + ctaHtml + '</div>';
    }
    if (banner.link_url && !banner.cta_text && banner.image_url) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (ev) {
        if (ev.target && ev.target.tagName === 'A') return;
        window.open(banner.link_url, banner.link_target || '_blank');
      });
    }
    if (dismissible) {
      ov.addEventListener('click', function (ev) {
        if (ev.target === ov) _closePopupWithAnimation(ov, card, String(banner.hide_animation || 'fade'));
      });
    }
    ov.appendChild(card);
    document.body.appendChild(ov);
    var autoClose = Number(banner.auto_close_ms || 0);
    if (autoClose > 0) {
      setTimeout(function () {
        _closePopupWithAnimation(ov, card, String(banner.hide_animation || 'fade'));
      }, autoClose);
    }
    if (dismissible) {
      var closeBtn = card.querySelector('button[aria-label="Dong banner"]');
      if (closeBtn) {
        closeBtn.addEventListener('click', function (ev) {
          ev.preventDefault();
          _closePopupWithAnimation(ov, card, String(banner.hide_animation || 'fade'));
        });
      }
    }
  }
  function _ratioForBanner(r) {
    var v = String(r || '16:9');
    if (['16:9', '3:4', '4:3', '9:16', '1:1'].includes(v)) return v;
    return '16:9';
  }
  function _safeCssSize(v) {
    var s = String(v || '').trim().toLowerCase();
    if (!s) return '';
    return /^(\d{1,4})(px|vw|vh|%)$/.test(s) ? s : '';
  }
  function _applyPopupShowAnimation(card, animation) {
    var a = String(animation || 'zoom');
    if (a === 'fade') {
      card.animate([{
        opacity: 0
      }, {
        opacity: 1
      }], {
        duration: 260,
        easing: 'ease-out'
      });
      return;
    }
    if (a === 'slide-up') {
      card.animate([{
        opacity: 0,
        transform: 'translateY(38px)'
      }, {
        opacity: 1,
        transform: 'translateY(0)'
      }], {
        duration: 320,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      });
      return;
    }
    if (a === 'slide-down') {
      card.animate([{
        opacity: 0,
        transform: 'translateY(-38px)'
      }, {
        opacity: 1,
        transform: 'translateY(0)'
      }], {
        duration: 320,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      });
      return;
    }
    if (a === 'flip') {
      card.animate([{
        opacity: 0,
        transform: 'perspective(800px) rotateX(-20deg) scale(.96)'
      }, {
        opacity: 1,
        transform: 'perspective(800px) rotateX(0) scale(1)'
      }], {
        duration: 360,
        easing: 'ease-out'
      });
      return;
    }
    card.animate([{
      opacity: 0,
      transform: 'scale(.9)'
    }, {
      opacity: 1,
      transform: 'scale(1)'
    }], {
      duration: 280,
      easing: 'cubic-bezier(.2,.8,.2,1)'
    });
  }
  function _closePopupWithAnimation(overlay, card, animation) {
    if (!overlay || !card) return;
    var a = String(animation || 'fade');
    var keyframes;
    if (a === 'zoom-out') {
      keyframes = [{
        opacity: 1,
        transform: 'scale(1)'
      }, {
        opacity: 0,
        transform: 'scale(.85)'
      }];
    } else if (a === 'slide-down') {
      keyframes = [{
        opacity: 1,
        transform: 'translateY(0)'
      }, {
        opacity: 0,
        transform: 'translateY(40px)'
      }];
    } else if (a === 'slide-up') {
      keyframes = [{
        opacity: 1,
        transform: 'translateY(0)'
      }, {
        opacity: 0,
        transform: 'translateY(-40px)'
      }];
    } else {
      keyframes = [{
        opacity: 1
      }, {
        opacity: 0
      }];
    }
    var ani = card.animate(keyframes, {
      duration: 220,
      easing: 'ease-in'
    });
    ani.onfinish = function () {
      return overlay.remove();
    };
  }

  // Static init helper — call once per container selector
  BannerSlider.init = function (selector, options) {
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return null;
    var slider = new BannerSlider(el, options);
    slider.init();
    _instances.push(slider);
    return slider;
  };
  BannerSlider.initAll = function () {
    document.querySelectorAll('[data-banner-slider]').forEach(function (el) {
      var slider = new BannerSlider(el);
      slider.init();
      _instances.push(slider);
    });
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BannerSlider.initAll);
  } else {
    BannerSlider.initAll();
  }
  global.BannerSlider = BannerSlider;
})(window);