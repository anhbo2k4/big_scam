(function adminToolsDevkitModule() {
  function byId(id) { return document.getElementById(id); }
  let ipDataLoaded = false;

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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
    const box = byId('devtoolLog');
    if (!box) return;
    const ts = new Date().toLocaleTimeString('vi-VN');
    box.textContent = `[${ts}] ${String(message || '').trim()}\n${box.textContent || ''}`.trim();
  }

  async function devtoolApi(url, options) {
    const res = await fetch(url, {
      method: (options && options.method) || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options && options.headers ? options.headers : {})
      },
      body: options && options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store'
    });

    const payload = await res.json().catch(function () {
      return { success: false, message: 'Phản hồi không hợp lệ' };
    });

    if (!res.ok || payload.success === false) {
      const msg = String(payload.message || ('Request failed ' + res.status));
      throw new Error(msg);
    }

    return payload;
  }

  function renderTreeRows(nodes, depth) {
    const level = Number(depth || 0);
    const rows = [];

    (Array.isArray(nodes) ? nodes : []).forEach(function (node) {
      if (!node || !node.path) return;
      const type = String(node.type || 'file');
      const icon = type === 'directory' ? '📁' : '📄';
      const cls = type === 'directory' ? 'devtool-tree-item dir' : 'devtool-tree-item file';
      const pad = 10 + (level * 14);
      rows.push('<div class="' + cls + '" data-path="' + String(node.path).replace(/"/g, '&quot;') + '" data-type="' + type + '" style="padding-left:' + pad + 'px">' + icon + ' ' + String(node.name || node.path) + '</div>');
      if (type === 'directory' && Array.isArray(node.children) && node.children.length) {
        rows.push(renderTreeRows(node.children, level + 1));
      }
    });

    return rows.join('');
  }

  async function loadFileTree() {
    const container = byId('devtoolFileTree');
    if (!container) return;
    container.innerHTML = '<div class="devtool-tree-item">Đang tải...</div>';
    try {
      const payload = await devtoolApi('/api/tools/dev/list?depth=3');
      const html = renderTreeRows(payload.data || [], 0);
      container.innerHTML = html || '<div class="devtool-tree-item">Không có file khả dụng.</div>';
    } catch (err) {
      container.innerHTML = '<div class="devtool-tree-item">Không tải được cây file.</div>';
      logDevtool('Lỗi tải cây file: ' + err.message);
    }
  }

  async function loadRuntimeStatus() {
    const label = byId('devtoolRuntimeText');
    const restartModeLabel = byId('devtoolRestartModeText');
    try {
      const payload = await devtoolApi('/api/tools/dev/runtime');
      const data = payload.data || {};
      if (label) {
        label.textContent = 'Node ' + String(data.node || '--') + ' | Uptime ' + String(data.uptime_seconds || 0) + 's | PID ' + String(data.pid || '--');
      }
      if (restartModeLabel) {
        restartModeLabel.textContent = 'Restart mode: ' + String(data.restart_mode_hint || 'unknown');
      }
      logDevtool('Runtime OK: ' + (label ? label.textContent : 'đã nhận dữ liệu.'));
    } catch (err) {
      if (label) label.textContent = 'Không lấy được runtime status';
      if (restartModeLabel) restartModeLabel.textContent = '';
      logDevtool('Lỗi runtime: ' + err.message);
    }
  }

  async function loadAuditLog() {
    try {
      const payload = await devtoolApi('/api/tools/dev/audit?limit=80');
      const rows = Array.isArray(payload.data) ? payload.data : [];
      if (!rows.length) {
        logDevtool('Audit log hiện chưa có dữ liệu.');
        return;
      }
      const short = rows.slice(0, 18).map(function (item) {
        var at = String(item.at || '--');
        var action = String(item.action || 'unknown');
        var actor = (item.actor && item.actor.username) ? item.actor.username : '--';
        var pathText = String(item.path || item.dir || '-');
        return at + ' | ' + action + ' | ' + actor + ' | ' + pathText;
      }).join('\n');
      logDevtool('Audit log mới nhất:\n' + short);
    } catch (err) {
      logDevtool('Lỗi tải audit log: ' + err.message);
      showToastSafe(err.message || 'Không tải được audit log', 'error');
    }
  }

  function formatTimeSafe(isoText) {
    if (!isoText) return '--';
    const d = new Date(isoText);
    if (Number.isNaN(d.getTime())) return '--';
    return d.toLocaleString('vi-VN');
  }

  function setActivePane(paneName) {
    const name = String(paneName || 'files').trim().toLowerCase();
    const filesPane = byId('devtoolPaneFiles');
    const ipsPane = byId('devtoolPaneIps');
    const tabs = document.querySelectorAll('#devtoolPaneTabs .devtool-pane-tab');

    tabs.forEach(function (btn) {
      const active = String(btn.getAttribute('data-pane') || '').toLowerCase() === name;
      btn.classList.toggle('active', active);
    });

    if (filesPane) filesPane.classList.toggle('active', name === 'files');
    if (ipsPane) ipsPane.classList.toggle('active', name === 'ips');

    if (name === 'ips' && !ipDataLoaded) {
      loadIpAccess();
    }
  }

  async function loadIpAccess() {
    const body = byId('devtoolIpTableBody');
    const summary = byId('devtoolIpSummary');
    if (!body) return;

    body.innerHTML = '<tr><td colspan="8" class="devtool-ip-empty">Đang tải dữ liệu IP...</td></tr>';

    try {
      const payload = await devtoolApi('/api/tools/dev/ip-access?limit=180');
      const rows = Array.isArray(payload.data) ? payload.data : [];
      ipDataLoaded = true;

      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="8" class="devtool-ip-empty">Chưa có dữ liệu IP truy cập.</td></tr>';
        if (summary) summary.textContent = 'Chưa ghi nhận IP truy cập.';
        return;
      }

      const html = rows.map(function (row) {
        const ip = escapeHtml(row.ip || '--');
        const address = escapeHtml(row.address || '--');
        const isp = escapeHtml(row.isp || '--');
        const count = Number(row.count || 0);
        const lastSeen = formatTimeSafe(row.last_seen_at);
        const sources = Array.isArray(row.sources) && row.sources.length
          ? row.sources.map(function (s) { return escapeHtml(String(s || '').replace(/_/g, ' ')); }).join(', ')
          : '--';
        const pages = Array.isArray(row.pages) && row.pages.length
          ? row.pages.map(function (p) { return escapeHtml(String(p || '')); }).join(' | ')
          : '--';
        const clients = Array.isArray(row.clients) && row.clients.length
          ? row.clients.map(function (c) {
            var browser = escapeHtml(String(c.browser || 'Unknown'));
            var os = escapeHtml(String(c.os || 'Unknown'));
            var device = escapeHtml(String(c.device || 'Unknown'));
            var countClient = Math.max(1, Number(c.count || 1));
            return browser + ' / ' + os + ' / ' + device + ' (' + countClient + ')';
          }).join('<br>')
          : '--';

        return '<tr>' +
          '<td class="ip">' + ip + '</td>' +
          '<td>' + address + '</td>' +
          '<td>' + isp + '</td>' +
          '<td class="count">' + count + '</td>' +
          '<td>' + sources + '</td>' +
          '<td>' + pages + '</td>' +
          '<td>' + clients + '</td>' +
          '<td>' + escapeHtml(lastSeen) + '</td>' +
        '</tr>';
      }).join('');

      body.innerHTML = html;
      if (summary) summary.textContent = 'Đã tải ' + rows.length + ' IP truy cập gần nhất.';
      logDevtool('Đã tải danh sách IP truy cập: ' + rows.length + ' bản ghi.');
    } catch (err) {
      body.innerHTML = '<tr><td colspan="8" class="devtool-ip-empty">Không tải được dữ liệu IP truy cập.</td></tr>';
      if (summary) summary.textContent = 'Lỗi tải IP truy cập.';
      logDevtool('Lỗi tải IP truy cập: ' + err.message);
      showToastSafe(err.message || 'Không tải được IP truy cập', 'error');
    }
  }

  async function loadRevisions() {
    const pathInput = byId('devtoolPathInput');
    const select = byId('devtoolRevisionSelect');
    const filePath = String(pathInput && pathInput.value || '').trim();
    if (!filePath) {
      showToastSafe('Chưa chọn file để tải lịch sử.', 'warning');
      return;
    }
    if (select) select.innerHTML = '<option value="">Đang tải phiên bản...</option>';

    try {
      const payload = await devtoolApi('/api/tools/dev/revisions?path=' + encodeURIComponent(filePath));
      const rows = Array.isArray(payload.data) ? payload.data : [];
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
    } catch (err) {
      if (select) select.innerHTML = '<option value="">Không tải được lịch sử</option>';
      logDevtool('Lỗi tải lịch sử rollback: ' + err.message);
      showToastSafe(err.message || 'Không tải được lịch sử', 'error');
    }
  }

  async function rollbackCurrentFile() {
    const pathInput = byId('devtoolPathInput');
    const select = byId('devtoolRevisionSelect');
    const editor = byId('devtoolEditor');
    const filePath = String(pathInput && pathInput.value || '').trim();
    const revisionPath = String(select && select.value || '').trim();

    if (!filePath || !revisionPath) {
      showToastSafe('Vui lòng chọn file và phiên bản rollback.', 'warning');
      return;
    }

    if (!confirm('Rollback file này về phiên bản đã chọn?')) return;

    try {
      const payload = await devtoolApi('/api/tools/dev/rollback', {
        method: 'POST',
        body: { path: filePath, revision_path: revisionPath }
      });
      logDevtool('Rollback thành công: ' + filePath + ' <- ' + revisionPath);
      showToastSafe('Rollback thành công', 'success');
      await loadFileContent(filePath);
      await loadRevisions();
      if (editor) editor.focus();
      if (payload && payload.data && payload.data.safety_revision) {
        logDevtool('Safety revision: ' + payload.data.safety_revision.revision_path);
      }
    } catch (err) {
      logDevtool('Rollback lỗi: ' + err.message);
      showToastSafe(err.message || 'Rollback thất bại', 'error');
    }
  }

  async function loadFileContent(pathValue) {
    const pathInput = byId('devtoolPathInput');
    const editor = byId('devtoolEditor');
    const targetPath = String(pathValue || (pathInput && pathInput.value) || '').trim();
    if (!targetPath) {
      showToastSafe('Vui lòng nhập đường dẫn file.', 'warning');
      return;
    }

    try {
      const payload = await devtoolApi('/api/tools/dev/read?path=' + encodeURIComponent(targetPath));
      if (pathInput) pathInput.value = payload.data.path || targetPath;
      if (editor) editor.value = payload.data.content || '';
      logDevtool('Đã mở file: ' + (payload.data.path || targetPath));
    } catch (err) {
      logDevtool('Không mở được file: ' + err.message);
      showToastSafe(err.message || 'Không mở được file', 'error');
    }
  }

  async function checkCurrentFile() {
    const pathInput = byId('devtoolPathInput');
    const editor = byId('devtoolEditor');
    const filePath = String(pathInput && pathInput.value || '').trim();
    if (!filePath) {
      showToastSafe('Chưa chọn file để check.', 'warning');
      return;
    }
    try {
      const payload = await devtoolApi('/api/tools/dev/check', {
        method: 'POST',
        body: {
          path: filePath,
          content: (editor && editor.value) || ''
        }
      });
      const checker = payload && payload.data && payload.data.checker ? payload.data.checker : 'basic';
      logDevtool('Check OK [' + checker + ']: ' + filePath);
      showToastSafe('Check cú pháp OK', 'success');
    } catch (err) {
      logDevtool('Check lỗi: ' + err.message);
      showToastSafe(err.message || 'Check lỗi', 'error');
    }
  }

  async function saveCurrentFile() {
    const pathInput = byId('devtoolPathInput');
    const editor = byId('devtoolEditor');
    const filePath = String(pathInput && pathInput.value || '').trim();
    if (!filePath) {
      showToastSafe('Chưa chọn file để lưu.', 'warning');
      return;
    }

    try {
      const payload = await devtoolApi('/api/tools/dev/write', {
        method: 'PUT',
        body: {
          path: filePath,
          content: (editor && editor.value) || ''
        }
      });
      logDevtool('Đã lưu file: ' + (payload.data && payload.data.path ? payload.data.path : filePath));
      showToastSafe('Lưu file thành công', 'success');
      await loadFileTree();
    } catch (err) {
      logDevtool('Lưu lỗi: ' + err.message);
      showToastSafe(err.message || 'Không lưu được file', 'error');
    }
  }

  async function restartServer() {
    try {
      const payload = await devtoolApi('/api/tools/dev/restart', {
        method: 'POST'
      });
      const mode = payload && payload.data && payload.data.strategy ? payload.data.strategy : 'unknown';
      logDevtool('Đã gửi lệnh restart server (mode: ' + mode + ').');
      showToastSafe(payload.message || 'Đã gửi lệnh restart server', 'success');
    } catch (err) {
      logDevtool('Restart lỗi: ' + err.message);
      showToastSafe(err.message || 'Không thể restart server', 'error');
      throw err;
    }
  }

  async function saveAndRestart() {
    try {
      await saveCurrentFile();
      await restartServer();
    } catch (_) {
      // Error already handled in sub-steps.
    }
  }

  function markActiveTreeFile(pathValue) {
    const tree = byId('devtoolFileTree');
    if (!tree) return;
    tree.querySelectorAll('.devtool-tree-item.file').forEach(function (el) {
      const active = String(el.getAttribute('data-path') || '') === String(pathValue || '');
      el.classList.toggle('active', active);
    });
  }

  function bindEvents() {
    document.querySelectorAll('#devtoolPaneTabs .devtool-pane-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const pane = String(btn.getAttribute('data-pane') || 'files').trim().toLowerCase();
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
      const row = e.target.closest('.devtool-tree-item.file');
      if (!row) return;
      const filePath = String(row.getAttribute('data-path') || '').trim();
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
