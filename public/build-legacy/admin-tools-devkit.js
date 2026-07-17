function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
(function adminToolsDevkitModule() {
  function byId(id) {
    return document.getElementById(id);
  }
  var ipDataLoaded = false;
  function escapeHtml(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function showToastSafe(message, type) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type || 'info');
      return;
    }
    if (typeof window.showNotification === 'function') {
      window.showNotification('Thông báo', message, type || 'info');
      return;
    }
    alert(message);
  }
  function logDevtool(message) {
    var box = byId('devtoolLog');
    if (!box) return;
    var ts = new Date().toLocaleTimeString('vi-VN');
    box.textContent = "[".concat(ts, "] ").concat(String(message || '').trim(), "\n").concat(box.textContent || '').trim();
  }
  function devtoolApi(_x, _x2) {
    return _devtoolApi.apply(this, arguments);
  }
  function _devtoolApi() {
    _devtoolApi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url, options) {
      var res, payload, msg;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return fetch(url, {
              method: options && options.method || 'GET',
              headers: _objectSpread({
                'Content-Type': 'application/json'
              }, options && options.headers ? options.headers : {}),
              body: options && options.body ? JSON.stringify(options.body) : undefined,
              cache: 'no-store'
            });
          case 1:
            res = _context.v;
            _context.n = 2;
            return res.json().catch(function () {
              return {
                success: false,
                message: 'Phản hồi không hợp lệ'
              };
            });
          case 2:
            payload = _context.v;
            if (!(!res.ok || payload.success === false)) {
              _context.n = 3;
              break;
            }
            msg = String(payload.message || 'Request failed ' + res.status);
            throw new Error(msg);
          case 3:
            return _context.a(2, payload);
        }
      }, _callee);
    }));
    return _devtoolApi.apply(this, arguments);
  }
  function renderTreeRows(nodes, depth) {
    var level = Number(depth || 0);
    var rows = [];
    (Array.isArray(nodes) ? nodes : []).forEach(function (node) {
      if (!node || !node.path) return;
      var type = String(node.type || 'file');
      var icon = type === 'directory' ? '📁' : '📄';
      var cls = type === 'directory' ? 'devtool-tree-item dir' : 'devtool-tree-item file';
      var pad = 10 + level * 14;
      rows.push('<div class="' + cls + '" data-path="' + String(node.path).replace(/"/g, '&quot;') + '" data-type="' + type + '" style="padding-left:' + pad + 'px">' + icon + ' ' + String(node.name || node.path) + '</div>');
      if (type === 'directory' && Array.isArray(node.children) && node.children.length) {
        rows.push(renderTreeRows(node.children, level + 1));
      }
    });
    return rows.join('');
  }
  function loadFileTree() {
    return _loadFileTree.apply(this, arguments);
  }
  function _loadFileTree() {
    _loadFileTree = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var container, payload, html, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            container = byId('devtoolFileTree');
            if (container) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            container.innerHTML = '<div class="devtool-tree-item">Đang tải...</div>';
            _context2.p = 2;
            _context2.n = 3;
            return devtoolApi('/api/tools/dev/list?depth=3');
          case 3:
            payload = _context2.v;
            html = renderTreeRows(payload.data || [], 0);
            container.innerHTML = html || '<div class="devtool-tree-item">Không có file khả dụng.</div>';
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t = _context2.v;
            container.innerHTML = '<div class="devtool-tree-item">Không tải được cây file.</div>';
            logDevtool('Lỗi tải cây file: ' + _t.message);
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[2, 4]]);
    }));
    return _loadFileTree.apply(this, arguments);
  }
  function loadRuntimeStatus() {
    return _loadRuntimeStatus.apply(this, arguments);
  }
  function _loadRuntimeStatus() {
    _loadRuntimeStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var label, restartModeLabel, payload, data, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            label = byId('devtoolRuntimeText');
            restartModeLabel = byId('devtoolRestartModeText');
            _context3.p = 1;
            _context3.n = 2;
            return devtoolApi('/api/tools/dev/runtime');
          case 2:
            payload = _context3.v;
            data = payload.data || {};
            if (label) {
              label.textContent = 'Node ' + String(data.node || '--') + ' | Uptime ' + String(data.uptime_seconds || 0) + 's | PID ' + String(data.pid || '--');
            }
            if (restartModeLabel) {
              restartModeLabel.textContent = 'Restart mode: ' + String(data.restart_mode_hint || 'unknown');
            }
            logDevtool('Runtime OK: ' + (label ? label.textContent : 'đã nhận dữ liệu.'));
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t2 = _context3.v;
            if (label) label.textContent = 'Không lấy được runtime status';
            if (restartModeLabel) restartModeLabel.textContent = '';
            logDevtool('Lỗi runtime: ' + _t2.message);
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3]]);
    }));
    return _loadRuntimeStatus.apply(this, arguments);
  }
  function loadAuditLog() {
    return _loadAuditLog.apply(this, arguments);
  }
  function _loadAuditLog() {
    _loadAuditLog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var payload, rows, short, _t3;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            _context4.n = 1;
            return devtoolApi('/api/tools/dev/audit?limit=80');
          case 1:
            payload = _context4.v;
            rows = Array.isArray(payload.data) ? payload.data : [];
            if (rows.length) {
              _context4.n = 2;
              break;
            }
            logDevtool('Audit log hiện chưa có dữ liệu.');
            return _context4.a(2);
          case 2:
            short = rows.slice(0, 18).map(function (item) {
              var at = String(item.at || '--');
              var action = String(item.action || 'unknown');
              var actor = item.actor && item.actor.username ? item.actor.username : '--';
              var pathText = String(item.path || item.dir || '-');
              return at + ' | ' + action + ' | ' + actor + ' | ' + pathText;
            }).join('\n');
            logDevtool('Audit log mới nhất:\n' + short);
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t3 = _context4.v;
            logDevtool('Lỗi tải audit log: ' + _t3.message);
            showToastSafe(_t3.message || 'Không tải được audit log', 'error');
          case 4:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 3]]);
    }));
    return _loadAuditLog.apply(this, arguments);
  }
  function formatTimeSafe(isoText) {
    if (!isoText) return '--';
    var d = new Date(isoText);
    if (Number.isNaN(d.getTime())) return '--';
    return d.toLocaleString('vi-VN');
  }
  function setActivePane(paneName) {
    var name = String(paneName || 'files').trim().toLowerCase();
    var filesPane = byId('devtoolPaneFiles');
    var ipsPane = byId('devtoolPaneIps');
    var tabs = document.querySelectorAll('#devtoolPaneTabs .devtool-pane-tab');
    tabs.forEach(function (btn) {
      var active = String(btn.getAttribute('data-pane') || '').toLowerCase() === name;
      btn.classList.toggle('active', active);
    });
    if (filesPane) filesPane.classList.toggle('active', name === 'files');
    if (ipsPane) ipsPane.classList.toggle('active', name === 'ips');
    if (name === 'ips' && !ipDataLoaded) {
      loadIpAccess();
    }
  }
  function loadIpAccess() {
    return _loadIpAccess.apply(this, arguments);
  }
  function _loadIpAccess() {
    _loadIpAccess = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var body, summary, payload, rows, html, _t4;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            body = byId('devtoolIpTableBody');
            summary = byId('devtoolIpSummary');
            if (body) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            body.innerHTML = '<tr><td colspan="8" class="devtool-ip-empty">Đang tải dữ liệu IP...</td></tr>';
            _context5.p = 2;
            _context5.n = 3;
            return devtoolApi('/api/tools/dev/ip-access?limit=180');
          case 3:
            payload = _context5.v;
            rows = Array.isArray(payload.data) ? payload.data : [];
            ipDataLoaded = true;
            if (rows.length) {
              _context5.n = 4;
              break;
            }
            body.innerHTML = '<tr><td colspan="8" class="devtool-ip-empty">Chưa có dữ liệu IP truy cập.</td></tr>';
            if (summary) summary.textContent = 'Chưa ghi nhận IP truy cập.';
            return _context5.a(2);
          case 4:
            html = rows.map(function (row) {
              var ip = escapeHtml(row.ip || '--');
              var address = escapeHtml(row.address || '--');
              var isp = escapeHtml(row.isp || '--');
              var count = Number(row.count || 0);
              var lastSeen = formatTimeSafe(row.last_seen_at);
              var sources = Array.isArray(row.sources) && row.sources.length ? row.sources.map(function (s) {
                return escapeHtml(String(s || '').replace(/_/g, ' '));
              }).join(', ') : '--';
              var pages = Array.isArray(row.pages) && row.pages.length ? row.pages.map(function (p) {
                return escapeHtml(String(p || ''));
              }).join(' | ') : '--';
              var clients = Array.isArray(row.clients) && row.clients.length ? row.clients.map(function (c) {
                var browser = escapeHtml(String(c.browser || 'Unknown'));
                var os = escapeHtml(String(c.os || 'Unknown'));
                var device = escapeHtml(String(c.device || 'Unknown'));
                var countClient = Math.max(1, Number(c.count || 1));
                return browser + ' / ' + os + ' / ' + device + ' (' + countClient + ')';
              }).join('<br>') : '--';
              return '<tr>' + '<td class="ip">' + ip + '</td>' + '<td>' + address + '</td>' + '<td>' + isp + '</td>' + '<td class="count">' + count + '</td>' + '<td>' + sources + '</td>' + '<td>' + pages + '</td>' + '<td>' + clients + '</td>' + '<td>' + escapeHtml(lastSeen) + '</td>' + '</tr>';
            }).join('');
            body.innerHTML = html;
            if (summary) summary.textContent = 'Đã tải ' + rows.length + ' IP truy cập gần nhất.';
            logDevtool('Đã tải danh sách IP truy cập: ' + rows.length + ' bản ghi.');
            _context5.n = 6;
            break;
          case 5:
            _context5.p = 5;
            _t4 = _context5.v;
            body.innerHTML = '<tr><td colspan="8" class="devtool-ip-empty">Không tải được dữ liệu IP truy cập.</td></tr>';
            if (summary) summary.textContent = 'Lỗi tải IP truy cập.';
            logDevtool('Lỗi tải IP truy cập: ' + _t4.message);
            showToastSafe(_t4.message || 'Không tải được IP truy cập', 'error');
          case 6:
            return _context5.a(2);
        }
      }, _callee5, null, [[2, 5]]);
    }));
    return _loadIpAccess.apply(this, arguments);
  }
  function loadRevisions() {
    return _loadRevisions.apply(this, arguments);
  }
  function _loadRevisions() {
    _loadRevisions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var pathInput, select, filePath, payload, rows, _t5;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            pathInput = byId('devtoolPathInput');
            select = byId('devtoolRevisionSelect');
            filePath = String(pathInput && pathInput.value || '').trim();
            if (filePath) {
              _context6.n = 1;
              break;
            }
            showToastSafe('Chưa chọn file để tải lịch sử.', 'warning');
            return _context6.a(2);
          case 1:
            if (select) select.innerHTML = '<option value="">Đang tải phiên bản...</option>';
            _context6.p = 2;
            _context6.n = 3;
            return devtoolApi('/api/tools/dev/revisions?path=' + encodeURIComponent(filePath));
          case 3:
            payload = _context6.v;
            rows = Array.isArray(payload.data) ? payload.data : [];
            if (select) {
              if (!rows.length) {
                select.innerHTML = '<option value="">Không có phiên bản rollback</option>';
              } else {
                select.innerHTML = rows.map(function (row) {
                  var val = String(row.revision_path || '');
                  var mtime = String(row.modified_at || '').replace('T', ' ').replace('Z', '');
                  var size = Number(row.size || 0);
                  return '<option value="' + val.replace(/"/g, '&quot;') + '">' + mtime + ' | ' + size + ' bytes | ' + val + '</option>';
                }).join('');
              }
            }
            logDevtool('Đã tải ' + rows.length + ' phiên bản rollback cho ' + filePath);
            _context6.n = 5;
            break;
          case 4:
            _context6.p = 4;
            _t5 = _context6.v;
            if (select) select.innerHTML = '<option value="">Không tải được lịch sử</option>';
            logDevtool('Lỗi tải lịch sử rollback: ' + _t5.message);
            showToastSafe(_t5.message || 'Không tải được lịch sử', 'error');
          case 5:
            return _context6.a(2);
        }
      }, _callee6, null, [[2, 4]]);
    }));
    return _loadRevisions.apply(this, arguments);
  }
  function rollbackCurrentFile() {
    return _rollbackCurrentFile.apply(this, arguments);
  }
  function _rollbackCurrentFile() {
    _rollbackCurrentFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var pathInput, select, editor, filePath, revisionPath, payload, _t6;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            pathInput = byId('devtoolPathInput');
            select = byId('devtoolRevisionSelect');
            editor = byId('devtoolEditor');
            filePath = String(pathInput && pathInput.value || '').trim();
            revisionPath = String(select && select.value || '').trim();
            if (!(!filePath || !revisionPath)) {
              _context7.n = 1;
              break;
            }
            showToastSafe('Vui lòng chọn file và phiên bản rollback.', 'warning');
            return _context7.a(2);
          case 1:
            if (confirm('Rollback file này về phiên bản đã chọn?')) {
              _context7.n = 2;
              break;
            }
            return _context7.a(2);
          case 2:
            _context7.p = 2;
            _context7.n = 3;
            return devtoolApi('/api/tools/dev/rollback', {
              method: 'POST',
              body: {
                path: filePath,
                revision_path: revisionPath
              }
            });
          case 3:
            payload = _context7.v;
            logDevtool('Rollback thành công: ' + filePath + ' <- ' + revisionPath);
            showToastSafe('Rollback thành công', 'success');
            _context7.n = 4;
            return loadFileContent(filePath);
          case 4:
            _context7.n = 5;
            return loadRevisions();
          case 5:
            if (editor) editor.focus();
            if (payload && payload.data && payload.data.safety_revision) {
              logDevtool('Safety revision: ' + payload.data.safety_revision.revision_path);
            }
            _context7.n = 7;
            break;
          case 6:
            _context7.p = 6;
            _t6 = _context7.v;
            logDevtool('Rollback lỗi: ' + _t6.message);
            showToastSafe(_t6.message || 'Rollback thất bại', 'error');
          case 7:
            return _context7.a(2);
        }
      }, _callee7, null, [[2, 6]]);
    }));
    return _rollbackCurrentFile.apply(this, arguments);
  }
  function loadFileContent(_x3) {
    return _loadFileContent.apply(this, arguments);
  }
  function _loadFileContent() {
    _loadFileContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(pathValue) {
      var pathInput, editor, targetPath, payload, _t7;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            pathInput = byId('devtoolPathInput');
            editor = byId('devtoolEditor');
            targetPath = String(pathValue || pathInput && pathInput.value || '').trim();
            if (targetPath) {
              _context8.n = 1;
              break;
            }
            showToastSafe('Vui lòng nhập đường dẫn file.', 'warning');
            return _context8.a(2);
          case 1:
            _context8.p = 1;
            _context8.n = 2;
            return devtoolApi('/api/tools/dev/read?path=' + encodeURIComponent(targetPath));
          case 2:
            payload = _context8.v;
            if (pathInput) pathInput.value = payload.data.path || targetPath;
            if (editor) editor.value = payload.data.content || '';
            logDevtool('Đã mở file: ' + (payload.data.path || targetPath));
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t7 = _context8.v;
            logDevtool('Không mở được file: ' + _t7.message);
            showToastSafe(_t7.message || 'Không mở được file', 'error');
          case 4:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 3]]);
    }));
    return _loadFileContent.apply(this, arguments);
  }
  function checkCurrentFile() {
    return _checkCurrentFile.apply(this, arguments);
  }
  function _checkCurrentFile() {
    _checkCurrentFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var pathInput, editor, filePath, payload, checker, _t8;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            pathInput = byId('devtoolPathInput');
            editor = byId('devtoolEditor');
            filePath = String(pathInput && pathInput.value || '').trim();
            if (filePath) {
              _context9.n = 1;
              break;
            }
            showToastSafe('Chưa chọn file để check.', 'warning');
            return _context9.a(2);
          case 1:
            _context9.p = 1;
            _context9.n = 2;
            return devtoolApi('/api/tools/dev/check', {
              method: 'POST',
              body: {
                path: filePath,
                content: editor && editor.value || ''
              }
            });
          case 2:
            payload = _context9.v;
            checker = payload && payload.data && payload.data.checker ? payload.data.checker : 'basic';
            logDevtool('Check OK [' + checker + ']: ' + filePath);
            showToastSafe('Check cú pháp OK', 'success');
            _context9.n = 4;
            break;
          case 3:
            _context9.p = 3;
            _t8 = _context9.v;
            logDevtool('Check lỗi: ' + _t8.message);
            showToastSafe(_t8.message || 'Check lỗi', 'error');
          case 4:
            return _context9.a(2);
        }
      }, _callee9, null, [[1, 3]]);
    }));
    return _checkCurrentFile.apply(this, arguments);
  }
  function saveCurrentFile() {
    return _saveCurrentFile.apply(this, arguments);
  }
  function _saveCurrentFile() {
    _saveCurrentFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var pathInput, editor, filePath, payload, _t9;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            pathInput = byId('devtoolPathInput');
            editor = byId('devtoolEditor');
            filePath = String(pathInput && pathInput.value || '').trim();
            if (filePath) {
              _context0.n = 1;
              break;
            }
            showToastSafe('Chưa chọn file để lưu.', 'warning');
            return _context0.a(2);
          case 1:
            _context0.p = 1;
            _context0.n = 2;
            return devtoolApi('/api/tools/dev/write', {
              method: 'PUT',
              body: {
                path: filePath,
                content: editor && editor.value || ''
              }
            });
          case 2:
            payload = _context0.v;
            logDevtool('Đã lưu file: ' + (payload.data && payload.data.path ? payload.data.path : filePath));
            showToastSafe('Lưu file thành công', 'success');
            _context0.n = 3;
            return loadFileTree();
          case 3:
            _context0.n = 5;
            break;
          case 4:
            _context0.p = 4;
            _t9 = _context0.v;
            logDevtool('Lưu lỗi: ' + _t9.message);
            showToastSafe(_t9.message || 'Không lưu được file', 'error');
          case 5:
            return _context0.a(2);
        }
      }, _callee0, null, [[1, 4]]);
    }));
    return _saveCurrentFile.apply(this, arguments);
  }
  function restartServer() {
    return _restartServer.apply(this, arguments);
  }
  function _restartServer() {
    _restartServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      var payload, mode, _t0;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            _context1.p = 0;
            _context1.n = 1;
            return devtoolApi('/api/tools/dev/restart', {
              method: 'POST'
            });
          case 1:
            payload = _context1.v;
            mode = payload && payload.data && payload.data.strategy ? payload.data.strategy : 'unknown';
            logDevtool('Đã gửi lệnh restart server (mode: ' + mode + ').');
            showToastSafe(payload.message || 'Đã gửi lệnh restart server', 'success');
            _context1.n = 3;
            break;
          case 2:
            _context1.p = 2;
            _t0 = _context1.v;
            logDevtool('Restart lỗi: ' + _t0.message);
            showToastSafe(_t0.message || 'Không thể restart server', 'error');
            throw _t0;
          case 3:
            return _context1.a(2);
        }
      }, _callee1, null, [[0, 2]]);
    }));
    return _restartServer.apply(this, arguments);
  }
  function saveAndRestart() {
    return _saveAndRestart.apply(this, arguments);
  }
  function _saveAndRestart() {
    _saveAndRestart = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      var _t1;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            _context10.p = 0;
            _context10.n = 1;
            return saveCurrentFile();
          case 1:
            _context10.n = 2;
            return restartServer();
          case 2:
            _context10.n = 4;
            break;
          case 3:
            _context10.p = 3;
            _t1 = _context10.v;
          case 4:
            return _context10.a(2);
        }
      }, _callee10, null, [[0, 3]]);
    }));
    return _saveAndRestart.apply(this, arguments);
  }
  function markActiveTreeFile(pathValue) {
    var tree = byId('devtoolFileTree');
    if (!tree) return;
    tree.querySelectorAll('.devtool-tree-item.file').forEach(function (el) {
      var active = String(el.getAttribute('data-path') || '') === String(pathValue || '');
      el.classList.toggle('active', active);
    });
  }
  function bindEvents() {
    document.querySelectorAll('#devtoolPaneTabs .devtool-pane-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pane = String(btn.getAttribute('data-pane') || 'files').trim().toLowerCase();
        setActivePane(pane);
      });
    });
    byId('devtoolIpRefreshBtn') && byId('devtoolIpRefreshBtn').addEventListener('click', function () {
      loadIpAccess();
    });
    byId('devtoolRefreshTreeBtn') && byId('devtoolRefreshTreeBtn').addEventListener('click', function () {
      loadFileTree();
    });
    byId('devtoolRuntimeBtn') && byId('devtoolRuntimeBtn').addEventListener('click', function () {
      loadRuntimeStatus();
    });
    byId('devtoolRestartBtn') && byId('devtoolRestartBtn').addEventListener('click', function () {
      if (!confirm('Restart server ngay bây giờ?')) return;
      restartServer();
    });
    byId('devtoolAuditBtn') && byId('devtoolAuditBtn').addEventListener('click', function () {
      loadAuditLog();
    });
    byId('devtoolLoadBtn') && byId('devtoolLoadBtn').addEventListener('click', function () {
      loadFileContent();
    });
    byId('devtoolCheckBtn') && byId('devtoolCheckBtn').addEventListener('click', function () {
      checkCurrentFile();
    });
    byId('devtoolSaveBtn') && byId('devtoolSaveBtn').addEventListener('click', function () {
      saveCurrentFile();
    });
    byId('devtoolSaveRestartBtn') && byId('devtoolSaveRestartBtn').addEventListener('click', function () {
      if (!confirm('Lưu file hiện tại và restart server?')) return;
      saveAndRestart();
    });
    byId('devtoolLoadRevisionsBtn') && byId('devtoolLoadRevisionsBtn').addEventListener('click', function () {
      loadRevisions();
    });
    byId('devtoolRollbackBtn') && byId('devtoolRollbackBtn').addEventListener('click', function () {
      rollbackCurrentFile();
    });
    byId('devtoolPathInput') && byId('devtoolPathInput').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      loadFileContent();
    });
    byId('devtoolFileTree') && byId('devtoolFileTree').addEventListener('click', function (e) {
      var row = e.target.closest('.devtool-tree-item.file');
      if (!row) return;
      var filePath = String(row.getAttribute('data-path') || '').trim();
      if (!filePath) return;
      markActiveTreeFile(filePath);
      loadFileContent(filePath);
    });
  }
  function initDevToolPanel() {
    if (!byId('panel-devtool') && !byId('panel-tools')) return;
    if (!byId('devtoolFileTree') || !byId('devtoolEditor')) return;
    bindEvents();
    setActivePane('files');
    loadFileTree();
    loadRuntimeStatus();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDevToolPanel);
  } else {
    initDevToolPanel();
  }
})();