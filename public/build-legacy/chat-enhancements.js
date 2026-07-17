function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function loadQuickReplies() {
  return _loadQuickReplies.apply(this, arguments);
}
function _loadQuickReplies() {
  _loadQuickReplies = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var response, result, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return fetch('/api/chat/quick-replies');
        case 1:
          response = _context2.v;
          _context2.n = 2;
          return response.json();
        case 2:
          result = _context2.v;
          if (result.success && result.data) {
            displayQuickReplies(result.data);
          }
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t = _context2.v;
          console.error('❌ Error loading quick replies:', _t);
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return _loadQuickReplies.apply(this, arguments);
}
function displayQuickReplies(replies) {
  var container = document.getElementById('quickReplies');
  if (!container) return;
  container.innerHTML = '';
  replies.forEach(function (reply) {
    var button = document.createElement('button');
    button.className = 'quick-reply-btn';
    button.textContent = reply.label;
    button.onclick = function () {
      sendQuickReply(reply.value);
      hideQuickReplies();
    };
    container.appendChild(button);
  });
  showQuickReplies();
}
function showQuickReplies() {
  var container = document.getElementById('quickReplies');
  if (container) container.style.display = 'flex';
}
function hideQuickReplies() {
  var container = document.getElementById('quickReplies');
  if (container) container.style.display = 'none';
}
function sendQuickReply(_x) {
  return _sendQuickReply.apply(this, arguments);
}
function _sendQuickReply() {
  _sendQuickReply = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(replyText) {
    var input;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          input = document.getElementById('chatInput');
          if (!input) {
            _context3.n = 1;
            break;
          }
          input.value = replyText;
          _context3.n = 1;
          return sendMessage();
        case 1:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _sendQuickReply.apply(this, arguments);
}
function sendSatisfactionSurvey() {
  return _sendSatisfactionSurvey.apply(this, arguments);
}
function _sendSatisfactionSurvey() {
  _sendSatisfactionSurvey = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var _currentChatSession2, response, result, _t2;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return fetch("/api/chat/survey/".concat(currentChatCode), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customer_name: ((_currentChatSession2 = currentChatSession) === null || _currentChatSession2 === void 0 ? void 0 : _currentChatSession2.customer_name) || 'Bạn'
            })
          });
        case 1:
          response = _context4.v;
          _context4.n = 2;
          return response.json();
        case 2:
          result = _context4.v;
          if (!result.success) {
            _context4.n = 3;
            break;
          }
          console.log('✅ Survey sent');
          _context4.n = 3;
          return loadChatMessages();
        case 3:
          _context4.n = 5;
          break;
        case 4:
          _context4.p = 4;
          _t2 = _context4.v;
          console.error('❌ Error sending survey:', _t2);
        case 5:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 4]]);
  }));
  return _sendSatisfactionSurvey.apply(this, arguments);
}
function submitSatisfactionRating(_x2) {
  return _submitSatisfactionRating.apply(this, arguments);
}
function _submitSatisfactionRating() {
  _submitSatisfactionRating = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(rating) {
    var feedback,
      response,
      result,
      _args5 = arguments,
      _t3;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          feedback = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : '';
          _context5.p = 1;
          _context5.n = 2;
          return fetch('/api/chat/satisfaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session_code: currentChatCode,
              rating: rating,
              feedback: feedback
            })
          });
        case 2:
          response = _context5.v;
          _context5.n = 3;
          return response.json();
        case 3:
          result = _context5.v;
          if (!result.success) {
            _context5.n = 4;
            break;
          }
          console.log('✅ Satisfaction rating submitted:', rating);
          showNotification('✅', 'Cảm ơn đánh giá của bạn!', '#10b981');
          _context5.n = 4;
          return loadChatMessages();
        case 4:
          _context5.n = 6;
          break;
        case 5:
          _context5.p = 5;
          _t3 = _context5.v;
          console.error('❌ Error submitting rating:', _t3);
        case 6:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 5]]);
  }));
  return _submitSatisfactionRating.apply(this, arguments);
}
function loadSupportAgents() {
  return _loadSupportAgents.apply(this, arguments);
}
function _loadSupportAgents() {
  _loadSupportAgents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var response, result, _t4;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          _context6.n = 1;
          return fetch('/api/chat/agent-list');
        case 1:
          response = _context6.v;
          _context6.n = 2;
          return response.json();
        case 2:
          result = _context6.v;
          if (!(result.success && result.data)) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, result.data);
        case 3:
          _context6.n = 5;
          break;
        case 4:
          _context6.p = 4;
          _t4 = _context6.v;
          console.error('❌ Error loading agents:', _t4);
          return _context6.a(2, []);
        case 5:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 4]]);
  }));
  return _loadSupportAgents.apply(this, arguments);
}
function assignAgentToChat(_x3, _x4) {
  return _assignAgentToChat.apply(this, arguments);
}
function _assignAgentToChat() {
  _assignAgentToChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(agentId, agentName) {
    var response, result, _t5;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          _context7.n = 1;
          return fetch("/api/chat/assign-agent/".concat(currentChatCode), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              agent_id: agentId,
              agent_name: agentName
            })
          });
        case 1:
          response = _context7.v;
          _context7.n = 2;
          return response.json();
        case 2:
          result = _context7.v;
          if (!result.success) {
            _context7.n = 4;
            break;
          }
          console.log('✅ Agent assigned:', agentName);
          _context7.n = 3;
          return loadChatMessages();
        case 3:
          return _context7.a(2, result.data);
        case 4:
          _context7.n = 6;
          break;
        case 5:
          _context7.p = 5;
          _t5 = _context7.v;
          console.error('❌ Error assigning agent:', _t5);
        case 6:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 5]]);
  }));
  return _assignAgentToChat.apply(this, arguments);
}
function getChatStats() {
  return _getChatStats.apply(this, arguments);
}
function _getChatStats() {
  _getChatStats = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var response, result, _t6;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return fetch('/api/chat/stats');
        case 1:
          response = _context8.v;
          _context8.n = 2;
          return response.json();
        case 2:
          result = _context8.v;
          if (!result.success) {
            _context8.n = 3;
            break;
          }
          return _context8.a(2, result.data);
        case 3:
          _context8.n = 5;
          break;
        case 4:
          _context8.p = 4;
          _t6 = _context8.v;
          console.error('❌ Error fetching chat stats:', _t6);
          return _context8.a(2, null);
        case 5:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 4]]);
  }));
  return _getChatStats.apply(this, arguments);
}
function formatChatTime(date) {
  var now = new Date();
  var msgDate = new Date(date);
  var diff = now - msgDate;
  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return "".concat(Math.floor(diff / 60000), "p");
  if (diff < 86400000) return "".concat(Math.floor(diff / 3600000), "h");
  return msgDate.toLocaleDateString('vi-VN');
}
function createRatingButtons() {
  var container = document.createElement('div');
  container.className = 'satisfaction-rating';
  container.innerHTML = "\n        <div class=\"rating-prompt\">B\u1EA1n th\u1EA5y h\xE0i l\xF2ng kh\xF4ng? (1-5 sao)</div>\n        <div class=\"rating-buttons\">\n            <button class=\"rating-btn\" data-rating=\"1\" title=\"R\u1EA5t kh\xF4ng h\xE0i l\xF2ng\">\uD83D\uDE1E</button>\n            <button class=\"rating-btn\" data-rating=\"2\" title=\"Kh\xF4ng h\xE0i l\xF2ng\">\uD83D\uDE15</button>\n            <button class=\"rating-btn\" data-rating=\"3\" title=\"B\xECnh th\u01B0\u1EDDng\">\uD83D\uDE10</button>\n            <button class=\"rating-btn\" data-rating=\"4\" title=\"H\xE0i l\xF2ng\">\uD83D\uDE0A</button>\n            <button class=\"rating-btn\" data-rating=\"5\" title=\"R\u1EA5t h\xE0i l\xF2ng\">\uD83D\uDE0D</button>\n        </div>\n    ";
  var buttons = container.querySelectorAll('.rating-btn');
  buttons.forEach(function (btn) {
    btn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var rating;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            rating = btn.getAttribute('data-rating');
            _context.n = 1;
            return submitSatisfactionRating(rating);
          case 1:
            container.remove();
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
  });
  return container;
}
function initializeChatEnhancements() {
  if (window.__chatEnhancementsInitialized) return;
  window.__chatEnhancementsInitialized = true;
  loadQuickReplies();
  setTimeout(function () {
    var _currentChatSession;
    if (((_currentChatSession = currentChatSession) === null || _currentChatSession === void 0 ? void 0 : _currentChatSession.status) === 'active') {
      sendSatisfactionSurvey();
    }
  }, 300000);
}

// Initialize only when chat is actually opened to avoid unnecessary requests on page load.
window.addEventListener('chat:opened', function () {
  setTimeout(initializeChatEnhancements, 250);
});