function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * DOM Polyfills for Android 5-7 WebView compatibility.
 * Loaded synchronously before all app scripts.
 * All code is ES3/ES5 — does NOT need Babel.
 */
(function () {
  'use strict';

  // ── Element.prototype.matches ──
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector || function (s) {
      var m = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = m.length;
      while (--i >= 0 && m.item(i) !== this) {}
      return i > -1;
    };
  }

  // ── Element.prototype.closest ──
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // ── ChildNode.remove ──
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  // ── ParentNode.append ──
  if (!('append' in Element.prototype)) {
    Element.prototype.append = function () {
      for (var i = 0; i < arguments.length; i++) {
        var node = arguments[i];
        if (typeof node === 'string') {
          this.appendChild(document.createTextNode(node));
        } else {
          this.appendChild(node);
        }
      }
    };
  }

  // ── ParentNode.prepend ──
  if (!('prepend' in Element.prototype)) {
    Element.prototype.prepend = function () {
      var firstChild = this.firstChild;
      for (var i = 0; i < arguments.length; i++) {
        var node = arguments[i];
        if (typeof node === 'string') {
          this.insertBefore(document.createTextNode(node), firstChild);
        } else {
          this.insertBefore(node, firstChild);
        }
      }
    };
  }

  // ── ChildNode.before ──
  if (!('before' in Element.prototype)) {
    Element.prototype.before = function () {
      var parent = this.parentNode;
      if (!parent) return;
      for (var i = 0; i < arguments.length; i++) {
        var node = arguments[i];
        if (typeof node === 'string') {
          parent.insertBefore(document.createTextNode(node), this);
        } else {
          parent.insertBefore(node, this);
        }
      }
    };
  }

  // ── ChildNode.after ──
  if (!('after' in Element.prototype)) {
    Element.prototype.after = function () {
      var parent = this.parentNode;
      if (!parent) return;
      var ref = this.nextSibling;
      for (var i = 0; i < arguments.length; i++) {
        var node = arguments[i];
        if (typeof node === 'string') {
          parent.insertBefore(document.createTextNode(node), ref);
        } else {
          parent.insertBefore(node, ref);
        }
      }
    };
  }

  // ── ChildNode.replaceWith ──
  if (!('replaceWith' in Element.prototype)) {
    Element.prototype.replaceWith = function () {
      var parent = this.parentNode;
      if (!parent) return;
      for (var i = 0; i < arguments.length; i++) {
        var node = arguments[i];
        if (typeof node === 'string') {
          parent.insertBefore(document.createTextNode(node), this);
        } else {
          parent.insertBefore(node, this);
        }
      }
      parent.removeChild(this);
    };
  }

  // ── classList.toggle with force param ──
  (function () {
    var testEl = document.createElement('_');
    testEl.classList.toggle('c', false);
    if (testEl.classList.contains('c')) {
      var _origToggle = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function (token, force) {
        if (arguments.length > 1) {
          if (force) {
            this.add(token);
          } else {
            this.remove(token);
          }
          return !!force;
        }
        return _origToggle.call(this, token);
      };
    }
  })();

  // ── CustomEvent constructor polyfill ──
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function (event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    window.CustomEvent.prototype = window.Event.prototype;
  }

  // ── addEventListener {once: true} support ──
  (function () {
    var supportsOnce = false;
    try {
      var opts = Object.defineProperty({}, 'once', {
        get: function get() {
          supportsOnce = true;
          return true;
        }
      });
      window.addEventListener('__testOnce', null, opts);
      window.removeEventListener('__testOnce', null, opts);
    } catch (e) {}
    if (!supportsOnce) {
      var _origAdd = EventTarget.prototype.addEventListener;
      var _origRemove = EventTarget.prototype.removeEventListener;
      EventTarget.prototype.addEventListener = function (type, listener, optionsOrCapture) {
        if (optionsOrCapture && _typeof(optionsOrCapture) === 'object' && optionsOrCapture.once) {
          var self = this;
          var fired = false;
          var _wrappedFn = function wrappedFn(e) {
            if (fired) return;
            fired = true;
            _origRemove.call(self, type, _wrappedFn, optionsOrCapture);
            if (typeof listener === 'function') {
              listener.call(self, e);
            } else if (listener && typeof listener.handleEvent === 'function') {
              listener.handleEvent(e);
            }
          };
          return _origAdd.call(this, type, _wrappedFn, optionsOrCapture);
        }
        return _origAdd.call(this, type, listener, optionsOrCapture);
      };
    }
  })();

  // ── addEventListener {passive: true} — safe feature detection ──
  // No polyfill needed; if not supported the option is silently ignored.
  // But some old WebViews throw when receiving an object as 3rd param.
  (function () {
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          supportsPassive = true;
          return true;
        }
      });
      window.addEventListener('__testPassive', null, opts);
      window.removeEventListener('__testPassive', null, opts);
    } catch (e) {}
    if (!supportsPassive) {
      var _origAdd = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (type, listener, optionsOrCapture) {
        // Convert options object to boolean capture for old browsers
        if (optionsOrCapture && _typeof(optionsOrCapture) === 'object') {
          return _origAdd.call(this, type, listener, !!optionsOrCapture.capture);
        }
        return _origAdd.call(this, type, listener, optionsOrCapture);
      };
    }
  })();

  // ── Element.prototype.animate — graceful fallback ──
  // If Web Animations API is missing, apply the final keyframe styles directly.
  if (!Element.prototype.animate) {
    Element.prototype.animate = function (keyframes, options) {
      var el = this;
      var lastFrame = Array.isArray(keyframes) ? keyframes[keyframes.length - 1] : {};
      var duration = typeof options === 'number' ? options : options && options.duration || 0;

      // Apply final state after a short timeout to mimic animation completion
      var timer = setTimeout(function () {
        for (var prop in lastFrame) {
          if (lastFrame.hasOwnProperty(prop)) {
            try {
              el.style[prop] = lastFrame[prop];
            } catch (e) {}
          }
        }
        if (result.onfinish) result.onfinish();
      }, duration);
      var result = {
        onfinish: null,
        cancel: function cancel() {
          clearTimeout(timer);
        },
        finished: {
          then: function then(cb) {
            setTimeout(cb, duration);
          }
        }
      };
      return result;
    };
  }

  // ── Safe scrollTo / scrollIntoView ──
  // Older WebViews don't support the options object form.
  // We wrap to catch and fall back to positional args.
  (function () {
    var origScrollTo = window.scrollTo;
    window.scrollTo = function (xOrOpts, y) {
      if (xOrOpts && _typeof(xOrOpts) === 'object') {
        try {
          origScrollTo.call(window, xOrOpts);
        } catch (e) {
          origScrollTo.call(window, xOrOpts.left || 0, xOrOpts.top || 0);
        }
      } else {
        origScrollTo.call(window, xOrOpts, y);
      }
    };
    if (Element.prototype.scrollIntoView) {
      var origScrollIntoView = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (optsOrBool) {
        try {
          origScrollIntoView.call(this, optsOrBool);
        } catch (e) {
          origScrollIntoView.call(this, _typeof(optsOrBool) === 'object' ? true : optsOrBool);
        }
      };
    }
  })();
})();